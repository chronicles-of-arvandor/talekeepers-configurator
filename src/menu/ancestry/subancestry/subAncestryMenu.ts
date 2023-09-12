import { menu, option } from '../../menu';
import { gray, green, red } from 'chalk';
import * as readline from 'readline';
import { Ancestry, SubAncestry } from '../../../models/ancestries';
import { displaySubAncestriesMenu } from './subAncestriesMenu';
import { displaySubAncestryTraitsMenu } from './subAncestryTraitsMenu';
import { Distance } from '../../../models/distance';

export function displaySubAncestryMenu(ancestry: Ancestry, subAncestry: SubAncestry, rl: readline.Interface) {
  menu(
    `${subAncestry.name} ${ancestry.name}`,
    option('Name ' + gray(`(${subAncestry.name})`), () => {
      setSubAncestryName(ancestry, subAncestry, rl);
    }),
    option('Dark vision ' + gray(`(${subAncestry.darkVision?.value ?? 'unset'})`), () => {
      setSubAncestryDarkVision(ancestry, subAncestry, rl);
    }),
    option('Minimum age ' + gray(`(${subAncestry.minimumAge})`), () => {
      setSubAncestryMinimumAge(ancestry, subAncestry, rl);
    }),
    option('Maximum age ' + gray(`(${subAncestry.maximumAge})`), () => {
      setSubAncestryMaximumAge(ancestry, subAncestry, rl);
    }),
    option('Minimum height ' + gray(`(${subAncestry.minimumHeight})`), () => {
      setSubAncestryMinimumHeight(ancestry, subAncestry, rl);
    }),
    option('Maximum height ' + gray(`(${subAncestry.maximumHeight})`), () => {
      setSubAncestryMaximumHeight(ancestry, subAncestry, rl);
    }),
    option('Minimum weight ' + gray(`(${subAncestry.minimumWeight})`), () => {
      setSubAncestryMinimumWeight(ancestry, subAncestry, rl);
    }),
    option('Maximum weight ' + gray(`(${subAncestry.maximumWeight})`), () => {
      setSubAncestryMaximumWeight(ancestry, subAncestry, rl);
    }),
    option('Traits ' + gray(`(${subAncestry.traits.length})`), () => {
      displaySubAncestryTraitsMenu(ancestry, subAncestry, rl);
    }),
    option('Bonus HP per level ' + gray(`(${subAncestry.bonusHpPerLevel ?? 'unset'})`), () => {
      setSubAncestryBonusHpPerLevel(ancestry, subAncestry, rl);
    }),
    option('Skull texture', () => {
      setSubAncestrySkullTexture(ancestry, subAncestry, rl);
    }),
    option(red('Delete'), () => {
      ancestry.subAncestries.splice(ancestry.subAncestries.indexOf(subAncestry), 1);
      ancestry.save();
      console.log(green('Sub-ancestry deleted.'));
      displaySubAncestriesMenu(ancestry, rl);
    }),
    option(`Back to ${ancestry.name} sub-ancestries menu`, () => {
      displaySubAncestriesMenu(ancestry, rl);
    })
  ).display(rl);
}

function setSubAncestryName(ancestry: Ancestry, subAncestry: SubAncestry, rl: readline.Interface) {
  rl.question('Name: ', (answer) => {
    subAncestry.name = answer;
    ancestry.save();
    console.log(green('Name set.'));
    displaySubAncestryMenu(ancestry, subAncestry, rl);
  });
}

function setSubAncestryDarkVision(ancestry: Ancestry, subAncestry: SubAncestry, rl: readline.Interface) {
  rl.question('Dark vision: ', (answer) => {
    const feet = parseFloat(answer);
    if (isNaN(feet)) {
      console.log(red('Distance must be a number.'));
      setSubAncestryDarkVision(ancestry, subAncestry, rl);
      return;
    }
    subAncestry.darkVision = new Distance(feet, 'FEET');
    ancestry.save();
    console.log(green('Dark vision set.'));
    displaySubAncestryMenu(ancestry, subAncestry, rl);
  });
}

