import { EntitySheetHelper } from "../helper.js"
import { ATTRIBUTE_TYPES } from "../constants.js"

/** @extends {Actor} */
// Extend the base Actor document to support attributes and
// various other functions necessary to make SWN work.
export class SwnActor extends ActorSheet {
  /* -------------------------------------------- */
  /* Basic extensions of the base sheet functions */
  
  /** @inheritdoc */
  getData() {
    this.computeModifiers()
    
    const data = super.getData()
            
    data.actorData = data.data.data
    data.dtypes = ATTRIBUTE_TYPES
    
    return data
  }
  
  /** @inheritdoc */
  // Inherit _getSubmitData to handle sheet data.
  _getSubmitData(updateData) {    
    let formData = super._getSubmitData(updateData)
    return formData
  }

  /** @inheritdoc */
  // Listener functions for when the sheet is opened.
  activateListeners(html) {
    super.activateListeners(html)

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return
    
    // Saving throws
    html.find(".saves-list .save").click(this._onSaveRoll.bind(this))
    // Skill checks
    html.find(".skillList .skill span").click(this._onSkillRoll.bind(this))
  }

  
  /* -------------------------------------------- */
  /* Below are various utility functions used in the sheet. */
  
  // Really simple function I keep re-using to add a plus
  // sign if the number needs it, or keep a minus sign if it doesn't.
  rollFriendlyModifiers(number, positiveZeros){
    // If this value is true, then add a plus sign to 0s too.
    if(positiveZeros){
      return (number<0 ? "":"+") + number
    } else {
      return (number<=0 ? "":"+") + number
    }
  }
  
  // Function to retrieve a value when comparing one to another.
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

  // Run through and generate modifiers when needed.
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
  /* Various functions that handle buttons on the sheet. */
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
  
  // Function called when a saving throw is rolled.
  // Most of the functionality is just rolling it and getting
  // the necessary save--see the getSaveMod function for more.
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
  
  // Function called when a skill is rolled.
  // It will create a dilogue to choose an attrribute,
  // and then pass that on to a function to handle the
  // rest of the skill roll.
  _onSkillRoll(event) {
    // The type of skill needing rolled.
    const skillType = event.target.id
    
    // Go through the attributes and turn them into a list of options
    let attributes = ''
    for (const [key, value] of Object.entries(this.actor.data.data.attributes)) {
      attributes = attributes.concat(`<option value="${key}">${game.i18n.localize(`SWN.Attributes.${key}L`)}</option>`)
    }
    
    // Generate a new dialogue to select an attribute
    let d = new Dialog({
     title: `Choose Attribute For Your ${game.i18n.localize(`SWN.Skills.${skillType}`)} Check`,
     content: `
      <form>
        <div class="form-group">
          <label>${game.i18n.localize(`SWN.attribute`)}</label>
          <select id="attributeSelect">${attributes}</select>
        </div>
      </form>`,
     buttons: {
       select: {
         icon: '<i class="fas fa-check"></i>',
         label: game.i18n.localize(`SWN.select`),
         callback: async (html) => {
           const attributeType = html.find('#attributeSelect')[0].value
           
           // Push to the next function in rolling a skill.
           this.rollSkill(skillType, attributeType)
         }
       },
       cancel: {
         icon: '<i class="fas fa-times"></i>',
         label: game.i18n.localize(`SWN.cancel`)
       }
     },
     default: "select"
    })
    d.render(true)
  }

  /* -------------------------------------------- */
  /* Various functions that assist in logic handling. */
  
  // This whole function is a sloppy way to quickly get saving throw modifiers;
  // Going through each of the saves, it compares the relevant attribute scores
  // and uses that
  getSaveMod(saveType) {
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
  
  // Grab a skill modifier when needed
  getSkillMod(skillType) {
    // Define the skill list for the actor
    const skills = this.actor.data.data.skills
    const specialties = this.actor.data.data.specialties
    const baseSkill = -1
    
    if(skillType) {
      if(specialties.hasOwnProperty(skillType)){
        return specialties[skillType].value
      } else {
        return skills[skillType].value
      }
    }
    
    return baseSkill
  }
  
  // The second part of a skill roll, using data retrieved
  // from _onSkillRoll
  rollSkill(skillType, attributeType) {
    // Set the modifiers that we need.
    let skillMod = this.getSkillMod(skillType)
    let attributeMod = this.actor.data.data.attributes[attributeType].mod
    // Do math to combine all the modifiers together.
    let combinedModifiers = skillMod + attributeMod
    let flavourArray = []
    
    if(skillMod){
      flavourArray.push(this.rollFriendlyModifiers(skillMod) + ` from ` + game.i18n.localize(`SWN.Skills.${skillType}`))
    }
    
    if(attributeMod){
      flavourArray.push(this.rollFriendlyModifiers(attributeMod) + ` from ` + game.i18n.localize(`SWN.Attributes.${attributeType}L`))
    }
    
    // Skills use a 2d6 and add the modifiers.
    let r = new Roll("2d6" + this.rollFriendlyModifiers(combinedModifiers, true), this.actor.getRollData())
    
    // Generate a new message using the roll and use a function to retrieve the saving throw.
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<h2>` + game.i18n.localize(`SWN.Skills.${skillType}`) + ` Check</h2>` + flavourArray.join(", ")
    })
  }
}
