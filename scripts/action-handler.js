// System Module Imports
import { ACTION_TYPE, TALENT_TYPE, GEAR_TYPE } from './constants.js'
import { Utils } from './utils.js'

export let ActionHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    /**
     * Extends Token Action HUD Core's ActionHandler class and builds system-defined actions for the HUD
     */
    ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {
        /**
         * Build system actions
         * Called by Token Action HUD Core
         * @override
         * @param {array} groupIds
         */
        async buildSystemActions (groupIds) {
            // Set actor and token variables
            this.actors = (!this.actor) ? this.#getActors() : [this.actor]

            // Set items variable
            if (this.actor) {
                let items = this.actor.items
                items = coreModule.api.Utils.sortItemsByName(items)
                this.items = items
            }

            if (this.actor) {
                this.#buildActorActions()
            } else {
                this.#buildMultipleTokenActions()
            }
        }

        /**
         * Get actors
         * @private
         * @returns {object}
         */
        #getActors () {
            return canvas.tokens.controlled.map(token => token.actor)
        }

        /**
         * Build actor actions
         * @private
         */
        #buildActorActions () {
            this.#buildResistances()
            this.#buildSkills()
            this.#buildSchools()
            this.#buildSpells()
            this.#buildTalents()
            this.#buildGear()
            this.#buildWealth()
            this.#buildActions()
            this.#buildPools()
            this.#buildInjuries()
            this.#buildInjuries()
            this.#buildMinionDice()
            this.#buildDamage()
            this.#buildRefresh()
        }

        /**
         * Build multiple token actions
         * @private
         * @returns {object}
         */
        #buildMultipleTokenActions () {
            // If any selected token is not a minion then add the refresh pools action
            if (this.actors.some(actor => actor.type !== 'minion')) {
                this.#buildRefresh()
            }
        }

        /**
         * Build resistances
         * @private
         */
        async #buildResistances () {
            const groupData = { id: 'resistances', type: 'system' }
            const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE['item'])
            const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`

            // Add each resistance as an action
            Object.keys(this.actor.system.resistances).forEach( r => {
                this.addActions([{
                    id: r,
                    name: coreModule.api.Utils.i18n(`THOSEWHOWANDER.resistance.${r}`),
                    listName: listName,
                    encodedValue: ['resistance', r].join(this.delimiter),
                }], groupData)
            })
        }

        /**
         * Build skills
         * @private
         */
        async #buildSkills () {
            if (this.items.size === 0) return

            const skillMap = new Map()

            for (const [itemId, itemData] of this.items) {
                const type = itemData.type

                // Add all skills to the map
                if (type === 'skill') {
                    const typeMap = skillMap.get(type) ?? new Map()
                    typeMap.set(itemId, itemData)
                    skillMap.set(type, typeMap)
                }
            }

            for (const [type, typeMap] of skillMap) {
                const groupData = { id: 'skills', type: 'system' }

                // Get actions
                const actions = [...typeMap].map(([itemId, itemData]) => {
                    const id = itemId
                    const name = itemData.name
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE['item'])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = ['item', id].join(this.delimiter)

                    return {
                        id,
                        name,
                        listName,
                        encodedValue
                    }
                })

                // TAH Core method to add actions to the action list
                this.addActions(actions, groupData)
            }
        }

        /**
         * Build schools of magic
         * @private
         */
        async #buildSchools () {
            if (this.items.size === 0) return

            const schoolMap = new Map()

            for (const [itemId, itemData] of this.items) {
                const type = itemData.type

                // Add all schools to the map
                if (type === 'school') {
                    const typeMap = schoolMap.get(type) ?? new Map()
                    typeMap.set(itemId, itemData)
                    schoolMap.set(type, typeMap)
                }
            }

            for (const [type, typeMap] of schoolMap) {
                const groupData = { id: 'schools', type: 'system' }

                // Get actions
                const actions = [...typeMap].map(([itemId, itemData]) => {
                    const id = itemId
                    const name = itemData.name
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE['item'])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = ['item', id].join(this.delimiter)

                    return {
                        id,
                        name,
                        listName,
                        encodedValue
                    }
                })

                // TAH Core method to add actions to the action list
                this.addActions(actions, groupData)
            }
        }

        /**
         * Build spells
         * @private
         */
        async #buildSpells () {
            if (this.items.size === 0) return

            const spellMap = new Map()

            for (const [itemId, itemData] of this.items) {
                const type = itemData.type

                // Add all spell to the map
                if (type === 'spell') {
                    const typeMap = spellMap.get(type) ?? new Map()
                    typeMap.set(itemId, itemData)
                    spellMap.set(type, typeMap)
                }
            }

            for (const [type, typeMap] of spellMap) {
                const groupData = { id: 'spells', type: 'system' }

                // Get actions
                const actions = [...typeMap].map(([itemId, itemData]) => {
                    const id = itemId
                    const name = itemData.name
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE['item'])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = ['item', id].join(this.delimiter)

                    return {
                        id,
                        name,
                        listName,
                        encodedValue
                    }
                })

                // TAH Core method to add actions to the action list
                this.addActions(actions, groupData)
            }
        }

        /**
         * Build talents and special attacks and features
         * @private
         */
        async #buildTalents () {
            if (this.items.size === 0) return

            const talentMap = new Map()

            for (const [itemId, itemData] of this.items) {
                const type = itemData.type
                const bonus = itemData.system.bonus ?? ''

                // Add any rollable talents to the map
                if (['talent','feature','attack'].includes(type)
                    && bonus.match(/(^|,)\s*([\w\s]+)\s+([+-]\d+)do?\s*(,|$)/)) {
                    const typeMap = talentMap.get(type) ?? new Map()
                    typeMap.set(itemId, itemData)
                    talentMap.set(type, typeMap)
                }
            }

            for (const [type, typeMap] of talentMap) {
                const groupId = TALENT_TYPE[type]?.groupId
                if (!groupId) continue
                const groupData = { id: groupId, type: 'system' }

                // Get actions
                const actions = [...typeMap].map(([itemId, itemData]) => {
                    const id = itemId
                    const name = itemData.name
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE['item'])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = ['item', id].join(this.delimiter)

                    return {
                        id,
                        name,
                        listName,
                        encodedValue
                    }
                })

                // TAH Core method to add actions to the action list
                this.addActions(actions, groupData)
            }
        }

        /**
         * Build gear
         * @private
         */
        async #buildGear () {
            if (this.items.size === 0) return
            const gearMap = new Map()

            for (const [itemId, itemData] of this.items) {
                const type = itemData.type
                const bonus = itemData.system.bonus ?? ''

                // Add any gear or weapon with a bonus to the map
                if (['weapon','gear'].includes(type)
                    && bonus.match(/(^|,)\s*([\w\s]+)\s+([+-]\d+)do?\s*(,|$)/)) {
                    const typeMap = gearMap.get(type) ?? new Map()
                    typeMap.set(itemId, itemData)
                    gearMap.set(type, typeMap)
                }
            }

            for (const [type, typeMap] of gearMap) {
                const groupId = GEAR_TYPE[type]?.groupId
                if (!groupId) continue
                const groupData = { id: groupId, type: 'system' }

                // Get actions
                const actions = [...typeMap].map(([itemId, itemData]) => {
                    const id = itemId
                    const name = itemData.name
                    const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE['item'])
                    const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`
                    const encodedValue = ['item', id].join(this.delimiter)

                    return {
                        id,
                        name,
                        listName,
                        encodedValue
                    }
                })

                // TAH Core method to add actions to the action list
                this.addActions(actions, groupData)
            }
        }

        /**
         * Build wealth
         * @private
         */
        async #buildWealth () {
            // A character has to have wealth to allow this roll
            if ((this.actor.system.wealth ?? 0) === 0) { return }

            const groupData = { id: 'wealth', type: 'system' }
            const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE['item'])
            const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`

            // Add wealth as an action
            this.addActions([{
                id: 'wealth',
                name: coreModule.api.Utils.i18n(`THOSEWHOWANDER.label.wealth`),
                listName: listName,
                encodedValue: ['wealth', 'wealth'].join(this.delimiter),
            }], groupData)
        }

        /**
         * Build actions
         * @private
         */
        async #buildActions () {
            const groupData = { id: 'actions', type: 'system' }
            const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE['item'])
            const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`

            // Add actions to decrease, show and increase the actions
            this.addActions([{
                id: 'increase_actions',
                name: '',
                icon1: '<i class="fa fa-backward" aria-hidden="true"></i>',
                tooltip: coreModule.api.Utils.i18n('THOSEWHOWANDER.tooltip.remove_action'),
                encodedValue: ['actions', 'decrease_actions'].join(this.delimiter)
            }, {
                id: 'actions',
                name: coreModule.api.Utils.i18n('THOSEWHOWANDER.label.actions'),
                encodedValue: ['actions', 'actions'].join(this.delimiter),
                info1: { text: String(this.actor.system.actions) },
                cssClass: 'disabled',
            }, {
                id: 'increase_actions',
                name: '',
                icon1: '<i class="fa fa-forward" aria-hidden="true"></i>',
                tooltip: coreModule.api.Utils.i18n('THOSEWHOWANDER.tooltip.add_action'),
                encodedValue: ['actions', 'increase_actions'].join(this.delimiter)
            }], groupData)
        }

        /**
         * Build pools
         * @private
         */
        async #buildPools () {
            // Minions don't have pools
            if (this.actor.type === 'minion') { return }

            const parentGroupData = { id: 'pools', settings: { showTitle: false }, type: 'system' }
            const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE['item'])
            const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`

            // Show each pool value for reference along with decrease and increase actions
            Object.keys(this.actor.system.resistances).forEach( r => {
                // Set up a sub-group for this particular pool
                const groupData = {
                    id: 'pools_' + r,
                    settings: { showTitle: false },
                    stype: 'system'
                }
                this.addGroup(groupData, parentGroupData)

                // Add the actions for this resistance
                this.addActions([{
                    id: 'decrease_' + r + '_pool',
                    name: '',
                    icon1: '<i class="fa fa-backward" aria-hidden="true"></i>',
                    tooltip: coreModule.api.Utils.i18n('THOSEWHOWANDER.tooltip.decrease_pool'),
                    encodedValue: ['pool', 'decrease_' + r].join(this.delimiter)
                }, {
                    id: r + '_pool',
                    name: coreModule.api.Utils.i18n(CONFIG.THOSEWHOWANDER.pools[r]),
                    encodedValue: ['pool', r].join(this.delimiter),
                    info1: { text: String(this.actor.system.resistances[r].pool) + '/' +
                             this.actor.getPoolMax(r) },
                    cssClass: 'disabled',
                }, {
                    id: 'increase_' + r + '_pool',
                    name: '',
                    icon1: '<i class="fa fa-forward" aria-hidden="true"></i>',
                    tooltip: coreModule.api.Utils.i18n('THOSEWHOWANDER.tooltip.increase_pool'),
                    encodedValue: ['pool', 'increase_' + r].join(this.delimiter)
                }], groupData)
            })
        }

        /**
         * Build injuries
         * @private
         */
        async #buildInjuries () {
            // Minions don't have per-pool injuries
            if (this.actor.type === 'minion') { return }

            const parentGroupData = { id: 'injuries', type: 'system' }
            const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE['item'])
            const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`

            // Show each injuries value for reference along with decrease and increase actions
            Object.keys(this.actor.system.resistances).forEach( r => {
                // Set up a sub-group for this particular injuries
                const groupData = {
                    id: 'injuries_' + r,
                    settings: { showTitle: false },
                    type: 'system'
                }
                this.addGroup(groupData, parentGroupData)

                this.addActions([{
                    id: 'decrease_' + r + '_injuries',
                    name: '',
                    icon1: '<i class="fa fa-backward" aria-hidden="true"></i>',
                    tooltip: coreModule.api.Utils.i18n('THOSEWHOWANDER.tooltip.decrease_injuries'),
                    encodedValue: ['injuries', 'decrease_' + r].join(this.delimiter)
                }, {
                    id: r,
                    name: coreModule.api.Utils.i18n(CONFIG.THOSEWHOWANDER.pools[r]),
                    encodedValue: ['injuries', r].join(this.delimiter),
                    info1: { text: String(this.actor.system.resistances[r].injuries) },
                    cssClass: 'disabled',
                }, {
                    id: 'increase_' + r + '_injuries',
                    name: '',
                    icon1: '<i class="fa fa-forward" aria-hidden="true"></i>',
                    tooltip: coreModule.api.Utils.i18n('THOSEWHOWANDER.tooltip.increase_injuries'),
                    encodedValue: ['injuries', 'increase_' + r].join(this.delimiter)
                }], groupData)
            })
        }

        /**
         * Build minion dice rolls
         * @private
         */
        async #buildMinionDice () {
            // Astonishingly, only minions have minion dice
            if (this.actor.type !== 'minion' || !(this.actor.system.dice ?? 0)) { return }

            const groupData = { id: 'minion', type: 'system' }
            const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE['item'])
            const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`

            // Add minion dice rolls as an action
            this.addActions([{
                id: 'minion',
                name: coreModule.api.Utils.i18n(`THOSEWHOWANDER.label.minion`),
                listName: listName,
                encodedValue: ['minion', 'minion'].join(this.delimiter),
            }], groupData)
        }

        /**
         * Build damage (for minions only)
         * @private
         */
        async #buildDamage () {
            // Astonishingly, only minions take damage
            if (this.actor.type !== 'minion' || !(this.actor.system.dice ?? 0)) { return }

            const groupData = { id: 'damage', type: 'system' }
            const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE['item'])
            const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`

            // Add displaying and modifying damage as actions
            this.addActions([{
                id: 'decrease_damage',
                name: '',
                icon1: '<i class="fa fa-backward" aria-hidden="true"></i>',
                tooltip: coreModule.api.Utils.i18n('THOSEWHOWANDER.tooltip.decrease_damage'),
                encodedValue: ['injuries', 'decrease_damage'].join(this.delimiter)
            }, {
                id: 'minion',
                name: coreModule.api.Utils.i18n('THOSEWHOWANDER.label.damage'),
                encodedValue: ['injuries', 'minion'].join(this.delimiter),
                info1: { text: String(this.actor.system.damage) + '/' +
                         String(this.actor.system.dice) },
                cssClass: 'disabled',
            }, {
                id: 'increase_damage',
                name: '',
                icon1: '<i class="fa fa-forward" aria-hidden="true"></i>',
                tooltip: coreModule.api.Utils.i18n('THOSEWHOWANDER.tooltip.increase_damage'),
                encodedValue: ['injuries', 'increase_damage'].join(this.delimiter)
            }], groupData)
        }

        /**
         * Build refreshes
         * @private
         */
        async #buildRefresh () {
            // Minions don't have pools to refresh
            if (this.actor?.type === 'minion') { return }

            const groupData = { id: 'refresh', type: 'system' }
            const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE['item'])
            const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`

            // Add refresh pools
            this.addActions([{
                id: 'refresh',
                name: coreModule.api.Utils.i18n(`THOSEWHOWANDER.tooltip.refresh_pools`),
                listName: listName,
                encodedValue: ['refresh', 'refresh'].join(this.delimiter),
            }], groupData)
        }
    }
})
