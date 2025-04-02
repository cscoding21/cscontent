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
 * return a list of all available  instances from the published version
 * @param contentID the contentID for which to find the instances
 * @returns a list of all available instancess
 */
export const findPublishedContentInstances = async (contentID:string) => {
  return await prisma.instance.findMany({ 
    where: { 
      contentID, version: {
        isPublished: true
      } 
    },
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
export const newInstance = async (userID: string, contentID:string, selectors:any[], versionID: string, body: string) => {
    const id = newID()
  
    return await prisma.instance.create({
        data: {
          id: id,
          contentID: contentID,
          selectors: selectors,
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
export const updateInstance = async (userID: string, instanceID: string, body: string, meta: string, selectors:any[]) => {
  const content = await prisma.instance.update({
    data: {
      meta: meta,
      selectors: selectors,
      body: body,
      updatedBy: userID,
    },
    where: { id: instanceID }
  })

return content
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
