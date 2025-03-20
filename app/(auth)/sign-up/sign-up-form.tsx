"use client";

import { useForm } from "react-hook-form";
import { SignUpInputType } from "../../../features/auth/auth.type";
import { signUpInputSchema } from "../../../features/auth/auth.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@/components/ui/button";
import AnimateLoadingIcon from "@/components/custom-ui/animate-loading-icon";
import { signUp } from "../../../features/auth/auth.action";
import { Input } from "@/components/ui/input";
import { onActionError } from "@/lib/actions/action.helper";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants";

const defaultValues: SignUpInputType = {
  name: "hihi",
  email: "hihi@gmail.com",
  phone: "123456789",
  password: "1234",
  confirmPassword: "1234",
};

export default function SignUpForm() {
  const { execute, isPending } = useAction(signUp, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.AUTH.SIGN_UP.SUCCESS);
    },
    onError: onActionError,
  });
  const form = useForm<SignUpInputType>({
    defaultValues,
    resolver: zodResolver(signUpInputSchema),
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: SignUpInputType) => {
    console.log(data);
    execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          Submit
          {isPending && <AnimateLoadingIcon />}
        </Button>
      </form>
    </Form>
  );
}
