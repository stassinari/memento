import { signInWithEmailAndPassword } from "firebase/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import { auth } from "../firebaseConfig";
import { useRedirectTo } from "../hooks/useRedirectTo";
import { Button } from "./Button";
import { FormInput } from "./form/FormInput";

type Inputs = {
  email: string;
  password: string;
};

export const EmailPasswordLogin = () => {
  const navigate = useNavigate();
  const redirectTo = useRedirectTo();

  const methods = useForm<Inputs>();
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = methods;
  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    await signInWithEmailAndPassword(auth, email, password);
    navigate(redirectTo ? redirectTo : "/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} tw="space-y-6">
      <FormInput
        label="Email"
        id="email"
        inputProps={{
          ...register("email", { required: "Please enter your email" }),
          type: "email",
          autoFocus: true,
          placeholder: "example@email.com",
        }}
        error={errors.email?.message}
      />

      <FormInput
        label="Password"
        id="password"
        inputProps={{
          ...register("password", { required: "Please enter your password" }),
          type: "password",
          placeholder: "Enter your password",
        }}
        error={errors.password?.message}
      />

      <div tw="flex items-center justify-end">
        <div tw="text-sm">
          <a href="#" tw="font-medium text-orange-600 hover:text-orange-500">
            Forgot your password?
          </a>
        </div>
      </div>

      <Button variant="primary" type="submit" width="full">
        Log in
      </Button>
    </form>
  );
};
