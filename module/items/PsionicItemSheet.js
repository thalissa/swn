import { SwnItem } from "./SwnItem.js"

/** @extends {ItemSheet} */
// Extend the basic ItemSheet with some very simple modifications
export class PsionicItemSheet extends SwnItem {
  /** @inheritdoc */
  // Inherit the defaults and modify where necessary.
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["swn", "sheet", "psionic"],
      template: "systems/swn/templates/item-sheets/psionic-item-sheet.hbs",
      width: 520,
      height: 480,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "description"
      }]
    })
  }
}
