import { EntitySheetHelper } from "./helper.js"
import {ATTRIBUTE_TYPES} from "./constants.js"

/** @extends {ItemSheet} */
// Extend the basic ItemSheet with some very simple modifications
export class SwnItemSheet extends ItemSheet {
  /** @inheritdoc */
  // Inherit the defaults and modify where necessary.
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["swn", "sheet", "item"],
      template: "systems/swn/templates/item-sheet.hbs",
      width: 520,
      height: 480,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "description"
      }]
    })
  }

  /* -------------------------------------------- */
  // Fill in the data when needed.
  /** @inheritdoc */
  getData() {
    const context = super.getData();
    context.itemData = context.data.data;
    context.dtypes = ATTRIBUTE_TYPES;
    return context;
  }


  /* -------------------------------------------- */
  // Various listener functions for the itemsheet.
  /** @inheritdoc */
	activateListeners(html) {
    super.activateListeners(html)

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return
  }

  /* -------------------------------------------- */

  /** @override */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    return formData;
  }
}
