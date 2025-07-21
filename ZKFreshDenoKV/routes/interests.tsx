import { Head } from "$fresh/runtime.ts";
import { Footer } from "../components/footer.tsx";
import { Nav } from "../components/nav.tsx";

export default function Interests() {
  return (
    <div class="min-h-screen flex flex-col">
      <Head>
        <title>Interests</title>
      </Head>
      <div class="flex-grow">
        <Nav />
        <div class="max-w-4xl mx-auto px-4">
          <div class="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 class="text-4xl font-bold text-green-800 mb-6 text-center">Interests</h1>
            <p class="text-sm text-green-600 italic mb-6 text-center">
              <i>note: I know I'm using Tables and such, this was part of the assignment requirements. I'm sorry.</i>
            </p>
            
            <div class="overflow-x-auto mb-8">
              <table class="w-full border-collapse bg-green-50 rounded-lg overflow-hidden shadow-sm">
                <thead class="bg-green-600 text-white">
                  <tr>
                    <th class="border border-green-700 px-4 py-3 text-left font-semibold">#</th>
                    <th class="border border-green-700 px-4 py-3 text-left font-semibold">Video Games</th>
                    <th class="border border-green-700 px-4 py-3 text-left font-semibold">Board Games</th>
                    <th class="border border-green-700 px-4 py-3 text-left font-semibold">People</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="hover:bg-green-100 transition-colors duration-150">
                    <td class="border border-green-300 px-4 py-3 font-medium">1.</td>
                    <td class="border border-green-300 px-4 py-3">Legend of Zelda: The Wind Waker</td>
                    <td class="border border-green-300 px-4 py-3">Legend of Zelda: The Wind Walker</td>
                    <td class="border border-green-300 px-4 py-3 font-semibold text-green-700">Toon Link</td>
                  </tr>
                  <tr class="hover:bg-green-100 transition-colors duration-150">
                    <td class="border border-green-300 px-4 py-3 font-medium">2.</td>
                    <td class="border border-green-300 px-4 py-3">Legend of Zelda: The Wind Waker</td>
                    <td class="border border-green-300 px-4 py-3">Legend of Zelda: The Wind Walker</td>
                    <td class="border border-green-300 px-4 py-3 font-semibold text-green-700">Toon Link</td>
                  </tr>
                  <tr class="hover:bg-green-100 transition-colors duration-150">
                    <td class="border border-green-300 px-4 py-3 font-medium">3.</td>
                    <td class="border border-green-300 px-4 py-3">Legend of Zelda: The Wind Waker</td>
                    <td class="border border-green-300 px-4 py-3">Legend of Zelda: The Wind Walker</td>
                    <td class="border border-green-300 px-4 py-3 font-semibold text-green-700">Toon Link</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="flex justify-center">
              <img 
                src="/toon-link.gif" 
                alt="Toon Link" 
                class="max-w-xs w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}