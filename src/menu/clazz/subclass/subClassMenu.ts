import { ClassFeature, Clazz, SubClass } from "../../../models/classes";
import * as readline from "readline";
import { menu, option } from "../../menu";
import { gray, green, red } from "chalk";
import { displaySubClassesMenu } from "./subClassesMenu";

export function displaySubClassMenu(
  clazz: Clazz,
  subClass: SubClass,
  rl: readline.Interface,
) {
  menu(
    `${subClass.name} ${gray(`(${clazz.name})`)}`,
    option("Name " + gray(`(${subClass.name})`), () => {
      setSubClassName(clazz, subClass, rl);
    }),
    option("Features", () => {
      displaySubClassFeaturesLevelSelectMenu(clazz, subClass, rl);
    }),
    option(red("Delete"), () => {
      clazz.subClasses.splice(clazz.subClasses.indexOf(subClass), 1);
      clazz.save();
      console.log(green("Sub-class deleted."));
      displaySubClassesMenu(clazz, rl);
    }),
    option("Back to sub-classes menu", () => {
      displaySubClassesMenu(clazz, rl);
    }),
  ).display(rl);
}

function setSubClassName(
  clazz: Clazz,
  subClass: SubClass,
  rl: readline.Interface,
) {
  rl.question("Name: ", (name) => {
    subClass.name = name;
    clazz.save();
    console.log("Name set.");
    displaySubClassMenu(clazz, subClass, rl);
  });
}

function displaySubClassFeaturesLevelSelectMenu(
  clazz: Clazz,
  subClass: SubClass,
  rl: readline.Interface,
) {
  menu(
    "Features",
    ...Array.from(Array(20).keys())
      .map((i) => i + 1)
      .map((level) =>
        option(
          `Level ${level} ${gray(
            `(${subClass.features?.[level]?.length ?? 0})`,
          )}`,
          () => {
            displaySubClassFeaturesMenu(clazz, subClass, level, rl);
          },
        ),
      ),
    option("Back to sub-class menu", () => {
      displaySubClassMenu(clazz, subClass, rl);
    }),
  ).display(rl);
}

function displaySubClassFeaturesMenu(
  clazz: Clazz,
  subClass: SubClass,
  level: number,
  rl: readline.Interface,
) {
  menu(
    `Features at level ${level}`,
    option(green("New"), () => {
      const feature = new ClassFeature("", "");
      if (!subClass.features) {
        subClass.features = {};
      }
      if (Object.keys(subClass.features).indexOf(level.toString()) === -1) {
        subClass.features[level] = [];
      }
      subClass.features[level].push(feature);
      clazz.save();
      console.log(green("Feature created."));
      displaySubClassFeatureMenu(clazz, subClass, level, feature, rl);
    }),
    ...(subClass.features?.[level] ?? []).map((feature) =>
      option(feature.name, () => {
        displaySubClassFeatureMenu(clazz, subClass, level, feature, rl);
      }),
    ),
    option("Back to features menu", () => {
      displaySubClassFeaturesLevelSelectMenu(clazz, subClass, rl);
    }),
  ).display(rl);
}

function displaySubClassFeatureMenu(
  clazz: Clazz,
  subClass: SubClass,
  level: number,
  feature: ClassFeature,
  rl: readline.Interface,
) {
  menu(
    feature.name,
    option("Name " + gray(`(${feature.name})`), () => {
      setSubClassFeatureName(clazz, subClass, level, feature, rl);
    }),
    option("Description " + gray(`(${feature.description})`), () => {
      setSubClassFeatureDescription(clazz, subClass, level, feature, rl);
    }),
    option(red("Delete"), () => {
      subClass.features[level] = subClass.features[level].filter(
        (f) => f !== feature,
      );
      clazz.save();
      console.log(green("Feature deleted."));
      displaySubClassFeaturesMenu(clazz, subClass, level, rl);
    }),
    option("Back to features menu", () => {
      displaySubClassFeaturesMenu(clazz, subClass, level, rl);
    }),
  ).display(rl);
}

function setSubClassFeatureName(
  clazz: Clazz,
  subClass: SubClass,
  level: number,
  feature: ClassFeature,
  rl: readline.Interface,
) {
  rl.question("Name: ", (answer) => {
    feature.name = answer;
    clazz.save();
    console.log(green("Name set."));
    displaySubClassFeatureMenu(clazz, subClass, level, feature, rl);
  });
}

function setSubClassFeatureDescription(
  clazz: Clazz,
  subClass: SubClass,
  level: number,
  feature: ClassFeature,
  rl: readline.Interface,
) {
  rl.question("Description (use \\n for newlines): ", (answer) => {
    feature.description = answer.replace(/\\n/g, "\n");
    clazz.save();
    console.log(green("Description set."));
    displaySubClassFeatureMenu(clazz, subClass, level, feature, rl);
  });
}
