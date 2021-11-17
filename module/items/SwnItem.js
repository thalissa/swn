/** @extends {Item} */
// Extend the base Item document
export class SwnItem extends ItemSheet {
  /* -------------------------------------------- */
  // Fill in the data when needed.
  /** @inheritdoc */
  getData() {
    const data = super.getData();
    data.itemData = data.data.data;
    
    // Replace the default item image with a predefined image; otherwise it'll stay the safe
    if(data.itemData.img){
      data.data.img = data.itemData.img
    }
    
    return data;
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
