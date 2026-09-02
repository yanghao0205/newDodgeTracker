import { get, subscribe } from "./utils/lcu.js";
import {
    LCU_CURRENT_SUMMONER,
    LCU_CHAMP_SELECT_SESSION,
    LCU_GAMEFLOW_PHASE,
    lcuSummonersByIds,
    lcuSummonerById,
    RIOT_CLIENT_CHAT_PARTICIPANTS,
    RIOT_CLIENT_CHAT_PARTICIPANTS_LEGACY,
} from "./utils/endpoints.js";
import { getChampionSelectChatInfo, postMessageToChat } from "./chatService";
import { createSettingsUi, createTabSettings } from "./uiSettings";
import { addButtonPostGame } from "./uiPostGame";
import { migrateDodgeListData } from './utils/dataMigration.js';
import { initLocale, t } from './utils/translations.js';
import { getTagDisplayLabel } from './utils/customTags.js';
import { isSummonerRevealEnabled, handleChampionSelectReveal, removeRevealSidebar, isPrintNamesEnabled } from './summonerReveal.js';

// 确保旧版和增强版躲避列表都存在
if (!DataStore.get('dodgelist')) DataStore.set('dodgelist', [])
if (!DataStore.get('dodgelist-enhanced')) DataStore.set('dodgelist-enhanced', [])

const delay = (t) => new Promise((r) => setTimeout(r, t))

let summoner;

// Unsubscribe handle for the gameflow-phase observer (set in init).
let _unobserveGameflow = null;

async function getSummonerName() {
    const data = await get(LCU_CURRENT_SUMMONER)
    return data.gameName + "#" + data.tagLine
}

/**
 * Match a dodge list entry against a player.
 * Returns WHICH path matched, so callers can log it and you can tell at a
 * glance whether a hit is rename-proof or not:
 *   'puuid' — matched on puuid (survives renames). Only tried when both the
 *             entry and the live player have a puuid.
 *   'name'  — legacy name#tag fallback (entry has no puuid yet, or the live
 *             player's puuid could not be resolved this session).
 *   null    — no match.
 */
function matchesPlayer(entry, fullName, puuid) {
    if (puuid && entry.puuid) {
        return entry.puuid === puuid ? 'puuid' : null;
    }
    // Legacy fallback: compare name#tag. Old migrated entries may have no tag.
    const entryName = entry.tag ? `${entry.name}#${entry.tag}` : entry.name;
    return entryName.toLowerCase() === fullName.toLowerCase() ? 'name' : null;
}

function isInMyTeam(players) {
    // 使用增强版躲避列表
    const enhancedDodgeList = DataStore.get('dodgelist-enhanced', []);
    // 返回完整的玩家对象和匹配的名称
    const targets = [];

    const withPuuid = enhancedDodgeList.filter(e => e.puuid).length;
    console.log(`[DodgeTracker] Dodge list: ${enhancedDodgeList.length} entries ` +
        `(${withPuuid} locked by puuid, ${enhancedDodgeList.length - withPuuid} name-only)`)

    let backfilled = false;
    players.forEach(p => {
        const name = `${p.gameName}#${p.tagLine}`;
        const puuid = p.puuid || null;
        const playerObj = enhancedDodgeList.find(player => matchesPlayer(player, name, puuid));

        if (playerObj) {
            const matchKind = matchesPlayer(playerObj, name, puuid);
            targets.push({
                fullName: name,
                playerData: playerObj,
                matchKind
            });

            // Auto-backfill: a legacy entry matched by name while we know the
            // player's puuid — persist it so future renames still match.
            if (puuid && !playerObj.puuid) {
                playerObj.puuid = puuid;
                backfilled = true;
                console.log(`[DodgeTracker] Match: ${name} -> name#tag ` +
                    `(puuid backfilled, next game will match by puuid)`)
            } else {
                console.log(`[DodgeTracker] Match: ${name} -> ${
                    matchKind === 'puuid' ? 'puuid (rename-proof)' : 'name#tag (no puuid available)'}`)
            }
        }
    });

    if (backfilled) {
        DataStore.set('dodgelist-enhanced', enhancedDodgeList);
    }

    return targets;
}

