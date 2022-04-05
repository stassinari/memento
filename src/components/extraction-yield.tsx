import { TableCell, TableRow } from "@mui/material";
import React from "react";
import useCommonStyles from "../config/use-common-styles";

interface ExtractionYieldProps {
  tds?: number;
  weight?: number;
  dose: number;
}

const ExtractionYield = ({ tds, weight, dose }: ExtractionYieldProps) => {
  const commonStyles = useCommonStyles();

  if (!tds || !weight) return null;

  const ey = Math.floor(((tds * weight) / dose) * 100) / 100;

  return (
    <TableRow>
      <TableCell className={commonStyles.label}>Extraction yield</TableCell>
      <TableCell>
        {ey}% (from {tds}% TDS)
      </TableCell>
    </TableRow>
  );
};

export default ExtractionYield;
