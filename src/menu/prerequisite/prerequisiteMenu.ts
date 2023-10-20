import {
  AbilityPrerequisite,
  AncestryPrerequisite,
  AndPrerequisite,
  BackgroundPrerequisite,
  ChoicePrerequisite,
  ClassPrerequisite,
  FeatPrerequisite,
  ItemProficiencyPrerequisite,
  LanguagePrerequisite,
  LevelPrerequisite,
  NotPrerequisite,
  OrPrerequisite,
  Prerequisite,
  SavingThrowProficiencyPrerequisite,
  SkillProficiencyPrerequisite,
  SpellPrerequisite,
  SubAncestryPrerequisite,
  SubClassPrerequisite,
} from "../../models/prerequisites";
import * as readline from "readline";
import { menu, option } from "../menu";
import { gray, green, red } from "chalk";
import { displayAbilitySelectionMenu } from "../ability/abilitySelectionMenu";
import { displayAncestrySelectionMenu } from "../ancestry/ancestrySelectionMenu";
import { getAncestryById } from "../../models/ancestries";
import {
  displayNewPrerequisiteMenu,
  displayPrerequisitesMenu,
} from "./prerequisitesMenu";
import { displayBackgroundSelectionMenu } from "../background/backgroundSelectionMenu";
import { getBackgroundById } from "../../models/backgrounds";
import { getChoiceById } from "../../models/choices";
import { displayOptionSelectionMenu } from "../choice/optionSelectionMenu";
import { displayChoiceSelectionMenu } from "../choice/choiceSelectionMenu";
import { getClassById } from "../../models/classes";
import { displayClassSelectionMenu } from "../clazz/classSelectionMenu";
import { getFeatById, getFeatByName } from "../../models/feats";
import { getLanguageById, getLanguageByName } from "../../models/languages";
import { displaySkillSelectionMenu } from "../skill/skillSelectionMenu";
import { getSpellById, getSpellByName } from "../../models/spells";
import { displaySubAncestrySelectionMenu } from "../ancestry/subancestry/subAncestrySelectionMenu";
import { displaySubClassSelectionMenu } from "../clazz/subClassSelectionMenu";

export function displayPrerequisiteMenu(
  prerequisite: Prerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  if (AbilityPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayAbilityPrerequisiteMenu(
      prerequisite as AbilityPrerequisite,
      callback,
      del,
      rl,
    );
  } else if (AncestryPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayAncestryPrerequisiteMenu(
      prerequisite as AncestryPrerequisite,
      callback,
      del,
      rl,
    );
  } else if (AndPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayAndPrerequisiteMenu(
      prerequisite as AndPrerequisite,
      callback,
      del,
      rl,
    );
  } else if (BackgroundPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayBackgroundPrerequisiteMenu(
      prerequisite as BackgroundPrerequisite,
      callback,
      del,
      rl,
    );
  } else if (ChoicePrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayChoicePrerequisiteMenu(
      prerequisite as ChoicePrerequisite,
      callback,
      del,
      rl,
    );
  } else if (ClassPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayClassPrerequisiteMenu(
      prerequisite as ClassPrerequisite,
      callback,
      del,
      rl,
    );
  } else if (FeatPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayFeatPrerequisiteMenu(
      prerequisite as FeatPrerequisite,
      callback,
      del,
      rl,
    );
  } else if (
    ItemProficiencyPrerequisite.prototype.isPrototypeOf(prerequisite)
  ) {
    displayItemProficiencyPrerequisiteMenu(
      prerequisite as ItemProficiencyPrerequisite,
      callback,
      del,
      rl,
    );
  } else if (LanguagePrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayLanguagePrerequisiteMenu(
      prerequisite as LanguagePrerequisite,
      callback,
      del,
      rl,
    );
  } else if (LevelPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayLevelPrerequisiteMenu(
      prerequisite as LevelPrerequisite,
      callback,
      del,
      rl,
    );
  } else if (NotPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayNotPrerequisiteMenu(
      prerequisite as NotPrerequisite,
      callback,
      del,
      rl,
    );
  } else if (OrPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayOrPrerequisiteMenu(
      prerequisite as OrPrerequisite,
      callback,
      del,
      rl,
    );
  } else if (
    SavingThrowProficiencyPrerequisite.prototype.isPrototypeOf(prerequisite)
  ) {
    displaySavingThrowProficiencyPrerequisiteMenu(
      prerequisite as SavingThrowProficiencyPrerequisite,
      callback,
      del,
      rl,
    );
  } else if (
    SkillProficiencyPrerequisite.prototype.isPrototypeOf(prerequisite)
  ) {
    displaySkillProficiencyPrerequisiteMenu(
      prerequisite as SkillProficiencyPrerequisite,
      callback,
      del,
      rl,
    );
  } else if (SpellPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displaySpellPrerequisiteMenu(
      prerequisite as SpellPrerequisite,
      callback,
      del,
      rl,
    );
  } else if (SubAncestryPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displaySubAncestryPrerequisiteMenu(
      prerequisite as SubAncestryPrerequisite,
      callback,
      del,
      rl,
    );
  } else if (SubClassPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displaySubClassPrerequisiteMenu(
      prerequisite as SubClassPrerequisite,
      callback,
      del,
      rl,
    );
  }
}

