let uikit = undefined
import { t } from './utils/translations.js';

export function addButtonPostGame(context) {
    context.rcp.postInit('rcp-fe-lol-uikit', (api) => {
		uikit = api
	})

    context.rcp.postInit('rcp-fe-ember-libs', async (api) => {
        const originalGetEmber = api.getEmber
        api.getEmber = function() {
            const result = originalGetEmber.apply(this, arguments)

            result.then((Ember) => {
                const originalExtend = Ember.Component.extend

                Ember.Component.extend = function(...args) {
                    const result = originalExtend.apply(this, arguments)

                    const classNames = args
                        .filter(x => typeof x === 'object' && x.classNames && Array.isArray(x.classNames))
                        .map(x => x.classNames.join(' '))

                    if (classNames[0] === 'scoreboard-row-actions-menu-component') {
                        // TODO: Proper check
                        const proto = result.proto()

                        if (proto.__IS_HOOKED) {
                            return result
                        }
                        proto.__IS_HOOKED = true

                        const originalActionOptions = proto.actionOptions._getter
                        proto.actionOptions._getter = function() {
                            const result = originalActionOptions.apply(this, arguments)
                            
                            result.push({
                                actionName: 'dlAction',
                                disabled: false,
                                label: t('dodgeNote')
                            })

                            return result
                        }

                        const originalButtonClick = proto.actions.handleButtonClick
                        proto.actions.handleButtonClick = function(action, player, event) {
                            if (action.actionName == 'dlAction') {
                                try {
                                    // 使用正确的属性路径获取玩家名称
                                    const playerName = `${player.riotIdGameName}#${player.riotIdTagLine}`;
                                    console.log('获取到玩家名称:', playerName);
                                    
                                    // 调用添加到躲避列表的模态框
                                    showAddToDodgeListModal(playerName);
                                } catch (error) {
                                    console.error('获取玩家名称时出错:', error, player);
                                    
                                    // 备用方法：尝试从player对象中找到其他可能的属性
                                    try {
                                        let playerName = '';
                                        
                                        if (player.displayName && player.displayName.playerName && player.displayName.tagLine) {
                                            playerName = `${player.displayName.playerName}#${player.displayName.tagLine}`;
                                        } else if (player.summonerName) {
                                            playerName = player.summonerName;
                                        } else if (player.name) {
                                            playerName = player.name;
                                        } else if (player.gameName && player.tagLine) {
                                            playerName = `${player.gameName}#${player.tagLine}`;
                                        } else {
                                            // 最后的尝试：使用summonerId作为临时名称
                                            playerName = `Player_${player.summonerId}`;
                                        }
                                        
                                        console.log('使用备用方法获取到玩家名称:', playerName);
                                        showAddToDodgeListModal(playerName);
                                    } catch (backupError) {
                                        console.error('备用方法也失败了:', backupError);
                                        leagueToast(t('cannotGetPlayerName'));
                                    }
                                }
                                return;
                            }

                            return originalButtonClick.apply(this, arguments)
                        }
                    } else if (classNames[0] === 'player-history-object') {
                        const proto = result.proto()

                        if (proto.__IS_HOOKED) {
                            return result
                        }
                        proto.__IS_HOOKED = true
                        
                        const originalMenuItemModal = proto.getMenuItemModel
                        proto.getMenuItemModel = function() {
                            const result = originalMenuItemModal.apply(this, arguments)

                            const isLocalSummoner = this.get('summonerId') == this.get('session.summonerId')
                            if (!isLocalSummoner) {
                                result.push({
                                    label: t('dodgeNote'),
                                    target: this,
                                    action: function() {
                                        const player = this.get('playerNameFull')
                                        const playerName = `${player.split('#')[0]}#${player.split('#')[1]}`
                                        // 确保在添加玩家前先初始化语言设置
                                        if (typeof initLocale === 'function') {
                                            initLocale().then(() => {
                                                showAddToDodgeListModal(playerName)
                                            });
                                        } else {
                                            showAddToDodgeListModal(playerName)
                                        }
                                        return
                                    }
                                })
                                return result
                            }
                        }
                    }

                    return result
                }
            })

            return result
        }
    })
}

