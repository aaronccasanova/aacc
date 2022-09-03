import { all as knownCSSProperties } from 'known-css-properties'

import { groupedCSSProperties } from '../index'

const allGroupedCSSProperties = Object.values(groupedCSSProperties).flat()
type AllGroupedCSSProperties = typeof allGroupedCSSProperties

/** Number of failing properties to display */
const numberOfFailures = 20

describe.skip('groupedCSSProperties', () => {
  it('contains all known css properties', () => {
    const missingCSSProperties = knownCSSProperties.filter(
      (property) =>
        !allGroupedCSSProperties.includes(
          property as AllGroupedCSSProperties[number],
        ),
    )

    const hasMissingCSSProperties = missingCSSProperties.length > 0

    if (hasMissingCSSProperties) {
      process.stdout.write(
        `missingCSSProperties: ${missingCSSProperties
          .slice(0, numberOfFailures)
          .join(', ')}\n\n`,
      )
    }

    expect(hasMissingCSSProperties).toBe(false)
  })

  it('contains valid css properties', () => {
    const invalidCSSProperties = allGroupedCSSProperties.filter(
      (property) => !knownCSSProperties.includes(property),
    )

    const hasInvalidCSSProperties = invalidCSSProperties.length > 0

    if (hasInvalidCSSProperties) {
      process.stdout.write(
        `invalidCSSProperties: ${invalidCSSProperties
          .slice(0, numberOfFailures)
          .join(', ')}\n\n`,
      )
    }

    expect(hasInvalidCSSProperties).toBe(false)
  })
})
