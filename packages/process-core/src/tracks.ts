/** The rows a vertical line occupies, both ends included. */
export interface TrackRange {
  low: number;
  high: number;
}

/**
 * Gives every range a track so that two ranges sharing a row never share a track.
 *
 * Shorter ranges are placed first and take the lowest free track, which keeps short jumps on the
 * inner tracks and the number of tracks at the most ranges that overlap in one row.
 *
 * @returns the track of each range, in the order the ranges were given
 */
export function assignTracks(ranges: readonly TrackRange[]): number[] {
  const tracks = new Array<number>(ranges.length).fill(-1);
  const order = ranges.map((_, index) => index).sort((a, b) => ranges[a].high - ranges[a].low - (ranges[b].high - ranges[b].low) || ranges[a].low - ranges[b].low || a - b);
  for (const index of order) {
    let track = 0;
    const taken = (candidate: number): boolean =>
      order.some((other) => other !== index && tracks[other] === candidate && ranges[other].low <= ranges[index].high && ranges[index].low <= ranges[other].high);
    while (taken(track)) track += 1;
    tracks[index] = track;
  }
  return tracks;
}
