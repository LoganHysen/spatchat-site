const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const { botId } = JSON.parse(event.body || "{}");
  if (!botId) {
    return {
      statusCode: 400,
      body: "Missing botId",
    };
  }

  const filePath = path.join(__dirname, "click-data.json");

  let data = {};
  try {
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  } catch (err) {
    console.error("Error reading file", err);
  }

  const timestamp = new Date().toISOString();
  data[botId] = data[botId] || [];
  data[botId].push(timestamp);

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing file", err);
    return { statusCode: 500, body: "Failed to write data" };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, count: data[botId].length }),
  };
};
