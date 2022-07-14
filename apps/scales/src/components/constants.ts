export type ChromaticNotes = typeof chromaticNotes
export type ChromaticNote = ChromaticNotes[number]

export const chromaticNotes = [
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
  'C',
  'C#',
  'D',
  'D#',
] as const

const notePermutations = [
  ['C', 'C#', 'Cb'],
  ['D', 'D#', 'Db'],
  ['E', 'E#', 'Eb'],
  ['F', 'F#', 'Fb'],
  ['G', 'G#', 'Gb'],
  ['A', 'A#', 'Ab'],
  ['B', 'B#', 'Bb'],
] as const

export const allNotes = notePermutations.flat()

export const dotIndices = [0, 3, 5, 7, 9]

export type StringNote = Extract<ChromaticNote, 'E' | 'A' | 'D' | 'G' | 'B'>

export const stringNotes: StringNote[] = ['E', 'A', 'D', 'G', 'B', 'E']
