function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildUpdateCard(update) {
  const tag = update.link ? "a" : "div";
  const card = document.createElement(tag);
  card.className = "resource-card";
  if (update.link) {
    card.href = update.link;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
  }

  if (update.category) {
    const badge = document.createElement("span");
    badge.className = "update-card-badge";
    badge.textContent = update.category;
    card.appendChild(badge);
  }

  const date = document.createElement("time");
  date.className = "update-card-date";
  date.dateTime = update.date;
  date.textContent = formatDate(update.date);
  card.appendChild(date);

  const h3 = document.createElement("h3");
  h3.textContent = update.title;
  card.appendChild(h3);

  const p = document.createElement("p");
  p.textContent = update.description;
  card.appendChild(p);

  return card;
}

function renderUpdates() {
  const container = document.getElementById("updates-feed");
  if (!container) return;
  const sorted = [...UPDATES].sort((a, b) => b.date.localeCompare(a.date));
  sorted.forEach((update) => container.appendChild(buildUpdateCard(update)));
}

document.addEventListener("DOMContentLoaded", renderUpdates);
