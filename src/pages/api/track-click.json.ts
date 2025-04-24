import fs from 'fs';
import path from 'path';

export async function POST({ request }) {
  const { botId } = await request.json();

  const dataPath = path.resolve('./src/data/analytics.json');
  let stats = {};

  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    stats = JSON.parse(raw);
  } catch (e) {
    console.warn('No stats file found, creating one.');
  }

  // Increment count
  stats[botId] = (stats[botId] || 0) + 1;

  // Save updated stats
  fs.writeFileSync(dataPath, JSON.stringify(stats, null, 2));

  return new Response(JSON.stringify({ success: true, count: stats[botId] }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
