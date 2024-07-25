import StatefullSwapCard from "@/components/Statefull/StatefulSwapCard";
// import StatelessSwapCard from "@/components/Stateless/StatelessSwapCard";

function App() {
  return (
    <div className="container flex h-screen items-center justify-center flex-col">
      {/* <StatelessSwapCard /> */}
      <StatefullSwapCard />
    </div>
  );
}

export default App;
