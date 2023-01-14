import {
  getBorderRadius,
  getDimensionMixin,
  getNumberOrString,
} from './styles'
import { AbsolutePositionMixinType, PositionType, Theme } from './types'
import { CSSObject, DefaultTheme } from 'styled-components'
import Factory from './Factory'

type TextureViewPropsType = AbsolutePositionMixinType & {
  anchor?: string
  animation?: string
  borderRadius?: string | number
  center?: boolean
  contain?: boolean
  cover?: boolean
  fill?: string
  fitContent?: boolean
  height?: number | string
  mask?: string
  minHeight?: number | string
  minWidth?: number | string
  opacity?: number
  position?: PositionType
  repeat?: boolean
  round?: boolean
  size?: number | string
  stretch?: boolean
  unselectable?: boolean
  width?: number | string
}

export const PROP_LIST: Array<string> = [
  'anchor',
  'animation',
  'borderRadius',
  'center',
  'contain',
  'cover',
  'fill',
  'fitContent',
  'height',
  'mask',
  'minHeight',
  'minWidth',
  'opacity',
  'position',
  'repeat',
  'round',
  'size',
  'stretch',
  'unselectable',
  'width',
  'bottom',
  'left',
  'right',
  'top',
]

export default Factory<TextureViewPropsType, DefaultTheme>(
  'div',
  PROP_LIST,
  serializeProps,
)

function serializeProps(
  theme: DefaultTheme,
  props: TextureViewPropsType,
): CSSObject {
  return {
    borderRadius: getBorderRadius(props),
    opacity: props.opacity ? props.opacity : undefined,
    position: props.position ? props.position : undefined,
    userSelect: props.unselectable ? 'none' : undefined,
    ...getDimensionMixin(props),
    animation: props.animation ? props.animation : undefined,
    backgroundImage: props.fill ? `url('${props.fill}')` : undefined,
    backgroundPosition: props.center ? 'center center' : undefined,
    backgroundRepeat: props.repeat ? 'repeat' : 'no-repeat',
    backgroundSize: getBackgroundSize(props),
    maskImage: props.mask ? props.mask : undefined,
    transformOrigin: props.anchor ? props.anchor : undefined,
    ...getFitContentMixin(props),
    ...getStretchMixin(props),
  }
}

function getFitContentMixin(props: TextureViewPropsType): CSSObject {
  if (props.fitContent) {
    return {
      backgroundSize: 'contain',
      height: 0,
      paddingTop: '100%',
    }
  }

  return {}
}

function getStretchMixin(props: TextureViewPropsType): CSSObject {
  if (props.stretch) {
    return {
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    }
  }

  return {}
}

function getBackgroundSize(props: TextureViewPropsType) {
  if (props.size) {
    return getNumberOrString(props.size)
  }

  if (props.contain) {
    return 'contain'
  }

  if (props.cover) {
    return 'cover'
  }
}
