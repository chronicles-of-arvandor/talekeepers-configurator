import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'yaml';
import { getBaseDirectory } from '../settings';
import { ConfigurationSerializable } from './configurationSerializable';
import { Ability } from './abilities';

export const getSpellsDirectory = () => path.join(getBaseDirectory(), 'spells');

export const getSpells = () => {
  return fs.readdirSync(getSpellsDirectory()).map((spellFile) => {
    let spellPath = path.join(getSpellsDirectory(), spellFile);
    return deserializeSpell(spellPath, parse(fs.readFileSync(spellPath, 'utf8')).spell);
  });
}

export const getSpellById = (id: string) => getSpells().find((spell) => spell.id === id);
export const getSpellByName = (name: string) => getSpells().find((spell) => spell.name === name);

export type SpellSchool =
  | 'ABJURATION'
  | 'CONJURATION'
  | 'DIVINATION'
  | 'ENCHANTMENT'
  | 'EVOCATION'
  | 'ILLUSION'
  | 'NECROMANCY'
  | 'TRANSMUTATION'
  ;

export type SpellTimeUnit =
  | 'ACTION'
  | 'REACTION'
  | 'BONUS'
  | 'MINUTE'
  | 'HOUR'
  ;

export class SpellTime implements ConfigurationSerializable {
  number: number;
  unit: SpellTimeUnit;
  constructor(number: number, unit: SpellTimeUnit) {
    this.number = number;
    this.unit = unit;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'SpellTime',
      'number': this.number,
      'unit': this.unit,
    };
  }
}

function deserializeSpellTime(serialized: { [key: string]: any }) {
  return new SpellTime(serialized['number'], serialized['unit']);
}

export interface SpellRangeDistance extends ConfigurationSerializable {}

export class SpellRangeDistanceFeet implements SpellRangeDistance {
  amount: number;
  constructor(amount: number) {
    this.amount = amount;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'SpellRangeDistanceFeet',
      'amount': this.amount,
    };
  }
}

export class SpellRangeDistanceMile implements SpellRangeDistance {
  amount: number;
  constructor(amount: number) {
    this.amount = amount;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'SpellRangeDistanceMile',
      'amount': this.amount,
    };
  }
}

export class SpellRangeDistanceSelf implements SpellRangeDistance {
  serialize(): { [key: string]: any } {
    return {
      '==': 'SpellRangeDistanceSelf',
    };
  }
}

export class SpellRangeDistanceTouch implements SpellRangeDistance {
  serialize(): { [key: string]: any } {
    return {
      '==': 'SpellRangeDistanceTouch',
    };
  }
}

export class SpellRangeDistanceSight implements SpellRangeDistance {
  serialize(): { [key: string]: any } {
    return {
      '==': 'SpellRangeDistanceSight',
    };
  }
}

export class SpellRangeDistanceUnlimited implements SpellRangeDistance {
  serialize(): { [key: string]: any } {
    return {
      '==': 'SpellRangeDistanceUnlimited',
    };
  }
}

function deserializeSpellRangeDistance(serialized: { [key: string]: any }) {
  switch (serialized['==']) {
    case 'SpellRangeDistanceFeet':
      return new SpellRangeDistanceFeet(serialized['amount']);
    case 'SpellRangeDistanceMile':
      return new SpellRangeDistanceMile(serialized['amount']);
    case 'SpellRangeDistanceSelf':
      return new SpellRangeDistanceSelf();
    case 'SpellRangeDistanceTouch':
      return new SpellRangeDistanceTouch();
    case 'SpellRangeDistanceSight':
      return new SpellRangeDistanceSight();
    case 'SpellRangeDistanceUnlimited':
      return new SpellRangeDistanceUnlimited();
    default:
      throw new Error(`Unknown spell range distance type: ${serialized['==']}`);
  }
}

export interface SpellRange extends ConfigurationSerializable {}

