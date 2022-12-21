import { I18nManager } from "react-native";
import Constants from "expo-constants";
import dlv from "dlv";
import tmpl from "templite";
import { MemoryStorageService } from "../services/memory-storage.service";
import { TranslationsService } from "../services/drupal-translations/translations.service";

// todo: move to lib file
function rosetta({ dictionary = {}, defaultLocale = "" } = {}) {
  var locale = defaultLocale,
    tree = dictionary || {};

  return {
    store(table) {
      tree = table;
    },

    set(lang, table) {
      tree[lang] = Object.assign(tree[lang] || {}, table);
    },

    locale(lang) {
      return (locale = lang || locale);
    },

    table(lang) {
      return tree[lang];
    },

    t(key, params, lang) {
      if (val == dlv(tree[lang || locale], [key])) {
		console.info(`[I18N] Missing key ${[].concat(key).join(".")} from [${locale}] dictionary. Make sure you import this key in Drupal at /admin/config/regional/translate/import_frontend.`)
        return `[-(${locale})] ${[].concat(key).join(".")}`;
      }

      var val = dlv(tree[lang || locale], [key], key);
      if (typeof val === "function") return val(params);
      if (typeof val === "string") return tmpl(val, params);
      return val;
    },
  };
}

// get default language from app.json.
const defaultLanguage = Constants.expoConfig.extra.defaultLanguage;

export const getLanguage = () => {
  return MemoryStorageService.storage.getString("local") || defaultLanguage;
};

// Try and get translation from cache.
// todo: don't like this at all.
let defaultTranslations = MemoryStorageService.getItem(
  "i18n_locale_translations"
)
  ? JSON.parse(MemoryStorageService.getItem("i18n_locale_translations"))
  : {};
if (defaultTranslations?.resources) {
  let translations = {};
  defaultTranslations.resources.forEach((t) => {
    translations[t.locale] =
      TranslationsService.formatTranslationsForNextIntlProvider(t.translations);
  });
  defaultTranslations = translations;
}

export const i18n = rosetta({
  dictionary: defaultTranslations,
  defaultLocale: getLanguage(),
});

const isRTL = i18n.locale() === "ar";

I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);

export function initDictionary(dict) {
  i18n.store(dict);
}
