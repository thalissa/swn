/**
 * Author: Atropos - From Simple Worldbuilding.
 * Modified by Thalissa for use in the Stars Without Number system
 */

// Import Modules
import { SwnItem } from "./item.js"
import { SwnItemSheet } from "./item-sheet.js"
import { PlayerActorSheet } from "./actors/PlayerActorSheet.js"
import { NpcActorSheet } from "./actors/NpcActorSheet.js"
import { preloadHandlebarsTemplates } from "./templates.js"
import { createSwnMacro } from "./macro.js"

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

/**
 * Init hook.
 */
Hooks.once("init", async function() {
  console.log(`Loading into the year 3200...`)

  /**
   * Set various default settings
   */
  // Initiative
  CONFIG.Combat.initiative = {
    formula: "1d8",
    decimals: 0
  }

  game.swn = {
    createSwnMacro
  }

  // Define custom Entity classes
  CONFIG.Item.documentClass = SwnItem

  // Register sheet application classes
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
  
  Items.unregisterSheet("core", ItemSheet)
  Items.registerSheet("swn", SwnItemSheet, { makeDefault: true })

  // Register initiative setting.
  game.settings.register("swn", "initFormula", {
    name: "SETTINGS.SWNInitFormulaN",
    hint: "SETTINGS.SWNInitFormulaL",
    scope: "world",
    type: String,
    default: "1d8",
    config: true,
    onChange: formula => _SwnUpdateInit(formula, true)
  })
  
  game.settings.register("swn", "luckDiceEnabled", {
    name: "SETTINGS.SWNLuckDiceN",
    hint: "SETTINGS.SWNLuckDiceL",
    scope: "world",
    type: Boolean,
    default: true,
    config: true
  })

  // Retrieve and assign the initiative formula setting.
  const initFormula = game.settings.get("swn", "initFormula")
  _SwnUpdateInit(initFormula)

  /**
   * Update the initiative formula.
   * @param {string} formula - Dice formula to evaluate.
   * @param {boolean} notify - Whether or not to post nofications.
   */
  function _SwnUpdateInit(formula, notify = false) {
    const isValid = Roll.validate(formula)
    if ( !isValid ) {
      if ( notify ) ui.notifications.error(`${game.i18n.localize("Swn.NotifyInitFormulaInvalid")}: ${formula}`)
      return
    }
    CONFIG.Combat.initiative.formula = formula
  }
  
  /**
   * Update the luck dice setting
   */

  /**
   * Slugify a string.
   */
  Handlebars.registerHelper('slugify', function(value) {
    return value.slugify({strict: true})
  })

  // Preload template partials
  await preloadHandlebarsTemplates()
})

/**
 * Macrobar hook.
 */
Hooks.on("hotbarDrop", (bar, data, slot) => createSwnMacro(data, slot))
