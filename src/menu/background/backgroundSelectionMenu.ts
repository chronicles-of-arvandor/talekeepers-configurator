import * as readline from 'readline';
import { Background, getBackgrounds } from '../../models/backgrounds';
import { menu, option } from '../menu';

export function displayBackgroundSelectionMenu(backAction: string, back: () => void, save: (background: Background) => void, rl: readline.Interface) {
  const backgrounds = getBackgrounds();
  menu(
    'Background',
    ...backgrounds.map((background) => option(background.name, () => {
      save(background);
      back();
    })),
    option(backAction, back)
  ).display(rl);
}