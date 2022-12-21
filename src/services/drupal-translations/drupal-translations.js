import { DrupalService } from "../drupal-client/client.service";

export class DrupalTranslations {
  async fetchTranslations() {
    const data = await DrupalService.getTranslations({
      withCache: true,
      cacheKey: "i18n_locale_translations",
    });
    return data;
  }

  formatTranslationsForNextIntlProvider(resources = []) {
    const obj = {};
    resources.forEach((element) => {
      obj[element.source] = element.translation;
    });
    return obj;
  }

  async getTranslations() {
    let translations = {};
    const response = await this.fetchTranslations();
    return new Promise((resolve, reject) => {
      try {
        response.resources.forEach((t) => {
          translations[t.locale] = this.formatTranslationsForNextIntlProvider(
            t.translations
          );
        });
      } catch (error) {
        reject(error);
      }
      resolve(translations);
    });
  }
}