export class PointSpellRange implements SpellRange {
  distance: SpellRangeDistance;
  constructor(distance: SpellRangeDistance) {
    this.distance = distance;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'PointSpellRange',
      'distance': this.distance.serialize(),
    };
  }
}

export class RadiusSpellRange implements SpellRange {
  distance: SpellRangeDistance;
  constructor(distance: SpellRangeDistance) {
    this.distance = distance;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'RadiusSpellRange',
      'distance': this.distance.serialize(),
    }
  }
}

export class SphereSpellRange implements SpellRange {
  distance: SpellRangeDistance;
  constructor(distance: SpellRangeDistance) {
    this.distance = distance;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'SphereSpellRange',
      'distance': this.distance.serialize(),
    }
  }
}

export class ConeSpellRange implements SpellRange {
  distance: SpellRangeDistance;
  constructor(distance: SpellRangeDistance) {
    this.distance = distance;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'ConeSpellRange',
      'distance': this.distance.serialize(),
    }
  }
}

export class SpecialSpellRange implements SpellRange {
  serialize(): { [key: string]: any } {
    return {
      '==': 'SpecialSpellRange',
    }
  }
}

export class LineSpellRange implements SpellRange {
  distance: SpellRangeDistance;
  constructor(distance: SpellRangeDistance) {
    this.distance = distance;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'LineSpellRange',
      'distance': this.distance.serialize(),
    }
  }
}

export class HemisphereSpellRange implements SpellRange {
  distance: SpellRangeDistance;
  constructor(distance: SpellRangeDistance) {
    this.distance = distance;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'HemisphereSpellRange',
      'distance': this.distance.serialize(),
    }
  }
}

export class CubeSpellRange implements SpellRange {
  distance: SpellRangeDistance;
  constructor(distance: SpellRangeDistance) {
    this.distance = distance;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'CubeSpellRange',
      'distance': this.distance.serialize(),
    }
  }
}

function deserializeSpellRange(serialized: { [key: string]: any }) {
  switch (serialized['==']) {
    case 'PointSpellRange':
      return new PointSpellRange(deserializeSpellRangeDistance(serialized['distance']));
    case 'RadiusSpellRange':
      return new RadiusSpellRange(deserializeSpellRangeDistance(serialized['distance']));
    case 'SphereSpellRange':
      return new SphereSpellRange(deserializeSpellRangeDistance(serialized['distance']));
    case 'ConeSpellRange':
      return new ConeSpellRange(deserializeSpellRangeDistance(serialized['distance']));
    case 'SpecialSpellRange':
      return new SpecialSpellRange();
    case 'LineSpellRange':
      return new LineSpellRange(deserializeSpellRangeDistance(serialized['distance']));
    case 'HemisphereSpellRange':
      return new HemisphereSpellRange(deserializeSpellRangeDistance(serialized['distance']));
    case 'CubeSpellRange':
      return new CubeSpellRange(deserializeSpellRangeDistance(serialized['distance']));
    default:
      throw new Error(`Unknown spell range type: ${serialized['==']}`);
  }
}

export interface SpellComponents extends ConfigurationSerializable {
  verbal: boolean;
  somatic: boolean;
}

export class SpellComponentsWithNoMaterial implements SpellComponents {
  somatic: boolean;
  verbal: boolean;
  constructor(somatic: boolean, verbal: boolean) {
    this.somatic = somatic;
    this.verbal = verbal;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'SpellComponentsWithNoMaterial',
      'somatic': this.somatic,
      'verbal': this.verbal,
    };
  }
}

export class SpellComponentsWithStringMaterial implements SpellComponents {
  somatic: boolean;
  verbal: boolean;
  material: string;
  constructor(somatic: boolean, verbal: boolean, material: string) {
    this.somatic = somatic;
    this.verbal = verbal;
    this.material = material;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'SpellComponentsWithStringMaterial',
      'somatic': this.somatic,
      'verbal': this.verbal,
      'material': this.material,
    }
  }
}

