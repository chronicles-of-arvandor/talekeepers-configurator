import * as readline from 'readline';
import { Ability } from '../../models/abilities';
import { menu, option } from '../menu';

export function displayAbilitySelectionMenu(backAction: string, back: () => void, callback: (ability: Ability) => void, rl: readline.Interface) {
  menu(
    'Ability',
    ...Ability.values().map((ability) => option(ability.displayName, () => {
      callback(ability);
    })),
    option(backAction, back)
  ).display(rl);
}