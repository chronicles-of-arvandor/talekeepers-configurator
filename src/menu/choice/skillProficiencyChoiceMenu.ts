import * as readline from "readline";
import { menu, option } from "../menu";
import { Skill } from "../../models/skills";
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
  SkillProficiencyPrerequisite,
} from "../../models/prerequisites";
import { displayPrerequisitesMenu } from "../prerequisite/prerequisitesMenu";
import {
  getEffects,
  getEffectsDirectory,
  SkillProficiencyEffect,
} from "../../models/effects";
import { displaySkillSelectionMenu } from "../skill/skillSelectionMenu";

export function displayNewSkillProficiencyChoiceMenu(
  name: string,
  text: string,
  amount: number,
  prerequisites: Prerequisite[],
  skills: Skill[],
  rl: readline.Interface,
) {
  menu(
    "New skill proficiency choice\n" + gray(`${skills.length} skills selected`),
    option("Name " + gray(`(${name})`), () => {
      rl.question("Name: ", (newName) => {
        displayNewSkillProficiencyChoiceMenu(
          newName,
          text,
          amount,
          prerequisites,
          skills,
          rl,
        );
      });
    }),
    option("Text " + gray(`(${text})`), () => {
      rl.question("Text: ", (newText) => {
        displayNewSkillProficiencyChoiceMenu(
          name,
          newText,
          amount,
          prerequisites,
          skills,
          rl,
        );
      });
    }),
    option("Amount " + gray(`(${amount})`), () => {
      rl.question("Amount: ", (newAmount) => {
        const amountInt = parseInt(newAmount);
        if (isNaN(amountInt)) {
          console.log(red("Invalid amount."));
          displayNewSkillProficiencyChoiceMenu(
            name,
            text,
            amount,
            prerequisites,
            skills,
            rl,
          );
          return;
        }
        displayNewSkillProficiencyChoiceMenu(
          name,
          text,
          amountInt,
          prerequisites,
          skills,
          rl,
        );
      });
    }),
    option("Prerequisites " + gray(`(${prerequisites.length})`), () => {
      displayPrerequisitesMenu(
        "Back to new skill proficiency choice menu",
        () => {
          displayNewSkillProficiencyChoiceMenu(
            name,
            text,
            amount,
            prerequisites,
            skills,
            rl,
          );
        },
        (newPrerequisites) => {
          displayNewSkillProficiencyChoiceMenu(
            name,
            text,
            amount,
            newPrerequisites,
            skills,
            rl,
          );
        },
        rl,
      );
    }),
    option("Add all skills", () => {
      console.log(green("Added all skills."));
      displayNewSkillProficiencyChoiceMenu(
        name,
        text,
        amount,
        prerequisites,
        Skill.values(),
        rl,
      );
    }),
    option("Add skill", () => {
      displaySkillSelectionMenu(
        "Back to new skill proficiency choice menu",
        () => {
          displayNewSkillProficiencyChoiceMenu(
            name,
            text,
            amount,
            prerequisites,
            skills,
            rl,
          );
        },
        (skill) => {
          displayNewSkillProficiencyChoiceMenu(
            name,
            text,
            amount,
            prerequisites,
            [...skills, skill],
            rl,
          );
        },
        rl,
      );
    }),
    option("Remove skill", () => {
      menu(
        "Skill",
        ...skills.map((skill) =>
          option(skill.name, () => {
            displayNewSkillProficiencyChoiceMenu(
              name,
              text,
              amount,
              prerequisites,
              skills.filter((s) => s !== skill),
              rl,
            );
          }),
        ),
        option("Back to new skill proficiency choice menu", () => {
          displayNewSkillProficiencyChoiceMenu(
            name,
            text,
            amount,
            prerequisites,
            skills,
            rl,
          );
        }),
      ).display(rl);
    }),
    option(green("Save"), () => {
      createSkillProficiencyChoices(name, text, amount, prerequisites, skills);
      console.log(green("Skill proficiency choices saved."));
      displayChoicesMenu(rl);
    }),
    option(red("Cancel"), () => {
      displayChoicesMenu(rl);
    }),
  ).display(rl);
}

function createSkillProficiencyChoices(
  name: string,
  text: string,
  amount: number,
  prerequisites: Prerequisite[],
  skills: Skill[],
) {
  if (amount > 1) {
    for (let i = 1; i <= amount; i++) {
      createSkillProficiencyChoice(
        `${name}_${i}`,
        `${text} (${i})`,
        prerequisites,
        skills,
      );
    }
  } else {
    createSkillProficiencyChoice(name, text, prerequisites, skills);
  }
}

function createSkillProficiencyChoice(
  name: string,
  text: string,
  prerequisites: Prerequisite[],
  skills: Skill[],
) {
  const choice = new Choice(
    path.join(getChoicesDirectory(), `${name}.yml`),
    uuid.v4(),
    text,
    prerequisites,
    skills.map((skill) => {
      return new ChoiceOption(uuid.v4(), skill.displayName, [
        new NotPrerequisite(new SkillProficiencyPrerequisite([skill])),
      ]);
    }),
  );
  choice.save();
  updateEffects(choice);
}

function updateEffects(choice: Choice) {
  const allEffects = getEffects();
  choice.options.forEach((opt) => {
    const optionSkillProficiencyNotPrerequisite = opt.prerequisites
      .filter((prerequisite): prerequisite is NotPrerequisite =>
        NotPrerequisite.prototype.isPrototypeOf(prerequisite),
      )
      .find((prerequisite) =>
        SkillProficiencyPrerequisite.prototype.isPrototypeOf(
          prerequisite.prerequisite,
        ),
      );
    if (!optionSkillProficiencyNotPrerequisite) {
      console.log(
        red(
          `Could not find skill proficiency prerequisite for option ${opt.text}`,
        ),
      );
      return;
    }
    const optionSkillProficiencyPrerequisite =
      optionSkillProficiencyNotPrerequisite.prerequisite as SkillProficiencyPrerequisite;
    const skill = optionSkillProficiencyPrerequisite.skills[0];
    if (!skill) {
      console.log(red(`Could not find skill for option ${opt.text}`));
      return;
    }
    const effectFile = path.join(
      getEffectsDirectory(),
      `skill_proficiency_${skill.name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9._-]/g, "_")}.yml`,
    );
    let effect = allEffects.find((effect) => effect.file === effectFile);
    if (!effect) {
      effect = new SkillProficiencyEffect(
        effectFile,
        [skill],
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
