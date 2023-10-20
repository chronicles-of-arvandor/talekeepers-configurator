import * as readline from "readline";
import { menu, option } from "../menu";
import {
  AbilityPrerequisite,
  AncestryPrerequisite,
  AndPrerequisite,
  BackgroundPrerequisite,
  ChoicePrerequisite,
  ClassPrerequisite,
  FeatPrerequisite,
  ItemProficiencyPrerequisite,
  LanguagePrerequisite,
  LevelPrerequisite,
  NotPrerequisite,
  OrPrerequisite,
  Prerequisite,
  SavingThrowProficiencyPrerequisite,
  SkillProficiencyPrerequisite,
  SpellPrerequisite,
  SubAncestryPrerequisite,
  SubClassPrerequisite,
} from "../../models/prerequisites";
import { Ability } from "../../models/abilities";
import { getAncestries } from "../../models/ancestries";
import { getBackgrounds } from "../../models/backgrounds";
import { getChoices } from "../../models/choices";
import { getClasses } from "../../models/classes";
import { green, red } from "chalk";
import { getFeats } from "../../models/feats";
import { getLanguages } from "../../models/languages";
import { displayPrerequisiteMenu } from "./prerequisiteMenu";

export function displayPrerequisitesMenu(
  backAction: string,
  back: () => void,
  callback: (prerequisites: Prerequisite[]) => void,
  rl: readline.Interface,
  prerequisites: Prerequisite[] = [],
) {
  menu(
    "Prerequisites",
    option(green("New"), () => {
      displayNewPrerequisiteMenu(
        "Back to prerequisites menu",
        () => {
          displayPrerequisitesMenu(
            backAction,
            back,
            callback,
            rl,
            prerequisites,
          );
        },
        (prerequisite) => {
          if (prerequisites.indexOf(prerequisite) === -1) {
            prerequisites.push(prerequisite);
          }
          displayPrerequisitesMenu(
            backAction,
            back,
            callback,
            rl,
            prerequisites,
          );
        },
        rl,
      );
    }),
    ...prerequisites.map((prerequisite) =>
      option(prerequisite.getName(), () => {
        displayPrerequisiteMenu(
          prerequisite,
          (prerequisite) => {
            if (prerequisites.indexOf(prerequisite) === -1) {
              prerequisites.push(prerequisite);
            }
            displayPrerequisitesMenu(
              backAction,
              back,
              callback,
              rl,
              prerequisites,
            );
          },
          () => {
            const index = prerequisites.indexOf(prerequisite);
            if (index !== -1) {
              prerequisites.splice(index, 1);
            }
            displayPrerequisitesMenu(
              backAction,
              back,
              callback,
              rl,
              prerequisites,
            );
          },
          rl,
        );
      }),
    ),
    option(green("Save"), () => {
      callback(prerequisites);
    }),
    option(backAction, back),
  ).display(rl);
}

