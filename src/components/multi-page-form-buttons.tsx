import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Button,
  MobileStepper,
  Step,
  StepLabel,
  Stepper as MuiStepper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React, { FunctionComponent } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

interface MultiPageFormButtonsProps {
  nextButtonFinalLabel: string;
  steps: string[];
  activeStep: number;
  isStepValid: () => boolean;
  setDisplayFormError: (arg0: boolean) => void;
}

const useStyles = makeStyles((theme) => {
  return {
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: theme.spacing(1),
      [theme.breakpoints.up("sm")]: {
        justifyContent: "flex-end",
      },
    },
    backButton: {
      marginRight: theme.spacing(2),
    },
  };
});

interface BackButtonProps {
  disabled: boolean;
  handleClick: () => void;
  style: string;
}

interface NextButtonProps {
  isLastStep: boolean;
  handleClick: () => void;
  finalLabel: string;
}

const BackButton: FunctionComponent<BackButtonProps> = ({
  handleClick,
  disabled,
  style,
}) => (
  <Button
    onClick={handleClick}
    variant="contained"
    className={style}
    disabled={disabled}
  >
    Back
  </Button>
);

const NextButton: FunctionComponent<NextButtonProps> = ({
  handleClick,
  isLastStep,
  finalLabel,
}) => (
  <>
    {!isLastStep && (
      <Button
        onClick={handleClick}
        variant="contained"
        color="primary"
        endIcon={!isLastStep ? <ArrowForwardIosIcon /> : null}
      >
        Next
      </Button>
    )}
    {isLastStep && (
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        {finalLabel}
      </Button>
    )}
  </>
);

export const MultiPageFormButtons: FunctionComponent<MultiPageFormButtonsProps> =
  ({
    nextButtonFinalLabel,
    steps,
    activeStep,
    isStepValid,
    setDisplayFormError,
  }) => {
    let { url } = useRouteMatch();
    const history = useHistory();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const classes = useStyles();

    const isLastStep = activeStep === steps.length - 1;

    const handleNext = () => {
      if (!isStepValid()) {
        setDisplayFormError(true);
        return;
      }
      setDisplayFormError(false);

      if (!isLastStep) {
        history.push(`${url}/step${activeStep + 1}`);
      }
    };
    const handleBack = () => {
      setDisplayFormError(false);
      history.push(`${url}/step${activeStep - 1}`);
    };

    const Next = (
      <NextButton
        handleClick={handleNext}
        isLastStep={isLastStep}
        finalLabel={nextButtonFinalLabel}
      />
    );

    const Back = (
      <BackButton
        handleClick={handleBack}
        disabled={activeStep === 0}
        style={classes.backButton}
      />
    );

    return (
      <div className={classes.buttonContainer}>
        {!isMobile && Back}
        {isMobile && (
          <MobileStepper
            sx={{ backgroundColor: "transparent", width: "100%" }}
            steps={steps.length}
            position="static"
            variant="dots"
            activeStep={activeStep}
            backButton={Back}
            nextButton={Next}
          />
        )}
        {!isMobile && Next}
      </div>
    );
  };

interface StepperProps {
  steps: string[];
  activeStep: number;
}

export const Stepper: FunctionComponent<StepperProps> = ({
  steps,
  activeStep,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return !isMobile ? (
    <MuiStepper activeStep={activeStep} alternativeLabel sx={{ padding: 3 }}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </MuiStepper>
  ) : null;
};
