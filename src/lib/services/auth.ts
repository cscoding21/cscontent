import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import GoogleProvider from "@auth/sveltekit/providers/google"
import { env } from "$env/dynamic/private"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "$lib/services/prisma"
 
// https://mainmatter.com/blog/2023/11/23/setting-up-oauth-with-auth-js-and-sveltekit/

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
  const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      GitHub({
        clientId: env.AUTH_GITHUB_ID,
        clientSecret: env.AUTH_GITHUB_SECRET
      }),
      GoogleProvider({
        clientId: env.AUTH_GOOGLE_ID,
        clientSecret: env.AUTH_GOOGLE_SECRET
      })
    ],
    secret: env.AUTH_SECRET,
    trustHost: true
  }
  return authOptions
})