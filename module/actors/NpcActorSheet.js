import { EntitySheetHelper } from "../helper.js"
import {ATTRIBUTE_TYPES} from "../constants.js"

/**
 * Extend the basic ActorSheet with some very minor modifications
 * @extends {ActorSheet}
 */
export class NpcActorSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["swn", "sheet", "actor"],
      template: "systems/swn/templates/npc-actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
      scrollY: [".biography", ".items", ".attributes"],
      dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
    })
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData()
    context.systemData = context.data.data
    context.dtypes = ATTRIBUTE_TYPES
    return context
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html)

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return
    
    // Saving throws
    html.find(".saves-list .save").click(this._onSaveRoll.bind(this))
  }

  /* -------------------------------------------- */

  /**
   * Handle click events for Item control buttons within the Actor Sheet
   * @param event
   * @private
   */
  _onItemControl(event) {
    event.preventDefault()

    // Obtain event data
    const button = event.currentTarget
    const li = button.closest(".item")
    const item = this.actor.items.get(li?.dataset.itemId)

    // Handle different actions
    switch ( button.dataset.action ) {
      case "create":
        const cls = getDocumentClass("Item")
        return cls.create({name: game.i18n.localize("SWN.ItemNew"), type: "item"}, {parent: this.actor})
      case "edit":
        return item.sheet.render(true)
      case "delete":
        return item.delete()
    }
  }

  /* -------------------------------------------- */

  /**
   * Listen for saving throw rolls.
   * @param {MouseEvent} event    The originating left click event
   */
  _onSaveRoll(event) {
    let saveType = event.target.id
    
    if(saveType){
      let r = new Roll("1d20", this.actor.getRollData())
      return r.toMessage({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: `<h2>` + game.i18n.localize(`SWN.Save.${saveType}`) + `</h2><h3>h3</h3>`
      })
    }
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData)
    return formData
  }
}
