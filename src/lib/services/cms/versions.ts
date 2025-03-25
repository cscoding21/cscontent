import { prisma } from '$lib/services/prisma'
import { newID } from './helpers';

/**
 * return a list of versions for a given piece of content
 * @param contentID the content id to retrieve versions for
 * @returns a list of versions available for a piece of content
 */
export const findContentVersions = async (contentID:string) => {
    return await prisma.version.findMany({ 
      where: { contentID },
      orderBy: {
        number: 'asc'
      }
    })
  }



/**
 * create a new folder in the system
 * @param userID the id of the user performing the operation
 * @param name the name of the folder to create
 * @param parentID the parent ID of the folder to create
 */
export const newVersion = async (userID:string, contentID:string, env:string) => {
    const id = newID()
    const next = await getNextVersion(contentID)

    console.log("environment", env)

    const version = await prisma.version.create({
        data: {
          contentID: contentID,
          isPublished: false,
          env: env,
          number: next,
          createdBy: userID,
          updatedBy: userID
        },
      })
}

/**
 * set the passed in version to the published state while setting all other versions to not published
 * @param contentID the content for which to udpate the version
 * @param versionID the version to set as published
 */
export const setPublishedVersion = async (contentID:string, versionID:string) => {
    console.log(contentID, versionID)
    const [ content, versions ] = await prisma.$transaction([
        prisma.version.updateMany({
            where: {
              contentID: {
                equals: contentID,
              },
            },
            data: {
              isPublished: false,
            },
        }),
        prisma.version.update({
            where: {
                id: versionID,
            },
            data: {
                isPublished: true,
            },
        })
    ])
}

const getNextVersion = async (contentID:string):Promise<number> => {
    let data = await prisma.version.aggregate({
        where: {
          contentID: contentID,
          },
          _max: {
             number: true
          }
    });

    const mostRecent = data._max.number || 0

    return mostRecent+1
}
