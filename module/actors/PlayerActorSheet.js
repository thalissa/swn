import { SwnActor } from "./SwnActor.js"

/** @extends {ActorSheet} */
// Extend the basic ActorSheet with some very minor modifications
export class PlayerActorSheet extends SwnActor {
  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["swn", "sheet", "actor"],
      template: "systems/swn/templates/actor-sheets/player-actor-sheet.hbs",
      width: 600,
      height: 600,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "bio"
      }],
      dragDrop: [{
        dragSelector: ".item-list .item",
        dropSelector: null
      }]
    })
  }
}
