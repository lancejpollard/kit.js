/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CSSObject } from 'styled-components'
import { InputFunctionType } from './Factory'
import { BaseInputPropsType, QueryType } from './types'

type BasicRecord = Record<string, unknown>

export type CompiledViewPropsType = {
  match?: QueryType
  props: CSSObject
}

export default function useProps<
  V extends object,
  P extends BaseInputPropsType<V>,
  O extends object,
  T extends object,
  X extends React.ComponentPropsWithoutRef<any> = React.ComponentPropsWithoutRef<any>,
>(
  propNamesMap: Record<string, boolean>,
  componentProps: O,
  initializationProps: (P & X) | InputFunctionType<O, P & X>,
  theme: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passedRef: React.ForwardedRef<any>,
  converter: (theme: T, input: V, isSelector?: boolean) => CSSObject,
): [
  CSSObject,
  React.ComponentPropsWithoutRef<any>,
  React.RefCallback<HTMLDivElement>,
] {
  const { childPropsArray, elementProps, watchesParent } = computeProps<
    V,
    P,
    O,
    T,
    X
  >({
    componentProps,
    converter,
    initializationProps,
    propNamesMap,
    theme,
  })

  const [cachedStyledProps, setCachedStyledProps] = useState<CSSObject>(
    childPropsArray?.[0].props ?? {},
  )

  const [cachedElementProps, setCachedElementProps] =
    useState<React.ComponentPropsWithoutRef<any>>(elementProps)

  const [parentWidth, setParentWidth] = useState<number>()
  const [parentHeight, setParentHeight] = useState<number>()
  const [element, setElement] = useState<HTMLElement>()
  const ref = useCallback(
    (node: HTMLElement | null) => {
      setElement(node ?? undefined)
      if (typeof passedRef === 'function') {
        passedRef(node)
      }
    },
    [passedRef, setElement],
  )

  useEffect(() => {
    let observer: ResizeObserver

    if (element && watchesParent) {
      observer = new ResizeObserver(entries => {
        const child = entries[0]
        if (child) {
          const sizeInfo = child.borderBoxSize?.[0]
          const width = sizeInfo?.inlineSize ?? 0
          const height = sizeInfo?.blockSize ?? 0
          setParentWidth(width)
          setParentHeight(height)
        }
      })

      observer.observe(element)

      const rect = element?.parentElement?.getBoundingClientRect()
      const width = rect?.width ?? 0
      const height = rect?.height ?? 0

      if (width && height) {
        setParentWidth(width)
        setParentHeight(height)
      } else {
        setParentWidth(undefined)
        setParentHeight(undefined)
      }
    }

    return () => {
      observer?.disconnect()
    }
  }, [element, watchesParent])

  useEffect(() => {
    const { childPropsArray, elementProps } = computeProps<
      V,
      P,
      O,
      T,
      X
    >({
      componentProps,
      converter,
      initializationProps,
      propNamesMap,
      theme,
    })

    const defaultProps = childPropsArray?.[0]

    if (parentWidth && childPropsArray) {
      const matchingProps = selectPropsMatchingDimensions(
        childPropsArray,
        parentWidth,
      )

      if (defaultProps) {
        setCachedStyledProps(matchingProps ?? defaultProps.props)
      }
    } else {
      if (defaultProps) {
        setCachedStyledProps(defaultProps.props)
      }
    }

    setCachedElementProps(elementProps)
  }, [
    propNamesMap,
    componentProps,
    initializationProps,
    theme,
    converter,
    parentWidth,
    setCachedStyledProps,
  ])

  return [cachedStyledProps, cachedElementProps, ref]
}

function selectPropsMatchingDimensions(
  array: Array<CompiledViewPropsType>,
  width: number,
): CSSObject | undefined {
  for (const info of array) {
    const { match, props } = info
    if (match) {
      if (match.minWidth && match.maxWidth) {
        if (width >= match.minWidth && match.maxWidth < width) {
          return props
        }
      } else if (match.minWidth) {
        if (width >= match.minWidth) {
          return props
        }
      } else if (match.maxWidth) {
        if (match.maxWidth < width) {
          return props
        }
      }
    }
  }
}

type ComputePropsInputType<
  V extends object,
  P extends BaseInputPropsType<V>,
  O extends object,
  T extends object,
  X extends React.ComponentPropsWithoutRef<any> = React.ComponentPropsWithoutRef<any>,
> = {
  componentProps: O
  converter: (theme: T, input: V, isSelector?: boolean) => CSSObject
  initializationProps: (P & X) | InputFunctionType<O, P & X>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  propNamesMap: Record<string, boolean>
  theme: T
}

function computeProps<
  V extends object,
  P extends BaseInputPropsType<V>,
  O extends object,
  T extends object,
  X extends React.ComponentPropsWithoutRef<any> = React.ComponentPropsWithoutRef<any>,
>({
  initializationProps,
  theme,
  componentProps,
  propNamesMap,
  converter,
}: ComputePropsInputType<V, P, O, T, X>) {
  let watchesParent = false

  const props = {}

  if (typeof initializationProps === 'function') {
    _.merge(props, componentProps)
    _.merge(
      props,
      (initializationProps as (p: O) => P & X)({
        ...componentProps,
        theme,
      }),
    )
  } else {
    _.merge(props, componentProps)
    _.merge(props, initializationProps)
  }

  const elementProps: React.ComponentPropsWithoutRef<any> = {}
  Object.keys(props).forEach(key => {
    if (!(key in propNamesMap)) {
      ;(elementProps as BasicRecord)[key] = (props as BasicRecord)[key]
    }
  })

  const input = props as P & X

  let defaultChildProps: CSSObject = {}
  const childPropsArray: Array<CompiledViewPropsType> = [
    { props: defaultChildProps },
  ]

  const childProps = converter(theme, input, false)
  _.merge(defaultChildProps, childProps)

  if (input.queries) {
    input.queries.forEach(query => {
      const childProps = converter(theme, query, false)
      if (query.match) {
        if (query.match.element === 'window') {
          // TODO
          const mediaParts = []
          _.merge(defaultChildProps)
        } else {
          watchesParent = true
          childPropsArray.push({
            match: query.match,
            props: childProps,
          })
        }
      }
    })
  }

  const { selectors } = input

  if (selectors) {
    Object.keys(selectors).forEach(selector => {
      const selectorProps = selectors[selector]
      const childProps = converter(theme, selectorProps, true)
      defaultChildProps[selector] = childProps
    })
  }

  childPropsArray.slice(1).forEach(childProps => {
    _.defaultsDeep(childProps, defaultChildProps)
  })

  return { childPropsArray, elementProps, watchesParent }
}
