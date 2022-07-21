import React from 'react'

import Document, { Head, Html, Main, NextScript } from 'next/document'

import { RootTheme } from '../src/components'

export default class MyDocument extends Document {
  override render() {
    return (
      <Html>
        <Head />
        <body>
          <RootTheme />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
