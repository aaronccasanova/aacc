import styled, { css } from 'styled-components'

type ButtonProps = {
  // TODO: Add type safety derived from design-tokens
  size?: 'small' | 'medium' | 'large'
  variant?: 'text' | 'filled' | 'outlined'
  // TODO: Add color prop: 'primary' | 'secondary' etc.
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// TODO: Evaluate the following styles:
// https://github.com/argyleink/gui-challenges/blob/main/buttons/buttons.css#L113
export const Button = styled.button.attrs<ButtonProps>((props) => ({
  className: `aacc-type-button${capitalize(props.size!)}`,
}))<ButtonProps>`
  cursor: pointer;
  touch-action: manipulation;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  ${(props) => {
    switch (props.size) {
      case 'small':
        return css`
          border-radius: var(--aacc-shape-borderRadius-small);
          padding: var(--aacc-spacing-1) var(--aacc-spacing-2);
          gap: var(--aacc-spacing-2);
        `
      case 'medium':
        return css`
          border-radius: var(--aacc-shape-borderRadius-medium);
          padding: var(--aacc-spacing-2);
          gap: var(--aacc-spacing-2);
        `
      case 'large':
        return css`
          border-radius: var(--aacc-shape-borderRadius-large);
          padding: var(--aacc-spacing-2);
          gap: var(--aacc-spacing-2);
        `
      default:
        throw new Error(`Unknown button size`)
    }
  }}

  ${(props) => {
    switch (props.variant) {
      case 'text':
        return css`
          background-color: transparent;
          border: 2px solid transparent;
          color: var(--aacc-colors-text-primary);
        `
      case 'filled':
        return css`
          background-color: var(--aacc-colors-primary-main);
          border: 2px solid var(--aacc-colors-primary-main);
          color: var(--aacc-colors-primary-on);
        `
      case 'outlined':
        return css`
          background-color: transparent;
          border: 2px solid var(--aacc-colors-primary-main);
          color: var(--aacc-colors-primary-main);
        `
      // case 'inherit':
      //   return css`
      //     backgroundColor: 'inherit',
      //     border: '2px solid inherit',
      //     color: 'inherit',
      //     `
      default:
        throw new Error(`Unknown button variant`)
    }
  }};
`

Button.defaultProps = {
  size: 'medium',
  variant: 'text',
}
