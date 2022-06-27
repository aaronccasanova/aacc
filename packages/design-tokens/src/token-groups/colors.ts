import { createDesignTokenGroup } from 'designtokens.io'

export const colors = createDesignTokenGroup({
  $tokens: {
    grey: {
      $tokens: {
        50: { $value: '#fafafa' },
        100: { $value: '#f5f5f5' },
        200: { $value: '#eeeeee' },
        300: { $value: '#e0e0e0' },
        400: { $value: '#bdbdbd' },
        500: { $value: '#9e9e9e' },
        600: { $value: '#757575' },
        700: { $value: '#616161' },
        800: { $value: '#424242' },
        900: { $value: '#212121' },
        A100: { $value: '#f5f5f5' },
        A200: { $value: '#eeeeee' },
        A400: { $value: '#bdbdbd' },
        A700: { $value: '#616161' },
      },
    },
    teal: {
      $tokens: {
        50: { $value: '#e0f2f1' },
        100: { $value: '#b2dfdb' },
        200: { $value: '#80cbc4' },
        300: { $value: '#4db6ac' },
        400: { $value: '#26a69a' },
        500: { $value: '#009688' },
        600: { $value: '#00897b' },
        700: { $value: '#00796b' },
        800: { $value: '#00695c' },
        900: { $value: '#004d40' },
        A100: { $value: '#a7ffeb' },
        A200: { $value: '#64ffda' },
        A400: { $value: '#1de9b6' },
        A700: { $value: '#00bfa5' },
      },
    },
  },
})
