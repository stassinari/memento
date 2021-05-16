import React, { FunctionComponent } from "react";
import { useFormikContext } from "formik";
import debounce from "just-debounce-it";
import { makeStyles, Tooltip, Typography } from "@material-ui/core";
import { format } from "date-fns";

interface Props {
  debounceMs: number;
}

const useStyles = makeStyles((theme) => {
  return {
    text: {
      marginLeft: theme.spacing(2),
      color: theme.palette.text.secondary,
      textDecoration: "underline",
    },
  };
});

export const AutoSave: FunctionComponent<Props> = ({ debounceMs }) => {
  const formik = useFormikContext();
  const [lastSaved, setLastSaved] = React.useState<Date>();

  const classes = useStyles();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSubmit = React.useCallback(
    debounce(
      () => formik.submitForm().then(() => setLastSaved(new Date())),
      debounceMs
    ),
    [debounceMs, formik.values]
  );

  React.useEffect(() => {
    debouncedSubmit();
  }, [debouncedSubmit, formik.values]);

  let text = "";
  let tooltip = "";

  if (formik.isSubmitting) {
    text = "Saving...";
    // } else if (Object.keys(formik.errors).length > 0) {
    //   result = `ERROR: ${formik.errors.error}`;
  } else if (!!lastSaved) {
    text = "All changes saved";
    tooltip = `Last saved: ${format(lastSaved, "yyyy-MM-dd HH:mm:ss")}`;
  }
  return (
    <Tooltip title={tooltip} placement="right">
      <Typography variant="caption" className={classes.text}>
        {text}
      </Typography>
    </Tooltip>
  );
};
