import { Buffer } from 'buffer';
import { AppContextObj } from '../@types';
import { baseAppContext } from '../constants';

// Helper function to remove trailing slashes from string
export function removeTrailingSlash(str: string) {
  return str.endsWith('/') ? str.slice(0, -1) : str;
}

/**
 *
 * @param myEnum
 * @param enumValue
 * @returns
 */
export function getEnumKeyFromValue<T extends object>(
  myEnum: T,
  enumValue: T[keyof T]
) {
  const index = Object.values(myEnum).indexOf(enumValue as T[keyof T]);
  return Object.keys(myEnum)[index];
}

/**
 *
 * @param applicationContextObj
 * @returns
 */
export function generateAppContextHash(
  applicationContextObj?: Partial<AppContextObj>
) {
  const appContextBase64 = Buffer.from(
    JSON.stringify({
      ...baseAppContext,
      ...(applicationContextObj || {}),
    })
  ).toString('base64');
  return encodeURIComponent(appContextBase64);
}
