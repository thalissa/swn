import { SwnActor } from "./SwnActor.js"

/** @extends {ActorSheet} */
// Extend the basic ActorSheet with some very minor modifications
export class NpcActorSheet extends SwnActor {
  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["swn", "sheet", "npc"],
      template: "systems/swn/templates/actor-sheets/npc-actor-sheet.hbs",
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
  
  // Grab a skill modifier when needed
  getSkillMod(skillType) {
    // Define the skill list for the actor
    const skills = this.actor.data.data.skills
    const baseSkill = -1
    
    // Check if the skill type exists
    if(skillType) {
      return skills[skillType].value
    }
    
    // Default to -1, or untrained
    return baseSkill
  }
  
  // Re-use the SWN1e saving throw method from PlayerActorSheet.js to
  // roll for NPC sheets too, since the GM determines their save scores
  // rather than keying them off attributes.
  getSaveMod(saveType) {
    if(saveType){
      const baseSave = 16
      const saves = this.actor.data.data.saves
      
      // Simple way to grab the saving throw modifier from the attribute list.
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
    }
  }
  
  // Function called when a skill is rolled.
  // It will create a dilogue to choose an attrribute,
  // and then pass that on to a function to handle the
  // rest of the skill roll.
  _onSkillRoll(event) {
    // The type of skill needing rolled.
    const skillType = event.target.id
    
    // Push to the next function in rolling a skill.
    this.rollSkill(skillType)
  }
}
