import { Global } from "@emotion/react";
import React from "react";
import tw, { css, GlobalStyles as BaseStyles, theme } from "twin.macro";

const customStyles = css({
  html: {
    ...tw`h-full bg-gray-50`,
  },
  body: {
    WebkitTapHighlightColor: theme`colors.transparent`,
    ...tw`h-full antialiased`,
  },
});

export const GlobalStyles = () => (
  <React.Fragment>
    <BaseStyles />
    <Global styles={customStyles} />
  </React.Fragment>
);
