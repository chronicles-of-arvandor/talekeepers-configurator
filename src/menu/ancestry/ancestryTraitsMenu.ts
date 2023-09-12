import * as readline from 'readline';
import { Ancestry, AncestryTrait } from '../../models/ancestries';
import { menu, option } from '../menu';
import { displayAncestryMenu } from './ancestryMenu';
import { gray, green, red } from 'chalk';

export function displayAncestryTraitsMenu(ancestry: Ancestry, rl: readline.Interface) {
  menu(
    `${ancestry.name} traits`,
    option(green('New'), () => {
      const trait = new AncestryTrait('' ,'');
      ancestry.traits.push(trait);
      ancestry.save();
      console.log(green('Trait created.'));
      displayAncestryTraitMenu(ancestry, trait, rl);
    }),
    ...ancestry.traits.map((trait) => option(trait.name, () => {
      displayAncestryTraitMenu(ancestry, trait, rl);
    })),
    option(`Back to ${ancestry.name} menu`, () => {
      displayAncestryMenu(ancestry, rl);
    })
  ).display(rl);
}

function displayAncestryTraitMenu(ancestry: Ancestry, trait: AncestryTrait, rl: readline.Interface) {
  menu(
    trait.name,
    option('Name ' + gray(trait.name), () => {
      rl.question('Name: ', (name) => {
        trait.name = name;
        ancestry.save();
        displayAncestryTraitMenu(ancestry, trait, rl);
      });
    }),
    option('Description ' + gray(trait.description), () => {
      rl.question('Description: ', (description) => {
        trait.description = description;
        ancestry.save();
        displayAncestryTraitMenu(ancestry, trait, rl);
      });
    }),
    option(red('Delete'), () => {
      ancestry.traits.splice(ancestry.traits.indexOf(trait), 1);
      ancestry.save();
      displayAncestryTraitsMenu(ancestry, rl);
    }),
    option(`Back to ${ancestry.name} traits menu`, () => {
      displayAncestryTraitsMenu(ancestry, rl);
    })
  ).display(rl);
}