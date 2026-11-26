import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

export const config: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "İstifadəçi adı", type: "text" },
        password: { label: "Şifrə", type: "password" },
      },
      async authorize(credentials) {
        const adminUser = process.env.ADMIN_USERNAME
        const adminPass = process.env.ADMIN_PASSWORD

        if (
          Boolean(adminUser && adminPass) &&
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
  secret: process.env.NEXTAUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
