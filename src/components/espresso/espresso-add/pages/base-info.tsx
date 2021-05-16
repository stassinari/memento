import React, { FunctionComponent } from "react";
import { default as EspressoDate } from "../../../brew/brew-add/fields/date";
import firebase from "firebase/app";

import { FormikProps } from "formik";
import BeansRadioDialog from "../../../beans-radio-dialog";
import { Typography } from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";
import useCommonStyles from "../../../../config/use-common-styles";
import { capitalise } from "../../../../utils/string";
import ExpandableFormSection from "../../../expandable-form-section";

interface Props {
  espressos: EspressoPrep[];
  beans?: Beans[];
  formik: FormikProps<EspressoPrep>;
}

const BaseInfo: FunctionComponent<Props> = ({ formik, espressos, beans }) => {
  const commonStyles = useCommonStyles();

  if (!beans || beans.length === 0) {
    // TODO refactor into smaller components
    // this only applies to the list, should display the skeleton of the page
    return null;
  }

  return (
    <>
      <EspressoDate
        value={formik.values.date}
        setValue={(value: React.ChangeEvent) =>
          formik.setFieldValue("date", value)
        }
        showError={!!formik.errors.date && !!formik.touched.date}
        helperText={formik.errors.date}
      />
      <BeansRadioDialog
        beansList={beans}
        value={formik.values.beans}
        setValue={(
          value: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
        ) => formik.setFieldValue("beans", value)}
        filterFirst={false}
        showError={!!formik.errors.beans && (formik.touched.beans as boolean)}
        helperText={formik.errors.beans as string}
      />

      <ExpandableFormSection
        title="Equipment"
        formik={formik}
        fields={[
          {
            label: "Machine",
            value: formik.values.machine,
            name: "machine",
            placeholder: "E.g: Decent Espresso",
          },
          {
            label: "Grinder",
            value: formik.values.grinder,
            name: "grinder",
            placeholder: "E.g: Niche Zero",
          },
          {
            label: "Burrs",
            value: formik.values.grinderBurrs,
            name: "grinderBurrs",
            placeholder: "E.g: Stock steel 63mm",
          },
          {
            label: "Portafilter",
            value: capitalise(formik.values.portafilter),
            name: "poartafilter",
            customElement: (
              <div className={commonStyles.toggleGroupContainer}>
                <Typography
                  variant="caption"
                  component="label"
                  className={commonStyles.toggleGroupLabel}
                >
                  Portafilter
                </Typography>
                <ToggleButtonGroup
                  className={commonStyles.toggleGroup}
                  value={formik.values.portafilter}
                  exclusive
                  onChange={(
                    _: React.MouseEvent<HTMLElement>,
                    value: string | null
                  ) => formik.setFieldValue("portafilter", value)}
                  aria-label="text portafilter type"
                  size="medium"
                >
                  <ToggleButton
                    value="regular"
                    selected={formik.values.portafilter === "regular"}
                    aria-label="regular portafilter"
                  >
                    Regular
                  </ToggleButton>
                  <ToggleButton
                    value="bottomless"
                    selected={formik.values.portafilter === "bottomless"}
                    aria-label="bottomless portafilter"
                  >
                    Bottomless
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            ),
          },
          {
            label: "Basket",
            value: formik.values.basket,
            name: "basket",
            placeholder: "E.g: VST 18g",
          },
        ]}
        list={espressos}
      />
    </>
  );
};

export default BaseInfo;
