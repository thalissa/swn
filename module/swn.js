/**
 * Author: Atropos - From Simple Worldbuilding.
 * Modified by Thalissa for use in the Stars Without Number system
 */

// Import Modules
import { SwnItem } from "./items/item.js"
import { SwnItemSheet } from "./items/equipment-item-sheet.js"
import { PlayerActorSheet } from "./actors/PlayerActorSheet.js"
import { NpcActorSheet } from "./actors/NpcActorSheet.js"
import { preloadHandlebarsTemplates } from "./templates.js"
import { createSwnMacro } from "./macro.js"

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

/** Init hook. */
Hooks.once("init", async function() {
  console.log("Loading into the year 3200...")
  
  /** Set various default settings below here */
  
  // Initiative, handled by core Foundry systems.
  CONFIG.Combat.initiative = {
    formula: "1d8",
    decimals: 0
  }

  game.swn = {
    createSwnMacro
  }

  // Define custom Entity classes
  CONFIG.Item.documentClass = SwnItem
  
  /* -------------------------------------------- */
  // Register sheet application classes
  
  // Actor sheets
  Actors.unregisterSheet("core", ActorSheet)
  Actors.registerSheet('swn', PlayerActorSheet, {
    label: 'Player Sheet',
    types: ['player'],
    makeDefault: true
  })
  
  Actors.registerSheet('swn', NpcActorSheet, {
    label: 'NPC Sheet',
    types: ['npc'],
    makeDefault: true
  })
  
  // Item sheets
  Items.unregisterSheet("core", ItemSheet)
  Items.registerSheet("swn", SwnItemSheet, { makeDefault: true })
  
  /* -------------------------------------------- */
  // Various settings are registered below here.
  
  // Initiative setting.
  game.settings.register("swn", "initFormula", {
    name: "SETTINGS.SWNInitFormula",
    hint: "SETTINGS.SWNInitFormulaL",
    scope: "world",
    type: String,
    default: "1d8",
    config: true,
    onChange: formula => _SwnUpdateInit(formula, true)
  })
  
  // Luck saves toggle
  game.settings.register("swn", "luckSavesEnabled", {
    name: "SETTINGS.SWNLuckSaves",
    hint: "SETTINGS.SWNLuckSavesL",
    scope: "world",
    type: Boolean,
    default: true,
    config: true
  })
  
  // Tech saves toggle
  game.settings.register("swn", "techSavesEnabled", {
    name: "SETTINGS.SWNTechSaves",
    hint: "SETTINGS.SWNTechSavesL",
    scope: "world",
    type: Boolean,
    default: false,
    config: true
  })
  
  // SWN 1e saving throw toggle
  game.settings.register("swn", "use1eSavingThrows", {
    name: "SETTINGS.SWNUse1eSaves",
    hint: "SETTINGS.SWNUse1eSavesL",
    scope: "world",
    type: Boolean,
    default: false,
    config: true
  })
  
  /* -------------------------------------------- */
  // Various functions that assist with updating settings.
  
  // Retrieve and assign the initiative formula setting.
  const initFormula = game.settings.get("swn", "initFormula")
  _SwnUpdateInit(initFormula)

  // Update the initiative formula.
  function _SwnUpdateInit(formula, notify = false) {
    const isValid = Roll.validate(formula)
    if ( !isValid ) {
      if ( notify ) ui.notifications.error(`${game.i18n.localize("Swn.NotifyInitFormulaInvalid")}: ${formula}`)
      return
    }
    CONFIG.Combat.initiative.formula = formula
  }

  // Preload template partials
  await preloadHandlebarsTemplates()
  
  // If everything's gone well, SWN has started up from here!
  console.log("Stars Without Number system initialised.")
})

// Macrobar hook.
Hooks.on("hotbarDrop", (bar, data, slot) => createSwnMacro(data, slot))