function displayAbilityPrerequisiteMenu(
  prerequisite: AbilityPrerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  menu(
    "Ability prerequisite",
    option("Ability " + gray(`(${prerequisite.ability.displayName})`), () => {
      displayAbilitySelectionMenu(
        "Back to ability prerequisite",
        () => displayAbilityPrerequisiteMenu(prerequisite, callback, del, rl),
        (ability) => {
          prerequisite.ability = ability;
          displayAbilityPrerequisiteMenu(prerequisite, callback, del, rl);
        },
        rl,
      );
    }),
    option("Score " + gray(`(${prerequisite.score})`), () => {
      rl.question("Score: ", (score) => {
        let scoreInt = parseInt(score);
        if (!isNaN(scoreInt)) {
          prerequisite.score = scoreInt;
        } else {
          console.log(red("Score must be an integer."));
        }
        displayAbilityPrerequisiteMenu(prerequisite, callback, del, rl);
      });
    }),
    option(green("Save"), () => {
      callback(prerequisite);
    }),
    option(red("Delete"), () => {
      del(prerequisite);
    }),
  ).display(rl);
}

function displayAncestryPrerequisiteMenu(
  prerequisite: AncestryPrerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  menu(
    "Ancestry prerequisite",
    option(
      "Ancestry " +
        gray(
          `(${getAncestryById(prerequisite.ancestryId)?.name ?? "Unknown"})`,
        ),
      () => {
        displayAncestrySelectionMenu(
          "Back to ancestry prerequisite",
          () =>
            displayAncestryPrerequisiteMenu(prerequisite, callback, del, rl),
          (ancestry) => {
            prerequisite.ancestryId = ancestry.id;
            displayAncestryPrerequisiteMenu(prerequisite, callback, del, rl);
          },
          rl,
        );
      },
    ),
    option(green("Save"), () => {
      callback(prerequisite);
    }),
    option(red("Delete"), () => {
      del(prerequisite);
    }),
  ).display(rl);
}

function displayAndPrerequisiteMenu(
  prerequisite: AndPrerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  menu(
    "AND prerequisite",
    option(
      "Prerequisites " + gray(`(${prerequisite.prerequisites.length})`),
      () =>
        displayPrerequisitesMenu(
          "Back to AND prerequisite",
          () => displayAndPrerequisiteMenu(prerequisite, callback, del, rl),
          (prerequisites) => {
            prerequisite.prerequisites = prerequisites;
            displayAndPrerequisiteMenu(prerequisite, callback, del, rl);
          },
          rl,
        ),
    ),
    option(green("Save"), () => {
      callback(prerequisite);
    }),
    option(red("Delete"), () => {
      del(prerequisite);
    }),
  ).display(rl);
}

