import { SwnActor } from "./SwnActor.js"

/**
 * Extend the basic ActorSheet with some very minor modifications
 * @extends {ActorSheet}
 */
export class PlayerActorSheet extends SwnActor {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["swn", "sheet", "actor"],
      template: "systems/swn/templates/player-actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "description"
      }],
      scrollY: [
        ".biography",
        ".items",
        ".attributes"
      ],
      dragDrop: [{
          dragSelector: ".item-list .item",
          dropSelector: null
      }]
    })
  }
  
}
