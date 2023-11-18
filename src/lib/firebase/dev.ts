import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

import { devConfig } from "./config"

export const devApp = initializeApp(devConfig, "dev")

export const devDb = getFirestore(devApp)
