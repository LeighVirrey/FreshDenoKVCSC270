import { Head } from "$fresh/runtime.ts";
import SpecialCounter from "../islands/SpecialCounter.tsx";

export default function Special() {
  return (
    <div class="min-h-screen bg-green-50 text-green-900">
      <Head>
        <title>Special Page WoooOOOoooOOO</title>
      </Head>
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 class="text-4xl font-bold text-green-800 mb-6">Special Page</h1>
          <p class="text-lg text-green-700 mb-6">This is a special page with a counter.</p>
          <SpecialCounter />
        </div>
      </div>
    </div>
  );
}
