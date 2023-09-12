import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'yaml';
import { getBaseDirectory } from '../settings';

export const getSpellsDirectory = () => path.join(getBaseDirectory(), 'spells');

export const getSpells = () => {
  return fs.readdirSync(getSpellsDirectory()).map((spellFile) => {
    return parse(fs.readFileSync(path.join(getSpellsDirectory(), spellFile), 'utf8')).spell;
  });
}
