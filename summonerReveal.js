// Summoner Reveal module — integrated into DodgeTracker
// Originally from "Summoner Name Reveal" plugin by @dakota1337x
// Shows player stats (rank, winrate, KDA) in a sidebar during champ select

import { get, post } from './utils/lcu.js';
import {
    lcuMatchHistory,
    lcuRankedStats,
    lcuChatMessages,
    LCU_REGION_LOCALE,
} from './utils/endpoints.js';

// ─── Eye Icon (base64 PNG) ───
const EYE_ICON_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC/0lEQVRoge1ZXW4TQQz++DnASlwgEgcgCgdoIp4RlXgGAhxgA30GQnkGMgcABThAi/qMBg7AqhygUi9QKRdAQlO8qdfrnZndbLUE7SdVqRTP2J/tGXucKwCuYoux1cajJ/APoCfQNXoCXeN6S/oTADsAhpk1L32Co0m6D+AYwA8Aq00Vb1rIHmXWfNzEgNEkfQLgU9P1TQm8Cnm6Ligyry+bwDiz5lvVl6NJ+obSY8U+QSk2zD8za1549rgD4HvrBDJrflco3AOwbJDPAwC7mTVvlT0/A3gcs0kMgSSz5kxR8pQMbwPTzJoPio4bIceECLhw/xSbfgEwi/D4DqUN2K3jg0uvRWbNA6HvNq2vTWCQWXMiNgt5vbRGYjRJbwI49YjMZFr5IlFlfKIYfz9gfBoyHn/PkpNJPSILchRfc0YRKkGNgDywoTBWeO2IrXGpeFd87w7/wrOnlr7XYggUjIkIeSFtyPCpEnLnwSUnErF3gYRGWhIILpDg0SLjd33yAA4FiZJXBea8bshsKHhfhixkvIJpSzIcc5+NnMCYf0HhDWHM5I8ii9mKZFW9Gsjr0NasCfAWgVLHl5s5hux/3yGX4LLDmvIFW/+fBw01UeegW2gQsb6uJzXZmMgV9ua28ggUOsCYosTX0M2iFhuBRNSEYOepXC7rNYUUUg7LLMIgrqjU9DWRESjcQtJGeQaO6QDnBgVTSd5WVBe0SCRKhQ/ddENRA/ZkymmHuHD3Uyr58vuUk8ZFJA7cy43+DqTnqd+JrsKabfB0o6U3ADVzhx6FpX6oChFdbel9UNWR1m2nnwMwHsVttNOuq30XY3yIACo6QvfcexZRdcfiQRO6bdy5eZ9Z81Doa/ygWW9c8aTcaBwioI5n2nhScizlcw8XafU1svXgcLfbPZkubN9Ql3qOtscq+2yc8kuMVW6xsUrlTOnSxioCc99spylivd4GgRzqOKQONh3PtPUjX5LfOqHIsOmdS5POh7udo/+Bo2v0BLpGT6Br9AS6xnYTAPAHGIlWc8/z3roAAAAASUVORK5CYII=";

// ─── Settings helpers ───
export function isSummonerRevealEnabled() {
    return DataStore.get('dodgelist-summoner-reveal', false);
}

export function setSummonerRevealEnabled(enabled) {
    DataStore.set('dodgelist-summoner-reveal', enabled);
}

// Print-names toggle: post every detected player's Riot ID to the champ
// select chat (names only, no stats) — independent from the sidebar above.
export function isPrintNamesEnabled() {
    return DataStore.get('dodgelist-print-names', false);
}

export function setPrintNamesEnabled(enabled) {
    DataStore.set('dodgelist-print-names', enabled);
}

// ─── Helper: Roman numeral to number ───
function romanToNumber(roman) {
    const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let result = 0, prev = 0;
    for (let i = roman.length - 1; i >= 0; i--) {
        const val = map[roman[i]];
        result += val < prev ? -val : val;
        prev = val;
    }
    return result;
}

// ─── Helper: Sum array elements ───
function sumArrayElements(arr) {
    if (!Array.isArray(arr)) {
        console.error('[DodgeTracker-SR] Expected an array, received:', arr);
        return 0;
    }
    return arr.reduce((a, b) => a + b, 0);
}

