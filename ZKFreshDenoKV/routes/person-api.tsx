import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getAuthState, requireAuth } from "../lib/middleware.ts";
import { PersonManager } from "../islands/PersonManager.tsx";
import { Nav } from "../components/nav.tsx";
import { Footer } from "../components/footer.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const authState = await getAuthState(req);
    const authResponse = requireAuth(authState);
    if (authResponse) {
      return authResponse;
    }

    return ctx.render({ authState });
  },
};

interface PersonAPIPageProps {
  authState: {
    user: {
      id: string;
      username: string;
      email: string;
    } | null;
  };
}

export default function PersonAPI(props: PageProps<PersonAPIPageProps>) {
  const { authState } = props.data;
  return (
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-100">
      <Head>
        <title>Person API - CRUD Operations</title>
        <meta name="description" content="Demonstration of RESTful API with CRUD operations for person records using Deno KV" />
      </Head>
      
      <Nav />

      <main class="flex-1 container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-green-900 mb-4">
              Person API Showcase
            </h1>
            <p class="text-lg text-green-700 mb-2">
              RESTful API with full CRUD operations
            </p>
            <p class="text-green-600">
              Powered by Deno KV database with atomic transactions
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 class="text-2xl font-semibold text-green-800 mb-4">
              API Endpoints
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="bg-green-50 p-4 rounded-lg">
                <h3 class="font-semibold text-green-900 mb-2">GET /api/persons</h3>
                <p class="text-green-700">Retrieve all persons or a specific person by ID</p>
                <code class="block mt-2 text-xs bg-green-100 p-2 rounded">
                  GET /api/persons?id=uuid
                </code>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <h3 class="font-semibold text-blue-900 mb-2">POST /api/persons</h3>
                <p class="text-blue-700">Create a new person record</p>
                <code class="block mt-2 text-xs bg-blue-100 p-2 rounded">
                  Body: {"{"}"name": "string", "age": number, "infected": boolean{"}"}
                </code>
              </div>
              <div class="bg-yellow-50 p-4 rounded-lg">
                <h3 class="font-semibold text-yellow-900 mb-2">PUT /api/persons</h3>
                <p class="text-yellow-700">Update an existing person record</p>
                <code class="block mt-2 text-xs bg-yellow-100 p-2 rounded">
                  Body: {"{"}"id": "uuid", "name"?: "string", ...{"}"}
                </code>
              </div>
              <div class="bg-red-50 p-4 rounded-lg">
                <h3 class="font-semibold text-red-900 mb-2">DELETE /api/persons</h3>
                <p class="text-red-700">Delete a person by ID</p>
                <code class="block mt-2 text-xs bg-red-100 p-2 rounded">
                  DELETE /api/persons?id=uuid
                </code>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-2xl font-semibold text-green-800 mb-4">
              Interactive Demo
            </h2>
            <p class="text-green-600 mb-6">
              Use the interface below to test all CRUD operations. Data is persisted in Deno KV.
            </p>
            
            <PersonManager />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
