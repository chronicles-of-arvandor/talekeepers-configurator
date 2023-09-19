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
  Prerequisite,
  SavingThrowProficiencyPrerequisite,
  SkillProficiencyPrerequisite,
  SpellPrerequisite,
  SubAncestryPrerequisite, SubClassPrerequisite
} from '../../models/prerequisites';
import * as readline from 'readline';
import { menu, option } from '../menu';
import { gray, green, red } from 'chalk';
import { displayAbilitySelectionMenu } from '../ability/abilitySelectionMenu';
import { displayAncestrySelectionMenu } from '../ancestry/ancestrySelectionMenu';
import { getAncestryById } from '../../models/ancestries';
import { displayPrerequisitesMenu } from './prerequisitesMenu';
import { displayBackgroundSelectionMenu } from '../background/backgroundSelectionMenu';
import { getBackgroundById } from '../../models/backgrounds';
import { getChoiceById } from '../../models/choices';
import { displayOptionSelectionMenu } from '../choice/optionSelectionMenu';
import { displayChoiceSelectionMenu } from '../choice/choiceSelectionMenu';
import { getClassById } from '../../models/classes';
import { displayClassSelectionMenu } from '../clazz/classSelectionMenu';
import { getFeatById, getFeatByName } from '../../models/feats';
import { getLanguageById, getLanguageByName } from '../../models/languages';
import { displaySkillSelectionMenu } from '../skill/skillSelectionMenu';
import { getSpellById, getSpellByName } from '../../models/spells';
import { displaySubAncestrySelectionMenu } from '../ancestry/subancestry/subAncestrySelectionMenu';
import { displaySubClassSelectionMenu } from '../clazz/subClassSelectionMenu';

export function displayPrerequisiteMenu(prerequisite: Prerequisite, backAction: string, back: () => void, callback: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  if (AbilityPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayAbilityPrerequisiteMenu(prerequisite as AbilityPrerequisite, backAction, back, callback, rl);
  } else if (AncestryPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayAncestryPrerequisiteMenu(prerequisite as AncestryPrerequisite, backAction, back, callback, rl);
  } else if (AndPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayAndPrerequisiteMenu(prerequisite as AndPrerequisite, backAction, back, callback, rl);
  } else if (BackgroundPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayBackgroundPrerequisiteMenu(prerequisite as BackgroundPrerequisite, backAction, back, callback, rl);
  } else if (ChoicePrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayChoicePrerequisiteMenu(prerequisite as ChoicePrerequisite, backAction, back, callback, rl);
  } else if (ClassPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayClassPrerequisiteMenu(prerequisite as ClassPrerequisite, backAction, back, callback, rl);
  } else if (FeatPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayFeatPrerequisiteMenu(prerequisite as FeatPrerequisite, backAction, back, callback, rl);
  } else if (ItemProficiencyPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayItemProficiencyPrerequisiteMenu(prerequisite as ItemProficiencyPrerequisite, backAction, back, callback, rl);
  } else if (LanguagePrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayLanguagePrerequisiteMenu(prerequisite as LanguagePrerequisite, backAction, back, callback, rl);
  } else if (LevelPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayLevelPrerequisiteMenu(prerequisite as LevelPrerequisite, backAction, back, callback, rl);
  } else if (SavingThrowProficiencyPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displaySavingThrowProficiencyPrerequisiteMenu(prerequisite as SavingThrowProficiencyPrerequisite, backAction, back, callback, rl);
  } else if (SkillProficiencyPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displaySkillProficiencyPrerequisiteMenu(prerequisite as SkillProficiencyPrerequisite, backAction, back, callback, rl);
  } else if (SpellPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displaySpellPrerequisiteMenu(prerequisite as SpellPrerequisite, backAction, back, callback, rl);
  } else if (SubAncestryPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displaySubAncestryPrerequisiteMenu(prerequisite as SubAncestryPrerequisite, backAction, back, callback, rl);
  } else if (SubClassPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displaySubClassPrerequisiteMenu(prerequisite as SubClassPrerequisite, backAction, back, callback, rl);
  }
}

function displayAbilityPrerequisiteMenu(prerequisite: AbilityPrerequisite, backAction: string, back: () => void, callback: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  menu(
    'Ability prerequisite',
    option('Ability ' + gray(`(${prerequisite.ability.displayName})`), () => {
      displayAbilitySelectionMenu(
        'Back to ability prerequisite',
        () => displayAbilityPrerequisiteMenu(prerequisite, backAction, back, callback, rl),
        (ability) => {
          prerequisite.ability = ability;
          displayAbilityPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        },
        rl
      );
    }),
    option('Score ' + gray(`(${prerequisite.score})`), () => {
      rl.question('Score: ', (score) => {
        let scoreInt = parseInt(score);
        if (!isNaN(scoreInt)) {
          prerequisite.score = scoreInt;
        } else {
          console.log(red('Score must be an integer.'));
        }
        displayAbilityPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
      });
    }),
    option(green('Save'), () => {
      callback(prerequisite);
    }),
    option(backAction, back)
  ).display(rl);
}

