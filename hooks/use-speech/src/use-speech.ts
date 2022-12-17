import React from 'react'

// ////////////
// Shared types
// ////////////

interface UseSpeechSynthesisUtteranceProps {
  text: string
  lang: string
  rate: number
  pitch: number
  volume: number
  voice: SpeechSynthesisVoice | null
}

// ?
type Status = 'init' | 'play' | 'pause' | 'end'

// ?
export type ISpeechState = UseSpeechSynthesisOptions & {
  isPlaying: boolean
  status: Status
  // voiceInfo: VoiceInfo
}

// //////////////////
// Use speech options
// //////////////////

export interface UseSpeechOptions {
  synthesis?: UseSpeechSynthesisOptions
  // recognition: UseSpeechRecognitionOptions
}

interface UseSpeechSynthesisOptions {
  utterance?: UseSpeechSynthesisUtteranceOptions
}

interface UseSpeechSynthesisUtteranceOptions
  extends UseSpeechSynthesisUtteranceProps {
  // onBoundary: (e: SpeechSynthesisEvent) => void
  // onEnd: (e: SpeechSynthesisEvent) => void
  // onError: (e: SpeechSynthesisErrorEvent) => void
  // onMark: (e: SpeechSynthesisEvent) => void
  // onPause: (e: SpeechSynthesisEvent) => void
  // onResume: (e: SpeechSynthesisEvent) => void
  // onStart: (e: SpeechSynthesisEvent) => void
}

// //////////////
// Use speech API
// //////////////

// TODO: Consider dropping `API` from the name
export interface UseSpeechAPI {
  synthesis: UseSpeechSynthesis
  // recognition: UseSpeechRecognitionReturn
}

interface UseSpeechSynthesis {
  utterance: UseSpeechSynthesisUtterance
}

interface UseSpeechSynthesisUtterance
  extends UseSpeechSynthesisUtteranceProps,
    UseSpeechSynthesisUtterancePropSetters {
  speak: (text?: string) => void
  setUtteranceOptions: (
    options: Partial<UseSpeechSynthesisUtteranceOptions>,
  ) => void
}

// e.g. { setText(...), setLang(...), setRate(...), ... }
type UseSpeechSynthesisUtterancePropSetters = {
  [Prop in keyof UseSpeechSynthesisUtteranceProps as `set${Capitalize<Prop>}`]: (
    value: UseSpeechSynthesisUtteranceProps[Prop],
  ) => void
}

// export interface UseSpeechSynthesis
//   extends UseSpeechSynthesisOptions,
//     UseSpeechSynthesisUtterancePropSetters {

// /////////////////////////
// Use speech implementation
// /////////////////////////

declare function useSpeech(options?: UseSpeechOptions): UseSpeechAPI

export const speech = useSpeech({
  synthesis: {
    utterance: {
      text: 'Note: I can be set later or on the fly with the "speak" method',
      lang: 'en-US',
      rate: 1,
      pitch: 1,
      volume: 1,
      voice: null,
    },
  },
})

speech.synthesis.speak()

speech.synthesis.setUtteranceOptions({
  text: 'Hello world',
})

function updateUtteranceOptions(
  utterance: SpeechSynthesisUtterance,
  options?: Partial<UseSpeechSynthesisUtteranceOptions>,
) {
  Object.entries(options ?? {}).forEach(([prop, value]) => {
    if (prop in utterance && typeof value !== 'undefined') {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-param-reassign
      utterance[prop] = value
    }
  })
}

export function mockUseSpeech(options?: UseSpeechOptions): UseSpeechAPI {
  const [utterance] = React.useState<SpeechSynthesisUtterance>(() => {
    const speechSynthesisUtterance = new SpeechSynthesisUtterance()

    updateUtteranceOptions(
      speechSynthesisUtterance,
      options?.synthesis?.utterance,
    )

    return speechSynthesisUtterance
  })

  // TODO: Copy useReduce logic from:
  // /Users/aaronccasanova/projects/aacc/aacc/apps/scales/pages/index.tsx
  const handlePlay = React.useCallback(() => {
    if (!mounted.current) return

    setState((preState) => ({
      ...preState,
      isPlaying: true,
      status: 'play',
    }))
  }, [])

  React.useEffect(() => {
    console.log('utterance:', utterance)

    // Set up utterance event listeners
    // Set up utterance `status` state

    utterance.onstart = handlePlay
    utterance.onpause = handlePause
    utterance.onresume = handlePlay
    utterance.onend = handleEnd
  })

  return {
    synthesis: {
      utterance: {
        text: utterance.text,
        lang: utterance.lang,
        rate: utterance.rate,
        pitch: utterance.pitch,
        volume: utterance.volume,
        voice: utterance.voice,
        speak: (text) => {
          if (text) {
            utterance.text = text
          }

          window.speechSynthesis.speak(utterance)
        },
        setText: (text) => {
          utterance.text = text
        },
        setLang: (lang) => {
          utterance.lang = lang
        },
        setRate: (rate) => {
          utterance.rate = rate
        },
        setPitch: (pitch) => {
          utterance.pitch = pitch
        },
        setVolume: (volume) => {
          utterance.volume = volume
        },
        setVoice: (voice) => {
          utterance.voice = voice
        },
        setUtteranceOptions: (newOptions) => {
          updateUtteranceOptions(utterance, newOptions)
        },
      },
    },
  }
}

// function useSpeech(options: UseSpeechOptions): UseSpeechAPI {
//   const mounted = React.useRef<boolean>(false)

//   const [state, setState] = React.useState<ISpeechState>(() => {
//     const { lang = 'default', name = '' } = options.voice || {}

//     return {
//       isPlaying: false,
//       status: 'init',
//       lang: options.lang || 'default',
//       voiceInfo: { lang, name },
//       rate: options.rate || 1,
//       pitch: options.pitch || 1,
//       volume: options.volume || 1,
//     }
//   })

//   const handlePause = React.useCallback(() => {
//     if (!mounted.current) return

//     setState((preState) => ({
//       ...preState,
//       isPlaying: false,
//       status: 'pause',
//     }))
//   }, [])

//   const handleEnd = React.useCallback(() => {
//     if (!mounted.current) return

//     setState((preState) => ({
//       ...preState,
//       isPlaying: false,
//       status: 'end',
//     }))
//   }, [])

//   React.useEffect(() => {
//     mounted.current = true
//     const utterance = new SpeechSynthesisUtterance(text)
//     options.lang && (utterance.lang = options.lang)
//     options.voice && (utterance.voice = options.voice)
//     utterance.rate = options.rate || 1
//     utterance.pitch = options.pitch || 1
//     utterance.volume = options.volume || 1
//     utterance.onstart = handlePlay
//     utterance.onpause = handlePause
//     utterance.onresume = handlePlay
//     utterance.onend = handleEnd
//     window.speechSynthesis.speak(utterance)

//     return () => {
//       mounted.current = false
//     }
//   }, [])

//   return state
// }
