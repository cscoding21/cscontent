/**
 * convert a piece of text to a url-friendly format
 * @param name The name to convert to slug format
 * @returns the re-formatted name
 */
export const slugify = (name:string):string => {
    if(!name)
        return ''

    return name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

/**
 * generate a DB id
 * @returns a new ID sufficient for databases
 */
export const newID = ():string => {
    const uuid = crypto.randomUUID();
    return uuid
}

/**
 * safely return a user's email from the app locals object
 * @param a SvelteKit app.locals object
 * @returns the current user's email
 */
export const getUserEmail = async (l:App.Locals):Promise<string> => {
    const session = await l.auth()

    return session?.user?.email || "";
}