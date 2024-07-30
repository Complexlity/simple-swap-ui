import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import gearLogo from "@/assets/gear.svg"
import { Switch } from "@/components/ui/switch"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GeneralSettings() {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="bg-muted-300 cursor-pointer rounded-lg p-2">
          <img className="h-6 w-6" src={gearLogo}></img>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[480px] bg-primary-100">
        <DialogHeader>
          <DialogTitle className="relative flex items-center justify-between text-center text-[18px] font-semibold">
            <span className="w-full items-center">General Settings</span>
            <DialogClose asChild>
              <span className="cursor-pointer">
                <X
                  size={4}
                  className="text-gray-500 hover:text-blue-400 right-0 top-1/2 h-8 w-8"
                />
                <span className="sr-only">Close</span>
              </span>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <div className="bg-muted-100 border-muted-300 flex items-center justify-between rounded-lg border px-4 py-4">
          <span>Slippage Mode</span>
          <div className="flex gap-4">
            <Button className="hover:bg-blue-400 bg-primary-300 rounded-lg font-medium">
              Auto
            </Button>
            <Button className="bg-muted-500 rounded-lg font-medium">
              Fixed
            </Button>
          </div>
        </div>
        <div className="bg-muted-100 flex items-center justify-between rounded-lg px-4 py-6">
          <span>Direct Route Only</span>
          <Switch className="text-primary-200 data-[state=checked]:bg-primary-200" />
        </div>
        <DialogClose asChild>
          <Button
            onClick={() => saveSettings}
            variant={"outline"}
            className="hover:bg-blue-200 text-primary-200 hover:text-primary-200 bg-primary-50 cursor-pointer rounded-lg py-6"
          >
            Save Settings
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

function saveSettings() {
  console.log("Settings was saved")
}
