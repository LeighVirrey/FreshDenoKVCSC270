import { useState, useEffect } from "preact/hooks";

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

export default function CharacterList() {
  const [characters, setCharacters] = useState<ZeldaCharacter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  const charactersPerPage = 20;

  const fetchCharacters = async (page: number, append = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://zelda.fanapis.com/api/characters?limit=${charactersPerPage}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiData: ZeldaApiResponse = await response.json();
      const newCharacters = apiData.data || [];

      if (append) {
        setCharacters(prev => [...prev, ...newCharacters]);
      } else {
        setCharacters(newCharacters);
      }

      setHasMore(newCharacters.length === charactersPerPage);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch characters");
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchCharacters(1);
  }, []);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchCharacters(nextPage, true);
  };

  const handleCharacterClick = (characterName: string) => {
    // Navigate to character detail using partials
    const encodedName = encodeURIComponent(characterName);
    const link = document.createElement('a');
    link.href = `/api/tloz/detail/${encodedName}`;
    link.setAttribute('f-partial', `/api/tloz/detail/${encodedName}`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div class="text-center py-12">
        <div class="text-6xl mb-4">⚠️</div>
        <p class="text-xl text-red-600">
          Error loading characters. Please try again later.
        </p>
        <p class="text-sm text-red-500 mt-2">
          {error}
        </p>
        <button 
          type="button"
          onClick={() => {
            setCurrentPage(1);
            fetchCharacters(1);
          }}
          class="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-green-800">
        </h2>
        <div class="text-sm text-green-600">
          Showing {characters.length} characters
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((character, index) => (
          <div 
            key={`${character.id}-${index}`} 
            class="bg-green-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-lg font-semibold text-green-800">{character.name}</h3>
              <span class="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                {character.race || "Unknown"}
              </span>
            </div>
            
            <p class="text-green-700 text-sm mb-4 line-clamp-3">
              {character.description ? 
                (character.description.length > 150 
                  ? character.description.substring(0, 150) + "..." 
                  : character.description)
                : "No description available"
              }
            </p>
            
            <div class="flex justify-between items-center">
              <span class="text-xs text-green-600">
                {character.gender || "Unknown"}
              </span>
              <button 
                type="button"
                onClick={() => handleCharacterClick(character.name)}
                class="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors duration-200"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {characters.length === 0 && !loading && !error && (
        <div class="text-center py-12">
          <div class="text-6xl mb-4">😔</div>
          <p class="text-xl text-green-700">No characters found</p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && characters.length > 0 && (
        <div class="flex justify-center mt-8">
          <button 
            type="button"
            onClick={loadMore}
            disabled={loading}
            class={`font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg ${
              loading 
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <span class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              'Load More Characters'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
