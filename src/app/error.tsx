"use client"

import { NextPage } from "next"
import Link from "next/link"
import { useEffect } from "react"

type ErrorPageProps = {
  error: Error
  reset: () => void
}

const ErrorPage: NextPage<ErrorPageProps> = ({ error }) => {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <>
      <p>申し訳ありません。エラーが発生しました。</p>
      <Link href="/">トップに戻る</Link>
    </>
  )
}

export default ErrorPage
