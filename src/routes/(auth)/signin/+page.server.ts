import { signIn } from "$lib/services/auth"
import type { Actions } from "./$types"
export const actions: Actions = { default: signIn }