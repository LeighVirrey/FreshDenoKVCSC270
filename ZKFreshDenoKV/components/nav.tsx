import { AuthNavigation } from "../islands/AuthNavigation.tsx";

export function Nav() {
  return (
    <nav class="bg-green-600 shadow-lg mb-8">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex justify-between items-center">
          <ul class="flex space-x-8 py-4">
            <li>
              <a href="/" class="text-white hover:text-green-200 transition-colors duration-200 font-medium">
                Home
              </a>
            </li>
            <li>
              <a href="/interests" class="text-white hover:text-green-200 transition-colors duration-200 font-medium">
                Interests
              </a>
            </li>
            <li>
              <a href="/favourite" class="text-white hover:text-green-200 transition-colors duration-200 font-medium">
                Favourite Sites
              </a>
            </li>
            <li>
              <a href="/future" class="text-white hover:text-green-200 transition-colors duration-200 font-medium">
                Future Plans
              </a>
            </li>
            <li>
              <a href="/tlozapi" class="text-white hover:text-green-200 transition-colors duration-200 font-medium">
                Zelda API
              </a>
            </li>
            <li>
              <a href="/person-api" class="text-white hover:text-green-200 transition-colors duration-200 font-medium">
                Person API
              </a>
            </li>
          </ul>
          <AuthNavigation />
        </div>
      </div>
    </nav>
  );
}