import cron from "node-cron";
import "dotenv/config";

const secret = process.env.JOB_SECRET;

// Cron job sẽ chạy mỗi phút
cron.schedule("* * * * *", async () => {
  try {
    const response = await fetch("http://localhost:3000/api/dashboard", {
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
    const response = await fetch("http://localhost:3000/api/dashboard", {
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

cron.schedule("0 2 * * *", async () => {
  try {
    const response = await fetch("http://localhost:3000/api/dashboard", {
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

cron.schedule("0 3 1 * *", async () => {
  try {
    const response = await fetch("http://localhost:3000/api/dashboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobName: "monthly",
        secret,
      }),
    });
    const data = await response.json();
    console.log("Dashboard updated:", data.message);
  } catch (error) {
    console.error("Error calling API:", error);
  }
});

cron.schedule("0 1 * * *", async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/account/clean-unverified-account",
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
