[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CodeInput

# Function: CodeInput()

> **CodeInput**(`__namedParameters`): `Element`

Defined in: [packages/ui/src/base/inputs/code-input.tsx:61](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/code-input.tsx#L61)

Renders a one-time code entered one digit per square cell.

## Parameters

### \_\_namedParameters

[`CodeInputProps`](../interfaces/CodeInputProps.md)

## Returns

`Element`

## Remarks

Typing a digit fills the cell and moves on; Backspace on an empty cell moves back and clears that
cell; the arrow keys move between cells; a pasted or autofilled code fills every cell. The focus
never lands past the first empty cell, so the code stays contiguous. The first cell asks the
browser for `one-time-code` autofill. The cells shrink evenly in a narrow container.

## Example

```tsx
import { useState } from "react";
import { CodeInput } from "@simplix-react/ui";

export function VerifyStep({ onVerify }: { onVerify: (code: string) => void }) {
  const [code, setCode] = useState("");
  return <CodeInput label="Verification code" value={code} onValueChange={setCode} onComplete={onVerify} />;
}
```

## See

[codeType](codeType.md), [codeBackspace](codeBackspace.md), [codePaste](codePaste.md) for the editing rules it applies.
