import React from 'react'

import '@aacc/design-tokens/css/reset.css'
import '@aacc/design-tokens/css/theme-vars.css'
import '@aacc/design-tokens/css/type-classes.css'
import '../styles/globals.css'

import type { AppProps } from 'next/app'

import { Providers } from '../src/providers'

function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </Providers>
  )
}

export default App