// ─── Match History ───
async function queryMatch(puuid, begIndex = 0, endIndex = 21) {
    try {
        const data = await get(lcuMatchHistory(puuid, begIndex, endIndex));
        if (!data || !data.games || !data.games.games) return false;
        const games = data.games.games;
        return Array.isArray(games) ? extractMatchData(games) : false;
    } catch (error) {
        console.error('[DodgeTracker-SR] Error querying match for puuid:', puuid, error);
        return false;
    }
}

function extractMatchData(games) {
    const stats = {
        gameMode: [], championId: [], killList: [], deathsList: [], assistsList: [],
        Minions: [], gold: [], winList: [], causedEarlySurrenderList: [],
        laneList: [], spell1Id: [], spell2Id: [], items: [], types: []
    };
    games.forEach(game => {
        const p = game.participants[0];
        stats.gameMode.push(game.queueId);
        stats.championId.push(p.championId);
        stats.killList.push(p.stats.kills);
        stats.deathsList.push(p.stats.deaths);
        stats.assistsList.push(p.stats.assists);
        stats.Minions.push(p.stats.neutralMinionsKilled + p.stats.totalMinionsKilled);
        stats.gold.push(p.stats.goldEarned);
        stats.winList.push(p.stats.win ? "true" : "false");
        stats.causedEarlySurrenderList.push(p.stats.causedEarlySurrender);
        stats.laneList.push(p.timeline.lane);
        stats.spell1Id.push(p.spell1Id);
        stats.spell2Id.push(p.spell2Id);
        const items = [];
        for (let i = 0; i < 7; i++) {
            items.push(p.stats["item" + i]);
        }
        stats.items.push(items);
        stats.types.push(game.gameType);
    });
    return stats;
}

async function getMatchDataForPuuids(puuids) {
    try {
        return await Promise.all(puuids.map(p => queryMatch(p, 0, 21)));
    } catch (error) {
        console.error('[DodgeTracker-SR] Error fetching match data:', error);
        return [];
    }
}

// ─── Ranked Stats ───
async function fetchRankedStats(puuid) {
    try {
        return await get(lcuRankedStats(puuid));
    } catch (error) {
        console.error('[DodgeTracker-SR] Error fetching ranked stats for puuid:', puuid, error);
        return null;
    }
}

async function getRankedStatsForPuuids(puuids) {
    try {
        const results = await Promise.all(puuids.map(fetchRankedStats));
        return results.map(extractSimplifiedStats);
    } catch (error) {
        console.error('[DodgeTracker-SR] Error fetching ranked stats:', error);
        return [];
    }
}

function extractSimplifiedStats(stats) {
    if (!stats || !stats.queueMap) return "Unranked";
    return determineRank(stats.queueMap.RANKED_SOLO_5x5, stats.queueMap.RANKED_FLEX_SR);
}

function determineRank(solo, flex) {
    if (isValidRank(solo)) return formatRank(solo);
    if (isValidRank(flex)) return formatRank(flex);
    return "Unranked";
}

function isValidRank(rank) {
    return rank && rank.tier && rank.division && rank.tier !== "NA" && !rank.isProvisional;
}

function formatRank(rank) {
    const tierShort = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD", "DIAMOND"];
    if (tierShort.includes(rank.tier)) {
        return `${rank.tier[0]}${romanToNumber(rank.division)}`;
    }
    return rank.tier;
}

// ─── Stats Calculations ───
function calculateWinRate(winList) {
    if (!winList || winList.length === 0) return "N/A";
    const wins = winList.filter(w => w === "true").length;
    return `${Math.round(wins / winList.length * 100)}%`;
}

function mostCommonRole(laneList) {
    if (!laneList) return "N/A";
    const counts = laneList.reduce((acc, lane) => { acc[lane] = (acc[lane] || 0) + 1; return acc; }, {});
    let max = 0, roles = [];
    for (const lane in counts) {
        if (counts[lane] > max) { roles = [lane]; max = counts[lane]; }
        else if (counts[lane] === max) roles.push(lane);
    }
    if (roles.includes("NA") || roles.includes("NONE") || roles.includes("")) return "N/A";
    return roles.join("/");
}

function calculateKDA(kills, assists, deaths) {
    const k = sumArrayElements(kills.map(x => typeof x === "string" ? x.split(",").map(Number) : [x]).flat());
    const a = sumArrayElements(assists.map(x => typeof x === "string" ? x.split(",").map(Number) : [x]).flat());
    const d = sumArrayElements(deaths.map(x => typeof x === "string" ? x.split(",").map(Number) : [x]).flat());
    return d === 0 ? "PERFECT" : `${((k + a) / d).toFixed(2)} KDA`;
}

