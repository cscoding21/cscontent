import { prisma } from "../prisma"
import { newID } from "./helpers"

/**
 * return all of the instances for a content container
 * @param contentID the content container 
 * @returns a list of all instances
 */
export const findContentInstances = async (contentID:string, versionID:string) => {
  return await prisma.instance.findMany({ 
    where: { contentID, versionID },
    include: {
      version: {
        select: {
          number: true
        }
      }
    }
  })
}

/**
 * 
 * @param contentID 
 * @param lang 
 * @param versionID 
 * @param body 
 */
export const newInstance = async (userID: string, contentID:string, lang: string, versionID: string, body: string) => {
    const id = newID()
  
    return await prisma.instance.create({
        data: {
          id: id,
          contentID: contentID,
          language: lang,
          isDefault: false,
          versionID: versionID,
          body: body,
          createdBy: userID,
          updatedBy: userID
        },
      })
}

/**
 * 
 * @param userID 
 * @param instanceID 
 * @param body 
 */
export const updateInstance = async (userID: string, instanceID: string, body: string) => {

}


/**
 * delete the specified instance
 * @param userID the user making the delete
 * @param instanceID the instanceID to delete
 * @returns 
 */
export const deleteInstance = async (userID: string, instanceID: string) => {
  return await prisma.instance.delete({
    where: {
      id: instanceID  
    }
  })
}
