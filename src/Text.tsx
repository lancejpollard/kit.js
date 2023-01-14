import React from 'react'
import {
  getDimensionMixin,
  getFontMixin,
  getSpacingMixin,
  getWordBreak,
  TEXT_ALIGN,
} from './styles'
import {
  Font,
  AlignType,
  BaseInputPropsType,
  BreakTextMixinType,
  DimensionMixinType,
  FontMixinType,
  SpacingMixinType,
  Theme,
} from './types'
import Factory from './Factory'
import { CSSObject } from 'styled-components'

export const PROP_LIST = [
  'fontFamily',
  'fontHeight',
  'fontSize',
  'fontWeight',
  'breakEverywhere',
  'breakWord',
  'align',
  'animation',
  'fill',
  'preserveNewLines',
  'resizable',
  'unselectable',
  'margin',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginHorizontal',
  'marginVertical',
  'padding',
  'paddingBottom',
  'paddingHorizontal',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingVertical',
  'height',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'width',
]

export type TextPropsType = BaseInputPropsType<TextViewPropsType>

export type TextViewPropsType = FontMixinType &
  DimensionMixinType &
  BreakTextMixinType &
  SpacingMixinType & {
    align?: AlignType
    animation?: string
    fill?: string
    font?: keyof Font
    preserveNewLines?: boolean
    resizable?: boolean
    unselectable?: boolean
  }

export default Factory('p', PROP_LIST, serializeProps)

function serializeProps(
  theme: Theme,
  props: TextViewPropsType,
): CSSObject {
  return {
    ...getSpacingMixin(props),
    ...getDimensionMixin(props),
    ...getFontMixin(theme, props),
    animation: props.animation ? props.animation : undefined,
    color: props.fill ? props.fill : undefined,
    overflowWrap: props.breakWord ? 'break-word' : undefined,
    resize: props.resizable ? 'both' : undefined,
    textAlign: props.align ? TEXT_ALIGN[props.align] : undefined,
    userSelect: props.unselectable ? 'none' : undefined,
    whiteSpace: props.preserveNewLines ? 'pre-wrap' : undefined,
    wordBreak: getWordBreak(props),
  }
}
