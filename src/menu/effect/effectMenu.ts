import {
  AbilityEffect,
  CharacterTraitEffect,
  Effect,
  FeatEffect,
  InitiativeAbilityModBonusEffect,
  InitiativeBonusEffect,
  ItemProficiencyEffect,
  JackOfAllTradesEffect,
  LanguageEffect,
  SavingThrowProficiencyEffect,
  SkillProficiencyEffect,
  SpeedEffect,
  SpellEffect,
} from "../../models/effects";
import { displayEffectsMenu } from "./effectsMenu";
import { menu, option } from "../menu";
import path from "path";
import * as readline from "readline";
import { gray, red } from "chalk";
import { displayAbilitySelectionMenu } from "../ability/abilitySelectionMenu";
import { displayPrerequisitesMenu } from "../prerequisite/prerequisitesMenu";
import * as fs from "fs";
import { CharacterTrait } from "../../models/traits";
import { getFeatById, getFeatByName } from "../../models/feats";
import { displaySkillSelectionMenu } from "../skill/skillSelectionMenu";
import { getSpellById, getSpellByName } from "../../models/spells";

export function displayEffectMenu(effect: Effect, rl: readline.Interface) {
  if (AbilityEffect.prototype.isPrototypeOf(effect)) {
    displayAbilityEffectMenu(effect as AbilityEffect, rl);
  } else if (CharacterTraitEffect.prototype.isPrototypeOf(effect)) {
    displayCharacterTraitEffectMenu(effect as CharacterTraitEffect, rl);
  } else if (FeatEffect.prototype.isPrototypeOf(effect)) {
    displayFeatEffectMenu(effect as FeatEffect, rl);
  } else if (InitiativeAbilityModBonusEffect.prototype.isPrototypeOf(effect)) {
    displayInitiativeAbilityModBonusEffectMenu(
      effect as InitiativeAbilityModBonusEffect,
      rl,
    );
  } else if (InitiativeBonusEffect.prototype.isPrototypeOf(effect)) {
    displayInitiativeBonusEffectMenu(effect as InitiativeBonusEffect, rl);
  } else if (ItemProficiencyEffect.prototype.isPrototypeOf(effect)) {
    displayItemProficiencyEffectMenu(effect as ItemProficiencyEffect, rl);
  } else if (JackOfAllTradesEffect.prototype.isPrototypeOf(effect)) {
    displayJackOfAllTradesEffectMenu(effect as JackOfAllTradesEffect, rl);
  } else if (LanguageEffect.prototype.isPrototypeOf(effect)) {
    displayLanguageEffectMenu(effect as LanguageEffect, rl);
  } else if (SavingThrowProficiencyEffect.prototype.isPrototypeOf(effect)) {
    displaySavingThrowProficiencyEffectMenu(
      effect as SavingThrowProficiencyEffect,
      rl,
    );
  } else if (SkillProficiencyEffect.prototype.isPrototypeOf(effect)) {
    displaySkillProficiencyEffectMenu(effect as SkillProficiencyEffect, rl);
  } else if (SpeedEffect.prototype.isPrototypeOf(effect)) {
    displaySpeedEffectMenu(effect as SpeedEffect, rl);
  } else if (SpellEffect.prototype.isPrototypeOf(effect)) {
    displaySpellEffectMenu(effect as SpellEffect, rl);
  }
}

function displayAbilityEffectMenu(
  effect: AbilityEffect,
  rl: readline.Interface,
) {
  menu(
    path.basename(effect.file),
    option("Abilities", () => {
      displayAbilityEffectAbilitiesMenu(effect, rl);
    }),
    option("Prerequisites", () => {
      displayPrerequisitesMenu(
        "Back to effect menu",
        () => {
          displayEffectMenu(effect, rl);
        },
        (prerequisites) => {
          effect.prerequisites = prerequisites;
          effect.save();
          displayAbilityEffectMenu(effect, rl);
        },
        rl,
        effect.prerequisites,
      );
    }),
    option(red("Delete"), () => {
      fs.rmSync(effect.file);
    }),
    option("Back to effects menu", () => {
      displayEffectsMenu(rl);
    }),
  ).display(rl);
}

