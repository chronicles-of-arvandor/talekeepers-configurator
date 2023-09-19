import { Choice, ChoiceOption } from '../../models/choices';
import * as readline from 'readline';
import { menu, option } from '../menu';
import { gray, green } from 'chalk';
import { displayChoiceMenu } from './choiceMenu';
import * as uuid from 'uuid';
import { displayOptionMenu } from './optionMenu';

export function displayChoiceOptionsMenu(choice: Choice, rl: readline.Interface) {
  menu(
    'Options\n' + gray(choice.text),
    option(green('New'), () => {
      const opt = new ChoiceOption(
        uuid.v4(),
        '',
        []
      );
      displayOptionMenu(
        opt,
        'Back to choice options menu',
        () => {
          displayChoiceOptionsMenu(choice, rl);
        },
        (opt) => {
          if (choice.options.indexOf(opt) === -1) {
            choice.options.push(opt);
          }
          choice.save();
          displayChoiceOptionsMenu(choice, rl);
        },
        () => {
          choice.options.slice(choice.options.indexOf(opt), 1);
        },
        rl
      );
    }),
    ...choice.options.map((opt) => option(opt.text, () => {
        displayOptionMenu(
          opt,
          'Back to choice options menu',
          () => {
            displayChoiceOptionsMenu(choice, rl);
          },
          (opt) => {
            if (choice.options.indexOf(opt) === -1) {
              choice.options.push(opt);
            }
            choice.save();
            displayChoiceOptionsMenu(choice, rl);
          },
          () => {
            choice.options.slice(choice.options.indexOf(opt), 1);
          },
          rl
        );
      })
    ),
    option('Back to choice menu', () => {
      displayChoiceMenu(choice, rl);
    })
  ).display(rl);
}