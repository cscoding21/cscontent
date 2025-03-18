/**
 * convert a piece of text to a url-friendly format
 * @param name The name to convert to slug format
 * @returns the re-formatted name
 */
export const slugify = (name:string):string => {
    if(!name)
        return ''

    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

/**
 * generate a DB id
 * @returns a new ID sufficient for databases
 */
export const newID = ():string => {
    const uuid = crypto.randomUUID();
    return uuid
}