function setSubAncestryMinimumAge(ancestry: Ancestry, subAncestry: SubAncestry, rl: readline.Interface) {
  rl.question('Minimum age: ', (answer) => {
    const minimumAge = parseInt(answer);
    if (isNaN(minimumAge)) {
      console.log(red('Minimum age must be an integer.'));
      setSubAncestryMinimumAge(ancestry, subAncestry, rl);
      return;
    }
    subAncestry.minimumAge = minimumAge;
    ancestry.save();
    console.log(green('Minimum age set.'));
    displaySubAncestryMenu(ancestry, subAncestry, rl);
  });
}

function setSubAncestryMaximumAge(ancestry: Ancestry, subAncestry: SubAncestry, rl: readline.Interface) {
  rl.question('Maximum age: ', (answer) => {
    const maximumAge = parseInt(answer);
    if (isNaN(maximumAge)) {
      console.log(red('Maximum age must be an integer.'));
      setSubAncestryMaximumAge(ancestry, subAncestry, rl);
      return;
    }
    subAncestry.maximumAge = maximumAge;
    ancestry.save();
    console.log(green('Maximum age set.'));
    displaySubAncestryMenu(ancestry, subAncestry, rl);
  });
}

function setSubAncestryMinimumHeight(ancestry: Ancestry, subAncestry: SubAncestry, rl: readline.Interface) {
  rl.question('Minimum height: ', (answer) => {
    subAncestry.minimumHeight = answer;
    ancestry.save();
    console.log(green('Minimum height set.'));
    displaySubAncestryMenu(ancestry, subAncestry, rl);
  });
}

function setSubAncestryMaximumHeight(ancestry: Ancestry, subAncestry: SubAncestry, rl: readline.Interface) {
  rl.question('Maximum height: ', (answer) => {
    subAncestry.maximumHeight = answer;
    ancestry.save();
    console.log(green('Maximum height set.'));
    displaySubAncestryMenu(ancestry, subAncestry, rl);
  });
}

function setSubAncestryMinimumWeight(ancestry: Ancestry, subAncestry: SubAncestry, rl: readline.Interface) {
  rl.question('Minimum weight: ', (answer) => {
    subAncestry.minimumWeight = answer;
    ancestry.save();
    console.log(green('Minimum weight set.'));
    displaySubAncestryMenu(ancestry, subAncestry, rl);
  });
}

function setSubAncestryMaximumWeight(ancestry: Ancestry, subAncestry: SubAncestry, rl: readline.Interface) {
  rl.question('Maximum weight: ', (answer) => {
    subAncestry.maximumWeight = answer;
    ancestry.save();
    console.log(green('Maximum weight set.'));
    displaySubAncestryMenu(ancestry, subAncestry, rl);
  });
}

function setSubAncestryBonusHpPerLevel(ancestry: Ancestry, subAncestry: SubAncestry, rl: readline.Interface) {
  rl.question('Bonus HP per level: ', (answer) => {
    const bonusHpPerLevel = parseFloat(answer);
    if (isNaN(bonusHpPerLevel)) {
      console.log(red('Bonus HP per level must be a number.'));
      setSubAncestryBonusHpPerLevel(ancestry, subAncestry, rl);
      return;
    }
    subAncestry.bonusHpPerLevel = bonusHpPerLevel;
    ancestry.save();
    console.log(green('Bonus HP per level set.'));
    displaySubAncestryMenu(ancestry, subAncestry, rl);
  });
}

function setSubAncestrySkullTexture(ancestry: Ancestry, subAncestry: SubAncestry, rl: readline.Interface) {
  rl.question('Skull texture: ', (answer) => {
    subAncestry.skullTexture = answer;
    ancestry.save();
    console.log(green('Skull texture set.'));
    displaySubAncestryMenu(ancestry, subAncestry, rl);
  });
}