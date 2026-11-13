# Gantt 차트 사용 안내

`@simplix-react/gantt`로 프로젝트 일정 화면을 만들고, 계획을 저장하고, 화면 배치를 사용자별로 보관하는 방법을 설명합니다. 속성 목록과 단축키 표는 [README](../README.md)에 있습니다.

## 화면에 차트 넣기

스타일시트를 프레임워크 테마 뒤에 한 번 불러옵니다.

```css
@import "tailwindcss";
@import "@simplix-react/ui/theme.css";
@import "@simplix-react/gantt/styles.css";
```

높이가 정해진 상자 안에 `Gantt`를 넣습니다. 차트는 상자를 가득 채우고 그 안에서 스크롤합니다.

```tsx
import { Gantt } from "@simplix-react/gantt";
import type { Project } from "@simplix-react/gantt-core";

export function PlanPage({ plan }: { plan: Project }) {
  return (
    <div className="h-[720px]">
      <Gantt defaultProject={plan} />
    </div>
  );
}
```

번역은 패키지를 불러올 때 등록합니다. 앱이 i18n 설정을 만들기 전에 `@simplix-react/gantt`를 먼저 불러와 주세요.

## 계획 저장하기

사용자가 편집을 확정할 때마다 차트는 `onChange`를 호출합니다. 세 번째 인수 `changes`에는 직전 계획과 달라진 레코드만 들어 있으므로, 서버에는 이 목록만 보내면 됩니다.

```tsx
<Gantt
  defaultProject={plan}
  onChange={(project, schedule, changes) => {
    for (const change of changes) {
      if (change.entity === "task" && change.kind === "updated") saveTask(change.id, change.value);
      if (change.entity === "task" && change.kind === "removed") deleteTask(change.id);
    }
  }}
/>
```

날짜는 계획에 저장하지 않습니다. 시작일과 완료일은 `schedule`에 들어 있고, 계획을 다시 열면 엔진이 같은 값을 계산합니다.

## 다른 사용자의 변경 반영하기

서버에서 새 계획을 받으면 스토어의 `merge`로 합칩니다. `base`에는 두 쪽이 함께 출발한 계획(마지막으로 저장한 계획)을 넘깁니다.

```tsx
const store = useGanttStore();
const conflicts = store.getState().merge(lastSavedPlan, planFromServer);
```

상대만 바꾼 레코드는 그대로 받아들입니다. 양쪽이 모두 바꾼 레코드는 이쪽 값을 유지하고 `conflicts`로 돌려주므로, 앱은 이 목록으로 사용자에게 충돌을 알릴 수 있습니다. 실행 취소 기록은 유지됩니다.

## 화면 배치 보관하기

열 너비와 순서, 확대 단계, 접힌 행, 필터, 막대 설정을 통틀어 화면 배치라고 합니다. `onLayoutChange`로 받은 값을 사용자별로 저장하고, 다음에 열 때 `layout`으로 넘깁니다.

```tsx
<Gantt
  defaultProject={plan}
  layout={JSON.parse(localStorage.getItem("plan-layout") ?? "{}")}
  onLayoutChange={(layout) => localStorage.setItem("plan-layout", JSON.stringify(layout))}
/>
```

## 보기 전용으로 열기

`readOnly`를 켜면 차트는 계획을 보여 주기만 합니다. 셀 편집, 막대 드래그, 삭제를 모두 거부하고 대화 상자의 입력란을 비활성화합니다.

```tsx
<Gantt defaultProject={plan} readOnly />
```

## 필터, 정렬, 그룹

도구 모음의 더 보기 메뉴에서 고릅니다. 검색란에 입력하면 이름에 그 글자가 들어 있는 작업만 남습니다.

| 기능 | 동작 |
| --- | --- |
| 필터 | 조건에 맞는 작업과 그 상위 요약 작업을 표시합니다 |
| 정렬 | 요약 작업 아래의 작업끼리 순서를 바꾸고 개요 구조는 유지합니다 |
| 그룹 | 개요 구조를 풀고 작업을 자원, 중요 여부, 진행 상태별 머리행 아래에 모읍니다 |

필터나 정렬, 그룹이 켜져 있는 동안에는 행을 끌어 순서를 바꿀 수 없습니다. 화면의 순서가 계획의 순서와 다르기 때문입니다.

## 진행 상황 관리하기

프로젝트 정보 대화 상자에서 상태 기준일을 정하면 다음 기능을 쓸 수 있습니다.

- 타임라인에 상태 기준일을 주황색 점선으로 표시합니다.
- 진행선을 켜면 기준일을 따라 내려오다가 각 작업의 진행 지점에서 꺾이는 선을 표시합니다. 왼쪽으로 꺾이면 늦은 작업입니다.
- 「미완료 작업 재일정」은 시작하지 않은 작업을 기준일 뒤로 옮기고, 진행 중인 작업은 완료한 부분에서 중단했다가 기준일에 다시 시작하게 합니다.
- 획득 가치 열은 초기 계획에 저장된 비용을 예산으로 삼아 계획 가치, 획득 가치, 실제 비용을 표시합니다. 초기 계획을 먼저 저장해 주세요.

## 다른 보기

보기 전환 탭에서 고릅니다.

| 보기 | 내용 |
| --- | --- |
| 네트워크 다이어그램 | 작업을 상자로, 선후 관계를 선으로 그립니다 |
| 달력 | 한 달을 날짜 칸으로 나누고 그날 진행하는 작업을 표시합니다 |
| 자원 시트 | 자원의 단가, 최대 단위, 달력을 편집합니다 |
| 자원 사용 현황 | 자원별로 날짜마다 배정된 시간을 표시합니다 |
| 작업 배정 현황 | 작업별로 배정된 자원의 날짜별 시간을 표시합니다 |
| 자원 그래프 | 자원별 배정 시간과 가용 시간을 막대로 비교합니다 |

## 테스트 실행하기

단위 테스트와 컴포넌트 테스트는 `pnpm --filter @simplix-react/gantt test`로 실행합니다. 실제 브라우저 테스트는 Storybook을 먼저 실행한 뒤 다음 명령으로 실행합니다. 설치된 Google Chrome을 사용합니다.

```bash
pnpm storybook
GANTT_STORYBOOK_URL=http://localhost:6006 pnpm --filter @simplix-react/gantt test:e2e
```
