import { buildModuleTranslations, registerModuleTranslations } from "@simplix-react/i18n";

/**
 * i18next namespace every component of this package translates against. The module registers
 * under `"simplix-process"` and its components read the `"simplix-process/lanes"` bundle.
 */
export const PACKAGE_NAMESPACE = "simplix-process/lanes";

/** The bundle the editing components read; its texts are loaded when one of them is first drawn. */
export const EDIT_NAMESPACE = "simplix-process/edit";

const translations = buildModuleTranslations({
  namespace: "simplix-process",
  locales: ["en", "ko", "ja"],
  components: {
    lanes: {
      en: () => import("./en.json"),
      ko: () => import("./ko.json"),
      ja: () => import("./ja.json"),
    },
    edit: {
      en: () => import("./edit/en.json"),
      ko: () => import("./edit/ko.json"),
      ja: () => import("./edit/ja.json"),
    },
  },
});

registerModuleTranslations(translations);
