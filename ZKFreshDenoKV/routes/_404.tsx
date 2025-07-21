import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <div class="min-h-screen bg-green-50 text-green-900 flex items-center justify-center">
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div class="text-center">
        <div class="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
          <h1 class="text-6xl font-bold text-green-800 mb-4">HEY</h1>
          <p class="text-xl text-green-700 leading-relaxed">
            STOP SNOOPING AROUND. NOTHING SPECIAL IS HERE
          </p>
          <div class="mt-6">
            <a 
              href="/" 
              class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 inline-block"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
