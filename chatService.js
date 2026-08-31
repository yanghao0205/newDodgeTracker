//CHAT SERVICE BY @dakota1337x
// (refactored: transport moved to utils/lcu.js, endpoints to utils/endpoints.js)

// Importing other modules
import { get, post } from './utils/lcu.js';
import { LCU_CHAT_CONVERSATIONS, lcuChatMessages } from './utils/endpoints.js';

/**
 * Retrieves information about the champion select chat.
 * @returns {Object|null} - The chat information object or null if not found.
 */
async function getChampionSelectChatInfo() {
    let conversations;
    try {
        conversations = await get(LCU_CHAT_CONVERSATIONS);
    } catch (error) {
        console.error('[DodgeTracker] getChampionSelectChatInfo: GET conversations failed:', error.message);
        return null;
    }

    if (!conversations || !Array.isArray(conversations)) {
        console.error('[DodgeTracker] getChampionSelectChatInfo: /lol-chat/v1/conversations returned null or non-array');
        return null;
    }

    // Try exact type match first
    let chat = conversations.find(item => item.type === 'championSelect');

    // Fallback: look for any conversation with "champ" in the type
    if (!chat) {
        chat = conversations.find(item => item.type && item.type.toLowerCase().includes('champ'));
        if (chat) {
            console.log('[DodgeTracker] getChampionSelectChatInfo: found chat via fallback type:', chat.type);
        }
    }

    if (!chat) {
        // Not an error: during the 1s poll loop this is the normal state for
        // the first few ticks — the champ-select room has not been created yet.
        console.warn('[DodgeTracker] getChampionSelectChatInfo: champ select conversation not created yet. Available types:', conversations.map(c => c.type));
    }

    return chat;
}

/**
 * Posts a message to a specified chat.
 * Tries multiple message types in case one is restricted.
 * @param {string} chatId - The ID of the chat.
 * @param {string} message - The message to be posted.
 */
async function postMessageToChat(chatId, message) {
    if (!chatId) {
        console.error('[DodgeTracker] postMessageToChat: chatId is null or undefined');
        return false;
    }

    // Try different message types — "celebration" may be restricted in newer patches
    const messageTypes = ["celebration", "groupchat", "chat"];

    for (const type of messageTypes) {
        const action = {
            body: message,
            type: type
        };
        try {
            await post(lcuChatMessages(chatId), action);
            console.log(`[DodgeTracker] Message posted successfully with type "${type}"`);
            return true;
        } catch (error) {
            console.warn(`[DodgeTracker] postMessageToChat with type "${type}" failed (${error.message}), trying next...`);
        }
    }

    console.error('[DodgeTracker] postMessageToChat: all message types failed');
    return false;
}

/**
 * Retrieves messages from a specified chat.
 * @param {string} chatId - The ID of the chat.
 */
async function getMessageFromChat(chatId) {
    try {
        return await get(lcuChatMessages(chatId));
    } catch (error) {
        console.error(`[DodgeTracker] Error getting messages from chat ${chatId}:`, error.message);
        return null;
    }
}

export { getChampionSelectChatInfo, postMessageToChat, getMessageFromChat };
