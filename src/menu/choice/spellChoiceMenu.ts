import * as readline from 'readline';
import { menu, option } from '../menu';
import { getSpellById, getSpellByName, getSpells, getSpellsDirectory, Spell } from '../../models/spells';
import { gray, green, red } from 'chalk';
import { displayChoicesMenu } from './choicesMenu';
import {
  bard,
  cleric,
  druid,
  monk,
  paladin,
  ranger,
  sorcerer,
  SpellList,
  warlock,
  wizard
} from '../../models/spellLists';
import { Choice, ChoiceOption, getChoicesDirectory } from '../../models/choices';
import path from 'path';
import * as uuid from 'uuid';
import {
  ChoicePrerequisite,
  NotPrerequisite,
  OrPrerequisite,
  Prerequisite,
  SpellPrerequisite
} from '../../models/prerequisites';
import { displayPrerequisitesMenu } from '../prerequisite/prerequisitesMenu';
import { getEffects, getEffectsDirectory, SpellEffect } from '../../models/effects';

export function displayNewSpellChoiceMenu(name: string, text: string, amount: number, prerequisites: Prerequisite[], spells: Spell[], rl: readline.Interface) {
  menu(
    'New spell choice\n' + gray(`${spells.length} spells selected`),
    option('Name ' + gray(`(${name})`), () => {
      rl.question('Name: ', (newName) => {
        displayNewSpellChoiceMenu(newName, text, amount, prerequisites, spells, rl);
      });
    }),
    option('Text ' + gray(`(${text})`), () => {
      rl.question('Text: ', (newText) => {
        displayNewSpellChoiceMenu(name, newText, amount, prerequisites, spells, rl);
      });
    }),
    option('Amount ' + gray(`(${amount})`), () => {
      rl.question('Amount: ', (newAmount) => {
        const amountInt = parseInt(newAmount);
        if (isNaN(amountInt)) {
          console.log(red('Invalid amount.'));
          displayNewSpellChoiceMenu(name, text, amount, prerequisites, spells, rl);
          return;
        }
        displayNewSpellChoiceMenu(name, text, amountInt, prerequisites, spells, rl);
      });
    }),
    option('Prerequisites ' + gray(`(${prerequisites.length})`), () => {
      displayPrerequisitesMenu(
        'Back to new spell choice menu',
        () => {
          displayNewSpellChoiceMenu(name, text, amount, prerequisites, spells, rl);
        },
        (newPrerequisites) => {},
        rl
      );
    }),
    option('Add spell list', () => {
      displaySpellListClassMenu(name, text, amount, prerequisites, spells, rl);
    }),
    option('Add spell', () => {
      rl.question('Spell name: ', (spellName) => {
        const spell = getSpellByName(spellName);
        if (!spell) {
          console.log(red('There is no spell by that name.'));
          displayNewSpellChoiceMenu(name, text, amount, prerequisites, spells, rl);
        } else {
          displayNewSpellChoiceMenu(name, text, amount, prerequisites,[...spells, spell], rl);
        }
      });
    }),
    option('Remove spell', () => {
      rl.question('Spell name: ', (spellName) => {
        const spell = getSpellByName(spellName);
        if (!spell) {
          console.log(red('There is no spell by that name.'));
          displayNewSpellChoiceMenu(name, text, amount, prerequisites, spells, rl);
        } else {
          displayNewSpellChoiceMenu(name, text, amount, prerequisites, spells.filter((s) => s.id !== spell.id), rl);
        }
      });
    }),
    option(green('Save'), () => {
      createSpellChoices(name, text, amount, prerequisites, spells);
      console.log(green('Spell choices saved.'));
      displayChoicesMenu(rl);
    }),
    option(red('Cancel'), () => {
      displayChoicesMenu(rl);
    })
  ).display(rl);
}

function displaySpellListClassMenu(name: string, text: string, amount: number, prerequisites: Prerequisite[], spells: Spell[], rl: readline.Interface) {
  menu(
    'Spell list: Class',
    option('Bard', () => {
      displaySpellListLevelMenu(name, text, amount, prerequisites, spells, bard, rl);
    }),
    option('Cleric', () => {
      displaySpellListLevelMenu(name, text, amount, prerequisites, spells, cleric, rl);
    }),
    option('Druid', () => {
      displaySpellListLevelMenu(name, text, amount, prerequisites, spells, druid, rl);
    }),
    option('Monk', () => {
      displaySpellListLevelMenu(name, text, amount, prerequisites, spells, monk, rl);
    }),
    option('Paladin', () => {
      displaySpellListLevelMenu(name, text, amount, prerequisites, spells, paladin, rl);
    }),
    option('Ranger', () => {
      displaySpellListLevelMenu(name, text, amount, prerequisites, spells, ranger, rl);
    }),
    option('Sorcerer', () => {
      displaySpellListLevelMenu(name, text, amount, prerequisites, spells, sorcerer, rl);
    }),
    option('Warlock', () => {
      displaySpellListLevelMenu(name, text, amount, prerequisites, spells, warlock, rl);
    }),
    option('Wizard', () => {
      displaySpellListLevelMenu(name, text, amount, prerequisites, spells, wizard, rl);
    })
  ).display(rl);
}