function displayAbilityEffectAbilitiesMenu(
  effect: AbilityEffect,
  rl: readline.Interface,
) {
  menu(
    "Abilities",
    option("Set ability score", () => {
      displayAbilitySelectionMenu(
        "Back to ability effect abilities menu",
        () => {
          displayAbilityEffectAbilitiesMenu(effect, rl);
        },
        (ability) => {
          rl.question("New ability score: ", (score) => {
            const scoreInt = parseInt(score);
            if (isNaN(scoreInt)) {
              console.log(red("Ability score must be an integer."));
              displayAbilityEffectAbilitiesMenu(effect, rl);
              return;
            }
            if (scoreInt > 0) {
              effect.abilities[ability.name] = scoreInt;
            } else {
              delete effect.abilities[ability.name];
            }
            effect.save();
            displayAbilityEffectAbilitiesMenu(effect, rl);
          });
        },
        rl,
      );
    }),
    option("Back to effect menu", () => {
      displayEffectMenu(effect, rl);
    }),
  ).display(rl);
}

function displayCharacterTraitEffectMenu(
  effect: CharacterTraitEffect,
  rl: readline.Interface,
) {
  menu(
    path.basename(effect.file),
    option("Character traits", () => {
      displayCharacterTraitEffectCharacterTraitsMenu(effect, rl);
    }),
    option("Prerequisites", () => {
      displayPrerequisitesMenu(
        "Back to effect menu",
        () => {
          displayCharacterTraitEffectMenu(effect, rl);
        },
        (prerequisites) => {
          effect.prerequisites = prerequisites;
          effect.save();
          displayCharacterTraitEffectMenu(effect, rl);
        },
        rl,
        effect.prerequisites,
      );
    }),
    option(red("Delete"), () => {
      fs.rmSync(effect.file);
    }),
    option("Back to effects menu", () => {
      displayEffectsMenu(rl);
    }),
  ).display(rl);
}

function displayCharacterTraitEffectCharacterTraitsMenu(
  effect: CharacterTraitEffect,
  rl: readline.Interface,
) {
  menu(
    "Character traits",
    option("Add character trait", () => {
      rl.question("Name: ", (name) => {
        rl.question("Description: ", (description) => {
          effect.traits.push(new CharacterTrait(name, description));
          effect.save();
          displayCharacterTraitEffectCharacterTraitsMenu(effect, rl);
        });
      });
    }),
    option("Remove character trait", () => {
      menu(
        "Remove character trait",
        ...effect.traits.map((trait) =>
          option(trait.name, () => {
            effect.traits = effect.traits.filter((t) => t !== trait);
            effect.save();
            displayCharacterTraitEffectCharacterTraitsMenu(effect, rl);
          }),
        ),
        option("Back to character traits menu", () => {
          displayCharacterTraitEffectCharacterTraitsMenu(effect, rl);
        }),
      ).display(rl);
    }),
    option("Back to effect menu", () => {
      displayEffectMenu(effect, rl);
    }),
  ).display(rl);
}

function displayFeatEffectMenu(effect: FeatEffect, rl: readline.Interface) {
  menu(
    path.basename(effect.file),
    option("Feats", () => {
      displayFeatEffectFeatsMenu(effect, rl);
    }),
    option("Prerequisites", () => {
      displayPrerequisitesMenu(
        "Back to effect menu",
        () => {
          displayFeatEffectMenu(effect, rl);
        },
        (prerequisites) => {
          effect.prerequisites = prerequisites;
          effect.save();
          displayFeatEffectMenu(effect, rl);
        },
        rl,
        effect.prerequisites,
      );
    }),
    option(red("Delete"), () => {
      fs.rmSync(effect.file);
    }),
    option("Back to effects menu", () => {
      displayEffectsMenu(rl);
    }),
  ).display(rl);
}

