export const COLORS = {
    background: '#1E2328',
    border: '#785A28',
    text: '#F0E6D2',
    highlight: '#C8AA6E',
    danger: '#E84057',
    success: '#08A76B'
};

export const STYLES = {
    modal: `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${COLORS.background};
        border: 2px solid ${COLORS.border};
        border-radius: 4px;
        padding: 16px;
        z-index: 9999;
        color: ${COLORS.text};
    `,
    
    button: `
        width: 100%;
        padding: 8px;
        background: ${COLORS.highlight};
        border: none;
        border-radius: 4px;
        color: ${COLORS.text};
        cursor: pointer;
        transition: background-color 0.2s ease;
    `,
    
    input: `
        width: 100%;
        padding: 8px;
        background: ${COLORS.background};
        border: 1px solid ${COLORS.border};
        color: ${COLORS.text};
        border-radius: 4px;
        margin-bottom: 8px;
    `,
    
    tag: `
        padding: 2px 6px;
        border-radius: 4px;
        background: ${COLORS.highlight};
        color: ${COLORS.text};
        font-size: 12px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    `,
    
    listContainer: `
        max-height: 300px;
        overflow-y: auto;
        margin-bottom: 16px;
    `,
    
    listItem: `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        border-bottom: 1px solid ${COLORS.border};
        font-size: 14px;
        transition: background-color 0.2s ease;
    `
};
