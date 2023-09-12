import { ConfigurationSerializable } from './configurationSerializable';

type DistanceUnit = 'FEET';

export class Distance implements ConfigurationSerializable {
  value: number;
  unit: DistanceUnit;

  constructor(value: number, unit: DistanceUnit) {
    this.value = value;
    this.unit = unit;
  }

  serialize(): { [key: string]: any } {
    return {
      '==': 'Distance',
      'value': this.value,
      'unit': this.unit
    }
  }
}