import arrowDownIcon from "@/assets/arrowDown.svg";
import reloadIcon from "@/assets/reload.svg";
import suiIcon from "@/assets/sui.svg";
import usdcIcon from "@/assets/usdc.svg";
import GeneralSettings from "./GeneralSettings";
import { SelectTokenDialog } from "./SelectTokenDialog";
import { Button } from "@/components/ui/button";

export default function SwapCard() {
  return (
    <div className="flex justify-center gap-4">
      <div className="flex w-[480px] flex-col gap-4 rounded-xl bg-[#F5F5FF] px-4 py-4">
        <div className="flex items-center justify-between">
          <span>Balance: 1276.9997 SUI</span>
          <div className="flex gap-2">
            <button className="rounded-lg border-2 border-[#EBEBF5] px-1 py-1 text-sm font-medium hover:bg-gray-200">
              25%
            </button>

            <button className="rounded-lg border-2 border-[#EBEBF5] px-1 py-1 text-sm font-medium hover:bg-gray-200">
              50%
            </button>

            <button className="rounded-lg border-2 border-[#EBEBF5] px-1 py-1 text-sm font-medium hover:bg-gray-200">
              75%
            </button>

            <button className="rounded-lg border-2 border-[#EBEBF5] px-1 py-1 text-sm font-medium hover:bg-gray-200">
              MAX
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="flex flex-col gap-2">
            <div className="rounded-lg bg-[#EBEBF5] px-3 py-2">
              <div className="flex justify-end text-[14px] text-[#787882]">
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
                  className="w-0 flex-1 border-none bg-transparent text-right text-5xl outline-none"
                  placeholder="0"
                  minLength={1}
                  maxLength={79}
                />
              </div>
              <span className="flex justify-end text-[14px] text-[#0C0C14]">
                $1.0645945
              </span>
            </div>

            <div className="rounded-lg bg-[#EBEBF5] px-3 py-2">
              <div className="flex justify-end text-[14px] text-[#787882]">
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
                  className="w-0 flex-1 border-none bg-transparent text-right text-5xl outline-none"
                  placeholder="0"
                  minLength={1}
                  maxLength={79}
                />
              </div>
              <span className="flex justify-end text-[14px] text-[#0C0C14]">
                $1.0645945
              </span>
            </div>
          </div>
          <div className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 cursor-pointer rounded-full border-[3px] border-[#F5F5FF] bg-[#DCDCE6] px-2 py-2 hover:bg-[#bdbdd0]">
            <img src={arrowDownIcon} className="h-6 w-6" />
          </div>
        </div>
        <Button
          variant={"outline"}
          className="cursor-pointer rounded-lg bg-[#CCE2FF] py-6 text-[#006EFF] hover:bg-blue-200 hover:text-[#006EFF]"
        >
          SWAP
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <GeneralSettings />
        <div className="cursor-pointer rounded-lg bg-[#DCDCE6] p-2">
          <img className="h-6 w-6" src={reloadIcon}></img>
        </div>
      </div>
    </div>
  );
}
