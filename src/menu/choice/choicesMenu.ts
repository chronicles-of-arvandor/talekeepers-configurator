import * as readline from "readline";
import { menu, option } from "../menu";
import { blue, green, yellow } from "chalk";
import {
  Choice,
  ChoiceOption,
  getChoices,
  getChoicesDirectory,
} from "../../models/choices";
import { displayMainMenu } from "../../index";
import { displayChoiceMenu } from "./choiceMenu";
import * as path from "path";
import * as uuid from "uuid";
import { displayNewSpellChoiceMenu } from "./spellChoiceMenu";
import { displayNewFeatChoiceMenu } from "./featChoiceMenu";
import { displayNewAsiChoiceMenu } from "./asiChoiceMenu";
import { displayNewSkillProficiencyChoiceMenu } from "./skillProficiencyChoiceMenu";
import { displayNewItemProficiencyChoiceMenu } from "./itemProficiencyChoiceMenu";
import { displayChoiceSelectionMenu } from "./choiceSelectionMenu";
import { displayNewLanguageChoiceMenu } from "./languageChoiceMenu";

export function displayChoicesMenu(rl: readline.Interface) {
  const choices = getChoices();
  menu(
    "Choices",
    option(green("New"), () => {
      displayNewChoiceMenu(rl);
    }),
    option(yellow("Copy and re-index"), () => {
      displayChoiceSelectionMenu(
        "Back to choices menu",
        () => {
          displayChoicesMenu(rl);
        },
        (choice) => {
          rl.question("New file name: ", (fileName) => {
            const choicePath = path.join(
              getChoicesDirectory(),
              `${fileName}.yml`,
            );
            const copy = new Choice(
              choicePath,
              uuid.v4(),
              choice.text,
              choice.prerequisites,
              choice.options.map((opt) => {
                return new ChoiceOption(uuid.v4(), opt.text, opt.prerequisites);
              }),
            );
            copy.save();
            console.log(green(`Choice copied to ${choicePath}.`));
            displayChoicesMenu(rl);
          });
        },
        rl,
      );
    }),
    ...choices.map((choice) =>
      option(choice.text, () => {
        displayChoiceMenu(choice, rl);
      }),
    ),
    option("Back to main menu", () => {
      displayMainMenu(rl);
    }),
  ).display(rl);
}

function displayNewChoiceMenu(rl: readline.Interface) {
  menu(
    "New choice",
    option("Spell choice(s)", () => {
      displayNewSpellChoiceMenu("spell_choice", "Spell choice", 1, [], [], rl);
    }),
    option("Feat choice(s)", () => {
      displayNewFeatChoiceMenu("feat_choice", "Feat choice", 1, [], [], rl);
    }),
    option("ASI choice(s)", () => {
      displayNewAsiChoiceMenu("asi_choice", "ASI choice", 1, [], rl);
    }),
    option("Skill proficiency choice(s)", () => {
      displayNewSkillProficiencyChoiceMenu(
        "skill_proficiency_choice",
        "Skill proficiency choice",
        1,
        [],
        [],
        rl,
      );
    }),
    option("Item proficiency choice(s)", () => {
      displayNewItemProficiencyChoiceMenu(
        "item_proficiency_choice",
        "Item proficiency choice",
        1,
        [],
        [],
        rl,
      );
    }),
    option("Language choice(s)", () => {
      displayNewLanguageChoiceMenu(
        "language_choice",
        "Language choice",
        1,
        [],
        [],
        rl,
      );
    }),
    option("Other choice", () => {
      rl.question("File name: ", (fileName) => {
        const choicePath = path.join(getChoicesDirectory(), `${fileName}.yml`);
        const choice = new Choice(choicePath, uuid.v4(), "", [], []);
        displayChoiceMenu(choice, rl);
      });
    }),
  ).display(rl);
}
