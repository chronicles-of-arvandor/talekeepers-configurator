import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'yaml';
import { getBaseDirectory } from '../settings';

export const getLanguagesDirectory = () => path.join(getBaseDirectory(), 'languages');

export const getLanguages = () => {
  return fs.readdirSync(getLanguagesDirectory()).map((languageFile) => {
    return parse(fs.readFileSync(path.join(getLanguagesDirectory(), languageFile), 'utf8')).language;
  });
}
