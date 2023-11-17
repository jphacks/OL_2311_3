"use client"

import { devDb } from "@/lib/firebase/dev"

import UserList from "../components/UserList"

export const DevUserList = () => {
  return <UserList db={devDb} />
}
