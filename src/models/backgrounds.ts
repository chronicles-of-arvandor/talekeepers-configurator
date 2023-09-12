import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'yaml';
import { getBaseDirectory } from '../settings';

export const getBackgroundsDirectory = () => path.join(getBaseDirectory(), 'backgrounds');

export const getBackgrounds = () => {
  return fs.readdirSync(getBackgroundsDirectory()).map((backgroundFile) => {
    return parse(fs.readFileSync(path.join(getBackgroundsDirectory(), backgroundFile), 'utf8')).background;
  });
}