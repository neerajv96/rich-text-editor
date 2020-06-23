import React, { useState, useRef, useEffect, MutableRefObject } from 'react';
import {
  Popper,
  PopperProps,
  ButtonGroup,
  IconButton,
  Input,
} from '@material-ui/core';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Link,
  Title,
  FormatQuote,
  Close,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSlate, ReactEditor } from 'slate-react';
import { Transforms, Editor, Range } from 'slate';
import { insertLink, isLinkActive, unwrapLink } from './customHooks/withLinks';
import { TOOLBAR_CONSTANT } from '../shared/constants/constants';
import { Menu, LinkForm } from './components';

const {
  BOLD,
  BLOCK_QUOTE,
  HEADING_ONE,
  HEADING_TWO,
  ITALIC,
  LINK,
  LIST_TYPES,
  UNDERLINE,
} = TOOLBAR_CONSTANT;

/**
 * @description custom styles
 */
const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.common.black,
    zIndex: 1
  },
  button: {
    color: theme.palette.common.white,
    opacity: 0.75,
    '&:hover': {
      opacity: 1,
    },
    paddingTop: 8,
    paddingBottom: 8,
  },
  active: {
    color: '#34e79a',
  },
  input: {
    color: theme.palette.common.white,
    padding: theme.spacing(0.25, 1),
  },
  close: {
    opacity: 0.75,
    cursor: 'pointer',
    '&:hover': {
      opacity: 1,
    },
  },
  arrow: {
    position: 'absolute',
    fontSize: 7,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
  },
  toolbar: {
    padding: theme.spacing(1, 1, 1),
    position: "absolute",
    top: "145px",
    left: "-10000px",
    marginTop: "-6px",
    opacity: 0,
    borderRadius: "4px",
    transition: "opacity 0.75s",
  },
}));

/**
 * @description interface extending material Popper properties
 */
export type ToolbarProps = Omit<PopperProps, 'children'>;

/**
 *
 * @param editor
 * @param format
 * @description checks if selected text have block formatting
 */
function isBlockActive(editor: any, format: any) {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  });

  return !!match;
}

/**
 *
 * @param editor
 * @param format
 * @description apply or remove formating to block i.e. whole line
 */
function toggleBlock(editor: any, format: any) {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n: any) => LIST_TYPES.includes(n.type),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

/**
 *
 * @param editor
 * @param format
 * @description checks if selected text is formatted
 */
function isMarkActive(editor: any, format: any) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

/**
 *
 * @param editor
 * @param format
 * @description apply or remove formatting on selected text
 */
function toggleMark(editor: any, format: any) {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

export function Toolbar(props: ToolbarProps) {
  const [link, setLink] = useState<boolean>(false);
  const style = useStyles();
  const editor = useSlate();
  const editorSelection = useRef(editor.selection);
  const ref = useRef() as MutableRefObject<HTMLInputElement>;

  /**
   * @description update state as changes in DOM or props
   */
  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;
    if (!el) {
      return;
    }
    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      // @ts-ignore
      if (link) {
        return;
      }
      el.removeAttribute('style');
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection && domSelection.getRangeAt(0);
    // @ts-ignore
    const rect = domRange.getBoundingClientRect();
    // @ts-ignore
    el.style.opacity = 1;
    // @ts-ignore
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    // @ts-ignore
    el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`;
  });

  /**
   * @description update state as changes in DOM or props
   */
  useEffect(() => {
    if (link) {
      editorSelection.current = editor.selection;
    }
  }, [link]);

  /**
   *
   * @param event
   * @param format
   * @description on text formatting button click like bold, italic or underline
   */
  const onTextFormatBtnClick = (event: any, format: string) => {
    event.preventDefault();
    toggleMark && toggleMark(editor, format);
  };

  /**
   *
   * @param event
   * @param format
   * @description on block formatting button click line h1, h2 or block-quote
   */
  const onBlockFormatBtnClick = (event: any, format: string) => {
    event.preventDefault();
    toggleBlock && toggleBlock(editor, format);
  };

  /**
   *
   * @param event
   * @description on link form submit
   */
  const onLinkFormSubmit = (link: string) => {
    editor.selection = editorSelection.current;
    insertLink(editor, link);
    setLink(false);
  };

  /**
   * 
   * @param event 
   * @description handle link button click from toolbar
   */
  const onLinkButtonClick = (event: any) => {
    event.preventDefault();
    if (isLinkActive(editor))
      unwrapLink(editor);
    else
      setLink(true);
  }

  /**
   *
   * @param type
   * @description set style for text formatting buttons
   */
  const setClassForTextFormatBtn = (type: string) => {
    return clsx(
      style.button,
      isMarkActive && isMarkActive(editor, type) && style.active,
    );
  };

  /**
   *
   * @param type
   * @description set style for block formatting buttons
   */
  const setClassForBlockFormatBtn = (type: string) => {
    return clsx(
      style.button,
      isBlockActive && isBlockActive(editor, type) && style.active,
    );
  };

  return (
    <Menu
      ref={ref}
      className={clsx(style.root, style.toolbar)}
    >
      {/* <span className={style.arrow} ref={handleArrowRef} /> */}
      {!link ? (
        <ButtonGroup variant="text" color="primary">
          <IconButton
            className={setClassForTextFormatBtn(BOLD)}
            size="small"
            onMouseDown={(event) => onTextFormatBtnClick(event, BOLD)}
          >
            <FormatBold fontSize="small" />
          </IconButton>
          <IconButton
            className={setClassForTextFormatBtn(ITALIC)}
            size="small"
            onMouseDown={(event) =>
              onTextFormatBtnClick(event, ITALIC)}
          >
            <FormatItalic fontSize="small" />
          </IconButton>
          <IconButton
            className={setClassForTextFormatBtn(UNDERLINE)}
            size="small"
            onMouseDown={(event) =>
              onTextFormatBtnClick(event, UNDERLINE)}
          >
            <FormatUnderlined fontSize="small" />
          </IconButton>
          <IconButton
            className={setClassForBlockFormatBtn(LINK)}
            size="small"
            onClick={(event) => onLinkButtonClick(event)}
          >
            <Link fontSize="small" />
          </IconButton>
          <IconButton
            className={setClassForBlockFormatBtn(HEADING_ONE)}
            size="small"
            onMouseDown={(event) => onBlockFormatBtnClick(event, HEADING_ONE)}
          >
            <Title fontSize="large" />
          </IconButton>
          <IconButton
            className={setClassForBlockFormatBtn(HEADING_TWO)}
            size="small"
            onMouseDown={(event) => onBlockFormatBtnClick(event, HEADING_TWO)}
          >
            <Title fontSize="small" />
          </IconButton>
          <IconButton
            className={setClassForBlockFormatBtn(BLOCK_QUOTE)}
            size="small"
            onMouseDown={(event) => onBlockFormatBtnClick(event, BLOCK_QUOTE)}
          >
            <FormatQuote fontSize="small" />
          </IconButton>
        </ButtonGroup>
      ) : (
          <LinkForm
            open={link}
            onClose={() => setLink(false)}
            onSubmit={(link: string) => onLinkFormSubmit(link)}
          />
        )}
    </Menu>
  );
}
