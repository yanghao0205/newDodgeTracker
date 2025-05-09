// Translation utility for DodgeTracker
// Supports Chinese (zh_CN) and English (en_US) with English as fallback

// Default language is English
let currentLocale = 'en_US';

// Translation data
const translations = {
    'en_US': {
        // UI Components
        'dodgeList': 'Dodge List',
        'addPlayer': 'Add Player',
        'viewList': 'View List',
        'clearList': 'Clear List',
        'playerPlaceholder': 'Player Name#Tag (e.g.: PlayerName#12345)',
        'playerAdded': 'Added {0}',
        'playerExists': 'Player {0} is already in the dodge list',
        'dodgeTracker': 'Dodge Tracker',
        'dodgeTrackerCapital': 'DODGE TRACKER',
        
        // Dodge List Modal
        'yourDodgeList': 'Your Dodge List',
        'searchPlayers': 'Search players...',
        'emptyList': 'No players in your dodge list',
        'close': 'Close',
        'note': 'Note',
        'remove': 'Remove',
        'save': 'Save',
        'noteSaved': 'Note saved successfully',
        'playerRemoved': '{0} has been removed from the dodge list',
        'noteFor': 'Note for {0}',
        
        // Tags
        'all': 'All',
        'toxic': 'Toxic',
        'afk': 'AFK',
        'troll': 'Troll',
        'unskilled': 'Unskilled',
        'mykiller': 'My Killer',
        
        // Tags label format
        'tagsLabel': 'Tags: {0}',
        'noteLabel': 'Note: {0}',
        
        // Champion select messages
        'noPlayersDetected': 'No players from dodge list detected',
        'playerDetected': 'Detected {0} {1}',
        
        // Post game
        'dodgeNote': 'Add to Dodge List',
        'importDodgeList': 'Import Dodge List',
        'exportDodgeList': 'Export Dodge List',
        'importData': 'Import Data',
        'pasteJsonData': 'Please paste the previously exported JSON data:',
        'importSuccess': 'Successfully imported {0} players',
        'importFailed': 'Import failed: Invalid JSON format',
        'importFailedFormat': 'Import failed: Data format is incorrect, should be an array',
        'enterValidJson': 'Please enter valid JSON data',
        'cannotGetPlayerName': 'Cannot get player name, please try again',
        'playerUpdated': 'Updated {0} in dodge list',
        'exportSuccess': 'Dodge list data copied to clipboard',
        'exportFailed': 'Export failed, please try again',
        'add': 'Add',
        'update': 'Update',
        'cancel': 'Cancel',
        'selectTags': 'Select tags',
    },
    'zh_CN': {
        // UI Components
        'dodgeList': '躲避列表',
        'addPlayer': '添加玩家',
        'viewList': '查看列表',
        'clearList': '清空列表',
        'playerPlaceholder': '玩家名称#唯一ID（例如：最后的谜底#58374）',
        'playerAdded': '已添加 {0}',
        'playerExists': '玩家 {0} 已经在躲避列表中',
        'dodgeTracker': '躲避追踪器',
        'dodgeTrackerCapital': '躲避追踪器',
        
        // Dodge List Modal
        'yourDodgeList': '您的躲避列表',
        'searchPlayers': '搜索玩家...',
        'emptyList': '您的躲避列表为空。',
        'close': '关闭',
        'note': '备注',
        'remove': '移除',
        'save': '保存',
        'noteSaved': '备注保存成功',
        'playerRemoved': '{0} 已从躲避列表中移除',
        'noteFor': '{0} 的备注',
        
        // Tags
        'all': '全部',
        'toxic': '有毒',
        'afk': '挂机',
        'troll': '捣乱',
        'unskilled': '技术差',
        'mykiller': '坑我',
        
        // Tags label format
        'tagsLabel': '标签: {0}',
        'noteLabel': '备注: {0}',
        
        // Champion select messages
        'noPlayersDetected': '未检测到躲避列表中的玩家',
        'playerDetected': '检测到 {0} {1}',
        
        // Post game
        'dodgeNote': '死亡笔记',
        'importDodgeList': '导入躲避列表',
        'exportDodgeList': '导出躲避列表',
        'importData': '导入数据',
        'pasteJsonData': '请粘贴之前导出的JSON数据：',
        'importSuccess': '成功导入 {0} 个玩家',
        'importFailed': '导入失败：无效的JSON格式',
        'importFailedFormat': '导入失败：数据格式不正确，应为数组',
        'enterValidJson': '请输入有效的JSON数据',
        'cannotGetPlayerName': '无法获取玩家名称，请重试',
        'playerUpdated': '已更新 {0} 到躲避列表',
        'exportSuccess': '躲避列表数据已复制到剪贴板',
        'exportFailed': '导出失败，请重试',
        'add': '添加',
        'update': '更新',
        'cancel': '取消',
        'selectTags': '选择标签',
    }
};

/**
 * Set the current locale
 * @param {string} locale - The locale code (e.g., 'en_US', 'zh_CN')
 */
export function setLocale(locale) {
    if (translations[locale]) {
        currentLocale = locale;
    } else {
        console.warn(`Locale ${locale} not supported, falling back to en_US`);
        currentLocale = 'en_US';
    }
}

/**
 * Get a translated string
 * @param {string} key - The translation key
 * @param {...string} args - Optional arguments to format into the string
 * @returns {string} - The translated string
 */
export function t(key, ...args) {
    let text = translations[currentLocale][key] || translations['en_US'][key] || key;
    
    // Replace placeholders with arguments
    if (args.length > 0) {
        args.forEach((arg, index) => {
            text = text.replace(`{${index}}`, arg);
        });
    }
    
    return text;
}

/**
 * Get the tag label in the current language
 * @param {string} tagValue - The tag value (e.g., 'toxic', 'afk')
 * @returns {string} - The translated tag label
 */
export function getTagLabel(tagValue) {
    return t(tagValue);
}

/**
 * Initialize the locale based on the client's language
 * Attempts to detect the League client locale
 */
export async function initLocale() {
    try {
        // Try to get the client locale from League client
        const response = await fetch('/riotclient/region-locale');
        if (response.ok) {
            const data = await response.json();
            if (data && data.locale) {
                // League client locale format is like 'en_US'
                const locale = data.locale;
                
                // Check if we support this locale
                if (translations[locale]) {
                    setLocale(locale);
                    console.log(`Set locale to ${locale} based on client settings`);
                } else if (locale.startsWith('zh_')) {
                    // If it's any Chinese variant, use zh_CN
                    setLocale('zh_CN');
                    console.log(`Set locale to zh_CN for Chinese client`);
                } else {
                    // Default to English
                    setLocale('en_US');
                    console.log(`Unsupported locale ${locale}, using en_US as fallback`);
                }
            }
        } else {
            // Fallback to browser language if we can't get the client locale
            const browserLang = navigator.language || navigator.userLanguage;
            if (browserLang.startsWith('zh')) {
                setLocale('zh_CN');
                console.log(`Set locale to zh_CN based on browser language`);
            } else {
                setLocale('en_US');
                console.log(`Using en_US as fallback`);
            }
        }
    } catch (error) {
        console.error('Error initializing locale:', error);
        setLocale('en_US'); // Default to English on error
    }
}
