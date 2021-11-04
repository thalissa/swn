// Define a set of template paths to pre-load
// Pre-loaded templates are compiled and cached for fast access when rendering
export const preloadHandlebarsTemplates = async function() {

  // Define template paths to load
  const templatePaths = [
    // Player partials
    "systems/swn/templates/player-parts/player-attributes.hbs",
    "systems/swn/templates/player-parts/player-bio.hbs",
    "systems/swn/templates/player-parts/player-notes.hbs",
    "systems/swn/templates/player-parts/player-equipment.hbs",
    "systems/swn/templates/player-parts/player-skills.hbs",
    "systems/swn/templates/player-parts/player-foci.hbs",
    "systems/swn/templates/player-parts/player-psionics.hbs",
    "systems/swn/templates/player-parts/player-settings.hbs",
    
    // NPC Partials
    "systems/swn/templates/npc-parts/npc-bio.hbs",
    "systems/swn/templates/npc-parts/npc-notes.hbs",
    "systems/swn/templates/npc-parts/npc-equipment.hbs",
    "systems/swn/templates/npc-parts/npc-skills.hbs",
    "systems/swn/templates/npc-parts/npc-foci.hbs",
    "systems/swn/templates/npc-parts/npc-psionics.hbs",
    "systems/swn/templates/npc-parts/npc-settings.hbs"
  ]

  // Load the template parts
  return loadTemplates(templatePaths)
}
