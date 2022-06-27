import { createDesignTokenGroup } from 'designtokens.io'

const base = 4

export const spacing = createDesignTokenGroup({
  $tokens: {
    base: { $value: `${base}px` },
    0: { $value: `${base * 0}px` },
    1: { $value: `${base * 1}px` },
    2: { $value: `${base * 2}px` },
    3: { $value: `${base * 3}px` },
    4: { $value: `${base * 4}px` },
    5: { $value: `${base * 5}px` },
    6: { $value: `${base * 6}px` },
    7: { $value: `${base * 7}px` },
    8: { $value: `${base * 8}px` },
    9: { $value: `${base * 9}px` },
    10: { $value: `${base * 10}px` },
    11: { $value: `${base * 11}px` },
    12: { $value: `${base * 12}px` },
    13: { $value: `${base * 13}px` },
    14: { $value: `${base * 14}px` },
    15: { $value: `${base * 15}px` },
    16: { $value: `${base * 16}px` },
    17: { $value: `${base * 17}px` },
    18: { $value: `${base * 18}px` },
    19: { $value: `${base * 19}px` },
    20: { $value: `${base * 20}px` },
  },
})