function displayBackgroundPrerequisiteMenu(
  prerequisite: BackgroundPrerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  menu(
    "Background prerequisite",
    option(
      "Background " +
        gray(
          `(${
            getBackgroundById(prerequisite.backgroundId)?.name ?? "Unknown"
          })`,
        ),
      () => {
        displayBackgroundSelectionMenu(
          "Back to background prerequisite",
          () =>
            displayBackgroundPrerequisiteMenu(prerequisite, callback, del, rl),
          (background) => {
            prerequisite.backgroundId = background.id;
            displayBackgroundPrerequisiteMenu(prerequisite, callback, del, rl);
          },
          rl,
        );
      },
    ),
    option(green("Save"), () => {
      callback(prerequisite);
    }),
    option(red("Delete"), () => {
      del(prerequisite);
    }),
  ).display(rl);
}

function displayChoicePrerequisiteMenu(
  prerequisite: ChoicePrerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  const choice = getChoiceById(prerequisite.choiceId);
  const opt = choice?.getOptionById(prerequisite.optionId);
  menu(
    "Choice prerequisite",
    option("Choice " + gray(`(${choice?.text ?? "Unknown"})`), () => {
      displayChoiceSelectionMenu(
        "Back to choice prerequisite",
        () => displayChoicePrerequisiteMenu(prerequisite, callback, del, rl),
        (choice) => {
          prerequisite.choiceId = choice.id;
          displayChoicePrerequisiteMenu(prerequisite, callback, del, rl);
        },
        rl,
      );
    }),
    option("Option " + gray(`(${opt?.text})`), () => {
      if (!choice) {
        console.log(red("Choice not found."));
        displayChoicePrerequisiteMenu(prerequisite, callback, del, rl);
        return;
      }
      displayOptionSelectionMenu(
        choice,
        "Back to choice prerequisite",
        () => displayChoicePrerequisiteMenu(prerequisite, callback, del, rl),
        (option) => {
          prerequisite.optionId = option.id;
          displayChoicePrerequisiteMenu(prerequisite, callback, del, rl);
        },
        rl,
      );
    }),
    option(green("Save"), () => {
      callback(prerequisite);
    }),
    option(red("Delete"), () => {
      del(prerequisite);
    }),
  ).display(rl);
}

function displayClassPrerequisiteMenu(
  prerequisite: ClassPrerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  const clazz = getClassById(prerequisite.classId);
  menu(
    "Class prerequisite",
    option("Class " + gray(`(${clazz?.name ?? "Unknown"})`), () => {
      displayClassSelectionMenu(
        "Back to class prerequisite",
        () => displayClassPrerequisiteMenu(prerequisite, callback, del, rl),
        (clazz) => {
          prerequisite.classId = clazz.id;
          displayClassPrerequisiteMenu(prerequisite, callback, del, rl);
        },
        rl,
      );
    }),
    option("Level " + gray(`(${prerequisite.level})`), () => {
      rl.question("Level: ", (level) => {
        let levelInt = parseInt(level);
        if (!isNaN(levelInt)) {
          prerequisite.level = levelInt;
        } else {
          console.log(red("Level must be an integer."));
        }
        displayClassPrerequisiteMenu(prerequisite, callback, del, rl);
      });
    }),
    option(green("Save"), () => {
      callback(prerequisite);
    }),
    option(red("Delete"), () => {
      del(prerequisite);
    }),
  ).display(rl);
}

function displayFeatPrerequisiteMenu(
  prerequisite: FeatPrerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  const feat = getFeatById(prerequisite.featId);
  menu(
    "Feat prerequisite",
    option("Feat " + gray(`(${feat?.name ?? "Unknown"})`), () => {
      rl.question("Feat: ", (featName) => {
        const feat = getFeatByName(featName);
        if (!feat) {
          console.log(red("Feat not found."));
          return;
        } else {
          prerequisite.featId = feat.id;
        }
        displayFeatPrerequisiteMenu(prerequisite, callback, del, rl);
      });
    }),
    option(green("Save"), () => {
      callback(prerequisite);
    }),
    option(red("Delete"), () => {
      del(prerequisite);
    }),
  ).display(rl);
}

