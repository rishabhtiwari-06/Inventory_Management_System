import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Define your NextAuth options
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "name" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: credentials.name,
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const user = await res.json();

        if (res.ok && user) {
          return user;
        }
        return null;
      },
    }),
    
  ],
  
  session: {
    jwt: true,
  },
  callbacks: {
    async signIn({ user, account, profile,credentials }) {
      try {
        let payload = {};
        if (account.provider === "google") {
          // Handle Google sign-in
          payload = {
            name: profile.name,
            email: profile.email,
          };
        }
        else if (account.provider === "credentials") {
          // Handle Credentials sign-in
          payload = {
            name: credentials.name,
            email: credentials.email,
          };
        }
        const res = await fetch("http://localhost:5000/google-login", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        console.log('Response from backend:', data.user_id);
        if (data.user_id) {
          user.id = data.user_id;
        }
        return true;
      } catch (error) {
        console.error('Error sending Google login data to backend:', error);
        return false;
      }
    },
    secret: process.env.NEXTAUTH_SECRET,
    async jwt({ token, user }) {
      if (user) {
        // token.user_id = user.id;
        token.id = user.id;

      }
      return token;
    },
    async session({ session, token }) {
      // session.user.user_id = token.user_id;
      session.user.id = token.id;
      return session;
    },
  },
};

// Export named HTTP method handlers
export const GET = (req, res) => NextAuth(req, res, authOptions);
export const POST = (req, res) => NextAuth(req, res, authOptions);

// import NextAuth from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google';
// export const authoptions = NextAuth({
//     // Configure Google Provider
//     providers: [
//       GoogleProvider({
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       }),
//     ],
    // callbacks: {
    //     async signIn({ user, account, profile, email, credentials }) {
    //       try {
    //         const res = await fetch("http://localhost:5000/google-login",{
    //           method:'POST',
    //           headers:{'Content-Type': 'application/json',},
    //           body: JSON.stringify({ user, profile, email }),
    //         });
    //         const data = await res.json();
    //         console.log('Response from backend:', data);
    //       } catch (error) {
    //         console.error('Error sending Google login data to backend:', error);
    //         return false;
    //       }
    //       return true; // Continue the sign-in process
    //     },
//         async session({ session, token, user }) {
//           // Log session details
//           return session;
//         },
//       },
// });
// export { authoptions as GET, authoptions as POST };
