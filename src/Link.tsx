import React from 'react'
import NextLink, { LinkProps } from 'next/link'
import Box from './Box'

const ExternalLink = Box({
  as: 'a',
  rel: 'noreferrer',
  target: '_blank',
})

type PropsType = LinkProps & {
  children: React.ReactNode
}

export default function Link(props: PropsType) {
  return <NextLink {...props} />
}

Link.External = ExternalLink
