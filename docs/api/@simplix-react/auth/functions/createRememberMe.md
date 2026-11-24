[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/auth](../README.md) / createRememberMe

# Function: createRememberMe()

> **createRememberMe**(`namespace`): [`RememberMe`](../interfaces/RememberMe.md)

Defined in: [packages/auth/src/remember-me.ts:33](https://github.com/simplix-framework/simplix-react/blob/main/packages/auth/src/remember-me.ts#L33)

The stay-signed-in preference and the token store that answers to it.

<p><b>One implementation, one namespace per app.</b> Written out per app it was written three
times and two of them still carried the namespace of the console this one was replicated from —
so the worker app and the kiosk app wrote their preference to the same key, under a third
product's name. Nothing errors when two apps share a preference key; they simply agree about
something they were never asked to agree about.

<p><b>The preference is deliberately outside the token store's own prefix.</b> Signing out
clears that prefix by sweeping every key under it, and this is not a token — it is what decides
which backing the NEXT token pair goes to. Kept alongside them it would be erased by the one act
it has to survive, and every sign-out would silently return the box to unchecked on the screen
the operator was just sent back to (frontend invariant #59).

## Parameters

### namespace

`string`

the app's own name, which is what keeps two apps' preferences apart

## Returns

[`RememberMe`](../interfaces/RememberMe.md)

the store and the two readers of the preference
