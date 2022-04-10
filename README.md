# Overview
This [FoundryVTT](https://foundryvtt.com/) module provides various CombatTracker improvements, intended to be used with the [StarTrekAdventures system](https://github.com/mkscho63/sta). The module heavily interacts with the awesome [Lancer Initiative](https://github.com/BoltsJ/lancer-initiative.git) module by Bolts, which does most of the work.

### GameMaster View
![gm-view.webp](https://raw.githubusercontent.com/wiki/CoolcatFVTT/StarTrekAdventures-Initiative/images/gm-view.webp)

### Player View (with some info hidden)
![player-view.webp](https://raw.githubusercontent.com/wiki/CoolcatFVTT/StarTrekAdventures-Initiative/images/player-view.webp)

# Features
- **Fix the formula for initiative** to use the _Daring_ attribute, as stated in StarTrek Adventures core rules, rather than _Security_ discipline.
- **Automatically start combat** when initializing an encounter.
- **Automatically "roll" initiatives** and **reset activation** whenever a character joins the encounter.
- **Hide chat messages and notification spam** from "rolling" initiatives in the background.
- If the combatant token is hidden to players based on its token settings:
	- **Hide combatant names** from players in CombatTracker as well as ChatLog. Combatants show as "Unknown Combatant" (or your localized equivalent). Always visible for GM.
	- **Hide target value** of dice rolls in ChatLog, to not reveal stats to players. Always visible for GM.
- **Hide combatant initiative** of neutral and enemy characters from players in CombatTracker. Always visible for GM. Players only see the turn-order, not actual values.
- **Hide initiatives roll buttons for GM**, as they aren't needed anymore.
- Features inherited from [Lancer Initiative](https://github.com/BoltsJ/lancer-initiative.git):
	- **Sort combatants** by friendly/neutral/enemy, then by initiative.
	- Support for combatants that have **multiple turns per round**. E.g. for NPC ship crews or when given by special talents. GM can right-click combatants in the list and hit _"Add Activation"_.

# Tested against these Dependencies
- [Star Trek Adventures 2d20 system](https://foundryvtt.com/packages/sta) by FullMetalSeraph - Version 1.1.6 ([Manifest](https://raw.githubusercontent.com/mkscho63/sta/master/src/system.json))
- [Lancer Initiative](https://foundryvtt.com/packages/lancer-initiative) by Bolts - Version 24 ([Manifest](https://github.com/BoltsJ/lancer-initiative/releases/download/v24/module.json))
- [LibWrapper](https://foundryvtt.com/packages/lib-wrapper) by ruipin - Version 1.12.4.0 ([Manifest](https://github.com/ruipin/fvtt-lib-wrapper/releases/download/v1.12.4.0/module.json))
- [LCARS UI for Star Trek Adventures](https://foundryvtt.com/packages/sta-lcars-ui) by Fabulist - Version 0.2.2 ([Manifest](https://raw.githubusercontent.com/FabulistVtt/sta-lcars-ui/main/module.json)) (just strongly recommended, not a hard-dependency)
# Credits
Various other modules and assets used have been used for the video/screenshot:
- [Combat Utility Belt](https://github.com/death-save/combat-utility-belt)
- [Dice So Nice!](https://gitlab.com/riccisi/foundryvtt-dice-so-nice)
- [Shared Vision](https://github.com/CDeenen/SharedVision)
- [Unity2Foundry](https://github.com/CoolcatFVTT/Unity2Foundry-Module)
- [Replaced death status icon](https://en.wikipedia.org/wiki/File:Skull_and_Crossbones.svg)
- For assets used for the map, see [Unity2Foundry Credits](https://github.com/CoolcatFVTT/Unity2Foundry-Project/blob/main/README.md#credits)
- Character token icons were created from [StarTrek Online](https://store.steampowered.com/app/9900/Star_Trek_Online/)
- Various item icons: [Memory-Alpha](https://memory-alpha.fandom.com/)
