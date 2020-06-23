import React, { useState } from 'react';
import {
  createEditor,
  Node,
} from 'slate';
import {
  Editable,
  withReact,
  Slate,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react';

import { DefaultElement, Leaf } from './elements';
import { Toolbar } from './Toolbar';
import { withLinks } from './customHooks/withLinks';

/**
 *
 * @param props
 * @description render block element like heading1, heading2, block-quote
 */
function renderElement(props: RenderElementProps) {
  const { attributes, children, element } = props;
  return (
    <DefaultElement {...attributes} {...element}>
      {children}
    </DefaultElement>
  );
}

/**
 *
 * @param props
 * @description render text formatting like bold, italic, underline
 */
function renderLeaf(props: RenderLeafProps) {
  return <Leaf {...props} />;
}

/**
 * @description interface for Editor properties
 */
export interface EditorProps {
  value: Node[];
  onChange: (value: Node[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  spellCheck?: boolean;
}

export function Editor(props: EditorProps) {
  const { value, onChange, ...other } = props;
  const editor = React.useMemo(() => withLinks(withReact(createEditor())), []);
  
  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Toolbar open={true} />
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        {...other}
      />
    </Slate>
  );
}

export { Node };
