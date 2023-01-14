/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { CSSObject } from 'styled-components'
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
>(
  propNamesMap: Record<string, boolean>,
  componentProps: P,
  initializationProps: O,
  theme: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passedRef: React.ForwardedRef<any>,
  converter: (theme: T, input: V) => CSSObject,
): [
  CSSObject,
  React.ComponentPropsWithoutRef<any>,
  React.RefObject<HTMLDivElement>,
] {
  const [props, setProps] = useState<CSSObject>({})
  const [elementProps, setElementProps] = useState<
    React.ComponentPropsWithoutRef<any>
  >({})
  const [propsArray, setPropsArray] =
    useState<Array<CompiledViewPropsType>>()
  const [parentWidth, setParentWidth] = useState<number>()
  const [parentHeight, setParentHeight] = useState<number>()
  const ref = useRef<HTMLDivElement>(null)
  const localRef = (passedRef || ref) as React.RefObject<HTMLDivElement>

  useEffect(() => {
    let watchesParent = false

    const props = {}

    if (typeof initializationProps === 'function') {
      _.merge(
        props,
        (initializationProps as (...args: any) => O & P)(
          componentProps,
        ),
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

    const input = props as O & P

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

    let observer: ResizeObserver

    if (watchesParent && localRef.current) {
      observer = new ResizeObserver(entries => {
        const element = entries[0]
        if (element) {
          const sizeInfo = element.borderBoxSize?.[0]
          const width = sizeInfo?.inlineSize ?? 0
          const height = sizeInfo?.blockSize ?? 0
          setParentWidth(width)
          setParentHeight(height)
        }
      })

      observer.observe(localRef.current)

      const rect =
        localRef.current?.parentElement?.getBoundingClientRect()
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

    return () => {
      observer?.disconnect()
    }
  }, [
    localRef,
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

  return [props, elementProps, localRef]
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
