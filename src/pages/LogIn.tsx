import "twin.macro";
import { Card } from "../components/Card";
import { Divider } from "../components/Divider";
import { EmailPasswordLogin } from "../components/EmailPasswordLogin";
import { GoogleLogin } from "../components/GoogleLogin";
import { layoutContainerStyles } from "../components/Layout";

export const LogIn = () => {
  return (
    <div css={layoutContainerStyles}>
      <div tw="px-4 sm:(px-0 mx-auto max-w-md)">
        <h2 tw="my-6 text-3xl font-bold tracking-tight text-center text-gray-900">
          Sign in to Memento
        </h2>
        <Card>
          <EmailPasswordLogin />
          <Divider label="Or continue with" />
          <GoogleLogin />
        </Card>
      </div>
    </div>
  );
};

export default LogIn;