function displaySpellListLevelMenu(name: string, text: string, amount: number, prerequisites: Prerequisite[], spells: Spell[], spellList: SpellList, rl: readline.Interface) {
  menu(
    'Spell list: Level',
    option('1st', () => {
      addSpellList(name, text, amount, prerequisites, spells, spellList['1'], rl);
    }),
    option('2nd (and below)', () => {
      addSpellList(name, text, amount, prerequisites, spells, [...spellList['2'], ...spellList['1']], rl);
    }),
    option('3rd (and below)', () => {
      addSpellList(name, text, amount, prerequisites, spells, [...spellList['3'], ...spellList['2'], ...spellList['1']], rl);
    }),
    option('4th (and below)', () => {
      addSpellList(name, text, amount, prerequisites, spells, [...spellList['4'], ...spellList['3'], ...spellList['2'], ...spellList['1']], rl);
    }),
    option('5th (and below)', () => {
      addSpellList(name, text, amount, prerequisites, spells, [...spellList['5'], ...spellList['4'], ...spellList['3'], ...spellList['2'], ...spellList['1']], rl);
    }),
    option('6th (and below)', () => {
      addSpellList(name, text, amount, prerequisites, spells, [...spellList['6'], ...spellList['5'], ...spellList['4'], ...spellList['3'], ...spellList['2'], ...spellList['1']], rl);
    }),
    option('7th (and below)', () => {
      addSpellList(name, text, amount, prerequisites, spells, [...spellList['7'], ...spellList['6'], ...spellList['5'], ...spellList['4'], ...spellList['3'], ...spellList['2'], ...spellList['1']], rl);
    }),
    option('8th (and below)', () => {
      addSpellList(name, text, amount, prerequisites, spells, [...spellList['8'], ...spellList['7'], ...spellList['6'], ...spellList['5'], ...spellList['4'], ...spellList['3'], ...spellList['2'], ...spellList['1']], rl);
    }),
    option('9th (and below)', () => {
      addSpellList(name, text, amount, prerequisites, spells, [...spellList['9'], ...spellList['8'], ...spellList['7'], ...spellList['6'], ...spellList['5'], ...spellList['4'], ...spellList['3'], ...spellList['2'], ...spellList['1']], rl);
    }),
    option('Cantrips', () => {
      addSpellList(name, text, amount, prerequisites, spells, [...spellList['cantrip']], rl);
    }),
    option('Back to class select', () => {
      displaySpellListClassMenu(name, text, amount, prerequisites, spells, rl);
    })
  ).display(rl);
}

function addSpellList(name: string, text: string, amount: number, prerequisites: Prerequisite[], spells: Spell[], spellNames: string[], rl: readline.Interface) {
  const allSpells = getSpells();
  const selectedSpells = allSpells.filter((spell) => spellNames.includes(spell.name));
  const invalidSpells = spellNames
    .filter((spellName) => !allSpells.some((spell) => spell.name === spellName));
  if (invalidSpells.length > 0) {
    console.log(red(`Found ${invalidSpells.length} unmatched spells: ${invalidSpells.join(', ')}`));
  }
  console.log(green(`Added ${selectedSpells.length} spells.`));
  displayNewSpellChoiceMenu(name, text, amount, prerequisites, [...spells, ...selectedSpells], rl);
}

function createSpellChoices(name: string, text: string, amount: number, prerequisites: Prerequisite[], spells: Spell[]) {
  for (let i = 1; i <= amount; i++) {
    createSpellChoice(`${name}_${i}`, `${text} (${i})`, prerequisites, spells);
  }
}

function createSpellChoice(name: string, text: string, prerequisites: Prerequisite[], spells: Spell[]) {
  const choice = new Choice(
    path.join(getChoicesDirectory(), `${name}.yml`),
    uuid.v4(),
    text,
    prerequisites,
    spells.map((spell) => {
      return new ChoiceOption(
        uuid.v4(),
        spell.name,
        [
          new NotPrerequisite(
            new SpellPrerequisite(
              [
                spell.id
              ]
            )
          )
        ]
      );
    })
  );
  choice.save();
  updateEffects(choice);
}

function updateEffects(choice: Choice) {
  const allEffects = getEffects();
  choice.options.forEach((opt) => {
    const optionSpellNotPrerequisite = opt.prerequisites
      .filter((prerequisite): prerequisite is NotPrerequisite => NotPrerequisite.prototype.isPrototypeOf(prerequisite))
      .find((prerequisite) => SpellPrerequisite.prototype.isPrototypeOf(prerequisite.prerequisite));
    if (!optionSpellNotPrerequisite) {
      console.log(red(`Could not find spell prerequisite for option ${opt.text}`));
      return;
    }
    const optionSpellPrerequisite = optionSpellNotPrerequisite.prerequisite as SpellPrerequisite;
    const spell = getSpellById(optionSpellPrerequisite.spellIds[0]);
    if (!spell) {
      console.log(red(`Could not find spell for option ${opt.text}`));
      return;
    }
    const effectFile = path.join(getEffectsDirectory(), `spell_${spell.name.toLowerCase().replace(/[^a-zA-Z0-9._-]/g, '_')}.yml`);
    let effect = allEffects.find((effect) => effect.file === effectFile);
    if (!effect) {
      effect = new SpellEffect(
        effectFile,
        [spell.id],
        [new OrPrerequisite(
          [
            new ChoicePrerequisite(
              choice.id,
              opt.id
            )
          ]
        )]
      )
    } else {
      const orPrerequisite = effect.prerequisites.find((prerequisite): prerequisite is OrPrerequisite => OrPrerequisite.prototype.isPrototypeOf(prerequisite));
      if (orPrerequisite) {
        orPrerequisite.prerequisites.push(
          new ChoicePrerequisite(
            choice.id,
            opt.id
          )
        );
      } else {
        effect.prerequisites.push(
          new OrPrerequisite(
            [
              new ChoicePrerequisite(
                choice.id,
                opt.id
              )
            ]
          )
        );
      }
    }
    effect.save();
  })
}