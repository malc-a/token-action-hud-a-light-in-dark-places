/**
 * Module-based constants
 */
export const MODULE = {
    ID: 'token-action-hud-those-who-wander'
}

/**
 * Core module
 */
export const CORE_MODULE = {
    ID: 'token-action-hud-core'
}

/**
 * Core module version required by the system module
 */
export const REQUIRED_CORE_MODULE_VERSION = '1.4'

/**
 * Action types
 */
export const ACTION_TYPE = {
    item: 'tokenActionHud.those-who-wander.item',
    utility: 'tokenActionHud.utility'
}

/**
 * Groups
 */
export const GROUP = {
    resistances: { id: 'resistances', name: 'tokenActionHud.those-who-wander.resistances',
                   type: 'system' },
    skills: { id: 'skills', name: 'tokenActionHud.those-who-wander.skills', type: 'system' },
    minion: { id: 'minion', name: 'tokenActionHud.those-who-wander.minion', type: 'system' },
    schools: { id: 'schools', name: 'tokenActionHud.those-who-wander.schools', type: 'system' },
    spells: { id: 'spells', name: 'tokenActionHud.those-who-wander.spells', type: 'system' },
    talents: { id: 'talents', name: 'tokenActionHud.those-who-wander.talents', type: 'system' },
    attacks: { id: 'attacks', name: 'tokenActionHud.those-who-wander.attacks', type: 'system' },
    features: { id: 'features', name: 'tokenActionHud.those-who-wander.features', type: 'system' },
    weapons: { id: 'weapons', name: 'tokenActionHud.those-who-wander.weapons', type: 'system' },
    gear: { id: 'gear', name: 'tokenActionHud.those-who-wander.gear', type: 'system' },
    wealth: { id: 'wealth', name: 'tokenActionHud.those-who-wander.wealth', type: 'system' },
    combat: { id: 'combat', name: 'tokenActionHud.combat', type: 'system' },
    token: { id: 'token', name: 'tokenActionHud.token', type: 'system' },
    utility: { id: 'utility', name: 'tokenActionHud.utility', type: 'system' }
}

/**
 * Talent/feature types
 */
export const TALENT_TYPE = {
    talent: { groupId: 'talents' },
    attack: { groupId: 'attacks' },
    feature: { groupId: 'features' }
}

/**
 * Item types
 */
export const GEAR_TYPE = {
    weapon: { groupId: 'weapons' },
    gear: { groupId: 'gear' }
}
