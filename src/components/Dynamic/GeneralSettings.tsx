import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import gearLogo from "@/assets/gear.svg"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAtom } from "jotai"
import { X } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { generalSettingsAtom } from "./atoms"
const FormSchema = z.object({
  slippageMode: z.enum(["auto", "fixed"]).default("auto"),
  directRoute: z.boolean().default(false),
})

export default function GeneralSettings() {
  const [generalSettings, setGeneralSettings] = useAtom(generalSettingsAtom)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: generalSettings,
  })

  useEffect(() => {
    form.reset({ ...generalSettings })
  }, [])

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setGeneralSettings({
      directRoute: data.directRoute,
      slippageMode: data.slippageMode,
    })
    toast({
      variant: "success",
      title: "General Settings Saved Successfully",
    })
  }

  return (
    <Dialog>
      <DialogTrigger>
        <div className="bg-muted-300 cursor-pointer rounded-lg p-2">
          <img className="h-6 w-6" src={gearLogo}></img>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-[480px] rounded-xl bg-primary-100">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle className="relative flex items-center justify-between text-center text-[18px] font-semibold">
                <span className="w-full items-center">General Settings</span>
                <DialogClose
                  // Re-sync state if settings do not change
                  onClick={() => form.reset({ ...generalSettings })}
                  asChild
                >
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

            <FormField
              control={form.control}
              name="slippageMode"
              render={({ field }) => (
                <FormItem className="bg-muted-100 border-muted-300 flex items-center justify-between rounded-lg border px-4 py-4">
                  <FormLabel>
                    <span>Slippage Mode</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="auto" className="hidden" />
                        </FormControl>
                        <FormLabel
                          className={buttonVariants({
                            className: cn(
                              "hover:bg-blue-400 bg-muted-500 cursor-pointer rounded-lg font-medium",
                              {
                                "bg-primary-300":
                                  form.getValues().slippageMode === "auto",
                              },
                            ),
                          })}
                        >
                          Auto
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="fixed" className="hidden" />
                        </FormControl>
                        <FormLabel
                          className={buttonVariants({
                            className: cn(
                              "hover:bg-blue-400 bg-muted-500 cursor-pointer rounded-lg font-medium",
                              {
                                "bg-primary-300":
                                  form.getValues().slippageMode === "fixed",
                              },
                            ),
                          })}
                        >
                          Fixed
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="directRoute"
              render={({ field }) => (
                <FormItem className="bg-muted-100 flex items-center justify-between rounded-lg px-4 py-6">
                  <FormLabel>
                    <span>Direct Route Only</span>
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="text-primary-200 data-[state=checked]:bg-primary-200"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogClose asChild>
              <Button
                type="submit"
                variant={"outline"}
                className="hover:bg-blue-200 text-primary-200 hover:text-primary-200 bg-primary-50 w-full cursor-pointer rounded-lg py-6"
              >
                Save Settings
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
