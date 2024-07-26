import caretDownIcon from "@/assets/caretDown.svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

type SelectTokenProps = {
  name: string;
  icon: string;
};

export function SelectTokenDialog(props: SelectTokenProps) {
  const { name, icon } = props;
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant={"outline"}
          className="flex cursor-pointer justify-between gap-2 rounded-full border border-[#DCDCE6] bg-[#F5F5FF] pl-1"
        >
          <img src={icon}></img>
          <span className="uppercase">{name}</span>
          <img src={caretDownIcon}></img>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-green-4000 max-w-[480px] rounded-2xl bg-[#F5F5FF] px-0 sm:rounded-2xl">
        <div className="grid gap-4 px-4">
          <DialogHeader>
            <DialogTitle className="relative flex items-center justify-between text-center text-xl font-semibold">
              <span className="w-full items-center">Select Token</span>
              <DialogClose asChild>
                <span className="cursor-pointer">
                  <X className="right-0 top-1/2 h-8 w-8 text-gray-500 hover:text-blue-400" />
                  <span className="sr-only">Close</span>
                </span>
              </DialogClose>
            </DialogTitle>{" "}
          </DialogHeader>
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              className="w-full text-search py-2 rounded-full bg-[#EBEBF5] pl-10 pr-4"
              placeholder="Search name or address"
            />
            <Button
              variant={"outline"}
              className="flex cursor-pointer justify-between gap-2 rounded-full bg-[#EBEBF5] pl-1"
            >
              <img src={icon}></img>
              <img src={caretDownIcon}></img>
            </Button>
          </div>
          <div>{<Options {...props} />}</div>
        </div>

        <div>
          <Items {...props} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Options(props: SelectTokenProps) {
  const { icon, name } = props;
  const components = [];
  for (let i = 0; i < 8; i++) {
    components.push(
      <Button
        key={`option-${i}`}
        variant={"outline"}
        className="flex cursor-pointer justify-between gap-2 rounded-full bg-[#EBEBF5] pl-1 text-[14px]"
      >
        <img src={icon}></img>
        <span className="uppercase">{name}</span>
      </Button>,
    );
  }

  return (
    <div className="flex flex-wrap gap-x-[12px] gap-y-2">{components}</div>
  );
}

function Items(props: SelectTokenProps) {
  const { icon, name } = props;
  const components = [];
  for (let i = 0; i < 24; i++) {
    components.push(
      <div
        key={`option-${i}`}
        className="flex cursor-pointer items-center justify-between rounded-lg bg-[#EBEBF5] px-4 py-2 text-[14px] hover:bg-[#DCDCE6]"
      >
        <div className="flex gap-2">
          <img className="size-10" src={icon}></img>
          <div className="flex flex-col">
            <span className="font-medium uppercase text-[#0C0C14]">{name}</span>
            <span>{name.toLowerCase()}</span>
          </div>
        </div>
        <div className="flex flex-col text-end">
          <span className="font-medium text-[#0C0C14]">789</span>
          <span className="text-[14px]">$843.267</span>
        </div>
      </div>,
    );
  }
  return (
    <div>
      <hr />
      <div className="h-[calc(100vh*0.5)] overflow-auto scrollbar-thin scrollbar-thumb-slate-200">
        <div className="grid px-4 text-[#787882]">
          <div className="flex justify-between px-2 py-4">
            <span>Token</span>
            <span>Balance</span>
          </div>
          <div className="flex flex-col gap-2">{components}</div>;
        </div>
      </div>
    </div>
  );
}
