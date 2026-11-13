import { buildModuleTranslations, registerModuleTranslations } from "@simplix-react/i18n";

/**
 * i18next namespace every chart component translates against. The module
 * registers under `"simplix-gantt"` and its components read the
 * `"simplix-gantt/gantt"` bundle.
 */
export const PACKAGE_NAMESPACE = "simplix-gantt/gantt";

const translations = buildModuleTranslations({
  namespace: "simplix-gantt",
  locales: ["en", "ko", "ja"],
  components: {
    gantt: {
      en: () => import("./en.json"),
      ko: () => import("./ko.json"),
      ja: () => import("./ja.json"),
    },
  },
});

registerModuleTranslations(translations);
