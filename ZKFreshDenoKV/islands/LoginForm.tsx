import { useState } from "preact/hooks";

export function LoginForm() {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to home page on successful login
        globalThis.location.href = "/";
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError(`Login failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-6">
      {error && (
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="usernameOrEmail" class="block text-sm font-medium text-gray-700 mb-1">
          Username or Email
        </label>
        <input
          id="usernameOrEmail"
          type="text"
          value={formData.usernameOrEmail}
          onInput={(e) => setFormData({ ...formData, usernameOrEmail: e.currentTarget.value })}
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter your username or email"
          required
        />
      </div>

      <div>
        <label htmlFor="password" class="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onInput={(e) => setFormData({ ...formData, password: e.currentTarget.value })}
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter your password"
          required
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          class={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500"
          }`}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </form>
  );
}
