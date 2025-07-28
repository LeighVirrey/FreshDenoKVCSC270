import { Head } from "$fresh/runtime.ts";
import { Footer } from "../components/footer.tsx";
import { Nav } from "../components/nav.tsx";
import { Partial } from "$fresh/runtime.ts";

export default function TlozApi() {
  return (
    <div class="min-h-screen flex flex-col">
      <Head>
        <title>Zelda Fan API Showcase</title>
      </Head>
      <div class="flex-grow">
        <Nav />
        <div class="max-w-6xl mx-auto px-4">
          <div class="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 class="text-4xl font-bold text-green-800 mb-6 text-center">
              The Legend of Zelda Fan API
            </h1>
            <p class="text-lg text-green-700 mb-8 text-center">
              Explore characters from The Legend of Zelda universe using the free Zelda Fan API
            </p>
            
            <div class="flex justify-center mb-8" f-client-nav>
              <a 
                href="/api/tloz/list" 
                f-partial="/api/tloz/list"
                class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                View All Characters
              </a>
            </div>
            <div f-client-nav>
              <Partial name="tloz-content">
                <div class="text-center py-12">
                  <div class="text-6xl mb-4">🗡️</div>
                  <p class="text-xl text-green-700">
                    Click "View All Characters" to start exploring!
                  </p>
                </div>
              </Partial>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}