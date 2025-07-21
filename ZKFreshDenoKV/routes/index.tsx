import  { Head } from "$fresh/runtime.ts";
import { Footer } from "../components/footer.tsx";
import { Nav } from "../components/nav.tsx";

export default function Home() {
  return (
    <div class="min-h-screen flex flex-col">
      <Head>
        <title>Home</title>
      </Head>
      <div class="flex-grow">
        <Nav />
        <div class="max-w-4xl mx-auto px-4">
          <div class="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 class="text-4xl font-bold text-green-800 mb-6 text-center">
              CSC210 Intro to Web Mock Progressive Lab
            </h1>
            <div class="flex justify-center mb-6">
              <img 
                src="/JUMPSCARE.jpg" 
                alt="It's Zk" 
                class="max-w-sm w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              />
            </div>
            <p class="text-lg text-green-700 leading-relaxed text-center">
              Welcome to <strong class="text-green-800">FreshDenoKV</strong> where I wanted to try out what it was like to use <strong class="text-green-800">Deno KV</strong> with the <strong class="text-green-800">Fresh</strong> framework. This site also mimics CSC210's Progressive Lab.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
