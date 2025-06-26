import { getCsrfToken, signIn } from "next-auth/react";
import { useState } from "react";
import { Container, Box, Paper, Typography, TextField, Button } from "@mui/material";

export default function Login({ csrfToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    if (res.error) setError("Giriş başarısız!");
    else window.location.href = "/";
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <Paper sx={{ p: 4, width: 1 }}>
          <Typography variant="h5" mb={2} fontWeight={700} align="center">
            Giriş Yap
          </Typography>
          <form onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <TextField
              label="Kullanıcı Adı"
              value={username}
              onChange={e => setUsername(e.target.value)}
              fullWidth margin="normal"
            />
            <TextField
              label="Şifre"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth margin="normal"
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Giriş Yap
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context)
    }
  };
}
