import { Background, getBackgrounds, getBackgroundsDirectory } from '../../models/backgrounds';
import { menu, option } from '../menu';
import { green } from 'chalk';
import * as readline from 'readline';
import * as path from 'path';
import * as uuid from 'uuid';
import { displayMainMenu } from '../../index';
import { displayBackgroundMenu } from './backgroundMenu';

export function displayBackgroundsMenu(rl: readline.Interface) {
  const backgrounds = getBackgrounds();
  menu(
    'Backgrounds',
    option(green('New'), () => {
      rl.question('Name: ', (name) => {
        const fileName = name.replace(/[^A-z0-9]/g, '_') + '.yml';
        const file = path.join(getBackgroundsDirectory(), fileName);
        const background = new Background(
          file,
          uuid.v4(),
          name,
          ''
        );
        background.save();
        console.log(green('Background created.'));
        displayBackgroundMenu(background, rl);
      });
    }),
    ...backgrounds.map((background) => option(background.name, () => {
      displayBackgroundMenu(background, rl);
    })),
    option('Back to main menu', () => {
      displayMainMenu(rl);
    })
  ).display(rl);
}