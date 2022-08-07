import { signInWithEmailAndPassword } from "firebase/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "reactfire";
import "twin.macro";
import { Button } from "./Button";
import { FormInput } from "./form/FormInput";
import { useRedirectTo } from "./hooks/useRedirectTo";

type Inputs = {
  email: string;
  password: string;
};

export const EmailPasswordLogin = () => {
  const auth = useAuth();
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        label="Email"
        name="email"
        inputProps={{ type: "email", autoFocus: true }}
        placeholder="Enter your email"
        error={errors.email}
        register={register}
        requiredMsg="Please enter your email"
      />

      <FormInput
        label="Password"
        name="password"
        inputProps={{ type: "password" }}
        placeholder="Enter your password"
        error={errors.password}
        register={register}
        requiredMsg="Please enter your password"
      />

      <Button label="Log in" type="submit" />
    </form>
  );
};
