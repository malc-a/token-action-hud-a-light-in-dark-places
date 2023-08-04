export let RollHandler = null

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
    /**
     * Extends Token Action HUD Core's RollHandler class and handles action events triggered when an action is clicked
     */
    RollHandler = class RollHandler extends coreModule.api.RollHandler {
        /**
         * Handle action event
         * Called by Token Action HUD Core when an action event is triggered
         * @override
         * @param {object} event        The event
         * @param {string} encodedValue The encoded value
         */
        async doHandleActionEvent (event, encodedValue) {
            const payload = encodedValue.split('|')

            if (payload.length !== 2) {
                super.throwInvalidValueErr()
            }

            const actionTypeId = payload[0]
            const actionId = payload[1]

            const renderable = ['item']

            if (renderable.includes(actionTypeId) && this.isRenderItem()) {
                return this.doRenderItem(this.actor, actionId)
            }

            const knownCharacters = ['character','minion','menace', 'master']

            // If single actor is selected
            if (this.actor) {
                await this.#handleAction(event, this.actor, this.token, actionTypeId, actionId)
                return
            }

            const controlledTokens = canvas.tokens.controlled
                  .filter((token) => knownCharacters.includes(token.actor?.type))

            // If multiple actors are selected
            for (const token of controlledTokens) {
                const actor = token.actor
                await this.#handleAction(event, actor, token, actionTypeId, actionId)
            }
        }

        /**
         * Handle action
         * @private
         * @param {object} event        The event
         * @param {object} actor        The actor
         * @param {object} token        The token
         * @param {string} actionTypeId The action type id
         * @param {string} actionId     The actionId
         */
        async #handleAction (event, actor, token, actionTypeId, actionId) {
            switch (actionTypeId) {
            case 'resistance':
                this.#handleResistanceAction(event, actor, actionId)
                break;
            case 'item':
                this.#handleItemAction(event, actor, actionId)
                break
            case 'wealth':
                this.#handleWealthAction(event, actor, actionId)
                break;
            case 'minion':
                this.#handleMinionDiceAction(event, actor, actionId)
                break;
            case 'actions':
                this.#handleActionsAction(event, actor, actionId)
                break;
            case 'pool':
                this.#handlePoolsAction(event, actor, actionId)
                break;
            case 'injuries':
                this.#handleInjuriesAction(event, actor, actionId)
                break;
            case 'refresh':
                this.#handleRefreshAction(event, actor, actionId)
                break;
            case 'utility':
                this.#handleUtilityAction(token, actionId)
                break
            }
        }

        /**
         * Handle resistance action
         * @private
         * @param {object} event    The event
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        #handleResistanceAction (event, actor, actionId) {
            actor.rollResistance(event, actionId)
        }

        /**
         * Handle item action
         * @private
         * @param {object} event    The event
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        #handleItemAction (event, actor, actionId) {
            const item = actor.items.get(actionId)
            item.roll(event)
        }

        /**
         * Handle wealth action
         * @private
         * @param {object} event    The event
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        #handleWealthAction (event, actor, actionId) {
            actor.rollWealth(event)
        }

        /**
         * Handle minion dice action
         * @private
         * @param {object} event    The event
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        #handleMinionDiceAction (event, actor, actionId) {
            actor.rollMinionDice(event)
        }

        /**
         * Handle actions action
         * @private
         * @param {object} event    The event
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        #handleActionsAction (event, actor, actionId) {
            // We might be increasing or decreasing actions
            switch (actionId) {
            case 'increase_actions':
                actor.updateActions(actor.system.actions + 1)
                break;
            case 'decrease_actions':
                actor.updateActions(actor.system.actions - 1)
                break;
            }
        }

        /**
         * Handle pools action
         * @private
         * @param {object} event    The event
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        #handlePoolsAction (event, actor, actionId) {
            // We might be increasing or decreasing a pool
            switch (actionId) {
            case 'increase_body':
                actor.updatePool('body', actor.system.resistances.body.pool + 1)
                break;
            case 'decrease_body':
                actor.updatePool('body', actor.system.resistances.body.pool - 1)
                break;
            case 'increase_mind':
                actor.updatePool('mind', actor.system.resistances.mind.pool + 1)
                break;
            case 'decrease_mind':
                actor.updatePool('mind', actor.system.resistances.mind.pool - 1)
                break;
            case 'increase_soul':
                actor.updatePool('soul', actor.system.resistances.soul.pool + 1)
                break;
            case 'decrease_soul':
                actor.updatePool('soul', actor.system.resistances.soul.pool - 1)
                break;
            }
        }

        /**
         * Handle injuries action
         * @private
         * @param {object} event    The event
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        #handleInjuriesAction (event, actor, actionId) {
            // We might be increasing or decreasing injuries or damage
            switch (actionId) {
            case 'increase_damage':
                actor.updateInjuries('minion', actor.system.damage + 1)
                break;
            case 'decrease_damage':
                actor.updateInjuries('minion', actor.system.damage - 1)
                break;
            case 'increase_body':
                actor.updateInjuries('body', actor.system.resistances.body.injuries + 1)
                break;
            case 'decrease_body':
                actor.updateInjuries('body', actor.system.resistances.body.injuries - 1)
                break;
            case 'increase_mind':
                actor.updateInjuries('mind', actor.system.resistances.mind.injuries + 1)
                break;
            case 'decrease_mind':
                actor.updateInjuries('mind', actor.system.resistances.mind.injuries - 1)
                break;
            case 'increase_soul':
                actor.updateInjuries('soul', actor.system.resistances.soul.injuries + 1)
                break;
            case 'decrease_soul':
                actor.updateInjuries('soul', actor.system.resistances.soul.injuries - 1)
                break;
            }
        }

        /**
         * Handle refresh action
         * @private
         * @param {object} event    The event
         * @param {object} actor    The actor
         * @param {string} actionId The action id
         */
        #handleRefreshAction (event, actor, actionId) {
            actor.refreshPools()
        }

        /**
         * Handle utility action
         * @private
         * @param {object} token    The token
         * @param {string} actionId The action id
         */
        async #handleUtilityAction (token, actionId) {
            switch (actionId) {
            case 'endTurn':
                if (game.combat?.current?.tokenId === token.id) {
                    await game.combat?.nextTurn()
                }
                break
            }
        }
    }
})
