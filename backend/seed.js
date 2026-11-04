import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/User.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    const users = [
      { name: "System Admin", email: "admin@quoteforge.in", password: "admin123", role: "admin" },
      { name: "Sales Head", email: "saleshead@quoteforge.in", password: "saleshead123", role: "sales_head" },
      { name: "Estimator", email: "estimator@quoteforge.in", password: "estimator123", role: "estimator" },
    ];

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`${u.email} already exists, skipping`);
        continue;
      }
      await User.create(u);
      console.log(`Created ${u.role}: ${u.email}`);
    }

    console.log("Seeding complete");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedUsers();