function displayFeatEffectFeatsMenu(
  effect: FeatEffect,
  rl: readline.Interface,
) {
  menu(
    "Feats",
    option("Add feat", () => {
      rl.question("Feat name: ", (featName) => {
        const feat = getFeatByName(featName);
        if (!feat) {
          console.log(red("Feat not found."));
          displayFeatEffectFeatsMenu(effect, rl);
          return;
        }
        effect.feats.push(featName);
        effect.save();
        displayFeatEffectFeatsMenu(effect, rl);
      });
    }),
    option("Remove feat", () => {
      menu(
        "Remove feat",
        ...effect.feats.map((featId) => {
          const feat = getFeatById(featId);
          if (!feat) {
            return option("Unknown", () => {
              effect.feats = effect.feats.filter(
                (otherFeatId) => otherFeatId !== featId,
              );
              effect.save();
              displayFeatEffectFeatsMenu(effect, rl);
            });
          }
          return option(feat.name, () => {
            effect.feats = effect.feats.filter(
              (otherFeatId) => otherFeatId !== feat.id,
            );
            effect.save();
            displayFeatEffectFeatsMenu(effect, rl);
          });
        }),
        option("Back to feats menu", () => {
          displayFeatEffectFeatsMenu(effect, rl);
        }),
      ).display(rl);
    }),
    option("Back to effect menu", () => {
      displayEffectMenu(effect, rl);
    }),
  );
}

function displayInitiativeAbilityModBonusEffectMenu(
  effect: InitiativeAbilityModBonusEffect,
  rl: readline.Interface,
) {
  menu(
    path.basename(effect.file),
    option("Ability", () => {
      displayAbilitySelectionMenu(
        "Back to initiative ability modifier bonus effect menu",
        () => {
          displayInitiativeAbilityModBonusEffectMenu(effect, rl);
        },
        (ability) => {
          effect.ability = ability;
          effect.save();
          displayInitiativeAbilityModBonusEffectMenu(effect, rl);
        },
        rl,
      );
    }),
    option("Prerequisites", () => {
      displayPrerequisitesMenu(
        "Back to effect menu",
        () => {
          displayInitiativeAbilityModBonusEffectMenu(effect, rl);
        },
        (prerequisites) => {
          effect.prerequisites = prerequisites;
          effect.save();
          displayInitiativeAbilityModBonusEffectMenu(effect, rl);
        },
        rl,
        effect.prerequisites,
      );
    }),
    option(red("Delete"), () => {
      fs.rmSync(effect.file);
    }),
    option("Back to effects menu", () => {
      displayEffectsMenu(rl);
    }),
  ).display(rl);
}

function displayInitiativeBonusEffectMenu(
  effect: InitiativeBonusEffect,
  rl: readline.Interface,
) {
  menu(
    path.basename(effect.file),
    option("Bonus", () => {
      rl.question("Bonus: ", (bonus) => {
        const bonusInt = parseInt(bonus);
        if (isNaN(bonusInt)) {
          console.log(red("Bonus must be an integer."));
          displayInitiativeBonusEffectMenu(effect, rl);
          return;
        }
        effect.bonus = bonusInt;
        effect.save();
        displayInitiativeBonusEffectMenu(effect, rl);
      });
    }),
    option("Prerequisites", () => {
      displayPrerequisitesMenu(
        "Back to effect menu",
        () => {
          displayInitiativeBonusEffectMenu(effect, rl);
        },
        (prerequisites) => {
          effect.prerequisites = prerequisites;
          effect.save();
          displayInitiativeBonusEffectMenu(effect, rl);
        },
        rl,
        effect.prerequisites,
      );
    }),
    option(red("Delete"), () => {
      fs.rmSync(effect.file);
    }),
    option("Back to effects menu", () => {
      displayEffectsMenu(rl);
    }),
  ).display(rl);
}

