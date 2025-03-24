import { prisma } from '$lib/services/prisma'


export const findContentTags = async (contentID:string) => {
    return await prisma.tagsOnContent.findMany({ 
      where: { contentID },
    })
  }


export const tagContent = async (userID:string, contentID:string, tag:string) => {
    const [ tagResult, tagOnContentResult ] = await prisma.$transaction([
        prisma.tag.upsert({
            where: { name: tag },
            update: { name: tag },
            create: { name: tag },
        }),
        prisma.tagsOnContent.upsert({
            where: { tagID_contentID: { tagID: tag, contentID: contentID }   },
            update: {},
            create: { 
                tagID: tag,
                contentID: contentID,
                assignedBy:userID 
            },
        })
    ])
}


export const deleteTag = async (userID:string, contentID:string, tag:string) => {
    const [ tagOnContentResult ] = await prisma.$transaction([
        prisma.tagsOnContent.delete({
            where: { tagID_contentID: { tagID: tag, contentID: contentID }   },
        })
    ])
}