import { EntitySheetHelper } from "../helper.js"
import {ATTRIBUTE_TYPES} from "../constants.js"

/**
 * Extend the base Actor document to support attributes and groups with a custom template creation dialog.
 * @extends {Actor}
 */
export class SwnActor extends ActorSheet {
  /* -------------------------------------------- */
  
  getData() {
    this.computeModifiers()
    
    const data = super.getData()
            
    data.actorData = data.data.data
    data.dtypes = ATTRIBUTE_TYPES
    
    return data
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
  
  _valueFromTable(table, val){
    let output
    
    // Cycles through the table with the value provided
    for (let i = 0; i <= val; i++) {
      if (table[i] != undefined) {
        output = table[i]
      }
    }
    return output
  }

  computeModifiers(){
    // NPCs, ships, etcetera don't need modifiers calculated since the GM will just add them in manually
    if (this.actor.data.type != "player") {
      return;
    }
    
    // Data is data.
    const data = this.actor.data.data;
    
    // Attribute to modifier table
    const standard = {
      0: -2,
      3: -2,
      4: -1,
      8: 0,
      14: 1,
      18: 2,
    }
    
    // Get all the attributes and translate them into their modifiers
    data.attributes.str.mod = this._valueFromTable(standard, data.attributes.str.value)
    data.attributes.int.mod = this._valueFromTable(standard, data.attributes.int.value)
    data.attributes.dex.mod = this._valueFromTable(standard, data.attributes.dex.value)
    data.attributes.cha.mod = this._valueFromTable(standard, data.attributes.cha.value)
    data.attributes.wis.mod = this._valueFromTable(standard, data.attributes.wis.value)
    data.attributes.con.mod = this._valueFromTable(standard, data.attributes.con.value)
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
  
  // This whole function is a sloppy way to quickly get saving throw modifiers;
  // Going through each of the saves, it compares the relevant attribute scores
  // and uses that
  getSaveMod(saveType, callback) {
    let level = this.actor.data.data.level
    let baseSave = 16
    
    if(saveType){
      if(game.settings.get("swn", "use1eSavingThrows")){
        // SWN 1e saving throw method
        const saves = this.actor.data.data.saves
        
        // This is a lot simpler; it just retrieves the class's saving throw number
        // to compare the diceroll to.
        switch (saveType){
          case "physical":
            return saves.physical
          case "evasion":
            return saves.evasion
          case "mental":
            return saves.mental
          case "luck":
            return saves.luck
          case "tech":
            return saves.tech
          // Since by default all saves are 16 unless the class modifies it, this is
          // good for "if all else fails..." such as if the setting somehow gets set to null
          default:
            return baseSave
        }
      } else {
        const attributes = this.actor.data.data.attributes
        
        switch (saveType){
          // Physical saving throws use the better of strength or constitution
          case "physical":
            return 16 - level - Math.max(attributes.str.mod, attributes.con.mod)
          // Evasion saving throws use the better of dexterity or intelligence
          case "evasion":
            return 16 - level - Math.max(attributes.dex.mod, attributes.int.mod)
          // Mental saving throws use the better of wisdom or charisma
          case "mental":
            return 16 - level - Math.max(attributes.wis.mod, attributes.cha.mod)
          // Luck and tech saves, or any error rolls.
          default:
            return 16 - level
        }
      }
    }
  }

  /**
   * Listen for saving throw rolls.
   * @param {MouseEvent} event    The originating event
   */
  _onSaveRoll(event) {
    const saveType = event.target.id
    
    // Roll a 1d20, since saving throws will always be a flat 1d20 verses the saving throw
    let r = new Roll("1d20", this.actor.getRollData())
    
    // Generate a new message using the roll and use a function to retrieve the saving throw.
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<h2>` + game.i18n.localize(`SWN.Save.${saveType}L`) + `</h2>` +
      `<h3>Must meet or beat a ` + this.getSaveMod(saveType) + ` to succeed.</h3>`
    })
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _getSubmitData(updateData) {    
    let formData = super._getSubmitData(updateData)
    return formData
  }
}
