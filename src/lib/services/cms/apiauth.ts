import { prisma } from '$lib/services/prisma'
import { getID } from '$lib/utils/id'
import type { ApiKey } from '@prisma/client'


/**
 * generate and return a new api key
 * @returns a string representing a new API key
 */
const generateAPIKey = ():string => {
    let seeds = []

    for(let i = 0; i < 2; i++) {
        seeds.push(crypto.randomUUID())
    }

    return getID(...seeds)
}

/**
 * check to ensure an API key is valid
 * @param key the key to valiate
 * @returns a boolean promise representing whether or not the key is valid
 */
export const validateAPIKey = async (key:string):Promise<boolean> => {
    try {
        const k = await getAPIKey(key)
        return true
    } catch(err) {
        return false
    }
}


/**
 * return a key from the database only if the key is active and not expired, and exists of course
 * @param key the key to return
 * @returns an apikey object
 */
export const getAPIKey = async (key:string):Promise<ApiKey> => {
    const now = new Date() 
    return await prisma.apiKey.findFirstOrThrow({
        where: {
            key: key,
            isActive: true,
            expiresOn: {
                gt: now
            }
        }
    })
}


/**
 * generate a new api key for a user
 * @param userID the user creating the key
 * @param name the name of the key to use as a friendly identifier
 * @returns the key object from the DB
 */
export const newAPIKey = async (userID:string, name: string) => {
    const expiresOn = new Date()
    const key = generateAPIKey()

    return await prisma.apiKey.create({ 
      data: {
        ownerID: userID,
        name: name,
        isActive: true,
        expiresOn: expiresOn,
        key: key,

        createdBy: userID,
        updatedBy: userID,
      }
    })
}

/**
 * delete an API key
 * @param userID the userID that owns the key
 * @param id the ID of the key
 * @returns status?
 */
export const deleteAPIKey = async (userID:string, id: string) => {
    const expiresOn = new Date()
    const key = generateAPIKey()

    return await prisma.apiKey.delete({ 
      where: {
        ownerID: userID,
        id: id,
      }
    })
}


/**
 * return a list of all api keys owned by the passed in user
 * @param userID the user ID who owns the keys
 * @returns a list of keys owned by the user
 */
export const findUserAPIKeys = async (userID:string) => {

    return await prisma.apiKey.findMany({ 
      where: {
        ownerID: userID,
      }
    })
}


