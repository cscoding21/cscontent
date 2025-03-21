import { prisma } from "../prisma"
import { newID, slugify } from "./helpers";


/**
 * return all folders in the system
 * @returns an array of all folders in the system
 */
export const findContent = async (parentID:string) => {
    return await prisma.content.findMany({ 
        where: { parentID: parentID }})
} 


/**
 * return a folder
 * @param slugOrId the slug or ID of the folder to retrieve
 */
export const getContent = async (slugOrId:string) => {
  const folder =  await prisma.content.findFirstOrThrow(
      { 
          where: {
              OR: [
                  { slug: { equals: slugOrId } },
                  { id: { equals: slugOrId } },
              ],
          },
          select: {
              title: true,
              id: true,
              slug: true,
              parentID: true,
              intent: true,
              isActive: true,
              activeOn: true,
              expiresOn: true
          }
      })

  return folder
}


/**
 * return all of the instances for a content container
 * @param contentID the content container 
 * @returns a list of all instances
 */
export const findContentInstances = async (contentID:string) => {
  return await prisma.instance.findMany({ 
    where: { contentID }})
}


/**
 * create a new content element to a given folder
 * @param userID the user id performing the operation
 * @param parentID the folder id to add the content to
 * @param title the title of the content
 * @param intent the intent of the content.  This can be used
 */
export const newContent = async (userID:string, parentID:string, title:string, intent:string) => {
    const slug = slugify(title);
    const id = newID()
    const lastestVersionID = newID()
    const defaultVersionID = newID()
    const defaultInstanceID = newID()

    const [ content, versions, instance, versionOnInstances] = await prisma.$transaction([
      prisma.content.create({
        data: {
          id: id,
          title: title,
          parentID: parentID,
          slug: slug,
          intent: intent,
          isActive: false,
          createdBy: userID,
          updatedBy: userID
        },
      }),
      prisma.version.createMany({
        data: [
          { id: lastestVersionID, name: 'latest', contentID: id, createdBy: userID, updatedBy: userID},
          { id: defaultVersionID, name: 'default', contentID: id, createdBy: userID, updatedBy: userID},
        ],
        skipDuplicates: true,
      }),
      prisma.instance.create({
        data: {
          contentID: id,
          id: defaultInstanceID,
          language: "en-us",
          body: intent,
          createdBy: userID,
          updatedBy: userID
        }
      }),
      prisma.versionsOnInstance.createMany({
        data: [
          { instanceID: defaultInstanceID, versionID: lastestVersionID, assignedBy: userID},
          { instanceID: defaultInstanceID, versionID: defaultVersionID, assignedBy: userID},
        ],
        skipDuplicates: true,
      })
    ]
  )

  return content;
}

/**
 * update an existing piece of content
 * @param userID the user id performing the operation
 * @param id the id of the content to update
 * @param title the udpated title
 * @param intent the udpated intent
 * @param isActive true if content is active
 * @param activeOn date content becomes available
 * @param expiresOn date content expires
 */
export const updateContent = async (
    userID:string, 
    id:string, 
    title:string, 
    intent:string, 
    isActive: boolean|undefined, 
    activeOn:Date|undefined, 
    expiresOn:Date|undefined) => {

    const content = await prisma.content.update({
        data: {
          title: title,
          intent: intent,
          updatedBy: userID,
          isActive: isActive,
          activeOn: activeOn,
          expiresOn: expiresOn
        },
        where: { id: id }
      })

    return content
}

/**
 * check to see if a folder name already exists in the database
 * @param name name of the folder
 * @returns a true/false result based on if the folder name currently exists
 */
export const contentNameAvailable = async (title:string):Promise<boolean> => {
  const exists = await prisma.content.count({
      where: {
          title: {
              equals: title,
              mode: 'insensitive', // Default value: default
        },
      }
  })
  
  return exists === 0
}

/**
* delete the specified folder based on the passed in ID
* @param userID the id of the user performing the operation
* @param id the id of the folder to delete
*/
export const deleteContent = async (userID:string, id:string) => {
  const content = await prisma.content.delete({
      where: {
          id: id,
        },
    })
}