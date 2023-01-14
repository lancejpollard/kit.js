import { Property } from 'csstype'
import { CSSObject } from 'styled-components'
import {
  AlignType,
  BorderRadiusMixinType,
  BreakTextMixinType,
  DimensionMixinType,
  DirectionType,
  FontMixinType,
  JustifyType,
  OverflowMixinType,
  SpacingMixinType,
  Theme,
} from './types'

// eslint-disable-next-line sort-exports/sort-exports
export const DIRECTION: Record<DirectionType, Property.FlexDirection> =
  {
    horizontal: 'row',
    vertical: 'column',
  }

// eslint-disable-next-line sort-exports/sort-exports
export const JUSTIFY: Record<JustifyType, string> = {
  between: 'space-between',
  center: 'center',
  end: 'flex-end',
}

// eslint-disable-next-line sort-exports/sort-exports
export const ALIGN: Record<AlignType, string> = {
  center: 'center',
  end: 'end',
  start: 'start',
}

// eslint-disable-next-line sort-exports/sort-exports, @typescript-eslint/no-explicit-any
export const TEXT_ALIGN: Record<AlignType, Property.TextAlign> = {
  center: 'center',
  end: 'right',
  start: 'left',
}

export function getBorderRadius(
  props: BorderRadiusMixinType,
): number | string | undefined {
  if (props.borderRadius) {
    return getNumberOrString(props.borderRadius)
  }
  if (props.round) {
    return '50%'
  }
}

export function getDimensionMixin(
  props: DimensionMixinType,
): CSSObject {
  return {
    height: props.height ? getNumberOrString(props.height) : undefined,
    maxHeight: props.maxHeight
      ? getNumberOrString(props.maxHeight)
      : undefined,
    maxWidth: props.maxWidth
      ? getNumberOrString(props.maxWidth)
      : undefined,
    minHeight: props.minHeight
      ? getNumberOrString(props.minHeight)
      : undefined,
    minWidth: props.minWidth
      ? getNumberOrString(props.minWidth)
      : undefined,

    width: props.width ? getNumberOrString(props.width) : undefined,
  }
}

export function getFontMixin(theme: Theme, props: FontMixinType) {
  return {
    fontFamily: props.fontFamily
      ? theme.fonts[props.fontFamily]
      : undefined,
    fontSize: props.fontSize ? `${props.fontSize}px` : undefined,
    fontWeight: props.fontWeight ? props.fontWeight : undefined,
    lineHeight: props.fontHeight ? props.fontHeight : undefined,
  }
}

export function getNumberOrString(value: number | string): string {
  if (typeof value === 'number') {
    return `${value}px`
  } else {
    return value
  }
}

export function getNumberOrStringAspect(
  props: SpacingMixinType,
  aspects: Array<string>,
): string | undefined {
  for (const aspect of aspects) {
    if (aspect in props) {
      return getNumberOrString(
        props[aspect as keyof SpacingMixinType] as string | number,
      )
    }
  }
}

export function getOverflow(
  props: OverflowMixinType,
): Property.Overflow | undefined {
  if (props.crop) {
    return 'hidden'
  }

  if (props.scroll) {
    return 'auto'
  }
}

export function getOverflowAspect(
  props: OverflowMixinType,
  aspect: string,
): Property.OverflowX | Property.OverflowY | undefined {
  if (props[`crop${aspect}` as keyof OverflowMixinType]) {
    return 'hidden'
  }

  if (props[`scroll${aspect}` as keyof OverflowMixinType]) {
    return 'auto'
  }
}

export function getSpacingMixin(props: SpacingMixinType): CSSObject {
  return {
    margin: props.margin ? getNumberOrString(props.margin) : undefined,
    marginBottom: getNumberOrStringAspect(props, [
      'marginBottom',
      'marginVertical',
    ]),
    marginLeft: getNumberOrStringAspect(props, [
      'marginLeft',
      'marginHorizontal',
    ]),
    marginRight: getNumberOrStringAspect(props, [
      'marginRight',
      'marginHorizontal',
    ]),
    marginTop: getNumberOrStringAspect(props, [
      'marginTop',
      'marginVertical',
    ]),
    padding: props.padding
      ? getNumberOrString(props.padding)
      : undefined,
    paddingBottom: getNumberOrStringAspect(props, [
      'paddingBottom',
      'paddingVertical',
    ]),
    paddingLeft: getNumberOrStringAspect(props, [
      'paddingLeft',
      'paddingHorizontal',
    ]),
    paddingRight: getNumberOrStringAspect(props, [
      'paddingRight',
      'paddingHorizontal',
    ]),
    paddingTop: getNumberOrStringAspect(props, [
      'paddingTop',
      'paddingVertical',
    ]),
  }
}

export function getWordBreak(
  props: BreakTextMixinType,
): Property.WordBreak | undefined {
  if (props.breakWord) {
    return 'break-word'
  }
  if (props.breakEverywhere) {
    return 'break-all'
  }
}