export class MaterialSpellComponent implements ConfigurationSerializable {
  text: string;
  cost: number;
  consume: boolean;
  constructor(text: string, cost: number, consume: boolean) {
    this.text = text;
    this.cost = cost;
    this.consume = consume;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'MaterialSpellComponent',
      'text': this.text,
      'cost': this.cost,
      'consume': this.consume,
    }
  }
}

function deserializeMaterialSpellComponent(serialized: { [key: string]: any }) {
  return new MaterialSpellComponent(serialized['text'], serialized['cost'], serialized['consume']);
}

export class SpellComponentsWithObjectMaterial implements SpellComponents {
  somatic: boolean;
  verbal: boolean;
  material: MaterialSpellComponent;
  constructor(somatic: boolean, verbal: boolean, material: MaterialSpellComponent) {
    this.somatic = somatic;
    this.verbal = verbal;
    this.material = material;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'SpellComponentsWithObjectMaterial',
      'somatic': this.somatic,
      'verbal': this.verbal,
      'material': this.material.serialize(),
    }
  }
}

function deserializeSpellComponents(serialized: { [key: string]: any }) {
  switch (serialized['==']) {
    case 'SpellComponentsWithNoMaterial':
      return new SpellComponentsWithNoMaterial(serialized['somatic'], serialized['verbal']);
    case 'SpellComponentsWithStringMaterial':
      return new SpellComponentsWithStringMaterial(serialized['somatic'], serialized['verbal'], serialized['material']);
    case 'SpellComponentsWithObjectMaterial':
      return new SpellComponentsWithObjectMaterial(serialized['somatic'], serialized['verbal'], deserializeMaterialSpellComponent(serialized['material']));
    default:
      throw new Error(`Unknown spell components type: ${serialized['==']}`);
  }
}

export interface SpellDuration extends ConfigurationSerializable {}

export class InstantSpellDuration implements SpellDuration {
  serialize(): { [key: string]: any } {
    return {
      '==': 'InstantSpellDuration',
    };
  }
}

export type TimedSpellDurationType =
  | 'MINUTE'
  | 'HOUR'
  | 'DAY'
  | 'ROUND'
  ;

export class TimedSpellDuration implements SpellDuration {
  type: TimedSpellDurationType;
  amount: number;
  concentration: boolean;
  constructor(type: TimedSpellDurationType, amount: number, concentration: boolean) {
    this.type = type;
    this.amount = amount;
    this.concentration = concentration;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'TimedSpellDuration',
      'type': this.type,
      'amount': this.amount,
      'concentration': this.concentration,
    }
  }
}

export type PermanentSpellEnd =
  | 'DISPEL'
  | 'TRIGGER'
  ;

export class PermanentSpellDuration implements SpellDuration {
  ends: PermanentSpellEnd[];
  constructor(ends: PermanentSpellEnd[]) {
    this.ends = ends;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'PermanentSpellDuration',
      'ends': this.ends,
    }
  }
}

export class SpecialSpellDuration implements SpellDuration {
  serialize(): { [key: string]: any } {
    return {
      '==': 'SpecialSpellDuration',
    }
  }
}

function deserializeSpellDuration(serialized: { [key: string]: any }) {
  switch (serialized['==']) {
    case 'InstantSpellDuration':
      return new InstantSpellDuration();
    case 'TimedSpellDuration':
      return new TimedSpellDuration(serialized['type'], serialized['amount'], serialized['concentration']);
    case 'PermanentSpellDuration':
      return new PermanentSpellDuration(serialized['ends']);
    case 'SpecialSpellDuration':
      return new SpecialSpellDuration();
    default:
      throw new Error(`Unknown spell duration type: ${serialized['==']}`);
  }
}

export class SpellMeta implements ConfigurationSerializable {
  ritual: boolean;
  constructor(ritual: boolean) {
    this.ritual = ritual;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'SpellMeta',
      'ritual': this.ritual,
    }
  }
}

