import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import jwt from "jsonwebtoken";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                const jwtToken = jwt.sign(
                    { id: token.id, email: token.email },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );
                session.jwt = jwtToken;
            }
            return session;
        },
    },
    
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
});
