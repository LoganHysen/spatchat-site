const fs = require("fs");
const path = require("path");

exports.handler = async () => {
  const filePath = path.join(__dirname, "click-data.json");

  try {
    let all = {};

    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      all = JSON.parse(raw);
    } else {
      console.warn("⚠️ click-data.json not found. Returning empty object.");
    }

    return {
      statusCode: 200,
      body: JSON.stringify(all),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (e) {
    console.error("❌ Failed to read or parse click-data.json:", e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to read data" }),
    };
  }
};
