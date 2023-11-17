"use client"

import { prodDb } from "@/lib/firebase"

import UserList from "./components/UserList"

export const ProdUserList = () => {
  return <UserList db={prodDb} />
}
