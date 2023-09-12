import * as readline from 'readline';
import { Ancestry, AncestryTrait, SubAncestry } from '../../../models/ancestries';
import { menu, option } from '../../menu';
import { gray, green, red } from 'chalk';
import { displaySubAncestryMenu } from './subAncestryMenu';

export function displaySubAncestryTraitsMenu(ancestry: Ancestry, subAncestry: SubAncestry, rl: readline.Interface) {
  menu(
    `${subAncestry.name} ${ancestry.name} traits`,
    option(green('New'), () => {
      const trait = new AncestryTrait('' ,'');
      subAncestry.traits.push(trait);
      ancestry.save();
      console.log(green('Trait created.'));
      displaySubAncestryTraitMenu(ancestry, subAncestry, trait, rl);
    }),
    ...ancestry.traits.map((trait) => option(trait.name, () => {
      displaySubAncestryTraitMenu(ancestry, subAncestry, trait, rl);
    })),
    option(`Back to ${subAncestry.name} ${ancestry.name} menu`, () => {
      displaySubAncestryMenu(ancestry, subAncestry, rl);
    })
  ).display(rl);
}

function displaySubAncestryTraitMenu(ancestry: Ancestry, subAncestry: SubAncestry, trait: AncestryTrait, rl: readline.Interface) {
  menu(
    trait.name,
    option('Name ' + gray(trait.name), () => {
      rl.question('Name: ', (name) => {
        trait.name = name;
        ancestry.save();
        displaySubAncestryTraitMenu(ancestry, subAncestry, trait, rl);
      });
    }),
    option('Description ' + gray(trait.description), () => {
      rl.question('Description: ', (description) => {
        trait.description = description;
        ancestry.save();
        displaySubAncestryTraitMenu(ancestry, subAncestry, trait, rl);
      });
    }),
    option(red('Delete'), () => {
      subAncestry.traits.splice(ancestry.traits.indexOf(trait), 1);
      ancestry.save();
      displaySubAncestryTraitsMenu(ancestry, subAncestry, rl);
    }),
    option(`Back to ${subAncestry.name} ${ancestry.name} traits menu`, () => {
      displaySubAncestryTraitsMenu(ancestry, subAncestry, rl);
    })
  ).display(rl);
}