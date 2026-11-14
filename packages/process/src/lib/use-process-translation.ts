import { useTranslation } from "@simplix-react/i18n/react";

import { PACKAGE_NAMESPACE } from "../locales";

/** The translate function of this package's own wording. */
export function useProcessTranslation() {
  const { t } = useTranslation(PACKAGE_NAMESPACE);
  return t;
}
