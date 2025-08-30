import { useState, useEffect } from "preact/hooks";

interface User {
  id: string;
  username: string;
  email: string;
}

export function AuthNavigation() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/status");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Failed to check auth status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      if (response.ok) {
        setUser(null);
        globalThis.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div class="flex items-center space-x-4">
        <span class="text-white text-sm">Loading...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div class="flex items-center space-x-4">
        <span class="text-white text-sm">
          Welcome, {user.username}!
        </span>
        <a
          href="/chat"
          class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          💬 Chat
        </a>
        <button
          type="button"
          onClick={handleLogout}
          class="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div class="flex items-center space-x-4">
      <a
        href="/login"
        class="text-white hover:text-green-200 transition-colors duration-200 font-medium"
      >
        Login
      </a>
      <a
        href="/register"
        class="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-sm transition-colors"
      >
        Register
      </a>
    </div>
  );
}