function showAddToDodgeListModal(playerName) {
    // 使用增强版躲避列表
    const dodgeList = DataStore.get('dodgelist-enhanced', []);
    const existingEntry = dodgeList.find(entry => entry.name.toLowerCase() === playerName.split('#')[0].toLowerCase());
    
    // 标签列表 - 使用与增强版一致的标签
    const tags = [
        { value: 'toxic', label: t('toxic') },
        { value: 'afk', label: t('afk') },
        { value: 'troll', label: t('troll') },
        { value: 'unskilled', label: t('unskilled') },
        { value: 'mykiller', label: t('mykiller') }
    ];
    
    // 创建标签复选框HTML
    let tagsHtml = '';
    tags.forEach(tag => {
        const checked = existingEntry && existingEntry.tags && existingEntry.tags.includes(tag.value) ? 'checked' : '';
        tagsHtml += `
            <div style="margin-right: 10px; display: flex; align-items: center;">
                <input type="checkbox" class="dodge-tag-checkbox" id="tag-${tag.value}" value="${tag.value}" ${checked}>
                <label for="tag-${tag.value}" style="margin-left: 5px; color: #f0e6d2;">${tag.label}</label>
            </div>
        `;
    });
    
    // 创建模态框HTML
    const modalHtml = `
        <div style="width: 400px; padding: 20px; background-color: rgb(1, 10, 19); color: white; border: 1px solid #3c3c41;">
            <h2 style="margin-bottom: 20px; color: #f0e6d2; font-size: 20px; text-align: center; font-weight: bold;">
                ${t('dodgeNote')}: ${playerName}
            </h2>
            
            <div style="margin-bottom: 15px;">
                <p style="margin-bottom: 10px;">${t('selectTags')}:</p>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${tagsHtml}
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <p style="margin-bottom: 10px;">${t('note')}:</p>
                <textarea id="dodge-note" style="width: 100%; height: 80px; padding: 8px; background-color: rgba(30, 35, 40, 0.8); color: white; border: 1px solid #3c3c41;">${existingEntry && existingEntry.note ? existingEntry.note : ''}</textarea>
            </div>
            
            <div style="display: flex; justify-content: space-between;">
                <button id="cancel-dodge-btn" style="padding: 8px 15px; background-color: #444; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 14px;">
                    ${t('cancel')}
                </button>
                <button id="add-to-dodge-list-btn" style="padding: 8px 15px; background-color: #2c7c5b; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 14px;">
                    ${existingEntry ? t('update') : t('add')}
                </button>
            </div>
        </div>
    `;
    
    // 创建模态框元素
    let modalElement = document.createElement('div');
    modalElement.innerHTML = modalHtml;
    modalElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
    `;
    document.body.appendChild(modalElement);
    
    // 等待DOM更新后添加事件监听器
    setTimeout(() => {
        // 取消按钮点击事件
        const cancelButton = document.getElementById('cancel-dodge-btn');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                document.body.removeChild(modalElement);
            });
        }
        
        // 添加到躲避列表按钮点击事件
        const addButton = document.getElementById('add-to-dodge-list-btn');
        if (addButton) {
            addButton.addEventListener('click', () => {
                // 获取选中的标签
                const selectedTags = Array.from(document.querySelectorAll('.dodge-tag-checkbox:checked'))
                    .map(checkbox => checkbox.value);
                
                // 获取备注
                const noteInput = document.getElementById('dodge-note');
                const note = noteInput ? noteInput.value : '';
                
                // 更新或添加到躲避列表
                if (existingEntry) {
                    // 更新现有条目
                    const updatedList = dodgeList.map(entry => {
                        if (entry.name.toLowerCase() === playerName.split('#')[0].toLowerCase()) {
                            return {
                                ...entry,
                                tags: selectedTags,
                                note: note
                            };
                        }
                        return entry;
                    });
                    
                    DataStore.set('dodgelist-enhanced', updatedList);
                    showSuccessToast(t('playerUpdated', playerName));
                } else {
                    // 添加新条目
                    try {
                        const newEntry = {
                            name: playerName.split('#')[0],
                            tag: playerName.split('#')[1] || '',
                            tags: selectedTags,
                            note: note,
                            addedDate: new Date().toISOString()
                        };
                        
                        dodgeList.push(newEntry);
                        DataStore.set('dodgelist-enhanced', dodgeList);
                        showSuccessToast(t('playerAdded', playerName));
                    } catch (e) {
                        console.error('Error parsing existing entry:', e);
                    }
                }
                
                // 关闭模态框
                document.body.removeChild(modalElement);
            });
        }
    }, 100);
}

function showSuccessToast(message) {
    // 创建一个类似于图中所示的Toast
    const toastElement = document.createElement('div');
    toastElement.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: rgba(30, 35, 40, 0.95);
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        min-width: 300px;
        border-left: 4px solid #2daf7f;
    `;
    
    // 添加成功图标
    const iconHtml = `
        <div style="margin-right: 10px; color: #2daf7f;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        </div>
    `;
    
    // 设置Toast内容
    toastElement.innerHTML = `${iconHtml}<span>${message}</span>`;
    
    // 添加到页面
    document.body.appendChild(toastElement);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (document.body.contains(toastElement)) {
            document.body.removeChild(toastElement);
        }
    }, 3000);
    
    // 同时使用原有的leagueToast作为备份
    leagueToast(message);
}

