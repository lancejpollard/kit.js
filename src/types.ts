export type AbsolutePositionMixinType = {
  bottom?: number | string
  left?: number | string
  right?: number | string
  top?: number | string
}

export type AlignType = 'center' | 'end' | 'start'

export type BaseInputPropsType<T extends object> = T & {
  queries?: Array<BaseMatchInputPropsType<T>>
  selectors?: Record<string, T>
}

export type BaseMatchInputPropsType<T extends object> = T & {
  match?: QueryType
  selectors?: Record<string, T>
}

export type BorderRadiusMixinType = {
  borderRadius?: string | number
  round?: boolean
}

export type BreakTextMixinType = {
  breakEverywhere?: boolean
  breakWord?: boolean
}

export type DimensionMixinType = {
  height?: number | string
  maxHeight?: number | string
  maxWidth?: number | string
  minHeight?: number | string
  minWidth?: number | string
  width?: number | string
}

export type DirectionType = 'horizontal' | 'vertical'

export interface Font {
  arial: true
}

export type FontMixinType = {
  fontFamily?: string
  fontHeight?: number | string
  fontSize?: number
  fontWeight?: number
}

export type JustifyType = 'between' | 'center' | 'end'

export type OverflowMixinType = {
  crop?: boolean
  cropX?: boolean
  cropY?: boolean
  scroll?: boolean
  scrollX?: boolean
  scrollY?: boolean
}

export type PositionType = 'absolute' | 'relative' | 'fixed'

export type QueryElementType = 'parent' | 'window'

export type QueryType = {
  element: QueryElementType
  maxHeight?: number
  maxWidth?: number
  minHeight?: number
  minWidth?: number
}

export type SpacingMixinType = {
  margin?: number | string
  marginBottom?: string | number
  marginHorizontal?: string | number
  marginLeft?: string | number
  marginRight?: string | number
  marginTop?: string | number
  marginVertical?: string | number
  padding?: number | string
  paddingBottom?: string | number
  paddingHorizontal?: string | number
  paddingLeft?: string | number
  paddingRight?: string | number
  paddingTop?: string | number
  paddingVertical?: string | number
}

export interface Theme {
  fonts: Record<string, string>
}
