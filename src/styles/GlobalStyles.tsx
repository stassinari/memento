import { Global } from "@emotion/react";
import React from "react";
import tw, { css, GlobalStyles as BaseStyles, theme } from "twin.macro";

const customStyles = css({
  body: {
    WebkitTapHighlightColor: theme`colors.transparent`,
    ...tw`antialiased`,
  },
});

export const GlobalStyles = () => (
  <React.Fragment>
    <BaseStyles />
    <Global styles={customStyles} />
  </React.Fragment>
);
