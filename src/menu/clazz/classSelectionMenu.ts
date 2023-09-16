import * as readline from 'readline';
import { Clazz, getClasses } from '../../models/classes';
import { menu, option } from '../menu';

export function displayClazzSelectionMenu(backAction: string, back: () => void, callback: (clazz: Clazz) => void, rl: readline.Interface) {
  const clazzs = getClasses();
  menu(
    'Clazz',
    ...clazzs.map((clazz) => option(clazz.name, () => {
      callback(clazz);
    })),
    option(backAction, back)
  ).display(rl);
}