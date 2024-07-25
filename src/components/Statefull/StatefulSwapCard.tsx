import arrowDownIcon from "@/assets/arrowDown.svg"
import reloadIcon from "@/assets/reload.svg"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  inputTokenAtom,
  mergedTokensWithCacheAtom,
  outputTokenAtom,
  tokensCacheAtom,
  userAtom,
} from "./atoms"
import GeneralSettings from "./GeneralSettings"
import { SelectTokenDialog } from "./SelectTokenDialog"
import { Token } from "./token.types"
import { useTokens } from "./useTokens"
// const tokenSchema = z.union([
//   z.string().regex(/^\d+$/), // matches strings that are only digits
//   z.string().regex(/^\d+\.\d+$/), // matches strings that are a decimal number
// ]);
// const tokenSchema = z.union([
//   z.number(),
//   z.number()
// ]);

const tokenSchema = z.string().min(1)

const formSchema = z.object({
  inputTokenAmount: tokenSchema,
  outputTokenAmount: tokenSchema,
})

export default function SwapCard() {
  const user = useAtomValue(userAtom)
  const { data: tokens } = useTokens()
  const [inputToken, setInputToken] = useAtom(inputTokenAtom)
  const [outputToken, setOutputToken] = useAtom(outputTokenAtom)
  const [tokensWithCache, setTokensWithCache] = useAtom(tokensCacheAtom)
  const setMergedTokensWithCache = useSetAtom(mergedTokensWithCacheAtom)

 
  useEffect(() => {
    //Update tokens cached
    if(!tokens) return
    updateRecentlyPicked("input")

    //Don't allow setting same token as input and output
    //Ref: https://app.uniswap.org/swap
    if (inputToken?.symbol === outputToken?.symbol) {
      setOutputToken(undefined)
      form.setValue("inputTokenAmount", form.getValues("outputTokenAmount"))
      form.setValue("outputTokenAmount", "")
    }
  }, [inputToken?.symbol, tokens])

  useEffect(() => {
    if(!tokens) return
    //Update tokens cached
    updateRecentlyPicked("output")

    //Don't allow setting same token as input and output
    //Ref: https://app.uniswap.org/swap
    if (inputToken?.symbol === outputToken?.symbol) {
      setInputToken(undefined)
      form.setValue("outputTokenAmount", form.getValues("inputTokenAmount"))
      form.setValue("inputTokenAmount", "")
    }
  }, [outputToken?.symbol, tokens])

  function mergeTokensWithCacheTokens(
    tokensFromCache: Token[],
    allTokens: Token[] | undefined,
  ) {
    if (!allTokens) allTokens = []
    let mergedArray = tokensFromCache.concat(allTokens)

    mergedArray = mergedArray.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.symbol === value.symbol),
    )
    return mergedArray
  }

  function updateRecentlyPicked(type: "input" | "output") {
    const changedToken = type === "input" ? inputToken : outputToken
    if (!changedToken || !tokens) return
    let tokensCache = [...tokensWithCache]
    tokensCache = tokensCache.filter((a) => a.symbol !== changedToken?.symbol)
    tokensCache.unshift(changedToken)
    const mergedTokens = mergeTokensWithCacheTokens(tokensCache, tokens)
    setTokensWithCache(tokensCache.slice(0, 8))
    console.log(mergedTokens)
    setMergedTokensWithCache(mergedTokens)
  }

  function interchangeTokens() {
    const tempToken = inputToken
    const tempAmount = form.getValues("inputTokenAmount")
    setInputToken(outputToken)
    form.setValue("inputTokenAmount", form.getValues("outputTokenAmount"))
    setOutputToken(tempToken)
    form.setValue("outputTokenAmount", tempAmount)
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { inputTokenAmount: "", outputTokenAmount: "" },
  })

  function setInputAmountFromBalance(percentage: number) {
    const inputValue = (percentage / 100) * user.balance
    form.setValue("inputTokenAmount", `${inputValue}`)
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    //Perform swap
    console.log("I submitted")
    console.log(values)
  }

  return (
    <div className="flex justify-center gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-[480px] flex-col gap-4 rounded-xl bg-[#F5F5FF] px-4 py-4"
        >
          <div className="flex items-center justify-between">
            <span>Balance: 1276.9997 SUI</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInputAmountFromBalance(25)}
                className="rounded-lg border-2 border-[#EBEBF5] px-1 py-1 text-sm font-medium hover:bg-gray-200"
              >
                25%
              </button>

              <button
                type="button"
                onClick={() => setInputAmountFromBalance(50)}
                className="rounded-lg border-2 border-[#EBEBF5] px-1 py-1 text-sm font-medium hover:bg-gray-200"
              >
                50%
              </button>

              <button
                type="button"
                onClick={() => setInputAmountFromBalance(75)}
                className="rounded-lg border-2 border-[#EBEBF5] px-1 py-1 text-sm font-medium hover:bg-gray-200"
              >
                75%
              </button>

              <button
                type="button"
                onClick={() => setInputAmountFromBalance(100)}
                className="rounded-lg border-2 border-[#EBEBF5] px-1 py-1 text-sm font-medium hover:bg-gray-200"
              >
                MAX
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="inputTokenAmount"
                render={({ field }) => (
                  <FormItem>
                    <div className="rounded-lg bg-[#EBEBF5] px-3 py-2">
                      <FormLabel className="flex justify-end text-[14px] text-[#787882]">
                        Sell
                      </FormLabel>
                      <div className="flex items-center justify-between gap-4">
                        <SelectTokenDialog type="sell" item={inputToken} />
                        <FormControl>
                          <input
                            {...field}
                            inputMode="decimal"
                            autoComplete="off"
                            autoCorrect="off"
                            type="number"
                            pattern="^[0-9]*[.,]?[0-9]*$"
                            className="w-0 flex-1 border-none bg-transparent text-right text-5xl outline-none"
                            placeholder="0"
                            minLength={1}
                            maxLength={79}
                          />
                        </FormControl>
                      </div>
                      <span className="flex justify-end text-[14px] text-[#0C0C14]">
                        $1.0645945
                      </span>
                    </div>

                    {/* <FormDescription>This is your public display name.</FormDescription> */}
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="outputTokenAmount"
                render={({ field }) => (
                  <FormItem>
                    <div className="rounded-lg bg-[#EBEBF5] px-3 py-2">
                      <FormLabel className="flex justify-end text-[14px] text-[#787882]">
                        Buy
                      </FormLabel>
                      <div className="flex items-center justify-between gap-4">
                        <SelectTokenDialog type="buy" item={outputToken} />
                        <FormControl>
                          <input
                            {...field}
                            inputMode="decimal"
                            autoComplete="off"
                            autoCorrect="off"
                            type="number"
                            pattern="^[0-9]*[.,]?[0-9]*$"
                            className="w-0 flex-1 appearance-none border-none bg-transparent text-right text-5xl outline-none"
                            placeholder="0"
                            minLength={1}
                            maxLength={79}
                          />
                        </FormControl>
                      </div>
                      <span className="flex justify-end text-[14px] text-[#0C0C14]">
                        $1.0645945
                      </span>
                    </div>

                    {/* <FormDescription>This is your public display name.</FormDescription> */}
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
            </div>
            <button
              type="button"
              onClick={() => interchangeTokens()}
              className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 cursor-pointer rounded-full border-[3px] border-[#F5F5FF] bg-[#DCDCE6] px-2 py-2 hover:bg-[#bdbdd0]"
            >
              <img src={arrowDownIcon} className="h-6 w-6" />
            </button>
          </div>
          <Button
            type="submit"
            variant={"outline"}
            className="cursor-pointer rounded-lg bg-[#CCE2FF] py-6 text-[#006EFF] hover:bg-blue-200 hover:text-[#006EFF]"
          >
            SWAP
          </Button>
        </form>
      </Form>
      <div className="flex flex-col gap-2">
        <GeneralSettings />
        <div className="cursor-pointer rounded-lg bg-[#DCDCE6] p-2">
          <img className="h-6 w-6" src={reloadIcon}></img>
        </div>
      </div>
    </div>
  )
}
