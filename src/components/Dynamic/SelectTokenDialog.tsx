import caretDownIcon from "@/assets/caretDown.svg"
import suiIcon from "@/assets/sui.svg"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  atom,
  //@ts-expect-error: Set atom not exported but recognized by typescript
  SetAtom,
  SetStateAction,
  useAtom,
  useAtomValue,
  useSetAtom,
} from "jotai"
import { X } from "lucide-react"
import { ReactNode, useEffect, useMemo, useState } from "react"
import { Skeleton } from "../ui/skeleton"
import {
  inputTokenAtom,
  mergedTokensWithCacheAtom,
  outputTokenAtom,
} from "./atoms"
import { Token } from "./token.types"
import { useTokens } from "./useTokens"

type SelectTokenProps = {
  item?: Token
  type: "sell" | "buy"
}

const searchAtom = atom<string>("")

export function SelectTokenDialog(props: SelectTokenProps) {
  const { type, item } = props
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useAtom(searchAtom)

  useEffect(() => {
    setSearchValue("")
  }, [open])

  return (
    <Dialog open={open}>
      <DialogTrigger
        onClick={setOpen.bind(null, true)}
        className="text-sm sm:text-base"
      >
        {item ? (
          <span className="flex cursor-pointer items-center justify-between gap-2 overflow-hidden rounded-full border border-[#DCDCE6] bg-[#F5F5FF] px-2 pl-1 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50">
            {<img src={item.logoURI} className="my-1 w-8 rounded-full"></img>}
            <span className="uppercase">{item.symbol}</span>
            <img src={caretDownIcon}></img>
          </span>
        ) : (
          <span className="flex cursor-pointer justify-between gap-2 overflow-hidden rounded-full border border-[#DCDCE6] bg-blue-400 px-2 py-2 pl-1 text-white hover:bg-green-500 hover:text-white dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50">
            <span className="pl-2">Select Token</span>
            <img src={caretDownIcon}></img>
          </span>
        )}
      </DialogTrigger>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="bg-green-4000 max-w-[480px] rounded-2xl bg-[#F5F5FF] px-0 sm:rounded-2xl"
      >
        <div className="grid gap-4 px-4">
          <DialogHeader>
            <DialogTitle className="relative flex items-center justify-between text-center text-xl font-semibold">
              <span className="w-full items-center">Select Token</span>
              <DialogClose asChild onClick={setOpen.bind(null, false)}>
                <span className="cursor-pointer">
                  <X className="right-0 top-1/2 h-8 w-8 text-gray-500 hover:text-blue-400" />
                  <span className="sr-only">Close</span>
                </span>
              </DialogClose>
            </DialogTitle>{" "}
          </DialogHeader>
          <div className="flex w-full items-center space-x-2">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              type="text"
              className="text-search w-full rounded-full bg-[#EBEBF5] py-2 pl-10 pr-4"
              placeholder="Search name or address"
            />
            <Button
              variant={"outline"}
              className="flex cursor-pointer justify-between gap-2 rounded-full bg-[#EBEBF5] pl-1"
            >
              <img src={suiIcon}></img>
              <img src={caretDownIcon}></img>
            </Button>
          </div>
          <div>{<Options type={type} setOpen={setOpen} />}</div>
        </div>
        <Items type={type} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}

function OptionsBase({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-x-[12px] gap-y-2">{children}</div>
}

function Options({
  type,
  setOpen,
}: {
  type: "buy" | "sell"
  setOpen: SetAtom<[SetStateAction<boolean>], void>
}) {
  const { isLoading } = useTokens()
  const setInputToken = useSetAtom(inputTokenAtom)
  const setOutputToken = useSetAtom(outputTokenAtom)
  const setToken = type === "sell" ? setInputToken : setOutputToken
  const mergedTokensWithCache = useAtomValue(mergedTokensWithCacheAtom)
  if (isLoading) {
    const skeletons = []
    for (let i = 0; i < 8; i++) {
      skeletons.push(
        <Skeleton
          key={`options-skeleton-${i}`}
          className="w-24 rounded-full py-5"
        />,
      )
    }
    return <OptionsBase>{skeletons}</OptionsBase>
  }

  // const shuffledArray = shuffle(tokens)
  const components = []
  // const usedItem = tokens!
  // const usedItem = tokensCache!
  const usedItem = mergedTokensWithCache

  for (let i = 0; i < 8; i++) {
    const item = usedItem[i]
    components.push(
      <span
        key={`option-${type}-${i}`}
        onClick={() => {
          setToken(item)
          setOpen(false)
        }}
        className="flex cursor-pointer items-center justify-between gap-1 rounded-full bg-[#EBEBF5] px-2 py-2 text-[14px] hover:bg-gray-300"
      >
        <img src={item.logoURI} className="h-6 w-6 rounded-full"></img>
        <span className="uppercase">{item.symbol}</span>
      </span>,
    )
  }

  return <OptionsBase>{components}</OptionsBase>
}

function ItemsBase({ children }: { children: ReactNode }) {
  return (
    <div>
      <hr />
      <div className="h-[calc(100vh*0.5)] overflow-auto scrollbar-thin scrollbar-thumb-slate-200">
        <div className="grid px-4 text-[#787882]">
          <div className="flex justify-between px-2 py-4">
            <span>Token</span>
            <span>Balance</span>
          </div>
          <div className="flex flex-col gap-2">{children}</div>
        </div>
      </div>
    </div>
  )
}

function Items({
  type,
  setOpen,
}: {
  type: "buy" | "sell"
  setOpen: SetAtom<[SetStateAction<boolean>], void>
}) {
  const { isLoading } = useTokens()

  const setInputToken = useSetAtom(inputTokenAtom)
  const setOutputToken = useSetAtom(outputTokenAtom)
  const setToken = type === "sell" ? setInputToken : setOutputToken
  const mergedTokensWithCache = useAtomValue(mergedTokensWithCacheAtom)
  const searchValue = useAtomValue(searchAtom)
  const searchedItems = useMemo(() => {
    if (!searchValue) return mergedTokensWithCache
    return mergedTokensWithCache.filter((item) => {
      return (
        item.symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    })
  }, [searchValue])
  if (isLoading) {
    const skeletons = []
    for (let i = 0; i < 6; i++) {
      skeletons.push(
        <Skeleton key={`items-skeleton-${i}`} className="rounded-xl py-7" />,
      )
    }
    return <ItemsBase>{skeletons}</ItemsBase>
  }
  const components = []
  const usedItem = searchedItems

  for (let i = 0; i < usedItem.length; i++) {
    const token = usedItem[i]
    components.push(
      <div
        onClick={() => {
          setToken(token)
          setOpen(false)
        }}
        key={`item-${type}-${i}`}
        className="flex cursor-pointer items-center justify-between rounded-lg bg-[#EBEBF5] px-4 py-2 text-[14px] hover:bg-[#DCDCE6]"
      >
        <div className="flex gap-2">
          <img className="size-10 rounded-full" src={token.logoURI}></img>
          <div className="flex flex-col">
            <span className="font-medium uppercase text-[#0C0C14]">
              {token.name.split("(")[0]}
            </span>
            <span>{token.symbol}</span>
          </div>
        </div>
        <div className="flex flex-col text-end">
          <span className="font-medium text-[#0C0C14]">789</span>
          <span className="text-[14px]">$843.267</span>
        </div>
      </div>,
    )
  }
  return <ItemsBase>{components}</ItemsBase>
}
