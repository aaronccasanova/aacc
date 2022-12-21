import * as cr from '../src/index.js'

const runtime = cr.getRuntime()

console.log('runtime:', runtime)

const worker = new cr.Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
})

/** @typedef {{data: {action: 'pong'; payload: number}} | {data: {action: 'on'}}} MainMessage */

await new Promise((resolve, reject) => {
  worker.postMessage({ action: 'ping', payload: Math.random() })

  worker.addEventListener('error', reject)
  worker.addEventListener(
    'message',
    /** @param {MainMessage} event */
    (event) => {
      const action = event.data.action
      console.log('action:', action)

      switch (action) {
        case 'pong': {
          const payload = event.data.payload
          console.log('payload:', payload)

          worker.postMessage({ action: 'rally' })
          break
        }
        case 'on':
        default:
          worker.terminate()
          resolve(`Bye ${runtime ?? 'unknown'}!`)
      }
    },
  )
})
