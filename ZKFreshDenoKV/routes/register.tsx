import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getAuthState } from "../lib/middleware.ts";
import { RegisterForm } from "../islands/RegisterForm.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const authState = await getAuthState(req);
    
    // Redirect to home if already logged in
    if (authState.user) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    return ctx.render({ authState });
  },
};

interface RegisterPageProps {
  authState: {
    user: {
      id: string;
      username: string;
      email: string;
    } | null;
  };
}

export default function Register(_props: PageProps<RegisterPageProps>) {
  return (
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-100">
      <Head>
        <title>Register - ZK Fresh Demo</title>
        <meta name="description" content="Create a new account to access the Person API and other protected features" />
      </Head>

      <div class="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
          <div>
            <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" class="font-medium text-green-600 hover:text-green-500 transition-colors">
                Sign in here
              </a>
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-8">
            <RegisterForm />
          </div>

          <div class="text-center">
            <a href="/" class="text-green-600 hover:text-green-500 transition-colors">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
