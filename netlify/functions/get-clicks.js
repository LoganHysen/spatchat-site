const fs = require("fs");
const path = require("path");

exports.handler = async () => {
  const filePath = path.join(__dirname, "click-data.json");

  try {
    const data = fs.readFileSync(filePath, "utf8");
    const counts = JSON.parse(data);

    return {
      statusCode: 200,
      body: JSON.stringify(counts),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // in case you fetch it from anywhere
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to load click data" }),
    };
  }
};
