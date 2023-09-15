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
import { gray, red } from 'chalk';
import { displayAbilitySelectionMenu } from '../ability/abilitySelectionMenu';
import { displayAncestrySelectionMenu } from '../ancestry/ancestrySelectionMenu';
import { getAncestryById } from '../../models/ancestries';
import { displayPrerequisitesMenu } from './prerequisitesMenu';
import { displayBackgroundSelectionMenu } from '../background/backgroundSelectionMenu';
import { getBackgroundById } from '../../models/backgrounds';
import { getChoiceById } from '../../models/choices';
import { displayOptionSelectionMenu } from '../choice/optionSelectionMenu';
import { displayChoiceSelectionMenu } from '../choice/choiceSelectionMenu';

export function displayPrerequisiteMenu(prerequisite: Prerequisite, backAction: string, back: () => void, save: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  if (AbilityPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayAbilityPrerequisiteMenu(prerequisite as AbilityPrerequisite, backAction, back, save, rl);
  } else if (AncestryPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayAncestryPrerequisiteMenu(prerequisite as AncestryPrerequisite, backAction, back, save, rl);
  } else if (AndPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayAndPrerequisiteMenu(prerequisite as AndPrerequisite, backAction, back, save, rl);
  } else if (BackgroundPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayBackgroundPrerequisiteMenu(prerequisite as BackgroundPrerequisite, backAction, back, save, rl);
  } else if (ChoicePrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayChoicePrerequisiteMenu(prerequisite as ChoicePrerequisite, backAction, back, save, rl);
  } else if (ClassPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayClassPrerequisiteMenu(prerequisite as ClassPrerequisite, backAction, back, save, rl);
  } else if (FeatPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayFeatPrerequisiteMenu(prerequisite as FeatPrerequisite, backAction, back, save, rl);
  } else if (ItemProficiencyPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayItemProficiencyPrerequisiteMenu(prerequisite as ItemProficiencyPrerequisite, backAction, back, save, rl);
  } else if (LanguagePrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayLanguagePrerequisiteMenu(prerequisite as LanguagePrerequisite, backAction, back, save, rl);
  } else if (LevelPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displayLevelPrerequisiteMenu(prerequisite as LevelPrerequisite, backAction, back, save, rl);
  } else if (SavingThrowProficiencyPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displaySavingThrowProficiencyPrerequisiteMenu(prerequisite as SavingThrowProficiencyPrerequisite, backAction, back, save, rl);
  } else if (SkillProficiencyPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displaySkillProficiencyPrerequisiteMenu(prerequisite as SkillProficiencyPrerequisite, backAction, back, save, rl);
  } else if (SpellPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displaySpellProficiencyPrerequisiteMenu(prerequisite as SpellPrerequisite, backAction, back, save, rl);
  } else if (SubAncestryPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displaySubAncestryPrerequisiteMenu(prerequisite as SubAncestryPrerequisite, backAction, back, save, rl);
  } else if (SubClassPrerequisite.prototype.isPrototypeOf(prerequisite)) {
    displaySubClassPrerequisiteMenu(prerequisite as SubClassPrerequisite, backAction, back, save, rl);
  }
}

function displayAbilityPrerequisiteMenu(prerequisite: AbilityPrerequisite, backAction: string, back: () => void, save: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  menu(
    'Ability prerequisite',
    option('Ability ' + gray(`(${prerequisite.ability.displayName})`), () => {
      displayAbilitySelectionMenu(
        'Back to ability prerequisite',
        () => displayAbilityPrerequisiteMenu(prerequisite, backAction, back, save, rl),
        (ability) => {
          prerequisite.ability = ability;
          save(prerequisite);
        },
        rl
      );
    }),
    option('Score ' + gray(`(${prerequisite.score})`), () => {
      rl.question('Score: ', (score) => {
        let scoreInt = parseInt(score);
        if (!isNaN(scoreInt)) {
          prerequisite.score = scoreInt;
          save(prerequisite);
        } else {
          console.log(red('Score must be an integer.'));
        }
        displayAbilityPrerequisiteMenu(prerequisite, backAction, back, save, rl);
      });
    }),
    option(backAction, back)
  )
}

function displayAncestryPrerequisiteMenu(prerequisite: AncestryPrerequisite, backAction: string, back: () => void, save: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  menu(
    'Ancestry prerequisite',
    option('Ancestry ' + gray(`(${getAncestryById(prerequisite.ancestryId)?.name ?? 'Unknown'})`), () => {
      displayAncestrySelectionMenu(
        'Back to ancestry prerequisite',
        () => displayAncestryPrerequisiteMenu(prerequisite, backAction, back, save, rl),
        (ancestry) => {
          prerequisite.ancestryId = ancestry.id;
          save(prerequisite);
        },
        rl
      );
    }),
    option(backAction, back)
  ).display(rl);
}