function deserializeSpellMeta(serialized: { [key: string]: any }) {
  return new SpellMeta(serialized['ritual']);
}

export interface SpellEntry extends ConfigurationSerializable {}

export class StringSpellEntry implements SpellEntry {
  value: string;
  constructor(value: string) {
    this.value = value;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'StringSpellEntry',
      'value': this.value,
    }
  }
}

export class EntriesSpellEntry implements SpellEntry {
  name: string;
  entries: string[];
  constructor(name: string, entries: string[]) {
    this.name = name;
    this.entries = entries;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'EntriesSpellEntry',
      'name': this.name,
      'entries': this.entries,
    }
  }
}

export class TableSpellEntry implements SpellEntry {
  caption: string;
  colLabels: string[];
  colStyles: string[];
  rows: string[][];
  constructor(caption: string, colLabels: string[], colStyles: string[], rows: string[][]) {
    this.caption = caption;
    this.colLabels = colLabels;
    this.colStyles = colStyles;
    this.rows = rows;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'TableSpellEntry',
      'caption': this.caption,
      'col-labels': this.colLabels,
      'col-styles': this.colStyles,
      'rows': this.rows,
    }
  }
}

export class ListSpellEntry implements SpellEntry {
  items: string[];
  constructor(items: string[]) {
    this.items = items;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'ListSpellEntry',
      'items': this.items,
    }
  }
}

export class InsetSpellEntry implements SpellEntry {
  source: string;
  page: number;
  name: string;
  entries: string[];
  constructor(source: string, page: number, name: string, entries: string[]) {
    this.source = source;
    this.page = page;
    this.name = name;
    this.entries = entries;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'InsetSpellEntry',
      'source': this.source,
      'page': this.page,
      'name': this.name,
      'entries': this.entries,
    }
  }
}

export function deserializeSpellEntry(serialized: { [key: string]: any }) {
  switch (serialized['==']) {
    case 'StringSpellEntry':
      return new StringSpellEntry(serialized['value']);
    case 'EntriesSpellEntry':
      return new EntriesSpellEntry(serialized['name'], serialized['entries']);
    case 'TableSpellEntry':
      return new TableSpellEntry(serialized['caption'], serialized['col-labels'], serialized['col-styles'], serialized['rows']);
    case 'ListSpellEntry':
      return new ListSpellEntry(serialized['items']);
    case 'InsetSpellEntry':
      return new InsetSpellEntry(serialized['source'], serialized['page'], serialized['name'], serialized['entries']);
    default:
      throw new Error(`Unknown spell entry type: ${serialized['==']}`);
  }
}

export class SpellScalingLevelDice {
  label: string;
  scaling: { [level: number]: string };
  constructor(label: string, scaling: { [level: number]: string }) {
    this.label = label;
    this.scaling = scaling;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'SpellScalingLevelDice',
      'label': this.label,
      'scaling': this.scaling,
    }
  }
}

function deserializeSpellScalingLevelDice(serialized: { [key: string]: any }) {
  return new SpellScalingLevelDice(serialized['label'], serialized['scaling']);
}

export type DamageType =
  | 'ACID'
  | 'BLUDGEONING'
  | 'COLD'
  | 'FIRE'
  | 'FORCE'
  | 'LIGHTNING'
  | 'NECROTIC'
  | 'PIERCING'
  | 'POISON'
  | 'PSYCHIC'
  | 'RADIANT'
  | 'SLASHING'
  | 'THUNDER'
  ;

export type SpellAttack =
  | 'RANGED'
  | 'MELEE'
  ;

export type Condition =
  | 'BLINDED'
  | 'CHARMED'
  | 'DEAFENED'
  | 'EXHAUSTION'
  | 'FRIGHTENED'
  | 'GRAPPLED'
  | 'INCAPACITATED'
  | 'INVISIBLE'
  | 'PARALYZED'
  | 'PETRIFIED'
  | 'POISONED'
  | 'PRONE'
  | 'RESTRAINED'
  | 'STUNNED'
  | 'UNCONSCIOUS'
  ;

