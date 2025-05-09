import { observeQueue, create } from "./tracker";
import { getChampionSelectChatInfo, postMessageToChat } from "./chatService";
import { createSettingsUi, createTabSettings } from "./uiSettings";
import { addButtonPostGame } from "./uiPostGame";
import { migrateDodgeListData } from './utils/dataMigration.js';
import { initLocale, t } from './utils/translations.js';

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

async function playersInLobby(){

    // Funfact: Se o cara tiver net movida à lenha, não vai puxar aqui pq ele ainda não vai ter conectado.
    const lobby = await create("get", "//riotclient/chat/v5/participants")
    const participants = lobby.participants.filter(participant => participant.cid.includes('champ-select'));

    const names = []

    for (const player of participants) { 
        names.push(player.game_name + "#" + player.game_tag)
    }

    return names
}

export function init(context) {
    // Initialize locale based on client language
    initLocale();
    
    migrateDodgeListData();
    createTabSettings(context)
    addButtonPostGame(context)

    context.socket.observe('/lol-gameflow/v1/gameflow-phase', async (data) => {
        if(data.data == "ChampSelect") {
            await delay(10000)
    
            const players = await playersInLobby()
            const names = players // 包含所有玩家，包括自己
    
            const list = isInMyTeam(names)
    
            const chatInfo = await getChampionSelectChatInfo();
    
            if (list.length === 0) return postMessageToChat(chatInfo.id, `DodgeTracker: ${t('noPlayersDetected')}`)
    
            for (const player of list) {
                // 获取标签和备注信息
                const tags = player.playerData.tags || [];
                const note = player.playerData.note || '';
                
                // 标签映射（英文到中文）
                const tagLabels = {
                    'toxic': '有毒',
                    'afk': '挂机',
                    'troll': '捣乱',
                    'unskilled': '技术差',
                    'mykiller': '坑我'
                };
                
                // 格式化标签（转换为中文）
                const tagsText = tags.length > 0 
                    ? `[${t('tagsLabel', tags.map(tag => t(tag)).join(', '))}]` 
                    : '';
                
                // 格式化备注
                const noteText = note ? `[${t('noteLabel', note)}]` : '';
                
                // 组合信息
                const infoText = [tagsText, noteText].filter(text => text).join(' ');
                
                // 发送消息
                postMessageToChat(chatInfo.id, `DodgeTracker: ${t('playerDetected', player.fullName, infoText)}`);
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
}