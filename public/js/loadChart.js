import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js';

window.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('/.netlify/functions/get-clicks');
  const data = await res.json();

  const botDateCounts = {};

  for (const botId in data) {
    const timestamps = data[botId];
    if (!Array.isArray(timestamps)) continue;

    timestamps.forEach(ts => {
      const date = ts.split('T')[0];
      botDateCounts[botId] = botDateCounts[botId] || {};
      botDateCounts[botId][date] = (botDateCounts[botId][date] || 0) + 1;
    });
  }

  const allDates = Array.from(
    new Set(Object.values(botDateCounts).flatMap(obj => Object.keys(obj)))
  ).sort();

  const colors = [
    'rgba(236, 72, 153, 1)',
    'rgba(59, 130, 246, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(251, 191, 36, 1)',
  ];

  const datasets = Object.entries(botDateCounts).map(([botId, counts], i) => ({
    label: botId,
    data: allDates.map(date => counts[date] || 0),
    borderColor: colors[i % colors.length],
    backgroundColor: colors[i % colors.length],
    fill: false,
    tension: 0.3,
  }));

  new Chart(document.getElementById('clickChart'), {
    type: 'line',
    data: {
      labels: allDates,
      datasets,
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Clicks per Day by Bot',
        },
        legend: {
          display: true,
          position: 'bottom',
        },
      },
    },
  });
});
