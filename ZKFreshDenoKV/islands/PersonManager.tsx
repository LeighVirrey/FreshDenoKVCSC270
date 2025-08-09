import { useState, useEffect } from "preact/hooks";

interface Person {
  id: string;
  name: string;
  age: number;
  infected: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PersonFormData {
  name: string;
  age: string;
  infected: boolean;
}

export function PersonManager() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<PersonFormData>({
    name: "",
    age: "",
    infected: false,
  });

  // Fetch all persons
  const fetchPersons = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/persons");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPersons(data);
    } catch (err) {
      setError(`Failed to fetch persons: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Create a new person
  const createPerson = async (data: PersonFormData) => {
    try {
      const response = await fetch("/api/persons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          age: parseInt(data.age),
          infected: data.infected,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      await fetchPersons(); // Refresh the list
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(`Failed to create person: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Update an existing person
  const updatePerson = async (data: PersonFormData) => {
    if (!editingPerson) return;

    try {
      const response = await fetch("/api/persons", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingPerson.id,
          name: data.name,
          age: parseInt(data.age),
          infected: data.infected,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      await fetchPersons(); // Refresh the list
      resetForm();
      setEditingPerson(null);
    } catch (err) {
      setError(`Failed to update person: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Delete a person
  const deletePerson = async (id: string) => {
    if (!confirm("Are you sure you want to delete this person?")) {
      return;
    }

    try {
      const response = await fetch(`/api/persons?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      await fetchPersons(); // Refresh the list
    } catch (err) {
      setError(`Failed to delete person: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Form submission handler
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.age.trim()) {
      setError("Name and age are required");
      return;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 0) {
      setError("Age must be a valid positive number");
      return;
    }

    if (editingPerson) {
      await updatePerson(formData);
    } else {
      await createPerson(formData);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: "", age: "", infected: false });
    setError(null);
  };

  // Start editing a person
  const startEdit = (person: Person) => {
    setEditingPerson(person);
    setFormData({
      name: person.name,
      age: person.age.toString(),
      infected: person.infected,
    });
    setShowForm(true);
    setError(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingPerson(null);
    setShowForm(false);
    resetForm();
  };

  // Load persons on component mount
  useEffect(() => {
    fetchPersons();
  }, []);

  return (
    <div class="space-y-6">
      {/* Action Buttons */}
      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? "Cancel" : "Add New Person"}
        </button>
        <button
          type="button"
          onClick={fetchPersons}
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div class="bg-gray-50 p-6 rounded-lg border">
          <h3 class="text-lg font-semibold mb-4">
            {editingPerson ? "Edit Person" : "Add New Person"}
          </h3>
          <form onSubmit={handleSubmit} class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onInput={(e) => setFormData({ ...formData, name: e.currentTarget.value })}
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onInput={(e) => setFormData({ ...formData, age: e.currentTarget.value })}
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter age"
                  min="0"
                  required
                />
              </div>
              <div class="flex items-center space-x-3 pt-6">
                <input
                  type="checkbox"
                  id="infected"
                  checked={formData.infected}
                  onChange={(e) => setFormData({ ...formData, infected: e.currentTarget.checked })}
                  class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                />
                <label for="infected" class="text-sm font-medium text-gray-700">
                  Infected Status
                </label>
              </div>
            </div>
            <div class="flex gap-3">
              <button
                type="submit"
                class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingPerson ? "Update Person" : "Create Person"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Persons List */}
      <div>
        <h3 class="text-lg font-semibold mb-4">
          Person Records ({persons.length})
        </h3>
        
        {loading ? (
          <div class="text-center py-8 text-gray-500">
            Loading persons...
          </div>
        ) : persons.length === 0 ? (
          <div class="text-center py-8 text-gray-500">
            No persons found. Create your first person record!
          </div>
        ) : (
          <div class="grid grid-cols-1 gap-4">
            {persons.map((person) => (
              <div
                key={person.id}
                class="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <span class="text-sm font-medium text-gray-500">Name</span>
                        <p class="text-gray-900">{person.name}</p>
                      </div>
                      <div>
                        <span class="text-sm font-medium text-gray-500">Age</span>
                        <p class="text-gray-900">{person.age} years</p>
                      </div>
                      <div>
                        <span class="text-sm font-medium text-gray-500">Status</span>
                        <span class={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          person.infected 
                            ? "bg-red-100 text-red-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {person.infected ? "Infected" : "Healthy"}
                        </span>
                      </div>
                      <div>
                        <span class="text-sm font-medium text-gray-500">Created</span>
                        <p class="text-gray-600 text-sm">
                          {new Date(person.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                      ID: {person.id}
                      {person.updatedAt !== person.createdAt && (
                        <span class="ml-4">
                          Updated: {new Date(person.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div class="flex gap-2 ml-4">
                    <button
                      type="button"
                      onClick={() => startEdit(person)}
                      class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePerson(person.id)}
                      class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
