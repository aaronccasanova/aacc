/** @typedef {{data: {action: 'ping'; payload: number}} | {data: {action: 'rally'}}} WorkerMessage */

globalThis.addEventListener(
  'message',
  /** @param {WorkerMessage} message */
  (message) => {
    const action = message.data.action
    console.log('action:', action)

    switch (action) {
      case 'ping': {
        const payload = message.data.payload
        console.log('payload:', payload)

        globalThis.postMessage({ action: 'pong', payload: payload + 1 })
        break
      }
      case 'rally':
      default:
        globalThis.postMessage({ action: 'on' })
    }
  },
)