function displayItemProficiencyEffectMenu(
  effect: ItemProficiencyEffect,
  rl: readline.Interface,
) {
  menu(
    path.basename(effect.file),
    option("Items", () => {
      displayItemProficiencyEffectItemsMenu(effect, rl);
    }),
    option("Prerequisites", () => {
      displayPrerequisitesMenu(
        "Back to effect menu",
        () => {
          displayItemProficiencyEffectMenu(effect, rl);
        },
        (prerequisites) => {
          effect.prerequisites = prerequisites;
          effect.save();
          displayItemProficiencyEffectMenu(effect, rl);
        },
        rl,
        effect.prerequisites,
      );
    }),
    option(red("Delete"), () => {
      fs.rmSync(effect.file);
    }),
    option("Back to effects menu", () => {
      displayEffectsMenu(rl);
    }),
  ).display(rl);
}

function displayItemProficiencyEffectItemsMenu(
  effect: ItemProficiencyEffect,
  rl: readline.Interface,
) {
  menu(
    "Items",
    option("Add item", () => {
      rl.question("Item name: ", (itemName) => {
        effect.items.push(itemName);
        effect.save();
        displayItemProficiencyEffectItemsMenu(effect, rl);
      });
    }),
    option("Remove item", () => {
      menu(
        "Remove item",
        ...effect.items.map((itemId) =>
          option(itemId, () => {
            effect.items = effect.items.filter(
              (otherItem) => otherItem !== itemId,
            );
            effect.save();
            displayItemProficiencyEffectItemsMenu(effect, rl);
          }),
        ),
        option("Back to items menu", () => {
          displayItemProficiencyEffectItemsMenu(effect, rl);
        }),
      ).display(rl);
    }),
    option("Back to effect menu", () => {
      displayEffectMenu(effect, rl);
    }),
  ).display(rl);
}

function displayJackOfAllTradesEffectMenu(
  effect: JackOfAllTradesEffect,
  rl: readline.Interface,
) {
  menu(
    "Jack of all trades",
    option("Prerequisites", () => {
      displayPrerequisitesMenu(
        "Back to effect menu",
        () => {
          displayJackOfAllTradesEffectMenu(effect, rl);
        },
        (prerequisites) => {
          effect.prerequisites = prerequisites;
          effect.save();
          displayJackOfAllTradesEffectMenu(effect, rl);
        },
        rl,
        effect.prerequisites,
      );
    }),
    option(red("Delete"), () => {
      fs.rmSync(effect.file);
    }),
    option("Back to effects menu", () => {
      displayEffectsMenu(rl);
    }),
  ).display(rl);
}

function displayLanguageEffectMenu(
  effect: LanguageEffect,
  rl: readline.Interface,
) {
  menu(
    path.basename(effect.file),
    option("Languages", () => {
      displayLanguageEffectLanguagesMenu(effect, rl);
    }),
    option("Prerequisites", () => {
      displayPrerequisitesMenu(
        "Back to effect menu",
        () => {
          displayLanguageEffectMenu(effect, rl);
        },
        (prerequisites) => {
          effect.prerequisites = prerequisites;
          effect.save();
          displayLanguageEffectMenu(effect, rl);
        },
        rl,
        effect.prerequisites,
      );
    }),
    option(red("Delete"), () => {
      fs.rmSync(effect.file);
    }),
    option("Back to effects menu", () => {
      displayEffectsMenu(rl);
    }),
  ).display(rl);
}

function displayLanguageEffectLanguagesMenu(
  effect: LanguageEffect,
  rl: readline.Interface,
) {
  menu(
    "Languages",
    option("Add language", () => {
      rl.question("Language name: ", (language) => {
        effect.languages.push(language);
        effect.save();
        displayLanguageEffectLanguagesMenu(effect, rl);
      });
    }),
    option("Remove language", () => {
      menu(
        "Remove language",
        ...effect.languages.map((language) =>
          option(language, () => {
            effect.languages = effect.languages.filter(
              (otherLanguage) => otherLanguage !== language,
            );
            effect.save();
            displayLanguageEffectLanguagesMenu(effect, rl);
          }),
        ),
        option("Back to languages menu", () => {
          displayLanguageEffectLanguagesMenu(effect, rl);
        }),
      ).display(rl);
    }),
    option("Back to effect menu", () => {
      displayEffectMenu(effect, rl);
    }),
  ).display(rl);
}

