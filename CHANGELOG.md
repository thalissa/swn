#### 0.1.10 (Fix The Broken Things Update)
* Update 0.1.8 and 0.1.9 were accidentally merged at the same time, so if you're looking for separate commits between them, now you know why the one for 0.1.8 is missing!
* When rolling a skill, an attribute dialogue comes up that the player can select from.
* Rolls will now show the modifiers used in the flavourtext section. Plan to tweak how this is displayed later, but this is good for now.

#### 0.1.9 (Graphics Are Cool Update)
* Updated a bunch of styling on the sheet! Now using a [cool background from Hubble](https://hubblesite.org/contents/media/images/2020/58/4778-Image) that's in the [public domain](https://hubblesite.org/copyright)! In the future I'll add a "Credits" section inside Foundry for this and any future images I use as well.

#### 0.1.8 (Skills Update)
* Finally found a version of the skills page I liked.
* Settings page now has more settings, such as being able to disable individual skills!
* Psionic skills won't show up if the character doesn't have the psionic tab enabled.

#### 0.1.7 (More Stuff Update)
* Fixed how saving throws work to fit core SWN usage and added the option to use SWN 1e saving throw rules.
* Refined how the saving throw function compares two attributes.
* Removed showSaveModType from the settings because it wasn't necessary.
* Level and XP fields added.
* Tech saves added, since I remembered those are a thing in the original SWN.
* Added the appropriate Notes textfields. Now includes Notes to Remember / Allies / Enemies along with an "Other" field at the bottom.
* Skills buttons added, but not actually working yet. Still planning on how I want to do the Skills page.

#### 0.1.6 (I'm An Idiot Update)
* Fixed the template file preventing the game from being loaded because of a couple of typos.

#### 0.1.5 (Insert Character Here Update)
* Changed template files from .html to .hbs (mostly so that my text editor properly handles Handlebar styling)
* Chat cards for saving throw rolls now use "<Saving Throw> Save"
* Various styling additions.
* Modified the sheet tabs. Now includes Bio / Notes / Equipment [That includes weapons and defense rolls] / Skills / Foci / Psionics / Settings
* Added a bunch of character fields, since those are a little important. Bio mostly filled out, and the others I'll work on later.

#### 0.1.4 (How Do Ability Scores Work? Update)
* Attribute scores now auto-generate.
* Saving throws now add their proper modifiers when rolled.
* Added CHANGELOG.md to make sure the README doesn't get too filled up.
* Added a section for future contributors and a few links to my personal stuff.
* Also found out that setting "type='button'" on buttons fixes the "sheet rolling the first button it finds" in some browsers issue. Good to know.

#### 0.1.3 (Unified Sheets Update)
* Shoved all of the sheet functions into their own file so I can share them consistently between the player and NPC sheets.

#### 0.1.2 (Ability Scores & Saving Throws & Rolls Oh My! Update)
* Added the ability to change ability scores.
* Added saving throws (and the luck save toggles on and off)
* Rolling things is also now possible. Modifiers are a WIP so the saving throws don't add modifiers yet.
* Added a handlebar helper for concatenating things and a handlebar helper for retrieving game settings.

#### 0.1.1 (Quick Fix Update)
* Changed "Changeling" to "Changelog" on the README.
* Added the manifest link for the future.

For additional changelog notes, see CHANGELOG.md

#### 0.1.0 (Beginner System Developer Update)
* Very, very basics, modified from the publicly available [Simple Worldbuilding](https://gitlab.com/foundrynet/worldbuilding/) system for my own usage.
* There already exists a Stars Without Number, but in the name of diversity, learning and personal preference I've decided to make my own from scratch as a conscious decision rather than modify the existing one. While this means that mine will be incomplete for a while, I hope to one day ensure that everyone can run a Stars Without Number game however they like. Until then, if you'd like a more complete system, please check out [Stars Without Number: Revised](https://github.com/Spice-King/foundry-swnr/) system.
* There's a big to-do list. But first course of action is getting actor sheets working, and then getting them presentable. That's not included in this update, but the character sheets *exist* at the very least.
