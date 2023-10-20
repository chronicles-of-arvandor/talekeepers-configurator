import * as readline from "readline";
import {
  AbilityPrerequisite,
  ChoicePrerequisite,
  NotPrerequisite,
  Prerequisite,
} from "../../models/prerequisites";
import { menu, option } from "../menu";
import { gray, green, red } from "chalk";
import { displayChoicesMenu } from "./choicesMenu";
import { displayPrerequisitesMenu } from "../prerequisite/prerequisitesMenu";
import {
  Choice,
  ChoiceOption,
  getChoicesDirectory,
} from "../../models/choices";
import path from "path";
import { Ability } from "../../models/abilities";
import * as uuid from "uuid";
import { AbilityEffect, getEffectsDirectory } from "../../models/effects";

export function displayNewAsiChoiceMenu(
  name: string,
  text: string,
  amount: number,
  prerequisites: Prerequisite[],
  rl: readline.Interface,
) {
  menu(
    "New ASI choice",
    option("Name " + gray(`(${name})`), () => {
      rl.question("Name: ", (newName) => {
        console.log(green(`Name set to ${newName}.`));
        displayNewAsiChoiceMenu(newName, text, amount, prerequisites, rl);
      });
    }),
    option("Text " + gray(`(${text})`), () => {
      rl.question("Text: ", (newText) => {
        console.log(green(`Text set to ${newText}.`));
        displayNewAsiChoiceMenu(name, newText, amount, prerequisites, rl);
      });
    }),
    option("Amount " + gray(`(${amount})`), () => {
      rl.question("Amount: ", (newAmount) => {
        const amountInt = parseInt(newAmount);
        if (isNaN(amountInt)) {
          console.log(red("Amount must be an integer."));
          displayNewAsiChoiceMenu(name, text, amount, prerequisites, rl);
          return;
        }
        console.log(green(`Amount set to ${amountInt}.`));
        displayNewAsiChoiceMenu(name, text, amountInt, prerequisites, rl);
      });
    }),
    option("Prerequisites " + gray(`(${prerequisites.length})`), () => {
      displayPrerequisitesMenu(
        "Back to new ASI choice menu",
        () => {
          displayNewAsiChoiceMenu(name, text, amount, prerequisites, rl);
        },
        (newPrerequisites) => {
          displayNewAsiChoiceMenu(name, text, amount, newPrerequisites, rl);
        },
        rl,
      );
    }),
    option(green("Save"), () => {
      createAsiChoices(name, text, amount, prerequisites);
      console.log(green("ASI choices saved."));
      displayChoicesMenu(rl);
    }),
    option("Back to choices menu", () => {
      displayChoicesMenu(rl);
    }),
  ).display(rl);
}

function createAsiChoices(
  name: string,
  text: string,
  amount: number,
  prerequisites: Prerequisite[],
) {
  if (amount > 1) {
    for (let i = 1; i <= amount; i++) {
      createAsiChoice(`${name}_${i}`, `${text} (${i})`, prerequisites);
    }
  } else {
    createAsiChoice(name, text, prerequisites);
  }
}

function createAsiChoice(
  name: string,
  text: string,
  prerequisites: Prerequisite[],
) {
  const choice = new Choice(
    path.join(getChoicesDirectory(), `${name}.yml`),
    uuid.v4(),
    text,
    prerequisites,
    Ability.values().map((ability) => {
      return new ChoiceOption(uuid.v4(), ability.displayName, [
        new NotPrerequisite(new AbilityPrerequisite(ability, 20)),
      ]);
    }),
  );
  choice.save();
  updateEffects(choice, name);
}

function updateEffects(choice: Choice, name: string) {
  choice.options.forEach((option) => {
    const ability = Ability.getByDisplayName(option.text);
    const effect = new AbilityEffect(
      path.join(
        getEffectsDirectory(),
        `${name}_${ability.shortName.toLowerCase()}.yml`,
      ),
      {
        [ability.name]: 1,
      },
      [new ChoicePrerequisite(choice.id, option.id)],
    );
    effect.save();
  });
}
