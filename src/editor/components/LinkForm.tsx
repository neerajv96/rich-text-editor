import React, { useState } from 'react';
import { Input } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

export interface LinkProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

const useStyles = makeStyles(theme => ({
  input: {
    color: theme.palette.common.white,
    padding: theme.spacing(0.25, 1),
  },
  inputField: {
    width: 'auto'
  },
  close: {
    opacity: 0.75,
    cursor: 'pointer',
    '&:hover': {
      opacity: 1,
    },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function LinkForm(props: LinkProps) {
  const [link, setLink] = useState<string>('');
  const { onClose, onSubmit } = props;
  const style = useStyles();

  const onFormSubmit = (event: any) => {
    event.preventDefault();
    onSubmit(link);
    onClose();
  }

  return (
    <form onSubmit={event => onFormSubmit(event)}>
      <Input
        classes={{ input: style.inputField }}
        className={style.input}
        type="url"
        value={link}
        onChange={event => setLink(event.target.value)}
        endAdornment={
          <Close
            className={style.close}
            fontSize="small"
            onClick={() => {
              setLink('');
              onClose();
            }}
          />
        }
        placeholder="https://"
        disableUnderline
        autoFocus
      />
    </form>
  );
}

export default LinkForm;
