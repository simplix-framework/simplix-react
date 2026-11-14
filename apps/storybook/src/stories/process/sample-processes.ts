import { PROCESS_FORMAT, PROCESS_VERSION } from "@simplix-react/process-core";
import type { Act, Jump, Lane, ProcessDefinition, ProcessRunState, Section, Step } from "@simplix-react/process-core";

const define = (id: string, name: string, lanes: Lane[], sections: Section[], jumps: Jump[] = []): ProcessDefinition => ({
  format: PROCESS_FORMAT,
  version: PROCESS_VERSION,
  id,
  name,
  lanes,
  sections,
  jumps,
});

const act = (id: string, lanes: string | string[], kind: Act["kind"], label: string, extra: Partial<Act> = {}): Act => ({
  id,
  lanes: typeof lanes === "string" ? [lanes] : lanes,
  kind,
  label,
  ...extra,
});

const step = (id: string, label: string, acts: Act[], extra: Partial<Step> = {}): Step => ({ id, label, acts, ...extra });

/** A purchase request: two lane groups, a step only large purchases take, an act two lanes perform together, jumps back and ahead. */
export function purchaseRequest(): ProcessDefinition {
  return define(
    "purchase-request",
    "구매 요청",
    [
      { id: "requester", label: "요청자", group: "요청 부서" },
      { id: "manager", label: "부서장", group: "요청 부서" },
      { id: "finance", label: "재무 담당", group: "지원 부서" },
      { id: "buyer", label: "구매 담당", group: "지원 부서" },
    ],
    [
      {
        id: "request",
        label: "요청과 승인",
        steps: [
          step("draft", "구매 요청서 작성", [act("write", "requester", "do", "요청서 작성", { ref: "screen:request-form" }), act("review", "manager", "check", "필요성 검토")]),
          step("budget", "예산 확인", [act("budget-check", "finance", "check", "예산 잔액 확인")], { condition: { fact: "large" }, conditionLabel: "100만 원 이상 구매" }),
          step("approve", "구매 승인", [act("sign", "manager", "check", "승인 서명")]),
        ],
      },
      {
        id: "order",
        label: "발주와 검수",
        steps: [
          step("quote", "견적 비교", [act("collect", "buyer", "do", "견적서 수집"), act("compare", ["buyer", "requester"], "do", "견적 비교 회의")]),
          step("place", "발주", [act("order", "buyer", "do", "발주서 발행")]),
          step("receive", "검수와 지급", [act("inspect", "requester", "check", "납품 검수"), act("pay", "finance", "do", "대금 지급")]),
        ],
      },
    ],
    [
      { id: "rework", from: "approve", to: "draft", label: "보완 요청" },
      { id: "requote", from: "receive", to: "quote", label: "검수 불합격" },
      { id: "direct", from: "draft", to: "place", label: "단가 계약 품목" },
    ],
  );
}

/** An equipment inspection: a parallel run, a repeating step, a step only a defect brings in, a jump ahead and a jump out. */
export function equipmentInspection(): ProcessDefinition {
  return define(
    "equipment-inspection",
    "장비 정기 점검",
    [
      { id: "operator", label: "운전 담당" },
      { id: "inspector", label: "점검 담당" },
      { id: "maintenance", label: "정비 담당" },
      { id: "safety", label: "안전 담당" },
    ],
    [
      {
        id: "prepare",
        label: "점검 준비",
        steps: [
          step("plan", "점검 일정 확정", [act("schedule", "inspector", "do", "점검 일정 통보")]),
          step("lockout", "장비 정지와 차단", [act("isolate", "operator", "do", "전원 차단"), act("verify", "safety", "check", "차단 상태 확인")], { parallel: "ready" }),
          step("tools", "공구와 부품 준비", [act("stage", "maintenance", "do", "공구 · 예비 부품 준비")], { parallel: "ready" }),
        ],
      },
      {
        id: "inspect",
        label: "점검과 조치",
        steps: [
          step("reading", "측정값 기록", [act("measure", "inspector", "do", "항목별 측정")], { repeat: { endedBy: "close" }, note: "항목마다 한 번씩 기록" }),
          step("repair", "결함 조치", [act("fix", "maintenance", "do", "부품 교체"), act("retest", "inspector", "check", "재측정")], { condition: { fact: "defect" }, conditionLabel: "결함이 있을 때" }),
          step("close", "점검 종료", [act("release", "operator", "do", "장비 재가동"), act("sign-off", "safety", "check", "종료 확인")]),
        ],
      },
    ],
    [
      { id: "no-defect", from: "reading", to: "close", label: "결함 없음" },
      { id: "escalate", from: "repair", external: "사고 보고", label: "중대 결함" },
    ],
  );
}

