# (WIP) use-websocket

Base abstraction for using WebSockets in React.

> Status: (WIP) The API is unstable and may change in the future.

## Goals

- Simplify WebSocket usage in React.
- Keep API surface small.
- Avoid opinionated abstractions.
- Encourage community abstractions.
- See [motivation](#motivation) for more details.

## Installation

```sh
npm install use-websocket
```

## Usage

### Basic (Connect on mount)

```jsx
function App() {
  const [data, setData] = React.useState([])

  const { webSocket, status } = useWebSocket(url, {
    onMessage: (e) => setData((data) => [...data, e.data]),
  })

  if (status !== 'open') return <div>Connecting...</div>

  return (
    <div>
      <button onClick={() => webSocket.send('hi')}>Greet</button>
      <ul>
        {data.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Manual (Connect on event)

```jsx
function App() {
  const [data, setData] = React.useState([])

  const connectOnMount = false

  const { webSocket, status, connect } = useWebSocket(url, {
    connectOnMount,
    onMessage: (e) => setData((data) => [...data, e.data]),
  })

  return (
    <div>
      {status === 'closed' && (
        <button onClick={() => connect()}>Connect</button>
      )}
      <button onClick={() => webSocket.send('hi')}>Greet</button>
      <ul>
        {data.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Motivations

The `use-websocket` package was created to reduce boilerplate when using
WebSockets in React applications and provide a minimal API over the WebSocket
standard. Our goal is to simplify the integration of WebSocket functionality
into React apps and avoiding opinionated abstractions. The simplicity hopes to
make it easier for developers to use the WebSocket API and for the community to
create additional abstractions. We encourage the development of community
packages built on top of "use-websocket" and welcome contributions and feedback
from the community.
