import { cwd } from "process";
import { loadEnvConfig } from "@next/env";
import { connectToDatabase } from ".";
import User from "./model/user.model";
import { generateSalt, hashPassword } from "../utils";

loadEnvConfig(cwd());

const main = async () => {
  try {
    await connectToDatabase(process.env.MONGODB_URI);

    const salt = generateSalt();
    await User.create({
      name: "Nguyễn Văn Nhật",
      email: "lala@gmail.com",
      phone: "1234567890",
      password: await hashPassword({
        password: "123",
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
