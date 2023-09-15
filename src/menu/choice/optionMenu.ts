import { ChoiceOption } from '../../models/choices';
import * as readline from 'readline';
import { menu, option } from '../menu';
import { gray, red } from 'chalk';
import { displayPrerequisitesMenu } from '../prerequisite/prerequisitesMenu';

export function displayOptionMenu(opt: ChoiceOption, backAction: string, back: () => void, save: (opt: ChoiceOption) => void, del: () => void, rl: readline.Interface) {
  menu(
    'Option',
    option('Text ' + gray(`(${opt.text})`), () => {
      rl.question('Text: ', (text) => {
        opt.text = text;
        save(opt);
        displayOptionMenu(opt, backAction, back, save, del, rl);
      });
    }),
    option('Prerequisites ' + gray(`(${opt.prerequisites.length})`), () => {
      displayPrerequisitesMenu(
        backAction,
        back,
        (prerequisites) => {
          opt.prerequisites = prerequisites;
          save(opt);
        },
        rl,
        opt.prerequisites
      );
    }),
    option(red('Delete'), () => {
      del();
      back();
    }),
    option(backAction, back)
  )
}