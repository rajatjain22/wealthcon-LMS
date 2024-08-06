"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import Button from "../../../components/Button";
import InputChecks from "../../../components/Input/InputChecks";
import Input from "../../../components/Input/Input";
import Typography from "../../../components/Typography";
import Image from "next/image";
import Logo from "../../../assets/images/svg/logo.svg";

import "./AuthLayout.scss";
import { useRouter } from "next/navigation";
export default function Login() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      remember: Yup.boolean().oneOf(
        [true],
        "You must accept the terms and conditions"
      ),
    }),
    onSubmit: async (values) => {
      setError(null);
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          // Handle successful login (e.g., redirect, store token)
          console.log("Login successful:", data);
          // alert("Login successful");
          // setTimeout(() => location.reload(), 1000);
          router.push("/");
        } else {
          // Handle errors from the API
          setError(data.message || "Login failed");
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
      }
    },
  });

  return (
    <div className="md:grid block grid-cols-10 ">
      <div className="login-sidebar md:h-screen content-center md:py-0 py-10 col-span-6">
        <Image src={Logo} alt="logo" className="m-auto" />
      </div>
      <div className="bg-primary-content md:h-screen content-center block md:py-0 py-10 col-span-4">
        <div className="m-auto w-96">
          <form>
            <Typography
              tag="h1"
              size="text-3xl"
              weight="font-semibold"
              color="text-base-content"
              className="block text-left"
            >
              Welcome 👋
            </Typography>
            <Typography
              tag="h4"
              size="text-base"
              weight="font-normal"
              color="text-base-200"
              className="block text-left pt-1 mb-4 mt-2"
            >
              Today is a new day. It&apos;s your day. You shape it.
            </Typography>
            <Input
              type="email"
              id="email"
              label="Email"
              placeholder="Example@email.com"
              error={
                formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : null
              }
              {...formik.getFieldProps("email")}
            />

            <Input
              type="password"
              id="password"
              label="Password"
              placeholder="At least 8 characters"
              error={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : null
              }
              {...formik.getFieldProps("password")}
            />
            <Typography
              size="text-sm"
              weight="font-normal"
              color="text-primary"
              className="block text-end grid content-center mb-4"
            >
              <a href="#">Forgot your password?</a>
            </Typography>
            <InputChecks
              type="checkbox"
              id="remember"
              label="I accept the terms and conditions"
              {...formik.getFieldProps("remember")}
            />
            {formik.touched.remember && formik.errors.remember ? (
              <div className="text-red-600">{formik.errors.remember}</div>
            ) : null}
            {error && <div className="text-red-600">{error}</div>}
            <Button
              onClick={formik.handleSubmit}
              variant="btn-primary"
              className="mt-10 px-7 w-full"
            >
              SIGN IN
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
