# (WIP) use-websocket

Base abstraction for using WebSockets in React

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
