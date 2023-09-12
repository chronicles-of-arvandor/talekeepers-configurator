let baseDirectory = '/home/ren/Documents/arvandor/talekeeper-configs';

export const setBaseDirectory = (directory: string) => {
  baseDirectory = directory;
}

export const getBaseDirectory = () => {
  return baseDirectory;
}