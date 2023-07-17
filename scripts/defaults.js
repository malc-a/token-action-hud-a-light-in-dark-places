import { GROUP } from './constants.js'

/**
 * Default layout and groups
 */
export let DEFAULTS = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    const groups = GROUP
    Object.values(groups).forEach(group => {
        group.name = coreModule.api.Utils.i18n(group.name)
        group.listName = `Group: ${coreModule.api.Utils.i18n(group.listName ?? group.name)}`
    })
    const groupsArray = Object.values(groups)
    DEFAULTS = {
        layout: [
            {
                nestId: 'resistances',
                id: 'resistances',
                name: coreModule.api.Utils.i18n('THOSEWHOWANDER.label.resistances'),
                groups: [
                    { ...groups.resistances, nestId: 'resistances_resistances' }
		]
	    },
            {
                nestId: 'skills',
                id: 'skills',
                name: coreModule.api.Utils.i18n('THOSEWHOWANDER.label.skills'),
                groups: [
                    { ...groups.skills, nestId: 'skills_skills' }
		]
	    },
            {
                nestId: 'magic',
                id: 'magic',
                name: coreModule.api.Utils.i18n('THOSEWHOWANDER.label.magic'),
                groups: [
                    { ...groups.schools, nestId: 'magic_schools' },
                    { ...groups.spells, nestId: 'magic_spells' }
		]
	    },
            {
                nestId: 'talents',
                id: 'talents',
                name: coreModule.api.Utils.i18n('THOSEWHOWANDER.label.talents'),
                groups: [
                    { ...groups.talents, nestId: 'talents_talents' }
		]
	    },
            {
                nestId: 'gear',
                id: 'gear',
                name: coreModule.api.Utils.i18n('THOSEWHOWANDER.label.gear'),
                groups: [
                    { ...groups.weapons, nestId: 'gear_weapons' },
                    { ...groups.gear, nestId: 'gear_gear' }
                ]
            },
            {
                nestId: 'utility',
                id: 'utility',
                name: coreModule.api.Utils.i18n('tokenActionHud.utility'),
                groups: [
                    { ...groups.wealth, nestId: 'utility_wealth' },
                    { ...groups.combat, nestId: 'utility_combat' },
                    { ...groups.token, nestId: 'utility_token' },
                    { ...groups.rests, nestId: 'utility_rests' },
                    { ...groups.utility, nestId: 'utility_utility' }
                ]
            }
        ],
        groups: groupsArray
    }
})
