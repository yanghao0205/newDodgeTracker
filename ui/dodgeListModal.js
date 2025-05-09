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
