import arrowDownIcon from "@/assets/arrowDown.svg"
import reloadIcon from "@/assets/reload.svg"
import suiIcon from "@/assets/sui.svg"
import usdcIcon from "@/assets/usdc.svg"
import GeneralSettings from "../Dynamic/GeneralSettings"
import { SelectTokenDialog } from "./SelectTokenDialog"
import { Button } from "@/components/ui/button"

export default function SwapCard() {
  return (
    <div className="flex w-full max-w-[500px] flex-col-reverse justify-center gap-4 sm:flex-row">
      <div className="flex w-full flex-col gap-4 rounded-xl bg-primary-100 px-4 py-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span>Balance: 1276.9997 SUI</span>
          <div className="flex gap-2">
            <button className="hover:bg-gray-200 border-muted-100 rounded-lg border-2 px-1 py-1 text-sm font-medium">
              25%
            </button>

            <button className="hover:bg-gray-200 border-muted-100 rounded-lg border-2 px-1 py-1 text-sm font-medium">
              50%
            </button>

            <button className="hover:bg-gray-200 border-muted-100 rounded-lg border-2 px-1 py-1 text-sm font-medium">
              75%
            </button>

            <button className="hover:bg-gray-200 border-muted-100 rounded-lg border-2 px-1 py-1 text-sm font-medium">
              MAX
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="flex flex-col gap-2">
            <div
              tabIndex={0}
              className="bg-muted-100 focus:border-primary-200 rounded-lg px-3 py-2 focus:border"
            >
              <div className="text-muted-500 flex justify-end text-[14px]">
                Sell
              </div>
              <div className="flex items-center justify-between">
                <SelectTokenDialog name={"sui"} icon={suiIcon} />
                <input
                  inputMode="decimal"
                  autoComplete="off"
                  autoCorrect="off"
                  type="text"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  className="bg-transparent w-0 flex-1 border-none text-right text-3xl outline-none sm:text-5xl"
                  placeholder="0"
                  minLength={1}
                  maxLength={79}
                />
              </div>
              <span className="text-muted-900 flex justify-end text-[14px]">
                $1.0645945
              </span>
            </div>

            <div
              tabIndex={0}
              className="bg-muted-100 focus:border-primary-200 rounded-lg px-3 py-2 focus:border"
            >
              <div className="text-muted-500 flex justify-end text-[14px]">
                Buy
              </div>
              <div className="flex items-center justify-between">
                <SelectTokenDialog name={"usdc"} icon={usdcIcon} />
                <input
                  inputMode="decimal"
                  autoComplete="off"
                  autoCorrect="off"
                  type="text"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  className="bg-transparent w-0 flex-1 border-none text-right text-3xl outline-none sm:text-5xl"
                  placeholder="0"
                  minLength={1}
                  maxLength={79}
                />
              </div>
              <span className="text-muted-900 flex justify-end text-[14px]">
                $1.0645945
              </span>
            </div>
          </div>
          <div className="bg-muted-300 hover:bg-muted-400 absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 cursor-pointer rounded-full border-[3px] border-primary-100 px-2 py-2">
            <img src={arrowDownIcon} className="h-6 w-6" />
          </div>
        </div>
        <Button
          variant={"outline"}
          className="hover:bg-blue-200 text-primary-200 hover:text-primary-200 bg-primary-50 cursor-pointer rounded-lg py-6"
        >
          SWAP
        </Button>
      </div>

      <div className="flex justify-end gap-2 sm:flex-col sm:justify-normal">
        <GeneralSettings />
        <div className="bg-muted-300 cursor-pointer rounded-lg p-2">
          <img className="h-6 w-6" src={reloadIcon}></img>
        </div>
      </div>
    </div>
  )
}
