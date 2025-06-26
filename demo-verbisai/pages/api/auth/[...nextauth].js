import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Kullanıcı adı ve Şifre ile Giriş",
      credentials: {
        username: { label: "Kullanıcı Adı", type: "text" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        // Örnek: sabit kullanıcı (bunu kendi kullanıcı doğrulamanla değiştir)
        if (
          credentials.username === "demo" &&
          credentials.password === "demo123"
        ) {
          return { id: 1, name: "Demo Kullanıcı", email: "demo@site.com" };
        }
        return null;
      }
    })
    // Google, GitHub vb. için buraya ekleyebilirsin
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  }
});
