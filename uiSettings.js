import { UI, injectSettings } from './ui/components.js';
import { DodgeListModal } from './ui/dodgeListModal.js';
import { t } from './utils/translations.js';

const dodgeListModal = new DodgeListModal();

export function createTabSettings(context) {
    const dodgeTrackerTab = {
        "statements":[
            ["open-element","lol-uikit-scrollable",[]],
            ["static-attr","class","dt_settings"],
            ["flush-element"],
                ["close-element"]
        ],
        "locals":[],
        "named":[],
        "yields":[],
        "blocks":[],
        "hasPartials":false
    }

    context.rcp.postInit('rcp-fe-lol-settings', async (api) => {
        window.__RCP_SETTINGS_API = api

        let ember_api = window.__RCP_EMBER_API
        let ember = await ember_api.getEmber()

        let newGroup = {
            name: 'dodgetracker',
            titleKey: 'dt_title',
            capitalTitleKey: 'dt_title_capital',
            categories:[]
        }

        newGroup.categories.push({
            name: 'dt_settings',
            titleKey: 'dt_settings',
            routeName: 'dt_settings',
            group: newGroup,
            loginStatus: true,
            requireLogin: false,
            forceDisabled: false,
            computeds: ember.Object.create({
                disabled: false
            }),
            isEnabled: () => true,
        })

        api._modalManager._registeredCategoryGroups.splice(1, 0, newGroup)
        api._modalManager._refreshCategoryGroups()
    })

    context.rcp.postInit('rcp-fe-ember-libs', async (api) => {
        window.__RCP_EMBER_API = api

        let ember = await api.getEmber()

        let originalExtend = ember.Router.extend
        ember.Router.extend = function() {
            let result = originalExtend.apply(this, arguments)

            result.map(function() {
                this.route('dt_settings')
            })

            return result
        }
    })

    context.rcp.postInit('rcp-fe-lol-l10n', async (api) => {
        let tra = api.tra()

        let originalGet = tra.__proto__.get
        tra.__proto__.get = function(key) {
            if (key.startsWith('dt_')) {
                switch (key) {
                    case 'dt_title': return t('dodgeTracker')
                    case 'dt_title_capital': return t('dodgeTrackerCapital')
                    case 'dt_settings': return t('dodgeList')
                    default: break;
                }
            }

            return originalGet.apply(this, [key]);
        }
    })

    context.rcp.postInit('rcp-fe-ember-libs', async (api) => {
        window.__RCP_EMBER_API = api

        let ember = await api.getEmber()

        let originalExtend = ember.Router.extend
        ember.Router.extend = function() {
            let result = originalExtend.apply(this, arguments)
            result.map(function() {
                this.route('dt_settings')
            })

            return result
        }

        let factory = await api.getEmberApplicationFactory()

        let originalBuilder = factory.factoryDefinitionBuilder
        factory.factoryDefinitionBuilder = function() {
            let builder = originalBuilder.apply(this, arguments)
            let originalBuild = builder.build
            builder.build = function() {
                let name = this.getName()
                if (name == 'rcp-fe-lol-settings') {
                    window.__SETTINGS_OBJECT = this

                    this.addTemplate('dt_settings', ember.HTMLBars.template({
                        id: "DodgeTrackerSettings",
                        block: JSON.stringify(dodgeTrackerTab),
                        meta: {}
                    }))
                }
                
                return originalBuild.apply(this, arguments)
            }
            return builder
        }
    })
}

export function createSettingsUi() {
    const interval = setInterval(() => {
        const manager = document.getElementById('lol-uikit-layer-manager-wrapper')
        if (manager) {
            clearInterval(interval)
            new MutationObserver((mutations) => {
                const panel = document.querySelector('div.lol-settings-options > lol-uikit-scrollable.dt_settings')
                if (panel && mutations.some((record) => Array.from(record.addedNodes).includes(panel))) {
                    injectSettings(panel)
                }
            }).observe(manager, {
                childList: true,
                subtree: true
            })
        }
    },500)
}