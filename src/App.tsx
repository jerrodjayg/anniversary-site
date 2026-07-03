import { useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import Sky from "./components/Sky";
import PhotoStack from "./components/PhotoStack";
import FlowerMessage from "./components/FlowerMessage";
import MermaidSequinBoard from "./components/MermaidSequinBoard";
import "./App.css";

type Tab = "months" | "flower" | "board";

const MUSIC_SRC =
  "/Chik%C3%A9%20%26%20Simi%20%20Running%20(To%20You)%20%5BOfficial%20Audio%5D.mp3";

export default function App() {
  const [tab, setTab] = useState<Tab>("months");

  function showTab(nextTab: Tab) {
    setTab(nextTab);
  }

  return (
    <>
      <Sky />
      {tab === "months" && (
        <ReactAudioPlayer src={MUSIC_SRC} autoPlay loop volume={0.55} />
      )}
      <div id="app">
        <header>
          <h1>Happy Anniversary ♡</h1>
        </header>

        <nav>
          <button
            className={`tab ${tab === "months" ? "active" : ""}`}
            onClick={() => showTab("months")}
          >
            Our Months
          </button>
          <button
            className={`tab ${tab === "flower" ? "active" : ""}`}
            onClick={() => showTab("flower")}
          >
            Flower
          </button>
          <button
            className={`tab ${tab === "board" ? "active" : ""}`}
            onClick={() => showTab("board")}
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
