import { Box, PolymorphicComponentProps } from "react-polymorphic-box";
import "twin.macro";

// Component-specific props specified separately
type LinkOwnProps = {};

// Merge own props with others inherited from the underlying element type
type LinkProps<E extends React.ElementType> = PolymorphicComponentProps<
  E,
  LinkOwnProps
>;

const defaultElement = "a";

export function Link<E extends React.ElementType = typeof defaultElement>({
  ...restProps
}: LinkProps<E>): JSX.Element {
  // The `as` prop may be overridden by the passed props
  return (
    <Box
      tw="text-orange-600 underline hover:(text-orange-500 no-underline)"
      as={defaultElement}
      {...restProps}
    />
  );
}
