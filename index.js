import { observeQueue, create } from "./tracker";
import { getChampionSelectChatInfo, postMessageToChat } from "./chatService";
import { createSettingsUi, createTabSettings } from "./uiSettings";
import { addButtonPostGame } from "./uiPostGame";
import { migrateDodgeListData } from './utils/dataMigration.js';
import { initLocale, t } from './utils/translations.js';
import { getTagDisplayLabel } from './utils/customTags.js';
import { isSummonerRevealEnabled, handleChampionSelectReveal, removeRevealSidebar } from './summonerReveal.js';

// 确保旧版和增强版躲避列表都存在
if (!DataStore.get('dodgelist')) DataStore.set('dodgelist', [])
if (!DataStore.get('dodgelist-enhanced')) DataStore.set('dodgelist-enhanced', [])
 
const delay = (t) => new Promise((r) => setTimeout(r, t))

let summoner;

async function getSummonerName() {
    const res = await fetch('/lol-summoner/v1/current-summoner')
    const data = await res.json()

    return data.gameName + "#" + data.tagLine
}

function isInMyTeam(currentQueue) {
    // 使用增强版躲避列表
    const enhancedDodgeList = DataStore.get('dodgelist-enhanced', []);
    // 返回完整的玩家对象和匹配的名称
    const targets = [];
    
    currentQueue.forEach(name => {
        const lowerName = name.toLowerCase();
        const playerObj = enhancedDodgeList.find(player => 
            (player.name + "#" + player.tag).toLowerCase() === lowerName
        );
        
        if (playerObj) {
            targets.push({
                fullName: name,
                playerData: playerObj
            });
        }
    });
    
    return targets;
}

/**
 * Fetch summoner data by IDs with fallbacks.
 * Primary: batch v2 endpoint. Fallback: individual v1 endpoint per ID.
 */
