import("../helper.js")

/** @extends {Actor} */
// Extend the base Actor document to support attributes and
// various other functions necessary to make SWN work.
export class SwnActor extends ActorSheet {
  /* -------------------------------------------- */
  /* Basic extensions of the base sheet functions */
  
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
    // Item controls
    html.find(".item-control").click(this._onItemControl.bind(this))
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

  /* -------------------------------------------- */
  /* Various functions that handle buttons on the sheet. */
  _onItemControl(event) {
    event.preventDefault()

    // Obtain event data
    const button = event.currentTarget
    const li = button.closest(".item")
    const item = this.actor.items.get(li?.dataset.itemId)
    const cls = getDocumentClass("Item")

    // Handle different actions
    switch (button.dataset.action) {
      case "create-equipment":
        return cls.create({
          name: game.i18n.localize("SWN.ItemNew"),
          type: "equipment",
          img: "icons/svg/sword.svg"
          }, {
          parent: this.actor
        })
      case "create-focus":
        return cls.create({
          name: game.i18n.localize("SWN.FocusNew"),
          type: "focus",
          img: "icons/svg/frozen.svg"
          }, {
          parent: this.actor
        })
      case "create-psionic":
        return cls.create({
          name: game.i18n.localize("SWN.PsionicNew"),
          type: "psionic",
          img: "icons/svg/daze.svg"
          }, {
          parent: this.actor
        })
      case "chat":
        return renderTemplate('systems/swn/templates/chat-message.hbs', {
            name: item.data.name,
            img: item.data.img,
            description: item.data.data.description
          }).then(html => {
            ChatMessage.create({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            content: html
          })
        })
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

  /* -------------------------------------------- */
  /* Various functions that assist in logic handling. */
  
  // The second part of a skill roll, using data retrieved
  // from _onSkillRoll
  rollSkill(skillType, attributeType) {
    // Set the modifiers that we need.
    let skillMod = this.getSkillMod(skillType)
    // Non-player sheets won't have an attrbute type
    if(attributeType){
      var attributeMod = this.actor.data.data.attributes[attributeType].mod
    } else {
      var attributeMod = 0
    }
    
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
