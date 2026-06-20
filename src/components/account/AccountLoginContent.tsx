"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

/* ============================================
   Zod Schemas — manual validation pattern
   (no @hookform/resolvers, Zod v4 compatible)
   ============================================ */

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

/* ============================================
   Login Form
   ============================================ */

function LoginForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    /* Manual Zod validation (Zod v4 pattern) */
    const result = loginSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFormData;
        setError(field, { message: issue.message });
      }
      return;
    }

    // TODO: Backend Integration - Submit login credentials to auth API
    console.log("Login form submitted:", result.data);
    setIsSuccess(true);
    reset();
  };

  if (isSuccess) {
    return (
      <div className="py-12 text-center">
        <h3 className="font-heading text-3xl mb-3">Welcome!</h3>
        <p className="font-body text-base text-black/70 leading-relaxed mb-6">
          You have successfully signed in to your Soul Good account.
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className={cn(
            "inline-flex items-center justify-center",
            "font-sans text-sm uppercase tracking-[0.06em] font-medium",
            "bg-black text-white px-8 py-3.5",
            "hover:bg-black/80 active:bg-black/70",
            "transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]"
          )}
        >
          CONTINUE SHOPPING
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* Email */}
      <Input
        type="email"
        label="Email"
        placeholder="your@email.com"
        {...register("email", {
          validate: (v) => {
            const r = loginSchema.shape.email.safeParse(v);
            return r.success
              ? true
              : r.error.issues[0]?.message || "Email is required";
          },
        })}
        error={errors.email?.message}
      />

      {/* Password */}
      <Input
        type="password"
        label="Password"
        placeholder="Enter your password"
        {...register("password", {
          validate: (v) => {
            const r = loginSchema.shape.password.safeParse(v);
            return r.success
              ? true
              : r.error.issues[0]?.message || "Password is required";
          },
        })}
        error={errors.password?.message}
      />

      {/* Forgot Password */}
      <div className="flex justify-end">
        <button
          type="button"
          className="font-sans text-xs uppercase tracking-[0.06em] font-medium text-primary hover:text-primary-dark transition-colors duration-300 underline underline-offset-4 decoration-1"
        >
          Forgot Password?
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full inline-flex items-center justify-center",
          "font-sans text-sm uppercase tracking-[0.06em] font-medium",
          "bg-black text-white px-8 py-4",
          "hover:bg-black/80 active:bg-black/70",
          "transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
          "disabled:opacity-50 disabled:pointer-events-none"
        )}
      >
        SIGN IN
      </button>
    </form>
  );
}

/* ============================================
   Register Form
   ============================================ */

function RegisterForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<RegisterFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    /* Manual Zod validation (Zod v4 pattern) */
    const result = registerSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof RegisterFormData;
        setError(field, { message: issue.message });
      }
      return;
    }

    // TODO: Backend Integration - Submit registration data to auth API
    console.log("Register form submitted:", result.data);
    setIsSuccess(true);
    reset();
  };

  if (isSuccess) {
    return (
      <div className="py-12 text-center">
        <h3 className="font-heading text-3xl mb-3">Welcome!</h3>
        <p className="font-body text-base text-black/70 leading-relaxed mb-6">
          Your Soul Good account has been created successfully.
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className={cn(
            "inline-flex items-center justify-center",
            "font-sans text-sm uppercase tracking-[0.06em] font-medium",
            "bg-black text-white px-8 py-3.5",
            "hover:bg-black/80 active:bg-black/70",
            "transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]"
          )}
        >
          START SHOPPING
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* First Name & Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Input
          label="First Name"
          placeholder="First name"
          {...register("firstName", {
            validate: (v) => {
              const r = registerSchema.shape.firstName.safeParse(v);
              return r.success
                ? true
                : r.error.issues[0]?.message || "First name is required";
            },
          })}
          error={errors.firstName?.message}
        />

        <Input
          label="Last Name"
          placeholder="Last name"
          {...register("lastName", {
            validate: (v) => {
              const r = registerSchema.shape.lastName.safeParse(v);
              return r.success
                ? true
                : r.error.issues[0]?.message || "Last name is required";
            },
          })}
          error={errors.lastName?.message}
        />
      </div>

      {/* Email */}
      <Input
        type="email"
        label="Email"
        placeholder="your@email.com"
        {...register("email", {
          validate: (v) => {
            const r = registerSchema.shape.email.safeParse(v);
            return r.success
              ? true
              : r.error.issues[0]?.message || "Email is required";
          },
        })}
        error={errors.email?.message}
      />

      {/* Password */}
      <Input
        type="password"
        label="Password"
        placeholder="Minimum 8 characters"
        {...register("password", {
          validate: (v) => {
            const r = registerSchema.shape.password.safeParse(v);
            return r.success
              ? true
              : r.error.issues[0]?.message || "Password is required";
          },
        })}
        error={errors.password?.message}
      />

      {/* Confirm Password */}
      <Input
        type="password"
        label="Confirm Password"
        placeholder="Re-enter your password"
        {...register("confirmPassword", {
          validate: (v) => {
            if (!v || v.length === 0) return "Please confirm your password";
            return true;
          },
        })}
        error={errors.confirmPassword?.message}
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full inline-flex items-center justify-center",
          "font-sans text-sm uppercase tracking-[0.06em] font-medium",
          "bg-black text-white px-8 py-4",
          "hover:bg-black/80 active:bg-black/70",
          "transition-all duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
          "disabled:opacity-50 disabled:pointer-events-none"
        )}
      >
        CREATE ACCOUNT
      </button>
    </form>
  );
}

/* ============================================
   Tabbed Account Content
   ============================================ */

type TabType = "login" | "register";

export function AccountLoginContent() {
  const [activeTab, setActiveTab] = useState<TabType>("login");

  return (
    <>
      {/* Hero */}
      <section className="bg-cream">
        <div className="max-container section-padding text-center">
          <p className="label-text text-primary mb-5 text-xs tracking-widest">
            MY ACCOUNT
          </p>
          <h1 className="font-heading text-[2.75rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.08] mb-6">
            {activeTab === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="font-body text-lg md:text-xl text-black/70 leading-relaxed max-w-2xl mx-auto">
            {activeTab === "login"
              ? "Sign in to your Soul Good account to manage orders, subscriptions, and more."
              : "Join the Soul Good community and start your wellness journey today."}
          </p>
        </div>
      </section>

      {/* Tabbed Form */}
      <section className="max-container section-padding">
        <div className="max-w-[480px] mx-auto">
          {/* Tab Buttons */}
          <div className="flex border-b border-border mb-10">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={cn(
                "flex-1 pb-4 font-sans text-sm uppercase tracking-[0.06em] font-medium",
                "transition-colors duration-300 border-b-2 -mb-[1px]",
                activeTab === "login"
                  ? "border-black text-black"
                  : "border-transparent text-black/40 hover:text-black/60"
              )}
            >
              LOGIN
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={cn(
                "flex-1 pb-4 font-sans text-sm uppercase tracking-[0.06em] font-medium",
                "transition-colors duration-300 border-b-2 -mb-[1px]",
                activeTab === "register"
                  ? "border-black text-black"
                  : "border-transparent text-black/40 hover:text-black/60"
              )}
            >
              REGISTER
            </button>
          </div>

          {/* Form Content */}
          <div>
            {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </section>
    </>
  );
}
