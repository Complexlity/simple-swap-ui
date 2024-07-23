import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import gearLogo from "@/assets/gear.svg";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GeneralSettings() {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="cursor-pointer rounded-lg bg-[#DCDCE6] p-2">
          <img className="h-6 w-6" src={gearLogo}></img>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[480px] bg-[#F5F5FF]">
        <DialogHeader>
          <DialogTitle className="relative flex items-center justify-between text-center text-[18px] font-semibold">
            <span className="w-full items-center">General Settings</span>
            <DialogClose asChild>
              <span className="cursor-pointer">
                <X
                  size={4}
                  className="right-0 top-1/2 h-8 w-8 text-gray-500 hover:text-blue-400"
                />
                <span className="sr-only">Close</span>
              </span>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between rounded-lg bg-[#EBEBF5] px-4 py-4">
          <span>Slippage Mode</span>
          <div className="flex gap-4">
            <Button className="rounded-lg bg-[#197CFF] font-medium hover:bg-blue-400">
              Auto
            </Button>
            <Button className="rounded-lg bg-[#787882] font-medium">
              Fixed
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-[#EBEBF5] px-4 py-6">
          <span>Direct Route Only</span>
          <Switch className="text-[#006EFF] data-[state=checked]:bg-[#006EFF]" />
        </div>
        <DialogClose asChild>
          <Button
            onClick={() => saveSettings}
            variant={"outline"}
            className="cursor-pointer rounded-lg bg-[#CCE2FF] py-6 text-[#006EFF] hover:bg-blue-200 hover:text-[#006EFF]"
          >
            Save Settings
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function saveSettings() {
  console.log("Settings was saved");
}
