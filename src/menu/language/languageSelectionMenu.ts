import * as readline from "readline";
import { Language, getLanguages } from "../../models/languages";
import { menu, option } from "../menu";

export function displayLanguageSelectionMenu(
  backAction: string,
  back: () => void,
  callback: (language: Language) => void,
  rl: readline.Interface,
) {
  const languages = getLanguages();
  menu(
    "Language",
    ...languages.map((language) =>
      option(language.name, () => {
        callback(language);
      }),
    ),
    option(backAction, back),
  ).display(rl);
}
