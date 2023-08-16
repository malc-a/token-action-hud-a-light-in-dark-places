import { GROUP } from './constants.js'

/**
 * Default layout and groups
 */
export let DEFAULTS = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    const groups = GROUP;
    Object.values(groups).forEach(group => {
        group.name = coreModule.api.Utils.i18n(group.name);
        group.listName = `Group: ${coreModule.api.Utils.i18n(group.listName ?? group.name)}`;
    });
    const groupsArray = Object.values(groups);
    DEFAULTS = {
        layout: [
            {
                nestId: 'resistances',
                id: 'resistances',
                name: coreModule.api.Utils.i18n('tokenActionHud.alidp.resistances'),
                groups: [
                    { ...groups.resistances, nestId: 'resistances_resistances' },
                ],
            },
            {
                nestId: 'skills',
                id: 'skills',
                name: coreModule.api.Utils.i18n('tokenActionHud.alidp.skills'),
                groups: [
                    { ...groups.minion, nestId: 'skills_minion' },
                    { ...groups.skills, nestId: 'skills_skills' },
                ],
            },
            {
                nestId: 'magic',
                id: 'magic',
                name: coreModule.api.Utils.i18n('tokenActionHud.alidp.magic'),
                groups: [
                    { ...groups.schools, nestId: 'magic_schools' },
                    { ...groups.spells, nestId: 'magic_spells' },
                ],
            },
            {
                nestId: 'talents',
                id: 'talents',
                name: coreModule.api.Utils.i18n('tokenActionHud.alidp.talents'),
                groups: [
                    { ...groups.talents, nestId: 'talents_talents' },
                ],
            },
            {
                nestId: 'features',
                id: 'features',
                name: coreModule.api.Utils.i18n('tokenActionHud.alidp.features'),
                groups: [
                    { ...groups.attacks, nestId: 'features_attacks' },
                    { ...groups.features, nestId: 'features_features' },
                ],
            },
            {
                nestId: 'gear',
                id: 'gear',
                name: coreModule.api.Utils.i18n('tokenActionHud.alidp.gear'),
                groups: [
                    { ...groups.weapons, nestId: 'gear_weapons' },
                    { ...groups.gear, nestId: 'gear_gear' },
                ],
            },
            {
                nestId: 'status',
                id: 'status',
                name: coreModule.api.Utils.i18n('tokenActionHud.alidp.status'),
                groups: [
                    { ...groups.actions, nestId: 'status_actions' },
                    { ...groups.pools, nestId: 'status_pools' },
                    { ...groups.injuries, nestId: 'status_injuries' },
                    { ...groups.damage, nestId: 'status_damage' },
                    { ...groups.refresh, nestId: 'status_refresh' },
                ],
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
                ],
            },
        ],
        groups: groupsArray,
    };
});
