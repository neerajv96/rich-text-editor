import React, { ReactNode } from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
/**
 * @description custom styles
 */
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      display: 'flex'
    },
    '& > * + *': {
      marginLeft: '15px'
    }
  }
}));

export interface MenuProps {
  className: string;
  children: ReactNode;
}

const Menu = React.forwardRef(
  (props: MenuProps, ref?: React.Ref<HTMLDivElement>) => {
    const { className, children } = props;
    const style = useStyles();
    return (
      <div
        ref={ref}
        className={clsx(
          className,
          style.root
        )}
      >
        {children}
      </div>
    );
  },
);

export default Menu;