function displayAndPrerequisiteMenu(prerequisite: AndPrerequisite, backAction: string, back: () => void, save: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  menu(
    'AND prerequisite',
    option(
      'Prerequisites ' + gray(`(${prerequisite.prerequisites.length})`),
    () => displayPrerequisitesMenu(
        'Back to AND prerequisite',
        () => displayAndPrerequisiteMenu(prerequisite, backAction, back, save, rl),
        (prerequisites) => {
          prerequisite.prerequisites = prerequisites;
          save(prerequisite);
        },
        rl
      )
    )
  ).display(rl);
}

function displayBackgroundPrerequisiteMenu(prerequisite: BackgroundPrerequisite, backAction: string, back: () => void, save: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  menu(
    'Background prerequisite',
    option('Background ' + gray(`(${getBackgroundById(prerequisite.backgroundId)?.name ?? 'Unknown'})`), () => {
      displayBackgroundSelectionMenu(
        'Back to background prerequisite',
        () => displayBackgroundPrerequisiteMenu(prerequisite, backAction, back, save, rl),
        (background) => {
          prerequisite.backgroundId = background.id;
          save(prerequisite);
        },
        rl
      );
    }),
    option(backAction, back)
  ).display(rl);
}

function displayChoicePrerequisiteMenu(prerequisite: ChoicePrerequisite, backAction: string, back: () => void, save: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  const choice = getChoiceById(prerequisite.choiceId);
  const opt = choice?.getOptionById(prerequisite.optionId);
  menu(
    'Choice prerequisite',
    option('Choice ' + gray(`(${choice?.text ?? 'Unknown'})`), () => {
      displayChoiceSelectionMenu(
        'Back to choice prerequisite',
        () => displayChoicePrerequisiteMenu(prerequisite, backAction, back, save, rl),
        (choice) => {
          prerequisite.choiceId = choice.id;
          save(prerequisite);
        },
        rl
      )
    }),
    option('Option ' + gray(`(${opt?.text})`), () => {
      if (!choice) {
        console.log(red('Choice not found.'));
        displayChoicePrerequisiteMenu(prerequisite, backAction, back, save, rl);
        return;
      }
      displayOptionSelectionMenu(
        choice,
        'Back to choice prerequisite',
        () => displayChoicePrerequisiteMenu(prerequisite, backAction, back, save, rl),
        (option) => {
          prerequisite.optionId = option.id;
          save(prerequisite);
        },
        rl
      )
    }),
    option(backAction, back)
  )
}

function displayClassPrerequisiteMenu(prerequisite: ClassPrerequisite, backAction: string, back: () => void, save: (prerequisite: Prerequisite) => void, rl: readline.Interface) {

}

function displayFeatPrerequisiteMenu(prerequisite: FeatPrerequisite, backAction: string, back: () => void, save: (prerequisite: Prerequisite) => void, rl: readline.Interface) {

}

function displayItemProficiencyPrerequisiteMenu(prerequisite: ItemProficiencyPrerequisite, backAction: string, back: () => void, save: (prerequisite: Prerequisite) => void, rl: readline.Interface) {

}

function displayLanguagePrerequisiteMenu(prerequisite: LanguagePrerequisite, backAction: string, back: () => void, save: (prerequisite: Prerequisite) => void, rl: readline.Interface) {

}

function displayLevelPrerequisiteMenu(prerequisite: LevelPrerequisite, backAction: string, back: () => void, save: (prerequisite: Prerequisite) => void, rl: readline.Interface) {

}

function displaySavingThrowProficiencyPrerequisiteMenu(prerequisite: SavingThrowProficiencyPrerequisite, backAction: string, back: () => void, save: (prerequisite: Prerequisite) => void, rl: readline.Interface) {

}

function displaySkillProficiencyPrerequisiteMenu(prerequisite: SkillProficiencyPrerequisite, backAction: string, back: () => void, save: (prerequisite: Prerequisite) => void, rl: readline.Interface) {

}

function displaySpellProficiencyPrerequisiteMenu(prerequisite: SpellPrerequisite, backAction: string, back: () => void, save: (prerequisite: Prerequisite) => void, rl: readline.Interface) {

}

function displaySubAncestryPrerequisiteMenu(prerequisite: SubAncestryPrerequisite, backAction: string, back: () => void, save: (prerequisite: Prerequisite) => void, rl: readline.Interface) {

}

function displaySubClassPrerequisiteMenu(prerequisite: SubClassPrerequisite, backAction: string, back: () => void, save: (prerequisite: Prerequisite) => void, rl: readline.Interface) {

}
