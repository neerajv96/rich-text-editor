import React from 'react';
import { RenderLeafProps } from 'slate-react';

/**
 *
 * @param props
 * @description render elements as per formatting type
 */
export const Leaf = (props: RenderLeafProps) => {
  const { attributes, leaf } = props;
  let { children } = props;
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};
