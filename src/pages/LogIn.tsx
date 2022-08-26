import { Card } from "../components/Card";
import { Divider } from "../components/Divider";
import { EmailPasswordLogin } from "../components/EmailPasswordLogin";
import { GoogleLogin } from "../components/GoogleLogin";

export const LogIn = () => {
  return (
    <div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">
          Sign in to Memento
        </h2>
      </div>
      <Card>
        <EmailPasswordLogin />
        <Divider label="Or continue with" />
        <GoogleLogin />
      </Card>
    </div>
  );
};
