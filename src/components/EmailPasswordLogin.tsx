import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "reactfire";
import "twin.macro";
import { useRedirectTo } from "./hooks/useRedirectTo";
import { InputField } from "./InputField";

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
      <InputField
        label="Email"
        name="email"
        type="text"
        placeholder="Enter your email"
        error={errors.email}
        register={register}
        requiredMsg="Please enter your email"
        autoFocus
      />

      <InputField
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        error={errors.password}
        register={register}
        requiredMsg="Please enter your password"
      />

      <button tw="my-4 btn btn-block">Log in</button>
    </form>
  );
};
