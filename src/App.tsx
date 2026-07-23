import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import LeftNavbar from "./components/LeftNavbar";
function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="bg-bg font-sans min-h-screen flex items-center justify-center">
      <LeftNavbar />
    </main>
  );
}

export default App;
