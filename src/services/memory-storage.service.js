/**
 * # Test
- Limit on devices
- Large menu & translations
 */
import { MMKV } from "react-native-mmkv";

export const memoryStorage = new MMKV();

export class MemoryStorageService {
  static get storage() {
    return memoryStorage
  }
  static getItem = (key) => {
    const value = memoryStorage.getString(key);
    return value ? JSON.parse(value) || null : null;
  };

  static setItem = (key, value) => {
    memoryStorage.set(key, JSON.stringify(value));
  };

  static removeItem = (key) => {
    memoryStorage.delete(key);
  };
}
