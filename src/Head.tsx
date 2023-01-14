import React, { useEffect } from 'react'
import NextHead from 'next/head'

type PropsType = {
  note?: string
  tags?: Array<string>
  title: string
  url: string
}

export default function Head({
  title,
  note,
  tags = [],
  url,
}: PropsType) {
  useEffect(() => {
    if (title) {
      document.title = title
    }
  }, [title])

  return (
    <NextHead>
      <title>{title}</title>
      <meta
        name="description"
        content={note}
      />
      <meta
        name="keywords"
        content={tags.join(', ')}
      />
      <link
        rel="icon"
        href="/images/rabbit.svg"
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <meta
        name="apple-mobile-web-app-capable"
        content="yes"
      />
      <meta
        property="og:title"
        content={title}
      />
      <meta
        property="og:url"
        content={`https://lancejpollard.com${url}`}
      />
      <meta
        property="og:description"
        content={note}
      />
      {/* <meta
        property="og:image"
        content="https://tune.land/view/social-rectangle.png"
      /> */}
      <meta
        property="og:site_name"
        content="Lance Pollard"
      />
      <meta
        property="og:locale"
        content="en_US"
      />
      <meta
        property="og:type"
        content="article"
      />
      {/* <meta
        property="fb:app_id"
        content="1953189875070105"
      /> */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />
      <meta
        name="twitter:title"
        content={title}
      />
      <meta
        name="twitter:description"
        content={note}
      />
      <meta
        name="twitter:site"
        content="@lancejpollard"
      />
      {/* <meta
        name="twitter:image"
        content="https://tune.land/view/social-rectangle.png"
      /> */}
      <meta
        name="twitter:creator"
        content="@teamtreesurf"
      />
    </NextHead>
  )
}
