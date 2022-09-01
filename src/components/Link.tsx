import { Link as ReactRouterLink, LinkProps } from "react-router-dom";
import tw from "twin.macro";

export const Link: React.FC<
  LinkProps & React.RefAttributes<HTMLAnchorElement>
> = (props) => {
  return (
    <ReactRouterLink
      css={tw`text-orange-600 underline hover:(text-orange-500 no-underline )`}
      {...props}
    />
  );
};
