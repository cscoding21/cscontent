import bcrypt from 'bcryptjs';


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


/**
 * hash a password
 * @param password the password to hash
 * @returns the hashed password
 */
export const hashPassword = async (password:string) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}


/**
 * check a password against a hash
 * @param password the password to verify
 * @param hashedPassword the hashed version of the password
 * @returns the result of the password and hash comparison
 */
export const verifyPassword = async (password:string, hashedPassword:string) => {
    return await bcrypt.compare(password, hashedPassword);
}