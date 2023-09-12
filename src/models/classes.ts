import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'yaml';
import { getBaseDirectory } from '../settings';

export const getClassesDirectory = () => path.join(getBaseDirectory(), 'classes');

export const getClasses = () => {
  return fs.readdirSync(getClassesDirectory()).map((classFile) => {
    return parse(fs.readFileSync(path.join(getClassesDirectory(), classFile), 'utf8')).class;
  });
}