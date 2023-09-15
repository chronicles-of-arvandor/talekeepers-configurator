import * as path from 'path';
import * as fs from 'fs';
import { parse, stringify } from 'yaml';
import { getBaseDirectory } from '../settings';
import { ConfigurationSerializable } from './configurationSerializable';

export const getBackgroundsDirectory = () => path.join(getBaseDirectory(), 'backgrounds');

export const getBackgrounds = () => {
  return fs.readdirSync(getBackgroundsDirectory()).map((backgroundFile) => {
    return loadBackground(path.join(getBackgroundsDirectory(), backgroundFile));
  });
}

export const getBackgroundById = (id: string) => {
  return getBackgrounds().find((background) => background.id === id);
}

export const getBackgroundByName = (name: string) => {
  return getBackgrounds().find((background) => background.name === name);
}

export class Background implements ConfigurationSerializable {
  file: string;
  id: string;
  name: string;
  description: string;

  constructor(file: string, id: string, name: string, description: string) {
    this.file = file;
    this.id = id;
    this.name = name;
    this.description = description;
  }

  serialize() {
    return {
      '==': 'Background',
      'id': this.id,
      'name': this.name,
      'description': this.description
    };
  }

  save() {
    fs.writeFileSync(this.file, stringify({
      'background': this.serialize()
    }));
  }
}

function deserializeBackground(file: string, serialized: { [key: string]: any }) {
  return new Background(file, serialized['id'], serialized['name'], serialized['description']);
}

function loadBackground(file: string) {
  return deserializeBackground(file, parse(fs.readFileSync(file, 'utf8')).background);
}