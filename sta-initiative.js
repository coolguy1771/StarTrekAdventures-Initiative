class STAInitiative {
	static get MODULE_ID() { return "sta-initiative"; }
	
	static shouldHideChatMessage(cm)
	{
		return cm?.data?.flags?.core?.initiativeRoll;
	}
	
	static shouldCensorChatMessage(cm)
	{
		const speaker = cm.data.speaker;
		if (!speaker)
			return false;
		
		const token = game.scenes.get(speaker.scene).tokens.get(speaker.token);
		const result = !this.isTokenInfoVisible(token);
		return result;
	}
	
	static isCombatantInfoVisible(combatant)
	{
		if (game.user.isGM)
			return true;
		else if (combatant._source.name)
			return true; // manual display name override in CombatTracker
		else
			return this.isTokenInfoVisible(combatant.token);
	}
	
	static isTokenInfoVisible(token)
	{
		if (!token || game.user.isGM)
			return true;
		
		const mode = token.data.displayName;			
		if (mode === CONST.TOKEN_DISPLAY_MODES.NONE)
			return false;
		else if (mode === CONST.TOKEN_DISPLAY_MODES.CONTROL ||
		         mode === CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER ||
				 mode === CONST.TOKEN_DISPLAY_MODES.OWNER)
			return token.isOwner;
		else
			return true;
	}
	
	static requestRoll(combat)
	{	
		if (this._queuedCombats.indexOf(combat) === -1)
		{
			this._queuedCombats.push(combat);		
			setTimeout(this._processRoll);	
		}
	}	
	
	static _queuedCombats = [];
	
	static _processRoll()
	{
		for (const combat of STAInitiative._queuedCombats)
		{
			combat.rollAll().then(() => 
			{
				if (!combat.started)
					combat.startCombat();
			});
		}
		STAInitiative._queuedCombats.length = 0;
	}
}

// Hide or censor chat messages.
Hooks.on('renderChatMessage', (cm, jq) =>
{
	if (STAInitiative.shouldHideChatMessage(cm))
	{
		jq[0].style.display = 'none';
	}
 	else if (STAInitiative.shouldCensorChatMessage(cm))
	{
		const speaker = jq.find("header.message-header > h4.message-sender")[0];
		if (speaker)
			speaker.innerHTML = game.i18n.localize("COMBAT.UnknownCombatant");
		
		const diceTarget = jq.find("div.message-content > div > div.dice-roll > div.dice-result > div.dice-formula > table.aim > tbody > tr > td:nth-child(2)")[0];
		if (diceTarget)
			diceTarget.innerHTML = "Target:?"; // appearently not localized in STA
	}
});

Hooks.once('setup', () =>
{	
	// Fix formula for initiative to use the daring attribute, as stated in StarTrek Adventures core rules, rather than security discipline
	CONFIG.Combat.initiative =
	{
		formula: '@attributes.daring.value',
		decimals: 0
	};
		
	// Automatically reset activation and roll initiative for anyone joining the the encounter
  	libWrapper.register(STAInitiative.MODULE_ID, 'Combat.prototype._onCreateEmbeddedDocuments', function(wrapped, type, documents, result, options, userId)
	{
		wrapped(type, documents, result, options, userId);
		
		if (game.user.isGM && type == "Combatant")
		{
			const module = CONFIG.LancerInitiative.module;
			const updates = documents.map(c =>
			{
				// Ugly logic, but copy&paste from compressed/optimized LancerCombat.resetActivations to make sure it does the same
				var _a, _b;
				return {
					_id: c.id,
					[`flags.${module}.activations.value`]: this.settings.skipDefeated &&
						(c.data.defeated ||
							!!((_a = c.actor) === null || _a === void 0 ? void 0 : _a.effects.find(e => e.getFlag("core", "statusId") === CONFIG.Combat.defeatedStatusId)))
						? 0
						: (_b = c.activations.max) !== null && _b !== void 0 ? _b : 0
				};
			});
			this.updateEmbeddedDocuments("Combatant", updates).then(() => STAInitiative.requestRoll(this));
		}
	}, 'WRAPPER');
				
	// Eliminate new message notification icon, if the message is not visible.
	libWrapper.register(STAInitiative.MODULE_ID, 'ChatLog.prototype.notify', function(wrapped, cm)
	{
		this._lastMessageTime = Date.now();
		if (!STAInitiative.shouldHideChatMessage(cm))
			wrapped(cm);
	}, 'MIXED');	
	
	// Hide Combatant names in CombatTracker, if hidden in HUD
	libWrapper.register(STAInitiative.MODULE_ID, 'Combatant.prototype.prepareDerivedData', function(wrapped)
	{
		wrapped();
		if (!STAInitiative.isCombatantInfoVisible(this))
			this.name = game.i18n.localize("COMBAT.UnknownCombatant");
	}, 'WRAPPER');
	
	// Hide Combatant initiative in CombatTracker, when not the GameMaster (works via CSS)
	libWrapper.register(STAInitiative.MODULE_ID, 'CombatTracker.prototype.activateListeners', function(wrapped, html)
	{
		const tracker = html.find("#combat-tracker");
		if (tracker.length == 1)
			tracker[0].classList.add(game.user.isGM ? "sta-initiative-gm" : "sta-initiative-player");
		return wrapped(html);		
	}, 'WRAPPER');
});

Hooks.once('ready', () =>
{
	// Check dependencies
    if (!game.modules.get('lib-wrapper')?.active && game.user.isGM)
	{
        ui.notifications.error("Module '" + STAInitiative.MODULE_ID + "' requires the 'libWrapper' module. Please install and activate it.");
	}
	
	if (!CONFIG?.LancerInitiative?.enable_initiative && game.user.isGM)
	{
		ui.notifications.error("Module '" + STAInitiative.MODULE_ID + "' requires the 'lancer-initiative' module to have its 'Enable Initative Rolling' option enabled. Please check settings of the 'lancer-initiative' module.");
	}
});