// ─── Player Data Formatting ───
function formatPlayerData(player, rank, matchData) {
    const winRate = calculateWinRate(matchData.winList);
    const role = mostCommonRole(matchData.laneList);
    const kda = calculateKDA(matchData.killList, matchData.assistsList, matchData.deathsList);
    return `${player.gameName} - ${rank} - ${winRate} - ${role} - ${kda}`;
}

function formatPlayerDataSidebar(player, rank, matchData) {
    const winRate = calculateWinRate(matchData.winList);
    const role = mostCommonRole(matchData.laneList);
    const kda = calculateKDA(matchData.killList, matchData.assistsList, matchData.deathsList);
    return `${player.gameName} #${player.tagLine} - ${rank} - ${winRate} - ${role} - ${kda}`;
}

// ─── Chat messaging ───
async function postStatsToChat(chatId, messages) {
    for (const msg of messages) {
        try {
            await post(lcuChatMessages(chatId), {
                body: msg, type: "celebration"
            });
        } catch (error) {
            console.error('[DodgeTracker-SR] Error posting stats to chat:', error);
        }
    }
}

// ─── UI: Sidebar & Eye Icon Button ───
let _revealObserver = null;
const SR_BUTTON_CLASS = 'summoner-name-reveal-button';
const SR_SIDEBAR_ID = 'infoSidebar';
const SR_STYLE_ID = 'summoner-reveal-style';

function createRevealPopup() {
    // Remove existing elements if any
    removeRevealSidebar();

    // Create sidebar
    const sidebarHtml = `<div id="${SR_SIDEBAR_ID}" style="z-index: 9999; position: fixed; top: 0; left: 0; width: 282px; height: 100%; background-color: #1e2328; padding: 20px; border-right: 1px solid #C8A660; box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2); color: white; display: none; overflow-y: auto; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;"><div id="sidebarContent">Loading... <br> This may take a few seconds.</div></div>`;
    document.body.insertAdjacentHTML("beforeend", sidebarHtml);

    // Add styles for eye icon button
    let style = document.createElement('style');
    style.id = SR_STYLE_ID;
    style.textContent = `
        .${SR_BUTTON_CLASS} {
            border: 0; outline: 0; padding: 0; background-color: transparent;
            cursor: pointer; margin-right: 10px; pointer-events: auto;
            width: 32px; height: 32px; background-size: contain; left: 0px;
            border: 2px solid #C8A660; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            background-color: #1e2328;
            box-sizing: border-box;
        }
        .${SR_BUTTON_CLASS}:hover { filter: brightness(1.2); }
        .${SR_BUTTON_CLASS}:active { filter: brightness(0.8); }
        .summoner-name-reveal-icon {
            height: 20px; width: 20px; background-size: contain;
            background-repeat: no-repeat; background-position: center;
            background-image: url(${EYE_ICON_BASE64});
            box-sizing: border-box;
        }
        .summoner-name-reveal-icon:hover { filter: brightness(1.6); }
        .summoner-name-reveal-icon:active { filter: brightness(0.7); }
    `;
    document.head.appendChild(style);

    // Create eye icon button
    function createButton() {
        const button = document.createElement("button");
        const div = document.createElement("div");
        button.className = SR_BUTTON_CLASS;
        div.className = "summoner-name-reveal-icon";
        button.appendChild(div);
        button.addEventListener("click", toggleSidebar);
        return button;
    }

    function hasButton() {
        return document.querySelectorAll(`.${SR_BUTTON_CLASS}`).length > 0;
    }

    function addButtonToControls() {
        // Don't re-add if feature has been disabled
        if (!isSummonerRevealEnabled()) return;
        const container = document.querySelector(".loadout-edit-controls > .loadout-edit-controls-row");
        if (container && !hasButton()) {
            container.prepend(createButton());
        }
    }

    // Try immediately, then observe DOM for late render
    const container = document.querySelector(".loadout-edit-controls > .loadout-edit-controls-row");
    if (container) {
        addButtonToControls();
    }
    // Always set up observer (container might appear/reappear during champ select)
    _revealObserver = new MutationObserver(() => {
        if (!isSummonerRevealEnabled()) return;
        const c = document.querySelector(".loadout-edit-controls > .loadout-edit-controls-row");
        if (c && !hasButton()) {
            addButtonToControls();
        }
    });
    _revealObserver.observe(document.body, { childList: true, subtree: true });

    console.log('[DodgeTracker-SR] Popup created (eye icon + sidebar)');
}

