import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'yaml';
import { getBaseDirectory } from '../settings';

export const getFeatsDirectory = () => path.join(getBaseDirectory(), 'feats');

export const getFeats = () => {
  return fs.readdirSync(getFeatsDirectory()).map((featFile) => {
    return parse(fs.readFileSync(path.join(getFeatsDirectory(), featFile), 'utf8')).feat;
  });
}