import clsx from "clsx";
import { Box, PolymorphicComponentProps } from "react-polymorphic-box";

// Component-specific props specified separately
type LinkOwnProps = {};

// Merge own props with others inherited from the underlying element type
type LinkProps<E extends React.ElementType> = PolymorphicComponentProps<
  E,
  LinkOwnProps
>;

const defaultElement = "a";

const linkStyles =
  "text-orange-600 underline hover:text-orange-500 hover:no-underline";

export function Link<E extends React.ElementType = typeof defaultElement>({
  ...restProps
}: LinkProps<E>): JSX.Element {
  // The `as` prop may be overridden by the passed props
  return (
    <Box className={clsx(linkStyles)} as={defaultElement} {...restProps} />
  );
}
