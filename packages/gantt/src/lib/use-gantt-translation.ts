import { useTranslation } from "@simplix-react/i18n/react";

import { PACKAGE_NAMESPACE } from "../locales";

/** Chart-scoped translation hook: the translate function and the active language tag. */
export function useGanttTranslation() {
  const { t, locale } = useTranslation(PACKAGE_NAMESPACE);
  return { t, language: locale };
}