/**
 * Fetch summoner data by IDs with fallbacks.
 * Primary: batch v2 endpoint. Fallback: individual v1 endpoint per ID.
 */
async function getSummonersByIds(summonerIds) {
    // Primary: batch v2 endpoint
    try {
        const result = await get(lcuSummonersByIds(summonerIds))
        if (result && Array.isArray(result) && result.length > 0) {
            console.log('[DodgeTracker] getSummonersByIds: v2 batch succeeded')
            return result
        }
    } catch (error) {
        console.warn('[DodgeTracker] getSummonersByIds: v2 batch failed:', error.message)
    }

    // Fallback: fetch each summoner individually via v1 endpoint
    console.log('[DodgeTracker] getSummonersByIds: falling back to v1 individual lookups')
    const summoners = []
    for (const id of summonerIds) {
        try {
            const summoner = await get(lcuSummonerById(id))
            if (summoner) {
                summoners.push(summoner)
            }
        } catch (error) {
            console.warn(`[DodgeTracker] getSummonersByIds: v1 lookup failed for id ${id}:`, error.message)
        }
    }

    if (summoners.length > 0) {
        console.log('[DodgeTracker] getSummonersByIds: v1 individual lookups returned', summoners.length, 'results')
        return summoners
    }

    console.warn('[DodgeTracker] getSummonersByIds: all lookups failed')
    return null
}

/**
 * PRIMARY method: get players from the Riot Client chat participants API.
 *
 * Since Riot's champ-select anonymity patch, /lol-champ-select/v1/session
 * zeroes out teammate summonerIds in solo/duo queue — but the champ-select
 * chat room still lists every member's REAL Riot ID and puuid via
 * /riotclient/chat/v5/participants (the hole the standalone "Summoner Name
 * Reveal" plugin uses). Scope: own team only (the room is team-only).
 *
 * Tries single-slash first (correct for Pengu v1.2+), then the legacy
 * double-slash variant for older Pengu versions.
 * Returns [{ gameName, tagLine, puuid }] or null.
 */
async function playersFromChat() {
    const endpoints = [
        RIOT_CLIENT_CHAT_PARTICIPANTS,
        RIOT_CLIENT_CHAT_PARTICIPANTS_LEGACY
    ]

    for (const endpoint of endpoints) {
        try {
            const lobby = await get(endpoint)
            if (!lobby || !Array.isArray(lobby.participants)) {
                console.warn(`[DodgeTracker] playersFromChat: ${endpoint} returned null or no participants`)
                continue
            }

            const players = lobby.participants
                .filter(p => p.cid && p.cid.includes('champ-select'))
                .filter(p => p.game_name && p.puuid)
                .map(p => ({
                    gameName: p.game_name,
                    tagLine: p.game_tag,
                    puuid: p.puuid
                }))

            if (players.length > 0) {
                console.log('[DodgeTracker] playersFromChat (primary):',
                    players.map(p => `${p.gameName}#${p.tagLine}`), 'via', endpoint)
                return players
            }
        } catch (error) {
            console.warn(`[DodgeTracker] playersFromChat: ${endpoint} failed:`, error.message)
        }
    }

    console.warn('[DodgeTracker] playersFromChat: all endpoints failed')
    return null
}

/**
 * FALLBACK method: get players from the LCU champ-select session API.
 * Only works in queues WITHOUT champ-select anonymity (flex, normals) —
 * in solo/duo ranked the teammate summonerIds are zeroed server-side and
 * this returns null. Includes both myTeam and theirTeam when available.
 * Returns [{ gameName, tagLine, puuid }] or null.
 */
