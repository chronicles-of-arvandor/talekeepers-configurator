import * as readline from 'readline';
import { menu, option } from '../menu';
import { getLanguageById, getLanguages, Language } from '../../models/languages';
import { gray, green, red } from 'chalk';
import { displayChoicesMenu } from './choicesMenu';
import { Choice, ChoiceOption, getChoicesDirectory } from '../../models/choices';
import path from 'path';
import * as uuid from 'uuid';
import {
  ChoicePrerequisite,
  NotPrerequisite,
  OrPrerequisite,
  Prerequisite,
  LanguagePrerequisite
} from '../../models/prerequisites';
import { displayPrerequisitesMenu } from '../prerequisite/prerequisitesMenu';
import { getEffects, getEffectsDirectory, LanguageEffect } from '../../models/effects';
import { displayLanguageSelectionMenu } from '../language/languageSelectionMenu';

export function displayNewLanguageChoiceMenu(name: string, text: string, amount: number, prerequisites: Prerequisite[], languages: Language[], rl: readline.Interface) {
  menu(
    'New language choice\n' + gray(`${languages.length} languages selected`),
    option('Name ' + gray(`(${name})`), () => {
      rl.question('Name: ', (newName) => {
        displayNewLanguageChoiceMenu(newName, text, amount, prerequisites, languages, rl);
      });
    }),
    option('Text ' + gray(`(${text})`), () => {
      rl.question('Text: ', (newText) => {
        displayNewLanguageChoiceMenu(name, newText, amount, prerequisites, languages, rl);
      });
    }),
    option('Amount ' + gray(`(${amount})`), () => {
      rl.question('Amount: ', (newAmount) => {
        const amountInt = parseInt(newAmount);
        if (isNaN(amountInt)) {
          console.log(red('Invalid amount.'));
          displayNewLanguageChoiceMenu(name, text, amount, prerequisites, languages, rl);
          return;
        }
        displayNewLanguageChoiceMenu(name, text, amountInt, prerequisites, languages, rl);
      });
    }),
    option('Prerequisites ' + gray(`(${prerequisites.length})`), () => {
      displayPrerequisitesMenu(
        'Back to new language choice menu',
        () => {
          displayNewLanguageChoiceMenu(name, text, amount, prerequisites, languages, rl);
        },
        (newPrerequisites) => {
          displayNewLanguageChoiceMenu(name, text, amount, newPrerequisites, languages, rl);
        },
        rl
      );
    }),
    option('Add all languages', () => {
      console.log(green('Added all languages.'));
      displayNewLanguageChoiceMenu(name, text, amount, prerequisites, getLanguages(), rl);
    }),
    option('Add language', () => {
      displayLanguageSelectionMenu(
        'Back to new language choice menu',
        () => {
          displayNewLanguageChoiceMenu(name, text, amount, prerequisites, languages, rl);
        },
        (language) => {
          displayNewLanguageChoiceMenu(name, text, amount, prerequisites, [...languages, language], rl);
        },
        rl
      );
    }),
    option('Remove language', () => {
      menu(
        'Language',
        ...languages.map((language) => option(language.name, () => {
          displayNewLanguageChoiceMenu(name, text, amount, prerequisites, languages.filter((s) => s !== language), rl);
        })),
        option('Back to new language choice menu', () => {
          displayNewLanguageChoiceMenu(name, text, amount, prerequisites, languages, rl);
        })
      ).display(rl);
    }),
    option(green('Save'), () => {
      createLanguageChoices(name, text, amount, prerequisites, languages);
      console.log(green('Language choices saved.'));
      displayChoicesMenu(rl);
    }),
    option(red('Cancel'), () => {
      displayChoicesMenu(rl);
    })
  ).display(rl);
}

function createLanguageChoices(name: string, text: string, amount: number, prerequisites: Prerequisite[], languages: Language[]) {
  if (amount > 1) {
    for (let i = 1; i <= amount; i++) {
      createLanguageChoice(`${name}_${i}`, `${text} (${i})`, prerequisites, languages);
    }
  } else {
    createLanguageChoice(name, text, prerequisites, languages);
  }
}

function createLanguageChoice(name: string, text: string, prerequisites: Prerequisite[], languages: Language[]) {
  const choice = new Choice(
    path.join(getChoicesDirectory(), `${name}.yml`),
    uuid.v4(),
    text,
    prerequisites,
    languages.map((language) => {
      return new ChoiceOption(
        uuid.v4(),
        language.name,
        [
          new NotPrerequisite(
            new LanguagePrerequisite([language.id])
          )
        ]
      );
    })
  );
  choice.save();
  updateEffects(choice);
}

function updateEffects(choice: Choice) {
  const allEffects = getEffects();
  choice.options.forEach((opt) => {
    const optionLanguageNotPrerequisite = opt.prerequisites
      .filter((prerequisite): prerequisite is NotPrerequisite => NotPrerequisite.prototype.isPrototypeOf(prerequisite))
      .find((prerequisite) => LanguagePrerequisite.prototype.isPrototypeOf(prerequisite.prerequisite));
    if (!optionLanguageNotPrerequisite) {
      console.log(red(`Could not find language prerequisite for option ${opt.text}`));
      return;
    }
    const optionLanguagePrerequisite = optionLanguageNotPrerequisite.prerequisite as LanguagePrerequisite;
    const languageId = optionLanguagePrerequisite.languageIds[0];
    const language = getLanguageById(languageId);
    if (!language) {
      console.log(red(`Could not find language for option ${opt.text}`));
      return;
    }
    const effectFile = path.join(getEffectsDirectory(), `language_${language.name.toLowerCase().replace(/[^a-zA-Z0-9._-]/g, '_')}.yml`);
    let effect = allEffects.find((effect) => effect.file === effectFile);
    if (!effect) {
      effect = new LanguageEffect(
        effectFile,
        [language.id],
        [new OrPrerequisite(
          [
            new ChoicePrerequisite(
              choice.id,
              opt.id
            )
          ]
        )]
      )
    } else {
      const orPrerequisite = effect.prerequisites.find((prerequisite): prerequisite is OrPrerequisite => OrPrerequisite.prototype.isPrototypeOf(prerequisite));
      if (orPrerequisite) {
        orPrerequisite.prerequisites.push(
          new ChoicePrerequisite(
            choice.id,
            opt.id
          )
        );
      } else {
        effect.prerequisites.push(
          new OrPrerequisite(
            [
              new ChoicePrerequisite(
                choice.id,
                opt.id
              )
            ]
          )
        );
      }
    }
    effect.save();
  })
}