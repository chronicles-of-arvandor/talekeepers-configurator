import * as readline from "readline";
import { ClassFeature, Clazz } from "../../models/classes";
import { menu, option } from "../menu";
import { gray, green, red } from "chalk";
import { displayClassesMenu } from "./classesMenu";
import * as fs from "fs";
import { displaySubClassesMenu } from "./subclass/subClassesMenu";

export function displayClassMenu(clazz: Clazz, rl: readline.Interface) {
  menu(
    clazz.name,
    option("Name " + gray(`(${clazz.name})`), () => {
      setClassName(clazz, rl);
    }),
    option("Sub-classes " + gray(`(${clazz.subClasses.length})`), () => {
      displaySubClassesMenu(clazz, rl);
    }),
    option(
      "Sub-class selection level " + gray(`(${clazz.subClassSelectionLevel})`),
      () => {
        setClassSubClassSelectionLevel(clazz, rl);
      },
    ),
    option("Skull texture", () => {
      setClassSkullTexture(clazz, rl);
    }),
    option("Base HP " + gray(`(${clazz.baseHp})`), () => {
      setClassBaseHp(clazz, rl);
    }),
    option("Features", () => {
      displayClassFeaturesLevelSelectMenu(clazz, rl);
    }),
    option(red("Delete"), () => {
      fs.rmSync(clazz.file);
      console.log(green("Class deleted."));
      displayClassesMenu(rl);
    }),
    option("Back to classes menu", () => {
      displayClassesMenu(rl);
    }),
  ).display(rl);
}

function setClassName(clazz: Clazz, rl: readline.Interface) {
  rl.question("Name: ", (name) => {
    clazz.name = name;
    clazz.save();
    console.log(green("Name set."));
    displayClassMenu(clazz, rl);
  });
}

function setClassSubClassSelectionLevel(clazz: Clazz, rl: readline.Interface) {
  rl.question("Sub-class selection level: ", (answer) => {
    const level = parseInt(answer);
    if (isNaN(level)) {
      console.log(red("Level must be a number."));
      setClassSubClassSelectionLevel(clazz, rl);
      return;
    }
    clazz.subClassSelectionLevel = level;
    clazz.save();
    console.log(green("Sub-class selection level set."));
    displayClassMenu(clazz, rl);
  });
}

function setClassSkullTexture(clazz: Clazz, rl: readline.Interface) {
  rl.question("Skull texture: ", (answer) => {
    clazz.skullTexture = answer;
    clazz.save();
    console.log(green("Skull texture set."));
    displayClassMenu(clazz, rl);
  });
}

function setClassBaseHp(clazz: Clazz, rl: readline.Interface) {
  rl.question("Base HP: ", (answer) => {
    const baseHp = parseInt(answer);
    if (isNaN(baseHp)) {
      console.log(red("Base HP must be a number."));
      setClassBaseHp(clazz, rl);
      return;
    }
    clazz.baseHp = baseHp;
    clazz.save();
    console.log(green("Base HP set."));
    displayClassMenu(clazz, rl);
  });
}

function displayClassFeaturesLevelSelectMenu(
  clazz: Clazz,
  rl: readline.Interface,
) {
  menu(
    "Features",
    ...Array.from(Array(20).keys())
      .map((i) => i + 1)
      .map((level) =>
        option(
          `Level ${level} ${gray(`(${clazz.features?.[level]?.length ?? 0})`)}`,
          () => {
            displayClassFeaturesMenu(clazz, level, rl);
          },
        ),
      ),
    option("Back to class menu", () => {
      displayClassMenu(clazz, rl);
    }),
  ).display(rl);
}

function displayClassFeaturesMenu(
  clazz: Clazz,
  level: number,
  rl: readline.Interface,
) {
  menu(
    `Features at level ${level}`,
    option(green("New"), () => {
      const feature = new ClassFeature("", "");
      if (!clazz.features) {
        clazz.features = {};
      }
      if (Object.keys(clazz.features).indexOf(level.toString()) === -1) {
        clazz.features[level] = [];
      }
      clazz.features[level].push(feature);
      clazz.save();
      console.log(green("Feature created."));
      displayClassFeatureMenu(clazz, level, feature, rl);
    }),
    ...(clazz.features?.[level] ?? []).map((feature) =>
      option(feature.name, () => {
        displayClassFeatureMenu(clazz, level, feature, rl);
      }),
    ),
    option("Back to features menu", () => {
      displayClassFeaturesLevelSelectMenu(clazz, rl);
    }),
  ).display(rl);
}

function displayClassFeatureMenu(
  clazz: Clazz,
  level: number,
  feature: ClassFeature,
  rl: readline.Interface,
) {
  menu(
    feature.name,
    option("Name " + gray(`(${feature.name})`), () => {
      setClassFeatureName(clazz, level, feature, rl);
    }),
    option("Description " + gray(`(${feature.description})`), () => {
      setClassFeatureDescription(clazz, level, feature, rl);
    }),
    option(red("Delete"), () => {
      clazz.features[level] = clazz.features[level].filter(
        (f) => f !== feature,
      );
      clazz.save();
      console.log(green("Feature deleted."));
      displayClassFeaturesMenu(clazz, level, rl);
    }),
    option("Back to features menu", () => {
      displayClassFeaturesMenu(clazz, level, rl);
    }),
  ).display(rl);
}

function setClassFeatureName(
  clazz: Clazz,
  level: number,
  feature: ClassFeature,
  rl: readline.Interface,
) {
  rl.question("Name: ", (answer) => {
    feature.name = answer;
    clazz.save();
    console.log(green("Name set."));
    displayClassFeatureMenu(clazz, level, feature, rl);
  });
}

function setClassFeatureDescription(
  clazz: Clazz,
  level: number,
  feature: ClassFeature,
  rl: readline.Interface,
) {
  rl.question("Description (use \\n for newlines): ", (answer) => {
    feature.description = answer.replace(/\\n/g, "\n");
    clazz.save();
    console.log(green("Description set."));
    displayClassFeatureMenu(clazz, level, feature, rl);
  });
}
