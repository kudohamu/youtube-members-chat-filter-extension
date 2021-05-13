import { appName } from './constants';

export function printError(err: Error) {
  console.error(`${appName} - `, err);
}
