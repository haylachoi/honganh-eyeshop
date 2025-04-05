"use client";

import { useForm } from "react-hook-form";
import { SignInInputType } from "../../../features/auth/auth.type";
import { signInInputSchema } from "../../../features/auth/auth.validator";
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
import { signIn } from "../../../features/auth/auth.action";
import { Input } from "@/components/ui/input";
import { onActionError } from "@/lib/actions/action.helper";
import { toast } from "sonner";
import { ADMIN_ENDPOINTS, TOAST_MESSAGES } from "@/constants";
import { useRouter } from "next/navigation";

const defaultValues: SignInInputType = {
  email: "hihi@gmail.com",
  password: "1234",
};

export default function LoginForm() {
  const router = useRouter();
  const { execute, isPending } = useAction(signIn, {
    onSuccess: (data) => {
      if (data.data === false)
        toast.success(TOAST_MESSAGES.AUTH.LOGIN.NOT_MATCH);

      if (data.data === true) {
        router.push(ADMIN_ENDPOINTS.HOME);
      }
    },
    onError: onActionError,
  });
  const form = useForm<SignInInputType>({
    defaultValues,
    resolver: zodResolver(signInInputSchema),
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: SignInInputType) => {
    execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <Button className="w-full mt-6" type="submit" disabled={isPending}>
          Đăng nhập
          {isPending && <AnimateLoadingIcon />}
        </Button>
      </form>
    </Form>
  );
}
