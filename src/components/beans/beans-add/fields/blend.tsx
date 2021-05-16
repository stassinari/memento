import { FormikProps } from "formik";
import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Button,
  IconButton,
  makeStyles,
  Paper,
  Tooltip,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

import Country from "./country";
import Percentage from "./percentage";
import Varietal from "./varietal";
import Name from "./name";
import Process from "./process";

interface BlendProps {
  formik: FormikProps<Beans>;
}

interface BlendItemProps {
  index: number;
  initialValues: BeansBlendPart;
  update: (arg0: any) => void;
  remove: () => void;
}

interface ItemArray {
  key: number;
  data: object;
}

const useStyles = makeStyles((theme) => {
  return {
    root: {
      position: "relative",
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    delete: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
  };
});

const BlendItem: FunctionComponent<BlendItemProps> = ({
  index,
  initialValues,
  update,
  remove,
}) => {
  const classes = useStyles();

  const [name, setName] = useState(
    initialValues.name ? initialValues.name : ""
  );
  const [varietals, setVarietals] = useState(
    initialValues.varietals ? initialValues.varietals : []
  );
  const [percentage, setPercentage] = useState(
    initialValues.percentage ? initialValues.percentage : ""
  );
  const [process, setProcess] = useState(
    initialValues.process ? initialValues.process : ""
  );
  const [country, setCountry] = useState(
    initialValues.country ? initialValues.country : null
  );

  useEffect(() => {
    const item = {
      key: index,
      data: { name, varietals, percentage, country, process },
    };
    update(item);
    // eslint-disable-next-line
  }, [name, varietals, percentage, country, process]);

  return (
    <Paper className={classes.root} variant="outlined">
      Blend origin
      <Tooltip title="Remove blend">
        <IconButton
          className={classes.delete}
          aria-label="remove"
          onClick={() => remove()}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Name value={name} setValue={(value) => setName(value)} />
      <Country value={country} setValue={(value) => setCountry(value)} />
      <Percentage
        value={percentage}
        setValue={(value) => setPercentage(value)}
      />
      <Varietal value={varietals} setValue={(value) => setVarietals(value)} />
      <Process value={process} setValue={(value) => setProcess(value)} />
    </Paper>
  );
};

const Blend: FunctionComponent<BlendProps> = ({ formik }) => {
  const initialState = formik.initialValues.blend?.map((b, index) => ({
    key: index,
    data: b,
  }));
  const [counter, setCounter] = useState(0);
  const [items, setItems] = useState<ItemArray[]>(
    !!initialState ? initialState : [{ key: counter, data: {} }]
  );

  const handleAdd = () => {
    setItems([...items, { key: counter + 1, data: {} }]);
    setCounter(counter + 1);
  };

  const handleDelete = (itemToDelete: ItemArray) => () => {
    setItems((arr) => arr.filter((el) => el.key !== itemToDelete.key));
  };

  const handleUpdate = (itemToUpdate: ItemArray) => {
    const indexOldElement = items.findIndex(
      ({ key }) => key === itemToUpdate.key
    );
    const newArray = Object.assign([...items], {
      [indexOldElement]: itemToUpdate,
    });
    setItems(newArray);
    formik.setFieldValue(
      "blend",
      newArray.map((el) => el.data)
    );
  };

  return (
    <div>
      {items.map((item) => (
        <BlendItem
          key={item.key}
          initialValues={item.data}
          index={item.key}
          update={handleUpdate}
          remove={handleDelete(item)}
        />
      ))}
      <Button
        color="primary"
        aria-label="add"
        onClick={handleAdd}
        startIcon={<AddIcon />}
      >
        Add blend
      </Button>
    </div>
  );
};

export default Blend;
