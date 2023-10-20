import { menu, option } from "../menu";
import { gray, green, red } from "chalk";
import * as readline from "readline";
import { Ancestry } from "../../models/ancestries";
import { displaySubAncestriesMenu } from "./subancestry/subAncestriesMenu";
import { displayAncestriesMenu } from "./ancestriesMenu";
import { displayAncestryTraitsMenu } from "./ancestryTraitsMenu";
import { Distance } from "../../models/distance";
import * as fs from "fs";

export function displayAncestryMenu(
  ancestry: Ancestry,
  rl: readline.Interface,
) {
  menu(
    ancestry.name,
    option("Name " + gray(`(${ancestry.name})`), () => {
      setAncestryName(ancestry, rl);
    }),
    option("Name plural " + gray(`(${ancestry.namePlural})`), () => {
      setAncestryNamePlural(ancestry, rl);
    }),
    option(
      "Sub-ancestries " + gray(`(${ancestry.subAncestries.length})`),
      () => {
        displaySubAncestriesMenu(ancestry, rl);
      },
    ),
    option("Dark vision " + gray(`(${ancestry.darkVision.value})`), () => {
      setAncestryDarkVision(ancestry, rl);
    }),
    option("Minimum age " + gray(`(${ancestry.minimumAge})`), () => {
      setAncestryMinimumAge(ancestry, rl);
    }),
    option("Maximum age " + gray(`(${ancestry.maximumAge})`), () => {
      setAncestryMaximumAge(ancestry, rl);
    }),
    option("Minimum height " + gray(`(${ancestry.minimumHeight})`), () => {
      setAncestryMinimumHeight(ancestry, rl);
    }),
    option("Maximum height " + gray(`(${ancestry.maximumHeight})`), () => {
      setAncestryMaximumHeight(ancestry, rl);
    }),
    option("Minimum weight " + gray(`(${ancestry.minimumWeight})`), () => {
      setAncestryMinimumWeight(ancestry, rl);
    }),
    option("Maximum weight " + gray(`(${ancestry.maximumWeight})`), () => {
      setAncestryMaximumWeight(ancestry, rl);
    }),
    option("Traits " + gray(`(${ancestry.traits.length})`), () => {
      displayAncestryTraitsMenu(ancestry, rl);
    }),
    option(
      "Bonus HP per level " + gray(`(${ancestry.bonusHpPerLevel})`),
      () => {
        setAncestryBonusHpPerLevel(ancestry, rl);
      },
    ),
    option("Skull texture", () => {
      setAncestrySkullTexture(ancestry, rl);
    }),
    option(red("Delete"), () => {
      fs.rmSync(ancestry.file);
      console.log(green("Ancestry deleted."));
      displayAncestriesMenu(rl);
    }),
    option("Back to ancestries menu", () => {
      displayAncestriesMenu(rl);
    }),
  ).display(rl);
}

function setAncestryName(ancestry: Ancestry, rl: readline.Interface) {
  rl.question("Name: ", (answer) => {
    ancestry.name = answer;
    ancestry.save();
    console.log(green("Name set."));
    displayAncestryMenu(ancestry, rl);
  });
}

function setAncestryNamePlural(ancestry: Ancestry, rl: readline.Interface) {
  rl.question("Name plural: ", (answer) => {
    ancestry.namePlural = answer;
    ancestry.save();
    console.log(green("Name plural set."));
    displayAncestryMenu(ancestry, rl);
  });
}

function setAncestryDarkVision(ancestry: Ancestry, rl: readline.Interface) {
  rl.question("Dark vision: ", (answer) => {
    const feet = parseFloat(answer);
    if (isNaN(feet)) {
      console.log(red("Distance must be a number."));
      setAncestryDarkVision(ancestry, rl);
      return;
    }
    ancestry.darkVision = new Distance(feet, "FEET");
    ancestry.save();
    console.log(green("Dark vision set."));
    displayAncestryMenu(ancestry, rl);
  });
}

function setAncestryMinimumAge(ancestry: Ancestry, rl: readline.Interface) {
  rl.question("Minimum age: ", (answer) => {
    const minimumAge = parseInt(answer);
    if (isNaN(minimumAge)) {
      console.log(red("Minimum age must be an integer."));
      setAncestryMinimumAge(ancestry, rl);
      return;
    }
    ancestry.minimumAge = minimumAge;
    ancestry.save();
    console.log(green("Minimum age set."));
    displayAncestryMenu(ancestry, rl);
  });
}

function setAncestryMaximumAge(ancestry: Ancestry, rl: readline.Interface) {
  rl.question("Maximum age: ", (answer) => {
    const maximumAge = parseInt(answer);
    if (isNaN(maximumAge)) {
      console.log(red("Maximum age must be an integer."));
      setAncestryMaximumAge(ancestry, rl);
      return;
    }
    ancestry.maximumAge = maximumAge;
    ancestry.save();
    console.log(green("Maximum age set."));
    displayAncestryMenu(ancestry, rl);
  });
}

function setAncestryMinimumHeight(ancestry: Ancestry, rl: readline.Interface) {
  rl.question("Minimum height: ", (answer) => {
    ancestry.minimumHeight = answer;
    ancestry.save();
    console.log(green("Minimum height set."));
    displayAncestryMenu(ancestry, rl);
  });
}

function setAncestryMaximumHeight(ancestry: Ancestry, rl: readline.Interface) {
  rl.question("Maximum height: ", (answer) => {
    ancestry.maximumHeight = answer;
    ancestry.save();
    console.log(green("Maximum height set."));
    displayAncestryMenu(ancestry, rl);
  });
}

function setAncestryMinimumWeight(ancestry: Ancestry, rl: readline.Interface) {
  rl.question("Minimum weight: ", (answer) => {
    ancestry.minimumWeight = answer;
    ancestry.save();
    console.log(green("Minimum weight set."));
    displayAncestryMenu(ancestry, rl);
  });
}

function setAncestryMaximumWeight(ancestry: Ancestry, rl: readline.Interface) {
  rl.question("Maximum weight: ", (answer) => {
    ancestry.maximumWeight = answer;
    ancestry.save();
    console.log(green("Maximum weight set."));
    displayAncestryMenu(ancestry, rl);
  });
}

function setAncestryBonusHpPerLevel(
  ancestry: Ancestry,
  rl: readline.Interface,
) {
  rl.question("Bonus HP per level: ", (answer) => {
    const bonusHpPerLevel = parseFloat(answer);
    if (isNaN(bonusHpPerLevel)) {
      console.log(red("Bonus HP per level must be a number."));
      setAncestryBonusHpPerLevel(ancestry, rl);
      return;
    }
    ancestry.bonusHpPerLevel = bonusHpPerLevel;
    ancestry.save();
    console.log(green("Bonus HP per level set."));
    displayAncestryMenu(ancestry, rl);
  });
}

function setAncestrySkullTexture(ancestry: Ancestry, rl: readline.Interface) {
  rl.question("Skull texture: ", (answer) => {
    ancestry.skullTexture = answer;
    ancestry.save();
    console.log(green("Skull texture set."));
    displayAncestryMenu(ancestry, rl);
  });
}
