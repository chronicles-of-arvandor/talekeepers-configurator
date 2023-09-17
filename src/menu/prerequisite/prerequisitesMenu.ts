import * as readline from 'readline';
import { menu, option } from '../menu';
import {
  AbilityPrerequisite,
  AncestryPrerequisite,
  AndPrerequisite,
  ChoicePrerequisite, ClassPrerequisite,
  FeatPrerequisite,
  ItemProficiencyPrerequisite,
  LanguagePrerequisite, LevelPrerequisite,
  NotPrerequisite,
  OrPrerequisite,
  Prerequisite, SavingThrowProficiencyPrerequisite,
  SkillProficiencyPrerequisite, SpellPrerequisite, SubAncestryPrerequisite
} from '../../models/prerequisites';
import { Ability } from '../../models/abilities';
import { getAncestries } from '../../models/ancestries';
import { getBackgrounds } from '../../models/backgrounds';
import { getChoices } from '../../models/choices';
import { getClasses } from '../../models/classes';
import { green, red } from 'chalk';
import { getFeats } from '../../models/feats';
import { getLanguages } from '../../models/languages';
import { displayPrerequisiteMenu } from './prerequisiteMenu';

export function displayPrerequisitesMenu(
  backAction: string,
  back: () => void,
  save: (prerequisites: Prerequisite[]) => void,
  rl: readline.Interface,
  prerequisites: Prerequisite[] = []
) {
  menu(
    'Prerequisites',
    option(green('New'), () => {
      displayNewPrerequisiteMenu(
        'Back to prerequisites menu',
        () => {
          displayPrerequisitesMenu(backAction, back, save, rl, prerequisites);
        },
        (prerequisite) => {
          if (prerequisites.indexOf(prerequisite) === -1) {
            prerequisites.push(prerequisite);
          }
          save(prerequisites);
        },
        rl
      );
    }),
    ...prerequisites.map((prerequisite) => option(
      prerequisite.getName(),
      () => {
        displayPrerequisiteMenu(
          prerequisite,
          'Back to prerequisites menu',
          () => {
            displayPrerequisitesMenu(backAction, back, save, rl, prerequisites);
          },
          (prerequisite) => {
            if (prerequisites.indexOf(prerequisite) === -1) {
              prerequisites.push(prerequisite);
            }
            save(prerequisites);
          },
          rl
        )
      }
    )),
    option(backAction, back)
  ).display(rl);
}

