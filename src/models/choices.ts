import * as path from "path";
import * as fs from "fs";
import { parse, stringify } from "yaml";
import { getBaseDirectory } from "../settings";
import { deserializePrerequisite, Prerequisite } from "./prerequisites";
import { ConfigurationSerializable } from "./configurationSerializable";
import NodeCache from "node-cache";
import { gray } from "chalk";

export const getChoicesDirectory = () =>
  path.join(getBaseDirectory(), "choices");

const choiceCache = new NodeCache();

export const getChoices = () => {
  return fs.readdirSync(getChoicesDirectory()).map((choiceFile) => {
    let choicePath = path.join(getChoicesDirectory(), choiceFile);
    const cachedChoice = choiceCache.get<Choice>(choicePath);
    if (cachedChoice) {
      return cachedChoice;
    } else {
      const choice = deserializeChoice(
        choicePath,
        parse(fs.readFileSync(choicePath, "utf8")).choice,
      );
      choiceCache.set(choicePath, choice);
      return choice;
    }
  });
};

fs.watch(getChoicesDirectory(), (eventType, filename) => {
  if (filename) {
    const choicePath = path.join(getChoicesDirectory(), filename);
    choiceCache.del(choicePath);
    console.log(gray(`Purging cached choice ${choicePath} due to update`));
  }
});

export const getChoiceById = (id: string) =>
  getChoices().find((choice) => choice.id === id);

export class ChoiceOption implements ConfigurationSerializable {
  id: string;
  text: string;
  prerequisites: Prerequisite[];

  constructor(id: string, text: string, prerequisites: Prerequisite[]) {
    this.id = id;
    this.text = text;
    this.prerequisites = prerequisites;
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "ChoiceOption",
      id: this.id,
      text: this.text,
      prerequisites:
        (this.prerequisites.length ?? 0) > 0
          ? this.prerequisites.map((prerequisite) => prerequisite.serialize())
          : undefined,
    };
  }
}

export class Choice implements ConfigurationSerializable {
  file: string;
  id: string;
  text: string;
  prerequisites: Prerequisite[];
  options: ChoiceOption[];

  constructor(
    file: string,
    id: string,
    text: string,
    prerequisites: Prerequisite[],
    options: ChoiceOption[],
  ) {
    this.file = file;
    this.id = id;
    this.text = text;
    this.prerequisites = prerequisites;
    this.options = options;
  }

  getOptionById(id: string) {
    return this.options.find((option) => option.id === id);
  }

  serialize(): { [key: string]: any } {
    return {
      "==": "Choice",
      id: this.id,
      text: this.text,
      prerequisites: this.prerequisites.map((prerequisite) =>
        prerequisite.serialize(),
      ),
      options: this.options.map((option) => option.serialize()),
    };
  }

  save() {
    fs.writeFileSync(
      this.file,
      stringify({
        choice: this.serialize(),
      }),
    );
  }
}

function deserializeChoiceOption(serialized: { [key: string]: any }) {
  return new ChoiceOption(
    serialized["id"],
    serialized["text"],
    serialized["prerequisites"]?.map((prerequisite: { [key: string]: any }) =>
      deserializePrerequisite(prerequisite),
    ) ?? [],
  );
}

function deserializeChoice(file: string, serialized: { [key: string]: any }) {
  return new Choice(
    file,
    serialized["id"],
    serialized["text"],
    serialized["prerequisites"].map((prerequisite: { [key: string]: any }) =>
      deserializePrerequisite(prerequisite),
    ),
    serialized["options"].map((option: { [key: string]: any }) =>
      deserializeChoiceOption(option),
    ),
  );
}
