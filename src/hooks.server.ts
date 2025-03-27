import { handle as authHandle } from "$lib/services/auth"
import { getUserEmail } from "$lib/services/cms/helpers";
import { redirect } from "@sveltejs/kit";
import { sequence } from '@sveltejs/kit/hooks';


export async function handleFetch({ request, fetch, event }) {
    const userID = await getUserEmail(event.locals)
    
    if (!userID) {
      return redirect(302, "/login")
    }
  
    return fetch(request)
  }


export const handle = sequence(authHandle);