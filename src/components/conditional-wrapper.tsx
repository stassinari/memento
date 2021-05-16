import { FunctionComponent } from "react";

interface Props {
  condition: boolean;
  wrapper: (arg0: JSX.Element) => JSX.Element;
}

const ConditionalWrapper: FunctionComponent<Props> = ({
  condition,
  wrapper,
  children,
}): JSX.Element =>
  condition ? wrapper(children as JSX.Element) : (children as JSX.Element);

export default ConditionalWrapper;