function displayItemProficiencyPrerequisiteMenu(
  prerequisite: ItemProficiencyPrerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  menu(
    "Item proficiency prerequisite\n" + gray(prerequisite.itemIds.join(", ")),
    option("Add item", () => {
      rl.question("Item ID: ", (itemId) => {
        prerequisite.itemIds.push(itemId);
        displayItemProficiencyPrerequisiteMenu(prerequisite, callback, del, rl);
      });
    }),
    option("Remove item", () => {
      rl.question("Item ID: ", (itemId) => {
        prerequisite.itemIds = prerequisite.itemIds.filter(
          (id) => id !== itemId,
        );
        displayItemProficiencyPrerequisiteMenu(prerequisite, callback, del, rl);
      });
    }),
    option(green("Save"), () => {
      callback(prerequisite);
    }),
    option(red("Delete"), () => {
      del(prerequisite);
    }),
  ).display(rl);
}

function displayLanguagePrerequisiteMenu(
  prerequisite: LanguagePrerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  const languages = prerequisite.languageIds.map((languageId) =>
    getLanguageById(languageId),
  );
  menu(
    "Language prerequisite\n" +
      gray(languages.map((language) => language?.name ?? "Unknown").join(", ")),
    option("Add language", () => {
      rl.question("Language: ", (languageName) => {
        const language = getLanguageByName(languageName);
        if (!language) {
          console.log(red("Language not found."));
          displayLanguagePrerequisiteMenu(prerequisite, callback, del, rl);
          return;
        }
        prerequisite.languageIds.push(language.id);
        displayLanguagePrerequisiteMenu(prerequisite, callback, del, rl);
      });
    }),
    option("Remove language", () => {
      rl.question("Language: ", (languageName) => {
        const language = getLanguageByName(languageName);
        if (!language) {
          console.log(red("Language not found."));
          displayLanguagePrerequisiteMenu(prerequisite, callback, del, rl);
          return;
        }
        prerequisite.languageIds = prerequisite.languageIds.filter(
          (id) => id !== language.id,
        );
        displayLanguagePrerequisiteMenu(prerequisite, callback, del, rl);
      });
    }),
    option(green("Save"), () => {
      callback(prerequisite);
    }),
    option(red("Delete"), () => {
      del(prerequisite);
    }),
  ).display(rl);
}

function displayLevelPrerequisiteMenu(
  prerequisite: LevelPrerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  menu(
    "Level prerequisite",
    option("Level " + gray(`(${prerequisite.level})`), () => {
      rl.question("Level: ", (level) => {
        let levelInt = parseInt(level);
        if (!isNaN(levelInt)) {
          prerequisite.level = levelInt;
        } else {
          console.log(red("Level must be an integer."));
        }
        displayLevelPrerequisiteMenu(prerequisite, callback, del, rl);
      });
    }),
    option(green("Save"), () => {
      callback(prerequisite);
    }),
    option(red("Delete"), () => {
      del(prerequisite);
    }),
  ).display(rl);
}

function displayOrPrerequisiteMenu(
  prerequisite: OrPrerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  menu(
    "OR prerequisite",
    option(
      "Prerequisites " + gray(`(${prerequisite.prerequisites.length})`),
      () => {
        displayPrerequisitesMenu(
          "Back to OR prerequisite",
          () => displayOrPrerequisiteMenu(prerequisite, callback, del, rl),
          (prerequisites) => {
            prerequisite.prerequisites = prerequisites;
            displayOrPrerequisiteMenu(prerequisite, callback, del, rl);
          },
          rl,
          prerequisite.prerequisites,
        );
      },
    ),
    option(green("Save"), () => {
      callback(prerequisite);
    }),
    option(red("Delete"), () => {
      del(prerequisite);
    }),
  ).display(rl);
}

function displayNotPrerequisiteMenu(
  prerequisite: NotPrerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  menu(
    "NOT prerequisite",
    option(
      "Prerequisite " + gray(`(${prerequisite.prerequisite.getName()})`),
      () => {
        displayNewPrerequisiteMenu(
          "Back to NOT prerequisite",
          () => displayNotPrerequisiteMenu(prerequisite, callback, del, rl),
          (newPrerequisite) => {
            prerequisite.prerequisite = newPrerequisite;
            displayNotPrerequisiteMenu(prerequisite, callback, del, rl);
          },
          rl,
        );
      },
    ),
    option(green("Save"), () => {
      callback(prerequisite);
    }),
    option(red("Delete"), () => {
      del(prerequisite);
    }),
  ).display(rl);
}

