import * as readline from "readline";
import { Ability } from "../../models/abilities";
import { menu, option } from "../menu";
import { Skill } from "../../models/skills";

export function displaySkillSelectionMenu(
  backAction: string,
  back: () => void,
  callback: (skill: Skill) => void,
  rl: readline.Interface,
) {
  menu(
    "Skill",
    ...Skill.values().map((skill) =>
      option(skill.displayName, () => {
        callback(skill);
      }),
    ),
    option(backAction, back),
  ).display(rl);
}
