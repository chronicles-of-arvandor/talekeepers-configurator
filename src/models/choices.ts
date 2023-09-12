import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'yaml';
import { getBaseDirectory } from '../settings';

export const getChoicesDirectory = () => path.join(getBaseDirectory(), 'choices');

export const getChoices = () => {
  return fs.readdirSync(getChoicesDirectory()).map((choiceFile) => {
    return parse(fs.readFileSync(path.join(getChoicesDirectory(), choiceFile), 'utf8')).choice;
  });
}