import { useState } from "react";
import Sky from "./components/Sky";
import PhotoStack from "./components/PhotoStack";
import FlowerMessage from "./components/FlowerMessage";
import MermaidSequinBoard from "./components/MermaidSequinBoard";
import "./App.css";
import "./App.css";

type Tab = "months" | "flower" | "board";

export default function App() {
  const [tab, setTab] = useState<Tab>("months");

  return (
    <>
      <Sky />
      <div id="app">
        <header>
          <h1>Happy Anniversary ♡</h1>
        </header>

        <nav>
          <button
            className={`tab ${tab === "months" ? "active" : ""}`}
            onClick={() => setTab("months")}
          >
            Our Months
          </button>
          <button
            className={`tab ${tab === "flower" ? "active" : ""}`}
            onClick={() => setTab("flower")}
          >
            Flower
          </button>
          <button
            className={`tab ${tab === "board" ? "active" : ""}`}
            onClick={() => setTab("board")}
          >
            Scratch Pad
          </button>
        </nav>

        <main>
          {tab === "months" && <PhotoStack />}

          {tab === "flower" && (
            <section className="page">
              <FlowerMessage />
            </section>
          )}

          {tab === "board" && (
            <section className="page board-page">
              <p className="board-note">draw something for me ♡</p>
              <MermaidSequinBoard />
            </section>
          )}
        </main>
      </div>
    </>
  );
}
