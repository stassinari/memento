import tw, { css } from "twin.macro";

export const Spinner = () => (
  <div
    css={[
      tw`w-8 h-8 border-4 border-orange-400 rounded-full animate-spin`,
      css`
        border-top-color: transparent;
      `,
    ]}
  />
);
