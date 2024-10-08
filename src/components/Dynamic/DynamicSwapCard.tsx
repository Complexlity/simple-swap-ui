import arrowDownIcon from "@/assets/arrowDown.svg"
import reloadIcon from "@/assets/reload.svg"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
import { useEffect, useState } from "react"
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
import { Spinner } from "./Spinner"
import { useMutation } from "@tanstack/react-query"
import { toast } from "../ui/use-toast"

function getPriceAtoB(priceA: number, priceB: number) {
  return priceA / priceB
}

const tokenSchema = z.string().refine((item: string) => {
  return !(Number(item) > 0)
})

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
  // const [price, setPrice] = useState<number | null>(null)
  const [formDisabled, setFormDisabled] = useState(true)
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { inputTokenAmount: "", outputTokenAmount: "" },
  })

  const { isPending: isSwapping, mutate: submitForm } = useMutation({
    mutationFn: async (values: {
      in: Token & { amount: number }
      out: Token & { amount: number }
    }) => {
      return new Promise<typeof values>((resolve) => {
        setTimeout(() => {
          resolve(values)
        }, 3000)
      })
    },
    onSuccess: (data) => {
      form.reset()
      toast({
        variant: "success",
        title: `You successfully swapped ${data.in.amount} ${data.in.symbol} for ${data.out.amount} ${data.out.symbol}`,
      })
    },
    onError: () => {
      console.log("Error creating")
      toast({
        title: "Something wrong creating swap",
      })
    },
  })

  const inputValue = form.getValues("inputTokenAmount")
  const outputValue = form.getValues("outputTokenAmount")

  //Tokens caching
  useEffect(() => {
    if (!tokens) return
    //Update tokens cache
    updateRecentlyPicked("input")

    //Don't allow setting same token as input and output
    //Ref: https://app.uniswap.org/swap
    if (inputToken?.symbol === outputToken?.symbol) {
      setOutputToken(undefined)
      form.setValue("inputTokenAmount", form.getValues("outputTokenAmount"))
      form.setValue("outputTokenAmount", "")
    }

    //if the use already has entered a value in output before adding an input value, do the calculations for the possible input value
    if (outputToken?.symbol && outputValue) {
      if (inputToken?.priceUsd && outputToken?.priceUsd) {
        form.setValue(
          "inputTokenAmount",
          `${(Number(outputValue) / getPriceAtoB(outputToken.priceUsd, inputToken.priceUsd)).toFixed(2)}`,
        )
      }
    }
  }, [inputToken?.symbol, tokens])

  //Tokens caching
  useEffect(() => {
    if (!tokens) return
    //Update tokens cache
    updateRecentlyPicked("output")

    //Don't allow setting same token as input and output
    //Ref: https://app.uniswap.org/swap

    if (inputToken?.symbol === outputToken?.symbol) {
      setInputToken(undefined)
      form.setValue("outputTokenAmount", form.getValues("inputTokenAmount"))
      form.setValue("inputTokenAmount", "")
    }

    // //if the use already has entered a value in input before adding an output token, do the calculations for the possible output value
    else if (inputToken?.symbol && inputValue) {
      if (inputToken?.priceUsd && outputToken?.priceUsd) {
        form.setValue(
          "outputTokenAmount",
          `${(Number(inputValue) * getPriceAtoB(outputToken.priceUsd, outputToken.priceUsd)).toFixed(2)}`,
        )
      }
    }
  }, [outputToken?.symbol, tokens])

  //Update Dummy token price randomly when the tokens change
  useEffect(() => {}, [inputToken?.symbol, outputToken?.symbol])

  //Disable the swap button if input values or input tokens are missing
  useEffect(() => {
    const buttonDisabled = !(
      inputToken &&
      outputToken &&
      Number(inputValue) > 0 &&
      Number(outputValue) > 0
    )
    setFormDisabled(buttonDisabled)
  }, [inputToken, outputToken, inputValue, outputValue])

  //Function that actually does the caching
  function updateRecentlyPicked(type: "input" | "output") {
    const changedToken = type === "input" ? inputToken : outputToken
    if (!changedToken || !tokens) return
    let tokensCache = [...tokensWithCache]
    tokensCache = tokensCache.filter((a) => a.symbol !== changedToken?.symbol)
    tokensCache.unshift(changedToken)
    const mergedTokens = mergeTokensWithCacheTokens(tokensCache, tokens)
    setTokensWithCache(tokensCache.slice(0, 8))
    setMergedTokensWithCache(mergedTokens)
  }

  function interchangeTokens() {
    const tempToken = inputToken
    setInputToken(outputToken)
    setOutputToken(tempToken)
    form.setValue("inputTokenAmount", "0")
    form.setValue("outputTokenAmount", "0")
  }

  function setInputAmountFromBalance(percentage: number) {
    const inputValue = (percentage / 100) * user.balance
    form.setValue("inputTokenAmount", `${inputValue}`)
    if (inputToken?.symbol && outputToken?.symbol) {
      form.setValue(
        "outputTokenAmount",
        `${(Number(inputValue) * getPriceAtoB(outputToken.priceUsd, inputToken.priceUsd)).toFixed(2)}`,
      )
    }
  }

  function resetAll() {
    form.reset()
    setInputToken(undefined)
    setOutputToken(undefined)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!inputToken || !outputToken) return
    const swap = {
      in: { ...inputToken, amount: Number(values.inputTokenAmount) },
      out: { ...outputToken, amount: Number(values.outputTokenAmount) },
    }
    //Perform swap
    //Would take in the items to be swapped
    submitForm(swap)
  }

  return (
    <div className="flex w-full flex-col-reverse justify-center gap-4 sm:flex-row">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-[480px] flex-col gap-4 rounded-xl bg-primary-100 px-4 py-4"
        >
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span>Balance: 1276.9997 SUI</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInputAmountFromBalance(25)}
                className="rounded-lg border-2 border-muted-100 px-1 py-1 text-sm font-medium hover:bg-gray-200"
              >
                25%
              </button>

              <button
                type="button"
                onClick={() => setInputAmountFromBalance(50)}
                className="rounded-lg border-2 border-muted-100 px-1 py-1 text-sm font-medium hover:bg-gray-200"
              >
                50%
              </button>

              <button
                type="button"
                onClick={() => setInputAmountFromBalance(75)}
                className="rounded-lg border-2 border-muted-100 px-1 py-1 text-sm font-medium hover:bg-gray-200"
              >
                75%
              </button>

              <button
                type="button"
                onClick={() => setInputAmountFromBalance(100)}
                className="rounded-lg border-2 border-muted-100 px-1 py-1 text-sm font-medium hover:bg-gray-200"
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
                    <div
                      tabIndex={0}
                      className="rounded-lg bg-muted-100 px-3 py-2 focus:border focus:border-primary-200"
                    >
                      <FormLabel className="flex justify-end text-[14px] text-muted-500">
                        Sell
                      </FormLabel>
                      <div className="flex items-center justify-between gap-4">
                        <SelectTokenDialog type="sell" item={inputToken} />
                        <FormControl>
                          <input
                            {...field}
                            onChange={(e) => {
                              const value = Number(e.target.value)

                              //Since we're using type="text" prevents the user entering a non number or decimal value
                              if (isNaN(value) && e.target.value !== ".") return
                              if (outputToken && inputToken) {
                                const calculatedOutput =
                                  Number(e.target.value) *
                                  getPriceAtoB(
                                    outputToken.priceUsd,
                                    inputToken.priceUsd,
                                  )
                                //Sets the output token depending on the price
                                form.setValue(
                                  "outputTokenAmount",
                                  formatNumber(calculatedOutput).toString(),
                                )
                              }
                              console.log(value, e.target.value)
                              e.target.value =
                                e.target.value == ""
                                  ? ""
                                  : e.target.value == "."
                                    ? "0."
                                    : e.target.value.endsWith(".")
                                      ? e.target.value
                                      : `${Number(e.target.value)}`

                              field.onChange(e)
                            }}
                            inputMode="decimal"
                            autoComplete="off"
                            autoCorrect="off"
                            type="text"
                            pattern="^[0-9]*[.,]?[0-9]*$"
                            className="w-0 flex-1 border-none bg-transparent text-right text-3xl text-gray-600 outline-none placeholder:text-gray-400 sm:text-5xl"
                            placeholder="0"
                            minLength={1}
                            maxLength={79}
                          />
                        </FormControl>
                      </div>
                      <span className="flex justify-end text-[14px] text-muted-900">
                        $1.0645945
                      </span>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="outputTokenAmount"
                render={({ field }) => (
                  <FormItem>
                    <div
                      tabIndex={0}
                      className="rounded-lg bg-muted-100 px-3 py-2 focus:border focus:border-primary-200"
                    >
                      <FormLabel className="flex justify-end text-[14px] text-muted-500">
                        Buy
                      </FormLabel>
                      <div className="flex items-center justify-between gap-4">
                        <SelectTokenDialog type="buy" item={outputToken} />
                        <FormControl>
                          <input
                            {...field}
                            onChange={(e) => {
                              const value = Number(e.target.value)
                              //Since we're using type="text" prevents the user entering a non number or decimal value
                              if (isNaN(value) && e.target.value !== ".") return
                              if (inputToken && outputToken) {
                                const calculatedInput =
                                  Number(e.target.value) /
                                  getPriceAtoB(
                                    outputToken.priceUsd,
                                    inputToken.priceUsd,
                                  )
                                //Sets the input token depending on the price
                                form.setValue(
                                  "inputTokenAmount",
                                  formatNumber(calculatedInput).toString(),
                                )
                              }

                              //Prevents scenarios like 01.727, 0371
                              e.target.value =
                                e.target.value == ""
                                  ? ""
                                  : e.target.value == "."
                                    ? "0."
                                    : e.target.value.endsWith(".")
                                      ? e.target.value
                                      : `${Number(e.target.value)}`
                              field.onChange(e)
                            }}
                            inputMode="decimal"
                            autoComplete="off"
                            autoCorrect="off"
                            type="text"
                            pattern="^[0-9]*[.,]?[0-9]*$"
                            className="w-0 flex-1 appearance-none border-none bg-transparent text-right text-3xl text-gray-600 outline-none placeholder:text-gray-400 sm:text-5xl"
                            placeholder="0"
                            minLength={1}
                            maxLength={79}
                          />
                        </FormControl>
                      </div>
                      <span className="flex justify-end text-[14px] text-muted-900">
                        $1.0645945
                      </span>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <button
              type="button"
              onClick={() => interchangeTokens()}
              className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 cursor-pointer rounded-full border-[3px] border-primary-100 bg-muted-300 px-2 py-2 hover:bg-muted-400"
            >
              <img src={arrowDownIcon} className="h-6 w-6" />
            </button>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                disabled={formDisabled || isSwapping}
                variant={"outline"}
                className="cursor-pointer rounded-lg bg-primary-50 py-6 text-primary-200 hover:bg-blue-200 hover:text-primary-200"
              >
                {isSwapping ? <Spinner /> : "SWAP"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Swap</AlertDialogTitle>
                <AlertDialogDescription>
                  You're swapping {Number(inputValue)} {inputToken?.symbol} for{" "}
                  {outputValue} {outputToken?.symbol}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-red-500">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    type="submit"
                    onClick={() => onSubmit(form.getValues())}
                    disabled={formDisabled || isSwapping}
                    variant={"outline"}
                    className="cursor-pointer rounded-lg bg-primary-50 text-primary-200 hover:bg-blue-200 hover:text-primary-200"
                  >
                    Confirm
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
      <div className="flex w-full max-w-[480px] justify-end gap-2 sm:w-auto sm:flex-col sm:justify-normal">
        <GeneralSettings />
        <button
          onClick={() => resetAll()}
          className="cursor-pointer rounded-lg bg-muted-300 p-2"
        >
          <img className="h-6 w-6" src={reloadIcon}></img>
        </button>
      </div>
    </div>
  )
}

//Function to merge tokens from cache and all tokens removing possible duplicates
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

function formatNumber(num: number) {
  return num === 0 ? 0 : Number(num.toFixed(2))
}
