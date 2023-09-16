import * as readline from 'readline';
import { Prerequisite } from '../../models/prerequisites';
import { menu, option } from '../menu';
import { gray, green, red } from 'chalk';
import { displayChoicesMenu } from './choicesMenu';
import { displayPrerequisitesMenu } from '../prerequisite/prerequisitesMenu';

export function displayNewAsiChoiceMenu(name: string, text: string, amount: number, prerequisites: Prerequisite[], rl: readline.Interface) {
  menu(
    'New ASI choice',
    option('Name ' + gray(`(${name})`), () => {
      rl.question('Name: ', (newName) => {
        console.log(green(`Name set to ${newName}.`));
        displayNewAsiChoiceMenu(newName, text, amount, prerequisites, rl);
      });
    }),
    option('Text ' + gray(`(${text})`), () => {
      rl.question('Text: ', (newText) => {
        console.log(green(`Text set to ${newText}.`));
        displayNewAsiChoiceMenu(name, newText, amount, prerequisites, rl);
      });
    }),
    option('Amount ' + gray(`(${amount})`), () => {
      rl.question('Amount: ', (newAmount) => {
        const amountInt = parseInt(newAmount);
        if (isNaN(amountInt)) {
          console.log(red('Amount must be an integer.'));
          displayNewAsiChoiceMenu(name, text, amount, prerequisites, rl);
          return;
        }
        console.log(green(`Amount set to ${amountInt}.`));
        displayNewAsiChoiceMenu(name, text, amountInt, prerequisites, rl);
      });
    }),
    option('Prerequisites ' + gray(`(${prerequisites.length})`), () => {
      displayPrerequisitesMenu(
        'Back to new ASI choice menu', () => {
          displayNewAsiChoiceMenu(name, text, amount, prerequisites, rl);
        },
        (newPrerequisites) => {},
        rl
      );
    }),
    option('Back to choices menu', () => {
      displayChoicesMenu(rl);
    })
  )
}