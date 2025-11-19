import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { supabase } from "../config/db"; // Use the admin client for seeding

// Helper to get a random item from an array
const getRandomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// Helper to generate a random GeoJSON Point within Gauteng, South Africa
const generateGautengPoint = () => ({
  type: "Point",
  coordinates: [
    faker.location.longitude({ min: 27.8, max: 28.4 }), // Longitude for Gauteng
    faker.location.latitude({ min: -26.4, max: -25.6 }), // Latitude for Gauteng
  ],
});

async function seedDatabase() {
  try {
    console.log(
      "🚀 Starting database seeding process using Supabase client..."
    );

    // 1. Seed Achievements
    console.log("🌱 Seeding achievements...");
    const achievements = [
      {
        name: "Storm Dodger",
        description: "Successfully avoided a severe weather zone.",
        icon_url: "/icons/storm.svg",
      },
      {
        name: "Safe Detour",
        description: "Took a suggested safer route.",
        icon_url: "/icons/detour.svg",
      },
      {
        name: "Night Owl",
        description: "Completed 10 trips at night.",
        icon_url: "/icons/night.svg",
      },
      {
        name: "Road Warrior",
        description: "Completed 50 trips.",
        icon_url: "/icons/warrior.svg",
      },
    ];
    await supabase.from("achievements").delete().neq("id", 0); // Clear table
    const { data: achievementData, error: achievementError } = await supabase
      .from("achievements")
      .insert(achievements)
      .select("id");
    if (achievementError) throw achievementError;
    const achievementIds = achievementData.map((r) => r.id);
    console.log(`✅ Seeded ${achievementIds.length} achievements.`);

    // 2. Seed Users
    console.log("🌱 Seeding users...");
    await supabase.from("users").delete().neq("id", 0);
    const saltRounds = 10;
    const password = await bcrypt.hash("password123", saltRounds);
    const usersToInsert = Array.from({ length: 10 }, () => ({
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      email: faker.internet.email({ provider: "example.com" }),
      password_hash: password,
      language_preference: getRandomItem(["en", "zu", "af"]),
      points: faker.number.int({ min: 0, max: 1000 }),
      level: faker.number.int({ min: 1, max: 10 }),
    }));
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert(usersToInsert)
      .select("id");
    if (userError) throw userError;
    const userIds = userData.map((u) => u.id);
    console.log(`✅ Seeded ${userIds.length} users.`);

    // 3. Seed Vehicles
    console.log("🌱 Seeding vehicles...");
    await supabase.from("vehicles").delete().neq("id", 0);
    const vehiclesToInsert = userIds.map((userId) => ({
      user_id: userId,
      brand: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      number_plate: faker.vehicle.vrm(),
      year: faker.number.int({ min: 2010, max: 2024 }),
      vulnerabilities: { hail_sensitive: faker.datatype.boolean() },
    }));
    const { data: vehicleData, error: vehicleError } = await supabase
      .from("vehicles")
      .insert(vehiclesToInsert)
      .select("id");
    if (vehicleError) throw vehicleError;
    const vehicleIds = vehicleData.map((v) => v.id);
    console.log(`✅ Seeded ${vehicleIds.length} vehicles.`);

    // 4. Seed Trips and Alerts
    console.log("🌱 Seeding trips and alerts...");
    await supabase.from("trips").delete().neq("id", 0);
    await supabase.from("alerts").delete().neq("id", 0);
    for (const userId of userIds) {
      for (let i = 0; i < 5; i++) {
        const { data: tripData, error: tripError } = await supabase
          .from("trips")
          .insert({
            user_id: userId,
            vehicle_id: getRandomItem(vehicleIds),
            travel_risk_score: faker.number.int({ min: 1, max: 10 }),
            start_time: faker.date.recent({ days: 30 }).toISOString(),
            end_time: faker.date.recent({ days: 1 }).toISOString(),
          })
          .select("id")
          .single();
        if (tripError) throw tripError;
        const tripId = tripData.id;

        // Create an alert for some trips by calling the database function
        // This requires the 'create_alert_with_location' function to exist in your database.
        if (Math.random() > 0.5) {
          const { error: rpcError } = await supabase.rpc(
            "create_alert_with_location",
            {
              p_user_id: userId,
              p_trip_id: tripId,
              p_type: getRandomItem(["weather", "crime", "traffic"]),
              p_status: getRandomItem(["sent", "acknowledged", "dismissed"]),
              p_content: {
                hazard: "Heavy Rain",
                severity: "high",
                advice: "Drive slowly",
              },
              p_location: generateGautengPoint(),
            }
          );
          if (rpcError) throw rpcError;
        }
      }
    }
    console.log("✅ Seeded trips and alerts.");

    // 5. Seed User Achievements
    console.log("🌱 Seeding user achievements...");
    await supabase.from("user_achievements").delete().neq("user_id", 0);
    const userAchievementsToInsert: {
      user_id: string;
      achievement_id: string;
    }[] = [];
    for (const userId of userIds) {
      if (Math.random() > 0.3) {
        userAchievementsToInsert.push({
          user_id: userId,
          achievement_id: getRandomItem(achievementIds),
        });
      }
    }
    if (userAchievementsToInsert.length > 0) {
      const { error: uaError } = await supabase
        .from("user_achievements")
        .insert(userAchievementsToInsert);
      if (uaError) throw uaError;
    }
    console.log(
      `✅ Seeded ${userAchievementsToInsert.length} user achievements.`
    );

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ An error occurred during seeding:", error);
  }
}

seedDatabase();
