import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  IconButton,
  CircularProgress,
  AppBar,
  Toolbar,
  Avatar,
  Stack,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";

export default function Home() {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom on new message
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat, loading]);

  const sendMsg = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setChat([...chat, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setChat((current) => [
        ...current,
        { sender: "ai", text: data.reply || "Bir hata oluştu." },
      ]);
    } catch {
      setChat((current) => [
        ...current,
        { sender: "ai", text: "Sunucuya ulaşılamıyor." },
      ]);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <AppBar position="static" elevation={1} color="default">
        <Toolbar>
          <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
            <ChatIcon />
          </Avatar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            VerbisAI Chat
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ pt: 4, pb: 2 }}>
        <Paper
          elevation={4}
          sx={{
            minHeight: 400,
            maxHeight: 500,
            p: 2,
            mb: 2,
            overflowY: "auto",
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {chat.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mt={16}
            >
              Sohbete başlamak için bir mesaj yaz!
            </Typography>
          )}
          {chat.map((m, i) => (
            <Stack
              key={i}
              direction="row"
              justifyContent={m.sender === "user" ? "flex-end" : "flex-start"}
              alignItems="flex-end"
              spacing={1}
              sx={{ mb: 1 }}
            >
              {m.sender === "ai" && (
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 28,
                    height: 28,
                    fontSize: 16,
                  }}
                >
                  <ChatIcon fontSize="small" />
                </Avatar>
              )}
              <Paper
                sx={{
                  p: 1.5,
                  maxWidth: "75%",
                  bgcolor:
                    m.sender === "user"
                      ? "primary.main"
                      : "background.default",
                  color: m.sender === "user" ? "#18191A" : "text.primary",
                  borderRadius: 3,
                  borderTopRightRadius: m.sender === "user" ? 0 : 3,
                  borderTopLeftRadius: m.sender === "user" ? 3 : 0,
                  boxShadow: 2,
                  fontSize: "1rem",
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                }}
              >
                <span style={{ fontWeight: m.sender === "user" ? 500 : 400 }}>
                  {m.text}
                </span>
              </Paper>
              {m.sender === "user" && (
                <Avatar
                  sx={{
                    bgcolor: "secondary.main",
                    width: 28,
                    height: 28,
                    fontSize: 16,
                  }}
                >
                  S
                </Avatar>
              )}
            </Stack>
          ))}
          {loading && (
            <Stack direction="row" alignItems="center" spacing={1} mt={1}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 28,
                  height: 28,
                  fontSize: 16,
                }}
              >
                <ChatIcon fontSize="small" />
              </Avatar>
              <Paper
                sx={{
                  p: 1.5,
                  bgcolor: "background.default",
                  color: "text.secondary",
                  borderRadius: 3,
                  boxShadow: 2,
                }}
              >
                <CircularProgress size={18} color="primary" />
              </Paper>
            </Stack>
          )}
          <div ref={messagesEndRef} />
        </Paper>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 2,
            p: 1,
          }}
        >
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) sendMsg();
            }}
            placeholder="Bir şeyler yaz..."
            variant="standard"
            fullWidth
            InputProps={{
              disableUnderline: true,
              sx: { color: "text.primary", fontSize: "1.1rem" },
            }}
            disabled={loading}
          />
          <IconButton
            onClick={sendMsg}
            color="primary"
            sx={{ ml: 1 }}
            disabled={loading || !input.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}