export type CreatureType =
  | 'ABERRATION'
  | 'BEAST'
  | 'CELESTIAL'
  | 'CONSTRUCT'
  | 'DRAGON'
  | 'ELEMENTAL'
  | 'FEY'
  | 'FIEND'
  | 'GIANT'
  | 'HUMANOID'
  | 'MONSTROSITY'
  | 'OOZE'
  | 'PLANT'
  | 'SWARM_OF_MEDIUM_UNDEAD'
  | 'SWARM_OF_TINY_ABERRATIONS'
  | 'SWARM_OF_TINY_BEASTS'
  | 'SWAM_OF_TINY_CONSTRUCTS'
  | 'SWARM_OF_TINY_MONSTROSITIES'
  | 'SWARM_OF_TINY_PLANTS'
  | 'SWARM_OF_TINY_UNDEAD'
  | 'UNDEAD'
  ;

export type MiscTag =
  | 'CONCENTRATION'
  | 'VERBAL'
  | 'SOMATIC'
  | 'MATERIAL'
  | 'ROYALTY'
  | 'MATERIAL_WITH_COST'
  | 'MATERIAL_IS_CONSUMED'
  | 'MATERIAL_IS_OPTIONALLY_CONSUMED'
  | 'HEALING'
  | 'GRANTS_TEMPORARY_HIT_POINTS'
  | 'REQUIRES_SIGHT'
  | 'PERMANENT_EFFECTS'
  | 'SCALING_EFFECTS'
  | 'SUMMONS_CREATURE'
  | 'MODIFIES_AC'
  | 'TELEPORTATION'
  | 'FORCED_MOVEMENT'
  | 'ROLLABLE_EFFECTS'
  | 'CREATES_SUNLIGHT'
  | 'CREATES_LIGHT'
  | 'USES_BONUS_ACTION'
  | 'PLANE_SHIFTING'
  | 'OBSCURES_VISION'
  | 'DIFFICULT_TERRAIN'
  | 'ADDITIONAL_ATTACK_DAMAGE'
  | 'AFFECTS_OBJECTS'
  | 'BASIC_RULES'
  | 'HAS_IMAGES'
  | 'HAS_TOKEN'
  | 'RITUAL'
  | 'SRD'
  ;

export type AreaTag =
  | 'SINGLE_TARGET'
  | 'MULTIPLE_TARGETS'
  | 'CIRCLE'
  | 'CONE'
  | 'CUBE'
  | 'CYLINDER'
  | 'HEMISPHERE'
  | 'LINE'
  | 'SPHERE'
  | 'SQUARE'
  | 'WALL'
  ;

export class Spell {
  file: string;
  id: string;
  name: string;
  source: string;
  page: number;
  srd: boolean;
  basicRules: boolean;
  level: number;
  school: SpellSchool;
  time: SpellTime[];
  range: SpellRange;
  components: SpellComponents;
  duration: SpellDuration[];
  meta: SpellMeta | undefined;
  entries: SpellEntry[] | undefined;
  entriesHigherLevel: SpellEntry[] | undefined;
  scalingLevelDice: SpellScalingLevelDice[] | undefined;
  damageInflict: DamageType[] | undefined;
  spellAttack: SpellAttack[] | undefined;
  conditionInflict: Condition[] | undefined;
  savingThrow: Ability[] | undefined;
  affectsCreatureType: CreatureType[] | undefined;
  miscTags: MiscTag[] | undefined;
  areaTags: AreaTag[] | undefined;

