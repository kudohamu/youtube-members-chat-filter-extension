import { appName } from '../constants/names';

export function printError(err: Error) {
  console.error(`${appName} - `, err);
}
