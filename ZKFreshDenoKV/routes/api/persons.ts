/// <reference lib="deno.unstable" />
import { Handlers } from "$fresh/server.ts";

export interface Person {
  id: string;
  name: string;
  age: number;
  infected: boolean;
  createdAt: string;
  updatedAt: string;
}

const kv = await Deno.openKv();

export const handler: Handlers = {
  // GET /api/persons - Get all persons or a specific person by ID
  async GET(req) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    try {
      if (id) {
        // Get a specific person by ID
        const entry = await kv.get(["persons", id]);
        if (!entry.value) {
          return new Response(
            JSON.stringify({ error: "Person not found" }),
            { 
              status: 404, 
              headers: { "content-type": "application/json" } 
            }
          );
        }
        return new Response(JSON.stringify(entry.value), {
          headers: { "content-type": "application/json" },
        });
      } else {
        // Get all persons
        const persons: Person[] = [];
        const iter = kv.list<Person>({ prefix: ["persons"] });
        for await (const entry of iter) {
          persons.push(entry.value);
        }
        
        // Sort by createdAt (most recent first)
        persons.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        return new Response(JSON.stringify(persons), {
          headers: { "content-type": "application/json" },
        });
      }
    } catch (error) {
      console.error("GET error:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { 
          status: 500, 
          headers: { "content-type": "application/json" } 
        }
      );
    }
  },

  // POST /api/persons - Create a new person
  async POST(req) {
    try {
      const body = await req.json();
      
      // Validate required fields
      if (!body.name || typeof body.name !== "string") {
        return new Response(
          JSON.stringify({ error: "Name is required and must be a string" }),
          { 
            status: 400, 
            headers: { "content-type": "application/json" } 
          }
        );
      }
      
      if (!body.age || typeof body.age !== "number" || body.age < 0) {
        return new Response(
          JSON.stringify({ error: "Age is required and must be a positive number" }),
          { 
            status: 400, 
            headers: { "content-type": "application/json" } 
          }
        );
      }
      
      if (typeof body.infected !== "boolean") {
        return new Response(
          JSON.stringify({ error: "Infected status is required and must be a boolean" }),
          { 
            status: 400, 
            headers: { "content-type": "application/json" } 
          }
        );
      }

      // Create new person with auto-generated ID
      const person: Person = {
        id: crypto.randomUUID(),
        name: body.name.trim(),
        age: body.age,
        infected: body.infected,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store in Deno KV
      const result = await kv.set(["persons", person.id], person);
      
      if (result.ok) {
        return new Response(JSON.stringify(person), {
          status: 201,
          headers: { "content-type": "application/json" },
        });
      } else {
        throw new Error("Failed to save person");
      }
    } catch (error) {
      console.error("POST error:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { 
          status: 500, 
          headers: { "content-type": "application/json" } 
        }
      );
    }
  },

  // PUT /api/persons - Update an existing person
  async PUT(req) {
    try {
      const body = await req.json();
      
      if (!body.id) {
        return new Response(
          JSON.stringify({ error: "ID is required for updates" }),
          { 
            status: 400, 
            headers: { "content-type": "application/json" } 
          }
        );
      }

      // Get existing person
      const existingEntry = await kv.get(["persons", body.id]);
      if (!existingEntry.value) {
        return new Response(
          JSON.stringify({ error: "Person not found" }),
          { 
            status: 404, 
            headers: { "content-type": "application/json" } 
          }
        );
      }

      const existingPerson = existingEntry.value as Person;

      // Validate and update fields
      const updatedPerson: Person = {
        ...existingPerson,
        updatedAt: new Date().toISOString(),
      };

      if (body.name !== undefined) {
        if (typeof body.name !== "string" || body.name.trim() === "") {
          return new Response(
            JSON.stringify({ error: "Name must be a non-empty string" }),
            { 
              status: 400, 
              headers: { "content-type": "application/json" } 
            }
          );
        }
        updatedPerson.name = body.name.trim();
      }

      if (body.age !== undefined) {
        if (typeof body.age !== "number" || body.age < 0) {
          return new Response(
            JSON.stringify({ error: "Age must be a positive number" }),
            { 
              status: 400, 
              headers: { "content-type": "application/json" } 
            }
          );
        }
        updatedPerson.age = body.age;
      }

      if (body.infected !== undefined) {
        if (typeof body.infected !== "boolean") {
          return new Response(
            JSON.stringify({ error: "Infected status must be a boolean" }),
            { 
              status: 400, 
              headers: { "content-type": "application/json" } 
            }
          );
        }
        updatedPerson.infected = body.infected;
      }

      // Update with atomic operation to prevent race conditions
      const result = await kv.atomic()
        .check(existingEntry)
        .set(["persons", body.id], updatedPerson)
        .commit();

      if (result.ok) {
        return new Response(JSON.stringify(updatedPerson), {
          headers: { "content-type": "application/json" },
        });
      } else {
        return new Response(
          JSON.stringify({ error: "Update failed - person may have been modified by another request" }),
          { 
            status: 409, 
            headers: { "content-type": "application/json" } 
          }
        );
      }
    } catch (error) {
      console.error("PUT error:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { 
          status: 500, 
          headers: { "content-type": "application/json" } 
        }
      );
    }
  },

  // DELETE /api/persons - Delete a person by ID
  async DELETE(req) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID parameter is required" }),
        { 
          status: 400, 
          headers: { "content-type": "application/json" } 
        }
      );
    }

    try {
      // Check if person exists before deleting
      const existingEntry = await kv.get(["persons", id]);
      if (!existingEntry.value) {
        return new Response(
          JSON.stringify({ error: "Person not found" }),
          { 
            status: 404, 
            headers: { "content-type": "application/json" } 
          }
        );
      }

      // Delete the person
      await kv.delete(["persons", id]);

      return new Response(
        JSON.stringify({ message: "Person deleted successfully", id }),
        {
          headers: { "content-type": "application/json" },
        }
      );
    } catch (error) {
      console.error("DELETE error:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { 
          status: 500, 
          headers: { "content-type": "application/json" } 
        }
      );
    }
  },
};
