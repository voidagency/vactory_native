import { useI18n } from "./useI18n";

export const useRTLDirection = () => {
  const { currentLocale } = useI18n();
  if (currentLocale === "ar") {
    return true;
  } else {
    return false;
  }
};