function displaySavingThrowProficiencyPrerequisiteMenu(
  prerequisite: SavingThrowProficiencyPrerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  menu(
    "Saving throw proficiency prerequisite\n" +
      gray(
        prerequisite.abilities.map((ability) => ability.displayName).join(", "),
      ),
    option("Add ability", () => {
      displayAbilitySelectionMenu(
        "Back to saving throw proficiency prerequisite",
        () =>
          displaySavingThrowProficiencyPrerequisiteMenu(
            prerequisite,
            callback,
            del,
            rl,
          ),
        (ability) => {
          prerequisite.abilities.push(ability);
          displaySavingThrowProficiencyPrerequisiteMenu(
            prerequisite,
            callback,
            del,
            rl,
          );
        },
        rl,
      );
    }),
    option("Remove ability", () => {
      displayAbilitySelectionMenu(
        "Back to saving throw proficiency prerequisite",
        () =>
          displaySavingThrowProficiencyPrerequisiteMenu(
            prerequisite,
            callback,
            del,
            rl,
          ),
        (ability) => {
          prerequisite.abilities = prerequisite.abilities.filter(
            (a) => a !== ability,
          );
          displaySavingThrowProficiencyPrerequisiteMenu(
            prerequisite,
            callback,
            del,
            rl,
          );
        },
        rl,
      );
    }),
    option(green("Save"), () => {
      callback(prerequisite);
    }),
    option(red("Delete"), () => {
      del(prerequisite);
    }),
  ).display(rl);
}

function displaySkillProficiencyPrerequisiteMenu(
  prerequisite: SkillProficiencyPrerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  menu(
    "Skill proficiency prerequisite\n" +
      gray(prerequisite.skills.map((skill) => skill.displayName).join(", ")),
    option("Add skill", () => {
      displaySkillSelectionMenu(
        "Back to skill proficiency prerequisite",
        () =>
          displaySkillProficiencyPrerequisiteMenu(
            prerequisite,
            callback,
            del,
            rl,
          ),
        (skill) => {
          prerequisite.skills.push(skill);
          displaySkillProficiencyPrerequisiteMenu(
            prerequisite,
            callback,
            del,
            rl,
          );
        },
        rl,
      );
    }),
    option("Remove skill", () => {
      displaySkillSelectionMenu(
        "Back to skill proficiency prerequisite",
        () =>
          displaySkillProficiencyPrerequisiteMenu(
            prerequisite,
            callback,
            del,
            rl,
          ),
        (skill) => {
          prerequisite.skills = prerequisite.skills.filter((s) => s !== skill);
          displaySkillProficiencyPrerequisiteMenu(
            prerequisite,
            callback,
            del,
            rl,
          );
        },
        rl,
      );
    }),
    option(green("Save"), () => {
      callback(prerequisite);
    }),
    option(red("Delete"), () => {
      del(prerequisite);
    }),
  ).display(rl);
}

function displaySpellPrerequisiteMenu(
  prerequisite: SpellPrerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  const spells = prerequisite.spellIds.map((id) => getSpellById(id));
  menu(
    "Spell prerequisite\n" +
      gray(spells.map((spell) => spell?.name ?? "Unknown").join(", ")),
    option("Add spell", () => {
      rl.question("Spell: ", (spellName) => {
        const spell = getSpellByName(spellName);
        if (!spell) {
          console.log(red("Spell not found."));
          displaySpellPrerequisiteMenu(prerequisite, callback, del, rl);
          return;
        }
        prerequisite.spellIds.push(spell.id);
        displaySpellPrerequisiteMenu(prerequisite, callback, del, rl);
      });
    }),
    option("Remove spell", () => {
      rl.question("Spell: ", (spellName) => {
        const spell = getSpellByName(spellName);
        if (!spell) {
          console.log(red("Spell not found."));
          displaySpellPrerequisiteMenu(prerequisite, callback, del, rl);
          return;
        }
        prerequisite.spellIds = prerequisite.spellIds.filter(
          (id) => id !== spell.id,
        );
        displaySpellPrerequisiteMenu(prerequisite, callback, del, rl);
      });
    }),
    option(green("Save"), () => {
      callback(prerequisite);
    }),
    option(red("Delete"), () => {
      del(prerequisite);
    }),
  ).display(rl);
}

