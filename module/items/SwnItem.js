/** @extends {Item} */
// Extend the base Item document
export class SwnItem extends ItemSheet {
  /* -------------------------------------------- */
  // Fill in the data when needed.
  /** @inheritdoc */
  getData() {
    const context = super.getData();
    context.itemData = context.data.data;
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
