import { Choice, getChoices } from '../../models/choices';
import { menu, option } from '../menu';
import * as readline from 'readline';

export function displayChoiceSelectionMenu(
  backAction: string,
  back: () => void,
  callback: (choice: Choice) => void,
  rl: readline.Interface
) {
  const choices = getChoices();
  menu(
    'Choice',
    ...choices.map((choice) => option(choice.text, () => {
      callback(choice);
    })),
    option(backAction, back)
  ).display(rl);
}