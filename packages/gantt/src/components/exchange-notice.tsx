import type { MspdiLoss, MspdiWarning } from "@simplix-react/gantt-core/mspdi";
import { Button, useFlatUIComponents } from "@simplix-react/ui";

import { useGanttTranslation } from "../lib/use-gantt-translation";

/** What reading or writing a Microsoft Project XML file could not carry over. */
export type ExchangeNoticeContent = { kind: "export"; losses: readonly MspdiLoss[] } | { kind: "import"; warnings: readonly MspdiWarning[] };

/** Props for {@link ExchangeNotice}. */
export interface ExchangeNoticeProps {
  notice: ExchangeNoticeContent;
  onClose: () => void;
  /** Called when the reader goes ahead with an export after seeing what it leaves out. */
  onExport: () => void;
}

/**
 * Tells the reader what a Microsoft Project XML file does not hold. Before an
 * export it lists what of the plan is left out and asks whether to go on;
 * after an import it lists what was read differently from the file.
 */
export function ExchangeNotice({ notice, onClose, onExport }: ExchangeNoticeProps) {
  const { t } = useGanttTranslation();
  const ui = useFlatUIComponents();
  const lines =
    notice.kind === "export"
      ? notice.losses.map((loss) => ({ key: loss.code, text: t(`exchange.loss.${loss.code}`, { count: loss.ids.length }) }))
      : [...countByCode(notice.warnings)].map(([code, count]) => ({ key: code, text: t(`exchange.warning.${code}`, { count }) }));
  return (
    <ui.Dialog open onOpenChange={(next) => !next && onClose()}>
      <ui.DialogContent className="max-w-lg" data-gantt-slot="exchange-notice">
        <ui.DialogHeader>
          <ui.DialogTitle>{t(`exchange.${notice.kind}Title`)}</ui.DialogTitle>
          <ui.DialogDescription>{t(`exchange.${notice.kind}Hint`)}</ui.DialogDescription>
        </ui.DialogHeader>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {lines.map((line) => (
            <li key={line.key}>{line.text}</li>
          ))}
        </ul>
        <ui.DialogFooter>
          {notice.kind === "export" ? (
            <>
              <Button variant="outline" onClick={onClose}>
                {t("exchange.cancel")}
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  onExport();
                }}
              >
                {t("exchange.export")}
              </Button>
            </>
          ) : (
            <Button onClick={onClose}>{t("dialog.close")}</Button>
          )}
        </ui.DialogFooter>
      </ui.DialogContent>
    </ui.Dialog>
  );
}

function countByCode(warnings: readonly MspdiWarning[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const warning of warnings) counts.set(warning.code, (counts.get(warning.code) ?? 0) + 1);
  return counts;
}