export function displayNewPrerequisiteMenu(
  backAction: string,
  back: () => void,
  callback: (prerequisite: Prerequisite) => void,
  rl: readline.Interface,
) {
  menu(
    "Prerequisite type",
    option("AND", () => {
      const andPrerequisite = new AndPrerequisite([]);
      displayPrerequisiteMenu(
        andPrerequisite,
        callback,
        () => displayNewPrerequisiteMenu(backAction, back, callback, rl),
        rl,
      );
    }),
    option("OR", () => {
      const orPrerequisite = new OrPrerequisite([]);
      displayPrerequisiteMenu(
        orPrerequisite,
        callback,
        () => displayNewPrerequisiteMenu(backAction, back, callback, rl),
        rl,
      );
    }),
    option("NOT", () => {
      const notPrerequisite = new NotPrerequisite(new AndPrerequisite([]));
      displayPrerequisiteMenu(
        notPrerequisite,
        callback,
        () => displayNewPrerequisiteMenu(backAction, back, callback, rl),
        rl,
      );
    }),
    option("Ability score", () => {
      const abilityPrerequisite = new AbilityPrerequisite(Ability.STRENGTH, 10);
      displayPrerequisiteMenu(
        abilityPrerequisite,
        callback,
        () => displayNewPrerequisiteMenu(backAction, back, callback, rl),
        rl,
      );
    }),
    option("Ancestry", () => {
      const ancestries = getAncestries();
      if (ancestries.length === 0) {
        console.log(red("No ancestries defined yet."));
        displayNewPrerequisiteMenu(backAction, back, callback, rl);
        return;
      }
      const ancestryPrerequisite = new AncestryPrerequisite(ancestries[0].id);
      displayPrerequisiteMenu(
        ancestryPrerequisite,
        callback,
        () => displayNewPrerequisiteMenu(backAction, back, callback, rl),
        rl,
      );
    }),
    option("Background", () => {
      const backgrounds = getBackgrounds();
      if (backgrounds.length === 0) {
        console.log(red("No backgrounds defined yet."));
        displayNewPrerequisiteMenu(backAction, back, callback, rl);
        return;
      }
      const backgroundPrerequisite = new BackgroundPrerequisite(
        backgrounds[0].id,
      );
      displayPrerequisiteMenu(
        backgroundPrerequisite,
        callback,
        () => displayNewPrerequisiteMenu(backAction, back, callback, rl),
        rl,
      );
    }),
    option("Choice", () => {
      const choices = getChoices();
      if (choices.length === 0) {
        console.log(red("No choices defined yet."));
        displayNewPrerequisiteMenu(backAction, back, callback, rl);
        return;
      }
      const choice = choices.find((choice) => choice.options.length > 0);
      if (!choice) {
        console.log(red("No choices with options defined yet."));
        displayNewPrerequisiteMenu(backAction, back, callback, rl);
        return;
      }
      const option = choice.options[0];
      const choicePrerequisite = new ChoicePrerequisite(choice.id, option.id);
      displayPrerequisiteMenu(
        choicePrerequisite,
        callback,
        () => displayNewPrerequisiteMenu(backAction, back, callback, rl),
        rl,
      );
    }),
    option("Class", () => {
      const classes = getClasses();
      if (classes.length === 0) {
        console.log(red("No classes defined yet."));
        displayNewPrerequisiteMenu(backAction, back, callback, rl);
        return;
      }
      const classPrerequisite = new ClassPrerequisite(classes[0].id, 1);
      displayPrerequisiteMenu(
        classPrerequisite,
        callback,
        () => displayNewPrerequisiteMenu(backAction, back, callback, rl),
        rl,
      );
    }),
    option("Feat", () => {
      const feats = getFeats();
      if (feats.length === 0) {
        console.log(red("No feats defined yet."));
        displayNewPrerequisiteMenu(backAction, back, callback, rl);
        return;
      }
      const featPrerequisite = new FeatPrerequisite(feats[0].id);
      displayPrerequisiteMenu(
        featPrerequisite,
        callback,
        () => displayNewPrerequisiteMenu(backAction, back, callback, rl),
        rl,
      );
    }),
    option("Item proficiency", () => {
      const itemProficiencyPrerequisite = new ItemProficiencyPrerequisite([]);
      displayPrerequisiteMenu(
        itemProficiencyPrerequisite,
        callback,
        () => displayNewPrerequisiteMenu(backAction, back, callback, rl),
        rl,
      );
    }),
    option("Language", () => {
      const languages = getLanguages();
      if (languages.length === 0) {
        console.log(red("No languages defined yet."));
        displayNewPrerequisiteMenu(backAction, back, callback, rl);
        return;
      }
      const languagePrerequisite = new LanguagePrerequisite([languages[0].id]);
      displayPrerequisiteMenu(
        languagePrerequisite,
        callback,
        () => displayNewPrerequisiteMenu(backAction, back, callback, rl),
        rl,
      );
    }),
    option("Level", () => {
      const levelPrerequisite = new LevelPrerequisite(1);
      displayPrerequisiteMenu(
        levelPrerequisite,
        callback,
        () => displayNewPrerequisiteMenu(backAction, back, callback, rl),
        rl,
      );
    }),
    option("Saving throw proficiency", () => {
      const savingThrowProficiencyPrerequisite =
        new SavingThrowProficiencyPrerequisite([]);
      displayPrerequisiteMenu(
        savingThrowProficiencyPrerequisite,
        callback,
        () => displayNewPrerequisiteMenu(backAction, back, callback, rl),
        rl,
      );
    }),
    option("Skill proficiency", () => {
      const skillProficiencyPrerequisite = new SkillProficiencyPrerequisite([]);
      displayPrerequisiteMenu(
        skillProficiencyPrerequisite,
        callback,
        () => displayNewPrerequisiteMenu(backAction, back, callback, rl),
        rl,
      );
    }),
    option("Spell", () => {
      const spellPrerequisite = new SpellPrerequisite([]);
      displayPrerequisiteMenu(
        spellPrerequisite,
        callback,
        () => displayNewPrerequisiteMenu(backAction, back, callback, rl),
        rl,
      );
    }),
    option("Sub-ancestry", () => {
      const ancestries = getAncestries();
      if (ancestries.length === 0) {
        console.log(red("No ancestries defined yet."));
        displayNewPrerequisiteMenu(backAction, back, callback, rl);
        return;
      }
      const ancestry = ancestries.find(
        (ancestry) => ancestry.subAncestries.length > 0,
      );
      if (!ancestry) {
        console.log(red("No ancestries with sub-ancestries defined yet."));
        displayNewPrerequisiteMenu(backAction, back, callback, rl);
        return;
      }
      const subAncestry = ancestry.subAncestries[0];
      const subAncestryPrerequisite = new SubAncestryPrerequisite(
        ancestry.id,
        subAncestry.id,
      );
      displayPrerequisiteMenu(
        subAncestryPrerequisite,
        callback,
        () => displayNewPrerequisiteMenu(backAction, back, callback, rl),
        rl,
      );
    }),
    option("Sub-class", () => {
      const classes = getClasses();
      if (classes.length === 0) {
        console.log(red("No classes defined yet."));
        displayNewPrerequisiteMenu(backAction, back, callback, rl);
        return;
      }
      const clazz = classes.find((clazz) => clazz.subClasses.length > 0);
      if (!clazz) {
        console.log(red("No classes with sub-classes defined yet."));
        displayNewPrerequisiteMenu(backAction, back, callback, rl);
        return;
      }
      const subClass = clazz.subClasses[0];
      const subClassPrerequisite = new SubClassPrerequisite(
        clazz.id,
        subClass.id,
        1,
      );
      displayPrerequisiteMenu(
        subClassPrerequisite,
        callback,
        () => displayNewPrerequisiteMenu(backAction, back, callback, rl),
        rl,
      );
    }),
    option(backAction, () => {
      back();
    }),
  ).display(rl);
}
