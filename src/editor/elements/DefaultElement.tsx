import React from 'react';
import {
  Typography,
  Link,
  makeStyles,
} from '@material-ui/core';
import { TOOLBAR_CONSTANT, ELEMENT_CONST } from '../../shared/constants/constants';

const useStyles = makeStyles((theme) => ({
  blockquote: {
    borderLeft: '2px solid #ddd',
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: '10px',
    color: '#aaa',
    fontStyle: 'italic',
    '&[dir="rtl"]': {
      borderLeft: 'none',
      paddingLeft: 0,
      paddingRight: '10px',
      borderRight: '2px solid #ddd',
    },
  },
}));

export const DefaultElement = React.forwardRef(function DefaultElement(
  props: any,
  ref: React.Ref<HTMLElement>,
) {
  const { children, type, url, attributes } = props;
  const { BLOCK_QUOTE, HEADING_ONE, HEADING_TWO, LINK } = TOOLBAR_CONSTANT;
  const { SPAN, H1, H2 } = ELEMENT_CONST;
  const s = useStyles();
  switch (type) {
    case LINK:
      return (
        <Link ref={ref} {...props} href={url}>{children}</Link>
      );
    case HEADING_ONE:
      return (
        <Typography variant={H1} ref={ref} {...props} gutterBottom>
          {children}
        </Typography>
      );
    case HEADING_TWO:
      return (
        <Typography variant={H2} ref={ref} {...props} gutterBottom>
          {children}
        </Typography>
      );
    case BLOCK_QUOTE:
      return (
        <blockquote className={s.blockquote} ref={ref} {...props}>
          {children}
        </blockquote>
      );
    default:
      return <Typography ref={ref} {...props} />;
  }
});
