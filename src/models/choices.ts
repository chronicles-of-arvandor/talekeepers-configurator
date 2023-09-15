import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'yaml';
import { getBaseDirectory } from '../settings';
import { deserializePrerequisite, Prerequisite } from './prerequisites';
import { ConfigurationSerializable } from './configurationSerializable';

export const getChoicesDirectory = () => path.join(getBaseDirectory(), 'choices');

export const getChoices = () => {
  return fs.readdirSync(getChoicesDirectory()).map((choiceFile) => {
    let choicePath = path.join(getChoicesDirectory(), choiceFile);
    return deserializeChoice(choicePath, parse(fs.readFileSync(choicePath, 'utf8')).choice);
  });
}

export const getChoiceById = (id: string) => getChoices().find((choice) => choice.id === id);

export class ChoiceOption implements ConfigurationSerializable {
  id: string;
  text: string;
  prerequisites: Prerequisite[];

  constructor(
    id: string,
    text: string,
    prerequisites: Prerequisite[]
  ) {
    this.id = id;
    this.text = text;
    this.prerequisites = prerequisites;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'ChoiceOption',
      'id': this.id,
      'text': this.text,
      'prerequisites': this.prerequisites.map((prerequisite) => prerequisite.serialize())
    }
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
    options: ChoiceOption[]
  ) {
    this.file = file;
    this.id = id;
    this.text = text;
    this.prerequisites = prerequisites;
    this.options = options;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'Choice',
      'id': this.id,
      'text': this.text,
      'prerequisites': this.prerequisites.map((prerequisite) => prerequisite.serialize()),
      'options': this.options.map((option) => option.serialize())
    }
  }
}

function deserializeChoiceOption(serialized: { [key: string]: any }) {
  return new ChoiceOption(
    serialized['id'],
    serialized['text'],
    serialized['prerequisites'].map((prerequisite: { [key: string]: any }) => deserializePrerequisite(prerequisite))
  )
}

function deserializeChoice(file: string, serialized: { [key: string]: any }) {
  return new Choice(
    file,
    serialized['id'],
    serialized['text'],
    serialized['prerequisites'].map((prerequisite: { [key: string]: any }) => deserializePrerequisite(prerequisite)),
    serialized['options'].map((option: { [key: string]: any }) => deserializeChoiceOption(option))
  )
}