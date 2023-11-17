"use client"

import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { MdOutlineLocalCafe } from "react-icons/md"
import { fakerJA as faker } from "@faker-js/faker"
import { customAlphabet, nanoid } from "nanoid"

type User = {
  id: string
  bleUserId: string
  cheerUserIds: string[]
  deviceUuid: string
  lastCheersUserId: string
  location: string
  name: string
  profileImageUrl: string
  techArea: string
  xId: string
  instagramId: string
  homepageLink: string
}

type UserListProps = {
  db: Firestore
}

const UserList = ({ db }: UserListProps) => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        console.log(change)
        if (change.type === "added") {
          const data = change.doc.data()
          setUsers((users) => [...users, { id: change.doc.id, ...data } as User])
        } else if (change.type === "modified") {
          const data = change.doc.data()
          setUsers((users) =>
            users.map((user) =>
              user.id === change.doc.id
                ? ({ ...data, cheerUserIds: data["cheerUserIds"] ?? [], id: change.doc.id } as User)
                : user,
            ),
          )
        }
      })
    })

    return () => unsubscribe()
  }, [db])

  const kanpai = async (meId: string, targetId: string) => {
    const cheerUserIds = users.find((user) => user.id === meId)?.cheerUserIds ?? []
    const targetUser = users.find((user) => user.id === targetId)
    if (targetUser == null) {
      return
    }
    await updateDoc(doc(db, "users", meId), {
      cheerUserIds: [...cheerUserIds, targetUser.bleUserId],
      lastCheersUserId: targetUser.bleUserId,
    })
    await addDoc(collection(db, "cheers"), {
      fromUserId: meId,
      toUserId: targetId,
      timestamp: Date.now(),
    })
  }

  const setFaker = () => {
    setName(faker.person.fullName())
    setLocation(
      faker.helpers.arrayElement([
        "北海道・東北",
        "関東",
        "中部",
        "近畿",
        "中国・四国",
        "九州・沖縄",
        "海外",
      ]),
    )
    setTechArea(
      faker.helpers.arrayElement([
        "フロントエンド",
        "バックエンド",
        "モバイル",
        "インフラ",
        "ゲーム",
        "機械学習",
        "その他",
      ]),
    )
    setXId(faker.internet.userName())
    setInstagramId(faker.internet.userName())
    setHomepageLink(faker.internet.url())
  }

  const resetKanpai = async () => {
    await Promise.all(
      users.map((user) =>
        updateDoc(doc(db, "users", user.id), {
          cheerUserIds: [],
          lastCheersUserId: "",
        }),
      ),
    )
    // delete all document in cheers collection
    const querySnapshot = await getDocs(collection(db, "cheers"))
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref)
    })
  }

  const [userId, setUserId] = useState("")
  // const [bleUserId, setBleUserId] = useState("ABCDEF")
  const [name, setName] = useState("ななし")
  const [location, setLocation] = useState("関東")
  const [profileImageUrl, setProfileImageUrl] = useState(
    "https://zenn-dev.github.io/default-avatars/dark/y.png",
  )
  const [techArea, setTechArea] = useState("モバイル")
  const [xId, setXId] = useState("twitter")
  const [instagramId, setInstagramId] = useState("instagram")
  const [homepageLink, setHomepageLink] = useState("https://example.com")

  const createUser = async () => {
    const docId = userId === "" ? nanoid() : userId
    const bleUserId = customAlphabet("1234567890ABCDEF")(6)
    await setDoc(doc(db, "users", docId), {
      id: docId,
      bleUserId,
      cheerUserIds: [],
      deviceUuid: "",
      lastCheersUserId: "",
      location,
      name,
      profileImageUrl,
      techArea,
      xId,
      instagramId,
      homepageLink,
    })
  }

  return (
    <div className="flex flex-col gap-y-4">
      {users.map((user) => (
        <div key={user.id} className="p-4 bg-white border border-slate-200 rounded-lg shadow">
          <div className="font-bold">{user.name}</div>
          <div className="flex flex-wrap gap-2">
            {users
              .filter((u) => u.id !== user.id)
              .map((counterUser) => (
                <button
                  key={user.id}
                  onClick={() => {
                    if (counterUser == null) {
                      return
                    }
                    kanpai(user.id, counterUser.id)
                    kanpai(counterUser.id, user.id)
                  }}
                  className="border border-slate-200 rounded-lg shadow px-2 py-1 flex items-center"
                >
                  <MdOutlineLocalCafe />
                  {counterUser.name}
                </button>
              ))}
          </div>
          <hr className="my-1" />
          <div className="flex flex-wrap gap-1 mt-4">
            {user.cheerUserIds?.map((id) => {
              const counterUser = users.find((user) => user.id === id)
              return (
                <div key={id} className="border border-slate-200 rounded-lg shadow px-2 py-1">
                  <div className="flex items-center justify-between gap-x-4">
                    <div>{counterUser?.name ?? "Unknown"}</div>
                    <button
                      disabled={counterUser == null}
                      onClick={() => {
                        if (counterUser == null) {
                          return
                        }
                        kanpai(user.id, id)
                        kanpai(id, user.id)
                      }}
                      className="active:translate-y-0.5 disabled:text-slate-200 text-slate-400 hover:text-slate-600 transition"
                    >
                      <MdOutlineLocalCafe />
                    </button>
                  </div>
                  <div className="text-xs text-slate-400">{counterUser?.id ?? "Unknown"}</div>
                  <div className="text-xs text-slate-400">
                    ble{counterUser?.bleUserId ?? "Unknown"}
                  </div>
                  <div className="text-xs text-slate-400">
                    {counterUser?.deviceUuid ?? "Unknown"}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
      <button className="bg-white px-4 py-1 w-max mt-8 rounded-lg shadow" onClick={resetKanpai}>
        乾杯数リセット
      </button>
      <div className="bg-white p-4 w-max mt-8 rounded-lg shadow flex flex-col gap-y-4">
        <h2>ユーザー追加</h2>
        <button className="bg-white px-4 py-1 w-max mt-2 rounded-lg shadow" onClick={setFaker}>
          ダミー値
        </button>
        <FormItem label="UserID（空白にしたら自動生成）" value={userId} onChange={setUserId} />
        <FormItem label="名前" value={name} onChange={setName} />
        <FormItem label="地域" value={location} onChange={setLocation} />
        <FormItem label="技術" value={techArea} onChange={setTechArea} />
        <FormItem label="X" value={xId} onChange={setXId} />
        <FormItem label="インスタ" value={instagramId} onChange={setInstagramId} />
        <FormItem label="ホームページ" value={homepageLink} onChange={setHomepageLink} />
        <button className="bg-white px-4 py-1 w-max mt-2 rounded-lg shadow" onClick={createUser}>
          送信
        </button>
      </div>
    </div>
  )
}

const FormItem = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) => {
  return (
    <div className="flex items-start">
      <div className="text-sm w-[120px]">{label}</div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-slate-200 px-2 py-1"
      />
    </div>
  )
}

export default UserList
