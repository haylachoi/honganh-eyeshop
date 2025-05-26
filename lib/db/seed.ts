import { cwd } from "process";
import { loadEnvConfig } from "@next/env";
import { connectToDatabase } from ".";
import User from "./model/user.model";
import { generateSalt, hashPassword } from "../utils";
import Tag from "./model/tag.model";
// import { randomBytes } from "crypto";

loadEnvConfig(cwd());

// const fakeCategories = [
//   {
//     name: "Kính",
//     slug: "kinh",
//     _id: "67cc44c09c2ede4550a5636a",
//   },
//   {
//     name: "Gọng kính",
//     slug: "gong-kinh",
//     _id: "67cb266b1014fc6500d1da64",
//   },
//   {
//     name: "Kinh ram",
//     slug: "kinh-ram",
//     _id: "67cb34159340d0819c0afb8f",
//   },
// ];
//
// const fakeProduct = {
//   name: "Gọng kịnh xuất khẩu",
//   nameNoAccent: "gong kinh xuat khau",
//   slug: "gong-kinh-xuat-khau",
//   category: {
//     name: "Gọng kính",
//     slug: "gong-kinh",
//     _id: "67cb266b1014fc6500d1da64",
//   },
//   attributes: [
//     {
//       name: "color",
//       value: "dfgdfgdfg",
//       displayName: "màu",
//       valueSlug: "dfgdfgdfg",
//     },
//   ],
//   brand: "brand",
//   description: "hhihi",
//   highestDiscount: 0,
//   isPublished: true,
//   isAvailable: true,
//   tags: [
//     {
//       name: "trending",
//       _id: "67d9503991d9ddf589b745a7",
//     },
//     {
//       name: "new-arrival",
//       _id: "67cc87986775dad7a0f11c56",
//     },
//   ],
//   minPrice: 900,
//   maxPrice: 1000000,
//   variants: [
//     {
//       uniqueId: "42af18e0-1318-45f0-b5d6-372678849a84",
//       attributes: [
//         {
//           name: "color",
//           value: "den",
//         },
//       ],
//       price: 1000000,
//       originPrice: 1000000,
//       countInStock: 100,
//       images: [
//         "/images/products/gong-kinh-xuat-khau_cd3420bb-f001-412f-9544-a3d00b5aa8df.webp",
//         "/images/products/ten-moi-ne_b3e065d2-c540-45d8-aeb2-c7b386f3b15f.webp",
//         "/images/products/ten-moi-ne_722cf9b5-1525-4aba-bbcf-c55c96e757ec.webp",
//         "/images/products/ten-moi-ne_cc1fca90-63bf-4ace-818b-53e39e20cb96.webp",
//       ],
//     },
//   ],
//   avgRating: 0,
//   rating: {
//     1: 0,
//     2: 0,
//     3: 0,
//     4: 0,
//     5: 0,
//   },
//   totalReviews: 0,
//   totalSales: 0,
// };
//
// function shuffleArray<T>(array: T[]): T[] {
//   const result = [...array];
//   for (let i = result.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [result[i], result[j]] = [result[j], result[i]];
//   }
//   return result;
// }
//
// const generateFakeProducts = () => {
//   const products = Array.from({ length: 500 }, () => {
//     const name = "test" + randomBytes(8).toString("hex");
//     const number = Math.floor(Math.random() * (700000 - 20000 + 1)) + 10000;
//     const attrValue = "color" + Math.floor(Math.random() * 4) + 1;
//     const attributes = [
//       {
//         name: "color",
//         value: attrValue,
//         displayName: "màu",
//         valueSlug: attrValue,
//       },
//     ];
//     const variant = {
//       ...fakeProduct.variants[0],
//       price: number,
//       images: shuffleArray(fakeProduct.variants[0].images),
//       uniqueId: crypto.randomUUID(),
//     };
//
//     return {
//       ...fakeProduct,
//       name,
//       attributes,
//       category: shuffleArray(fakeCategories)[0],
//       nameNoAccent: name,
//       variants: [variant],
//       minPrice: number,
//       maxPrice: number,
//       slug: name,
//     };
//   });
//
//   return products;
// };

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
