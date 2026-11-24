[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/i18n](../README.md) / formatKoreanParticle

# Function: formatKoreanParticle()

> **formatKoreanParticle**(`value`, `lng`, `options`): `string`

Defined in: [app/korean-particle.ts:172](https://github.com/simplix-framework/simplix-react/blob/main/app/korean-particle.ts#L172)

The i18next formatter behind `{{value, josa(을/를)}}`: the value followed by the form of the
particle its last sound calls for, so a Korean catalogue writes 「{{plan, josa(을/를)}} 계속 씁니다」
and renders 「Pro를 계속 씁니다」 or 「Team을 계속 씁니다」.

## Parameters

### value

`unknown`

the interpolated value

### lng

the language the sentence is rendered in

`string` | `undefined`

### options

the format options i18next passes, the particle pair among their names

`Readonly`\<`Record`\<`string`, `unknown`\>\> | `undefined`

## Returns

`string`

the value with its particle in Korean, the value alone otherwise

## Remarks

The particle is the option's NAME, never the value of a keyed option: i18next spreads the
call's interpolation values over the format options, so a keyed option is overwritten by any
value of the same name, and a Hangul pair is a name no value carries. Exactly one registered
pair ([KOREAN\_PARTICLE\_NAMES](../variables/KOREAN_PARTICLE_NAMES.md)) must be named; anything else throws, which i18next logs
and answers with the bare value. Outside Korean the value is returned unchanged, so a Korean
sentence rendered under another language's fallback never gains a Hangul particle.
