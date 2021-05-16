import React, { FunctionComponent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from "@material-ui/core";

interface Props {
  onClose: () => void;
  open: boolean;
  message: string | string[];
}

const SimpleDialog: FunctionComponent<Props> = ({ onClose, open, message }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-describedby="alert-dialog-description"
    >
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
        <Button onClick={onClose} color="primary" autoFocus>
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SimpleDialog;