function displayAncestryPrerequisiteMenu(prerequisite: AncestryPrerequisite, backAction: string, back: () => void, callback: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  menu(
    'Ancestry prerequisite',
    option('Ancestry ' + gray(`(${getAncestryById(prerequisite.ancestryId)?.name ?? 'Unknown'})`), () => {
      displayAncestrySelectionMenu(
        'Back to ancestry prerequisite',
        () => displayAncestryPrerequisiteMenu(prerequisite, backAction, back, callback, rl),
        (ancestry) => {
          prerequisite.ancestryId = ancestry.id;
          displayAncestryPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        },
        rl
      );
    }),
    option(green('Save'), () => {
      callback(prerequisite);
    }),
    option(backAction, back)
  ).display(rl);
}

function displayAndPrerequisiteMenu(prerequisite: AndPrerequisite, backAction: string, back: () => void, callback: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  menu(
    'AND prerequisite',
    option(
      'Prerequisites ' + gray(`(${prerequisite.prerequisites.length})`),
    () => displayPrerequisitesMenu(
        'Back to AND prerequisite',
        () => displayAndPrerequisiteMenu(prerequisite, backAction, back, callback, rl),
        (prerequisites) => {
          prerequisite.prerequisites = prerequisites;
          displayAndPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        },
        rl
      )
    ),
    option(green('Save'), () => {
      callback(prerequisite);
    }),
    option(backAction, back)
  ).display(rl);
}

function displayBackgroundPrerequisiteMenu(prerequisite: BackgroundPrerequisite, backAction: string, back: () => void, callback: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  menu(
    'Background prerequisite',
    option('Background ' + gray(`(${getBackgroundById(prerequisite.backgroundId)?.name ?? 'Unknown'})`), () => {
      displayBackgroundSelectionMenu(
        'Back to background prerequisite',
        () => displayBackgroundPrerequisiteMenu(prerequisite, backAction, back, callback, rl),
        (background) => {
          prerequisite.backgroundId = background.id;
          displayBackgroundPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        },
        rl
      );
    }),
    option(green('Save'), () => {
      callback(prerequisite);
    }),
    option(backAction, back)
  ).display(rl);
}

function displayChoicePrerequisiteMenu(prerequisite: ChoicePrerequisite, backAction: string, back: () => void, callback: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  const choice = getChoiceById(prerequisite.choiceId);
  const opt = choice?.getOptionById(prerequisite.optionId);
  menu(
    'Choice prerequisite',
    option('Choice ' + gray(`(${choice?.text ?? 'Unknown'})`), () => {
      displayChoiceSelectionMenu(
        'Back to choice prerequisite',
        () => displayChoicePrerequisiteMenu(prerequisite, backAction, back, callback, rl),
        (choice) => {
          prerequisite.choiceId = choice.id;
          displayChoicePrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        },
        rl
      )
    }),
    option('Option ' + gray(`(${opt?.text})`), () => {
      if (!choice) {
        console.log(red('Choice not found.'));
        displayChoicePrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        return;
      }
      displayOptionSelectionMenu(
        choice,
        'Back to choice prerequisite',
        () => displayChoicePrerequisiteMenu(prerequisite, backAction, back, callback, rl),
        (option) => {
          prerequisite.optionId = option.id;
          displayChoicePrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        },
        rl
      )
    }),
    option(green('Save'), () => {
      callback(prerequisite);
    }),
    option(backAction, back)
  ).display(rl);
}

function displayClassPrerequisiteMenu(prerequisite: ClassPrerequisite, backAction: string, back: () => void, callback: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  const clazz = getClassById(prerequisite.classId);
  menu(
    'Class prerequisite',
    option('Class ' + gray(`(${clazz?.name ?? 'Unknown'})`), () => {
      displayClassSelectionMenu(
        'Back to class prerequisite',
        () => displayClassPrerequisiteMenu(prerequisite, backAction, back, callback, rl),
        (clazz) => {
          prerequisite.classId = clazz.id;
          displayClassPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        },
        rl
      );
    }),
    option('Level ' + gray(`(${prerequisite.level})`), () => {
      rl.question('Level: ', (level) => {
        let levelInt = parseInt(level);
        if (!isNaN(levelInt)) {
          prerequisite.level = levelInt;
        } else {
          console.log(red('Level must be an integer.'));
        }
        displayClassPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
      });
    }),
    option(green('Save'), () => {
      callback(prerequisite);
    }),
    option(backAction, back)
  ).display(rl);
}

