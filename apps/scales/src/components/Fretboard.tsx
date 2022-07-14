import React from 'react'
import styled from 'styled-components'
import * as tonal from '@tonaljs/tonal'

import {
  StringNote,
  chromaticNotes,
  dotIndices,
  stringNotes,
  allNotes,
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

const SelectContainer = styled.div`
  display: grid;
  gap: 10px;

  label {
    display: grid;
    grid-template-columns: 2fr 3fr;
  }
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

interface FretboardProps {
  numberOfFrets?: number
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

interface SelectedNote {
  note: string
  interval: string
  selected: boolean
}

interface State {
  rootNote: string
  scaleName: string
  display: Display
  intervals: string[]
  notes: string[]
  selectedNotes: SelectedNote[]
}

type Action =
  | { type: 'SCALE_NAME'; payload: string }
  | { type: 'ROOT_NOTE'; payload: string }
  | { type: 'DISPLAY'; payload: Display }
  | { type: 'INTERVALS'; payload: string[] }
  | { type: 'NOTES'; payload: string[] }
  | { type: 'SELECTED_NOTES'; payload: number }

const defaultDisplay = 'notes'
const defaultRootNote = 'C'
const defaultScaleName = 'major'

function getIntervals(scaleName: string) {
  return tonal.ScaleType.get(scaleName).intervals
}

function getNotes(rootNote: string, intervals: string[]) {
  return intervals.map(tonal.Note.transposeFrom(rootNote))
}

function getSelectedNotes(notes: string[], intervals: string[]) {
  return notes.map((note, index) => ({
    note,
    selected: true,
    interval: intervals[index]!,
  }))
}

const initializer = (state: Partial<State>): State => {
  const display = state.display || defaultDisplay
  const rootNote = state.rootNote || defaultRootNote
  const scaleName = state.scaleName || defaultScaleName

  const intervals = getIntervals(scaleName)
  const notes = getNotes(rootNote, intervals)

  return {
    display,
    rootNote,
    scaleName,
    intervals,
    notes,
    selectedNotes: getSelectedNotes(notes, intervals),
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'DISPLAY':
      return { ...state, display: action.payload }
    case 'ROOT_NOTE': {
      const rootNote = action.payload
      const scaleName = state.scaleName

      const intervals = getIntervals(scaleName)
      const notes = getNotes(rootNote, intervals)

      return {
        ...state,
        rootNote,
        scaleName,
        intervals,
        notes,
        selectedNotes: getSelectedNotes(notes, intervals),
      }
    }
    case 'SCALE_NAME': {
      const rootNote = state.rootNote
      const scaleName = action.payload

      const intervals = getIntervals(scaleName)
      const notes = getNotes(rootNote, intervals)

      return {
        ...state,
        rootNote,
        scaleName,
        intervals,
        notes,
        selectedNotes: getSelectedNotes(notes, intervals),
      }
    }
    case 'SELECTED_NOTES': {
      const rootNote = state.rootNote
      const scaleName = state.scaleName

      const intervals = getIntervals(scaleName)
      const notes = getNotes(rootNote, intervals)

      const index = action.payload

      const selectedNotes = Array.from(state.selectedNotes).map(
        (selectedNote, i) =>
          i === index
            ? { ...selectedNote, selected: !selectedNote.selected }
            : selectedNote,
      )

      return {
        ...state,
        rootNote,
        scaleName,
        intervals,
        notes,
        selectedNotes,
      }
    }
    default:
      return state
  }
}

export function Fretboard(props: FretboardProps) {
  const { numberOfFrets = 13 } = props

  const [state, dispatch] = React.useReducer(
    reducer,
    {
      display: defaultDisplay,
      rootNote: defaultRootNote,
      scaleName: defaultScaleName,
    },
    initializer,
  )

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
            note:
              state.notes.find((note) => isSameNote(fretNote, note)) ??
              fretNote,
            scaleDegree:
              state.intervals[
                state.notes.findIndex((note) => isSameNote(fretNote, note))
              ],
            active: state.notes.some(
              (note, i) =>
                isSameNote(fretNote, note) &&
                state.selectedNotes?.[i]?.selected,
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
  }, [numberOfFrets, state])

  return (
    <>
      <SelectContainer>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>
          <span>Display: </span>
          <select
            defaultValue={state.display}
            value={state.display}
            onChange={(e) =>
              dispatch({ type: 'DISPLAY', payload: e.target.value as Display })
            }
          >
            {['notes', 'degrees'].map((value) => (
              <option
                key={value}
                value={value}
              >
                {value}
              </option>
            ))}
          </select>
        </label>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>
          <span>Root note: </span>
          <select
            defaultValue={state.rootNote}
            value={state.rootNote}
            onChange={(e) =>
              dispatch({ type: 'ROOT_NOTE', payload: e.target.value })
            }
          >
            {allNotes.map((note) => (
              <option value={note}>{note}</option>
            ))}
          </select>
        </label>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>
          <span>Scale name: </span>
          <select
            defaultValue={state.scaleName}
            value={state.scaleName}
            onChange={(e) =>
              dispatch({ type: 'SCALE_NAME', payload: e.target.value })
            }
          >
            {tonal.ScaleType.names().map((name) => (
              <option value={name}>{name}</option>
            ))}
          </select>
        </label>
      </SelectContainer>
      <br />
      <div>
        {state.selectedNotes.map(({ selected, note, interval }, index) => (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control
          <label
            key={note}
            style={{ marginRight: 8 }}
          >
            <input
              type="checkbox"
              checked={selected}
              onChange={() =>
                dispatch({ type: 'SELECTED_NOTES', payload: index })
              }
            />
            {state.display === 'notes' ? note : interval}
          </label>
        ))}
      </div>
      <br />
      <Root numberOfFrets={numberOfFrets}>
        {fretboard.map((stringFrets) =>
          stringFrets.map((fretAttr, fretIndex) => {
            const firstFret = fretIndex === 0
            const content =
              state.display === 'notes' ? fretAttr.note : fretAttr.scaleDegree

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
          i === 0 ? <div /> : <FretMarker key={i}>{i}</FretMarker>,
        )}
      </Root>
    </>
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
