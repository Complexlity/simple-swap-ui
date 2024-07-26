import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StatefullSwapCard from "@/components/Statefull/StatefulSwapCard"
import StatelessSwapCard from "@/components/Stateless/StatelessSwapCard"

function App() {
  return (
    <div className="container flex h-screen flex-col items-center justify-center ">
      <Tabs defaultValue="dynamic" className="w-full  max-w-[480px]">
        <TabsList className="w-full my-8">
          <TabsTrigger value="dynamic" className="w-full">Dynamic</TabsTrigger>
          <TabsTrigger value="stateless" className="w-full">Stateless</TabsTrigger>
        </TabsList>
        <TabsContent value="dynamic">
          <StatefullSwapCard />
        </TabsContent>
        <TabsContent value="stateless">
          <StatelessSwapCard />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App