function leagueToast(message) {
    if (uikit && uikit.getToastManager) {
        const toastManager = uikit.getToastManager();
        if (toastManager) {
            toastManager.add({
                type: 'info',
                title: 'Dodge Tracker',
                content: message,
                onShow: () => {},
                onHide: () => {},
                dismissable: true,
                duration: 3000
            });
        }
    } else {
        console.log('Toast:', message);
    }
}

// 添加查看躲避列表的功能
function viewDodgeList() {
    // 防止多次调用
    if (window.dodgeListToastVisible) {
        return;
    }
    
    // 获取躲避列表数据
    const dodgeList = DataStore.get('dodgelist-enhanced', []);
    
    // 如果列表为空
    if (dodgeList.length === 0) {
        leagueToast(t('emptyList'));
        return;
    }
    
    // 创建列表HTML
    let listHtml = '';
    
    // 添加标题和操作按钮
    listHtml += `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2 style="color: #f0e6d2; font-size: 18px; margin: 0;">${t('yourDodgeList')}</h2>
            <div>
                <button id="export-dodge-list" style="padding: 5px 10px; background-color: #2c7c5b; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 12px; margin-right: 5px;">
                    ${t('exportDodgeList')}
                </button>
                <button id="import-dodge-list" style="padding: 5px 10px; background-color: #2c7c5b; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 12px;">
                    ${t('importDodgeList')}
                </button>
            </div>
        </div>
    `;
    
    // 添加列表内容
    listHtml += '<div style="max-height: 300px; overflow-y: auto;">';
    
    // 标签映射
    const tagLabels = {
        'toxic': t('toxic'),
        'afk': t('afk'),
        'troll': t('troll'),
        'unskilled': t('unskilled'),
        'mykiller': t('mykiller')
    };
    
    // 遍历躲避列表
    dodgeList.forEach((player, index) => {
        // 格式化标签
        const tagsHtml = player.tags && player.tags.length > 0 
            ? `<div style="margin-top: 5px; font-size: 12px; color: #c8aa6e;">${player.tags.map(tag => tagLabels[tag] || tag).join(', ')}</div>` 
            : '';
        
        // 格式化备注
        const noteHtml = player.note 
            ? `<div style="margin-top: 5px; font-size: 12px; color: #a09b8c;">${t('note')}: ${player.note}</div>` 
            : '';
        
        // 添加玩家条目
        listHtml += `
            <div style="padding: 10px; border-bottom: 1px solid #3c3c41; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: #f0e6d2;">${player.name}${player.tag ? '#' + player.tag : ''}</div>
                    ${tagsHtml}
                    ${noteHtml}
                </div>
                <button class="remove-dodge-player" data-index="${index}" style="padding: 5px 10px; background-color: #e84057; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 12px;">
                    ${t('remove')}
                </button>
            </div>
        `;
    });
    
    listHtml += '</div>';
    
    // 添加关闭按钮
    listHtml += `
        <div style="margin-top: 15px; text-align: center;">
            <button id="close-dodge-list" style="padding: 8px 15px; background-color: #444; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 14px;">
                ${t('close')}
            </button>
        </div>
    `;
    
    // 创建Toast元素
    let toastElement = document.createElement('div');
    toastElement.innerHTML = listHtml;
    toastElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        padding: 20px;
        background-color: rgb(1, 10, 19);
        color: white;
        border: 1px solid #3c3c41;
        z-index: 9999;
    `;
    document.body.appendChild(toastElement);
    
    // 标记Toast已显示
    window.dodgeListToastVisible = true;
    window.dodgeListToastElement = toastElement;
    
    // 等待DOM更新后添加事件监听器
    setTimeout(() => {
        // 关闭按钮点击事件
        const closeButton = document.getElementById('close-dodge-list');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                closeDodgeListToast();
            });
        }
        
        // 移除玩家按钮点击事件
        const removeButtons = document.querySelectorAll('.remove-dodge-player');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (!isNaN(index) && index >= 0 && index < dodgeList.length) {
                    const playerName = dodgeList[index].name;
                    dodgeList.splice(index, 1);
                    DataStore.set('dodgelist-enhanced', dodgeList);
                    
                    // 更新列表显示
                    closeDodgeListToast();
                    if (dodgeList.length > 0) {
                        setTimeout(viewDodgeList, 300);
                    } else {
                        leagueToast(t('emptyList'));
                    }
                }
            });
        });
        
        // 导出按钮点击事件
        const exportButton = document.getElementById('export-dodge-list');
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                exportDodgeList();
            });
        }
        
        // 导入按钮点击事件
        const importButton = document.getElementById('import-dodge-list');
        if (importButton) {
            importButton.addEventListener('click', () => {
                importDodgeList();
            });
        }
        
    }, 100);
}

// 安全关闭躲避列表弹窗
function closeDodgeListToast() {
    if (window.dodgeListToastVisible && window.dodgeListToastElement) {
        try {
            document.body.removeChild(window.dodgeListToastElement);
        } catch (e) {
            console.error('关闭躲避列表弹窗时出错:', e);
        }
        window.dodgeListToastVisible = false;
        window.dodgeListToastElement = null;
    }
}

// 导出躲避列表数据
function exportDodgeList() {
    const dodgeList = DataStore.get('dodgelist-enhanced', []);
    
    if (dodgeList.length === 0) {
        leagueToast(t('emptyList'));
        return;
    }
    
    try {
        // 将数据转换为JSON字符串
        const jsonData = JSON.stringify(dodgeList, null, 2);
        
        // 复制到剪贴板
        navigator.clipboard.writeText(jsonData)
            .then(() => {
                leagueToast(t('exportSuccess'));
            })
            .catch(err => {
                console.error('复制到剪贴板失败:', err);
                leagueToast(t('exportFailed'));
                
                // 备用方法：显示数据让用户手动复制
                alert(jsonData);
            });
    } catch (e) {
        console.error('导出数据时出错:', e);
        leagueToast(t('exportFailed'));
    }
}

// 导入躲避列表数据
function importDodgeList() {
    // 创建导入对话框
    const importHtml = `
        <div style="width: 400px; padding: 20px; background-color: rgb(1, 10, 19); color: white; border: 1px solid #3c3c41;">
            <h2 style="margin-bottom: 20px; color: #f0e6d2; font-size: 20px; text-align: center; font-weight: bold;">
                ${t('importDodgeList')}
            </h2>
            
            <div style="margin-bottom: 15px;">
                <p style="margin-bottom: 10px;">${t('pasteJsonData')}</p>
                <textarea id="import-data-textarea" style="width: 100%; height: 150px; padding: 8px; background-color: rgba(30, 35, 40, 0.8); color: white; border: 1px solid #3c3c41;"></textarea>
            </div>
            
            <div style="display: flex; justify-content: space-between;">
                <button id="import-cancel-btn" style="padding: 8px 15px; background-color: #444; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 14px;">
                    ${t('cancel')}
                </button>
                <button id="import-confirm-btn" style="padding: 8px 15px; background-color: #2c7c5b; color: white; border: none; border-radius: 2px; cursor: pointer; font-size: 14px;">
                    ${t('importData')}
                </button>
            </div>
        </div>
    `;
    
    // 尝试使用模态框而不是Toast
    let modalElement = document.createElement('div');
    modalElement.innerHTML = importHtml;
    modalElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
    `;
    document.body.appendChild(modalElement);
    
    // 等待DOM更新后添加事件监听器
    setTimeout(() => {
        // 取消按钮点击事件
        const cancelButton = document.getElementById('import-cancel-btn');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                document.body.removeChild(modalElement);
            });
        }
        
        // 确认导入按钮点击事件
        const confirmButton = document.getElementById('import-confirm-btn');
        if (confirmButton) {
            confirmButton.addEventListener('click', () => {
                const textarea = document.getElementById('import-data-textarea');
                if (textarea) {
                    const jsonData = textarea.value.trim();
                    if (!jsonData) {
                        leagueToast(t('enterValidJson'));
                        return;
                    }
                    
                    try {
                        const importedData = JSON.parse(jsonData);
                        if (!Array.isArray(importedData)) {
                            leagueToast(t('importFailedFormat'));
                            return;
                        }
                        
                        // 验证数据格式
                        const validData = importedData.filter(item => 
                            item && typeof item === 'object' && item.name && item.tag
                        );
                        
                        // 更新数据
                        DataStore.set('dodgelist-enhanced', validData);
                        
                        // 关闭导入对话框
                        document.body.removeChild(modalElement);
                        
                        leagueToast(t('importSuccess', validData.length));
                        
                        // 如果当前正在显示躲避列表，则刷新
                        if (window.dodgeListToastVisible) {
                            closeDodgeListToast();
                            setTimeout(viewDodgeList, 300);
                        }
                    } catch (e) {
                        console.error('导入数据解析失败:', e);
                        leagueToast(t('importFailed'));
                    }
                }
            });
        }
    }, 100);
}

// 添加快捷方式，可以在控制台中调用
window.viewDodgeList = viewDodgeList;
window.closeDodgeListToast = closeDodgeListToast;
window.exportDodgeList = exportDodgeList;
window.importDodgeList = importDodgeList;