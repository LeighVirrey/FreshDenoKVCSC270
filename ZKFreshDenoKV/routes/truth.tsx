import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getAuthState } from "../lib/middleware.ts";
import { Footer } from "../components/footer.tsx";
import { Nav } from "../components/nav.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const authState = await getAuthState(req);
    return ctx.render({ authState });
  },
};

interface TruthPageProps {
  authState: {
    user: {
      id: string;
      username: string;
      email: string;
    } | null;
  };
}

export default function Truth(_props: PageProps<TruthPageProps>) {
  return (
    <div class="min-h-screen flex flex-col">
      <Head>
        <title>Truth</title>
      </Head>
      
      <Nav />
      
      <main class="flex-grow flex items-center justify-center bg-gray-50 py-8">
        <div class="max-w-4xl mx-auto px-4">
          <img 
            src="/truth.png" 
            alt="Truth" 
            class="max-w-full h-auto mx-auto shadow-2xl rounded-lg"
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