function displaySubAncestryPrerequisiteMenu(
  prerequisite: SubAncestryPrerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (preqrequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  const ancestry = getAncestryById(prerequisite.ancestryId);
  const subAncestry = ancestry?.getSubAncestryById(prerequisite.subAncestryId);
  menu(
    "Sub-ancestry prerequisite",
    option("Ancestry " + gray(`(${ancestry?.name ?? "Unknown"})`), () => {
      displayAncestrySelectionMenu(
        "Back to sub-ancestry prerequisite",
        () =>
          displaySubAncestryPrerequisiteMenu(prerequisite, callback, del, rl),
        (ancestry) => {
          prerequisite.ancestryId = ancestry.id;
          displaySubAncestryPrerequisiteMenu(prerequisite, callback, del, rl);
        },
        rl,
      );
    }),
    option(
      "Sub-ancestry " + gray(`(${subAncestry?.name ?? "Unknown"})`),
      () => {
        if (!ancestry) {
          console.log(red("Ancestry not found."));
          displaySubAncestryPrerequisiteMenu(prerequisite, callback, del, rl);
          return;
        }
        displaySubAncestrySelectionMenu(
          ancestry,
          "Back to sub-ancestry prerequisite",
          () =>
            displaySubAncestryPrerequisiteMenu(prerequisite, callback, del, rl),
          (subAncestry) => {
            prerequisite.subAncestryId = subAncestry.id;
            displaySubAncestryPrerequisiteMenu(prerequisite, callback, del, rl);
          },
          rl,
        );
      },
    ),
    option(green("Save"), () => {
      callback(prerequisite);
    }),
    option(red("Delete"), () => {
      del(prerequisite);
    }),
  ).display(rl);
}

function displaySubClassPrerequisiteMenu(
  prerequisite: SubClassPrerequisite,
  callback: (prerequisite: Prerequisite) => void,
  del: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  const clazz = getClassById(prerequisite.classId);
  const subClass = clazz?.getSubClassById(prerequisite.subClassId);
  const level = prerequisite.level;
  menu(
    "Sub-class prerequisite",
    option("Class " + gray(`(${clazz?.name ?? "Unknown"})`), () => {
      displayClassSelectionMenu(
        "Back to sub-class prerequisite",
        () => displaySubClassPrerequisiteMenu(prerequisite, callback, del, rl),
        (clazz) => {
          prerequisite.classId = clazz.id;
          displaySubClassPrerequisiteMenu(prerequisite, callback, del, rl);
        },
        rl,
      );
    }),
    option("Sub-class " + gray(`(${subClass?.name ?? "Unknown"})`), () => {
      if (!clazz) {
        console.log(red("Class not found."));
        displaySubClassPrerequisiteMenu(prerequisite, callback, del, rl);
        return;
      }
      displaySubClassSelectionMenu(
        clazz,
        "Back to sub-class prerequisite",
        () => displaySubClassPrerequisiteMenu(prerequisite, callback, del, rl),
        (subClass) => {
          prerequisite.subClassId = subClass.id;
          displaySubClassPrerequisiteMenu(prerequisite, callback, del, rl);
        },
        rl,
      );
    }),
    option("Level " + gray(`(${level})`), () => {
      rl.question("Level: ", (level) => {
        let levelInt = parseInt(level);
        if (!isNaN(levelInt)) {
          prerequisite.level = levelInt;
        } else {
          console.log(red("Level must be an integer."));
        }
        displaySubClassPrerequisiteMenu(prerequisite, callback, del, rl);
      });
    }),
    option(green("Save"), () => {
      callback(prerequisite);
    }),
    option(red("Delete"), () => {
      del(prerequisite);
    }),
  ).display(rl);
}
