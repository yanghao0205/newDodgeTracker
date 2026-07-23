import { t } from './translations.js';

// Preset tag IDs (cannot be deleted or duplicated by custom tags)
export const PRESET_TAGS = ['afk', 'troll', 'unskilled', 'mykiller'];

const CUSTOM_TAGS_KEY = 'dodgelist-custom-tags';

/**
 * Get all custom tags from DataStore
 * @returns {Array<{id: string, label: string}>}
 */
export function getCustomTags() {
    const tags = DataStore.get(CUSTOM_TAGS_KEY, []);
    console.log('[DodgeTracker] getCustomTags:', tags.length, tags);
    return tags;
}

/**
 * Get all tags (preset + custom) with display labels
 * @returns {Array<{id: string, label: string}>}
 */
export function getAllTags() {
    const preset = PRESET_TAGS.map(id => ({ id, label: t(id) }));
    const custom = getCustomTags();
    return [...preset, ...custom];
}

/**
 * Get display label for a tag value (handles both preset and custom tags)
 * @param {string} tagValue - The tag value (e.g., 'afk' or 'custom_xxx')
 * @returns {string} - Display label
 */
export function getTagDisplayLabel(tagValue) {
    // Check custom tags first
    const customTags = getCustomTags();
    const customTag = customTags.find(ct => ct.id === tagValue);
    if (customTag) return customTag.label;
    // Fallback to translation
    return t(tagValue);
}

/**
 * Add a new custom tag
 * @param {string} label - The tag label
 * @returns {{success: boolean, id?: string, error?: string}}
 */
export function addCustomTag(label) {
    label = label.trim();
    if (!label) {
        return { success: false, error: 'empty' };
    }

    const customTags = getCustomTags();

    // Check for duplicate labels (case-insensitive)
    if (customTags.some(ct => ct.label.toLowerCase() === label.toLowerCase())) {
        return { success: false, error: 'exists' };
    }

    // Also check against preset tag labels to avoid confusion
    const presetLabels = PRESET_TAGS.map(id => t(id).toLowerCase());
    if (presetLabels.includes(label.toLowerCase())) {
        return { success: false, error: 'exists' };
    }

    const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    customTags.push({ id, label });
    DataStore.set(CUSTOM_TAGS_KEY, customTags);

    console.log('[DodgeTracker] addCustomTag saved:', id, label, 'total:', customTags.length);
    return { success: true, id };
}

/**
 * Remove a custom tag by id
 * Also removes the tag from all players in the dodge list
 * @param {string} tagId - The custom tag id to remove
 */
export function removeCustomTag(tagId) {
    // Remove from custom tags list
    const customTags = getCustomTags().filter(ct => ct.id !== tagId);
    DataStore.set(CUSTOM_TAGS_KEY, customTags);

    // Remove from all players' tags arrays
    const dodgeList = DataStore.get('dodgelist-enhanced', []);
    let modified = false;
    dodgeList.forEach(player => {
        if (player.tags && player.tags.includes(tagId)) {
            player.tags = player.tags.filter(t => t !== tagId);
            modified = true;
        }
    });
    if (modified) {
        DataStore.set('dodgelist-enhanced', dodgeList);
    }
}

/**
 * Remove custom tags that are not used by any player
 * Call this after deleting players or importing data
 * @param {boolean} force - If false, skip cleanup when player list is empty to avoid accidental deletion during plugin reload / locale switch
 */
export function cleanupUnusedCustomTags(force = false) {
    try {
        const allPlayers = DataStore.get('dodgelist-enhanced', []);
        console.log('[DodgeTracker] cleanupUnusedCustomTags called. force=', force, 'players=', allPlayers.length);

        // Safety: when the player list is empty we cannot reliably determine whether
        // it is truly empty or the DataStore hasn't been loaded yet (e.g. after a
        // plugin reload triggered by locale switching). In non-force mode we keep
        // all custom tags so they are not accidentally wiped.
        if (!force && allPlayers.length === 0) {
            console.log('[DodgeTracker] cleanup skipped: player list is empty and force=false');
            return;
        }

        const usedTagIds = new Set();

        allPlayers.forEach(player => {
            if (Array.isArray(player.tags)) {
                player.tags.forEach(tag => usedTagIds.add(tag));
            }
        });

        const customTags = getCustomTags();
        const filtered = customTags.filter(ct => usedTagIds.has(ct.id));

        console.log('[DodgeTracker] cleanup result:', filtered.length, '/', customTags.length, 'kept');
        if (filtered.length !== customTags.length) {
            DataStore.set(CUSTOM_TAGS_KEY, filtered);
        }
    } catch (e) {
        console.error('Error cleaning up unused custom tags:', e);
    }
}
