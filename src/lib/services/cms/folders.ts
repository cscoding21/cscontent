import { prisma } from '$lib/services/prisma'
import { slugify, newID } from './helpers';

/**
 * return all folders in the system
 * @returns an array of all folders in the system
 */
export const findFolders = async (parentID:string|null) => {
    return await prisma.folder.findMany({ 
        where: { parentID: parentID }})
} 


/**
 * return a folder
 * @param slugOrId the slug or ID of the folder to retrieve
 */
export const getFolder = async (slugOrId:string) => {
    const folder =  await prisma.folder.findFirstOrThrow(
        { 
            where: {
                OR: [
                    { slug: { equals: slugOrId } },
                    { id: { equals: slugOrId } },
                ],
            },
            select: {
                name: true,
                id: true,
                slug: true,
                parentID: true,
                folders: {
                  select: { 
                    name: true,
                    slug: true,
                    id: true,
                    createdBy: true,
                    parentID: true
                },
                },
                content: {
                  select: { id: true, title: true, slug: true },
                }
              },
        })

    return folder
}


/**
 * create a new folder in the system
 * @param userID the id of the user performing the operation
 * @param name the name of the folder to create
 * @param parentID the parent ID of the folder to create
 */
export const newFolder = async (userID:string, name:string, parentID:string|null|undefined) => {
    const slug = slugify(name);
    const id = newID()

    const folder = await prisma.folder.create({
        data: {
          id: id,
          name: name,
          parentID: parentID,
          slug: slug,
          createdBy: userID,
          updatedBy: userID
        },
      })
}

/**
 * check to see if a folder name already exists in the database
 * @param name name of the folder
 * @returns a true/false result based on if the folder name currently exists
 */
export const folderNameAvailable = async (name:string):Promise<boolean> => {
    const exists = await prisma.folder.count({
        where: {
            name: {
                equals: name,
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
export const deleteFolder = async (userID:string, id:string) => {
    const folder = await prisma.folder.delete({
        where: {
            id: id,
          },
      })
}