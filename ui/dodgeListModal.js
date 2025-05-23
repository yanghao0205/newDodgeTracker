import { UI } from '../ui/components.js';
import { COLORS } from './styles.js';
import { t, getTagLabel } from '../utils/translations.js';

export class DodgeListModal {
    constructor() {
        this.modal = null;
        this.overlay = null;
        this.listContainer = null;
        this.searchInput = null;
        this.currentFilter = 'all'; // Current filter status
    }

    async show() {
        const dodgeList = DataStore.get('dodgelist-enhanced', []);
        
        // Create modal structure
        this.modal = document.createElement('div');
        this.modal.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${COLORS.background};
            border: 2px solid ${COLORS.border};
            border-radius: 4px;
            padding: 16px;
            width: 400px;
            z-index: 9999;
            color: ${COLORS.text};
            animation: fadeIn 0.3s ease-in;
        `;

        // Title
        const title = document.createElement('h2');
        title.innerText = t('yourDodgeList');
        title.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 20px;
            text-align: center;
            color: ${COLORS.highlight};
        `;
        this.modal.appendChild(title);

        // 添加导入导出按钮容器
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 16px;
        `;
        
        // 导出按钮
        const exportButton = document.createElement('lol-uikit-flat-button-secondary');
        exportButton.style.minWidth = '120px';
        exportButton.innerText = t('exportDodgeList');
        exportButton.onclick = this.exportDodgeList.bind(this);
        buttonsContainer.appendChild(exportButton);
        
        // 导入按钮
        const importButton = document.createElement('lol-uikit-flat-button-secondary');
        importButton.style.minWidth = '120px';
        importButton.innerText = t('importDodgeList');
        importButton.onclick = this.importDodgeList.bind(this);
        buttonsContainer.appendChild(importButton);
        
        this.modal.appendChild(buttonsContainer);

        // Search container
        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = `
            margin-bottom: 16px;
            position: relative;
        `;

        this.searchInput = document.createElement('input');
        this.searchInput.type = 'text';
        this.searchInput.placeholder = t('searchPlayers');
        this.searchInput.style.cssText = `
            width: 100%;
            padding: 8px;
            background: ${COLORS.background};
            border: 1px solid ${COLORS.border};
            color: ${COLORS.text};
            margin-bottom: 8px;
            border-radius: 4px;
        `;
        searchContainer.appendChild(this.searchInput);

        // Tag selection container
        const tagContainer = document.createElement('div');
        tagContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 16px;
        `;

        // Tag list, including filter functionality
        const tags = [
            { value: 'all', label: t('all'), type: 'filter' },
            { value: 'toxic', label: t('toxic'), type: 'filter' },
            { value: 'afk', label: t('afk'), type: 'filter' },
            { value: 'troll', label: t('troll'), type: 'filter' },
            { value: 'unskilled', label: t('unskilled'), type: 'filter' },
            { value: 'mykiller', label: t('mykiller'), type: 'filter' }
        ];

        tags.forEach(tag => {
            const tagBtn = document.createElement('div');
            tagBtn.className = 'tag-btn';
            tagBtn.innerText = tag.label;
            tagBtn.style.cssText = `
                padding: 6px 12px;
                border-radius: 12px;
                cursor: pointer;
                background: ${COLORS.background};
                border: 1px solid ${COLORS.border};
                color: ${COLORS.text};
                transition: all 0.2s ease;
            `;
            
            tagBtn.onclick = () => {
                // Update current filter status
                this.currentFilter = tag.value;
                
                // Update all button styles
                tagContainer.querySelectorAll('.tag-btn').forEach(btn => {
                    const btnValue = btn.dataset.value;
                    if (btnValue === this.currentFilter) {
                        btn.style.background = COLORS.highlight;
                        btn.style.color = COLORS.text;
                    } else {
                        btn.style.background = COLORS.background;
                        btn.style.color = COLORS.text;
                    }
                });
                
                // Filter and render the list
                this.filterList(tag.value);
            };
            
            // Set data attribute for value
            tagBtn.dataset.value = tag.value;
            
            // Set initial selected style
            if (tag.value === this.currentFilter) {
                tagBtn.style.background = COLORS.highlight;
            }
            
            tagContainer.appendChild(tagBtn);
        });
        
        searchContainer.appendChild(tagContainer);
        this.modal.appendChild(searchContainer);

        // Player list container
        this.listContainer = document.createElement('div');
        this.listContainer.style.cssText = `
            max-height: 300px;
            overflow-y: auto;
            margin-bottom: 16px;
        `;
        this.modal.appendChild(this.listContainer);

        // Close button
        const closeBtn = document.createElement('lol-uikit-flat-button');
        closeBtn.innerText = t('close');
        closeBtn.style.width = '100%';
        closeBtn.onclick = () => this.close();
        this.modal.appendChild(closeBtn);

        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9998;
        `;
        this.overlay.onclick = () => this.close();

        // Add to DOM
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.modal);

        // Render player list
        this.renderPlayerList(dodgeList);

        // Add search functionality
        this.searchInput.addEventListener('input', () => {
            const searchTerm = this.searchInput.value.toLowerCase();
            const filteredList = dodgeList.filter(player => 
                (player.name + '#' + player.tag).toLowerCase().includes(searchTerm)
            );
            this.renderPlayerList(filteredList);
        });
    }

    filterList(filter) {
        const dodgeList = DataStore.get('dodgelist-enhanced', []);
        let filteredList = dodgeList;
        
        if (filter !== 'all') {
            filteredList = dodgeList.filter(player => 
                player.tags && player.tags.includes(filter)
            );
        }
        
        this.renderPlayerList(filteredList);
    }

    renderPlayerList(players) {
        this.listContainer.innerHTML = '';
        
        if (players.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.innerText = t('emptyList');
            emptyMessage.style.cssText = `
                text-align: center;
                padding: 20px;
                color: ${COLORS.text};
            `;
            this.listContainer.appendChild(emptyMessage);
            return;
        }
        
        players.forEach(player => {
            const playerItem = document.createElement('div');
            playerItem.className = 'dodge-list-item';
            playerItem.style.cssText = `
                display: flex;
                align-items: center;
                padding: 10px;
                border-bottom: 1px solid ${COLORS.border};
                flex-wrap: wrap;
                gap: 8px;
            `;
            
            // Player name
            const nameContainer = document.createElement('div');
            nameContainer.style.cssText = `
                flex: 1;
                min-width: 150px;
            `;
            
            const nameElement = document.createElement('div');
            nameElement.innerText = `${player.name}#${player.tag}`;
            nameElement.style.cssText = `
                font-weight: bold;
                color: ${COLORS.highlight};
            `;
            nameContainer.appendChild(nameElement);
            
            // Note preview
            if (player.note) {
                const notePreview = document.createElement('div');
                notePreview.innerText = player.note.length > 30 ? 
                    player.note.substring(0, 30) + '...' : 
                    player.note;
                notePreview.style.cssText = `
                    font-size: 12px;
                    color: ${COLORS.textSecondary};
                    margin-top: 4px;
                `;
                nameContainer.appendChild(notePreview);
            }
            
            playerItem.appendChild(nameContainer);
            
            // Tags container
            const tagsContainer = document.createElement('div');
            tagsContainer.style.cssText = `
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                margin-right: 8px;
            `;
            
            // Available tags
            const availableTags = ['toxic', 'afk', 'troll', 'unskilled', 'mykiller'];
            
            availableTags.forEach(tagValue => {
                const tagElement = document.createElement('div');
                tagElement.innerText = t(tagValue);
                tagElement.style.cssText = `
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 12px;
                    cursor: pointer;
                    background: ${player.tags && player.tags.includes(tagValue) ? COLORS.highlight : COLORS.background};
                    border: 1px solid ${COLORS.border};
                    color: ${COLORS.text};
                `;
                
                tagElement.onclick = () => {
                    const players = DataStore.get('dodgelist-enhanced', []);
                    const playerIndex = players.findIndex(p => p.name === player.name);
                    
                    if (playerIndex === -1) return;
                    
                    if (!players[playerIndex].tags) {
                        players[playerIndex].tags = [];
                    }
                    
                    const tagIndex = players[playerIndex].tags.indexOf(tagValue);
                    
                    if (tagIndex === -1) {
                        players[playerIndex].tags.push(tagValue);
                    } else {
                        players[playerIndex].tags.splice(tagIndex, 1);
                    }
                    DataStore.set('dodgelist-enhanced', players);
                    this.renderPlayerList(players);
                };
                tagsContainer.appendChild(tagElement);
            });
            playerItem.appendChild(tagsContainer);

            // Note button
            const noteBtn = document.createElement('lol-uikit-flat-button-secondary');
            noteBtn.style.minWidth = '80px';
            noteBtn.innerText = t('note');
            noteBtn.onclick = () => this.showNoteModal(player);
            playerItem.appendChild(noteBtn);

            // Remove button
            const removeBtn = document.createElement('lol-uikit-flat-button-secondary');
            removeBtn.style.minWidth = '80px';
            removeBtn.innerText = t('remove');
            removeBtn.onclick = () => this.removePlayer(player);
            playerItem.appendChild(removeBtn);

            this.listContainer.appendChild(playerItem);
        });
    }

    async showNoteModal(player) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${COLORS.background};
            border: 2px solid ${COLORS.border};
            border-radius: 4px;
            padding: 16px;
            width: 300px;
            z-index: 10000;
            color: ${COLORS.text};
            animation: fadeIn 0.3s ease-in;
        `;

        const title = document.createElement('h3');
        title.innerText = t('noteFor', player.name);
        title.style.cssText = `
            margin: 0 0 12px 0;
            font-size: 16px;
            text-align: center;
            color: ${COLORS.highlight};
        `;
        modal.appendChild(title);

        const textarea = document.createElement('textarea');
        textarea.style.cssText = `
            width: 100%;
            height: 100px;
            padding: 8px;
            background: ${COLORS.background};
            border: 1px solid ${COLORS.border};
            color: ${COLORS.text};
            margin-bottom: 12px;
            resize: vertical;
        `;
        textarea.value = player.note || '';
        modal.appendChild(textarea);

        const saveBtn = document.createElement('lol-uikit-flat-button');
        saveBtn.innerText = t('save');
        saveBtn.style.width = '100%';
        saveBtn.onclick = () => {
            const updatedList = DataStore.get('dodgelist-enhanced', []).map(p => {
                if (p.name === player.name) {
                    return { ...p, note: textarea.value };
                }
                return p;
            });
            DataStore.set('dodgelist-enhanced', updatedList);
            Toast.success(t('noteSaved'));
            modal.remove();
        };
        modal.appendChild(saveBtn);

        document.body.appendChild(modal);
    }

    async removePlayer(player) {
        const updatedList = DataStore.get('dodgelist-enhanced', []).filter(
            p => p.name !== player.name
        );
        DataStore.set('dodgelist-enhanced', updatedList);
        Toast.success(t('playerRemoved', player.name));
        this.renderPlayerList(updatedList);
    }

    close() {
        if (this.modal) {
            document.body.removeChild(this.modal);
            document.body.removeChild(this.overlay);
            this.modal = null;
            this.overlay = null;
        }
    }

    // 导出躲避列表数据
    exportDodgeList() {
        try {
            // 获取躲避列表数据
            const dodgeList = DataStore.get('dodgelist-enhanced', []);
            
            if (dodgeList.length === 0) {
                Toast.error(t('emptyList'));
                return;
            }
            
            // 转换为JSON字符串
            const jsonData = JSON.stringify(dodgeList, null, 2);
            
            // 创建Blob对象
            const blob = new Blob([jsonData], { type: 'text/plain;charset=utf-8' });
            
            // 创建下载链接
            const downloadLink = document.createElement('a');
            
            // 创建文件名 (使用当前日期和时间)
            const date = new Date();
            const fileName = `dodge_list_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.txt`;
            
            // 设置下载链接属性
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = fileName;
            
            // 添加到文档并触发点击
            document.body.appendChild(downloadLink);
            downloadLink.click();
            
            // 清理
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(downloadLink.href);
            
            // 显示成功消息
            Toast.success(t('exportSuccess'));
        } catch (error) {
            console.error('导出数据失败:', error);
            Toast.error(t('exportFailed'));
        }
    }
    
    // 导入躲避列表数据
    importDodgeList() {
        // 创建导入对话框
        const importModal = document.createElement('div');
        importModal.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${COLORS.background};
            border: 2px solid ${COLORS.border};
            border-radius: 4px;
            padding: 16px;
            width: 400px;
            z-index: 10000;
            color: ${COLORS.text};
            animation: fadeIn 0.3s ease-in;
        `;
        
        // 标题
        const title = document.createElement('h3');
        title.innerText = t('importDodgeList');
        title.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 18px;
            text-align: center;
            color: ${COLORS.highlight};
        `;
        importModal.appendChild(title);
        
        // 选项卡容器
        const tabContainer = document.createElement('div');
        tabContainer.style.cssText = `
            display: flex;
            margin-bottom: 16px;
            border-bottom: 1px solid ${COLORS.border};
        `;
        
        // 粘贴选项卡
        const pasteTab = document.createElement('div');
        pasteTab.innerText = t('pasteMethod');
        pasteTab.className = 'import-tab active-tab';
        pasteTab.style.cssText = `
            padding: 8px 16px;
            cursor: pointer;
            color: ${COLORS.highlight};
            border-bottom: 2px solid ${COLORS.highlight};
        `;
        tabContainer.appendChild(pasteTab);
        
        // 文件选项卡
        const fileTab = document.createElement('div');
        fileTab.innerText = t('fileMethod');
        fileTab.className = 'import-tab';
        fileTab.style.cssText = `
            padding: 8px 16px;
            cursor: pointer;
            color: ${COLORS.text};
        `;
        tabContainer.appendChild(fileTab);
        
        importModal.appendChild(tabContainer);
        
        // 内容容器
        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `
            margin-bottom: 16px;
        `;
        importModal.appendChild(contentContainer);
        
        // 粘贴内容
        const pasteContent = document.createElement('div');
        pasteContent.className = 'tab-content';
        pasteContent.style.display = 'block';
        
        // 说明文字
        const pasteDescription = document.createElement('p');
        pasteDescription.innerText = t('pasteJsonData');
        pasteDescription.style.cssText = `
            margin-bottom: 10px;
            color: ${COLORS.text};
        `;
        pasteContent.appendChild(pasteDescription);
        
        // 文本区域
        const textarea = document.createElement('textarea');
        textarea.id = 'import-data-textarea';
        textarea.style.cssText = `
            width: 100%;
            height: 150px;
            padding: 8px;
            background: ${COLORS.background};
            border: 1px solid ${COLORS.border};
            color: ${COLORS.text};
            margin-bottom: 16px;
            resize: vertical;
        `;
        pasteContent.appendChild(textarea);
        
        // 文件内容
        const fileContent = document.createElement('div');
        fileContent.className = 'tab-content';
        fileContent.style.display = 'none';
        
        // 文件导入说明
        const fileDescription = document.createElement('p');
        fileDescription.innerText = t('selectJsonFile');
        fileDescription.style.cssText = `
            margin-bottom: 10px;
            color: ${COLORS.text};
        `;
        fileContent.appendChild(fileDescription);
        
        // 文件选择容器
        const fileSelectContainer = document.createElement('div');
        fileSelectContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            border: 2px dashed ${COLORS.border};
            border-radius: 4px;
            margin-bottom: 16px;
        `;
        
        // 文件输入
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'file-input';
        fileInput.accept = '.txt,.json';
        fileInput.style.cssText = `
            display: none;
        `;
        fileSelectContainer.appendChild(fileInput);
        
        // 选择文件按钮
        const selectFileButton = document.createElement('lol-uikit-flat-button');
        selectFileButton.innerText = t('selectFile');
        selectFileButton.style.cssText = `
            margin-bottom: 10px;
        `;
        selectFileButton.onclick = () => {
            fileInput.click();
        };
        fileSelectContainer.appendChild(selectFileButton);
        
        // 显示选择的文件名
        const fileNameDisplay = document.createElement('div');
        fileNameDisplay.id = 'file-name-display';
        fileNameDisplay.style.cssText = `
            font-size: 14px;
            color: ${COLORS.text};
            text-align: center;
            min-height: 20px;
        `;
        fileSelectContainer.appendChild(fileNameDisplay);
        
        fileContent.appendChild(fileSelectContainer);
        
        // 添加内容到容器
        contentContainer.appendChild(pasteContent);
        contentContainer.appendChild(fileContent);
        
        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            gap: 10px;
        `;
        
        // 取消按钮
        const cancelButton = document.createElement('lol-uikit-flat-button-secondary');
        cancelButton.style.flex = '1';
        cancelButton.innerText = t('cancel');
        cancelButton.onclick = () => {
            document.body.removeChild(importModal);
        };
        buttonContainer.appendChild(cancelButton);
        
        // 确认导入按钮
        const confirmButton = document.createElement('lol-uikit-flat-button');
        confirmButton.style.flex = '1';
        confirmButton.innerText = t('importData');
        confirmButton.onclick = () => {
            let jsonData = '';
            const activeTab = importModal.querySelector('.active-tab');
            
            if (activeTab === pasteTab) {
                // 从文本区域获取数据
                jsonData = textarea.value.trim();
                if (!jsonData) {
                    Toast.error(t('enterValidJson'));
                    return;
                }
            } else {
                // 从文件获取数据 - 如果没有选择文件则提示错误
                if (!fileInput.files || fileInput.files.length === 0) {
                    Toast.error(t('noFileSelected'));
                    return;
                }
                
                // 文件已经在fileInput.onchange中读取并存储在fileData中
                jsonData = fileInput._fileData;
                if (!jsonData) {
                    Toast.error(t('fileReadError'));
                    return;
                }
            }
            
            try {
                const importedData = JSON.parse(jsonData);
                if (!Array.isArray(importedData)) {
                    Toast.error(t('importFailedFormat'));
                    return;
                }
                
                // 验证数据格式
                const validData = importedData.filter(item => 
                    item && typeof item === 'object' && item.name && item.tag
                );
                
                // 更新数据
                DataStore.set('dodgelist-enhanced', validData);
                
                // 关闭导入对话框
                document.body.removeChild(importModal);
                
                Toast.success(t('importSuccess', validData.length));
                
                // 刷新列表显示
                this.renderPlayerList(validData);
            } catch (e) {
                console.error('导入数据解析失败:', e);
                Toast.error(t('importFailed'));
            }
        };
        buttonContainer.appendChild(confirmButton);
        
        importModal.appendChild(buttonContainer);
        document.body.appendChild(importModal);
        
        // 选项卡切换功能
        pasteTab.onclick = () => {
            pasteTab.className = 'import-tab active-tab';
            pasteTab.style.color = COLORS.highlight;
            pasteTab.style.borderBottom = `2px solid ${COLORS.highlight}`;
            fileTab.className = 'import-tab';
            fileTab.style.color = COLORS.text;
            fileTab.style.borderBottom = 'none';
            pasteContent.style.display = 'block';
            fileContent.style.display = 'none';
        };
        
        fileTab.onclick = () => {
            fileTab.className = 'import-tab active-tab';
            fileTab.style.color = COLORS.highlight;
            fileTab.style.borderBottom = `2px solid ${COLORS.highlight}`;
            pasteTab.className = 'import-tab';
            pasteTab.style.color = COLORS.text;
            pasteTab.style.borderBottom = 'none';
            fileContent.style.display = 'block';
            pasteContent.style.display = 'none';
        };
        
        // 文件选择处理
        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                // 显示文件名
                const fileNameDisplay = document.getElementById('file-name-display');
                if (fileNameDisplay) {
                    fileNameDisplay.innerText = file.name;
                }
                
                // 读取文件内容
                const reader = new FileReader();
                reader.onload = (e) => {
                    // 存储文件数据以供后续使用
                    fileInput._fileData = e.target.result;
                };
                reader.onerror = () => {
                    Toast.error(t('fileReadError'));
                };
                reader.readAsText(file);
            }
        };
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .dodge-list-item:hover {
        background-color: rgba(200, 170, 110, 0.1);
    }
`;
document.head.appendChild(style);
