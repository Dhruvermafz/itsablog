const BASE_URL = "https://itsablog.in";

export default function sitemap() {
  const routes = [
    "",
    "/explore",
    "/lists",
    "/clubs",
    "/login",
    "/register",
    "/settings",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
