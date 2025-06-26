import { useState } from 'react';

export default function Home() {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMsg = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setChat([...chat, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg })
    });
    const data = await res.json();
    setChat(current =>
      [...current, { sender: 'ai', text: data.reply }]
    );
    setLoading(false);
  };

  return (
    <div style={{ padding: 32, fontFamily: 'Arial' }}>
      <h1>ChatGPT ile Sohbet</h1>
      <div style={{
        border: '1px solid #ddd', padding: 16, width: 400, height: 350,
        overflowY: 'auto', marginBottom: 16, background: '#fafafa'
      }}>
        {chat.map((m, i) => (
          <div key={i} style={{ color: m.sender === 'user' ? 'blue' : 'green', margin: '8px 0' }}>
            <b>{m.sender === 'user' ? 'Sen' : 'ChatGPT'}:</b> {m.text}
          </div>
        ))}
        {loading && <div style={{ color: 'gray' }}>Cevap bekleniyor...</div>}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ width: 320 }}
        placeholder="Bir şeyler yaz..."
        onKeyDown={e => { if (e.key === 'Enter') sendMsg(); }}
      />
      <button onClick={sendMsg} style={{ width: 60 }}>Gönder</button>
    </div>
  );
}