function displaySavingThrowProficiencyEffectMenu(
  effect: SavingThrowProficiencyEffect,
  rl: readline.Interface,
) {
  menu(
    path.basename(effect.file),
    option("Abilities", () => {
      displaySavingThrowProficiencyEffectAbilitiesMenu(effect, rl);
    }),
    option("Prerequisites", () => {
      displayPrerequisitesMenu(
        "Back to effect menu",
        () => {
          displaySavingThrowProficiencyEffectMenu(effect, rl);
        },
        (prerequisites) => {
          effect.prerequisites = prerequisites;
          effect.save();
          displaySavingThrowProficiencyEffectMenu(effect, rl);
        },
        rl,
        effect.prerequisites,
      );
    }),
    option(red("Delete"), () => {
      fs.rmSync(effect.file);
    }),
    option("Back to effects menu", () => {
      displayEffectsMenu(rl);
    }),
  ).display(rl);
}

function displaySavingThrowProficiencyEffectAbilitiesMenu(
  effect: SavingThrowProficiencyEffect,
  rl: readline.Interface,
) {
  menu(
    "Abilities",
    option("Add ability", () => {
      displayAbilitySelectionMenu(
        "Back to saving throw proficiency effect abilities menu",
        () => {
          displaySavingThrowProficiencyEffectAbilitiesMenu(effect, rl);
        },
        (ability) => {
          effect.abilities.push(ability);
          effect.save();
          displaySavingThrowProficiencyEffectAbilitiesMenu(effect, rl);
        },
        rl,
      );
    }),
    option("Remove ability", () => {
      menu(
        "Remove ability",
        ...effect.abilities.map((ability) =>
          option(ability.displayName, () => {
            effect.abilities = effect.abilities.filter(
              (otherAbility) => otherAbility !== ability,
            );
            effect.save();
            displaySavingThrowProficiencyEffectAbilitiesMenu(effect, rl);
          }),
        ),
        option("Back to abilities menu", () => {
          displaySavingThrowProficiencyEffectAbilitiesMenu(effect, rl);
        }),
      ).display(rl);
    }),
    option("Back to effect menu", () => {
      displayEffectMenu(effect, rl);
    }),
  ).display(rl);
}

function displaySkillProficiencyEffectMenu(
  effect: SkillProficiencyEffect,
  rl: readline.Interface,
) {
  menu(
    path.basename(effect.file),
    option("Skills", () => {
      displaySkillProficiencyEffectSkillsMenu(effect, rl);
    }),
    option("Prerequisites", () => {
      displayPrerequisitesMenu(
        "Back to effect menu",
        () => {
          displaySkillProficiencyEffectMenu(effect, rl);
        },
        (prerequisites) => {
          effect.prerequisites = prerequisites;
          effect.save();
          displaySkillProficiencyEffectMenu(effect, rl);
        },
        rl,
        effect.prerequisites,
      );
    }),
    option(red("Delete"), () => {
      fs.rmSync(effect.file);
    }),
    option("Back to effects menu", () => {
      displayEffectsMenu(rl);
    }),
  ).display(rl);
}

