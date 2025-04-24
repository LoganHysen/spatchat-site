const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  let botId;

  try {
    const body = JSON.parse(event.body || "{}");
    botId = body.botId;
    if (!botId) throw new Error("Missing botId");
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body or missing botId" }),
    };
  }

  const filePath = path.join(__dirname, "click-data.json");

  let data = {};
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      data = JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to read data file:", err);
  }

  // Append timestamp to bot's array
  const timestamp = new Date().toISOString();
  if (!Array.isArray(data[botId])) {
    data[botId] = [];
  }
  data[botId].push(timestamp);

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to write data file:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to write data file" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, count: data[botId].length }),
  };
};
