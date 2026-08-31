// Translation utility for DodgeTracker
// Supports multiple languages with English as fallback

import { LCU_REGION_LOCALE } from './endpoints.js';

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
        'clearListConfirmTitle': 'Clear Dodge List',
        'clearListConfirmMessage': 'Have you exported and saved the dodge list? This operation will clear all players from the dodge list.',
        'clearListConfirmYes': 'Clear',
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

        // Import modal
        'pasteMethod': 'Paste',
        'fileMethod': 'File',
        'selectJsonFile': 'Please select a JSON file',
        'selectFile': 'Select File',
        'noFileSelected': 'Please select a file first',
        'fileReadError': 'Failed to read file',

        // Custom tags
        'manageTags': 'Manage Tags',
        'customTags': 'Custom Tags',
        'addCustomTag': 'Add Tag',
        'tagNamePlaceholder': 'Enter tag name',
        'tagExists': 'Tag already exists',
        'tagEmpty': 'Tag name cannot be empty',
        'deleteTagConfirm': 'Remove this tag?',
        'tagsUpdated': 'Tags updated',

        // Language selector
        'languageLabel': 'Language',
        'autoDetect': 'Auto Detect',
        'summonerRevealEnabled': 'Summoner Reveal',
        'summonerRevealDesc': 'Show player stats (rank, winrate, KDA) in champ select sidebar',
    },
    'ru_RU': {
        // UI Components
        'dodgeList': 'Список уклонений',
        'addPlayer': 'Добавить игрока',
        'viewList': 'Просмотреть список',
        'clearList': 'Очистить список',
        'clearListConfirmTitle': 'Очистить список уклонений',
        'clearListConfirmMessage': 'Вы экспортировали и сохранили список уклонений? Эта операция удалит всех игроков из списка уклонений.',
        'clearListConfirmYes': 'Очистить',
        'playerPlaceholder': 'Имя игрока#Тег (например: PlayerName#12345)',
        'playerAdded': 'Добавлен {0}',
        'playerExists': 'Игрок {0} уже есть в списке уклонений',
        'dodgeTracker': 'Отслеживание уклонений',
        'dodgeTrackerCapital': 'ОТСЛЕЖИВАНИЕ УКЛОНЕНИЙ',

        // Dodge List Modal
        'yourDodgeList': 'Ваш список уклонений',
        'searchPlayers': 'Поиск игроков...',
        'emptyList': 'Список уклонений пуст',
        'close': 'Закрыть',
        'note': 'Заметка',
        'remove': 'Удалить',
        'save': 'Сохранить',
        'noteSaved': 'Заметка успешно сохранена',
        'playerRemoved': '{0} был удален из списка уклонений',
        'noteFor': 'Заметка для {0}',

        // Tags
        'all': 'Все',
        'afk': 'Отошёл (AFK)',
        'troll': 'Тролль',
        'unskilled': 'Слабый',
        'mykiller': 'Мой убийца',

        // Tags label format
        'tagsLabel': 'Теги: {0}',
        'noteLabel': 'Заметка: {0}',

        // Champion select messages
        'noPlayersDetected': 'Игроки из списка уклонений не обнаружены',
        'playerDetected': 'Обнаружен {0} {1}',

        // Post game
        'dodgeNote': 'Добавить в список уклонений',
        'importDodgeList': 'Импорт списка уклонений',
        'exportDodgeList': 'Экспорт списка уклонений',
        'importData': 'Импорт данных',
        'pasteJsonData': 'Пожалуйста, вставьте ранее экспортированные данные в формате JSON:',
        'importSuccess': 'Успешно импортировано игроков: {0}',
        'importFailed': 'Не удалось импортировать: недопустимый формат JSON',
        'importFailedFormat': 'Не удалось импортировать: формат данных неверный, должен быть массивом',
        'enterValidJson': 'Пожалуйста, введите корректные JSON-данные',
        'cannotGetPlayerName': 'Не удалось получить имя игрока, попробуйте ещё раз',
        'playerUpdated': 'Обновлён {0} в списке уклонений',
        'exportSuccess': 'Данные списка уклонений скопированы в буфер обмена',
        'exportFailed': 'Не удалось экспортировать, попробуйте снова',
        'add': 'Добавить',
        'update': 'Обновить',
        'cancel': 'Отмена',
        'selectTags': 'Выберите теги',

        // Import modal
        'pasteMethod': 'Вставить',
        'fileMethod': 'Файл',
        'selectJsonFile': 'Пожалуйста, выберите JSON-файл',
        'selectFile': 'Выбрать файл',
        'noFileSelected': 'Пожалуйста, сначала выберите файл',
        'fileReadError': 'Не удалось прочитать файл',

        // Custom tags
        'manageTags': 'Управление тегами',
        'customTags': 'Пользовательские теги',
        'addCustomTag': 'Добавить тег',
        'tagNamePlaceholder': 'Введите название тега',
        'tagExists': 'Тег уже существует',
        'tagEmpty': 'Название тега не может быть пустым',
        'deleteTagConfirm': 'Удалить этот тег?',
        'tagsUpdated': 'Теги обновлены',

        // Language selector
        'languageLabel': 'Язык',
        'autoDetect': 'Автоопределение',
        'summonerRevealEnabled': 'Статистика игроков',
        'summonerRevealDesc': 'Показывать статистику игроков (ранг, винрейт, KDA) в боковой панели',
    },
    'zh_CN': {
        // UI Components
        'dodgeList': '躲避列表',
        'addPlayer': '添加玩家',
        'viewList': '查看列表',
        'clearList': '清空列表',
        'clearListConfirmTitle': '清空死亡笔记',
        'clearListConfirmMessage': '请问你是否已经导出保存了死亡笔记名单？此操作会清除死亡笔记的所有玩家。',
        'clearListConfirmYes': '清空',
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
        'afk': '挂机',
        'troll': '搞事',
        'unskilled': '技术差',
        'mykiller': '克星',
        
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

        // Import modal
        'pasteMethod': '粘贴导入',
        'fileMethod': '文件导入',
        'selectJsonFile': '请选择JSON文件',
        'selectFile': '选择文件',
        'noFileSelected': '请先选择文件',
        'fileReadError': '文件读取失败',

        // 自定义标签
        'manageTags': '管理标签',
        'customTags': '自定义标签',
        'addCustomTag': '添加标签',
        'tagNamePlaceholder': '输入标签名称',
        'tagExists': '标签已存在',
        'tagEmpty': '标签名称不能为空',
        'deleteTagConfirm': '确定删除此标签？',
        'tagsUpdated': '标签已更新',

        // 语言选择器
        'languageLabel': '语言',
        'autoDetect': '自动检测',
        'summonerRevealEnabled': '召唤师信息',
        'summonerRevealDesc': '选人阶段显示玩家战绩（段位、胜率、KDA）侧边栏',
    },
    // 阿拉伯语 (ar_AE)
    'ar_AE': {
        // UI Components
        'dodgeList': 'قائمة التجنب',
        'addPlayer': 'إضافة لاعب',
        'viewList': 'عرض القائمة',
        'clearList': 'مسح القائمة',
        'clearListConfirmTitle': 'مسح قائمة التجنب',
        'clearListConfirmMessage': 'هل قمت بتصدير وحفظ قائمة التجنب؟ ستحذف هذه العملية جميع اللاعبين من قائمة التجنب.',
        'clearListConfirmYes': 'مسح',
        'playerPlaceholder': 'اسم اللاعب#العلامة (مثال: PlayerName#12345)',
        'playerAdded': 'تم إضافة {0}',
        'playerExists': 'اللاعب {0} موجود بالفعل في قائمة التجنب',
        'dodgeTracker': 'متتبع التجنب',
        'dodgeTrackerCapital': 'متتبع التجنب',

        // Dodge List Modal
        'yourDodgeList': 'قائمة التجنب الخاصة بك',
        'searchPlayers': 'البحث عن اللاعبين...',
        'emptyList': 'لا توجد لاعبين في قائمة التجنب',
        'close': 'إغلاق',
        'note': 'ملاحظة',
        'remove': 'إزالة',
        'save': 'حفظ',
        'noteSaved': 'تم حفظ الملاحظة بنجاح',
        'playerRemoved': 'تم إزالة {0} من قائمة التجنب',
        'noteFor': 'ملاحظة لـ {0}',

        // Tags
        'all': 'الكل',
        'afk': 'غائب',
        'troll': 'مشاغب',
        'unskilled': 'غير ماهر',
        'mykiller': 'قاتلي',

        // Tags label format
        'tagsLabel': 'العلامات: {0}',
        'noteLabel': 'ملاحظة: {0}',

        // Champion select messages
        'noPlayersDetected': 'لم يتم اكتشاف لاعبين من قائمة التجنب',
        'playerDetected': 'تم اكتشاف {0} {1}',

        // Post game
        'dodgeNote': 'إضافة إلى قائمة التجنب',
        'importDodgeList': 'استيراد قائمة التجنب',
        'exportDodgeList': 'تصدير قائمة التجنب',
        'importData': 'استيراد البيانات',
        'pasteJsonData': 'يرجى لصق بيانات JSON المصدرة مسبقاً:',
        'importSuccess': 'تم استيراد {0} لاعبين بنجاح',
        'importFailed': 'فشل الاستيراد: تنسيق JSON غير صالح',
        'importFailedFormat': 'فشل الاستيراد: تنسيق البيانات غير صحيح، يجب أن يكون مصفوفة',
        'enterValidJson': 'يرجى إدخال بيانات JSON صالحة',
        'cannotGetPlayerName': 'لا يمكن الحصول على اسم اللاعب، يرجى المحاولة مرة أخرى',
        'playerUpdated': 'تم تحديث {0} في قائمة التجنب',
        'exportSuccess': 'تم نسخ بيانات قائمة التجنب إلى الحافظة',
        'exportFailed': 'فشل التصدير، يرجى المحاولة مرة أخرى',
        'add': 'إضافة',
        'update': 'تحديث',
        'cancel': 'إلغاء',
        'selectTags': 'اختر العلامات',

        // Import modal
        'pasteMethod': 'لصق',
        'fileMethod': 'ملف',
        'selectJsonFile': 'يرجى اختيار ملف JSON',
        'selectFile': 'اختيار ملف',
        'noFileSelected': 'يرجى اختيار ملف أولاً',
        'fileReadError': 'فشل في قراءة الملف',

        // Custom tags
        'manageTags': 'إدارة العلامات',
        'customTags': 'علامات مخصصة',
        'addCustomTag': 'إضافة علامة',
        'tagNamePlaceholder': 'أدخل اسم العلامة',
        'tagExists': 'العلامة موجودة بالفعل',
        'tagEmpty': 'لا يمكن أن يكون اسم العلامة فارغاً',
        'deleteTagConfirm': 'حذف هذه العلامة؟',
        'tagsUpdated': 'تم تحديث العلامات',

        // محدد اللغة
        'languageLabel': 'اللغة',
        'autoDetect': 'كشف تلقائي',
        'summonerRevealEnabled': 'كشف اللاعب',
        'summonerRevealDesc': 'إظهار إحصائيات اللاعب (الرتبة، نسبة الفوز، KDA) في الشريط الجانبي',
    },
    // 印尼语 (id_ID)
    'id_ID': {
        // UI Components
        'dodgeList': 'Daftar Dodge',
        'addPlayer': 'Tambah Pemain',
        'viewList': 'Lihat Daftar',
        'clearList': 'Hapus Daftar',
        'clearListConfirmTitle': 'Hapus Daftar Dodge',
        'clearListConfirmMessage': 'Apakah Anda sudah mengekspor dan menyimpan daftar dodge? Operasi ini akan menghapus semua pemain dari daftar dodge.',
        'clearListConfirmYes': 'Hapus',
        'playerPlaceholder': 'Nama Pemain#Tag (contoh: PlayerName#12345)',
        'playerAdded': 'Ditambahkan {0}',
        'playerExists': 'Pemain {0} sudah ada dalam daftar dodge',
        'dodgeTracker': 'Pelacak Dodge',
        'dodgeTrackerCapital': 'PELACAK DODGE',

        // Dodge List Modal
        'yourDodgeList': 'Daftar Dodge Anda',
        'searchPlayers': 'Cari pemain...',
        'emptyList': 'Tidak ada pemain dalam daftar dodge',
        'close': 'Tutup',
        'note': 'Catatan',
        'remove': 'Hapus',
        'save': 'Simpan',
        'noteSaved': 'Catatan berhasil disimpan',
        'playerRemoved': '{0} telah dihapus dari daftar dodge',
        'noteFor': 'Catatan untuk {0}',

        // Tags
        'all': 'Semua',
        'afk': 'AFK',
        'troll': 'Troll',
        'unskilled': 'Tidak Terampil',
        'mykiller': 'Pembunuh Saya',

        // Tags label format
        'tagsLabel': 'Tag: {0}',
        'noteLabel': 'Catatan: {0}',

        // Champion select messages
        'noPlayersDetected': 'Tidak ada pemain dari daftar dodge yang terdeteksi',
        'playerDetected': 'Terdeteksi {0} {1}',

        // Post game
        'dodgeNote': 'Tambah ke Daftar Dodge',
        'importDodgeList': 'Impor Daftar Dodge',
        'exportDodgeList': 'Ekspor Daftar Dodge',
        'importData': 'Impor Data',
        'pasteJsonData': 'Silakan tempel data JSON yang sebelumnya diekspor:',
        'importSuccess': 'Berhasil mengimpor {0} pemain',
        'importFailed': 'Impor gagal: Format JSON tidak valid',
        'importFailedFormat': 'Impor gagal: Format data tidak benar, harus berupa array',
        'enterValidJson': 'Silakan masukkan data JSON yang valid',
        'cannotGetPlayerName': 'Tidak dapat mendapatkan nama pemain, silakan coba lagi',
        'playerUpdated': 'Diperbarui {0} dalam daftar dodge',
        'exportSuccess': 'Data daftar dodge disalin ke clipboard',
        'exportFailed': 'Ekspor gagal, silakan coba lagi',
        'add': 'Tambah',
        'update': 'Perbarui',
        'cancel': 'Batal',
        'selectTags': 'Pilih tag',

        // Import modal
        'pasteMethod': 'Tempel',
        'fileMethod': 'Berkas',
        'selectJsonFile': 'Silakan pilih file JSON',
        'selectFile': 'Pilih File',
        'noFileSelected': 'Silakan pilih file terlebih dahulu',
        'fileReadError': 'Gagal membaca file',

        // Custom tags
        'manageTags': 'Kelola Tag',
        'customTags': 'Tag Kustom',
        'addCustomTag': 'Tambah Tag',
        'tagNamePlaceholder': 'Masukkan nama tag',
        'tagExists': 'Tag sudah ada',
        'tagEmpty': 'Nama tag tidak boleh kosong',
        'deleteTagConfirm': 'Hapus tag ini?',
        'tagsUpdated': 'Tag diperbarui',

        // Language selector
        'languageLabel': 'Bahasa',
        'autoDetect': 'Deteksi Otomatis',
        'summonerRevealEnabled': 'Reveal Summoner',
        'summonerRevealDesc': 'Tampilkan statistik pemain (rank, winrate, KDA) di sidebar',
    },
    // 捷克语 (cs_CZ)
    'cs_CZ': {
        // UI Components
        'dodgeList': 'Seznam vyhýbání',
        'addPlayer': 'Přidat hráče',
        'viewList': 'Zobrazit seznam',
        'clearList': 'Vymazat seznam',
        'clearListConfirmTitle': 'Vymazat seznam vyhýbání',
        'clearListConfirmMessage': 'Exportovali jste a uložili seznam vyhýbání? Tato operace vymaže všechny hráče ze seznamu vyhýbání.',
        'clearListConfirmYes': 'Vymazat',
        'playerPlaceholder': 'Jméno hráče#Tag (např.: PlayerName#12345)',
        'playerAdded': 'Přidán {0}',
        'playerExists': 'Hráč {0} už je v seznamu vyhýbání',
        'dodgeTracker': 'Sledování vyhýbání',
        'dodgeTrackerCapital': 'SLEDOVÁNÍ VYHÝBÁNÍ',

        // Dodge List Modal
        'yourDodgeList': 'Váš seznam vyhýbání',
        'searchPlayers': 'Hledat hráče...',
        'emptyList': 'Žádní hráči v seznamu vyhýbání',
        'close': 'Zavřít',
        'note': 'Poznámka',
        'remove': 'Odebrat',
        'save': 'Uložit',
        'noteSaved': 'Poznámka úspěšně uložena',
        'playerRemoved': '{0} byl odebrán ze seznamu vyhýbání',
        'noteFor': 'Poznámka pro {0}',

        // Tags
        'all': 'Vše',
        'afk': 'AFK',
        'troll': 'Troll',
        'unskilled': 'Neschopný',
        'mykiller': 'Můj zabiják',

        // Tags label format
        'tagsLabel': 'Štítky: {0}',
        'noteLabel': 'Poznámka: {0}',

        // Champion select messages
        'noPlayersDetected': 'Žádní hráči ze seznamu vyhýbání nebyli detekováni',
        'playerDetected': 'Detekován {0} {1}',

        // Post game
        'dodgeNote': 'Přidat do seznamu vyhýbání',
        'importDodgeList': 'Importovat seznam vyhýbání',
        'exportDodgeList': 'Exportovat seznam vyhýbání',
        'importData': 'Importovat data',
        'pasteJsonData': 'Prosím vložte dříve exportovaná JSON data:',
        'importSuccess': 'Úspěšně importováno {0} hráčů',
        'importFailed': 'Import selhal: Neplatný JSON formát',
        'importFailedFormat': 'Import selhal: Formát dat je nesprávný, měl by být pole',
        'enterValidJson': 'Prosím zadejte platná JSON data',
        'cannotGetPlayerName': 'Nelze získat jméno hráče, zkuste to znovu',
        'playerUpdated': 'Aktualizován {0} v seznamu vyhýbání',
        'exportSuccess': 'Data seznamu vyhýbání zkopírována do schránky',
        'exportFailed': 'Export selhal, zkuste to znovu',
        'add': 'Přidat',
        'update': 'Aktualizovat',
        'cancel': 'Zrušit',
        'selectTags': 'Vybrat štítky',

        // Import modal
        'pasteMethod': 'Vložit',
        'fileMethod': 'Soubor',
        'selectJsonFile': 'Prosím vyberte JSON soubor',
        'selectFile': 'Vybrat soubor',
        'noFileSelected': 'Prosím nejprve vyberte soubor',
        'fileReadError': 'Selhalo čtení souboru',

        // Custom tags
        'manageTags': 'Spravovat štítky',
        'customTags': 'Vlastní štítky',
        'addCustomTag': 'Přidat štítek',
        'tagNamePlaceholder': 'Zadejte název štítku',
        'tagExists': 'Štítek již existuje',
        'tagEmpty': 'Název štítku nemůže být prázdný',
        'deleteTagConfirm': 'Odstranit tento štítek?',
        'tagsUpdated': 'Štítky aktualizovány',

        // Language selector
        'languageLabel': 'Jazyk',
        'autoDetect': 'Automatická detekce',
        'summonerRevealEnabled': 'Odhalení hráče',
        'summonerRevealDesc': 'Zobrazit statistiky hráčů (rank, winrate, KDA) v postranním panelu',
    },
    // 德语 (de_DE)
    'de_DE': {
        // UI Components
        'dodgeList': 'Dodge-Liste',
        'addPlayer': 'Spieler hinzufügen',
        'viewList': 'Liste anzeigen',
        'clearList': 'Liste löschen',
        'clearListConfirmTitle': 'Dodge-Liste leeren',
        'clearListConfirmMessage': 'Hast du die Dodge-Liste exportiert und gespeichert? Dieser Vorgang entfernt alle Spieler aus der Dodge-Liste.',
        'clearListConfirmYes': 'Leeren',
        'playerPlaceholder': 'Spielername#Tag (z.B.: PlayerName#12345)',
        'playerAdded': '{0} hinzugefügt',
        'playerExists': 'Spieler {0} ist bereits in der Dodge-Liste',
        'dodgeTracker': 'Dodge-Tracker',
        'dodgeTrackerCapital': 'DODGE-TRACKER',

        // Dodge List Modal
        'yourDodgeList': 'Ihre Dodge-Liste',
        'searchPlayers': 'Spieler suchen...',
        'emptyList': 'Keine Spieler in Ihrer Dodge-Liste',
        'close': 'Schließen',
        'note': 'Notiz',
        'remove': 'Entfernen',
        'save': 'Speichern',
        'noteSaved': 'Notiz erfolgreich gespeichert',
        'playerRemoved': '{0} wurde aus der Dodge-Liste entfernt',
        'noteFor': 'Notiz für {0}',

        // Tags
        'all': 'Alle',
        'afk': 'AFK',
        'troll': 'Troll',
        'unskilled': 'Unerfahren',
        'mykiller': 'Mein Killer',

        // Tags label format
        'tagsLabel': 'Tags: {0}',
        'noteLabel': 'Notiz: {0}',

        // Champion select messages
        'noPlayersDetected': 'Keine Spieler aus der Dodge-Liste erkannt',
        'playerDetected': 'Erkannt: {0} {1}',

        // Post game
        'dodgeNote': 'Zur Dodge-Liste hinzufügen',
        'importDodgeList': 'Dodge-Liste importieren',
        'exportDodgeList': 'Dodge-Liste exportieren',
        'importData': 'Daten importieren',
        'pasteJsonData': 'Bitte fügen Sie die zuvor exportierten JSON-Daten ein:',
        'importSuccess': 'Erfolgreich {0} Spieler importiert',
        'importFailed': 'Import fehlgeschlagen: Ungültiges JSON-Format',
        'importFailedFormat': 'Import fehlgeschlagen: Datenformat ist falsch, sollte ein Array sein',
        'enterValidJson': 'Bitte geben Sie gültige JSON-Daten ein',
        'cannotGetPlayerName': 'Spielername kann nicht abgerufen werden, bitte versuchen Sie es erneut',
        'playerUpdated': '{0} in Dodge-Liste aktualisiert',
        'exportSuccess': 'Dodge-Listen-Daten in Zwischenablage kopiert',
        'exportFailed': 'Export fehlgeschlagen, bitte versuchen Sie es erneut',
        'add': 'Hinzufügen',
        'update': 'Aktualisieren',
        'cancel': 'Abbrechen',
        'selectTags': 'Tags auswählen',

        // Import modal
        'pasteMethod': 'Einfügen',
        'fileMethod': 'Datei',
        'selectJsonFile': 'Bitte wählen Sie eine JSON-Datei',
        'selectFile': 'Datei auswählen',
        'noFileSelected': 'Bitte wählen Sie zuerst eine Datei',
        'fileReadError': 'Datei konnte nicht gelesen werden',

        // Custom tags
        'manageTags': 'Tags verwalten',
        'customTags': 'Eigene Tags',
        'addCustomTag': 'Tag hinzufügen',
        'tagNamePlaceholder': 'Tag-Name eingeben',
        'tagExists': 'Tag existiert bereits',
        'tagEmpty': 'Tag-Name darf nicht leer sein',
        'deleteTagConfirm': 'Diesen Tag entfernen?',
        'tagsUpdated': 'Tags aktualisiert',

        // Language selector
        'languageLabel': 'Sprache',
        'autoDetect': 'Automatische Erkennung',
        'summonerRevealEnabled': 'Beschwörer-Info',
        'summonerRevealDesc': 'Spielstatistiken (Rang, Winrate, KDA) in der Seitenleiste anzeigen',
    },
    // 希腊语 (el_GR)
    'el_GR': {
        // UI Components
        'dodgeList': 'Λίστα Αποφυγής',
        'addPlayer': 'Προσθήκη Παίκτη',
        'viewList': 'Προβολή Λίστας',
        'clearList': 'Εκκαθάριση Λίστας',
        'clearListConfirmTitle': 'Εκκαθάριση λίστας αποφυγής',
        'clearListConfirmMessage': 'Έχετε εξαγάγει και αποθηκεύσει τη λίστα αποφυγής; Αυτή η λειτουργία θα διαγράψει όλους τους παίκτες από τη λίστα αποφυγής.',
        'clearListConfirmYes': 'Εκκαθάριση',
        'playerPlaceholder': 'Όνομα Παίκτη#Tag (π.χ.: PlayerName#12345)',
        'playerAdded': 'Προστέθηκε {0}',
        'playerExists': 'Ο παίκτης {0} υπάρχει ήδη στη λίστα αποφυγής',
        'dodgeTracker': 'Ιχνηλάτης Αποφυγής',
        'dodgeTrackerCapital': 'ΙΧΝΗΛΑΤΗΣ ΑΠΟΦΥΓΗΣ',

        // Dodge List Modal
        'yourDodgeList': 'Η Λίστα Αποφυγής σας',
        'searchPlayers': 'Αναζήτηση παικτών...',
        'emptyList': 'Δεν υπάρχουν παίκτες στη λίστα αποφυγής',
        'close': 'Κλείσιμο',
        'note': 'Σημείωση',
        'remove': 'Αφαίρεση',
        'save': 'Αποθήκευση',
        'noteSaved': 'Η σημείωση αποθηκεύτηκε επιτυχώς',
        'playerRemoved': 'Ο {0} αφαιρέθηκε από τη λίστα αποφυγής',
        'noteFor': 'Σημείωση για {0}',

        // Tags
        'all': 'Όλα',
        'afk': 'AFK',
        'troll': 'Τρολ',
        'unskilled': 'Άπειρος',
        'mykiller': 'Ο Δολοφόνος μου',

        // Tags label format
        'tagsLabel': 'Ετικέτες: {0}',
        'noteLabel': 'Σημείωση: {0}',

        // Champion select messages
        'noPlayersDetected': 'Δεν εντοπίστηκαν παίκτες από τη λίστα αποφυγής',
        'playerDetected': 'Εντοπίστηκε {0} {1}',

        // Post game
        'dodgeNote': 'Προσθήκη στη Λίστα Αποφυγής',
        'importDodgeList': 'Εισαγωγή Λίστας Αποφυγής',
        'exportDodgeList': 'Εξαγωγή Λίστας Αποφυγής',
        'importData': 'Εισαγωγή Δεδομένων',
        'pasteJsonData': 'Παρακαλώ επικολλήστε τα δεδομένα JSON που εξάχθηκαν προηγουμένως:',
        'importSuccess': 'Επιτυχής εισαγωγή {0} παικτών',
        'importFailed': 'Η εισαγωγή απέτυχε: Μη έγκυρη μορφή JSON',
        'importFailedFormat': 'Η εισαγωγή απέτυχε: Η μορφή δεδομένων είναι λανθασμένη, πρέπει να είναι πίνακας',
        'enterValidJson': 'Παρακαλώ εισάγετε έγκυρα δεδομένα JSON',
        'cannotGetPlayerName': 'Δεν είναι δυνατή η λήψη ονόματος παίκτη, παρακαλώ δοκιμάστε ξανά',
        'playerUpdated': 'Ενημερώθηκε {0} στη λίστα αποφυγής',
        'exportSuccess': 'Τα δεδομένα λίστας αποφυγής αντιγράφηκαν στο πρόχειρο',
        'exportFailed': 'Η εξαγωγή απέτυχε, παρακαλώ δοκιμάστε ξανά',
        'add': 'Προσθήκη',
        'update': 'Ενημέρωση',
        'cancel': 'Ακύρωση',
        'selectTags': 'Επιλογή ετικετών',

        // Import modal
        'pasteMethod': 'Επικόλληση',
        'fileMethod': 'Αρχείο',
        'selectJsonFile': 'Παρακαλώ επιλέξτε αρχείο JSON',
        'selectFile': 'Επιλογή αρχείου',
        'noFileSelected': 'Παρακαλώ επιλέξτε πρώτα ένα αρχείο',
        'fileReadError': 'Αποτυχία ανάγνωσης αρχείου',

        // Custom tags
        'manageTags': 'Διαχείριση Ετικετών',
        'customTags': 'Προσαρμοσμένες Ετικέτες',
        'addCustomTag': 'Προσθήκη Ετικέτας',
        'tagNamePlaceholder': 'Εισαγάγετε όνομα ετικέτας',
        'tagExists': 'Η ετικέτα υπάρχει ήδη',
        'tagEmpty': 'Το όνομα ετικέτας δεν μπορεί να είναι κενό',
        'deleteTagConfirm': 'Αφαίρεση αυτής της ετικέτας;',
        'tagsUpdated': 'Οι ετικέτες ενημερώθηκαν',

        // Language selector
        'languageLabel': 'Γλώσσα',
        'autoDetect': 'Αυτόματος εντοπισμός',
        'summonerRevealEnabled': 'Αποκάλυψη παίκτη',
        'summonerRevealDesc': 'Εμφάνιση στατιστικών παικτών (rank, winrate, KDA) στην πλαϊνή μπάρα',
    },
    // Español (es_ES)
    'es_ES': {
        // UI Components
        'dodgeList': 'Lista de Dodge',
        'addPlayer': 'Añadir jugador',
        'viewList': 'Ver lista',
        'clearList': 'Borrar lista',
        'clearListConfirmTitle': 'Borrar lista de Dodge',
        'clearListConfirmMessage': '¿Has exportado y guardado la lista de Dodge? Esta operación eliminará a todos los jugadores de la lista de Dodge.',
        'clearListConfirmYes': 'Borrar',
        'playerPlaceholder': 'Nombre#Etiqueta (ej.: PlayerName#12345)',
        'playerAdded': 'Añadido {0}',
        'playerExists': 'El jugador {0} ya está en la lista de Dodge',
        'dodgeTracker': 'Rastreador de Dodge',
        'dodgeTrackerCapital': 'RASTREADOR DE DODGE',
        'yourDodgeList': 'Tu lista de Dodge',
        'searchPlayers': 'Buscar jugadores...',
        'emptyList': 'No hay jugadores en tu lista de Dodge',
        'close': 'Cerrar',
        'note': 'Nota',
        'remove': 'Eliminar',
        'save': 'Guardar',
        'noteSaved': 'Nota guardada correctamente',
        'playerRemoved': '{0} ha sido eliminado de la lista de Dodge',
        'noteFor': 'Nota para {0}',
        'all': 'Todos',
        'afk': 'AFK',
        'troll': 'Trol',
        'unskilled': 'Poco hábil',
        'mykiller': 'Mi asesino',
        'tagsLabel': 'Etiquetas: {0}',
        'noteLabel': 'Nota: {0}',
        'noPlayersDetected': 'No se detectaron jugadores de la lista de Dodge',
        'playerDetected': 'Detectado {0} {1}',
        'dodgeNote': 'Añadir a lista de Dodge',
        'importDodgeList': 'Importar lista de Dodge',
        'exportDodgeList': 'Exportar lista de Dodge',
        'importData': 'Importar datos',
        'pasteJsonData': 'Pega los datos JSON exportados anteriormente:',
        'importSuccess': 'Importados {0} jugadores correctamente',
        'importFailed': 'Importación fallida: formato JSON no válido',
        'importFailedFormat': 'Importación fallida: formato de datos incorrecto, debe ser un array',
        'enterValidJson': 'Introduce datos JSON válidos',
        'cannotGetPlayerName': 'No se puede obtener el nombre del jugador, inténtalo de nuevo',
        'playerUpdated': 'Actualizado {0} en la lista de Dodge',
        'exportSuccess': 'Datos de la lista de Dodge copiados al portapapeles',
        'exportFailed': 'Exportación fallida, inténtalo de nuevo',
        'add': 'Añadir',
        'update': 'Actualizar',
        'cancel': 'Cancelar',
        'selectTags': 'Seleccionar etiquetas',
        'pasteMethod': 'Pegar',
        'fileMethod': 'Archivo',
        'selectJsonFile': 'Selecciona un archivo JSON',
        'selectFile': 'Seleccionar archivo',
        'noFileSelected': 'Selecciona un archivo primero',
        'fileReadError': 'Error al leer el archivo',
        'manageTags': 'Gestionar etiquetas',
        'customTags': 'Etiquetas personalizadas',
        'addCustomTag': 'Añadir etiqueta',
        'tagNamePlaceholder': 'Introduce el nombre de la etiqueta',
        'tagExists': 'La etiqueta ya existe',
        'tagEmpty': 'El nombre de la etiqueta no puede estar vacío',
        'deleteTagConfirm': '¿Eliminar esta etiqueta?',
        'tagsUpdated': 'Etiquetas actualizadas',
        'languageLabel': 'Idioma',
        'autoDetect': 'Detección automática',
        'summonerRevealEnabled': 'Revelar invocador',
        'summonerRevealDesc': 'Mostrar estadísticas de jugadores (rango, winrate, KDA) en la barra lateral',
    },
    // Français (fr_FR)
    'fr_FR': {
        // UI Components
        'dodgeList': 'Liste de Dodge',
        'addPlayer': 'Ajouter un joueur',
        'viewList': 'Voir la liste',
        'clearList': 'Vider la liste',
        'clearListConfirmTitle': 'Vider la liste de Dodge',
        'clearListConfirmMessage': 'Avez-vous exporté et sauvegardé la liste de Dodge ? Cette opération supprimera tous les joueurs de la liste de Dodge.',
        'clearListConfirmYes': 'Vider',
        'playerPlaceholder': 'Nom#Tag (ex. : PlayerName#12345)',
        'playerAdded': '{0} ajouté',
        'playerExists': 'Le joueur {0} est déjà dans la liste de Dodge',
        'dodgeTracker': 'Traqueur de Dodge',
        'dodgeTrackerCapital': 'TRAQUEUR DE DODGE',
        'yourDodgeList': 'Votre liste de Dodge',
        'searchPlayers': 'Rechercher des joueurs...',
        'emptyList': 'Aucun joueur dans votre liste de Dodge',
        'close': 'Fermer',
        'note': 'Note',
        'remove': 'Retirer',
        'save': 'Enregistrer',
        'noteSaved': 'Note enregistrée avec succès',
        'playerRemoved': '{0} a été retiré de la liste de Dodge',
        'noteFor': 'Note pour {0}',
        'all': 'Tous',
        'afk': 'AFK',
        'troll': 'Troll',
        'unskilled': 'Peu habile',
        'mykiller': 'Mon tueur',
        'tagsLabel': 'Étiquettes : {0}',
        'noteLabel': 'Note : {0}',
        'noPlayersDetected': 'Aucun joueur de la liste de Dodge détecté',
        'playerDetected': 'Détecté {0} {1}',
        'dodgeNote': 'Ajouter à la liste de Dodge',
        'importDodgeList': 'Importer la liste de Dodge',
        'exportDodgeList': 'Exporter la liste de Dodge',
        'importData': 'Importer des données',
        'pasteJsonData': 'Veuillez coller les données JSON précédemment exportées :',
        'importSuccess': '{0} joueurs importés avec succès',
        'importFailed': 'Échec de l\'importation : format JSON invalide',
        'importFailedFormat': 'Échec de l\'importation : format de données incorrect, doit être un tableau',
        'enterValidJson': 'Veuillez saisir des données JSON valides',
        'cannotGetPlayerName': 'Impossible d\'obtenir le nom du joueur, veuillez réessayer',
        'playerUpdated': '{0} mis à jour dans la liste de Dodge',
        'exportSuccess': 'Données de la liste de Dodge copiées dans le presse-papiers',
        'exportFailed': 'Échec de l\'exportation, veuillez réessayer',
        'add': 'Ajouter',
        'update': 'Mettre à jour',
        'cancel': 'Annuler',
        'selectTags': 'Sélectionner les étiquettes',
        'pasteMethod': 'Coller',
        'fileMethod': 'Fichier',
        'selectJsonFile': 'Veuillez sélectionner un fichier JSON',
        'selectFile': 'Sélectionner un fichier',
        'noFileSelected': 'Veuillez d\'abord sélectionner un fichier',
        'fileReadError': 'Échec de la lecture du fichier',
        'manageTags': 'Gérer les étiquettes',
        'customTags': 'Étiquettes personnalisées',
        'addCustomTag': 'Ajouter une étiquette',
        'tagNamePlaceholder': 'Entrez le nom de l\'étiquette',
        'tagExists': 'L\'étiquette existe déjà',
        'tagEmpty': 'Le nom de l\'étiquette ne peut pas être vide',
        'deleteTagConfirm': 'Supprimer cette étiquette ?',
        'tagsUpdated': 'Étiquettes mises à jour',
        'languageLabel': 'Langue',
        'autoDetect': 'Détection automatique',
        'summonerRevealEnabled': 'Révélation des invocateurs',
        'summonerRevealDesc': 'Afficher les statistiques des joueurs (rang, winrate, KDA) dans la barre latérale',
    },
    // Magyar (hu_HU)
    'hu_HU': {
        // UI Components
        'dodgeList': 'Dodge lista',
        'addPlayer': 'Játékos hozzáadása',
        'viewList': 'Lista megtekintése',
        'clearList': 'Lista ürítése',
        'clearListConfirmTitle': 'Dodge lista ürítése',
        'clearListConfirmMessage': 'Exportáltad és mentetted a Dodge listát? Ez a művelet eltávolítja az összes játékost a Dodge listából.',
        'clearListConfirmYes': 'Ürítés',
        'playerPlaceholder': 'Játékosnév#Tag (pl.: PlayerName#12345)',
        'playerAdded': '{0} hozzáadva',
        'playerExists': '{0} játékos már szerepel a Dodge listában',
        'dodgeTracker': 'Dodge Követő',
        'dodgeTrackerCapital': 'DODGE KÖVETŐ',
        'yourDodgeList': 'A Dodge listád',
        'searchPlayers': 'Játékosok keresése...',
        'emptyList': 'Nincsenek játékosok a Dodge listádban',
        'close': 'Bezárás',
        'note': 'Megjegyzés',
        'remove': 'Eltávolítás',
        'save': 'Mentés',
        'noteSaved': 'Megjegyzés sikeresen mentve',
        'playerRemoved': '{0} eltávolítva a Dodge listából',
        'noteFor': 'Megjegyzés: {0}',
        'all': 'Összes',
        'afk': 'AFK',
        'troll': 'Troll',
        'unskilled': 'Gyenge',
        'mykiller': 'A gyilkosom',
        'tagsLabel': 'Címkék: {0}',
        'noteLabel': 'Megjegyzés: {0}',
        'noPlayersDetected': 'Nem észlelhető Dodge listás játékos',
        'playerDetected': 'Észlelve {0} {1}',
        'dodgeNote': 'Hozzáadás a Dodge listához',
        'importDodgeList': 'Dodge lista importálása',
        'exportDodgeList': 'Dodge lista exportálása',
        'importData': 'Adatok importálása',
        'pasteJsonData': 'Illeszd be a korábban exportált JSON adatokat:',
        'importSuccess': '{0} játékos sikeresen importálva',
        'importFailed': 'Importálás sikertelen: érvénytelen JSON formátum',
        'importFailedFormat': 'Importálás sikertelen: hibás adatformátum, tömbnek kell lennie',
        'enterValidJson': 'Kérlek érvényes JSON adatokat adj meg',
        'cannotGetPlayerName': 'Nem sikerült lekérni a játékos nevét, próbáld újra',
        'playerUpdated': '{0} frissítve a Dodge listában',
        'exportSuccess': 'Dodge lista adatok a vágólapra másolva',
        'exportFailed': 'Exportálás sikertelen, próbáld újra',
        'add': 'Hozzáadás',
        'update': 'Frissítés',
        'cancel': 'Mégse',
        'selectTags': 'Címkék kiválasztása',
        'pasteMethod': 'Beillesztés',
        'fileMethod': 'Fájl',
        'selectJsonFile': 'Válassz egy JSON fájlt',
        'selectFile': 'Fájl kiválasztása',
        'noFileSelected': 'Először válassz egy fájlt',
        'fileReadError': 'Fájl olvasása sikertelen',
        'manageTags': 'Címkék kezelése',
        'customTags': 'Egyéni címkék',
        'addCustomTag': 'Címke hozzáadása',
        'tagNamePlaceholder': 'Add meg a címke nevét',
        'tagExists': 'A címke már létezik',
        'tagEmpty': 'A címke neve nem lehet üres',
        'deleteTagConfirm': 'Eltávolítod ezt a címkét?',
        'tagsUpdated': 'Címkék frissítve',
        'languageLabel': 'Nyelv',
        'autoDetect': 'Automatikus felismerés',
        'summonerRevealEnabled': 'Játékos statisztika',
        'summonerRevealDesc': 'Játékos statisztikák (rank, winrate, KDA) megjelenítése oldalsávban',
    },
    // Italiano (it_IT)
    'it_IT': {
        // UI Components
        'dodgeList': 'Lista Dodge',
        'addPlayer': 'Aggiungi giocatore',
        'viewList': 'Visualizza lista',
        'clearList': 'Svuota lista',
        'clearListConfirmTitle': 'Svuota lista Dodge',
        'clearListConfirmMessage': 'Hai esportato e salvato la lista Dodge? Questa operazione rimuoverà tutti i giocatori dalla lista Dodge.',
        'clearListConfirmYes': 'Svuota',
        'playerPlaceholder': 'NomeGiocatore#Tag (es.: PlayerName#12345)',
        'playerAdded': '{0} aggiunto',
        'playerExists': 'Il giocatore {0} è già nella lista Dodge',
        'dodgeTracker': 'Tracciatore Dodge',
        'dodgeTrackerCapital': 'TRACCIATORE DODGE',
        'yourDodgeList': 'La tua lista Dodge',
        'searchPlayers': 'Cerca giocatori...',
        'emptyList': 'Nessun giocatore nella tua lista Dodge',
        'close': 'Chiudi',
        'note': 'Nota',
        'remove': 'Rimuovi',
        'save': 'Salva',
        'noteSaved': 'Nota salvata con successo',
        'playerRemoved': '{0} è stato rimosso dalla lista Dodge',
        'noteFor': 'Nota per {0}',
        'all': 'Tutti',
        'afk': 'AFK',
        'troll': 'Troll',
        'unskilled': 'Poco abile',
        'mykiller': 'Il mio assassino',
        'tagsLabel': 'Etichette: {0}',
        'noteLabel': 'Nota: {0}',
        'noPlayersDetected': 'Nessun giocatore della lista Dodge rilevato',
        'playerDetected': 'Rilevato {0} {1}',
        'dodgeNote': 'Aggiungi alla lista Dodge',
        'importDodgeList': 'Importa lista Dodge',
        'exportDodgeList': 'Esporta lista Dodge',
        'importData': 'Importa dati',
        'pasteJsonData': 'Incolla i dati JSON precedentemente esportati:',
        'importSuccess': '{0} giocatori importati con successo',
        'importFailed': 'Importazione fallita: formato JSON non valido',
        'importFailedFormat': 'Importazione fallita: formato dati errato, deve essere un array',
        'enterValidJson': 'Inserisci dati JSON validi',
        'cannotGetPlayerName': 'Impossibile ottenere il nome del giocatore, riprova',
        'playerUpdated': '{0} aggiornato nella lista Dodge',
        'exportSuccess': 'Dati della lista Dodge copiati negli appunti',
        'exportFailed': 'Esportazione fallita, riprova',
        'add': 'Aggiungi',
        'update': 'Aggiorna',
        'cancel': 'Annulla',
        'selectTags': 'Seleziona etichette',
        'pasteMethod': 'Incolla',
        'fileMethod': 'File',
        'selectJsonFile': 'Seleziona un file JSON',
        'selectFile': 'Seleziona file',
        'noFileSelected': 'Seleziona prima un file',
        'fileReadError': 'Lettura del file fallita',
        'manageTags': 'Gestisci etichette',
        'customTags': 'Etichette personalizzate',
        'addCustomTag': 'Aggiungi etichetta',
        'tagNamePlaceholder': 'Inserisci il nome dell\'etichetta',
        'tagExists': 'L\'etichetta esiste già',
        'tagEmpty': 'Il nome dell\'etichetta non può essere vuoto',
        'deleteTagConfirm': 'Rimuovere questa etichetta?',
        'tagsUpdated': 'Etichette aggiornate',
        'languageLabel': 'Lingua',
        'autoDetect': 'Rilevamento automatico',
        'summonerRevealEnabled': 'Rivelazione evocatore',
        'summonerRevealDesc': 'Mostra statistiche giocatori (rank, winrate, KDA) nella barra laterale',
    },
    // 日本語 (ja_JP)
    'ja_JP': {
        // UI Components
        'dodgeList': 'ドッジリスト',
        'addPlayer': 'プレイヤー追加',
        'viewList': 'リスト表示',
        'clearList': 'リストクリア',
        'clearListConfirmTitle': 'ドッジリストをクリア',
        'clearListConfirmMessage': 'ドッジリストをエクスポートして保存しましたか？この操作によりドッジリストの全プレイヤーが削除されます。',
        'clearListConfirmYes': 'クリア',
        'playerPlaceholder': 'プレイヤー名#タグ (例: PlayerName#12345)',
        'playerAdded': '{0} を追加しました',
        'playerExists': 'プレイヤー {0} は既にドッジリストに存在します',
        'dodgeTracker': 'ドッジトラッカー',
        'dodgeTrackerCapital': 'ドッジトラッカー',
        'yourDodgeList': 'あなたのドッジリスト',
        'searchPlayers': 'プレイヤーを検索...',
        'emptyList': 'ドッジリストにプレイヤーがいません',
        'close': '閉じる',
        'note': 'メモ',
        'remove': '削除',
        'save': '保存',
        'noteSaved': 'メモを保存しました',
        'playerRemoved': '{0} をドッジリストから削除しました',
        'noteFor': '{0} のメモ',
        'all': '全て',
        'afk': 'AFK',
        'troll': 'トロール',
        'unskilled': '初心者',
        'mykiller': 'キラー',
        'tagsLabel': 'タグ: {0}',
        'noteLabel': 'メモ: {0}',
        'noPlayersDetected': 'ドッジリストのプレイヤーは検出されませんでした',
        'playerDetected': '検出: {0} {1}',
        'dodgeNote': 'ドッジリストに追加',
        'importDodgeList': 'ドッジリストをインポート',
        'exportDodgeList': 'ドッジリストをエクスポート',
        'importData': 'データをインポート',
        'pasteJsonData': '以前にエクスポートしたJSONデータを貼り付けてください：',
        'importSuccess': '{0} 人のプレイヤーをインポートしました',
        'importFailed': 'インポート失敗：無効なJSON形式',
        'importFailedFormat': 'インポート失敗：データ形式が不正です、配列である必要があります',
        'enterValidJson': '有効なJSONデータを入力してください',
        'cannotGetPlayerName': 'プレイヤー名を取得できません、再試行してください',
        'playerUpdated': 'ドッジリストの {0} を更新しました',
        'exportSuccess': 'ドッジリストのデータをクリップボードにコピーしました',
        'exportFailed': 'エクスポート失敗、再試行してください',
        'add': '追加',
        'update': '更新',
        'cancel': 'キャンセル',
        'selectTags': 'タグを選択',
        'pasteMethod': '貼り付け',
        'fileMethod': 'ファイル',
        'selectJsonFile': 'JSONファイルを選択してください',
        'selectFile': 'ファイルを選択',
        'noFileSelected': 'まずファイルを選択してください',
        'fileReadError': 'ファイルの読み取りに失敗しました',
        'manageTags': 'タグを管理',
        'customTags': 'カスタムタグ',
        'addCustomTag': 'タグを追加',
        'tagNamePlaceholder': 'タグ名を入力',
        'tagExists': 'タグは既に存在します',
        'tagEmpty': 'タグ名は空にできません',
        'deleteTagConfirm': 'このタグを削除しますか？',
        'tagsUpdated': 'タグを更新しました',
        'languageLabel': '言語',
        'autoDetect': '自動検出',
        'summonerRevealEnabled': 'サモナー情報',
        'summonerRevealDesc': 'チャンピオン選択時のサイドバーにプレイヤー戦績（ランク、勝率、KDA）を表示',
    },
    // 한국어 (ko_KR)
    'ko_KR': {
        // UI Components
        'dodgeList': '닷지 목록',
        'addPlayer': '플레이어 추가',
        'viewList': '목록 보기',
        'clearList': '목록 비우기',
        'clearListConfirmTitle': '닷지 목록 비우기',
        'clearListConfirmMessage': '닷지 목록을 내보내고 저장하셨나요? 이 작업은 닷지 목록의 모든 플레이어를 삭제합니다.',
        'clearListConfirmYes': '비우기',
        'playerPlaceholder': '플레이어명#태그 (예: PlayerName#12345)',
        'playerAdded': '{0} 추가됨',
        'playerExists': '플레이어 {0}은(는) 이미 닷지 목록에 있습니다',
        'dodgeTracker': '닷지 트래커',
        'dodgeTrackerCapital': '닷지 트래커',
        'yourDodgeList': '나의 닷지 목록',
        'searchPlayers': '플레이어 검색...',
        'emptyList': '닷지 목록에 플레이어가 없습니다',
        'close': '닫기',
        'note': '메모',
        'remove': '제거',
        'save': '저장',
        'noteSaved': '메모가 저장되었습니다',
        'playerRemoved': '{0}이(가) 닷지 목록에서 제거되었습니다',
        'noteFor': '{0}의 메모',
        'all': '전체',
        'afk': '잠수',
        'troll': '트롤',
        'unskilled': '미숙',
        'mykiller': '나를 죽인 자',
        'tagsLabel': '태그: {0}',
        'noteLabel': '메모: {0}',
        'noPlayersDetected': '닷지 목록의 플레이어가 감지되지 않았습니다',
        'playerDetected': '감지됨: {0} {1}',
        'dodgeNote': '닷지 목록에 추가',
        'importDodgeList': '닷지 목록 가져오기',
        'exportDodgeList': '닷지 목록 내보내기',
        'importData': '데이터 가져오기',
        'pasteJsonData': '이전에 내보낸 JSON 데이터를 붙여넣으세요:',
        'importSuccess': '{0}명의 플레이어를 가져왔습니다',
        'importFailed': '가져오기 실패: 잘못된 JSON 형식',
        'importFailedFormat': '가져오기 실패: 데이터 형식이 올바르지 않습니다, 배열이어야 합니다',
        'enterValidJson': '올바른 JSON 데이터를 입력하세요',
        'cannotGetPlayerName': '플레이어 이름을 가져올 수 없습니다, 다시 시도하세요',
        'playerUpdated': '닷지 목록에서 {0}이(가) 업데이트되었습니다',
        'exportSuccess': '닷지 목록 데이터가 클립보드에 복사되었습니다',
        'exportFailed': '내보내기 실패, 다시 시도하세요',
        'add': '추가',
        'update': '업데이트',
        'cancel': '취소',
        'selectTags': '태그 선택',
        'pasteMethod': '붙여넣기',
        'fileMethod': '파일',
        'selectJsonFile': 'JSON 파일을 선택하세요',
        'selectFile': '파일 선택',
        'noFileSelected': '먼저 파일을 선택하세요',
        'fileReadError': '파일 읽기 실패',
        'manageTags': '태그 관리',
        'customTags': '사용자 정의 태그',
        'addCustomTag': '태그 추가',
        'tagNamePlaceholder': '태그 이름 입력',
        'tagExists': '태그가 이미 존재합니다',
        'tagEmpty': '태그 이름은 비워둘 수 없습니다',
        'deleteTagConfirm': '이 태그를 삭제하시겠습니까?',
        'tagsUpdated': '태그가 업데이트되었습니다',
        'languageLabel': '언어',
        'autoDetect': '자동 감지',
        'summonerRevealEnabled': '소환사 정보',
        'summonerRevealDesc': '챔피언 선택 시 사이드바에 플레이어 전적(랭크, 승률, KDA) 표시',
    },
    // Polski (pl_PL)
    'pl_PL': {
        // UI Components
        'dodgeList': 'Lista Dodge',
        'addPlayer': 'Dodaj gracza',
        'viewList': 'Zobacz listę',
        'clearList': 'Wyczyść listę',
        'clearListConfirmTitle': 'Wyczyść listę Dodge',
        'clearListConfirmMessage': 'Czy wyeksportowałeś i zapisałeś listę Dodge? Ta operacja usunie wszystkich graczy z listy Dodge.',
        'clearListConfirmYes': 'Wyczyść',
        'playerPlaceholder': 'NazwaGracza#Tag (np.: PlayerName#12345)',
        'playerAdded': 'Dodano {0}',
        'playerExists': 'Gracz {0} jest już na liście Dodge',
        'dodgeTracker': 'Tracker Dodge',
        'dodgeTrackerCapital': 'TRACKER DODGE',
        'yourDodgeList': 'Twoja lista Dodge',
        'searchPlayers': 'Szukaj graczy...',
        'emptyList': 'Brak graczy na Twojej liście Dodge',
        'close': 'Zamknij',
        'note': 'Notatka',
        'remove': 'Usuń',
        'save': 'Zapisz',
        'noteSaved': 'Notatka zapisana pomyślnie',
        'playerRemoved': '{0} został usunięty z listy Dodge',
        'noteFor': 'Notatka dla {0}',
        'all': 'Wszyscy',
        'afk': 'AFK',
        'troll': 'Troll',
        'unskilled': 'Niedoświadczony',
        'mykiller': 'Mój zabójca',
        'tagsLabel': 'Tagi: {0}',
        'noteLabel': 'Notatka: {0}',
        'noPlayersDetected': 'Nie wykryto graczy z listy Dodge',
        'playerDetected': 'Wykryto {0} {1}',
        'dodgeNote': 'Dodaj do listy Dodge',
        'importDodgeList': 'Importuj listę Dodge',
        'exportDodgeList': 'Eksportuj listę Dodge',
        'importData': 'Importuj dane',
        'pasteJsonData': 'Wklej wcześniej wyeksportowane dane JSON:',
        'importSuccess': 'Pomyślnie zaimportowano {0} graczy',
        'importFailed': 'Import nieudany: nieprawidłowy format JSON',
        'importFailedFormat': 'Import nieudany: nieprawidłowy format danych, powinna być tablica',
        'enterValidJson': 'Wprowadź prawidłowe dane JSON',
        'cannotGetPlayerName': 'Nie można uzyskać nazwy gracza, spróbuj ponownie',
        'playerUpdated': 'Zaktualizowano {0} na liście Dodge',
        'exportSuccess': 'Dane listy Dodge skopiowane do schowka',
        'exportFailed': 'Eksport nieudany, spróbuj ponownie',
        'add': 'Dodaj',
        'update': 'Aktualizuj',
        'cancel': 'Anuluj',
        'selectTags': 'Wybierz tagi',
        'pasteMethod': 'Wklej',
        'fileMethod': 'Plik',
        'selectJsonFile': 'Wybierz plik JSON',
        'selectFile': 'Wybierz plik',
        'noFileSelected': 'Najpierw wybierz plik',
        'fileReadError': 'Błąd odczytu pliku',
        'manageTags': 'Zarządzaj tagami',
        'customTags': 'Niestandardowe tagi',
        'addCustomTag': 'Dodaj tag',
        'tagNamePlaceholder': 'Wprowadź nazwę tagu',
        'tagExists': 'Tag już istnieje',
        'tagEmpty': 'Nazwa tagu nie może być pusta',
        'deleteTagConfirm': 'Usunąć ten tag?',
        'tagsUpdated': 'Tagi zaktualizowane',
        'languageLabel': 'Język',
        'autoDetect': 'Automatyczne wykrywanie',
        'summonerRevealEnabled': 'Statystyki graczy',
        'summonerRevealDesc': 'Pokaż statystyki graczy (rank, winrate, KDA) w panelu bocznym',
    },
    // Português (pt_BR)
    'pt_BR': {
        // UI Components
        'dodgeList': 'Lista de Dodge',
        'addPlayer': 'Adicionar jogador',
        'viewList': 'Ver lista',
        'clearList': 'Limpar lista',
        'clearListConfirmTitle': 'Limpar lista de Dodge',
        'clearListConfirmMessage': 'Você exportou e salvou a lista de Dodge? Esta operação removerá todos os jogadores da lista de Dodge.',
        'clearListConfirmYes': 'Limpar',
        'playerPlaceholder': 'NomeDoJogador#Tag (ex.: PlayerName#12345)',
        'playerAdded': '{0} adicionado',
        'playerExists': 'O jogador {0} já está na lista de Dodge',
        'dodgeTracker': 'Rastreador de Dodge',
        'dodgeTrackerCapital': 'RASTREADOR DE DODGE',
        'yourDodgeList': 'Sua lista de Dodge',
        'searchPlayers': 'Buscar jogadores...',
        'emptyList': 'Não há jogadores na sua lista de Dodge',
        'close': 'Fechar',
        'note': 'Nota',
        'remove': 'Remover',
        'save': 'Salvar',
        'noteSaved': 'Nota salva com sucesso',
        'playerRemoved': '{0} foi removido da lista de Dodge',
        'noteFor': 'Nota para {0}',
        'all': 'Todos',
        'afk': 'AFK',
        'troll': 'Troll',
        'unskilled': 'Inhabilidoso',
        'mykiller': 'Meu assassino',
        'tagsLabel': 'Tags: {0}',
        'noteLabel': 'Nota: {0}',
        'noPlayersDetected': 'Nenhum jogador da lista de Dodge detectado',
        'playerDetected': 'Detectado {0} {1}',
        'dodgeNote': 'Adicionar à lista de Dodge',
        'importDodgeList': 'Importar lista de Dodge',
        'exportDodgeList': 'Exportar lista de Dodge',
        'importData': 'Importar dados',
        'pasteJsonData': 'Cole os dados JSON exportados anteriormente:',
        'importSuccess': '{0} jogadores importados com sucesso',
        'importFailed': 'Falha na importação: formato JSON inválido',
        'importFailedFormat': 'Falha na importação: formato de dados incorreto, deve ser um array',
        'enterValidJson': 'Insira dados JSON válidos',
        'cannotGetPlayerName': 'Não foi possível obter o nome do jogador, tente novamente',
        'playerUpdated': '{0} atualizado na lista de Dodge',
        'exportSuccess': 'Dados da lista de Dodge copiados para a área de transferência',
        'exportFailed': 'Falha na exportação, tente novamente',
        'add': 'Adicionar',
        'update': 'Atualizar',
        'cancel': 'Cancelar',
        'selectTags': 'Selecionar tags',
        'pasteMethod': 'Colar',
        'fileMethod': 'Arquivo',
        'selectJsonFile': 'Selecione um arquivo JSON',
        'selectFile': 'Selecionar arquivo',
        'noFileSelected': 'Selecione um arquivo primeiro',
        'fileReadError': 'Falha ao ler o arquivo',
        'manageTags': 'Gerenciar tags',
        'customTags': 'Tags personalizadas',
        'addCustomTag': 'Adicionar tag',
        'tagNamePlaceholder': 'Digite o nome da tag',
        'tagExists': 'A tag já existe',
        'tagEmpty': 'O nome da tag não pode ser vazio',
        'deleteTagConfirm': 'Remover esta tag?',
        'tagsUpdated': 'Tags atualizadas',
        'languageLabel': 'Idioma',
        'autoDetect': 'Detecção automática',
        'summonerRevealEnabled': 'Revelar invocador',
        'summonerRevealDesc': 'Mostrar estatísticas de jogadores (rank, winrate, KDA) na barra lateral',
    },
    // Română (ro_RO)
    'ro_RO': {
        // UI Components
        'dodgeList': 'Listă Dodge',
        'addPlayer': 'Adaugă jucător',
        'viewList': 'Vezi lista',
        'clearList': 'Golește lista',
        'clearListConfirmTitle': 'Golește lista Dodge',
        'clearListConfirmMessage': 'Ai exportat și salvat lista Dodge? Această operațiune va elimina toți jucătorii din lista Dodge.',
        'clearListConfirmYes': 'Golește',
        'playerPlaceholder': 'NumeJucător#Tag (ex.: PlayerName#12345)',
        'playerAdded': '{0} adăugat',
        'playerExists': 'Jucătorul {0} este deja în lista Dodge',
        'dodgeTracker': 'Urmăritor Dodge',
        'dodgeTrackerCapital': 'URMĂRITOR DODGE',
        'yourDodgeList': 'Lista ta Dodge',
        'searchPlayers': 'Caută jucători...',
        'emptyList': 'Nu sunt jucători în lista ta Dodge',
        'close': 'Închide',
        'note': 'Notă',
        'remove': 'Elimină',
        'save': 'Salvează',
        'noteSaved': 'Notă salvată cu succes',
        'playerRemoved': '{0} a fost eliminat din lista Dodge',
        'noteFor': 'Notă pentru {0}',
        'all': 'Toți',
        'afk': 'AFK',
        'troll': 'Troll',
        'unskilled': 'Slab',
        'mykiller': 'Ucigașul meu',
        'tagsLabel': 'Etichete: {0}',
        'noteLabel': 'Notă: {0}',
        'noPlayersDetected': 'Nu au fost detectați jucători din lista Dodge',
        'playerDetected': 'Detectat {0} {1}',
        'dodgeNote': 'Adaugă în lista Dodge',
        'importDodgeList': 'Importă lista Dodge',
        'exportDodgeList': 'Exportă lista Dodge',
        'importData': 'Importă date',
        'pasteJsonData': 'Lipește datele JSON exportate anterior:',
        'importSuccess': '{0} jucători importați cu succes',
        'importFailed': 'Import eșuat: format JSON invalid',
        'importFailedFormat': 'Import eșuat: format de date incorect, trebuie să fie un array',
        'enterValidJson': 'Introdu date JSON valide',
        'cannotGetPlayerName': 'Nu se poate obține numele jucătorului, încearcă din nou',
        'playerUpdated': '{0} actualizat în lista Dodge',
        'exportSuccess': 'Datele listei Dodge copiate în clipboard',
        'exportFailed': 'Export eșuat, încearcă din nou',
        'add': 'Adaugă',
        'update': 'Actualizează',
        'cancel': 'Anulează',
        'selectTags': 'Selectează etichete',
        'pasteMethod': 'Lipește',
        'fileMethod': 'Fișier',
        'selectJsonFile': 'Selectează un fișier JSON',
        'selectFile': 'Selectează fișier',
        'noFileSelected': 'Selectează mai întâi un fișier',
        'fileReadError': 'Citire fișier eșuată',
        'manageTags': 'Gestionează etichete',
        'customTags': 'Etichete personalizate',
        'addCustomTag': 'Adaugă etichetă',
        'tagNamePlaceholder': 'Introdu numele etichetei',
        'tagExists': 'Eticheta există deja',
        'tagEmpty': 'Numele etichetei nu poate fi gol',
        'deleteTagConfirm': 'Elimini această etichetă?',
        'tagsUpdated': 'Etichete actualizate',
        'languageLabel': 'Limbă',
        'autoDetect': 'Detectare automată',
        'summonerRevealEnabled': 'Informații jucători',
        'summonerRevealDesc': 'Afișează statisticile jucătorilor (rank, winrate, KDA) în bara laterală',
    },
    // ภาษาไทย (th_TH)
    'th_TH': {
        // UI Components
        'dodgeList': 'รายการดอจ',
        'addPlayer': 'เพิ่มผู้เล่น',
        'viewList': 'ดูรายการ',
        'clearList': 'ล้างรายการ',
        'clearListConfirmTitle': 'ล้างรายการดอจ',
        'clearListConfirmMessage': 'คุณได้ส่งออกและบันทึกรายการดอจแล้วหรือไม่? การดำเนินการนี้จะลบผู้เล่นทั้งหมดออกจากรายการดอจ',
        'clearListConfirmYes': 'ล้าง',
        'playerPlaceholder': 'ชื่อผู้เล่น#แท็ก (เช่น: PlayerName#12345)',
        'playerAdded': 'เพิ่ม {0} แล้ว',
        'playerExists': 'ผู้เล่น {0} อยู่ในรายการดอจแล้ว',
        'dodgeTracker': 'ตัวติดตามดอจ',
        'dodgeTrackerCapital': 'ตัวติดตามดอจ',
        'yourDodgeList': 'รายการดอจของคุณ',
        'searchPlayers': 'ค้นหาผู้เล่น...',
        'emptyList': 'ไม่มีผู้เล่นในรายการดอจของคุณ',
        'close': 'ปิด',
        'note': 'บันทึก',
        'remove': 'ลบ',
        'save': 'บันทึก',
        'noteSaved': 'บันทึกบันทึกสำเร็จ',
        'playerRemoved': '{0} ถูกลบออกจากรายการดอจแล้ว',
        'noteFor': 'บันทึกสำหรับ {0}',
        'all': 'ทั้งหมด',
        'afk': 'AFK',
        'troll': 'โทรลล์',
        'unskilled': 'ฝีมือไม่ดี',
        'mykiller': 'คนที่ฆ้าฉัน',
        'tagsLabel': 'แท็ก: {0}',
        'noteLabel': 'บันทึก: {0}',
        'noPlayersDetected': 'ไม่พบผู้เล่นจากรายการดอจ',
        'playerDetected': 'พบ {0} {1}',
        'dodgeNote': 'เพิ่มไปยังรายการดอจ',
        'importDodgeList': 'นำเข้ารายการดอจ',
        'exportDodgeList': 'ส่งออกรายการดอจ',
        'importData': 'นำเข้าข้อมูล',
        'pasteJsonData': 'กรุณาวางข้อมูล JSON ที่ส่งออกก่อนหน้านี้:',
        'importSuccess': 'นำเข้า {0} ผู้เล่นสำเร็จ',
        'importFailed': 'นำเข้าล้มเหลว: รูปแบบ JSON ไม่ถูกต้อง',
        'importFailedFormat': 'นำเข้าล้มเหลว: รูปแบบข้อมูลไม่ถูกต้อง ต้องเป็น array',
        'enterValidJson': 'กรุณาใส่ข้อมูล JSON ที่ถูกต้อง',
        'cannotGetPlayerName': 'ไม่สามารถรับชื่อผู้เล่นได้ กรุณาลองอีกครั้ง',
        'playerUpdated': 'อัปเดต {0} ในรายการดอจแล้ว',
        'exportSuccess': 'ข้อมูลรายการดอจถูกคัดลอกไปยังคลิปบอร์ด',
        'exportFailed': 'ส่งออกล้มเหลว กรุณาลองอีกครั้ง',
        'add': 'เพิ่ม',
        'update': 'อัปเดต',
        'cancel': 'ยกเลิก',
        'selectTags': 'เลือกแท็ก',
        'pasteMethod': 'วาง',
        'fileMethod': 'ไฟล์',
        'selectJsonFile': 'กรุณาเลือกไฟล์ JSON',
        'selectFile': 'เลือกไฟล์',
        'noFileSelected': 'กรุณาเลือกไฟล์ก่อน',
        'fileReadError': 'อ่านไฟล์ล้มเหลว',
        'manageTags': 'จัดการแท็ก',
        'customTags': 'แท็กกำหนดเอง',
        'addCustomTag': 'เพิ่มแท็ก',
        'tagNamePlaceholder': 'ป้อนชื่อแท็ก',
        'tagExists': 'แท็กมีอยู่แล้ว',
        'tagEmpty': 'ชื่อแท็กต้องไม่ว่าง',
        'deleteTagConfirm': 'ลบแท็กนี้?',
        'tagsUpdated': 'แท็กอัปเดตแล้ว',
        'languageLabel': 'ภาษา',
        'autoDetect': 'ตรวจจับอัตโนมัติ',
        'summonerRevealEnabled': 'ข้อมูลผู้เล่น',
        'summonerRevealDesc': 'แสดงสถิติผู้เล่น (แรงก์, อัตราชนะ, KDA) ในแถบด้านข้าง',
    },
    // Türkçe (tr_TR)
    'tr_TR': {
        // UI Components
        'dodgeList': 'Dodge Listesi',
        'addPlayer': 'Oyuncu ekle',
        'viewList': 'Listeyi gör',
        'clearList': 'Listeyi temizle',
        'clearListConfirmTitle': 'Dodge listesini temizle',
        'clearListConfirmMessage': 'Dodge listesini dışa aktarıp kaydettiniz mi? Bu işlem dodge listesindeki tüm oyuncuları silecek.',
        'clearListConfirmYes': 'Temizle',
        'playerPlaceholder': 'OyuncuAdı#Etiket (örn.: PlayerName#12345)',
        'playerAdded': '{0} eklendi',
        'playerExists': '{0} oyuncusu zaten dodge listesinde',
        'dodgeTracker': 'Dodge Takipçisi',
        'dodgeTrackerCapital': 'DODGE TAKİPÇİSİ',
        'yourDodgeList': 'Dodge listeniz',
        'searchPlayers': 'Oyuncu ara...',
        'emptyList': 'Dodge listenizde oyuncu yok',
        'close': 'Kapat',
        'note': 'Not',
        'remove': 'Kaldır',
        'save': 'Kaydet',
        'noteSaved': 'Not başarıyla kaydedildi',
        'playerRemoved': '{0} dodge listesinden kaldırıldı',
        'noteFor': '{0} için not',
        'all': 'Tümü',
        'afk': 'AFK',
        'troll': 'Troll',
        'unskilled': 'Acemi',
        'mykiller': 'Katilim',
        'tagsLabel': 'Etiketler: {0}',
        'noteLabel': 'Not: {0}',
        'noPlayersDetected': 'Dodge listesinden oyuncu tespit edilmedi',
        'playerDetected': 'Tespit edildi: {0} {1}',
        'dodgeNote': 'Dodge listesine ekle',
        'importDodgeList': 'Dodge listesini içe aktar',
        'exportDodgeList': 'Dodge listesini dışa aktar',
        'importData': 'Veri içe aktar',
        'pasteJsonData': 'Daha önce dışa aktarılan JSON verilerini yapıştırın:',
        'importSuccess': '{0} oyuncu başarıyla içe aktarıldı',
        'importFailed': 'İçe aktarma başarısız: Geçersiz JSON formatı',
        'importFailedFormat': 'İçe aktarma başarısız: Veri formatı yanlış, dizi olmalıdır',
        'enterValidJson': 'Geçerli JSON verileri girin',
        'cannotGetPlayerName': 'Oyuncu adı alınamıyor, tekrar deneyin',
        'playerUpdated': 'Dodge listesinde {0} güncellendi',
        'exportSuccess': 'Dodge listesi verileri panoya kopyalandı',
        'exportFailed': 'Dışa aktarma başarısız, tekrar deneyin',
        'add': 'Ekle',
        'update': 'Güncelle',
        'cancel': 'İptal',
        'selectTags': 'Etiket seç',
        'pasteMethod': 'Yapıştır',
        'fileMethod': 'Dosya',
        'selectJsonFile': 'Bir JSON dosyası seçin',
        'selectFile': 'Dosya seç',
        'noFileSelected': 'Önce bir dosya seçin',
        'fileReadError': 'Dosya okuma başarısız',
        'manageTags': 'Etiketleri yönet',
        'customTags': 'Özel etiketler',
        'addCustomTag': 'Etiket ekle',
        'tagNamePlaceholder': 'Etiket adını girin',
        'tagExists': 'Etiket zaten mevcut',
        'tagEmpty': 'Etiket adı boş olamaz',
        'deleteTagConfirm': 'Bu etiket kaldırılsın mı?',
        'tagsUpdated': 'Etiketler güncellendi',
        'languageLabel': 'Dil',
        'autoDetect': 'Otomatik algıla',
        'summonerRevealEnabled': 'Sihildar Bilgisi',
        'summonerRevealDesc': 'Oyuncu istatistiklerini (rank, winrate, KDA) yan panelde göster',
    },
    // Tiếng Việt (vi_VN)
    'vi_VN': {
        // UI Components
        'dodgeList': 'Danh sách Dodge',
        'addPlayer': 'Thêm người chơi',
        'viewList': 'Xem danh sách',
        'clearList': 'Xóa danh sách',
        'clearListConfirmTitle': 'Xóa danh sách Dodge',
        'clearListConfirmMessage': 'Bạn đã xuất và lưu danh sách Dodge chưa? Thao tác này sẽ xóa tất cả người chơi khỏi danh sách Dodge.',
        'clearListConfirmYes': 'Xóa',
        'playerPlaceholder': 'TênNgườiChơi#Thẻ (vd.: PlayerName#12345)',
        'playerAdded': 'Đã thêm {0}',
        'playerExists': 'Người chơi {0} đã có trong danh sách Dodge',
        'dodgeTracker': 'Trình theo dõi Dodge',
        'dodgeTrackerCapital': 'TRÌNH THEO DÕI DODGE',
        'yourDodgeList': 'Danh sách Dodge của bạn',
        'searchPlayers': 'Tìm kiếm người chơi...',
        'emptyList': 'Không có người chơi trong danh sách Dodge',
        'close': 'Đóng',
        'note': 'Ghi chú',
        'remove': 'Xóa',
        'save': 'Lưu',
        'noteSaved': 'Đã lưu ghi chú thành công',
        'playerRemoved': '{0} đã được xóa khỏi danh sách Dodge',
        'noteFor': 'Ghi chú cho {0}',
        'all': 'Tất cả',
        'afk': 'AFK',
        'troll': 'Troll',
        'unskilled': 'Kém',
        'mykiller': 'Kẻ giết tôi',
        'tagsLabel': 'Thẻ: {0}',
        'noteLabel': 'Ghi chú: {0}',
        'noPlayersDetected': 'Không phát hiện người chơi từ danh sách Dodge',
        'playerDetected': 'Phát hiện: {0} {1}',
        'dodgeNote': 'Thêm vào danh sách Dodge',
        'importDodgeList': 'Nhập danh sách Dodge',
        'exportDodgeList': 'Xuất danh sách Dodge',
        'importData': 'Nhập dữ liệu',
        'pasteJsonData': 'Vui lòng dán dữ liệu JSON đã xuất trước đó:',
        'importSuccess': 'Đã nhập thành công {0} người chơi',
        'importFailed': 'Nhập thất bại: Định dạng JSON không hợp lệ',
        'importFailedFormat': 'Nhập thất bại: Định dạng dữ liệu không đúng, phải là mảng',
        'enterValidJson': 'Vui lòng nhập dữ liệu JSON hợp lệ',
        'cannotGetPlayerName': 'Không thể lấy tên người chơi, vui lòng thử lại',
        'playerUpdated': 'Đã cập nhật {0} trong danh sách Dodge',
        'exportSuccess': 'Dữ liệu danh sách Dodge đã được sao chép vào clipboard',
        'exportFailed': 'Xuất thất bại, vui lòng thử lại',
        'add': 'Thêm',
        'update': 'Cập nhật',
        'cancel': 'Hủy',
        'selectTags': 'Chọn thẻ',
        'pasteMethod': 'Dán',
        'fileMethod': 'Tệp',
        'selectJsonFile': 'Vui lòng chọn tệp JSON',
        'selectFile': 'Chọn tệp',
        'noFileSelected': 'Vui lòng chọn tệp trước',
        'fileReadError': 'Đọc tệp thất bại',
        'manageTags': 'Quản lý thẻ',
        'customTags': 'Thẻ tùy chỉnh',
        'addCustomTag': 'Thêm thẻ',
        'tagNamePlaceholder': 'Nhập tên thẻ',
        'tagExists': 'Thẻ đã tồn tại',
        'tagEmpty': 'Tên thẻ không được để trống',
        'deleteTagConfirm': 'Xóa thẻ này?',
        'tagsUpdated': 'Đã cập nhật thẻ',
        'languageLabel': 'Ngôn ngữ',
        'autoDetect': 'Tự động phát hiện',
        'summonerRevealEnabled': 'Thông tin người chơi',
        'summonerRevealDesc': 'Hiển thị thống kê người chơi (rank, winrate, KDA) ở thanh bên',
    },
    // 中文（马来西亚） (zh_MY)
    'zh_MY': {
        // UI Components
        'dodgeList': '躲避列表',
        'addPlayer': '添加玩家',
        'viewList': '查看列表',
        'clearList': '清空列表',
        'clearListConfirmTitle': '清空躲避追踪列表',
        'clearListConfirmMessage': '请问你是否已经导出保存了躲避追踪列表名单？此操作会清除躲避追踪列表的所有玩家。',
        'clearListConfirmYes': '清空',
        'playerPlaceholder': '玩家名称#唯一ID（例如：最后的谜底#58374）',
        'playerAdded': '已添加 {0}',
        'playerExists': '玩家 {0} 已经在躲避列表中',
        'dodgeTracker': '躲避追踪器',
        'dodgeTrackerCapital': '躲避追踪器',
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
        'all': '全部',
        'afk': '挂机',
        'troll': '搞事',
        'unskilled': '技术差',
        'mykiller': '克星',
        'tagsLabel': '标签: {0}',
        'noteLabel': '备注: {0}',
        'noPlayersDetected': '未检测到躲避列表中的玩家',
        'playerDetected': '检测到 {0} {1}',
        'dodgeNote': '躲避追踪列表',
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
        'pasteMethod': '粘贴导入',
        'fileMethod': '文件导入',
        'selectJsonFile': '请选择JSON文件',
        'selectFile': '选择文件',
        'noFileSelected': '请先选择文件',
        'fileReadError': '文件读取失败',
        'manageTags': '管理标签',
        'customTags': '自定义标签',
        'addCustomTag': '添加标签',
        'tagNamePlaceholder': '输入标签名称',
        'tagExists': '标签已存在',
        'tagEmpty': '标签名称不能为空',
        'deleteTagConfirm': '确定删除此标签？',
        'tagsUpdated': '标签已更新',
        'languageLabel': '语言',
        'autoDetect': '自动检测',
        'summonerRevealEnabled': '召唤师信息',
        'summonerRevealDesc': '选人阶段显示玩家战绩（段位、胜率、KDA）侧边栏',
    },
    // 繁體中文 (zh_TW)
    'zh_TW': {
        // UI Components
        'dodgeList': '躲避列表',
        'addPlayer': '新增玩家',
        'viewList': '檢視列表',
        'clearList': '清空列表',
        'clearListConfirmTitle': '清空躲避追蹤列表',
        'clearListConfirmMessage': '請問你是否已經匯出儲存了躲避追蹤列表名單？此操作會清除躲避追蹤列表的所有玩家。',
        'clearListConfirmYes': '清空',
        'playerPlaceholder': '玩家名稱#唯一ID（例如：最後的謎底#58374）',
        'playerAdded': '已新增 {0}',
        'playerExists': '玩家 {0} 已經在躲避列表中',
        'dodgeTracker': '躲避追蹤器',
        'dodgeTrackerCapital': '躲避追蹤器',
        'yourDodgeList': '您的躲避列表',
        'searchPlayers': '搜尋玩家...',
        'emptyList': '您的躲避列表為空。',
        'close': '關閉',
        'note': '備註',
        'remove': '移除',
        'save': '儲存',
        'noteSaved': '備註儲存成功',
        'playerRemoved': '{0} 已從躲避列表中移除',
        'noteFor': '{0} 的備註',
        'all': '全部',
        'afk': '掛機',
        'troll': '搞事',
        'unskilled': '技術差',
        'mykiller': '剋星',
        'tagsLabel': '標籤: {0}',
        'noteLabel': '備註: {0}',
        'noPlayersDetected': '未偵測到躲避列表中的玩家',
        'playerDetected': '偵測到 {0} {1}',
        'dodgeNote': '躲避追蹤列表',
        'importDodgeList': '匯入躲避列表',
        'exportDodgeList': '匯出躲避列表',
        'importData': '匯入資料',
        'pasteJsonData': '請貼上之前匯出的JSON資料：',
        'importSuccess': '成功匯入 {0} 個玩家',
        'importFailed': '匯入失敗：無效的JSON格式',
        'importFailedFormat': '匯入失敗：資料格式不正確，應為陣列',
        'enterValidJson': '請輸入有效的JSON資料',
        'cannotGetPlayerName': '無法取得玩家名稱，請重試',
        'playerUpdated': '已更新 {0} 到躲避列表',
        'exportSuccess': '躲避列表資料已複製到剪貼簿',
        'exportFailed': '匯出失敗，請重試',
        'add': '新增',
        'update': '更新',
        'cancel': '取消',
        'selectTags': '選擇標籤',
        'pasteMethod': '貼上匯入',
        'fileMethod': '檔案匯入',
        'selectJsonFile': '請選擇JSON檔案',
        'selectFile': '選擇檔案',
        'noFileSelected': '請先選擇檔案',
        'fileReadError': '檔案讀取失敗',
        'manageTags': '管理標籤',
        'customTags': '自訂標籤',
        'addCustomTag': '新增標籤',
        'tagNamePlaceholder': '輸入標籤名稱',
        'tagExists': '標籤已存在',
        'tagEmpty': '標籤名稱不能為空',
        'deleteTagConfirm': '確定刪除此標籤？',
        'tagsUpdated': '標籤已更新',
        'languageLabel': '語言',
        'autoDetect': '自動偵測',
        'summonerRevealEnabled': '召喚師資訊',
        'summonerRevealDesc': '選人階段顯示玩家戰績（段位、勝率、KDA）側邊欄',
    },
};