function displayNewPrerequisiteMenu(backAction: string, back: () => void, save: (prerequisite: Prerequisite) => void, rl: readline.Interface) {
  menu(
    'Prerequisite type',
    option('AND', () => {
      const andPrerequisite = new AndPrerequisite([]);
      save(andPrerequisite);
      displayPrerequisiteMenu(
        andPrerequisite,
        'Back to new prerequisite menu',
        () => displayNewPrerequisiteMenu(backAction, back, save, rl),
        save,
        rl);
    }),
    option('OR', () => {
      const orPrerequisite = new OrPrerequisite([]);
      save(orPrerequisite);
      displayPrerequisiteMenu(
        orPrerequisite,
        'Back to new prerequisite menu',
        () => displayNewPrerequisiteMenu(backAction, back, save, rl),
        save,
        rl);
    }),
    option('NOT', () => {
      const notPrerequisite = new NotPrerequisite(new AndPrerequisite([]));
      save(notPrerequisite);
      displayPrerequisiteMenu(
        notPrerequisite,
        'Back to new prerequisite menu',
        () => displayNewPrerequisiteMenu(backAction, back, save, rl),
        save,
        rl);
    }),
    option('Ability score', () => {
      const abilityPrerequisite = new AbilityPrerequisite(
        Ability.STRENGTH,
        10
      );
      save(abilityPrerequisite);
      displayPrerequisiteMenu(
        abilityPrerequisite,
        'Back to new prerequisite menu',
        () => displayNewPrerequisiteMenu(backAction, back, save, rl),
        save,
        rl);
    }),
    option('Ancestry', () => {
      const ancestries = getAncestries();
      if (ancestries.length === 0) {
        console.log(red('No ancestries defined yet.'));
        displayNewPrerequisiteMenu(backAction, back, save, rl);
        return;
      }
      const ancestryPrerequisite = new AncestryPrerequisite(ancestries[0].id);
      save(ancestryPrerequisite);
      displayPrerequisiteMenu(
        ancestryPrerequisite,
        'Back to new prerequisite menu',
        () => displayNewPrerequisiteMenu(backAction, back, save, rl),
        save,
        rl
      );
    }),
    option('Background', () => {
      const backgrounds = getBackgrounds();
      if (backgrounds.length === 0) {
        console.log(red('No backgrounds defined yet.'));
        displayNewPrerequisiteMenu(backAction, back, save, rl);
        return;
      }
      const backgroundPrerequisite = new AncestryPrerequisite(backgrounds[0].id);
      save(backgroundPrerequisite);
    }),
    option('Choice', () => {
      const choices = getChoices();
      if (choices.length === 0) {
        console.log(red('No choices defined yet.'));
        displayNewPrerequisiteMenu(backAction, back, save, rl);
        return;
      }
      const choice = choices.find((choice) => choice.options.length > 0);
      if (!choice) {
        console.log(red('No choices with options defined yet.'));
        displayNewPrerequisiteMenu(backAction, back, save, rl);
        return;
      }
      const option = choice.options[0];
      const choicePrerequisite = new ChoicePrerequisite(choice.id, option.id);
      save(choicePrerequisite);
      displayPrerequisiteMenu(
        choicePrerequisite,
        'Back to new prerequisite menu',
        () => displayNewPrerequisiteMenu(backAction, back, save, rl),
        save,
        rl);
    }),
    option('Class', () => {
      const classes = getClasses();
      if (classes.length === 0) {
        console.log(red('No classes defined yet.'));
        displayNewPrerequisiteMenu(backAction, back, save, rl);
        return;
      }
      const classPrerequisite = new ClassPrerequisite(classes[0].id, 1);
      save(classPrerequisite);
      displayPrerequisiteMenu(
        classPrerequisite,
        'Back to new prerequisite menu',
        () => displayNewPrerequisiteMenu(backAction, back, save, rl),
        save,
        rl);
    }),
    option('Feat', () => {
      const feats = getFeats();
      if (feats.length === 0) {
        console.log(red('No feats defined yet.'));
        displayNewPrerequisiteMenu(backAction, back, save, rl);
        return;
      }
      const featPrerequisite = new FeatPrerequisite(feats[0].id);
      save(featPrerequisite);
      displayPrerequisiteMenu(
        featPrerequisite,
        'Back to new prerequisite menu',
        () => displayNewPrerequisiteMenu(backAction, back, save, rl),
        save,
        rl);
    }),
    option('Item proficiency', () => {
      const itemProficiencyPrerequisite = new ItemProficiencyPrerequisite([]);
      save(itemProficiencyPrerequisite);
      displayPrerequisiteMenu(
        itemProficiencyPrerequisite,
        'Back to new prerequisite menu',
        () => displayNewPrerequisiteMenu(backAction, back, save, rl),
        save,
        rl);
    }),
    option('Language', () => {
      const languages = getLanguages();
      if (languages.length === 0) {
        console.log(red('No languages defined yet.'));
        displayNewPrerequisiteMenu(backAction, back, save, rl);
        return;
      }
      const languagePrerequisite = new LanguagePrerequisite(languages[0].id);
      save(languagePrerequisite);
      displayPrerequisiteMenu(
        languagePrerequisite,
        'Back to new prerequisite menu',
        () => displayNewPrerequisiteMenu(backAction, back, save, rl),
        save,
        rl);
    }),
    option('Level', () => {
      const levelPrerequisite = new LevelPrerequisite(1);
      save(levelPrerequisite);
      displayPrerequisiteMenu(
        levelPrerequisite,
        'Back to new prerequisite menu',
        () => displayNewPrerequisiteMenu(backAction, back, save, rl),
        save,
        rl);
    }),
    option('Saving throw proficiency', () => {
      const savingThrowProficiencyPrerequisite = new SavingThrowProficiencyPrerequisite([]);
      save(savingThrowProficiencyPrerequisite);
      displayPrerequisiteMenu(
        savingThrowProficiencyPrerequisite,
        'Back to new prerequisite menu',
        () => displayNewPrerequisiteMenu(backAction, back, save, rl),
        save,
        rl);
    }),
    option('Skill proficiency', () => {
      const skillProficiencyPrerequisite = new SkillProficiencyPrerequisite([]);
      save(skillProficiencyPrerequisite);
      displayPrerequisiteMenu(
        skillProficiencyPrerequisite,
        'Back to new prerequisite menu',
        () => displayNewPrerequisiteMenu(backAction, back, save, rl),
        save,
        rl);
    }),
    option('Spell', () => {
      const spellPrerequisite = new SpellPrerequisite([]);
      save(spellPrerequisite);
      displayPrerequisiteMenu(
        spellPrerequisite,
        'Back to new prerequisite menu',
        () => displayNewPrerequisiteMenu(backAction, back, save, rl),
        save,
        rl);
    }),
    option('Sub-ancestry', () => {
      const ancestries = getAncestries();
      if (ancestries.length === 0) {
        console.log(red('No ancestries defined yet.'));
        displayNewPrerequisiteMenu(backAction, back, save, rl);
        return;
      }
      const ancestry = ancestries.find((ancestry) => ancestry.subAncestries.length > 0);
      if (!ancestry) {
        console.log(red('No ancestries with sub-ancestries defined yet.'));
        displayNewPrerequisiteMenu(backAction, back, save, rl);
        return;
      }
      const subAncestry = ancestry.subAncestries[0];
      const subAncestryPrerequisite = new SubAncestryPrerequisite(ancestry.id, subAncestry.id);
      save(subAncestryPrerequisite);
      displayPrerequisiteMenu(
        subAncestryPrerequisite,
        'Back to new prerequisite menu',
        () => displayNewPrerequisiteMenu(backAction, back, save, rl),
        save,
        rl);
    }),
    option('Sub-class', () => {
      const classes = getClasses();
      if (classes.length === 0) {
        console.log(red('No classes defined yet.'));
        displayNewPrerequisiteMenu(backAction, back, save, rl);
        return;
      }
      const clazz = classes.find((clazz) => clazz.subClasses.length > 0);
      if (!clazz) {
        console.log(red('No classes with sub-classes defined yet.'));
        displayNewPrerequisiteMenu(backAction, back, save, rl);
        return;
      }
      const subClass = clazz.subClasses[0];
      const subClassPrerequisite = new SubAncestryPrerequisite(clazz.id, subClass.id);
      save(subClassPrerequisite);
      displayPrerequisiteMenu(
        subClassPrerequisite,
        'Back to new prerequisite menu',
        () => displayNewPrerequisiteMenu(backAction, back, save, rl),
        save,
        rl);
    }),
    option(backAction, () => {
      back();
    })
  ).display(rl);
}