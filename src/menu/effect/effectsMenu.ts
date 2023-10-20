import * as readline from 'readline';
import {
  AbilityEffect,
  CharacterTraitEffect,
  FeatEffect,
  getEffects,
  getEffectsDirectory, InitiativeAbilityModBonusEffect, InitiativeBonusEffect,
  ItemProficiencyEffect, LanguageEffect, SavingThrowProficiencyEffect, SkillProficiencyEffect, SpeedEffect, SpellEffect
} from '../../models/effects';
import { menu, option } from '../menu';
import { green } from 'chalk';
import { displayMainMenu } from '../../index';
import path from 'path';
import { displayEffectMenu } from './effectMenu';
import { Ability } from '../../models/abilities';

export function displayEffectsMenu(rl: readline.Interface) {
  const effects = getEffects();
  menu(
    'Effects',
    option(green('New'), () => {
      displayNewEffectMenu(rl);
    }),
    ...effects.map((effect) => option(path.basename(effect.file), () => {
      displayEffectMenu(effect, rl);
    })),
    option('Back to main menu', () => {
      displayMainMenu(rl);
    })
  ).display(rl);
}

function displayNewEffectMenu(rl: readline.Interface) {
  menu(
    'New Effect',
    option('Ability effect', () => {
      rl.question('New file name: ', (fileName) => {
        const effectPath = path.join(getEffectsDirectory(), `${fileName}.yml`);
        const effect = new AbilityEffect(
          effectPath,
          {},
          []
        );
        displayEffectMenu(effect, rl);
      });
    }),
    option('Character trait effect', () => {
      rl.question('New file name: ', (fileName) => {
        const effectPath = path.join(getEffectsDirectory(), `${fileName}.yml`);
        const effect = new CharacterTraitEffect(
          effectPath,
          [],
          []
        );
        displayEffectMenu(effect, rl);
      })
    }),
    option('Feat effect', () => {
      rl.question('New file name: ', (fileName) => {
        const effectPath = path.join(getEffectsDirectory(), `${fileName}.yml`);
        const effect = new FeatEffect(
          effectPath,
          [],
          []
        );
        displayEffectMenu(effect, rl);
      });
    }),
    option('Initiative ability modifier bonus effect', () => {
      rl.question('New file name: ', (fileName) => {
        const effectPath = path.join(getEffectsDirectory(), `${fileName}.yml`);
        const effect = new InitiativeAbilityModBonusEffect(
          effectPath,
          Ability.STRENGTH,
          []
        );
        displayEffectMenu(effect, rl);
      });
    }),
    option('Initiative bonus effect', () => {
      rl.question('New file name: ', (fileName) => {
        const effectPath = path.join(getEffectsDirectory(), `${fileName}.yml`);
        const effect = new InitiativeBonusEffect(
          effectPath,
          0,
          []
        );
        displayEffectMenu(effect, rl);
      })
    }),
    option('Item proficiency effect', () => {
      rl.question('New file name: ', (fileName) => {
        const effectPath = path.join(getEffectsDirectory(), `${fileName}.yml`);
        const effect = new ItemProficiencyEffect(
          effectPath,
          [],
          []
        );
        displayEffectMenu(effect, rl);
      });
    }),
    option('Language effect', () => {
      rl.question('New file name: ', (fileName) => {
        const effectPath = path.join(getEffectsDirectory(), `${fileName}.yml`);
        const effect = new LanguageEffect(
          effectPath,
          [],
          []
        );
        displayEffectMenu(effect, rl);
      });
    }),
    option('Saving throw proficiency effect', () => {
      rl.question('New file name: ', (fileName) => {
        const effectPath = path.join(getEffectsDirectory(), `${fileName}.yml`);
        const effect = new SavingThrowProficiencyEffect(
          effectPath,
          [],
          []
        );
        displayEffectMenu(effect, rl);
      });
    }),
    option('Skill proficiency effect', () => {
      rl.question('New file name: ', (fileName) => {
        const effectPath = path.join(getEffectsDirectory(), `${fileName}.yml`);
        const effect = new SkillProficiencyEffect(
          effectPath,
          [],
          []
        );
        displayEffectMenu(effect, rl);
      });
    }),
    option('Speed effect', () => {
      rl.question('New file name: ', (fileName) => {
        const effectPath = path.join(getEffectsDirectory(), `${fileName}.yml`);
        const effect = new SpeedEffect(
          effectPath,
          0,
          []
        );
        displayEffectMenu(effect, rl);
      });
    }),
    option('Spell effect', () => {
      rl.question('New file name: ', (fileName) => {
        const effectPath = path.join(getEffectsDirectory(), `${fileName}.yml`);
        const effect = new SpellEffect(
          effectPath,
          [],
          []
        );
        displayEffectMenu(effect, rl);
      });
    }),
    option('Back to effects menu', () => {
      displayEffectsMenu(rl);
    })
  ).display(rl);
}