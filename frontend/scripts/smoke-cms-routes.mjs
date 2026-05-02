const port = process.env.CMS_ROUTE_TEST_PORT ?? "3000";
const baseUrl = process.env.CMS_ROUTE_TEST_BASE_URL ?? `http://localhost:${port}`;

const response = await fetch(`${baseUrl}/cms/posts`, { redirect: "manual" });
const location = response.headers.get("location") ?? "";

if (response.status !== 307 && response.status !== 308) {
  throw new Error(`Expected redirect status for anonymous /cms/posts, received ${response.status}.`);
}

if (!location.includes("/cms/login") || !location.includes("next=%2Fcms%2Fposts")) {
  throw new Error(`Unexpected redirect location: ${location}`);
}

console.log(`cms_redirect_status=${response.status}`);
console.log(`cms_redirect_location=${location}`);
