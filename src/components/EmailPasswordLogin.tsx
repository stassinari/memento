import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "reactfire";
import "twin.macro";
import tw from "twin.macro";
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
      <div tw="w-full">
        <label tw="label">
          <span tw="label-text">Email</span>
        </label>
        <input
          type="email"
          placeholder="E.g. pippo@franco.com"
          css={[
            tw`w-full input input-bordered`,
            errors.email && tw`input-error`,
          ]}
          {...register("email", { required: true })}
        />
        {errors.email && (
          <label tw="label">
            <span tw="label-text text-error">Please enter your email</span>
          </label>
        )}
      </div>
      <div tw="w-full form-control">
        <label tw="label">
          <span tw="label-text">Password</span>
        </label>
        <input
          type="password"
          css={[
            tw`w-full input input-bordered`,
            errors.password && tw`input-error`,
          ]}
          {...register("password", { required: true })}
        />
        {errors.password && (
          <label tw="label">
            <span tw="label-text text-error">Please enter your password</span>
          </label>
        )}
      </div>
      <button tw="my-4 btn btn-block">Log in</button>
    </form>
  );
};
