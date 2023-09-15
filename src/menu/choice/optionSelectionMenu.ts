import { Choice, ChoiceOption } from '../../models/choices';
import * as readline from 'readline';
import { menu, option } from '../menu';

export function displayOptionSelectionMenu(
  choice: Choice,
  backAction: string,
  back: () => void,
  save: (option: ChoiceOption) => void,
  rl: readline.Interface
) {
  menu(
    'Option',
    ...choice.options.map((opt) => option(opt.text, () => {
      save(opt);
      back();
    })),
    option(backAction, back)
  ).display(rl);
}