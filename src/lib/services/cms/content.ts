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


export const newContent = async (userID:string, parentID:string, title:string, intent:string) => {
    const slug = slugify(title);
    const id = newID()

    const content = await prisma.content.create({
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
      })
}