function displayFeatPrerequisiteMenu(prerequisite: FeatPrerequisite, backAction: string, back: () => void, callback: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  const feat = getFeatById(prerequisite.featId);
  menu(
    'Feat prerequisite',
    option('Feat ' + gray(`(${feat?.name ?? 'Unknown'})`), () => {
      rl.question('Feat: ', (featName) => {
        const feat = getFeatByName(featName);
        if (!feat) {
          console.log(red('Feat not found.'));
          return;
        } else {
          prerequisite.featId = feat.id;
        }
        displayFeatPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
      });
    }),
    option(green('Save'), () => {
      callback(prerequisite);
    }),
    option(backAction, back)
  ).display(rl);
}

function displayItemProficiencyPrerequisiteMenu(prerequisite: ItemProficiencyPrerequisite, backAction: string, back: () => void, callback: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  menu(
    'Item proficiency prerequisite\n' +
    gray(prerequisite.itemIds.join(", ")),
    option('Add item', () => {
      rl.question('Item ID: ', (itemId) => {
        prerequisite.itemIds.push(itemId);
        displayItemProficiencyPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
      });
    }),
    option('Remove item', () => {
      rl.question('Item ID: ', (itemId) => {
        prerequisite.itemIds = prerequisite.itemIds.filter((id) => id !== itemId);
        displayItemProficiencyPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
      });
    }),
    option(green('Save'), () => {
      callback(prerequisite);
    }),
    option(backAction, back)
  ).display(rl);
}

function displayLanguagePrerequisiteMenu(prerequisite: LanguagePrerequisite, backAction: string, back: () => void, callback: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  const language = getLanguageById(prerequisite.languageId);
  menu(
    'Language prerequisite',
    option('Language ' + gray(`(${language?.name ?? 'Unknown'})`), () => {
      rl.question('Language: ', (languageName) => {
        const language = getLanguageByName(languageName);
        if (!language) {
          console.log(red('Language not found.'));
          displayLanguagePrerequisiteMenu(prerequisite, backAction, back, callback, rl);
          return;
        }
        prerequisite.languageId = language.id;
        displayLanguagePrerequisiteMenu(prerequisite, backAction, back, callback, rl);
      });
    }),
    option(green('Save'), () => {
      callback(prerequisite);
    }),
    option(backAction, back)
  ).display(rl);
}

function displayLevelPrerequisiteMenu(prerequisite: LevelPrerequisite, backAction: string, back: () => void, callback: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  menu(
    'Level prerequisite',
    option('Level ' + gray(`(${prerequisite.level})`), () => {
      rl.question('Level: ', (level) => {
        let levelInt = parseInt(level);
        if (!isNaN(levelInt)) {
          prerequisite.level = levelInt;
        } else {
          console.log(red('Level must be an integer.'));
        }
        displayLevelPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
      });
    }),
    option(green('Save'), () => {
      callback(prerequisite);
    }),
    option(backAction, back)
  ).display(rl);
}

function displaySavingThrowProficiencyPrerequisiteMenu(prerequisite: SavingThrowProficiencyPrerequisite, backAction: string, back: () => void, callback: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  menu(
    'Saving throw proficiency prerequisite\n' +
    gray(prerequisite.abilities.map((ability) => ability.displayName).join(", ")),
    option('Add ability', () => {
      displayAbilitySelectionMenu(
        'Back to saving throw proficiency prerequisite',
        () => displaySavingThrowProficiencyPrerequisiteMenu(prerequisite, backAction, back, callback, rl),
        (ability) => {
          prerequisite.abilities.push(ability);
          displaySavingThrowProficiencyPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        },
        rl
      );
    }),
    option('Remove ability', () => {
      displayAbilitySelectionMenu(
        'Back to saving throw proficiency prerequisite',
        () => displaySavingThrowProficiencyPrerequisiteMenu(prerequisite, backAction, back, callback, rl),
        (ability) => {
          prerequisite.abilities = prerequisite.abilities.filter((a) => a !== ability);
          displaySavingThrowProficiencyPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        },
        rl
      );
    }),
    option(green('Save'), () => {
      callback(prerequisite);
    }),
    option(backAction, back)
  ).display(rl);
}

function displaySkillProficiencyPrerequisiteMenu(prerequisite: SkillProficiencyPrerequisite, backAction: string, back: () => void, callback: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  menu(
    'Skill proficiency prerequisite\n' +
    gray(prerequisite.skills.map((skill) => skill.displayName).join(", ")),
    option('Add skill', () => {
      displaySkillSelectionMenu(
        'Back to skill proficiency prerequisite',
        () => displaySkillProficiencyPrerequisiteMenu(prerequisite, backAction, back, callback, rl),
        (skill) => {
          prerequisite.skills.push(skill);
          displaySkillProficiencyPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        },
        rl
      );
    }),
    option('Remove skill', () => {
      displaySkillSelectionMenu(
        'Back to skill proficiency prerequisite',
        () => displaySkillProficiencyPrerequisiteMenu(prerequisite, backAction, back, callback, rl),
        (skill) => {
          prerequisite.skills = prerequisite.skills.filter((s) => s !== skill);
          displaySkillProficiencyPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        },
        rl
      );
    }),
    option(green('Save'), () => {
      callback(prerequisite);
    }),
    option(backAction, back)
  ).display(rl);
}

