import { InputAdornment, TextField, Typography } from "@material-ui/core";
import { Field, FormikProps } from "formik";
import React, { FunctionComponent } from "react";
import useCommonStyles from "../config/use-common-styles";
import { BrewPrep } from "../database/types/brew";
import { EspressoPrep } from "../database/types/espresso";

interface Props {
  formik: FormikProps<BrewPrep> | FormikProps<EspressoPrep>;
  type: "brew" | "espresso";
  waterValue: string;
  waterError?: string;
  waterTouched?: boolean;
}

const infoByType = {
  brew: {
    waterFormName: "waterWeight",
    waterFormLabel: "Water *",
    waterFormPlaceholder: "E.g: 240",
    waterFormUnit: "ml",
    beansFormLabel: "Beans *",
    beansFormPlaceholder: "E.g: 16.7",
  },
  espresso: {
    waterFormName: "targetWeight",
    waterFormLabel: "Yield *",
    waterFormPlaceholder: "E.g: 36",
    waterFormUnit: "g",
    beansFormLabel: "Dose *",
    beansFormPlaceholder: "E.g: 18.1",
  },
};

const RatioForm: FunctionComponent<Props> = ({
  formik,
  type,
  waterValue,
  waterError,
  waterTouched,
}) => {
  const commonStyles = useCommonStyles();

  const showWaterWeightError = waterError && waterTouched;
  const showBeansWeightError =
    formik.errors.beansWeight && formik.touched.beansWeight;

  let beansByWaterRatio = 0;
  let waterByBeansRatio = 0;

  const waterWeight = parseFloat(waterValue);
  const beansWeight = parseFloat(formik.values.beansWeight);
  if (waterWeight && beansWeight) {
    beansByWaterRatio =
      Math.floor((beansWeight / (waterWeight / 1000)) * 10) / 10;
    waterByBeansRatio = Math.floor((waterWeight / beansWeight) * 10) / 10;
  }
  return (
    <>
      <Typography
        variant="h6"
        component="h2"
        className={commonStyles.sectionHeading}
      >
        Ratio
      </Typography>
      <div className={commonStyles.threeColsFormContainer}>
        <Field
          as={TextField}
          type="number"
          inputMode="decimal"
          name={infoByType[type].waterFormName}
          margin="normal"
          label={infoByType[type].waterFormLabel}
          placeholder={infoByType[type].waterFormPlaceholder}
          inputProps={{ step: "any" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {infoByType[type].waterFormUnit}
              </InputAdornment>
            ),
          }}
          variant="outlined"
          error={showWaterWeightError}
          helperText={showWaterWeightError && waterError}
        />
        <div className={commonStyles.ratioContainer}>
          <span className={commonStyles.label}>Ratio:</span>
          {type === "brew" && (
            <span className={commonStyles.ratioValue}>
              {beansByWaterRatio ? `${beansByWaterRatio} g/l` : "N/A"}
            </span>
          )}
          <span className={commonStyles.ratioValue}>
            {waterByBeansRatio ? `1 : ${waterByBeansRatio}` : "N/A"}
          </span>
        </div>
        <Field
          as={TextField}
          type="number"
          inputMode="decimal"
          name="beansWeight"
          margin="normal"
          label={infoByType[type].beansFormLabel}
          placeholder={infoByType[type].waterFormPlaceholder}
          inputProps={{ step: "any" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">g</InputAdornment>,
          }}
          variant="outlined"
          error={showBeansWeightError}
          helperText={showBeansWeightError && formik.errors.beansWeight}
        />
        <Field
          as={TextField}
          type="number"
          inputMode="decimal"
          name="waterTemperature"
          margin="normal"
          label="Temp"
          placeholder="E.g: 96"
          inputProps={{ step: "any" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">°C</InputAdornment>,
          }}
          variant="outlined"
        />
        <Field
          as={TextField}
          type="text"
          name="grindSetting"
          margin="normal"
          label="Grind setting"
          placeholder="E.g: 5R, 15, coarse"
          variant="outlined"
          className={commonStyles.colStart3}
        />
      </div>
    </>
  );
};

export default RatioForm;
