import * as path from 'path';
import * as fs from 'fs';
import { parse, stringify } from 'yaml';
import { getBaseDirectory } from '../settings';
import { ConfigurationSerializable } from './configurationSerializable';

export const getLanguagesDirectory = () => path.join(getBaseDirectory(), 'languages');

export const getLanguages = () => {
  return fs.readdirSync(getLanguagesDirectory()).map((languageFile) => {
    let languagePath = path.join(getLanguagesDirectory(), languageFile);
    return deserializeLanguage(languagePath, parse(fs.readFileSync(languagePath, 'utf8')).language);
  });
}

export const getLanguageById = (id: string) => getLanguages().find((language) => language.id === id);
export const getLanguageByName = (name: string) => getLanguages().find((language) => language.name === name);

class Language implements ConfigurationSerializable {
  file: string;
  id: string;
  name: string;
  cypher: { [key: string]: string };

  constructor(file: string, id: string, name: string, cypher: { [p: string]: string }) {
    this.file = file;
    this.id = id;
    this.name = name;
    this.cypher = cypher;
  }

  serialize() {
    return {
      '==': 'Language',
      'id': this.id,
      'name': this.name,
      'cypher': this.cypher
    }
  }

  save() {
    fs.writeFileSync(this.file, stringify({
      language: this.serialize()
    }));
  }
}

function deserializeLanguage(file: string, serialized: { [key: string]: any }) {
  return new Language(
    file,
    serialized['id'],
    serialized['name'],
    serialized['cypher']
  );
}
