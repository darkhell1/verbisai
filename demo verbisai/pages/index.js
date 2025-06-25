import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setChat([...chat, userMsg]);
    setInput("");

    const { data } = await axios.post("/api/chat", { prompt: input });
    const botMsg = { role: "assistant", content: data.reply };
    setChat((c) => [...c, botMsg]);
  };

  return (
    <main style={{ fontFamily: "sans-serif", padding: 40 }}>
      <h1>Verbis AI</h1>
      <div
        style={{
          maxWidth: 600,
          height: 400,
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: 16,
          marginTop: 24,
        }}
      >
        {chat.map((m, i) => (
          <p key={i} style={{ whiteSpace: "pre-wrap" }}>
            <b>{m.role === "user" ? "Sen:" : "Verbis:"}</b> {m.content}
          </p>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <input
          style={{ width: 500, padding: 8 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Sorunu yaz..."
        />
        <button onClick={send} style={{ padding: 8, marginLeft: 8 }}>
          Gönder
        </button>
      </div>
    </main>
  );
}
