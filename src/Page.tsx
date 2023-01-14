import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next'

export type GetServerSidePropsType = GetServerSidePropsContext
export type GetServerSideResultType<T> = GetServerSidePropsResult<T>

export type PagePropsType = {
  note?: string
  tab: string
  tags?: Array<string>
  url: string
}