async function playersFromChampSelect() {
    let session
    try {
        session = await get(LCU_CHAMP_SELECT_SESSION)
    } catch (error) {
        console.error('[DodgeTracker] playersFromChampSelect: GET session failed:', error.message)
        return null
    }
    if (!session) {
        console.warn('[DodgeTracker] playersFromChampSelect: no champ select session')
        return null
    }

    // Collect summoner IDs from both teams (exclude empty slots)
    const allMembers = [
        ...(session.myTeam || []),
        ...(session.theirTeam || [])
    ]

    const summonerIds = allMembers
        .filter(member => member.summonerId && member.summonerId > 0)
        .map(member => member.summonerId)

    if (summonerIds.length === 0) {
        console.warn('[DodgeTracker] playersFromChampSelect: no valid summonerIds (anonymized queue?)')
        return null
    }

    console.log('[DodgeTracker] playersFromChampSelect: found', summonerIds.length, 'summoner IDs:', summonerIds)

    // Fetch summoner data to get game names and tags
    const summoners = await getSummonersByIds(summonerIds)

    if (!summoners || !Array.isArray(summoners)) {
        console.warn('[DodgeTracker] playersFromChampSelect: summoners fetch returned null')
        return null
    }

    const players = summoners
        .filter(s => s && s.gameName != null)
        .map(s => ({ gameName: s.gameName, tagLine: s.tagLine, puuid: s.puuid || null }))
    console.log('[DodgeTracker] playersFromChampSelect (fallback):',
        players.map(p => `${p.gameName}#${p.tagLine}`))
    return players
}

async function handleChampSelect() {
    try {
        console.log('[DodgeTracker] ChampSelect detected, polling for players & chat...')

        // Poll the chat participants API every 1s (primary player source),
        // proceed once the player count is stable and the chat room is ready.
        let players = null
        let chatInfo = null
        let lastPlayerCount = 0
        let stableCount = 0
        const maxWait = 20000
        const pollInterval = 1000
        let elapsed = 0

        while (elapsed < maxWait) {
            await delay(pollInterval)
            elapsed += pollInterval

            // Primary: real Riot IDs + puuids from the champ-select chat room
            const result = await playersFromChat()
            if (result && result.length > 0) {
                // Track if player count has stabilized (late joiners enter
                // the room one by one during the first few seconds)
                if (result.length === lastPlayerCount) {
                    stableCount++
                } else {
                    stableCount = 0
                }
                lastPlayerCount = result.length
                players = result

                // Also try to get chat info
                if (!chatInfo) {
                    chatInfo = await getChampionSelectChatInfo()
                }

                // Proceed once the count held steady for 3 consecutive
                // polls and chat is ready
                if (stableCount >= 2 && chatInfo) {
                    console.log(`[DodgeTracker] Ready after ${elapsed}ms — ${result.length} players, chat OK`)
                    break
                }
            }
        }

        // Fallback: champ-select session (non-anonymized queues only)
        if (!players || players.length === 0) {
            console.log('[DodgeTracker] Chat participants method timed out, trying champ-select session fallback...')
            players = await playersFromChampSelect()
        }

        if (!players || players.length === 0) {
            console.error('[DodgeTracker] Could not get player list from either method')
            return
        }

        console.log('[DodgeTracker] Players in lobby:', players.map(p => `${p.gameName}#${p.tagLine}`))

        // Retry chat info if not yet obtained
        if (!chatInfo) {
            chatInfo = await getChampionSelectChatInfo()
        }

        if (!chatInfo) {
            console.error('[DodgeTracker] Could not get champion select chat info, cannot post messages')
            return
        }

        // --- Summoner Reveal (eye icon sidebar) ---
        // Fire and forget — don't block DodgeTracker alerts.
        // players already carry real names + puuids, no summoner lookup needed.
        if (isSummonerRevealEnabled()) {
            console.log('[DodgeTracker] Summoner Reveal enabled, starting sidebar...')
            handleChampionSelectReveal(players, chatInfo)
        }

        // --- Print player names to chat (optional) ---
        // Names only (gameName#tagLine), one message per player, like the
        // standalone Summoner Name Reveal did — but without stats.
        if (isPrintNamesEnabled()) {
            console.log('[DodgeTracker] Print-names enabled, posting', players.length, 'names to chat...')
            for (const p of players) {
                await postMessageToChat(chatInfo.id, `${p.gameName}#${p.tagLine}`)
            }
        }

        // --- DodgeTracker alerts ---
        // players carry puuid directly, so matching is rename-proof
        const list = isInMyTeam(players)

        if (list.length === 0) {
            console.log('[DodgeTracker] No dodged players detected in this team')
            postMessageToChat(chatInfo.id, `DodgeTracker: ${t('noPlayersDetected')}`)
            return
        }

        console.log(`[DodgeTracker] Detected ${list.length} dodged player(s): ` +
            list.map(p => `${p.fullName} [${p.matchKind === 'puuid' ? 'puuid' : 'name#tag'}]`).join(', '))

        for (const player of list) {
            // 获取标签和备注信息
            const tags = player.playerData.tags || [];
            const note = player.playerData.note || '';

            // 格式化标签（动态获取标签显示名称，支持自定义标签）
            const tagsText = tags.length > 0
                ? `[${t('tagsLabel', tags.map(tag => getTagDisplayLabel(tag)).join(', '))}]`
                : '';

            // 格式化备注
            const noteText = note ? `[${t('noteLabel', note)}]` : '';

            // 组合信息
            const infoText = [tagsText, noteText].filter(text => text).join(' ');

            // 发送消息
            console.log(`[DodgeTracker] Posting alert for: ${player.fullName} ` +
                `[matched by ${player.matchKind === 'puuid' ? 'puuid' : 'name#tag'}]`)
            postMessageToChat(chatInfo.id, `DodgeTracker: ${t('playerDetected', player.fullName, infoText)}`);
        }
    } catch (error) {
        console.error('[DodgeTracker] Error in ChampSelect handler:', error)
    }
}

