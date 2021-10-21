import { ATTRIBUTE_TYPES } from "./constants.js"

export class EntitySheetHelper {
  /**
   * @see ClientDocumentMixin.createDialog
   */
  static async createDialog(data={}, options={}) {

    // Collect data
    const documentName = this.metadata.name
    const folders = game.folders.filter(f => (f.data.type === documentName) && f.displayed)
    const label = game.i18n.localize(this.metadata.label)
    const title = game.i18n.format("ENTITY.Create", {entity: label})

    // Identify the template Actor types
    const collection = game.collections.get(this.documentName)
    const templates = collection.filter(a => a.getFlag("swn", "actor"))
    const defaultType = this.metadata.types[0]
    const types = {
      [defaultType]: game.i18n.localize("SWN.PlayerActorSheet")
    }
    console.log("Templates: " + templates)
    for ( let a of templates ) {
      if(a > 0){
        types[a.id] = a.name
      }
    }

    // Render the entity creation form
    const html = await renderTemplate(`templates/sidebar/entity-create.html`, {
      name: data.name || game.i18n.format("ENTITY.New", {entity: label}),
      folder: data.folder,
      folders: folders,
      hasFolders: folders.length > 1,
      type: data.type || "",
      types: types,
      hasTypes: true
    })

    // Render the confirmation dialog window
    return Dialog.prompt({
      title: title,
      content: html,
      label: title,
      callback: html => {

        // Get the form data
        const form = html[0].querySelector("form")
        const fd = new FormDataExtended(form)
        let createData = fd.toObject()

        // Merge with template data
        const template = collection.get(form.type.value)
        if ( template ) {
          createData = foundry.utils.mergeObject(template.toObject(), createData)
          createData.type = template.data.type
          delete createData.flags.swn.isTemplate
        }

        // Merge provided override data
        createData = foundry.utils.mergeObject(createData, data)
        return this.create(createData, {renderSheet: true})
      },
      rejectClose: false,
      options: options
    })
  }
}

// Concat helper for the sheets.
Handlebars.registerHelper("concat", function() {
  var outStr = ""
  for (var arg in arguments) {
    if (typeof arguments[arg] != "object") {
        outStr += arguments[arg]
    }
  }
  return outStr
})


Handlebars.registerHelper("getSetting", function(setting) {
    return game.settings.get("swn", setting);
});
