import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

import { prodConfig } from "./config"

export const prodApp = initializeApp(prodConfig)

export const prodDb = getFirestore(prodApp)
