import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  TextField,
  Paper,
  CircularProgress,
  Avatar,
  Stack,
  AppBar,
  Container,
  InputAdornment,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import MenuIcon from "@mui/icons-material/Menu";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AppsIcon from "@mui/icons-material/Apps";
import FolderIcon from "@mui/icons-material/Folder";
import { grey } from "@mui/material/colors";

const drawerWidth = 260;

const sidebarItems = [
  { label: "Yeni sohbet", icon: <AddIcon /> },
  { label: "Sohbetleri ara", icon: <SearchIcon /> },
  { label: "Kitaplık", icon: <LibraryBooksIcon /> },
  { label: "Projeler", icon: <FolderIcon /> },
  { label: "Uygulamalar", icon: <AppsIcon /> },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
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

  const drawer = (
    <Box
      sx={{
        height: "100%",
        bgcolor: "background.sidebar",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toolbar sx={{ minHeight: 56 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <ChatIcon />
          </Avatar>
          <Typography variant="h6" fontWeight={600}>
            VerbisAI
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: grey[800] }} />
      <List dense sx={{ flex: 1 }}>
        {sidebarItems.map((item) => (
          <ListItem button key={item.label} sx={{ borderRadius: 2, my: 0.5 }}>
            <ListItemIcon sx={{ color: "#fff", minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 15 }} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: grey[800] }} />
      <Box sx={{ p: 2, color: grey[400], fontSize: 13 }}>
        <b>Planları görüntüle</b><br />
        Sınırsız erişim, ekstra özellikler ve daha fazlası için yükselt!
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default" }}>
      {/* Sidebar - Responsive */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "background.sidebar",
              borderRight: 0,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
        {/* Mobile drawer (isteğe bağlı aç/kapa için eklenebilir) */}
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Topbar */}
        <AppBar
          position="static"
          elevation={0}
          color="transparent"
          sx={{
            borderBottom: `1px solid ${grey[900]}`,
            bgcolor: "background.default",
          }}
        >
          <Toolbar sx={{ minHeight: 56, px: 3, justifyContent: "flex-end" }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography fontSize={15} color={grey[400]}>
                darkhell1
              </Typography>
              <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>S</Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Chat Area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            px: { xs: 0, sm: 4 },
            py: 4,
            overflow: "auto"
          }}
        >
          <Container maxWidth="md" sx={{ flex: 1, display: "flex", flexDirection: "column", pt: 2 }}>
            <Box sx={{ flex: 1, minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              {chat.length === 0 && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign="center"
                  mt={8}
                  fontSize={20}
                  fontWeight={400}
                >
                  Merhaba! Sohbete başlamak için bir mesaj yazabilirsin.
                </Typography>
              )}
              {chat.map((m, i) => (
                <Stack
                  key={i}
                  direction="row"
                  justifyContent={m.sender === "user" ? "flex-end" : "flex-start"}
                  alignItems="flex-end"
                  spacing={1}
                  sx={{ width: "100%", my: 1 }}
                >
                  {m.sender === "ai" && (
                    <Avatar sx={{
                      bgcolor: "primary.main",
                      width: 32,
                      height: 32,
                      fontSize: 18,
                    }}>
                      <ChatIcon fontSize="small" />
                    </Avatar>
                  )}
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: "75%",
                      bgcolor: m.sender === "user" ? "primary.main" : "background.paper",
                      color: m.sender === "user" ? "#18191A" : "text.primary",
                      borderRadius: 3,
                      borderTopRightRadius: m.sender === "user" ? 0 : 3,
                      borderTopLeftRadius: m.sender === "user" ? 3 : 0,
                      boxShadow: 1,
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
                    <Avatar sx={{
                      bgcolor: "secondary.main",
                      width: 32,
                      height: 32,
                      fontSize: 18,
                    }}>S</Avatar>
                  )}
                </Stack>
              ))}
              {loading && (
                <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                  <Avatar sx={{
                    bgcolor: "primary.main",
                    width: 32,
                    height: 32,
                    fontSize: 18,
                  }}>
                    <ChatIcon fontSize="small" />
                  </Avatar>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: "background.paper",
                      color: "text.secondary",
                      borderRadius: 3,
                      boxShadow: 1,
                    }}
                  >
                    <CircularProgress size={20} color="primary" />
                  </Paper>
                </Stack>
              )}
              <div ref={messagesEndRef} />
            </Box>
          </Container>
        </Box>

        {/* Chat Input */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 3,
            px: { xs: 1, sm: 5 },
            bgcolor: "background.default",
            borderTop: `1px solid ${grey[900]}`,
          }}
        >
          <Paper
            sx={{
              width: "100%",
              maxWidth: 800,
              borderRadius: 6,
              boxShadow: 3,
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1,
              bgcolor: "#232428",
            }}
            elevation={4}
          >
            <TextField
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) sendMsg();
              }}
              placeholder="Herhangi bir şey sor"
              variant="standard"
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { color: "#fff", fontSize: "1.1rem" },
                startAdornment: (
                  <InputAdornment position="start">
                    <AddIcon sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              }}
              disabled={loading}
              sx={{ mr: 2 }}
            />
            <IconButton
              onClick={sendMsg}
              color="primary"
              sx={{ ml: 1, bgcolor: "#222", "&:hover": { bgcolor: "primary.dark" } }}
              disabled={loading || !input.trim()}
            >
              <SendIcon />
            </IconButton>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
