import { Head } from "$fresh/runtime.ts";
import { Footer } from "../components/footer.tsx";
import { Nav } from "../components/nav.tsx";

export default function Future() {
  return (
    <div class="min-h-screen flex flex-col">
      <Head>
        <title>Future Plans</title>
      </Head>
      <div class="flex-grow">
        <Nav />
        <div class="max-w-4xl mx-auto px-4">
          <div class="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 class="text-4xl font-bold text-green-800 mb-6 text-center">My Future Plans</h1>
            
            <blockquote class="text-2xl text-green-700 italic text-center mb-8 border-l-4 border-green-500 pl-4 bg-green-50 py-4 rounded-r-lg">
              "HYAAH" ~Toon Link
            </blockquote>
            
            <div class="space-y-6 mb-8">
              <div class="bg-green-100 rounded-lg p-6 border-l-4 border-green-500">
                <p class="text-xl font-bold text-green-800 uppercase tracking-wide">
                  I PLAN TO HAVE MORE TOON LINKS
                </p>
              </div>
              
              <div class="bg-green-100 rounded-lg p-6 border-l-4 border-green-500">
                <p class="text-xl font-bold text-green-800 uppercase tracking-wide">
                  I PLAN TO GET A JOB TO GET MONEY TO BUY MORE TOON LINKS
                </p>
              </div>
            </div>
            
            <div class="flex justify-center">
              <img 
                src="/filipino.jpg" 
                alt="Filipino" 
                class="max-w-sm w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}