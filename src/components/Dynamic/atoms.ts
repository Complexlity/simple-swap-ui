import { atom } from "jotai"
import { Token } from "./token.types"
import tokens from "./token.json"
export const userAtom = atom({
  address: "0x25571Aed5E79A9D5B5145D0F86341690Ab617D78",
  balance: 12345.113,
})

export const nativeTokenData = tokens.tokens[0]

export const inputTokenAtom = atom<Token | undefined>(nativeTokenData)
export const outputTokenAtom = atom<Token | undefined>(undefined)
export const tokensCacheAtom = atom<Token[]>([])
export const mergedTokensWithCacheAtom = atom<Token[]>([])

type GeneralSettings = {
  slippageMode: "auto" | "fixed"
  directRoute: boolean
}

export const generalSettingsAtom = atom<GeneralSettings>({
  slippageMode: "auto",
  directRoute: true,
})
