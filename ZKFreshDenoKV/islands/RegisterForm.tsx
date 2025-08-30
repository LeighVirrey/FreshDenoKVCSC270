import { useState } from "preact/hooks";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to home page on successful registration
        globalThis.location.href = "/";
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError(`Registration failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
        <label htmlFor="username" class="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={formData.username}
          onInput={(e) => setFormData({ ...formData, username: e.currentTarget.value })}
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter your username"
          required
        />
      </div>

      <div>
        <label htmlFor="email" class="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onInput={(e) => setFormData({ ...formData, email: e.currentTarget.value })}
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter your email"
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
          placeholder="Enter your password (min. 6 characters)"
          minLength={6}
          required
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onInput={(e) => setFormData({ ...formData, confirmPassword: e.currentTarget.value })}
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Confirm your password"
          minLength={6}
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
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </div>
    </form>
  );
}
