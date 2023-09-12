import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'yaml';
import { getBaseDirectory } from '../settings';

export const getEffectsDirectory = () => path.join(getBaseDirectory(), 'effects');

const getEffects = () => {
  return fs.readdirSync(getEffectsDirectory()).map((effectFile) => {
    return parse(fs.readFileSync(path.join(getEffectsDirectory(), effectFile), 'utf8')).effect;
  });
}