// Language group mappings for easier fallback logic
const languageGroups = {
    'chinese': ['zh_CN', 'zh_MY', 'zh_TW'],
    'english': ['en_US', 'en_AU', 'en_GB', 'en_PH', 'en_SG'],
    'spanish': ['es_AR', 'es_ES', 'es_MX'],
    'russian': ['ru_RU'],
    'french': ['fr_FR'],
    'hungarian': ['hu_HU'],
    'italian': ['it_IT'],
    'japanese': ['ja_JP'],
    'korean': ['ko_KR'],
    'polish': ['pl_PL'],
    'portuguese': ['pt_BR', 'pt_PT'],
    'romanian': ['ro_RO'],
    'thai': ['th_TH'],
    'turkish': ['tr_TR'],
    'vietnamese': ['vi_VN'],
    'indonesian': ['id_ID'],
    'arabic': ['ar_AE'],
    'czech': ['cs_CZ'],
    'german': ['de_DE'],
    'greek': ['el_GR']
};

// Primary language for each group (used as fallback)
const groupPrimary = {
    'chinese': 'zh_CN',
    'english': 'en_US',
    'spanish': 'es_ES',
    'russian': 'ru_RU',
    'french': 'fr_FR',
    'hungarian': 'hu_HU',
    'italian': 'it_IT',
    'japanese': 'ja_JP',
    'korean': 'ko_KR',
    'polish': 'pl_PL',
    'portuguese': 'pt_BR',
    'romanian': 'ro_RO',
    'thai': 'th_TH',
    'turkish': 'tr_TR',
    'vietnamese': 'vi_VN',
    'indonesian': 'id_ID',
    'arabic': 'ar_AE',
    'czech': 'cs_CZ',
    'german': 'de_DE',
    'greek': 'el_GR'
};

