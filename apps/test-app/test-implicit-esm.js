import express from 'express'
import { greet } from '@aacc/rollup-babel-ts'

const app = express()

app.get('/', (req, res) => {
  res.send(greet('World'))
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