function toggleSidebar() {
    const sidebar = document.getElementById(SR_SIDEBAR_ID);
    if (sidebar) {
        sidebar.style.display = sidebar.style.display === "none" ? "block" : "none";
    }
}

function populateSidebarContent(playerLines, linksHtml) {
    const content = document.getElementById("sidebarContent");
    if (!content) return;
    const linesHtml = `<p style="font-size: 12px">${playerLines.join("<br>")}</p>`;
    content.innerHTML = linesHtml + linksHtml +
        '<p style="font-size: 10px">Powered by DodgeTracker — Summoner Reveal</p>';
}

export function removeRevealSidebar() {
    // Disconnect the observer so it doesn't re-add the button
    if (_revealObserver) {
        _revealObserver.disconnect();
        _revealObserver = null;
    }
    const sidebar = document.getElementById(SR_SIDEBAR_ID);
    if (sidebar) sidebar.remove();
    // Remove all eye icon buttons (including any duplicates)
    document.querySelectorAll(`.${SR_BUTTON_CLASS}`).forEach(btn => btn.remove());
    const style = document.getElementById(SR_STYLE_ID);
    if (style) style.remove();
}

// ─── Main handler: called from index.js during ChampSelect ───
// summoners: array of { gameName, tagLine, puuid, ... } from /lol-summoner/v1/summoners/{id}
// chatInfo: chat conversation object from /lol-chat/v1/conversations
export async function handleChampionSelectReveal(summoners, chatInfo) {
    try {
        console.log('[DodgeTracker-SR] handleChampionSelectReveal: starting with', summoners.length, 'players');

        // Create popup (eye icon + sidebar)
        createRevealPopup();

        // Extract puuids
        const puuids = summoners.map(s => s.puuid).filter(p => p);
        if (puuids.length === 0) {
            console.warn('[DodgeTracker-SR] No puuids found in summoner data');
            return;
        }

        // Get region for OP.GG / Porofessor links
        let region = 'na';
        try {
            const regionData = await get(LCU_REGION_LOCALE);
            if (regionData && regionData.webRegion) region = regionData.webRegion;
        } catch (e) {
            console.warn('[DodgeTracker-SR] Could not get region, defaulting to na');
        }

        // Fetch match history and ranked stats in parallel
        console.log('[DodgeTracker-SR] Fetching match history and ranked stats for', puuids.length, 'puuids...');
        const [matchData, rankedStats] = await Promise.all([
            getMatchDataForPuuids(puuids),
            getRankedStatsForPuuids(puuids)
        ]);

        // Format player data for chat and sidebar
        const chatMessages = summoners.map((s, i) =>
            formatPlayerData(s, rankedStats[i], matchData[i] || { winList: [], laneList: [], killList: [], assistsList: [], deathsList: [] })
        );
        const sidebarLines = summoners.map((s, i) =>
            formatPlayerDataSidebar(s, rankedStats[i], matchData[i] || { winList: [], laneList: [], killList: [], assistsList: [], deathsList: [] })
        );

        // Post stats to chat
        if (chatInfo && chatInfo.id) {
            console.log('[DodgeTracker-SR] Posting player stats to chat...');
            await postStatsToChat(chatInfo.id, chatMessages);
        }

        // Build OP.GG / Porofessor links
        const opggNames = summoners.map(s => encodeURIComponent(`${s.gameName}#${s.tagLine}`)).join("%2C");
        const poroNames = summoners.map(s => encodeURIComponent(`${s.gameName}#${s.tagLine}`)).join(",");
        const opggLink = `https://www.op.gg/multisearch/${region}?summoners=${opggNames}`;
        const poroLink = `https://porofessor.gg/pregame/${region}/${poroNames}`;
        const linksHtml = `<p style="font-size: 12px"><a href="${opggLink}" target="_blank" style="color: gold;">View on OP.GG</a><br><a href="${poroLink}" target="_blank" style="color: gold;">View on Porofessor.gg</a></p>`;

        // Populate sidebar
        populateSidebarContent(sidebarLines, linksHtml);
        console.log('[DodgeTracker-SR] Sidebar populated successfully');
    } catch (error) {
        console.error('[DodgeTracker-SR] Error in handleChampionSelectReveal:', error);
    }
}
