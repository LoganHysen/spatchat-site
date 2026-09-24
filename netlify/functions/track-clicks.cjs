const fetch = require("node-fetch");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const { JSONBIN_API_KEY, JSONBIN_BIN_ID } = process.env;

  let botId;
  try {
    const body = JSON.parse(event.body || "{}");
    botId = body.botId;
    if (!botId) throw new Error("Missing botId");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body or missing botId" }),
    };
  }

  const binUrl = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
  const headers = {
    "Content-Type": "application/json",
    "X-Master-Key": JSONBIN_API_KEY,
  };

  try {
    // Get current click data
    const res = await fetch(binUrl, { headers });
    const json = await res.json();
    const data = json.record || {};

    // Append new timestamp
    const timestamp = new Date().toISOString();
    data[botId] = data[botId] || [];
    data[botId].push(timestamp);

    // Update bin
    await fetch(binUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, count: data[botId].length }),
    };
  } catch (err) {
    console.error("❌ JSONBin error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to log click" }),
    };
  }
};
