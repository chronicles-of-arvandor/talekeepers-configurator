import * as readline from 'readline';
import { menu, option } from './menu/menu';
import { displaySettingsMenu } from './menu/settings/settingsMenu';
import { displayAncestriesMenu } from './menu/ancestry/ancestriesMenu';
import { displayBackgroundsMenu } from './menu/background/backgroundsMenu';

export function displayMainMenu(rl: readline.Interface) {
  menu(
    'Main menu',
    option('Ancestries', () => {
      displayAncestriesMenu(rl);
    }),
    option('Backgrounds', () => {
      displayBackgroundsMenu(rl);
    }),
    // option('Choices', () => {
    //   displayChoicesMenu(rl);
    // }),
    // option('Classes', () => {
    //   displayClassesMenu(rl);
    // }),
    // option('Effects', () => {
    //   displayEffectsMenu(rl);
    // }),
    // option('Feats', () => {
    //   displayFeatsMenu(rl);
    // }),
    // option('Languages', () => {
    //   displayLanguagesMenu(rl);
    // }),
    // option('Spells', () => {
    //   displaySpellsMenu(rl);
    // }),
    option('Settings', () => {
      displaySettingsMenu(rl);
    }),
    option('Exit', () => {
      rl.close();
    })
  ).display(rl);
}

const rl = readline.createInterface(process.stdin, process.stdout);
rl.on('close', () => {
  process.exit();
});

displayMainMenu(rl);