function displaySpellPrerequisiteMenu(prerequisite: SpellPrerequisite, backAction: string, back: () => void, callback: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  const spells = prerequisite.spellIds.map((id) => getSpellById(id));
  menu(
    'Spell prerequisite\n' +
    gray(spells.map((spell) => spell?.name ?? 'Unknown').join(", ")),
    option('Add spell', () => {
      rl.question('Spell: ', (spellName) => {
        const spell = getSpellByName(spellName);
        if (!spell) {
          console.log(red('Spell not found.'));
          displaySpellPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
          return;
        }
        prerequisite.spellIds.push(spell.id);
        displaySpellPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
      });
    }),
    option('Remove spell', () => {
      rl.question('Spell: ', (spellName) => {
        const spell = getSpellByName(spellName);
        if (!spell) {
          console.log(red('Spell not found.'));
          displaySpellPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
          return;
        }
        prerequisite.spellIds = prerequisite.spellIds.filter((id) => id !== spell.id);
        displaySpellPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
      });
    }),
    option(green('Save'), () => {
      callback(prerequisite);
    }),
    option(backAction, back)
  ).display(rl);
}

function displaySubAncestryPrerequisiteMenu(prerequisite: SubAncestryPrerequisite, backAction: string, back: () => void, callback: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  const ancestry = getAncestryById(prerequisite.ancestryId);
  const subAncestry = ancestry?.getSubAncestryById(prerequisite.subAncestryId);
  menu(
    'Sub-ancestry prerequisite',
    option('Ancestry ' + gray(`(${ancestry?.name ?? 'Unknown'})`), () => {
      displayAncestrySelectionMenu(
        'Back to sub-ancestry prerequisite',
        () => displaySubAncestryPrerequisiteMenu(prerequisite, backAction, back, callback, rl),
        (ancestry) => {
          prerequisite.ancestryId = ancestry.id;
          displaySubAncestryPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        },
        rl
      );
    }),
    option('Sub-ancestry ' + gray(`(${subAncestry?.name ?? 'Unknown'})`), () => {
      if (!ancestry) {
        console.log(red('Ancestry not found.'));
        displaySubAncestryPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        return;
      }
      displaySubAncestrySelectionMenu(
        ancestry,
        'Back to sub-ancestry prerequisite',
        () => displaySubAncestryPrerequisiteMenu(prerequisite, backAction, back, callback, rl),
        (subAncestry) => {
          prerequisite.subAncestryId = subAncestry.id;
          displaySubAncestryPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        },
        rl
      );
    }),
    option(backAction, back)
  ).display(rl);
}

function displaySubClassPrerequisiteMenu(prerequisite: SubClassPrerequisite, backAction: string, back: () => void, callback: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  const clazz = getClassById(prerequisite.classId);
  const subClass = clazz?.getSubClassById(prerequisite.subClassId);
  const level = prerequisite.level;
  menu(
    'Sub-class prerequisite',
    option('Class ' + gray(`(${clazz?.name ?? 'Unknown'})`), () => {
      displayClassSelectionMenu(
        'Back to sub-class prerequisite',
        () => displaySubClassPrerequisiteMenu(prerequisite, backAction, back, callback, rl),
        (clazz) => {
          prerequisite.classId = clazz.id;
          displaySubClassPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        },
        rl
      );
    }),
    option('Sub-class ' + gray(`(${subClass?.name ?? 'Unknown'})`), () => {
      if (!clazz) {
        console.log(red('Class not found.'));
        displaySubClassPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        return;
      }
      displaySubClassSelectionMenu(
        clazz,
        'Back to sub-class prerequisite',
        () => displaySubClassPrerequisiteMenu(prerequisite, backAction, back, callback, rl),
        (subClass) => {
          prerequisite.subClassId = subClass.id;
          displaySubClassPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
        },
        rl
      );
    }),
    option('Level ' + gray(`(${level})`), () => {
      rl.question('Level: ', (level) => {
        let levelInt = parseInt(level);
        if (!isNaN(levelInt)) {
          prerequisite.level = levelInt;
        } else {
          console.log(red('Level must be an integer.'));
        }
        displaySubClassPrerequisiteMenu(prerequisite, backAction, back, callback, rl);
      });
    }),
    option(green('Save'), () => {
      callback(prerequisite);
    }),
    option(backAction, back)
  ).display(rl);
}