  constructor(
    file: string,
    id: string,
    name: string,
    source: string,
    page: number,
    srd: boolean,
    basicRules: boolean,
    level: number,
    school: SpellSchool,
    time: SpellTime[],
    range: SpellRange,
    components: SpellComponents,
    duration: SpellDuration[],
    meta: SpellMeta | undefined,
    entries: SpellEntry[] | undefined,
    entriesHigherLevel: SpellEntry[] | undefined,
    scalingLevelDice: SpellScalingLevelDice[] | undefined,
    damageInflict: DamageType[] | undefined,
    spellAttack: SpellAttack[] | undefined,
    conditionInflict: Condition[] | undefined,
    savingThrow: Ability[] | undefined,
    affectsCreatureType: CreatureType[] | undefined,
    miscTags: MiscTag[] | undefined,
    areaTags: AreaTag[] | undefined
  ) {
    this.file = file;
    this.id = id;
    this.name = name;
    this.source = source;
    this.page = page;
    this.srd = srd;
    this.basicRules = basicRules;
    this.level = level;
    this.school = school;
    this.time = time;
    this.range = range;
    this.components = components;
    this.duration = duration;
    this.meta = meta;
    this.entries = entries;
    this.entriesHigherLevel = entriesHigherLevel;
    this.scalingLevelDice = scalingLevelDice;
    this.damageInflict = damageInflict;
    this.spellAttack = spellAttack;
    this.conditionInflict = conditionInflict;
    this.savingThrow = savingThrow;
    this.affectsCreatureType = affectsCreatureType;
    this.miscTags = miscTags;
    this.areaTags = areaTags;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'Spell',
      'id': this.id,
      'name': this.name,
      'source': this.source,
      'page': this.page,
      'srd': this.srd,
      'basic-rules': this.basicRules,
      'level': this.level,
      'school': this.school,
      'time': this.time.map(t => t.serialize()),
      'range': this.range.serialize(),
      'components': this.components.serialize(),
      'duration': this.duration.map(d => d.serialize()),
      'meta': this.meta?.serialize(),
      'entries': this.entries?.map(entry => entry.serialize()),
      'entries-higher-level': this.entriesHigherLevel?.map(entry => entry.serialize()),
      'scaling-level-dice': this.scalingLevelDice?.map(sld => sld.serialize()),
      'damage-inflict': this.damageInflict,
      'spell-attack': this.spellAttack,
      'condition-inflict': this.conditionInflict,
      'saving-throw': this.savingThrow?.map((ability) => ability.name),
      'affects-creature-type': this.affectsCreatureType,
      'misc-tags': this.miscTags,
      'area-tags': this.areaTags
    };
  }
}

function deserializeSpell(file: string, serialized: { [key: string]: any }) {
  return new Spell(
    file,
    serialized['id'],
    serialized['name'],
    serialized['source'],
    serialized['page'],
    serialized['srd'],
    serialized['basic-rules'],
    serialized['level'],
    serialized['school'],
    serialized['time'].map((time: { [key: string]: any }) => deserializeSpellTime(time)),
    deserializeSpellRange(serialized['range']),
    deserializeSpellComponents(serialized['components']),
    serialized['duration'].map((duration: { [key: string]: any }) => deserializeSpellDuration(duration)),
    serialized['meta'] ? deserializeSpellMeta(serialized['meta']) : undefined,
    serialized['entries'] ? serialized['entries'].map((entry: { [key: string]: any }) => deserializeSpellEntry(entry)) : undefined,
    serialized['entries-higher-level'] ? serialized['entries-higher-level'].map((entry: { [key: string]: any }) => deserializeSpellEntry(entry)) : undefined,
    serialized['scaling-level-dice'] ? serialized['scaling-level-dice'].map((sld: { [key: string]: any }) => deserializeSpellScalingLevelDice(sld)) : undefined,
    serialized['damage-inflict'],
    serialized['spell-attack'],
    serialized['condition-inflict'],
    serialized['saving-throw'],
    serialized['affects-creature-type'],
    serialized['misc-tags'],
    serialized['area-tags']
  );
}
