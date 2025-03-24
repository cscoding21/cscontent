
import { redirect } from "@sveltejs/kit"

export async function load(event) {
    const session = await event.locals.auth()
   
    if (session) {
      return redirect(301, "/home")
    } else {
      return redirect(301, "/login")
    }
  }