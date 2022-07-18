import React from 'react'
import styled from 'styled-components'
import * as tonal from '@tonaljs/tonal'

import {
  StringNote,
  chromaticNotes,
  dotIndices,
  stringNotes,
} from './constants'

const Root = styled.div<{ numberOfFrets: number }>`
  --fret-bar-color: #202020;
  --fret-bar-width: var(--aacc-spacing-1);
  // --fret-dot-color: #fff6;
  --fret-dot-color: #171717;
  --fret-dot-size: 20px;
  --dot-size: 35px;
  display: grid;
  grid-template-columns: repeat(${(props) => props.numberOfFrets}, 1fr);
  grid-template-rows: repeat(${stringNotes.length + 1}, 1fr);
`

interface FretProps {
  withString?: boolean
  withBackground?: boolean
}

const Fret = styled.div<FretProps>`
  background-color: ${(props) =>
    props.withBackground
      ? 'var(--aacc-colors-background-surface)'
      : 'transparent'};

  // FretBar
  border-right: var(--fret-bar-width) solid var(--fret-bar-color);

  display: grid;
  place-items: center;
  min-height: var(--dot-size);
  min-width: var(--dot-size);
  // padding: var(--aacc-spacing-3);

  position: relative;

  // Temp string
  ${({ withString = true }) =>
    withString &&
    `
			&::before {
				content: '';
				position: absolute;
				top: 50%;
				left: 0;
				z-index: 0;
				transform: translateY(-50%);
				height: var(--aacc-spacing-1);
				width: 100%;
				background-color: var(--fret-bar-color);
			}
	`}
`

const FretMarker = styled.div`
  display: grid;
  justify-items: center;
  padding: var(--aacc-spacing-1);
`

const FretDot = styled.div`
  border-radius: 50%;
  width: var(--fret-dot-size);
  height: var(--fret-dot-size);
  background-color: var(--fret-dot-color);

  position: absolute;
  bottom: calc((var(--fret-dot-size) / 2) * -1);
  transform: translateX(-50%);
  left: 50%;
  z-index: 1;
`

interface DotProps {
  color?: 'info' | 'active'
}

const Dot = styled.div<DotProps>`
  --dot-color: ${(props) => {
    switch (props.color) {
      case 'active':
        return 'var(--aacc-colors-primary-main)'
      case 'info':
        return '#0050b1'
      default:
        return '#6d6d6d'
    }
  }};
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
  word-break: break-word;
  margin: var(--aacc-spacing-2);
  padding: var(--aacc-spacing-1);
  background-color: var(--dot-color);
  width: var(--dot-size);
  height: var(--dot-size);
  border-radius: 50%;
`

type Display = 'notes' | 'degrees'

interface SelectedNote {
  note: string
  interval: string
  selected: boolean
}

interface FretboardProps {
  numberOfFrets?: number
  display: Display
  intervals: string[]
  notes: string[]
  selectedNotes: SelectedNote[]
}

type FretDots = 0 | 1 | 2

interface FretAttrs {
  id: string
  stringNote: StringNote
  note: string
  dots: FretDots
  active: boolean
  scaleDegree: string | undefined
}

type StringFrets = FretAttrs[]

type Board = StringFrets[]

export function Fretboard(props: FretboardProps) {
  const { numberOfFrets = 13, display, intervals, notes, selectedNotes } = props

  const fretboard: Board = React.useMemo(() => {
    const board: Board = []

    Array.from(stringNotes)
      .reverse()
      .forEach((stringNote, stringIndex) => {
        Array.from({ length: numberOfFrets }).forEach((_, fretIndex) => {
          const stringFrets: StringFrets =
            board[stringIndex] || (board[stringIndex] = [])

          const startingChromaticNoteIndex = chromaticNotes.indexOf(stringNote)

          const fretNote =
            chromaticNotes[
              (startingChromaticNoteIndex + fretIndex) % chromaticNotes.length
            ]!

          stringFrets[fretIndex] = {
            stringNote,
            id: `${stringNote}${fretIndex + 1}`,
            note: notes.find((note) => isSameNote(fretNote, note)) ?? fretNote,
            scaleDegree:
              intervals[notes.findIndex((note) => isSameNote(fretNote, note))],
            active: notes.some(
              (note, i) =>
                isSameNote(fretNote, note) && selectedNotes?.[i]?.selected,
            ),
            dots: getDots({
              stringIndex,
              fretIndex,
              fretModIndex: fretIndex % 12,
            }),
          }
        })
      })

    return board
  }, [intervals, notes, numberOfFrets, selectedNotes])

  return (
    <Root numberOfFrets={numberOfFrets}>
      {fretboard.map((stringFrets) =>
        stringFrets.map((fretAttr, fretIndex) => {
          const firstFret = fretIndex === 0
          const content =
            display === 'notes' ? fretAttr.note : fretAttr.scaleDegree

          return (
            <Fret
              key={fretAttr.id}
              withString={!firstFret}
              withBackground={!firstFret}
            >
              {/* Always render string note */}
              {firstFret && <Dot>{content}</Dot>}

              {!firstFret && fretAttr.active && <Dot>{content}</Dot>}

              {Array.from({ length: fretAttr.dots }, (_, i) => (
                <FretDot key={i} />
              ))}
            </Fret>
          )
        }),
      )}
      {Array.from({ length: numberOfFrets }, (_, i) =>
        i === 0 ? <div key={i} /> : <FretMarker key={i}>{i}</FretMarker>,
      )}
    </Root>
  )
}

function getDots({
  stringIndex,
  fretIndex,
  fretModIndex,
}: {
  stringIndex: number
  fretIndex: number
  fretModIndex: number
}): FretDots {
  const middleIndex = Math.floor((stringNotes.length - 1) / 2)
  const beforeMiddleIndex = middleIndex - 1
  const afterMiddleIndex = middleIndex + 1
  const octaveIndex = fretModIndex === 0

  if (fretIndex !== 0 && dotIndices.includes(fretModIndex)) {
    // Double dot (octave)
    if (
      octaveIndex &&
      (beforeMiddleIndex === stringIndex || afterMiddleIndex === stringIndex)
    ) {
      return 2
    }

    // Single dot
    if (!octaveIndex && middleIndex === stringIndex) {
      return 1
    }
  }

  return 0
}

function isSameNote(targetNote: string, compareNote: string): boolean {
  const simpleTargetNote = tonal.Note.simplify(targetNote)
  const enharmTargetNote = tonal.Note.enharmonic(simpleTargetNote)

  const simpleCompareNote = tonal.Note.simplify(compareNote)
  const enharmCompareNote = tonal.Note.enharmonic(simpleCompareNote)

  if (
    tonal.Interval.distance(simpleTargetNote, simpleCompareNote) === '1P' ||
    tonal.Interval.distance(simpleTargetNote, enharmCompareNote) === '1P' ||
    tonal.Interval.distance(enharmTargetNote, simpleCompareNote) === '1P' ||
    tonal.Interval.distance(enharmTargetNote, enharmCompareNote) === '1P'
  ) {
    return true
  }

  return false
}
