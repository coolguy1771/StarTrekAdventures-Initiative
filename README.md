# Overview
This [FoundryVTT](https://foundryvtt.com/) module provides various CombatTracker improvements, intended to be used with the [StarTrekAdventures system](https://github.com/mkscho63/sta). However, it _may_ be suitable for other game systems that have attribute-derived combat initiative. The module builds on top of the awesome [Lancer Initiative](https://github.com/BoltsJ/lancer-initiative.git) module.

# Features
- Should you use the [StarTrekAdventures](https://github.com/mkscho63/sta) system, you may want to also consider using my [StarTrek Adventures Initiative Fix](https://github.com/CoolcatFVTT/StarTrekAdventures-Initiative-Fix) module. This fixes the formula for initiative to use the _Daring_ attribute, as stated in StarTrek Adventures core rules, rather than _Security_ discipline. It's kept as a separate module to increase chances that these CombatTracker improvements may be helpful for other game systems.
- **Automatically start combat** when initializing an encounter and **automatically set initiatives**.
- **Hide chat messages and notification spam** from "rolling" initiatives in the background.
- **Hide combatant names** from players, if they are hidden for them in token settings. Combatants show as "Unknown Combatant" (or your localized equivalent). Names are always visible for GM.
- **Hide combatant initiative** of neutral and enemy characters from players. Always visible for GM.
- Features inherited from [Lancer Initiative](https://github.com/BoltsJ/lancer-initiative.git):
	- **Sort combatants** by friendly/neutral/enemy, then by initiative.
	- Support for combatants that have **multiple turns per round**. E.g. for NPC ship crews or when given by special talents. GM can right-click combatants in the list and hit _"Add Activation"_.