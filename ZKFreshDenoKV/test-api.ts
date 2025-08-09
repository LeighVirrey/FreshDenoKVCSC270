#!/usr/bin/env deno run --allow-net

// Test script for the Person API CRUD operations
const BASE_URL = "http://localhost:8000/api/persons";

interface Person {
  id: string;
  name: string;
  age: number;
  infected: boolean;
  createdAt: string;
  updatedAt: string;
}

async function testAPI() {
  console.log("🧪 Testing Person API CRUD Operations\n");

  let testPersonId: string | null = null;

  try {
    // 1. Test GET all persons (initially empty)
    console.log("1. Testing GET /api/persons (get all)");
    let response = await fetch(BASE_URL);
    let persons = await response.json() as Person[];
    console.log(`   ✅ Status: ${response.status}`);
    console.log(`   📊 Found ${persons.length} existing person(s)\n`);

    // 2. Test POST - Create a new person
    console.log("2. Testing POST /api/persons (create person)");
    const newPerson = {
      name: "John Doe",
      age: 30,
      infected: false
    };

    response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerson),
    });

    if (response.ok) {
      const createdPerson = await response.json() as Person;
      testPersonId = createdPerson.id;
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   👤 Created person: ${createdPerson.name} (ID: ${createdPerson.id})\n`);
    } else {
      const error = await response.json();
      console.log(`   ❌ Failed to create person: ${error.error}\n`);
    }

    // 3. Test GET specific person
    if (testPersonId) {
      console.log("3. Testing GET /api/persons?id=<uuid> (get specific person)");
      response = await fetch(`${BASE_URL}?id=${testPersonId}`);
      if (response.ok) {
        const person = await response.json() as Person;
        console.log(`   ✅ Status: ${response.status}`);
        console.log(`   👤 Retrieved person: ${person.name}, age ${person.age}\n`);
      } else {
        console.log(`   ❌ Failed to retrieve person\n`);
      }
    }

    // 4. Test PUT - Update the person
    if (testPersonId) {
      console.log("4. Testing PUT /api/persons (update person)");
      const updateData = {
        id: testPersonId,
        name: "John Doe Updated",
        age: 31,
        infected: true
      };

      response = await fetch(BASE_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedPerson = await response.json() as Person;
        console.log(`   ✅ Status: ${response.status}`);
        console.log(`   🔄 Updated person: ${updatedPerson.name}, infected: ${updatedPerson.infected}\n`);
      } else {
        const error = await response.json();
        console.log(`   ❌ Failed to update person: ${error.error}\n`);
      }
    }

    // 5. Test GET all persons again (should show the updated person)
    console.log("5. Testing GET /api/persons (verify update)");
    response = await fetch(BASE_URL);
    persons = await response.json() as Person[];
    console.log(`   ✅ Status: ${response.status}`);
    console.log(`   📊 Total persons: ${persons.length}`);
    if (persons.length > 0) {
      console.log(`   👤 Latest person: ${persons[0].name}, infected: ${persons[0].infected}\n`);
    }

    // 6. Test DELETE - Remove the test person
    if (testPersonId) {
      console.log("6. Testing DELETE /api/persons?id=<uuid> (delete person)");
      response = await fetch(`${BASE_URL}?id=${testPersonId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`   ✅ Status: ${response.status}`);
        console.log(`   🗑️ ${result.message}\n`);
      } else {
        const error = await response.json();
        console.log(`   ❌ Failed to delete person: ${error.error}\n`);
      }
    }

    // 7. Final GET to confirm deletion
    console.log("7. Testing GET /api/persons (verify deletion)");
    response = await fetch(BASE_URL);
    persons = await response.json() as Person[];
    console.log(`   ✅ Status: ${response.status}`);
    console.log(`   📊 Final person count: ${persons.length}\n`);

    console.log("🎉 All CRUD operations tested successfully!");

  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
if (import.meta.main) {
  await testAPI();
}
