import { prisma } from '$lib/services/prisma'
import { slugify, newID } from './helpers';

export const findFolders = async () => {
    return await prisma.folder.findMany()
} 

export const newFolder = async (userID:string, name:string, parentID:string|null|undefined) => {
    if(!userID) {
        //---TODO: handle this
        //throw 
    }

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

export const deleteFolder = async (userID:string, id:string) => {
    if(!userID) {
        //---TODO: handle this
        //throw 
    }

    const folder = await prisma.folder.delete({
        where: {
            id: id,
          },
      })
}