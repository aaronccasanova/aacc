import React from 'react'

import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'

/**
 * Acceptable target elements for `useListener`.
 */
type UseListenerTarget =
  | Window
  | Document
  | HTMLElement
  | React.RefObject<HTMLElement>

/**
 * Extracts the target element from a React `RefObject` or returns the input element.
 */
type ExtractTargetElement<Target> = Target extends React.RefObject<
  infer Element
>
  ? Element
  : Target

/**
 * Extracts a (lib.dom.ts) EventMap for a given target element.
 */
type ExtractEventMap<Target> = ExtractTargetElement<Target> extends Window
  ? WindowEventMap
  : ExtractTargetElement<Target> extends Document
    ? DocumentEventMap
    : HTMLElementEventMap

/**
 * Extracts all event names for a given target element.
 */
type ExtractEventName<Target> = keyof ExtractEventMap<
  ExtractTargetElement<Target>
>

/**
 * Extracts the `event` object for a given event type.
 */
type ExtractEvent<
  Target,
  EventName extends ExtractEventName<Target>,
> = ExtractEventMap<ExtractTargetElement<Target>>[EventName]

/**
 * React hook encapsulating the boilerplate logic for adding and removing event listeners.
 */
export function useListener<
  TargetEventName extends ExtractEventName<Target>,
  TargetEvent extends ExtractEvent<Target, TargetEventName>,
  Target extends UseListenerTarget = Window,
>(
  eventName: TargetEventName,
  handler: (event: TargetEvent) => void,
  target?: undefined | null | Target,
  options?: undefined | AddEventListenerOptions,
): void {
  const handlerRef = React.useRef(handler)
  const optionsRef = React.useRef(options)

  useIsomorphicLayoutEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useIsomorphicLayoutEffect(() => {
    optionsRef.current = options
  }, [options])

  React.useEffect(() => {
    if (!(typeof eventName === 'string' && target !== null)) return

    let targetElement: Exclude<UseListenerTarget, React.RefObject<HTMLElement>>

    if (typeof target === 'undefined') {
      targetElement = window
    } else if ('current' in target) {
      if (target.current === null) return

      targetElement = target.current
    } else {
      targetElement = target
    }

    const eventOptions = optionsRef.current

    const eventListener = (event: Event) =>
      handlerRef.current(event as unknown as TargetEvent)

    targetElement.addEventListener(eventName, eventListener, eventOptions)

    // eslint-disable-next-line consistent-return
    return () => {
      targetElement.removeEventListener(eventName, eventListener, eventOptions)
    }
  }, [eventName, target])
}
