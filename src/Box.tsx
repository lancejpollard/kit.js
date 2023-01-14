import _ from 'lodash'
import {
  getBorderRadius,
  getDimensionMixin,
  getFontMixin,
  getNumberOrString,
  ALIGN,
  DIRECTION,
  getOverflow,
  getOverflowAspect,
  getSpacingMixin,
  JUSTIFY,
} from './styles'
import {
  AbsolutePositionMixinType,
  AlignType,
  BaseInputPropsType,
  BorderRadiusMixinType,
  DimensionMixinType,
  DirectionType,
  FontMixinType,
  JustifyType,
  OverflowMixinType,
  PositionType,
  SpacingMixinType,
  Theme,
} from './types'
import { CSSObject } from 'styled-components'
import Factory from './Factory'

export type BoxPropsType = BaseInputPropsType<BoxViewPropsType>

export type BoxViewPropsType = FontMixinType &
  DimensionMixinType &
  SpacingMixinType &
  OverflowMixinType &
  BorderRadiusMixinType &
  AbsolutePositionMixinType & {
    align?: AlignType
    animation?: string
    direction?: DirectionType
    fill?: string
    flex?: number | string
    gap?: string | number
    grow?: boolean
    hGap?: string | number
    invisible?: boolean
    justify?: JustifyType
    position?: PositionType
    shrink?: boolean
    unselectable?: boolean
    vGap?: string | number
    wrap?: boolean
  }

export const PROP_LIST: Array<string> = [
  'align',
  'animation',
  'direction',
  'fill',
  'flex',
  'gap',
  'grow',
  'hGap',
  'invisible',
  'justify',
  'position',
  'shrink',
  'unselectable',
  'vGap',
  'wrap',
  'bottom',
  'left',
  'right',
  'top',
  'borderRadius',
  'round',
  'queries',
  'selectors',
  'crop',
  'cropX',
  'cropY',
  'scroll',
  'scrollX',
  'scrollY',
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
  'fontFamily',
  'fontHeight',
  'fontSize',
  'fontWeight',
]

export default Factory<BoxViewPropsType, Theme>(
  'div',
  PROP_LIST,
  serializeViewProps,
)

function serializeViewProps(
  theme: Theme,
  stateProps: BoxViewPropsType,
): CSSObject {
  return {
    ...getDimensionMixin(stateProps),
    ...getSpacingMixin(stateProps),
    ...getFontMixin(theme, stateProps),
    alignItems: stateProps.align ? ALIGN[stateProps.align] : undefined,
    animation: stateProps.animation ? stateProps.animation : undefined,
    backgroundColor: stateProps.fill ? stateProps.fill : undefined,
    borderRadius: getBorderRadius(stateProps),
    bottom: stateProps.bottom
      ? getNumberOrString(stateProps.bottom)
      : undefined,
    columnGap: stateProps.hGap
      ? getNumberOrString(stateProps.hGap)
      : undefined,
    display: 'flex',
    flex: stateProps.flex ? stateProps.flex : undefined,
    flexDirection: stateProps.direction
      ? DIRECTION[stateProps.direction]
      : undefined,
    flexGrow: stateProps.grow ? 1 : undefined,
    flexShrink: stateProps.shrink ? 1 : 0,
    flexWrap: stateProps.wrap ? 'wrap' : undefined,
    gap: stateProps.gap ? getNumberOrString(stateProps.gap) : undefined,
    justifyContent: stateProps.justify
      ? JUSTIFY[stateProps.justify]
      : undefined,
    left: stateProps.left
      ? getNumberOrString(stateProps.left)
      : undefined,
    overflow: getOverflow(stateProps),
    overflowX: getOverflowAspect(stateProps, 'X'),
    overflowY: getOverflowAspect(stateProps, 'Y'),
    position: stateProps.position ? stateProps.position : undefined,
    right: stateProps.right
      ? getNumberOrString(stateProps.right)
      : undefined,
    rowGap: stateProps.vGap
      ? getNumberOrString(stateProps.vGap)
      : undefined,
    top: stateProps.top ? getNumberOrString(stateProps.top) : undefined,
    visibility: stateProps.invisible ? 'hidden' : undefined,
  }
}
