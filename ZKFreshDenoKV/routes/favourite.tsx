import { Head } from "$fresh/runtime.ts";
import { Footer } from "../components/footer.tsx";
import { Nav } from "../components/nav.tsx";

export default function Favourite() {
  return (
    <div class="min-h-screen flex flex-col">
      <Head>
        <title>Favourites</title>
      </Head>
      <div class="flex-grow">
        <Nav />
        <div class="max-w-4xl mx-auto px-4">
          <div class="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 class="text-4xl font-bold text-green-800 mb-6 text-center">My Favourite Sites</h1>
            <p class="text-lg text-green-700 mb-6 text-center">Here are my favourites:</p>
            
            <ol class="space-y-3 mb-8">
              <li class="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors duration-150">
                <span class="font-semibold text-green-800 mr-2">1.</span>
                <a href="https://zelda.fandom.com/wiki/Toon_Link" class="text-green-600 hover:text-green-800 hover:underline transition-colors duration-150">
                  Toon Link Zelda Fandom Wiki
                </a>
              </li>
              <li class="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors duration-150">
                <span class="font-semibold text-green-800 mr-2">2.</span>
                <a href="https://nintendo.fandom.com/wiki/Toon_Link" class="text-green-600 hover:text-green-800 hover:underline transition-colors duration-150">
                  Toon Link Nintendo Fandom Wiki
                </a>
              </li>
              <li class="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors duration-150">
                <span class="font-semibold text-green-800 mr-2">3.</span>
                <a href="https://www.ssbwiki.com/Toon_Link_(SSBU)" class="text-green-600 hover:text-green-800 hover:underline transition-colors duration-150">
                  Toon Link SSBU Wiki
                </a>
              </li>
              <li class="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors duration-150">
                <span class="font-semibold text-green-800 mr-2">4.</span>
                <a href="https://opensource.org/" class="text-green-600 hover:text-green-800 hover:underline transition-colors duration-150">
                  Open Source Projects
                </a>
              </li>
              <li class="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors duration-150">
                <span class="font-semibold text-green-800 mr-2">5.</span>
                <a href="https://ultimateframedata.com/toon_link" class="text-green-600 hover:text-green-800 hover:underline transition-colors duration-150">
                  Toon Link Frame Data
                </a>
              </li>
              <li class="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors duration-150">
                <span class="font-semibold text-green-800 mr-2">6.</span>
                <a href="https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_The_Wind_Waker" class="text-green-600 hover:text-green-800 hover:underline transition-colors duration-150">
                  The Legend of Zelda: The Wind Waker Wikipedia
                </a>
              </li>
              <li class="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors duration-150">
                <span class="font-semibold text-green-800 mr-2">7.</span>
                <a href="https://www.nintendo.com/us/store/products/link-8-plush-107375/" class="text-green-600 hover:text-green-800 hover:underline transition-colors duration-150">
                  Official <i>Link™ 8" Plush</i>
                </a>
              </li>
              <li class="bg-green-50 rounded-lg p-3 hover:bg-green-100 transition-colors duration-150">
                <span class="font-semibold text-green-800 mr-2">8.</span>
                <a href="https://www.bafta.org/awards/games/adventure-game/" class="text-green-600 hover:text-green-800 hover:underline transition-colors duration-150">
                  BAFTA Awards Page Showing the <b>ONLY WINNER FOR GAMES/ADVENTURE GAME</b>
                </a>
              </li>
            </ol>
            
            <div class="bg-green-100 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
              <img 
                src="/paulfox.jpg" 
                alt="Paul Fox" 
                class="w-32 h-32 object-cover rounded-full shadow-md"
              />
              <div class="flex-1 text-center md:text-left">
                <div class="text-green-800 font-medium">
                  I agree with this message! I love 
                  <img 
                    src="/ToonLink.png" 
                    alt="Toon Link" 
                    class="inline w-8 h-8 mx-1 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}