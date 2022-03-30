class STAInitiative {
	static get MODULE_ID() { return "sta-initiative"; }
	
	// Determine message visibility.
	static isMessageVisible(cm)
	{
		const isWhisper = cm.data.whisper && cm.data.whisper.length > 0,
			  isBlind = isWhisper && cm.data.blind;
		return !isBlind;
	}
	
	// Determine whether combatant info should be visible in the CombatTracker.
	static isCombatantInfoVisible(combatant)
	{
		if (!combatant.token || game.user.isGM)
			return true;
		else if (combatant.data.name)
			return true; // manual display name override in CombatTracker
		
		const mode = combatant.token.data.displayName;			
		if (mode === CONST.TOKEN_DISPLAY_MODES.NONE)
			return false;
		else if (mode === CONST.TOKEN_DISPLAY_MODES.CONTROL ||
		         mode === CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER ||
				 mode === CONST.TOKEN_DISPLAY_MODES.OWNER)
			return combatant.token.isOwner;
		else
			return true;
	}
}

// Hide private messages entirely.
Hooks.on('renderChatMessage', (cm, jq) => {
	const html = jq[0];
	if (STAInitiative.isMessageVisible(cm))
		html.style.removeProperty('display');
	else
		html.style.display = 'none';
});

Hooks.once('setup', () => {	
	// Fix formula for initiative to use the daring attribute, as stated in StarTrek Adventures core rules, rather than security discipline
	CONFIG.Combat.initiative =
	{
		formula: '@attributes.daring.value',
		decimals: 0
	};
	
	// Automatically start combat when initializing the encounter
  	libWrapper.register(STAInitiative.MODULE_ID, 'CombatTracker.prototype.initialize', function(wrapped, {combat=null, render=true}={})
	{
		wrapped();
		
		// nested timeout, we need to wait one full event cycle for everything to be properly initialized before we can start combat 
		setTimeout((tracker) => {
			setTimeout((tracker) => {
				const combat = tracker.viewed;
				if (combat !== null && !combat.started)
					combat.startCombat();
			}, 0, tracker);
		}, 0, this);
	}, 'WRAPPER');
		
	// Automatically roll initiative when starting combat
  	libWrapper.register(STAInitiative.MODULE_ID, 'Combat.prototype.startCombat', function(wrapped)
	{
		return wrapped().then(() => this.rollAll());
	}, 'WRAPPER');
	
	// Force Initiative rolls to be blind
	libWrapper.register(STAInitiative.MODULE_ID, 'Combat.prototype.rollInitiative', function(wrapped, ids, {formula=null, updateTurn=true, messageOptions={}}={})
	{
		messageOptions.rollMode = CONST.DICE_ROLL_MODES.BLIND;
		return wrapped(ids, {formula, updateTurn, messageOptions});
	}, 'WRAPPER');
		
	// Eliminate new message notification if the message is not visible.
	libWrapper.register(STAInitiative.MODULE_ID, 'ChatLog.prototype.notify', function(wrapped, cm)
	{
		this._lastMessageTime = Date.now();
		if (STAInitiative.isMessageVisible(cm))
			wrapped(cm);
	}, 'MIXED');	
	
	// Hide Combatant names in CombatTracker, if hidden in HUD
	libWrapper.register(STAInitiative.MODULE_ID, 'Combatant.prototype.name', function(wrapped)
	{
		if (STAInitiative.isCombatantInfoVisible(this))
			return wrapped();
		else
			return game.i18n.localize("COMBAT.UnknownCombatant");
	}, 'MIXED');
	
	// Hide Combatant initiative in CombatTracker, when not the GameMaster (works via CSS)
	libWrapper.register(STAInitiative.MODULE_ID, 'CombatTracker.prototype.activateListeners', function(wrapped, html)
	{
		const tracker = html.find("#combat-tracker");
		if (tracker.length == 1)
			tracker[0].classList.add(game.user.isGM ? "sta-initiative-gm" : "sta-initiative-player");
		return wrapped(html);		
	}, 'WRAPPER');
});

Hooks.once('ready', () => {
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