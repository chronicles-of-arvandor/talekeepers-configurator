import * as readline from 'readline';
import { menu, option } from '../menu';
import { getBaseDirectory, setBaseDirectory } from '../../settings';
import * as fs from 'fs';
import { green, red, gray } from 'chalk';
import { displayMainMenu } from '../../index';

export function displaySettingsMenu(rl: readline.Interface) {
  menu(
    'Settings',
    option('Base directory ' + gray(`(${getBaseDirectory()})`), () => {
      displayTalekeepersTomeConfigBaseDirectoryInput(rl);
    }),
    option('Back to main menu', () => {
      displayMainMenu(rl);
    })
  ).display(rl);
}

function displayTalekeepersTomeConfigBaseDirectoryInput(rl: readline.Interface) {
  rl.question('Base directory: ', (answer) => {
    if (fs.existsSync(answer) && fs.lstatSync(answer).isDirectory()) {
      setBaseDirectory(answer);
      console.log(green('Base directory set.'));
    } else {
      console.log(red('Invalid directory.'));
    }
    displaySettingsMenu(rl);
  });
}