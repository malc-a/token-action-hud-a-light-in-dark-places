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
            this.actors = (!this.actor) ? this._getActors() : [this.actor]
            this.actorType = this.actor?.type

            // Set items variable
            if (this.actor) {
                let items = this.actor.items
                items = coreModule.api.Utils.sortItemsByName(items)
                this.items = items
            }

            if (this.actor) {
                this.#buildCharacterActions()
            } else {
                this.#buildMultipleTokenActions()
            }
        }

        /**
         * Build character actions
         * @private
         */
        #buildCharacterActions () {
	    this.#buildResistances()
	    this.#buildSkills()
	    this.#buildSchools()
	    this.#buildSpells()
	    this.#buildTalents()
            this.#buildGear()
            this.#buildWealth()
	    this.#buildMinionDice()
	    this.#buildRefresh()
        }

        /**
         * Build multiple token actions
         * @private
         * @returns {object}
         */
        #buildMultipleTokenActions () {
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
                    description: coreModule.api.Utils.i18n(`THOSEWHOWANDER.resistance.${r}`),
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

        async #buildTalents () {
            if (this.items.size === 0) return

            const talentMap = new Map()

            for (const [itemId, itemData] of this.items) {
                const type = itemData.type
		const bonus = itemData.system.bonus ?? ""

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
		const bonus = itemData.system.bonus ?? ""

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
            const groupData = { id: 'wealth', type: 'system' }
            const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE['item'])
            const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`

            // Check if the character has wealth before allowing the roll
            if ((this.actor.system.wealth ?? 0) > 0) {
                // Add wealth as an action
                this.addActions([{
                    id: "wealth",
                    name: coreModule.api.Utils.i18n(`THOSEWHOWANDER.label.wealth`),
                    description: coreModule.api.Utils.i18n(`THOSEWHOWANDER.label.wealth`),
                    listName: listName,
                    encodedValue: ['wealth', 'wealth'].join(this.delimiter),
                }], groupData)
            }
        }

        /**
         * Build minion dice rolls
         * @private
         */
        async #buildMinionDice () {
            const groupData = { id: 'minion', type: 'system' }
            const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE['item'])
            const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`

            // Check if the character is a minion before allowing the roll
            if (this.actor.type === 'minion' && (this.actor.system.dice ?? 0)) {
                // Add minion attacks as an action
                this.addActions([{
                    id: "minion",
                    name: coreModule.api.Utils.i18n(`THOSEWHOWANDER.label.minion`),
                    description: coreModule.api.Utils.i18n(`THOSEWHOWANDER.label.minion`),
                    listName: listName,
                    encodedValue: ['minion', 'minion'].join(this.delimiter),
                }], groupData)
            }
        }

        /**
         * Build refreshes
         * @private
         */
        async #buildRefresh () {
            const groupData = { id: 'utility', type: 'system' }
            const actionTypeName = coreModule.api.Utils.i18n(ACTION_TYPE['item'])
            const listName = `${actionTypeName ? `${actionTypeName}: ` : ''}${name}`

            // Minions don't have pools to refresh
            if (this.actor.type !== 'minion') {
                // Add refresh pools
                this.addActions([{
                    id: "refresh",
                    name: coreModule.api.Utils.i18n(`THOSEWHOWANDER.label.refresh`),
                    description: coreModule.api.Utils.i18n(`THOSEWHOWANDER.label.refresh`),
                    listName: listName,
                    encodedValue: ['refresh', 'refresh'].join(this.delimiter),
                }], groupData)
            }
        }
    }
})
