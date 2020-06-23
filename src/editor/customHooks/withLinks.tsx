import { Editor, Transforms, Range } from 'slate';
import isUrl from 'is-url';
import { TOOLBAR_CONSTANT } from "../../shared/constants/constants";

const { LINK } = TOOLBAR_CONSTANT;

/**
 *
 * @param editor
 * @description check if selected text is link
 */
export const isLinkActive = (editor: any) => {
  const [link] = Editor.nodes(editor, { match: (n) => n.type === LINK });
  return !!link;
};

/**
 *
 * @param editor
 * @description remove link from selected word
 */
export const unwrapLink = (editor: any) => {
  Transforms.unwrapNodes(editor, { match: (n) => n.type === LINK });
};

/**
 *
 * @param editor
 * @param url
 * @description check and insert link for selected word
 */
export const wrapLink = (editor: any, url: any) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: LINK,
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

/**
 *
 * @param editor
 * @param url
 * @description create link for selected word
 */
export const insertLink = (editor: any, url: string) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

/**
 *
 * @param editor
 * @description custom hook for Editor
 */
export const withLinks = (editor: any) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element: any) => {
    return element.type === LINK ? true : isInline(element);
  };

  editor.insertText = (text: string) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data: any) => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};
