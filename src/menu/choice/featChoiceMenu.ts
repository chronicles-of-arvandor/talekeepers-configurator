import * as readline from "readline";
import { menu, option } from "../menu";
import {
  getFeatById,
  getFeatByName,
  getFeats,
  getFeatsDirectory,
  Feat,
} from "../../models/feats";
import { gray, green, red } from "chalk";
import { displayChoicesMenu } from "./choicesMenu";
import {
  Choice,
  ChoiceOption,
  getChoicesDirectory,
} from "../../models/choices";
import path from "path";
import * as uuid from "uuid";
import {
  ChoicePrerequisite,
  NotPrerequisite,
  OrPrerequisite,
  Prerequisite,
  FeatPrerequisite,
} from "../../models/prerequisites";
import { displayPrerequisitesMenu } from "../prerequisite/prerequisitesMenu";
import {
  getEffects,
  getEffectsDirectory,
  FeatEffect,
} from "../../models/effects";

export function displayNewFeatChoiceMenu(
  name: string,
  text: string,
  amount: number,
  prerequisites: Prerequisite[],
  feats: Feat[],
  rl: readline.Interface,
) {
  menu(
    "New feat choice\n" + gray(`${feats.length} feats selected`),
    option("Name " + gray(`(${name})`), () => {
      rl.question("Name: ", (newName) => {
        displayNewFeatChoiceMenu(
          newName,
          text,
          amount,
          prerequisites,
          feats,
          rl,
        );
      });
    }),
    option("Text " + gray(`(${text})`), () => {
      rl.question("Text: ", (newText) => {
        displayNewFeatChoiceMenu(
          name,
          newText,
          amount,
          prerequisites,
          feats,
          rl,
        );
      });
    }),
    option("Amount " + gray(`(${amount})`), () => {
      rl.question("Amount: ", (newAmount) => {
        const amountInt = parseInt(newAmount);
        if (isNaN(amountInt)) {
          console.log(red("Invalid amount."));
          displayNewFeatChoiceMenu(
            name,
            text,
            amount,
            prerequisites,
            feats,
            rl,
          );
          return;
        }
        displayNewFeatChoiceMenu(
          name,
          text,
          amountInt,
          prerequisites,
          feats,
          rl,
        );
      });
    }),
    option("Prerequisites " + gray(`(${prerequisites.length})`), () => {
      displayPrerequisitesMenu(
        "Back to new feat choice menu",
        () => {
          displayNewFeatChoiceMenu(
            name,
            text,
            amount,
            prerequisites,
            feats,
            rl,
          );
        },
        (newPrerequisites) => {
          displayNewFeatChoiceMenu(
            name,
            text,
            amount,
            newPrerequisites,
            feats,
            rl,
          );
        },
        rl,
      );
    }),
    option("Add all feats", () => {
      console.log(green("Added all feats."));
      displayNewFeatChoiceMenu(
        name,
        text,
        amount,
        prerequisites,
        getFeats(),
        rl,
      );
    }),
    option("Add feat", () => {
      rl.question("Feat name: ", (featName) => {
        const feat = getFeatByName(featName);
        if (!feat) {
          console.log(red("There is no feat by that name."));
          displayNewFeatChoiceMenu(
            name,
            text,
            amount,
            prerequisites,
            feats,
            rl,
          );
        } else {
          displayNewFeatChoiceMenu(
            name,
            text,
            amount,
            prerequisites,
            [...feats, feat],
            rl,
          );
        }
      });
    }),
    option("Remove feat", () => {
      rl.question("Feat name: ", (featName) => {
        const feat = getFeatByName(featName);
        if (!feat) {
          console.log(red("There is no feat by that name."));
          displayNewFeatChoiceMenu(
            name,
            text,
            amount,
            prerequisites,
            feats,
            rl,
          );
        } else {
          displayNewFeatChoiceMenu(
            name,
            text,
            amount,
            prerequisites,
            feats.filter((s) => s.id !== feat.id),
            rl,
          );
        }
      });
    }),
    option(green("Save"), () => {
      createFeatChoices(name, text, amount, prerequisites, feats);
      console.log(green("Feat choices saved."));
      displayChoicesMenu(rl);
    }),
    option(red("Cancel"), () => {
      displayChoicesMenu(rl);
    }),
  ).display(rl);
}

function createFeatChoices(
  name: string,
  text: string,
  amount: number,
  prerequisites: Prerequisite[],
  feats: Feat[],
) {
  if (amount > 1) {
    for (let i = 1; i <= amount; i++) {
      createFeatChoice(`${name}_${i}`, `${text} (${i})`, prerequisites, feats);
    }
  } else {
    createFeatChoice(name, text, prerequisites, feats);
  }
}

function createFeatChoice(
  name: string,
  text: string,
  prerequisites: Prerequisite[],
  feats: Feat[],
) {
  const choice = new Choice(
    path.join(getChoicesDirectory(), `${name}.yml`),
    uuid.v4(),
    text,
    prerequisites,
    feats.map((feat) => {
      return new ChoiceOption(uuid.v4(), feat.name, [
        new NotPrerequisite(new FeatPrerequisite(feat.id)),
      ]);
    }),
  );
  choice.save();
  updateEffects(choice);
}

function updateEffects(choice: Choice) {
  const allEffects = getEffects();
  choice.options.forEach((opt) => {
    const optionFeatNotPrerequisite = opt.prerequisites
      .filter((prerequisite): prerequisite is NotPrerequisite =>
        NotPrerequisite.prototype.isPrototypeOf(prerequisite),
      )
      .find((prerequisite) =>
        FeatPrerequisite.prototype.isPrototypeOf(prerequisite.prerequisite),
      );
    if (!optionFeatNotPrerequisite) {
      console.log(
        red(`Could not find feat prerequisite for option ${opt.text}`),
      );
      return;
    }
    const optionFeatPrerequisite =
      optionFeatNotPrerequisite.prerequisite as FeatPrerequisite;
    const feat = getFeatById(optionFeatPrerequisite.featId);
    if (!feat) {
      console.log(red(`Could not find feat for option ${opt.text}`));
      return;
    }
    const effectFile = path.join(
      getEffectsDirectory(),
      `feat_${feat.name.toLowerCase().replace(/[^a-zA-Z0-9._-]/g, "_")}.yml`,
    );
    let effect = allEffects.find((effect) => effect.file === effectFile);
    if (!effect) {
      effect = new FeatEffect(
        effectFile,
        [feat.id],
        [new OrPrerequisite([new ChoicePrerequisite(choice.id, opt.id)])],
      );
    } else {
      const orPrerequisite = effect.prerequisites.find(
        (prerequisite): prerequisite is OrPrerequisite =>
          OrPrerequisite.prototype.isPrototypeOf(prerequisite),
      );
      if (orPrerequisite) {
        orPrerequisite.prerequisites.push(
          new ChoicePrerequisite(choice.id, opt.id),
        );
      } else {
        effect.prerequisites.push(
          new OrPrerequisite([new ChoicePrerequisite(choice.id, opt.id)]),
        );
      }
    }
    effect.save();
  });
}
