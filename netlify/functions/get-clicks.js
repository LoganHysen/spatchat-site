const fs = require("fs");
const path = require("path");

exports.handler = async () => {
  const filePath = path.join(__dirname, "click-data.json");

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const all = JSON.parse(raw);

    return {
      statusCode: 200,
      body: JSON.stringify(all),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to read data" }),
    };
  }
};
