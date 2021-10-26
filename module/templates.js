/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

  // Define template paths to load
  const templatePaths = [
    // Attribute list partial.
    "systems/swn/templates/parts/sheet-attributes.hbs",
    "systems/swn/templates/parts/player-bio.hbs",
    "systems/swn/templates/parts/player-notes.hbs",
    "systems/swn/templates/parts/player-equipment.hbs",
    "systems/swn/templates/parts/player-skills.hbs",
    "systems/swn/templates/parts/player-foci.hbs",
    "systems/swn/templates/parts/player-psionics.hbs",
    "systems/swn/templates/parts/player-settings.hbs"
  ]

  // Load the template parts
  return loadTemplates(templatePaths)
}
