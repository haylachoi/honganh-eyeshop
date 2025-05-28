import cron from "node-cron";
import "dotenv/config";

const secret = process.env.JOB_SECRET;
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
console.log("BASE_URL:", BASE_URL);

// Cron job sẽ chạy mỗi phút
cron.schedule("* * * * *", async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/dashboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Đảm bảo gửi dưới dạng JSON
      },
      body: JSON.stringify({
        jobName: "daily",
        secret,
      }),
    });
    const data = await response.json();
    console.log("Dashboard updated:", data.message);
  } catch (error) {
    console.error("Error calling API:", error);
  }
});

cron.schedule("0 0 * * *", async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/dashboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobName: "last7Days",
        secret,
      }),
    });
    const data = await response.json();
    console.log("Dashboard updated:", data.message);
  } catch (error) {
    console.error("Error calling API:", error);
  }
});

// ... các job cron khác tương tự

cron.schedule("0 1 * * *", async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/account/clean-unverified-account`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret,
        }),
      },
    );
    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error("Error cleaning up unverified accounts:", error);
  }
});
