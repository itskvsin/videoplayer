import { NextAuthOptions } from "next-auth";
import credentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/modals/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    credentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Pasword", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password are required");
        }

        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user is found with this email");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error("Invalid Password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          console.error("Auth Error", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
