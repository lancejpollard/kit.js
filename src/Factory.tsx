/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash'
import React from 'react'
import styled, {
  CSSObject,
  DefaultTheme,
  useTheme,
} from 'styled-components'
import { BaseInputPropsType } from './types'
import useProps from './useProps'

export type ExecutionPropsType = {
  theme: DefaultTheme
}

export type FactoryPropsType = {
  styledProps: CSSObject
}

export type InputFunctionType<O, P> = (
  props: ExecutionPropsType & O,
) => P

export default function FactoryFactory<
  V extends object,
  // The Theme from the current context
  T extends DefaultTheme,
  // The properties from say the `Box`.
  P extends BaseInputPropsType<V> = BaseInputPropsType<V>,
  // The properties from the native HTML elements
  X extends React.ComponentPropsWithoutRef<any> = React.ComponentPropsWithoutRef<any>,
>(
  as: string,
  propNames: Array<string>,
  serializer: (theme: T, props: V, isSelector?: boolean) => CSSObject,
) {
  const propNamesMap = propNames.reduce<Record<string, boolean>>(
    (m, x) => {
      m[x] = true
      return m
    },
    {},
  )

  return function Factory<
    // The other props added by the template
    O extends React.ComponentPropsWithoutRef<any> = React.ComponentPropsWithoutRef<any>,
  >(inputProps: (P & X) | InputFunctionType<O, P & X>) {
    const Styled = styled.div<FactoryPropsType>(
      props => props.styledProps,
    )

    function Component(props: O, passedRef: React.ForwardedRef<any>) {
      const theme = useTheme() as T

      const [styledProps, elementProps, ref] = useProps<V, P, O, T, X>(
        propNamesMap,
        props,
        inputProps,
        theme,
        passedRef,
        serializer,
      )

      if (!elementProps) {
        return null
      }

      const { children, ...elementPropsWithoutChildren } = elementProps
      const childrenAsReactNode = (
        Array.isArray(children) ? children : [children]
      ) as Array<React.ReactNode>

      const node = React.createElement(
        Styled,
        { ...elementPropsWithoutChildren, ref, styledProps },
        ...childrenAsReactNode,
      )

      return node
    }

    Component.toString = Styled.toString

    return React.forwardRef(Component)
  }
}
