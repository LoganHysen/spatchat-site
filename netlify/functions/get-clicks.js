const fetch = require("node-fetch");

exports.handler = async () => {
  const { JSONBIN_API_KEY, JSONBIN_BIN_ID } = process.env;

  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      headers: {
        "X-Master-Key": JSONBIN_API_KEY,
      },
    });
    const json = await res.json();
    const data = json.record || {};

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (err) {
    console.error("❌ JSONBin get error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to load click data" }),
    };
  }
};
