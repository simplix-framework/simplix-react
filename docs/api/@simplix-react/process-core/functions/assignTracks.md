[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / assignTracks

# Function: assignTracks()

> **assignTracks**(`ranges`): `number`[]

Defined in: [packages/process-core/src/tracks.ts:15](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/tracks.ts#L15)

Gives every range a track so that two ranges sharing a row never share a track.

Shorter ranges are placed first and take the lowest free track, which keeps short jumps on the
inner tracks and the number of tracks at the most ranges that overlap in one row.

## Parameters

### ranges

readonly [`TrackRange`](../interfaces/TrackRange.md)[]

## Returns

`number`[]

the track of each range, in the order the ranges were given
