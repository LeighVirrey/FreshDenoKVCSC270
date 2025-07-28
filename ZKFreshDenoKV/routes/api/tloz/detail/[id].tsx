import { defineRoute, RouteConfig } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";


interface ZeldaCharacter {
  id: string;
  name: string;
  description: string;
  gender: string;
  race: string;
  appearances: string[];
}

interface ZeldaApiResponse {
  success: boolean;
  count: number;
  data: ZeldaCharacter[];
}

export default defineRoute(async (_req, ctx) => {
  const { id } = ctx.params;
  
  try {
    const characterName = decodeURIComponent(id);
    
    const response = await fetch(`https://zelda.fanapis.com/api/characters?name=${encodeURIComponent(characterName)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const apiData: ZeldaApiResponse = await response.json();
    const character = apiData.data?.[0];

    if (!character) {
      return (
        <Partial name="tloz-content">
          <div class="text-center py-12">
            <div class="text-6xl mb-4">🔍</div>
            <h2 class="text-2xl font-bold text-green-800 mb-4">Character Not Found</h2>
            <p class="text-lg text-green-700 mb-6">
              The character "{characterName}" could not be found.
            </p>
            <a 
              href="/api/tloz/list"
              f-partial="/api/tloz/list"
              class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              ← Back to Characters
            </a>
          </div>
        </Partial>
      );
    }

    return (
      <Partial name="tloz-content">
        <div>
          {/* Back button */}
          <div class="mb-6">
            <a 
              href="/api/tloz/list"
              f-partial="/api/tloz/list"
              class="inline-flex items-center text-green-600 hover:text-green-800 transition-colors duration-200"
            >
              Back to Characters
            </a>
          </div>

          {/* Character details card */}
          <div class="bg-green-50 rounded-lg p-8">
            <div class="flex flex-col lg:flex-row gap-8">
              {/* Character info */}
              <div class="flex-1">
                {/* Character header with name and badges */}
                <div class="flex flex-wrap items-start justify-between mb-6">
                  <h2 class="text-3xl font-bold text-green-800 mb-2">{character.name}</h2>
                  <div class="flex flex-wrap gap-2">
                    <span class="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {character.race || "Unknown Race"}
                    </span>
                    <span class="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {character.gender || "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Description section */}
                <div class="mb-8">
                  <h3 class="text-xl font-semibold text-green-800 mb-3">Description</h3>
                  <div class="bg-white rounded-lg p-6 shadow-sm">
                    <p class="text-green-700 leading-relaxed">
                      {character.description || "No description available for this character."}
                    </p>
                  </div>
                </div>

                {/* Game appearances section */}
                {character.appearances && character.appearances.length > 0 && (
                  <div class="mb-6">
                    <h3 class="text-xl font-semibold text-green-800 mb-3">
                      Game Appearances ({character.appearances.length})
                    </h3>
                    <div class="bg-white rounded-lg p-6 shadow-sm">
                      <div class="grid grid-cols-1 gap-2">
                        {character.appearances.map((gameUrl, index) => (
                          <div key={index} class="flex items-center text-green-700">
                            <span class="text-green-500 mr-2">🎮</span>
                            <span class="text-sm">Game Reference: {gameUrl.split('/').pop()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Character stats grid */}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-white rounded-lg p-4 shadow-sm">
                    <h4 class="font-semibold text-green-800 mb-2">Character ID</h4>
                    <p class="text-green-700 text-sm font-mono">{character.id}</p>
                  </div>
                  <div class="bg-white rounded-lg p-4 shadow-sm">
                    <h4 class="font-semibold text-green-800 mb-2">Total Appearances</h4>
                    <p class="text-green-700 text-2xl font-bold">
                      {character.appearances?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Partial>
    );
  } catch (error) {
    console.error("Error fetching character details:", error);
    return (
      <Partial name="tloz-content">
        <div class="text-center py-12">
          <div class="text-6xl mb-4">⚠️</div>
          <h2 class="text-2xl font-bold text-red-600 mb-4">Error Loading Character</h2>
          <p class="text-lg text-red-500 mb-6">
            Failed to load character details. Please try again later.
          </p>
          <div class="space-x-4">
            <a 
              href="/api/tloz/list"
              f-partial="/api/tloz/list"
              class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              ← Back to Characters
            </a>
            <a 
              href="/tlozapi"
              class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Try Again
            </a>
          </div>
          <p class="text-sm text-red-400 mt-4">
            Error: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </Partial>
    );
  }
});
