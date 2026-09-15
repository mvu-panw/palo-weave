const AUTH_STORAGE_KEY = "intranetAuth";

// SHA-256 hex digest of the shared password. To rotate, compute a new digest in
// a browser console with:
//   crypto.subtle.digest("SHA-256", new TextEncoder().encode("<new password>"))
//     .then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, "0")).join("")))
// then replace the value below. This is a client-side deterrent, not real
// security — the hash (and this check) is visible via view-source.
const PASSWORD_HASH = "2f6e3ab82f8e4ce5202f427fa35ad39a843e64dfc236d6ec06352e5afb0b2e7f";

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function checkPassword(candidate) {
  const hash = await sha256Hex(candidate.trim());
  return hash === PASSWORD_HASH;
}

function setAuthenticated() {
  localStorage.setItem(AUTH_STORAGE_KEY, "1");
}

function isAuthenticated() {
  return localStorage.getItem(AUTH_STORAGE_KEY) === "1";
}

function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.location.href = "index.html";
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = "index.html";
  }
}