/**
 * Get the language group for a given locale
 * @param {string} locale - The locale code
 * @returns {string|null} - The language group name or null if not found
 */
function getLanguageGroup(locale) {
    for (const [group, locales] of Object.entries(languageGroups)) {
        if (locales.includes(locale)) {
            return group;
        }
    }
    return null;
}

/**
 * Get the primary locale for a language group
 * @param {string} locale - The locale code
 * @returns {string} - The primary locale for the group
 */
function getPrimaryLocale(locale) {
    const group = getLanguageGroup(locale);
    return group ? groupPrimary[group] : 'en_US';
}

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
    let text;
    
    // Try current locale first
    if (translations[currentLocale] && translations[currentLocale][key]) {
        text = translations[currentLocale][key];
    }
    // Try primary locale of the same language group
    else if (currentLocale !== getPrimaryLocale(currentLocale)) {
        const primaryLocale = getPrimaryLocale(currentLocale);
        if (translations[primaryLocale] && translations[primaryLocale][key]) {
            text = translations[primaryLocale][key];
        }
    }
    // Fallback to English
    else if (translations['en_US'][key]) {
        text = translations['en_US'][key];
    }
    // Last resort: return the key itself
    else {
        text = key;
    }
    
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
 * @param {string} tagValue - The tag value (e.g., 'afk', 'troll')
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
        const response = await fetch(LCU_REGION_LOCALE);
        if (response.ok) {
            const data = await response.json();
            if (data && data.locale) {
                const locale = data.locale;
                
                // Check if we support this locale directly
                if (translations[locale]) {
                    setLocale(locale);
                    console.log(`Set locale to ${locale} based on client settings`);
                } else {
                    // Try to find a supported locale in the same language group
                    const group = getLanguageGroup(locale);
                    if (group) {
                        const primaryLocale = groupPrimary[group];
                        setLocale(primaryLocale);
                        console.log(`Set locale to ${primaryLocale} for ${locale} client`);
                    } else {
                        // Handle specific language families
                        if (locale.startsWith('zh_')) {
                            setLocale('zh_CN');
                            console.log(`Set locale to zh_CN for Chinese client ${locale}`);
                        } else if (locale.startsWith('ru_')) {
                            setLocale('ru_RU');
                            console.log(`Set locale to ru_RU for Russian client ${locale}`);
                        } else if (locale.startsWith('en_')) {
                            setLocale('en_US');
                            console.log(`Set locale to en_US for English client ${locale}`);
                        } else if (locale.startsWith('es_')) {
                            setLocale('es_ES');
                            console.log(`Set locale to es_ES for Spanish client ${locale}`);
                        } else if (locale.startsWith('ar_')) {
                            setLocale('ar_AE');
                            console.log(`Set locale to ar_AE for Arabic client ${locale}`);
                        } else if (locale.startsWith('id_')) {
                            setLocale('id_ID');
                            console.log(`Set locale to id_ID for Indonesian client ${locale}`);
                        } else if (locale.startsWith('cs_')) {
                            setLocale('cs_CZ');
                            console.log(`Set locale to cs_CZ for Czech client ${locale}`);
                        } else if (locale.startsWith('de_')) {
                            setLocale('de_DE');
                            console.log(`Set locale to de_DE for German client ${locale}`);
                        } else if (locale.startsWith('el_')) {
                            setLocale('el_GR');
                            console.log(`Set locale to el_GR for Greek client ${locale}`);
                        } else if (locale.startsWith('fr_')) {
                            setLocale('fr_FR');
                            console.log(`Set locale to fr_FR for French client ${locale}`);
                        } else if (locale.startsWith('hu_')) {
                            setLocale('hu_HU');
                            console.log(`Set locale to hu_HU for Hungarian client ${locale}`);
                        } else if (locale.startsWith('it_')) {
                            setLocale('it_IT');
                            console.log(`Set locale to it_IT for Italian client ${locale}`);
                        } else if (locale.startsWith('ja_')) {
                            setLocale('ja_JP');
                            console.log(`Set locale to ja_JP for Japanese client ${locale}`);
                        } else if (locale.startsWith('ko_')) {
                            setLocale('ko_KR');
                            console.log(`Set locale to ko_KR for Korean client ${locale}`);
                        } else if (locale.startsWith('pl_')) {
                            setLocale('pl_PL');
                            console.log(`Set locale to pl_PL for Polish client ${locale}`);
                        } else if (locale.startsWith('pt_')) {
                            setLocale('pt_BR');
                            console.log(`Set locale to pt_BR for Portuguese client ${locale}`);
                        } else if (locale.startsWith('ro_')) {
                            setLocale('ro_RO');
                            console.log(`Set locale to ro_RO for Romanian client ${locale}`);
                        } else if (locale.startsWith('th_')) {
                            setLocale('th_TH');
                            console.log(`Set locale to th_TH for Thai client ${locale}`);
                        } else if (locale.startsWith('tr_')) {
                            setLocale('tr_TR');
                            console.log(`Set locale to tr_TR for Turkish client ${locale}`);
                        } else if (locale.startsWith('vi_')) {
                            setLocale('vi_VN');
                            console.log(`Set locale to vi_VN for Vietnamese client ${locale}`);
                        } else {
                            // Default to English for truly unsupported languages
                            setLocale('en_US');
                            console.log(`Unsupported locale ${locale}, using en_US as fallback`);
                        }
                    }
                }
            }
        } else {
            // Fallback to browser language if we can't get the client locale
            const browserLang = navigator.language || navigator.userLanguage;
            if (browserLang.startsWith('zh')) {
                setLocale('zh_CN');
                console.log(`Set locale to zh_CN based on browser language`);
            } else if (browserLang.startsWith('ru')) {
                setLocale('ru_RU');
                console.log(`Set locale to ru_RU based on browser language`);
            } else if (browserLang.startsWith('es')) {
                setLocale('es_ES');
                console.log(`Set locale to es_ES based on browser language`);
            } else if (browserLang.startsWith('ar')) {
                setLocale('ar_AE');
                console.log(`Set locale to ar_AE based on browser language`);
            } else if (browserLang.startsWith('id')) {
                setLocale('id_ID');
                console.log(`Set locale to id_ID based on browser language`);
            } else if (browserLang.startsWith('cs')) {
                setLocale('cs_CZ');
                console.log(`Set locale to cs_CZ based on browser language`);
            } else if (browserLang.startsWith('de')) {
                setLocale('de_DE');
                console.log(`Set locale to de_DE based on browser language`);
            } else if (browserLang.startsWith('el')) {
                setLocale('el_GR');
                console.log(`Set locale to el_GR based on browser language`);
            } else if (browserLang.startsWith('fr')) {
                setLocale('fr_FR');
                console.log(`Set locale to fr_FR based on browser language`);
            } else if (browserLang.startsWith('hu')) {
                setLocale('hu_HU');
                console.log(`Set locale to hu_HU based on browser language`);
            } else if (browserLang.startsWith('it')) {
                setLocale('it_IT');
                console.log(`Set locale to it_IT based on browser language`);
            } else if (browserLang.startsWith('ja')) {
                setLocale('ja_JP');
                console.log(`Set locale to ja_JP based on browser language`);
            } else if (browserLang.startsWith('ko')) {
                setLocale('ko_KR');
                console.log(`Set locale to ko_KR based on browser language`);
            } else if (browserLang.startsWith('pl')) {
                setLocale('pl_PL');
                console.log(`Set locale to pl_PL based on browser language`);
            } else if (browserLang.startsWith('pt')) {
                setLocale('pt_BR');
                console.log(`Set locale to pt_BR based on browser language`);
            } else if (browserLang.startsWith('ro')) {
                setLocale('ro_RO');
                console.log(`Set locale to ro_RO based on browser language`);
            } else if (browserLang.startsWith('th')) {
                setLocale('th_TH');
                console.log(`Set locale to th_TH based on browser language`);
            } else if (browserLang.startsWith('tr')) {
                setLocale('tr_TR');
                console.log(`Set locale to tr_TR based on browser language`);
            } else if (browserLang.startsWith('vi')) {
                setLocale('vi_VN');
                console.log(`Set locale to vi_VN based on browser language`);
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

/**
 * Get all supported locales
 * @returns {Array<string>} - Array of supported locale codes
 */
export function getSupportedLocales() {
    return Object.keys(translations);
}

/**
 * Check if a locale is supported
 * @param {string} locale - The locale code to check
 * @returns {boolean} - True if the locale is supported
 */
export function isLocaleSupported(locale) {
    return translations.hasOwnProperty(locale);
}

/**
 * Get current locale
 * @returns {string} - Current locale code
 */
export function getCurrentLocale() {
    return currentLocale;
}

/**
 * Supported locales with display names (in their own language)
 * @returns {Array<{code: string, name: string}>}
 */
export function getSupportedLocalesWithNames() {
    return [
        { code: 'en_US', name: 'English' },
        { code: 'zh_CN', name: '简体中文' },
        { code: 'zh_TW', name: '繁體中文' },
        { code: 'zh_MY', name: '中文（马来西亚）' },
        { code: 'ru_RU', name: 'Русский' },
        { code: 'ar_AE', name: 'العربية' },
        { code: 'id_ID', name: 'Indonesia' },
        { code: 'cs_CZ', name: 'Čeština' },
        { code: 'de_DE', name: 'Deutsch' },
        { code: 'el_GR', name: 'Ελληνικά' },
        { code: 'es_ES', name: 'Español' },
        { code: 'fr_FR', name: 'Français' },
        { code: 'hu_HU', name: 'Magyar' },
        { code: 'it_IT', name: 'Italiano' },
        { code: 'ja_JP', name: '日本語' },
        { code: 'ko_KR', name: '한국어' },
        { code: 'pl_PL', name: 'Polski' },
        { code: 'pt_BR', name: 'Português' },
        { code: 'ro_RO', name: 'Română' },
        { code: 'th_TH', name: 'ภาษาไทย' },
        { code: 'tr_TR', name: 'Türkçe' },
        { code: 'vi_VN', name: 'Tiếng Việt' },
    ];
}

/**
 * Runtime manual locale override (not persisted, resets on restart)
 */
let manualLocaleOverride = null;

/**
 * Get the manually selected locale (runtime only, not persisted)
 * @returns {string|null}
 */
export function getManualLocale() {
    return manualLocaleOverride;
}

/**
 * Set a runtime manual locale override (does not persist across restarts)
 * @param {string|null} locale - The locale code, or null to clear (use auto-detect)
 * @returns {Promise<void>}
 */
export async function setManualLocale(locale) {
    if (locale) {
        manualLocaleOverride = locale;
        setLocale(locale);
    } else {
        manualLocaleOverride = null;
        // Re-run auto-detection and wait for it to complete
        await initLocale();
    }
}