# @simplix-react-native-ext/kiosk

[English](./README.md) | **한국어**

무인으로 운영하는 simplix-react-native 앱의 기기 제어 패키지입니다. 화면 꺼짐 방지, Android Lock Task Mode(화면 고정), 무입력 초기화 타이머, 전체 화면 네트워크 복구 오버레이를 제공합니다.

## 설치

```bash
pnpm add @simplix-react-native-ext/kiosk
```

> **사전 요구 사항:** 피어 의존성은 `@simplix-react-native/ui`, `@simplix-react/i18n`, `@react-native-community/netinfo`(>=11), `expo-keep-awake`(>=14), `expo-modules-core`(>=2), `react`(>=18), `react-native`(>=0.76)입니다.

## 사용법

```tsx
import {
  IdleResetProvider,
  NetworkRecoveryGate,
  isLockTaskAvailable,
  startLockTask,
  useKeepAwake,
} from "@simplix-react-native-ext/kiosk";
import { Stack, router } from "expo-router";
import { useEffect } from "react";

export default function KioskLayout() {
  useKeepAwake();

  useEffect(() => {
    if (isLockTaskAvailable()) void startLockTask();
  }, []);

  const backToStandby = () => router.replace("/");

  return (
    <NetworkRecoveryGate onRecovered={backToStandby}>
      <IdleResetProvider timeoutMs={60_000} onIdle={backToStandby}>
        <Stack />
      </IdleResetProvider>
    </NetworkRecoveryGate>
  );
}
```

## API 레퍼런스

### 화면 꺼짐 방지

`useKeepAwake`, `activateKeepAwakeAsync`, `deactivateKeepAwake`는 `expo-keep-awake`의 것을 그대로 다시 내보냅니다.

### Lock Task Mode

| 함수 | 설명 |
| --- | --- |
| `isLockTaskAvailable()` | Android에서 `SimplixKiosk` 네이티브 모듈이 연결되어 있을 때만 `true` |
| `startLockTask()` | 현재 액티비티를 고정합니다. MDM이나 전용 기기로 프로비저닝한 기기에서는 확인 없이 고정하고, 그렇지 않으면 Android가 최초 한 번 화면 고정 확인을 요청합니다 |
| `stopLockTask()` | 화면 고정을 해제합니다 |
| `isInLockTaskMode()` | 액티비티가 고정되어 있는지 반환합니다. Lock Task를 쓸 수 없으면 `false` |

`startLockTask`와 `stopLockTask`는 iOS에서, 그리고 네이티브 모듈이 연결되지 않았을 때 예외를 발생시키므로 `isLockTaskAvailable()`로 먼저 확인하세요.

### `IdleResetProvider`와 `useIdleReset()`

| prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `timeoutMs` | `number` | 필수 | `onIdle`을 호출하기까지의 무입력 시간 |
| `onIdle` | `() => void` | 필수 | `timeoutMs` 동안 터치가 없으면 호출합니다. 여기에서 입력 중인 내용을 버리고 대기 화면으로 돌아가세요 |
| `enabled` | `boolean` | `true` | `false`이면 타이머를 끕니다(예: 대기 화면) |
| `children` | `ReactNode` | 필수 | 앱 콘텐츠 |

하위 트리에서 터치가 일어날 때마다 시간을 처음부터 다시 셉니다. 프로바이더는 캡처 단계에서 터치를 관찰하며 응답자(responder)를 가져가지 않습니다. `useIdleReset()`은 `{ reset, pause }`를 반환합니다. `reset()`은 터치가 아닌 활동 뒤에 타이머를 다시 시작하고, `pause()`는 다음 `reset()`이나 터치가 있을 때까지 타이머를 멈춥니다(촬영 · 업로드 중). `IdleResetProvider` 밖에서 호출하면 예외를 발생시킵니다.

### `NetworkRecoveryGate`

| prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `onRecovered` | `() => void` | 없음 | 연결이 끊겼다가 다시 연결되면 호출합니다 |
| `graceMs` | `number` | `3000` | 연결이 끊긴 뒤 오버레이로 앱을 가리기까지 기다리는 시간 |
| `children` | `ReactNode` | 필수 | 앱 콘텐츠 |

이 컴포넌트는 NetInfo로 연결 상태를 확인합니다. 오버레이에는 스피너, 안내 문구, `NetInfo.refresh()`를 호출하는 다시 시도 버튼을 표시합니다.

### 타입

위 API의 props · 옵션 타입을 함께 내보냅니다. `IdleResetProviderProps`, `IdleResetContextValue` (the `{ reset, pause }` value of `useIdleReset()`), `NetworkRecoveryGateProps`.

## 플랫폼 참고 사항

- Lock Task Mode는 Android 전용입니다. iPadOS는 앱이 스스로 화면을 고정할 수 없으므로 사용법 유도(Guided Access)나 MDM 단일 앱 모드(Single App Mode)를 사용하세요.
- Lock Task 함수는 이 패키지의 Expo 네이티브 모듈(`expo-module.config.json`, Android 전용)이 필요하므로, 패키지를 설치한 뒤 개발 클라이언트나 EAS 빌드를 다시 만드세요.
- 이 패키지를 가져오면 en/ko/ja 문구를 `simplix/native-kiosk` 네임스페이스에 등록합니다.
- 컴포넌트가 NativeWind `className` 유틸리티를 사용하므로, 앱의 Tailwind `content`에 패키지의 `src` 폴더를 추가하세요.
