import React from 'react'

import styled from '@emotion/styled'
import * as tonal from '@tonaljs/tonal'
import { z } from 'zod'

import type { NextPage } from 'next'
import Head from 'next/head'
import { isThemeKey } from '@aacc/design-tokens'
import {
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'

import { useRootTheme } from '../src/providers'
import { Fretboard } from '../src/components'

import { allNotes } from '../src/components/constants'

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--aacc-spacing-4);
`

const Container = styled.div`
  padding: 0 2rem;
`

const Main = styled.main`
  min-height: 100vh;
  padding: 4rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const FormControls = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
`

const FretboardContainer = styled.div`
  background-color: var(--aacc-colors-background-surface);
  padding: var(--aacc-spacing-4);
  padding-bottom: 0;
  margin-bottom: var(--aacc-spacing-4);
  border-radius: var(--aacc-shape-borderRadius-medium);
`

const DisplaySchema = z.union([z.literal('notes'), z.literal('degrees')])

type Display = z.infer<typeof DisplaySchema>

const FretboardStateSchema = z.object({
  rootNote: z.string(),
  scaleName: z.string(),
  display: DisplaySchema,
  intervals: z.string().array(),
  notes: z.string().array(),
  selectedNotes: z
    .object({
      note: z.string(),
      interval: z.string(),
      selected: z.boolean(),
    })
    .array(),
})

const PartialFretboardStateSchema = FretboardStateSchema.partial()

const FretboardsStateSchema = FretboardStateSchema.array()
const PartialFretboardsStateSchema = PartialFretboardStateSchema.array()

type FretboardState = z.infer<typeof FretboardStateSchema>
type PartialFretboardState = z.infer<typeof PartialFretboardStateSchema>
type FretboardsState = z.infer<typeof FretboardsStateSchema>

type CommonActionPayload = {
  fretboardIndex: number
}

type FretboardAction =
  | { type: 'ADD_FRETBOARD' }
  | { type: 'DISPLAY'; payload: { display: Display } & CommonActionPayload }
  | { type: 'ROOT_NOTE'; payload: { rootNote: string } & CommonActionPayload }
  | { type: 'SCALE_NAME'; payload: { scaleName: string } & CommonActionPayload }
  | {
      type: 'SELECTED_NOTES'
      payload: { noteIndex: number } & CommonActionPayload
    }
  | { type: 'SET_FRETBOARDS'; payload: FretboardsState }

const defaultDisplay = 'notes'
const defaultRootNote = 'C'
const defaultScaleName = 'major'

const urlStateKey = 'fretboards'
const initialState: FretboardsState = [getFretboard()]

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

function getFretboard(state?: PartialFretboardState): FretboardState {
  const display = state?.display ?? defaultDisplay
  const rootNote = state?.rootNote ?? defaultRootNote
  const scaleName = state?.scaleName ?? defaultScaleName

  const intervals = getIntervals(scaleName)
  const notes = getNotes(rootNote, intervals)

  return {
    display,
    rootNote,
    scaleName,
    intervals,
    notes,
    selectedNotes: state?.selectedNotes ?? getSelectedNotes(notes, intervals),
  }
}

const updateFretboard = (
  fretboardIndex: number,
  fretboards: FretboardsState,
  next: PartialFretboardState = {},
): FretboardsState => {
  const nextFretboards = Array.from(fretboards)

  const fretboard = fretboards[fretboardIndex]

  nextFretboards[fretboardIndex] = getFretboard({
    display: next.display ?? fretboard?.display,
    rootNote: next.rootNote ?? fretboard?.rootNote,
    scaleName: next.scaleName ?? fretboard?.scaleName,
  })

  return nextFretboards
}

function reducer(
  state: FretboardsState,
  action: FretboardAction,
): FretboardsState {
  const nextState = (() => {
    switch (action.type) {
      case 'DISPLAY':
        return updateFretboard(action.payload.fretboardIndex, state, {
          display: action.payload.display,
        })
      case 'ROOT_NOTE':
        return updateFretboard(action.payload.fretboardIndex, state, {
          rootNote: action.payload.rootNote,
        })
      case 'SCALE_NAME':
        return updateFretboard(action.payload.fretboardIndex, state, {
          scaleName: action.payload.scaleName,
        })
      case 'SELECTED_NOTES': {
        const nextFretboards = Array.from(state)

        const fretboard = nextFretboards[action.payload.fretboardIndex]!
        const toggleIndex = action.payload.noteIndex

        nextFretboards[action.payload.fretboardIndex] = {
          ...fretboard,
          selectedNotes: Array.from(fretboard?.selectedNotes ?? []).map(
            (selectedNote, i) =>
              i === toggleIndex
                ? { ...selectedNote, selected: !selectedNote.selected }
                : selectedNote,
          ),
        }

        return nextFretboards
      }
      case 'ADD_FRETBOARD': {
        return [...state, getFretboard()]
      }
      case 'SET_FRETBOARDS': {
        return action.payload
      }
      default:
        return state
    }
  })()

  setUrlState(nextState)

  return nextState
}

const Home: NextPage = function Home() {
  const { themeKey, themeKeys, setThemeKey } = useRootTheme()

  const [loading, setLoading] = React.useState(true)
  const [fretboards, dispatch] = React.useReducer(reducer, initialState)

  React.useEffect(() => {
    const urlState = getUrlState()

    if (urlState) {
      dispatch({
        type: 'SET_FRETBOARDS',
        payload: urlState,
      })
    }

    setLoading(false)
  }, [])

  return (
    <Container>
      <Head>
        <title>Home</title>
        <meta
          name="description"
          content="Guitar scale generator for notes and intervals training"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <Header>
        <Button
          onClick={() =>
            dispatch({ type: 'SET_FRETBOARDS', payload: initialState })
          }
        >
          AACC Scales
        </Button>
        <FormControl
          sx={{ minWidth: 120 }}
          size="small"
        >
          <InputLabel id="aacc-theme-select-label">Theme</InputLabel>
          <Select
            labelId="aacc-theme-select-label"
            id="aacc-theme-select"
            value={themeKey}
            label="Theme"
            onChange={(e) =>
              isThemeKey(e.target.value)
                ? setThemeKey(e.target.value)
                : themeKey
            }
          >
            {themeKeys.map((theme) => (
              <MenuItem
                key={theme}
                value={theme}
              >
                {theme}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Header>

      <Main>
        {loading
          ? 'loading...'
          : fretboards.map((fretboard, fretboardIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <FretboardContainer key={fretboardIndex}>
                <FormControls>
                  <FormControl
                    sx={{ minWidth: 120 }}
                    size="small"
                  >
                    <InputLabel id="aacc-display-select-label">
                      Display
                    </InputLabel>
                    <Select
                      labelId="aacc-display-select-label"
                      id="aacc-display-select"
                      value={fretboard.display}
                      label="Display"
                      onChange={(e) =>
                        dispatch({
                          type: 'DISPLAY',
                          payload: {
                            fretboardIndex,
                            display: e.target.value as Display,
                          },
                        })
                      }
                    >
                      {['notes', 'degrees'].map((value) => (
                        <MenuItem
                          key={value}
                          value={value}
                        >
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    sx={{ minWidth: 120 }}
                    size="small"
                  >
                    <InputLabel id="aacc-root-note-select-label">
                      Root note
                    </InputLabel>
                    <Select
                      labelId="aacc-root-note-select-label"
                      id="aacc-root-note-select"
                      value={fretboard.rootNote}
                      label="Root note"
                      onChange={(e) =>
                        dispatch({
                          type: 'ROOT_NOTE',
                          payload: {
                            fretboardIndex,
                            rootNote: e.target.value,
                          },
                        })
                      }
                    >
                      {allNotes.map((note) => (
                        <MenuItem
                          key={note}
                          value={note}
                        >
                          {note}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    sx={{ minWidth: 120 }}
                    size="small"
                  >
                    <InputLabel id="aacc-scale-name-select-label">
                      Root note
                    </InputLabel>
                    <Select
                      labelId="aacc-scale-name-select-label"
                      id="aacc-scale-name-select"
                      value={fretboard.scaleName}
                      label="Root note"
                      onChange={(e) =>
                        dispatch({
                          type: 'SCALE_NAME',
                          payload: {
                            fretboardIndex,
                            scaleName: e.target.value,
                          },
                        })
                      }
                    >
                      {tonal.ScaleType.names()
                        .sort()
                        .map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                          >
                            {name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </FormControls>
                <br />
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    Select {fretboard.display}
                  </FormLabel>
                  <FormGroup
                    row
                    aria-label="selected notes"
                  >
                    {fretboard.selectedNotes.map(
                      ({ selected, note, interval }, noteIndex) => (
                        <FormControlLabel
                          key={note}
                          label={
                            fretboard.display === 'notes' ? note : interval
                          }
                          checked={selected}
                          control={<Checkbox />}
                          onChange={() =>
                            dispatch({
                              type: 'SELECTED_NOTES',
                              payload: {
                                fretboardIndex,
                                noteIndex,
                              },
                            })
                          }
                        />
                      ),
                    )}
                  </FormGroup>
                </FormControl>
                <br />
                <br />
                <Fretboard
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${fretboard.rootNote}-${fretboard.scaleName}-${fretboardIndex}`}
                  display={fretboard.display}
                  intervals={fretboard.intervals}
                  notes={fretboard.notes}
                  selectedNotes={fretboard.selectedNotes}
                />
              </FretboardContainer>
            ))}
        <Button
          variant="outlined"
          size="small"
          onClick={() => dispatch({ type: 'ADD_FRETBOARD' })}
        >
          Add fretboard
        </Button>
      </Main>
    </Container>
  )
}

function getUrlState(): null | FretboardsState {
  const searchParams = new URLSearchParams(window.location.search)
  const urlStateHash = searchParams.get(urlStateKey)

  if (urlStateHash) {
    try {
      const partialFretboardsState = PartialFretboardsStateSchema.parse(
        JSON.parse(window.atob(decodeURIComponent(urlStateHash))),
      )

      return partialFretboardsState.map(getFretboard)
    } catch {
      return null
    }
  }

  return null
}

function setUrlState(state: FretboardsState) {
  const searchParams = new URLSearchParams(window.location.search)

  const partialFretboardsState = PartialFretboardsStateSchema.parse(
    state.map((fretboard) => ({
      display: fretboard.display,
      rootNote: fretboard.rootNote,
      scaleName: fretboard.scaleName,
      selectedNotes: fretboard.selectedNotes,
    })),
  )

  const urlStateHash = window.btoa(JSON.stringify(partialFretboardsState))

  searchParams.set(urlStateKey, encodeURIComponent(urlStateHash))

  window.history.replaceState(
    {},
    '',
    `${window.location.pathname}?${searchParams.toString()}`,
  )
}

export default Home
