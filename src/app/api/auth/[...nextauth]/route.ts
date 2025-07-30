import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      // Only allow @liquidlabs.inc email addresses
      if (user.email && user.email.endsWith('@liquidlabs.inc')) {
        return true
      }
      
      // Redirect to error page for non-liquidlabs emails
      return false
    },
    session: async ({ session, user }) => {
      // Add user info to session
      session.user.id = user.id
      return session
    },
  },
  pages: {
    error: '/auth/error', // Error page for rejected logins
  },
  session: {
    strategy: 'database',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }