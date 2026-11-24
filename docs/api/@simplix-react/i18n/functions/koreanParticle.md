[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/i18n](../README.md) / koreanParticle

# Function: koreanParticle()

> **koreanParticle**(`word`, `particle`): `string`

Defined in: [app/korean-particle.ts:109](https://github.com/simplix-framework/simplix-react/blob/main/app/korean-particle.ts#L109)

Picks the form of a particle that follows this word.

## Parameters

### word

the word the particle follows

`string` | `number` | `null` | `undefined`

### particle

[`KoreanParticle`](../type-aliases/KoreanParticle.md)

one of [KOREAN\_PARTICLES](../variables/KOREAN_PARTICLES.md)

## Returns

`string`

the form to write after that word

## Remarks

Korean chooses between two forms by whether the word ends in a final consonant. A value
interpolated into a sentence (a plan, a name, an address, an amount) is not known when the
sentence is written, so the sentence names the particle it wants and this decides which of its
two forms the value calls for.

<p>The word is read from its end, skipping what is not pronounced (quotes, brackets, stops).
A Hangul syllable answers by its final consonant. A digit answers by its Korean reading
(`2` 이 and `9` 구 end in a vowel, `3` 삼 in a consonant, `1` 일 in ㄹ). A Latin letter is read
by its name, so only `l` 엘, `m` 엠, `n` 엔 and `r` 알 end in a consonant: `PDF` takes 가 and
`KPM` takes 이. `+`, `%` and `&` are read 플러스, 퍼센트 and 앤드. An amount led by `₩` is read
with 원 and one led by `$` with 달러. A word with nothing to read takes the vowel form.

<p>ㄹ sides with the vowels for 으로/로 alone: 서울로, but 서울을.

<p>Letters are read by name, never as an English word, because the spelling does not settle
the reading: a name the reader says as a word ("Book" 북) gets the form its last letter's name
calls for, and a sentence that cannot accept that does not put a particle behind such a name.

## Example

```ts
import { KOREAN_PARTICLES, koreanParticle } from "@simplix-react/i18n";

koreanParticle("Pro", KOREAN_PARTICLES.object); // "를"
koreanParticle("Team", KOREAN_PARTICLES.toward); // "으로"
```
