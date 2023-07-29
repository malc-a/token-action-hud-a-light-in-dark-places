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
                name: coreModule.api.Utils.i18n('tokenActionHud.those-who-wander.resistances'),
                groups: [
                    { ...groups.resistances, nestId: 'resistances_resistances' },
                ]
            },
            {
                nestId: 'skills',
                id: 'skills',
                name: coreModule.api.Utils.i18n('tokenActionHud.those-who-wander.skills'),
                groups: [
                    { ...groups.minion, nestId: 'skills_minion' },
                    { ...groups.skills, nestId: 'skills_skills' },
                ]
            },
            {
                nestId: 'magic',
                id: 'magic',
                name: coreModule.api.Utils.i18n('tokenActionHud.those-who-wander.magic'),
                groups: [
                    { ...groups.schools, nestId: 'magic_schools' },
                    { ...groups.spells, nestId: 'magic_spells' },
                ]
            },
            {
                nestId: 'talents',
                id: 'talents',
                name: coreModule.api.Utils.i18n('tokenActionHud.those-who-wander.talents'),
                groups: [
                    { ...groups.talents, nestId: 'talents_talents' },
                    { ...groups.attacks, nestId: 'talents_attacks' },
                    { ...groups.features, nestId: 'talents_features' },
                ]
            },
            {
                nestId: 'gear',
                id: 'gear',
                name: coreModule.api.Utils.i18n('tokenActionHud.those-who-wander.gear'),
                groups: [
                    { ...groups.weapons, nestId: 'gear_weapons' },
                    { ...groups.gear, nestId: 'gear_gear' },
                ]
            },
            {
                nestId: 'status',
                id: 'status',
                name: coreModule.api.Utils.i18n('tokenActionHud.those-who-wander.status'),
                groups: [
                    { ...groups.actions, nestId: 'status_actions' },
                    { ...groups.pools, nestId: 'status_pools' },
                    { ...groups.injuries, nestId: 'status_injuries' },
                    { ...groups.refresh, nestId: 'status_refresh' },
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
                    { ...groups.utility, nestId: 'utility_utility' },
                ]
            }
        ],
        groups: groupsArray
    }
})
