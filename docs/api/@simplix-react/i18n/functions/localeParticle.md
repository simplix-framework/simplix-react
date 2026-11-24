[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/i18n](../README.md) / localeParticle

# Function: localeParticle()

> **localeParticle**(`locale`, `word`, `particle`): `string`

Defined in: [app/korean-particle.ts:135](https://github.com/simplix-framework/simplix-react/blob/main/app/korean-particle.ts#L135)

The form of a particle to write after this word on THIS screen's language.

<p><b>A particle is Korean grammar, and the sentence around it is not always Korean.</b> The
same catalogue key carries `{{particle}}` in every language (it has to, or the value is dropped
in silence in the ones that lack it), so what changes per language is the value, and outside
Korean the value is nothing. Passing 「와」 into an English sentence is the failure this avoids,
and it is invisible until somebody reads the console in English.

## Parameters

### locale

the language the sentence is being written in

`string` | `undefined`

### word

the word the particle follows

`string` | `number` | `null` | `undefined`

### particle

[`KoreanParticle`](../type-aliases/KoreanParticle.md)

one of [KOREAN\_PARTICLES](../variables/KOREAN_PARTICLES.md)

## Returns

`string`

the form to write after that word, or an empty string outside Korean
