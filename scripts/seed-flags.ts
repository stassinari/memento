import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function seedFlags() {
  console.log("Seeding feature flags...");

  await sql`
    INSERT INTO feature_flags (name, enabled, description)
    VALUES
      ('read_from_postgres', false, 'Controls whether to read data from Postgres instead of Firestore'),
      ('write_to_postgres', false, 'Enables writes to Postgres database'),
      ('write_to_firestore', true, 'Keeps Firestore writes enabled (default)')
    ON CONFLICT (name) DO UPDATE SET
      description = EXCLUDED.description
  `;

  console.log("Feature flags seeded successfully!");

  // Verify
  const flags = await sql`SELECT * FROM feature_flags ORDER BY name`;
  console.log("\nCurrent flags:");
  console.table(flags);

  await sql.end();
}

seedFlags().catch(console.error);
