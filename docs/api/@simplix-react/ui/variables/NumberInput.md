[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / NumberInput

# Variable: NumberInput

> `const` **NumberInput**: `ForwardRefExoticComponent`\<`Omit`\<[`NumberInputProps`](../interfaces/NumberInputProps.md), `"ref"`\> & `RefAttributes`\<`HTMLInputElement`\>\>

Defined in: [packages/ui/src/base/inputs/number-input.tsx:45](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/number-input.tsx#L45)

Numeric input with always-visible spinner buttons.

## Remarks

The native browser spinners (which only appear on hover/focus and differ
across browsers) are hidden and replaced with the same spinner buttons the
time picker uses. Keyboard stepping (ArrowUp/ArrowDown) still works.

<p><b>The bounds apply when a value is settled, not while it is typed.</b> The upper bound is
held on every keystroke, since no digit added later brings a value back under it. The lower
bound is held when the field loses focus, when Enter is pressed and when a spinner is pressed:
a field that clamps each keystroke makes a minimum of 60 unreachable by typing, because the
first digit typed is raised to 60 before the second can be typed.
