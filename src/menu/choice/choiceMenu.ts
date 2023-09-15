import { displayChoicesMenu } from './choicesMenu';
import { menu, option } from '../menu';
import { Choice } from '../../models/choices';
import * as readline from 'readline';
import { gray, red } from 'chalk';
import { displayPrerequisitesMenu } from '../prerequisite/prerequisitesMenu';
import { displayChoiceOptionsMenu } from './choiceOptionsMenu';
import * as fs from 'fs';

export function displayChoiceMenu(choice: Choice, rl: readline.Interface) {
  menu(
    choice.text,
    option('Text ' + gray(`(${choice.text})`), () => {
      setText(choice, rl);
    }),
    option('Prerequisites ' + gray(`(${choice.prerequisites.length})`), () => {
      displayPrerequisitesMenu(
        'Back to choice menu',
        () => {
          displayChoiceMenu(choice, rl);
        },
        (prerequisites) => {
          choice.prerequisites = prerequisites;
          choice.save();
        },
        rl,
        choice.prerequisites
      );
    }),
    option('Options ' + gray(`(${choice.options.length})`), () => {
      displayChoiceOptionsMenu(choice, rl);
    }),
    option(red('Delete'), () => {
      fs.rmSync(choice.file);
      displayChoicesMenu(rl);
    }),
    option('Back to choices menu', () => {
      displayChoicesMenu(rl);
    })
  ).display(rl);
}

function setText(choice: Choice, rl: readline.Interface) {
  rl.question('Text: ', (text) => {
    choice.text = text;
    choice.save();
    displayChoiceMenu(choice, rl);
  });
}