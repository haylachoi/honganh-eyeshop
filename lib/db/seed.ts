import { cwd } from "process";
import { loadEnvConfig } from "@next/env";
import { connectToDatabase } from ".";
import User from "./model/user.model";
import { generateSalt, hashPassword } from "../utils";
import Tag from "./model/tag.model";

loadEnvConfig(cwd());

const main = async () => {
  try {
    await connectToDatabase(process.env.MONGODB_URI);

    await Tag.create({
      name: "deal-hot",
    });

    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const phone = process.env.ADMIN_PHONE;
    const password = process.env.ADMIN_PASSWORD ?? "123456";

    const salt = generateSalt();
    await User.create({
      name,
      email,
      phone,
      password: await hashPassword({
        password,
        salt,
      }),
      salt,
      role: "admin",
      isVerified: true,
      isLocked: false,
      provider: "credentials",
    });

    process.exit(0);
  } catch (error) {
    console.error(error);
    console.log("Seed failed");
  }
};

main();
