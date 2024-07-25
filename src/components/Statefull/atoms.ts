import { atom } from "jotai"
import { Token } from "./token.types"

export const userAtom = atom({
  address: "0x25571Aed5E79A9D5B5145D0F86341690Ab617D78",
  balance: 12345.113,
})

export const nativeTokenData = {
  chainId: 1,
  address:
    "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
  decimals: 9,
  name: "Sui Coin",
  symbol: "SUI",
  logoURI:
    "https://raw.githubusercontent.com/sonarwatch/token-lists/main/images/common/SUI.png",
  tags: ["native"],
  extensions: {
    coingeckoId: "sui",
  },
}

export const inputTokenAtom = atom<Token | undefined>(nativeTokenData)
export const outputTokenAtom = atom<Token | undefined>(undefined)
export const tokensCacheAtom = atom<Token[]>([])

type GeneralSettings = {
  slippageMode: "auto" | "fixed"
  directRoute: boolean
}

export const generalSettingsAtom = atom<GeneralSettings>({
  slippageMode: "auto",
  directRoute: true,
})
