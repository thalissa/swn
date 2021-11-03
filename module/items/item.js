import {EntitySheetHelper} from "../helper.js"

/** @extends {Item} */
// Extend the base Item document
export class SwnItem extends Item {
  /** @inheritdoc */
  // Inherit basic data and slap it together as needed.
  prepareDerivedData() {
    super.prepareDerivedData()
  }
  
  /** @override */
  // Override the default createDialogue call
  static async createDialog(data={}, options={}) {
    return EntitySheetHelper.createDialog.call(this, data, options);
  }
}
