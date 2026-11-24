# @simplix-react-native-ext/kiosk

**English** | [한국어](./README.ko.md)

Device control for unattended simplix-react-native apps: keep-awake, Android Lock Task Mode (screen pinning), an idle reset timer, and a full-screen network recovery overlay.

## Installation

```bash
pnpm add @simplix-react-native-ext/kiosk
```

> **Prerequisites:** Peer dependencies: `@simplix-react-native/ui`, `@simplix-react/i18n`, `@react-native-community/netinfo` (>=11), `expo-keep-awake` (>=14), `expo-modules-core` (>=2), `react` (>=18), `react-native` (>=0.76).

## Usage

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

## API Reference

### Keep-awake

`useKeepAwake`, `activateKeepAwakeAsync` and `deactivateKeepAwake` are re-exported from `expo-keep-awake`.

### Lock Task Mode

| Function | Description |
| --- | --- |
| `isLockTaskAvailable()` | `true` only on Android when the `SimplixKiosk` native module is linked |
| `startLockTask()` | Pins the current activity. Under MDM or dedicated-device provisioning the pinning is silent; otherwise Android asks for the one-time screen-pinning confirmation |
| `stopLockTask()` | Exits screen pinning |
| `isInLockTaskMode()` | Whether the activity is pinned; `false` where Lock Task is unavailable |

`startLockTask` and `stopLockTask` throw on iOS and when the native module is not linked, so gate them with `isLockTaskAvailable()`.

### `IdleResetProvider` and `useIdleReset()`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `timeoutMs` | `number` | required | Idle window before `onIdle` |
| `onIdle` | `() => void` | required | Fires after `timeoutMs` without a touch; discard in-progress input and return to the standby screen here |
| `enabled` | `boolean` | `true` | `false` disables the timer (for example on the standby screen) |
| `children` | `ReactNode` | required | App content |

Every touch in the subtree restarts the window; the provider observes touches in the capture phase without claiming the responder. `useIdleReset()` returns `{ reset, pause }`: `reset()` restarts the timer after activity that is not a touch, and `pause()` stops it (during capture or upload) until the next `reset()` or touch. It throws outside `IdleResetProvider`.

### `NetworkRecoveryGate`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onRecovered` | `() => void` | none | Fires when connectivity returns after an outage |
| `graceMs` | `number` | `3000` | How long an outage lasts before the overlay covers the app |
| `children` | `ReactNode` | required | App content |

The gate watches connectivity with NetInfo. The overlay shows a spinner, a message and a retry button that calls `NetInfo.refresh()`.

### Types

The package exports the prop and option types of the API above: `IdleResetProviderProps`, `IdleResetContextValue` (the `{ reset, pause }` value of `useIdleReset()`), `NetworkRecoveryGateProps`.

## Platform notes

- Lock Task Mode is Android-only. iPadOS cannot pin itself; use Guided Access or MDM Single App Mode there.
- The Lock Task functions need the package's Expo native module (`expo-module.config.json`, Android only), so rebuild the development client or the EAS build after installing the package.
- The package registers its en/ko/ja strings under the `simplix/native-kiosk` namespace on import.
- Its components use NativeWind `className` utilities, so add the package `src` folder to the app's Tailwind `content`.
