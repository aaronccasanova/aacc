import React from 'react'

import styled from 'styled-components'

import type { NextPage } from 'next'
import Head from 'next/head'
import { isThemeKey } from '@aacc/design-tokens'

import { useRootTheme } from '../src/providers'

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

const Text = styled.span`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`

const Heading = styled(Text)`
  color: var(--aacc-colors-primary-main);
`

const Home: NextPage = function Home() {
  const { themeKey, themeKeys, setThemeKey } = useRootTheme()

  return (
    <Container>
      <Head>
        <title>Home</title>
        <meta
          name="description"
          content="Next.js - TypeScript - Styled Components recipe"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <Main>
        <Heading as="h1">Next.js - TypeScript - Styled Components</Heading>
        <Text as="h2">
          Select theme:{' '}
          <select
            onChange={(e) =>
              isThemeKey(e.target.value)
                ? setThemeKey(e.target.value)
                : themeKey
            }
          >
            {themeKeys.map((theme) => (
              <option
                key={theme}
                value={theme}
              >
                {theme}
              </option>
            ))}
          </select>
        </Text>
      </Main>
    </Container>
  )
}

export default Home
