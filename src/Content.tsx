import React from 'react'
import Box from './Box'

type PropsType = {
  children: React.ReactNode
}

const Wrapper = Box({
  minHeight: '100vh',
  position: 'absolute' as const,
  width: '100vw',
})

const Container = Box({
  direction: 'vertical' as const,
  flex: 1,
  height: '100vh',
  width: '100%',
})

const Scroller = Box({
  direction: 'vertical' as const,
  flex: 1,
  scrollY: true,
  width: '100%',
})

export default function Content({ children }: PropsType) {
  return (
    <Wrapper>
      <Container>
        <Scroller id="scroller">{children}</Scroller>
      </Container>
    </Wrapper>
  )
}
