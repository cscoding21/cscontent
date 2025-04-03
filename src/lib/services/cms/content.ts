import { createHeadlessEditor } from '@lexical/headless'
import { prisma } from "../prisma"
import { newID, slugify } from "./helpers";
import { findPublishedContentInstances } from "./instances";
import { $generateHtmlFromNodes } from '@lexical/html';
//import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { JSDOM } from 'jsdom'


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
  return await prisma.content.findFirstOrThrow(
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
              expiresOn: true,
          }
      })
}

/**
 * return a content object with the instance resolved
 * @param slugOrID the slug or ID of the content to retrieve
 * @returns a single item content with the instance resolved
 */
export const getProcessedContent = async (slugOrID:string) => {
  const content = await getContent(slugOrID)

  const instances = await findPublishedContentInstances(content.id)
  console.log("instances", instances)

  const theInstance = instances.filter(c => c.isDefault)[0]
  console.log("theInstance", theInstance)

  let htmlOut = await getHtml(JSON.stringify(theInstance.body))

  let out = {
    title: content.title,
    id: content.id,
    slug: content.slug,
    body: htmlOut,
    updatedAt: theInstance.updatedAt,
    createdAt: theInstance.createdAt
  }

  return out
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
    const defaultInstanceID = newID()
    const selectors = [
      { "lang" : "en-us" }
    ]

    const [ content, versions, instance ] = await prisma.$transaction([
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
          { 
            id: lastestVersionID, 
            number: 1, 
            contentID: id, 
            createdBy: userID, 
            updatedBy: userID, 
            isPublished: false
          },
        ],
        skipDuplicates: true,
      }),
      prisma.instance.create({
        data: {
          contentID: id,
          versionID:lastestVersionID,
          isDefault: true,
          id: defaultInstanceID,
          selectors: selectors,
          body: wrapTextForInstance(intent),
          meta: "*genesis*",
          createdBy: userID,
          updatedBy: userID
        }
      }),
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
    activeOn:Date|null|undefined, 
    expiresOn:Date|null|undefined) => {

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

const wrapTextForInstance = (text:string):any => {
  return {
    "root": {
      "type": "root",
      "format": "",
      "indent": 0,
      "version": 1,
      "children": [
        {
          "type": "paragraph",
          "format": "",
          "indent": 0,
          "version": 1,
          "children": [
            {
              "mode": "normal",
              "text": text,
              "type": "text",
              "style": "",
              "detail": 0,
              "format": 0,
              "version": 1
            }
          ],
          "direction": "ltr",
          "textStyle": "",
          "textFormat": 0
        }
      ],
      "direction": "ltr"
    }
  }
}


function setUpDom() {
  const dom = new JSDOM();

  const _window = global.window;
  const _document = global.document;
  const _documentFragment = global.DocumentFragment;

  // @ts-ignore
  global.window = dom.window;
  global.document = dom.window.document;
  global.DocumentFragment = dom.window.DocumentFragment;

  return () => {
    // @ts-ignore
    global.window = _window;
    global.document = _document;
    global.DocumentFragment = _documentFragment;
  };
}


export async function getHtml(jsonState: string) {
  const html = await new Promise<string>((resolve, reject) => {
    const editor = createHeadlessEditor({
      nodes: [],
      namespace: 'default',
      onError: (error: Error) => {
        throw error;
      },
    });
    editor.setEditorState(editor.parseEditorState(jsonState));

    editor.update(() => {
      const cleanUpDom = setUpDom();
      const _html = $generateHtmlFromNodes(editor, null);

      cleanUpDom();
      resolve(_html);
    });
  });

  return html;
}

/*
export async function getMarkdown(jsonState: string) {
  const markdown = await new Promise<string>((resolve, reject) => {
    const editor = createHeadlessEditor({
      nodes: [],
      namespace: 'default',
      onError: (error: Error) => {
        throw error;
      },
    });
    editor.setEditorState(editor.parseEditorState(jsonState));

    editor.update(() => {
      const cleanUpDom = setUpDom();
      const _html = $generateHtmlFromNodes(editor, null);

      cleanUpDom();
      resolve(_html);
    });
  });

  return markdown;
}
*/