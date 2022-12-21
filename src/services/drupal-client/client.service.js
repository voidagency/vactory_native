import { API_URL } from "@env";
import { LoggerService } from "../logger.service";
import { DrupalClient } from "./drupal";
import { MemoryStorageService } from "../memory-storage.service";

// todo: invalidation ?
export const drupalCache = {
  async set(key, value) {
    MemoryStorageService.setItem(key, value);
  },

  async get(key) {
    return MemoryStorageService.getItem(key);
  },
};

LoggerService.debug(`Initializing drupal client using ${API_URL}`);

export const DrupalService = new DrupalClient({
  cache: drupalCache,
  debug: false, // todo: configuration
  nextDrupalApi: API_URL,
});
