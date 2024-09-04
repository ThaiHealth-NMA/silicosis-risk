import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "../../../../lib/supabase";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        account: { label: "Account", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { account, password } = credentials;

        const { data, error } = await supabase
          .from("account")
          .select("*")
          .eq("account", account)
          .single();

        if (error || !data) {
          throw new Error("No user found with the account");
        }

        const isValidPassword = password === data.password;

        if (isValidPassword) {
          const { error: updateError } = await supabase
            .from("account")
            .update({ last_login: new Date().toISOString() })
            .eq("id", data.id);

          if (updateError) {
            console.error("Error updating last_login:", updateError.message);
            throw new Error("Unable to update last login time");
          }

          // Return user details
          return { id: data.id, name: data.name, account: data.account };
        } else {
          throw new Error("Invalid password");
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60,
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
