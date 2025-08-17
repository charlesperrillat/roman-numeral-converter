import "./App.css";
import SSEConverter from "./components/SSEConverter";

function App() {
  return (
    <main className="w-full">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-blue-500 my-4">
          Roman numeral converter
        </h1>
        <SSEConverter />
      </div>
    </main>
  );
}

export default App;
