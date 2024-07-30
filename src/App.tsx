import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DynamicSwapCard from "@/components/Dynamic/DynamicSwapCard"
import StatelessSwapCard from "@/components/Stateless/StatelessSwapCard"

function App() {
  return (
    <div className="bg-muted-200 container flex h-screen flex-col items-center justify-center">
      <Tabs defaultValue="dynamic" className="w-full max-w-[480px]">
        <TabsList className="my-8 w-full">
          <TabsTrigger value="dynamic" className="w-full">
            Dynamic
          </TabsTrigger>
          <TabsTrigger value="stateless" className="w-full">
            Stateless
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dynamic">
          <DynamicSwapCard />
        </TabsContent>
        <TabsContent value="stateless">
          <StatelessSwapCard />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App
