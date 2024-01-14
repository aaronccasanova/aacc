import React from 'react'

import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'

const readyStates = {
  0: 'connecting',
  1: 'open',
  2: 'closing',
  3: 'closed',
} as const

// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
type ReadyState = keyof typeof readyStates

// `readyState` alternative? Not sure about diverging from the WebSocket API
// Currently, a string literal representation of ReadyState. However, this
// could be extended to include additional custom states(e.g. 'error')
type Status = (typeof readyStates)[ReadyState]

export interface UseWebSocketOptions {
  protocols?: string | string[]
  // /**
  //  * Whether to open the WebSocket connection on mount.
  //  * See also `UseWebSocketResult.connect()`
  //  * @default true
  //  */
  // connectOnMount?: boolean
  onOpen?: (event: Event) => void
  onMessage?: (event: MessageEvent) => void
  // https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
  onClose?: (event: CloseEvent) => void
  onError?: (event: Event) => void
}

export interface UseWebSocketResult {
  webSocket: WebSocket | null
  readyState: ReadyState
  status: Status
  // TODO: These would fail safely e.g. if the socket is closed
  // Idea: Safe alternatives to instance methods
  // close: () => void
  // send: (data: string) => void
  // Useful when connectOnMount is false or you want to reconnect
  // connect: () => void
}

interface State {
  webSocket: null | WebSocket
  readyState: ReadyState
  status: Status
}

const initialState: State = {
  webSocket: null,
  readyState: 0,
  status: 'connecting',
}

type Action =
  | { type: 'connecting' }
  | { type: 'open'; webSocket: WebSocket }
  | { type: 'closing' }
  | { type: 'closed' }

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case 'connecting':
      return {
        webSocket: null,
        readyState: 0,
        status: 'connecting',
      }
    case 'open':
      return {
        webSocket: action.webSocket,
        readyState: 1,
        status: 'open',
      }
    case 'closing':
      return {
        webSocket: null,
        readyState: 2,
        status: 'closing',
      }
    case 'closed':
      return {
        webSocket: null,
        readyState: 3,
        status: 'closed',
      }
    default:
      // TODO: Should this instead be a custom error state?
      throw new Error(`Unknown action.type`)
  }
}

export function useWebSocket(
  url: string,
  options: UseWebSocketOptions,
): UseWebSocketResult {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const handleOpen = React.useRef<UseWebSocketOptions['onOpen']>()
  const handleClose = React.useRef<UseWebSocketOptions['onClose']>()
  const handleError = React.useRef<UseWebSocketOptions['onError']>()
  const handleMessage = React.useRef<UseWebSocketOptions['onMessage']>()
  // const protocols = React.useRef<UseWebSocketOptions['protocols']>()

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    handleOpen.current = options.onOpen
  }, [options.onOpen])

  useIsomorphicLayoutEffect(() => {
    handleClose.current = options.onClose
  }, [options.onClose])

  useIsomorphicLayoutEffect(() => {
    handleError.current = options.onError
  }, [options.onError])

  useIsomorphicLayoutEffect(() => {
    handleMessage.current = options.onMessage
  }, [options.onMessage])

  // useIsomorphicLayoutEffect(() => {
  //   protocols.current = options.protocols
  // }, [options.protocols])

  React.useEffect(() => {
    dispatch({ type: 'connecting' })

    const webSocket = new WebSocket(url)

    if (handleMessage.current) {
      webSocket.addEventListener('message', handleMessage.current)
    }

    webSocket.addEventListener('open', (event) => {
      dispatch({ type: 'open', webSocket })

      handleOpen.current?.(event)
    })

    webSocket.addEventListener('close', (event) => {
      dispatch({ type: 'closed' })

      handleClose.current?.(event)
    })

    webSocket.addEventListener('error', (event) => {
      // Spec'd to call the error event before the close event
      dispatch({ type: 'closing' })

      handleError.current?.(event)
    })

    return () => {
      webSocket.close()
    }
  }, [url])

  return {
    webSocket: state.webSocket,
    readyState: state.readyState,
    status: state.status,
  }
}
