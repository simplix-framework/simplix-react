[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / randomUUIDFrom

# Function: randomUUIDFrom()

> **randomUUIDFrom**(`fill`): `` `${string}-${string}-${string}-${string}-${string}` ``

Defined in: [crypto/install-random-uuid-fallback.ts:7](https://github.com/simplix-framework/simplix-react/blob/main/crypto/install-random-uuid-fallback.ts#L7)

A version 4 UUID built from `crypto.getRandomValues`, which every context has.

## Parameters

### fill

(`bytes`) => `Uint8Array`

Fills a byte array with random values; `crypto.getRandomValues` by default.

## Returns

`` `${string}-${string}-${string}-${string}-${string}` ``

A lowercase RFC 9562 version 4 UUID.
