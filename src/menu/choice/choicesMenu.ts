import * as readline from 'readline';
import { menu, option } from '../menu';
import { green } from 'chalk';
import { Choice, getChoices, getChoicesDirectory } from '../../models/choices';
import { displayMainMenu } from '../../index';
import { displayChoiceMenu } from './choiceMenu';
import * as path from 'path';
import * as uuid from 'uuid';

export function displayChoicesMenu(rl: readline.Interface) {
  const choices = getChoices();
  menu(
    'Choices',
    option(green('New'), () => {
      displayNewChoiceMenu(rl);
    }),
    ...choices.map((choice) => option(choice.text, () => {
      displayChoiceMenu(choice, rl);
    })),
    option('Back to main menu', () => {
      displayMainMenu(rl);
    })
  ).display(rl);
}

function displayNewChoiceMenu(rl: readline.Interface) {
  menu(
    'New choice',
    option('Spell choice(s)', () => {
      displayNewSpellChoiceMenu(rl);
    }),
    option('Feat choice(s)', () => {
      displayNewFeatChoiceMenu(rl);
    }),
    option('ASI choice(s)', () => {
      displayNewAsiChoiceMenu(rl);
    }),
    option('Skill proficiency choice(s)', () => {
      displayNewSkillProficiencyChoiceMenu(rl);
    }),
    option('Item proficiency choice(s)', () => {
      displayNewItemProficiencyChoiceMenu(rl);
    }),
    option('Other choice', () => {
      rl.question('File name: ', (fileName) => {
        const choicePath = path.join(getChoicesDirectory(), `${fileName}.yml`)
        const choice = new Choice(
          choicePath,
          uuid.v4(),
          '',
          [],
          [],
        )
        displayChoiceMenu(choice, rl);
      });
    })
  ).display(rl);
}