/** A document review in one lane group with three jumps into one step. */
export function documentReview(): ProcessDefinition {
  return define(
    "document-review",
    "문서 검토",
    [
      { id: "author", label: "작성자" },
      { id: "reviewer", label: "검토자" },
      { id: "approver", label: "승인자" },
    ],
    [
      {
        id: "review",
        label: "검토",
        steps: [
          step("write", "초안 작성", [act("draft", "author", "do", "초안 작성")]),
          step("check", "내용 검토", [act("read", "reviewer", "check", "내용 검토")]),
          step("legal", "법무 검토", [act("legal-read", "reviewer", "check", "법무 검토")], { condition: { fact: "contract" }, conditionLabel: "계약 문서" }),
          step("approve", "승인", [act("sign", "approver", "check", "승인")]),
          step("publish", "배포", [act("post", "author", "do", "게시")]),
        ],
      },
    ],
    [
      { id: "fix-content", from: "check", to: "write", label: "내용 보완" },
      { id: "fix-legal", from: "legal", to: "write", label: "조항 수정" },
      { id: "reject", from: "approve", to: "write", label: "반려" },
    ],
  );
}

/** One lane and no jump: the least a procedure can be. */
export function singleLane(): ProcessDefinition {
  return define("checklist", "일일 점검", [{ id: "owner", label: "담당자" }], [
    { id: "day", label: "일일 점검", steps: [step("open", "개시 점검", [act("open-check", "owner", "do", "개시 점검")]), step("close", "마감 점검", [act("close-check", "owner", "do", "마감 점검")])] },
  ]);
}

/** A definition with sections and no step. */
export function emptyProcess(): ProcessDefinition {
  return define("empty", "빈 절차", [{ id: "owner", label: "담당자" }], [{ id: "only", label: "구간", steps: [] }]);
}

/** Labels long enough to wrap in every lane, in Korean and in English. */
export function longLabels(): ProcessDefinition {
  return define(
    "long-labels",
    "긴 이름이 있는 절차",
    [
      { id: "a", label: "대외협력과 홍보를 함께 맡는 부서의 담당자" },
      { id: "b", label: "Regional operations and compliance coordinator" },
      { id: "c", label: "검토" },
    ],
    [
      {
        id: "s",
        label: "이름이 아주 긴 구간: 여러 부서가 차례로 확인하고 다시 돌려보내는 과정",
        steps: [
          step("t1", "외부 기관에 보낼 공문 초안을 작성하고 첨부 자료의 목록을 정리한다", [
            act("x1", "a", "do", "공문 초안 작성과 첨부 자료 목록 정리"),
            act("x2", "b", "check", "Review the draft against the regional compliance checklist"),
          ]),
          step("t2", "Supercalifragilisticexpialidocious-identifier-without-any-space", [act("x3", "c", "check", "띄어쓰기없이아주길게이어붙인낱말하나로된행위이름")], {
            condition: { fact: "f" },
            conditionLabel: "외부 기관이 회신 기한을 따로 정해 통보한 경우",
          }),
        ],
      },
    ],
    [{ id: "j", from: "t2", to: "t1", label: "기한 안에 회신하지 못해 초안부터 다시 작성하는 경우" }],
  );
}

/** A wide and tall procedure: fourteen lanes, forty steps, jumps of every length. */
export function largeProcess(): ProcessDefinition {
  const lanes: Lane[] = Array.from({ length: 14 }, (_, index) => ({ id: `l${index}`, label: `담당 ${index + 1}`, group: `부문 ${Math.floor(index / 5) + 1}` }));
  const sections: Section[] = Array.from({ length: 5 }, (_, s) => ({
    id: `s${s}`,
    label: `구간 ${s + 1}`,
    steps: Array.from({ length: 8 }, (_, t) => {
      const index = s * 8 + t;
      return step(
        `t${index}`,
        `단계 ${index + 1}`,
        Array.from({ length: 1 + (index % 3) }, (_, a) => act(`a${index}-${a}`, `l${(index * 3 + a * 5) % 14}`, a === 0 ? "do" : "check", `행위 ${index + 1}-${a + 1}`)),
      );
    }),
  }));
  const jumps: Jump[] = [
    { id: "j1", from: "t5", to: "t2", label: "보완" },
    { id: "j2", from: "t12", to: "t4", label: "재검토" },
    { id: "j3", from: "t9", to: "t20", label: "간이 절차" },
    { id: "j4", from: "t30", to: "t22", label: "재시험" },
    { id: "j5", from: "t38", to: "t10", label: "처음부터 다시" },
    { id: "j6", from: "t33", to: "t36", label: "생략" },
  ];
  return define("large", "큰 절차", lanes, sections, jumps);
}

/** A purchase request two steps in: the approval is waiting on the department head. */
export function purchaseRunning(): ProcessRunState {
  return {
    steps: {
      draft: { status: "done", assignee: "김하늘" },
      budget: { status: "done", assignee: "박서준" },
      approve: { status: "active", assignee: "이도윤 부서장" },
      quote: { status: "pending" },
      place: { status: "pending" },
      receive: { status: "pending" },
    },
    acts: { write: { status: "done" }, review: { status: "done" }, "budget-check": { status: "done" }, sign: { status: "active", assignee: "이도윤 부서장" } },
  };
}

/** A finished inspection: the repair was skipped and the readings were recorded six times. */
export function inspectionFinished(): ProcessRunState {
  return {
    steps: {
      plan: { status: "done" },
      lockout: { status: "done" },
      tools: { status: "done" },
      reading: { status: "done", count: 6 },
      repair: { status: "skipped" },
      close: { status: "done", assignee: "최지우" },
    },
  };
}
