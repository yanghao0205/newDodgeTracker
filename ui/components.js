import { DodgeListModal } from './dodgeListModal.js';
import { t } from '../utils/translations.js';

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
    `;

    // Add event listeners after DOM is created
    const addPlayerBtn = panel.querySelector('.addPlayer');
    const viewListBtn = panel.querySelector('.viewList');
    const clearListBtn = panel.querySelector('.clearList');
    const dodgelistInput = panel.querySelector('#dodgelist');

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
        DataStore.set('dodgelist-enhanced', []);
    };
}
