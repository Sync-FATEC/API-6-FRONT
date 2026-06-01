"use client";
import { useState } from "react";
import LoginForm from "./LoginForm";
import ResetPasswordForm from "./ResetPasswordForm";
import LoginLayout from "@/components/LoginLayout";

export default function LoginPage() {
  const [screen, setScreen] = useState<"login" | "forgot">("login");

  return (
    <LoginLayout>
      {screen === "login" ? (
        <LoginForm onForgotPassword={() => setScreen("forgot")} />
      ) : (
        <ResetPasswordForm onBack={() => setScreen("login")} />
      )}
    </LoginLayout>
  );
}
