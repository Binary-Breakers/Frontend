import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-12">
      <form className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 max-w-sm w-full">
        <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-4">Welcome Back</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 text-sm">
          Don&apos;t have an account?{" "}
          <Link className="text-blue-600 dark:text-blue-400 font-medium hover:underline" href="/sign-up">
            Sign up
          </Link>
        </p>

        <div className="mb-6">
          <Label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 text-sm font-bold">Password</Label>
            <Link className="text-xs text-blue-600 dark:text-blue-400 hover:underline" href="/forgot-password">
              Forgot Password?
            </Link>
          </div>
          <Input
            name="password"
            type="password"
            placeholder="Your password"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
          />
        </div>

        <div className="flex items-center justify-center">
          <SubmitButton
            pendingText="Signing In..."
            formAction={signInAction}
            className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign in
          </SubmitButton>
        </div>

        <FormMessage message={searchParams} />
      </form>
    </div>
  );
}
