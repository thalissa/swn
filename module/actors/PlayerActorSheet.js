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
  
  /* -------------------------------------------- */
  /* Basic extensions of the base sheet functions */
  
  /** @inheritdoc */
  getData() {
    this.computeModifiers()
    
    const data = super.getData()
            
    data.actorData = data.data.data
    
    data.actorData.equipment = []
    data.actorData.focus = []
    data.actorData.psionic = []
    
    // Sort the types of items for better readability
    if(data.data.items){
      for(let key in data.data.items){
        if(data.data.items[key].type === "equipment"){
          data.actorData.equipment.push(data.data.items[key])
        }
        
        if(data.data.items[key].type === "focus"){
          data.actorData.focus.push(data.data.items[key])
        }
        
        if(data.data.items[key].type === "psionic"){
          data.actorData.psionic.push(data.data.items[key])
        }
      }
    }
    
    return data
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
  
  /* -------------------------------------------- */
  /* Below are various utility functions used in the sheet. */

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
  
  // This whole function is a sloppy way to quickly get saving throw modifiers;
  // Going through each of the saves, it compares the relevant attribute scores
  // and uses that
  getSaveMod(saveType) {
    if(saveType){
      const baseSave = 16
      
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
          // good for "if all else fails..." such as if the variable somehow gets set to null
          default:
            return baseSave
        }
      } else {
        const attributes = this.actor.data.data.attributes
        let level = this.actor.data.data.level
        
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
}
