/**
 * Module-based constants
 */
export const MODULE = {
    ID: 'token-action-hud-a-light-in-dark-places'
};

/**
 * Core module
 */
export const CORE_MODULE = {
    ID: 'token-action-hud-core'
};

/**
 * Core module version required by the system module
 */
export const REQUIRED_CORE_MODULE_VERSION = '2.0';

/**
 * Action types
 */
export const ACTION_TYPE = {
    item: 'tokenActionHud.alidp.item',
    utility: 'tokenActionHud.utility'
};

/**
 * Groups
 */
export const GROUP = {
    resistances: { id: 'resistances', name: 'tokenActionHud.alidp.resistances',
                   type: 'system' },
    skills: { id: 'skills', name: 'tokenActionHud.alidp.skills', type: 'system' },
    minion: { id: 'minion', name: 'tokenActionHud.alidp.minion', type: 'system' },
    schools: { id: 'schools', name: 'tokenActionHud.alidp.schools', type: 'system' },
    spells: { id: 'spells', name: 'tokenActionHud.alidp.spells', type: 'system' },
    talents: { id: 'talents', name: 'tokenActionHud.alidp.talents', type: 'system' },
    features: { id: 'features', name: 'tokenActionHud.alidp.features', type: 'system' },
    attacks: { id: 'attacks', name: 'tokenActionHud.alidp.attacks', type: 'system' },
    weapons: { id: 'weapons', name: 'tokenActionHud.alidp.weapons', type: 'system' },
    gear: { id: 'gear', name: 'tokenActionHud.alidp.gear', type: 'system' },
    actions: { id: 'actions', name: 'tokenActionHud.alidp.actions', type: 'system' },
    pools: { id: 'pools', name: 'tokenActionHud.alidp.pools', type: 'system' },
    injuries: { id: 'injuries', name: 'tokenActionHud.alidp.injuries', type: 'system' },
    damage: { id: 'damage', name: 'tokenActionHud.alidp.damage', type: 'system' },
    refresh: { id: 'refresh', name: 'tokenActionHud.alidp.refresh', type: 'system' },
    wealth: { id: 'wealth', name: 'tokenActionHud.alidp.wealth', type: 'system' },
    combat: { id: 'combat', name: 'tokenActionHud.combat', type: 'system' },
    token: { id: 'token', name: 'tokenActionHud.token', type: 'system' },
    utility: { id: 'utility', name: 'tokenActionHud.utility', type: 'system' },
};

/**
 * Talent/feature types
 */
export const TALENT_TYPE = {
    talent: { groupId: 'talents' },
    attack: { groupId: 'attacks' },
    feature: { groupId: 'features' }
};

/**
 * Item types
 */
export const GEAR_TYPE = {
    weapon: { groupId: 'weapons' },
    gear: { groupId: 'gear' }
};
