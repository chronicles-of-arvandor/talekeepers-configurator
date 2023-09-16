import * as readline from 'readline';
import { menu, option } from '../menu';
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
  ItemProficiencyPrerequisite
} from '../../models/prerequisites';
import { displayPrerequisitesMenu } from '../prerequisite/prerequisitesMenu';
import { getEffects, getEffectsDirectory, ItemProficiencyEffect } from '../../models/effects';

export function displayNewItemProficiencyChoiceMenu(name: string, text: string, amount: number, prerequisites: Prerequisite[], items: string[], rl: readline.Interface) {
  menu(
    'New item proficiency choice\n' + gray(`${items.length} items selected`),
    option('Name ' + gray(`(${name})`), () => {
      rl.question('Name: ', (newName) => {
        displayNewItemProficiencyChoiceMenu(newName, text, amount, prerequisites, items, rl);
      });
    }),
    option('Text ' + gray(`(${text})`), () => {
      rl.question('Text: ', (newText) => {
        displayNewItemProficiencyChoiceMenu(name, newText, amount, prerequisites, items, rl);
      });
    }),
    option('Amount ' + gray(`(${amount})`), () => {
      rl.question('Amount: ', (newAmount) => {
        const amountInt = parseInt(newAmount);
        if (isNaN(amountInt)) {
          console.log(red('Invalid amount.'));
          displayNewItemProficiencyChoiceMenu(name, text, amount, prerequisites, items, rl);
          return;
        }
        displayNewItemProficiencyChoiceMenu(name, text, amountInt, prerequisites, items, rl);
      });
    }),
    option('Prerequisites ' + gray(`(${prerequisites.length})`), () => {
      displayPrerequisitesMenu(
        'Back to new item proficiency choice menu',
        () => {
          displayNewItemProficiencyChoiceMenu(name, text, amount, prerequisites, items, rl);
        },
        (newPrerequisites) => {},
        rl
      );
    }),
    option('Add item', () => {
      rl.question('Item ID: ', (itemId) => {
        console.log(green(`Added item ${itemId}.`));
        displayNewItemProficiencyChoiceMenu(name, text, amount, prerequisites, [...items, itemId], rl);
      });
    }),
    option('Remove item', () => {
      rl.question('Item ID: ', (itemId) => {
        console.log(green(`Removed item ${itemId}.`));
        displayNewItemProficiencyChoiceMenu(name, text, amount, prerequisites, items.filter((item) => item !== itemId), rl);
      });
    }),
    option(green('Save'), () => {
      createItemProficiencyChoices(name, text, amount, prerequisites, items);
      console.log(green('Item proficiency choices saved.'));
      displayChoicesMenu(rl);
    }),
    option(red('Cancel'), () => {
      displayChoicesMenu(rl);
    })
  ).display(rl);
}

function createItemProficiencyChoices(name: string, text: string, amount: number, prerequisites: Prerequisite[], items: string[]) {
  for (let i = 1; i <= amount; i++) {
    createItemProficiencyChoice(`${name}_${i}`, `${text} (${i})`, prerequisites, items);
  }
}

function createItemProficiencyChoice(name: string, text: string, prerequisites: Prerequisite[], items: string[]) {
  const choice = new Choice(
    path.join(getChoicesDirectory(), `${name}.yml`),
    uuid.v4(),
    text,
    prerequisites,
    items.map((item) => {
      return new ChoiceOption(
        uuid.v4(),
        item,
        [
          new NotPrerequisite(
            new ItemProficiencyPrerequisite([item])
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
    const optionItemProficiencyNotPrerequisite = opt.prerequisites
      .filter((prerequisite): prerequisite is NotPrerequisite => NotPrerequisite.prototype.isPrototypeOf(prerequisite))
      .find((prerequisite) => ItemProficiencyPrerequisite.prototype.isPrototypeOf(prerequisite.prerequisite));
    if (!optionItemProficiencyNotPrerequisite) {
      console.log(red(`Could not find item proficiency prerequisite for option ${opt.text}`));
      return;
    }
    const optionItemProficiencyPrerequisite = optionItemProficiencyNotPrerequisite.prerequisite as ItemProficiencyPrerequisite;
    const item = optionItemProficiencyPrerequisite.itemIds[0];
    if (!item) {
      console.log(red(`Could not find item for option ${opt.text}`));
      return;
    }
    const effectFile = path.join(getEffectsDirectory(), `item_proficiency_${item.toLowerCase().replace(/[^a-zA-Z0-9._-]/g, '_')}.yml`);
    let effect = allEffects.find((effect) => effect.file === effectFile);
    if (!effect) {
      effect = new ItemProficiencyEffect(
        effectFile,
        [item],
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