function displaySkillProficiencyEffectSkillsMenu(
  effect: SkillProficiencyEffect,
  rl: readline.Interface,
) {
  menu(
    "Skills",
    option("Add skill", () => {
      displaySkillSelectionMenu(
        "Back to skill proficiency effect skills menu",
        () => {
          displaySkillProficiencyEffectSkillsMenu(effect, rl);
        },
        (skill) => {
          effect.skills.push(skill);
          effect.save();
          displaySkillProficiencyEffectSkillsMenu(effect, rl);
        },
        rl,
      );
    }),
    option("Remove skill", () => {
      menu(
        "Remove skill",
        ...effect.skills.map((skill) =>
          option(skill.displayName, () => {
            effect.skills = effect.skills.filter(
              (otherSkill) => otherSkill !== skill,
            );
            effect.save();
            displaySkillProficiencyEffectSkillsMenu(effect, rl);
          }),
        ),
        option("Back to skills menu", () => {
          displaySkillProficiencyEffectSkillsMenu(effect, rl);
        }),
      ).display(rl);
    }),
    option("Back to effect menu", () => {
      displayEffectMenu(effect, rl);
    }),
  ).display(rl);
}

function displaySpeedEffectMenu(effect: SpeedEffect, rl: readline.Interface) {
  menu(
    path.basename(effect.file),
    option("Speed " + gray(effect.speed), () => {
      rl.question("Speed: ", (speed) => {
        const speedInt = parseInt(speed);
        if (isNaN(speedInt)) {
          console.log(red("Speed must be an integer."));
          displaySpeedEffectMenu(effect, rl);
          return;
        }
        effect.speed = speedInt;
        effect.save();
        displaySpeedEffectMenu(effect, rl);
      });
    }),
    option("Prerequisites", () => {
      displayPrerequisitesMenu(
        "Back to effect menu",
        () => {
          displaySpeedEffectMenu(effect, rl);
        },
        (prerequisites) => {
          effect.prerequisites = prerequisites;
          effect.save();
          displaySpeedEffectMenu(effect, rl);
        },
        rl,
        effect.prerequisites,
      );
    }),
    option(red("Delete"), () => {
      fs.rmSync(effect.file);
    }),
    option("Back to effects menu", () => {
      displayEffectsMenu(rl);
    }),
  ).display(rl);
}

function displaySpellEffectMenu(effect: SpellEffect, rl: readline.Interface) {
  menu(
    path.basename(effect.file),
    option("Spells", () => {
      displaySpellEffectSpellsMenu(effect, rl);
    }),
    option("Prerequisites", () => {
      displayPrerequisitesMenu(
        "Back to effect menu",
        () => {
          displaySpellEffectMenu(effect, rl);
        },
        (prerequisites) => {
          effect.prerequisites = prerequisites;
          effect.save();
          displaySpellEffectMenu(effect, rl);
        },
        rl,
        effect.prerequisites,
      );
    }),
    option(red("Delete"), () => {
      fs.rmSync(effect.file);
    }),
    option("Back to effects menu", () => {
      displayEffectsMenu(rl);
    }),
  ).display(rl);
}

function displaySpellEffectSpellsMenu(
  effect: SpellEffect,
  rl: readline.Interface,
) {
  menu(
    "Spells",
    option("Add spell", () => {
      rl.question("Spell name: ", (spellName) => {
        const spell = getSpellByName(spellName);
        if (!spell) {
          console.log(red("Spell not found."));
          displaySpellEffectSpellsMenu(effect, rl);
          return;
        }
        effect.spells.push(spellName);
        effect.save();
        displaySpellEffectSpellsMenu(effect, rl);
      });
    }),
    option("Remove spell", () => {
      menu(
        "Remove spell",
        ...effect.spells.map((spellId) => {
          const spell = getSpellById(spellId);
          if (!spell) {
            return option("Unknown", () => {
              effect.spells = effect.spells.filter(
                (otherSpellId) => otherSpellId !== spellId,
              );
              effect.save();
              displaySpellEffectSpellsMenu(effect, rl);
            });
          }
          return option(spell.name, () => {
            effect.spells = effect.spells.filter(
              (otherSpellId) => otherSpellId !== spell.id,
            );
            effect.save();
            displaySpellEffectSpellsMenu(effect, rl);
          });
        }),
        option("Back to spells menu", () => {
          displaySpellEffectSpellsMenu(effect, rl);
        }),
      ).display(rl);
    }),
    option("Back to effect menu", () => {
      displayEffectMenu(effect, rl);
    }),
  );
}
