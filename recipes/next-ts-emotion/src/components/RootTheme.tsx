import React from 'react'
import { themeKeys } from '@aacc/design-tokens'

import {
  defaultThemeKey,
  localStorageThemeKey,
  rootThemeClass,
} from '../themes'

const setInitialTheme = /* js */ `
(function(){
	const initialTheme = (() => {
		const storedTheme = window.localStorage.getItem('${localStorageThemeKey}');

		if (['${themeKeys.join("','")}'].includes(storedTheme)) return storedTheme;

		return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : '${defaultThemeKey}';
	})();
  const root = document.documentElement;
	root.classList.add('${rootThemeClass}' + '-' + initialTheme);
  root.dataset.initialTheme = initialTheme;
  window.localStorage.setItem('${localStorageThemeKey}', initialTheme);
})()
`

export function RootTheme() {
  return (
    <script
      id="root-theme-script"
      key="root-theme-script"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: setInitialTheme }}
    />
  )
}
