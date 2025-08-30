#!/usr/bin/env deno run --allow-net

// Test script for the authentication system
const BASE_URL = "http://localhost:8000";

async function testAuthSystem() {
  console.log("🔐 Testing Authentication System\n");

  try {
    // 1. Test registration
    console.log("1. Testing user registration");
    const registerData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123"
    };

    let response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ Registration successful: ${data.user.username} (${data.user.email})`);
      
      // Extract session cookie
      const setCookieHeader = response.headers.get("set-cookie");
      const sessionMatch = setCookieHeader?.match(/session=([^;]+)/);
      
      if (sessionMatch) {
        const sessionCookie = `session=${sessionMatch[1]}`;
        console.log(`   🍪 Session cookie received\n`);
        
        // 2. Test authenticated API access
        console.log("2. Testing authenticated Person API access");
        response = await fetch(`${BASE_URL}/api/persons`, {
          headers: {
            "Cookie": sessionCookie,
          },
        });
        
        if (response.ok) {
          const persons = await response.json();
          console.log(`   ✅ Person API accessible: ${persons.length} persons found\n`);
        } else {
          console.log(`   ❌ Person API access failed: ${response.status}\n`);
        }
        
        // 3. Test creating a person while authenticated
        console.log("3. Testing person creation while authenticated");
        response = await fetch(`${BASE_URL}/api/persons`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cookie": sessionCookie,
          },
          body: JSON.stringify({
            name: "Test Person",
            age: 25,
            infected: false
          }),
        });
        
        if (response.ok) {
          const person = await response.json();
          console.log(`   ✅ Person created: ${person.name} (${person.id})\n`);
        } else {
          const error = await response.json();
          console.log(`   ❌ Person creation failed: ${error.error}\n`);
        }
        
        // 4. Test logout
        console.log("4. Testing logout");
        response = await fetch(`${BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Cookie": sessionCookie,
          },
        });
        
        if (response.ok) {
          console.log(`   ✅ Logout successful\n`);
          
          // 5. Test access after logout
          console.log("5. Testing Person API access after logout");
          response = await fetch(`${BASE_URL}/api/persons`, {
            headers: {
              "Cookie": sessionCookie,
            },
          });
          
          if (response.status === 401) {
            console.log(`   ✅ Person API properly protected: ${response.status} Unauthorized\n`);
          } else {
            console.log(`   ❌ Person API should be protected: ${response.status}\n`);
          }
        } else {
          console.log(`   ❌ Logout failed: ${response.status}\n`);
        }
      }
    } else {
      const error = await response.json();
      if (error.error === "Username or email already exists") {
        console.log(`   ⚠️ User already exists, testing login instead\n`);
        
        // Test login with existing user
        console.log("Testing login with existing credentials");
        response = await fetch(`${BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usernameOrEmail: registerData.username,
            password: registerData.password
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`   ✅ Login successful: ${data.user.username}\n`);
        } else {
          const error = await response.json();
          console.log(`   ❌ Login failed: ${error.error}\n`);
        }
      } else {
        console.log(`   ❌ Registration failed: ${error.error}\n`);
      }
    }
    
    console.log("🎉 Authentication system test completed!");

  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
if (import.meta.main) {
  await testAuthSystem();
}
