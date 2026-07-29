//CHAT SERVICE BY @dakota1337x

// Importing other modules
import { create } from './tracker';

/**
 * Retrieves information about the champion select chat.
 * @returns {Object|null} - The chat information object or null if not found.
 */
async function getChampionSelectChatInfo() {
    try {
        const conversations = await create('GET', '/lol-chat/v1/conversations');
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
            console.error('[DodgeTracker] getChampionSelectChatInfo: no champion select conversation found. Available types:', conversations.map(c => c.type));
        }

        return chat;
    } catch (error) {
        console.error('[DodgeTracker] Error fetching champion select chat info:', error);
        return null;
    }
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
        const result = await create('POST', `/lol-chat/v1/conversations/${chatId}/messages`, action);
        if (result !== null) {
            console.log(`[DodgeTracker] Message posted successfully with type "${type}"`);
            return true;
        }
        console.warn(`[DodgeTracker] postMessageToChat with type "${type}" failed, trying next...`);
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
        return await create('GET', `/lol-chat/v1/conversations/${chatId}/messages`);
    } catch (error) {
        console.error(`[DodgeTracker] Error getting messages from chat ${chatId}:`, error);
        return null;
    }
}

export { getChampionSelectChatInfo, postMessageToChat, getMessageFromChat };
