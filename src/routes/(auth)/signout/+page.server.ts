import { signOut } from "$lib/services/auth"
import type { Actions } from "./$types"
 
export const actions = { default: signOut } satisfies Actions