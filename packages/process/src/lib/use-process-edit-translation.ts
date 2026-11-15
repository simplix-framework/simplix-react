import { useTranslation } from "@simplix-react/i18n/react";

import { EDIT_NAMESPACE } from "../locales";

/** The translate function of the editing components' own wording. */
export function useProcessEditTranslation() {
  const { t } = useTranslation(EDIT_NAMESPACE);
  return t;
}