export function init(context) {
    // Initialize locale based on client language
    initLocale();

    migrateDodgeListData()
    createTabSettings(context)
    addButtonPostGame(context)

    // Check if context.socket is available
    if (!context || !context.socket) {
        console.error('[DodgeTracker] init: context.socket is not available! Champ select detection will not work.')
        return
    }

    console.log('[DodgeTracker] init: socket observer registered for', LCU_GAMEFLOW_PHASE)

    _unobserveGameflow = subscribe(context.socket, LCU_GAMEFLOW_PHASE, async (data) => {
        const phase = data?.data
        console.log('[DodgeTracker] gameflow phase changed:', phase)

        // Clean up Summoner Reveal sidebar when leaving champ select
        if (phase !== "ChampSelect") {
            removeRevealSidebar()
        }

        if (phase == "ChampSelect") {
            await handleChampSelect()
        }
    })
}

export async function load() {
    // Initialize locale as early as possible
    await initLocale();

    try {
        summoner = await getSummonerName()
    } catch (error) {
        console.error('[DodgeTracker] load: failed to fetch current summoner:', error.message)
    }

    createSettingsUi()

    let css = new URL('./icon.css', import.meta.url).href
    let link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', css);
    document.body.appendChild(link)
    console.log('[DodgeTracker] Plugin loaded successfully')
}

// Cleanup for hot-reload / plugin disable: unsubscribe from the gameflow
// observer so re-initializing doesn't stack duplicate callbacks.
export function unload() {
    if (_unobserveGameflow) {
        _unobserveGameflow()
        _unobserveGameflow = null
        console.log('[DodgeTracker] unload: gameflow observer removed')
    }
    removeRevealSidebar()
}
