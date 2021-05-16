import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@material-ui/core";
import React, { FunctionComponent } from "react";

interface Props {
  onClose: () => void;
  action: () => void;
  actionLabel: string;
  open: boolean;
  title?: string;
  message: string | string[];
}

const ActionDialog: FunctionComponent<Props> = ({
  onClose,
  action,
  actionLabel,
  open,
  title,
  message,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={title ? "alert-dialog-title" : ""}
      aria-describedby="alert-dialog-description"
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {Array.isArray(message) ? (
            message.map((s, i) => (
              <Typography component="span" display="block" gutterBottom key={i}>
                {s}
              </Typography>
            ))
          ) : (
            <Typography component="span">{message}</Typography>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={action} color="primary" autoFocus>
          {actionLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionDialog;
