const fetch = require("node-fetch");

exports.handler = async () => {
  const binId = process.env.JSONBIN_BIN_ID;
  const apiKey = process.env.JSONBIN_API_KEY;

  const url = `https://api.jsonbin.io/v3/b/${binId}/latest`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-Master-Key": apiKey,
      },
    });

    const json = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(json.record),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch click data" }),
    };
  }
};