async function getSummonersByIds(summonerIds) {
    // Primary: batch v2 endpoint
    try {
        const idsParam = summonerIds.join(',')
        const result = await create("get", `/lol-summoner/v2/summoners?ids=${idsParam}`)
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
            const summoner = await create("get", `/lol-summoner/v1/summoners/${id}`)
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
 * PRIMARY method: get players from LCU Champ Select session API
 * Works on all Pengu Loader versions (uses standard /lol- endpoints)
 * Includes both myTeam and theirTeam
 * Returns { names: [...], summoners: [...] } or null
 */
async function playersFromChampSelect() {
    try {
        const session = await create("get", "/lol-champ-select/v1/session")
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
            console.warn('[DodgeTracker] playersFromChampSelect: no valid summonerIds found in myTeam or theirTeam')
            return null
        }

        console.log('[DodgeTracker] playersFromChampSelect: found', summonerIds.length, 'summoner IDs:', summonerIds)

        // Fetch summoner data to get game names and tags
        const summoners = await getSummonersByIds(summonerIds)

        if (!summoners || !Array.isArray(summoners)) {
            console.warn('[DodgeTracker] playersFromChampSelect: summoners fetch returned null')
            return null
        }

        const names = summoners.map(s => s.gameName + "#" + s.tagLine)
        console.log('[DodgeTracker] playersFromChampSelect (primary):', names)
        return { names, summoners }
    } catch (error) {
        console.error('[DodgeTracker] playersFromChampSelect error:', error)
        return null
    }
}

/**
 * SECONDARY method: get players from Riot Client chat API
 * Tries both // and / prefix since Pengu v1.2 may not route //riotclient/ URLs
 */
async function playersInLobby(){
    // Try both URL formats — Pengu v1.2 may not handle the // prefix
    const endpoints = [
        "/riotclient/chat/v5/participants",
        "//riotclient/chat/v5/participants"
    ]

    for (const endpoint of endpoints) {
        try {
            console.log('[DodgeTracker] playersInLobby: trying', endpoint)
            const lobby = await create("get", endpoint)
            if (!lobby || !lobby.participants) {
                console.warn(`[DodgeTracker] playersInLobby: ${endpoint} returned null or no participants`)
                continue
            }

            const participants = lobby.participants.filter(participant => participant.cid.includes('champ-select'))

            const names = []
            for (const player of participants) { 
                names.push(player.game_name + "#" + player.game_tag)
            }
            if (names.length > 0) {
                console.log('[DodgeTracker] playersInLobby (secondary):', names, 'via', endpoint)
                return names
            }
        } catch (error) {
            console.warn(`[DodgeTracker] playersInLobby: ${endpoint} failed:`, error.message)
        }
    }

    console.warn('[DodgeTracker] playersInLobby: all endpoints failed')
    return null
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

    console.log('[DodgeTracker] init: socket observer registered for /lol-gameflow/v1/gameflow-phase')

    context.socket.observe('/lol-gameflow/v1/gameflow-phase', async (data) => {
        const phase = data?.data
        console.log('[DodgeTracker] gameflow phase changed:', phase)

        // Clean up Summoner Reveal sidebar when leaving champ select
        if (phase !== "ChampSelect") {
            removeRevealSidebar()
        }

        if(phase == "ChampSelect") {
            try {
                console.log('[DodgeTracker] ChampSelect detected, polling for players & chat...')

                // Poll every 1s instead of fixed 20s delay
                // Proceed as soon as both players and chat are ready
                let players = null
                let champSelectSummoners = null
                let chatInfo = null
                let lastPlayerCount = 0
                let stableCount = 0
                const maxWait = 20000
                const pollInterval = 1000
                let elapsed = 0

                while (elapsed < maxWait) {
                    await delay(pollInterval)
                    elapsed += pollInterval

                    // Try to get players from champ select session
                    const result = await playersFromChampSelect()
                    if (result && result.names && result.names.length > 0) {
                        // Track if player count has stabilized
                        if (result.names.length === lastPlayerCount) {
                            stableCount++
                        } else {
                            stableCount = 0
                        }
                        lastPlayerCount = result.names.length
                        players = result.names
                        champSelectSummoners = result.summoners

                        // Also try to get chat info
                        if (!chatInfo) {
                            chatInfo = await getChampionSelectChatInfo()
                        }

                        // Proceed once players are stable (2 consecutive same counts) and chat is ready
                        if (stableCount >= 1 && chatInfo) {
                            console.log(`[DodgeTracker] Ready after ${elapsed}ms — ${result.names.length} players, chat OK`)
                            break
                        }
                    }
                }

                // Fallback: try secondary method if primary never got players
                if (!players || players.length === 0) {
                    console.log('[DodgeTracker] Primary method timed out, trying secondary (chat API)...')
                    players = await playersInLobby()
                }

                if (!players || players.length === 0) {
                    console.error('[DodgeTracker] Could not get player list from either method')
                    return
                }

                console.log('[DodgeTracker] Players in lobby:', players)

                // Retry chat info if not yet obtained
                if (!chatInfo) {
                    chatInfo = await getChampionSelectChatInfo()
                }

                if (!chatInfo) {
                    console.error('[DodgeTracker] Could not get champion select chat info, cannot post messages')
                    return
                }

                // --- Summoner Reveal (eye icon sidebar) ---
                // Fire and forget — don't block DodgeTracker alerts
                if (isSummonerRevealEnabled() && champSelectSummoners) {
                    console.log('[DodgeTracker] Summoner Reveal enabled, starting sidebar...')
                    handleChampionSelectReveal(champSelectSummoners, chatInfo)
                }

                // --- DodgeTracker alerts ---
                const list = isInMyTeam(players)

                if (list.length === 0) {
                    console.log('[DodgeTracker] No dodged players detected in this team')
                    postMessageToChat(chatInfo.id, `DodgeTracker: ${t('noPlayersDetected')}`)
                    return
                }

                console.log(`[DodgeTracker] Detected ${list.length} dodged player(s) in team`)

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
                    console.log(`[DodgeTracker] Posting alert for: ${player.fullName}`)
                    postMessageToChat(chatInfo.id, `DodgeTracker: ${t('playerDetected', player.fullName, infoText)}`);
                }
            } catch (error) {
                console.error('[DodgeTracker] Error in ChampSelect handler:', error)
            }
         }
    })
}

export async function load() {
    // Initialize locale as early as possible
    await initLocale();
    
    summoner = await getSummonerName()
    
    createSettingsUi()

    let css = new URL('./icon.css', import.meta.url).href
    let link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', css);
    document.body.appendChild(link)
    console.log('[DodgeTracker] Plugin loaded successfully')
}
