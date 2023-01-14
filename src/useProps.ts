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
  converter: (theme: T, input: V) => CSSObject,
): [
  CSSObject,
  React.ComponentPropsWithoutRef<any>,
  React.RefCallback<HTMLDivElement>,
] {
  const [props, setProps] = useState<CSSObject>({})
  const [elementProps, setElementProps] = useState<
    React.ComponentPropsWithoutRef<any>
  >({})
  const [propsArray, setPropsArray] =
    useState<Array<CompiledViewPropsType>>()
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

    if (element) {
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

      const elProps: React.ComponentPropsWithoutRef<any> = {}
      Object.keys(props).forEach(key => {
        if (!(key in propNamesMap)) {
          ;(elProps as BasicRecord)[key] = (props as BasicRecord)[key]
        }
      })

      setElementProps(elProps)

      const input = props as P & X

      let defaultChildProps: CSSObject = {}
      const childPropsArray: Array<CompiledViewPropsType> = [
        { props: defaultChildProps },
      ]

      const childProps = converter(theme, input)
      _.merge(defaultChildProps, childProps)

      if (input.queries) {
        input.queries.forEach(query => {
          const childProps = converter(theme, query)
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
          const childProps = converter(theme, selectorProps)
          defaultChildProps[selector] = childProps
        })
      }

      childPropsArray.slice(1).forEach(childProps => {
        _.defaultsDeep(childProps, defaultChildProps)
      })

      if (watchesParent && element) {
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

      setPropsArray(childPropsArray)
    }

    return () => {
      observer?.disconnect()
    }
  }, [
    element,
    converter,
    initializationProps,
    propNamesMap,
    componentProps,
    theme,
  ])

  useEffect(() => {
    const defaultProps = propsArray?.[0]

    if (parentWidth && propsArray) {
      const matchingProps = selectPropsMatchingDimensions(
        propsArray,
        parentWidth,
      )

      if (defaultProps) {
        setProps(matchingProps ?? defaultProps.props)
      }
    } else {
      if (defaultProps) {
        setProps(defaultProps.props)
      }
    }
  }, [propsArray, parentWidth, setProps])

  return [props, elementProps, ref]
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
