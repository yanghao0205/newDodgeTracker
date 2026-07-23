import { DodgeListModal } from './dodgeListModal.js';
import { t, getSupportedLocalesWithNames, getManualLocale, setManualLocale } from '../utils/translations.js';
import { refreshSettingsCategories } from '../uiSettings.js';
import { COLORS } from './styles.js';

export const dodgeListModal = new DodgeListModal();

export const UI = {
    Row(id, childs) {
        return [
            ['open-element', 'div', ['class', 'row', 'id', id]],
            ['flush-element'],
            ...childs,
            ['close-element']
        ];
    },

    Label(text, id) {
        return [
            ['open-element', 'div', ['class', 'label', 'id', id]],
            ['static-text', text],
            ['close-element']
        ];
    },

    Input(target) {
        return [
            ['open-element', 'input', ['class', 'input', 'id', target]],
            ['static-attr', 'type', 'text'],
            ['close-element']
        ];
    },

    Button(text, cls, onClk) {
        return [
            ['open-element', 'lol-uikit-flat-button', ['class', cls]],
            ['static-text', text],
            ['close-element']
        ];
    }
};

export function injectSettings(panel) {
    renderSettingsPanel(panel);
}

function renderSettingsPanel(panel) {
    const locales = getSupportedLocalesWithNames();
    const manualLocale = getManualLocale();
    const currentSel = manualLocale || 'auto';

    // 使用innerHTML来添加设置
    panel.innerHTML = `
        <div class="row">
            <div class="label">${t('dodgeList')}</div>
            <div class="input">
                <input type="text" id="dodgelist" placeholder="${t('playerPlaceholder')}">
            </div>
            <div class="button">
                <lol-uikit-flat-button class="addPlayer">${t('addPlayer')}</lol-uikit-flat-button>
            </div>
            <div class="button">
                <lol-uikit-flat-button class="viewList">${t('viewList')}</lol-uikit-flat-button>
            </div>
            <div class="button">
                <lol-uikit-flat-button class="clearList">${t('clearList')}</lol-uikit-flat-button>
            </div>
        </div>
        <div class="row" style="margin-top: 16px;">
            <div class="label">${t('languageLabel')}</div>
            <div class="input">
                <select id="dodgelist-lang-select" style="
                    background: #0a1428;
                    color: #f0e6d2;
                    border: 1px solid #463714;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 14px;
                    width: 200px;
                    cursor: pointer;
                ">
                    <option value="auto"${currentSel === 'auto' ? ' selected' : ''}>${t('autoDetect')}</option>
                    ${locales.map(l => `<option value="${l.code}"${currentSel === l.code ? ' selected' : ''}>${l.name}</option>`).join('')}
                </select>
            </div>
        </div>
    `;

    // Add event listeners after DOM is created
    const addPlayerBtn = panel.querySelector('.addPlayer');
    const viewListBtn = panel.querySelector('.viewList');
    const clearListBtn = panel.querySelector('.clearList');
    const dodgelistInput = panel.querySelector('#dodgelist');
    const langSelect = panel.querySelector('#dodgelist-lang-select');

    addPlayerBtn.onclick = () => {
        const playerName = dodgelistInput.value.trim();
        if (playerName) {
            const dodgeList = DataStore.get('dodgelist-enhanced', []);
            const existingPlayer = dodgeList.find(p => 
                p.name === playerName.split('#')[0]
            );
            
            if (existingPlayer) {
                Toast.error(t('playerExists', playerName));
            } else {
                dodgeList.push({
                    name: playerName.split('#')[0],
                    tag: playerName.split('#')[1], // 保存唯一ID
                    tags: [], // 初始化空的标签数组
                    notes: ''
                });
                DataStore.set('dodgelist-enhanced', dodgeList);
                Toast.success(t('playerAdded', playerName));
                dodgelistInput.value = '';
            }
        }
    };

    viewListBtn.onclick = () => dodgeListModal.show();

    clearListBtn.onclick = () => {
        showClearListConfirmModal(() => {
            DataStore.set('dodgelist-enhanced', []);
        });
    };

    langSelect.onchange = async () => {
        const selected = langSelect.value;
        if (selected === 'auto') {
            await setManualLocale(null);
        } else {
            await setManualLocale(selected);
        }
        // Refresh the settings window title and sidebar to match the new locale
        refreshSettingsCategories();
        // Re-render the panel with new language
        renderSettingsPanel(panel);
    };
}

/**
 * Show a confirmation modal before clearing the dodge list
 * @param {Function} onConfirm - Callback when user confirms
 */
function showClearListConfirmModal(onConfirm) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10001;
    `;

    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${COLORS.background};
        border: 2px solid ${COLORS.border};
        border-radius: 4px;
        padding: 20px;
        width: 360px;
        z-index: 10002;
        color: ${COLORS.text};
        text-align: center;
    `;

    // Title
    const title = document.createElement('h3');
    title.innerText = t('clearListConfirmTitle');
    title.style.cssText = `
        margin: 0 0 16px 0;
        font-size: 18px;
        color: ${COLORS.highlight};
    `;
    modal.appendChild(title);

    // Message
    const message = document.createElement('p');
    message.innerText = t('clearListConfirmMessage');
    message.style.cssText = `
        margin: 0 0 20px 0;
        font-size: 14px;
        line-height: 1.5;
        color: ${COLORS.text};
    `;
    modal.appendChild(message);

    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 12px;
    `;

    // Cancel button
    const cancelButton = document.createElement('lol-uikit-flat-button-secondary');
    cancelButton.style.cssText = `
        flex: 1;
        min-width: 100px;
    `;
    cancelButton.innerText = t('cancel');
    cancelButton.onclick = () => {
        document.body.removeChild(overlay);
        document.body.removeChild(modal);
    };
    buttonContainer.appendChild(cancelButton);

    // Confirm button
    const confirmButton = document.createElement('lol-uikit-flat-button');
    confirmButton.style.cssText = `
        flex: 1;
        min-width: 100px;
    `;
    confirmButton.innerText = t('clearListConfirmYes');
    confirmButton.onclick = () => {
        document.body.removeChild(overlay);
        document.body.removeChild(modal);
        onConfirm();
    };
    buttonContainer.appendChild(confirmButton);

    modal.appendChild(buttonContainer);

    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}
