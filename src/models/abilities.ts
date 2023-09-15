export class Ability {
  name: string;
  displayName: string;
  shortName: string;

  private constructor(name: string, displayName: string, shortName: string) {
    this.name = name;
    this.displayName = displayName;
    this.shortName = shortName;
  }

  static STRENGTH = new Ability('STRENGTH', 'Strength', 'STR');
  static DEXTERITY = new Ability('DEXTERITY', 'Dexterity', 'DEX');
  static CONSTITUTION = new Ability('CONSTITUTION', 'Constitution', 'CON');
  static INTELLIGENCE = new Ability('INTELLIGENCE', 'Intelligence', 'INT');
  static WISDOM = new Ability('WISDOM', 'Wisdom', 'WIS');
  static CHARISMA = new Ability('CHARISMA', 'Charisma', 'CHA');

  static getByName(name: string) {
    switch (name) {
      case 'STRENGTH': return Ability.STRENGTH;
      case 'DEXTERITY': return Ability.DEXTERITY;
      case 'CONSTITUTION': return Ability.CONSTITUTION;
      case 'INTELLIGENCE': return Ability.INTELLIGENCE;
      case 'WISDOM': return Ability.WISDOM;
      case 'CHARISMA': return Ability.CHARISMA;
      default: throw new Error(`Unknown ability name: ${name}`);
    }
  }
}