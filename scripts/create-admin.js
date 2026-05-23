#!/usr/bin/env node
/**
 * One-time script to create an admin account in Supabase.
 *
 * Usage:
 *   node scripts/create-admin.js <email> <password> <name> [role]
 *
 * Examples:
 *   node scripts/create-admin.js admin@example.com MySecret123 "Animesh" super_admin
 *   node scripts/create-admin.js team@example.com Pass456 "Team Member" admin
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env file.
 */

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually (no dotenv dependency needed)
try {
  const envFile = readFileSync(join(__dirname, "../.env"), "utf8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // .env not found — env vars must be set externally
}

const [,, email, password, name, role = "super_admin"] = process.argv;

if (!email || !password || !name) {
  console.error("Usage: node scripts/create-admin.js <email> <password> <name> [role]");
  console.error('Roles: "super_admin" (default) or "admin"');
  process.exit(1);
}

if (!["super_admin", "admin"].includes(role)) {
  console.error('Role must be "super_admin" or "admin"');
  process.exit(1);
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function main() {
  console.log(`Creating ${role} account for: ${email}`);

  const saltRounds = 12;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const { data, error } = await supabase
    .from("admin_users")
    .insert({
      email: email.toLowerCase().trim(),
      password_hash,
      name,
      role,
    })
    .select("id, email, name, role")
    .single();

  if (error) {
    if (error.code === "23505") {
      console.error(`Error: An admin with email "${email}" already exists.`);
    } else {
      console.error("Error creating admin:", error.message);
    }
    process.exit(1);
  }

  console.log("Admin account created successfully!");
  console.log(`  ID:    ${data.id}`);
  console.log(`  Email: ${data.email}`);
  console.log(`  Name:  ${data.name}`);
  console.log(`  Role:  ${data.role}`);
  console.log("");
  console.log(`Login at: /super-admin/login`);
}

main();
