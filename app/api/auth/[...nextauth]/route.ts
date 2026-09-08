import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

const config: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "İstifadəçi adı", type: "text" },
        password: { label: "Şifrə", type: "password" },
      },
      async authorize(credentials) {
        const adminUser = process.env.ADMIN_USERNAME ?? "admin"
        const adminPass = process.env.ADMIN_PASSWORD ?? "Ugur@2024!"

        if (
          credentials?.username === adminUser &&
          credentials?.password === adminPass
        ) {
          return { id: "1", name: "Admin", email: "admin@ugur.edu.az" }
        }
        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "ugur-admin-secret-key-2024",
}

const { handlers } = NextAuth(config)

export const { GET, POST } = handlers
