export interface ConfigurationSerializable {
  serialize(): { [key: string]: any };
}