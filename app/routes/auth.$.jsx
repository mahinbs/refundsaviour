import { login } from "../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  // /auth/login must use shopify.login(), not authenticate.admin()
  if (url.pathname === "/auth/login") {
    return login(request);
  }

  const { authenticate } = await import("../shopify.server");
  await authenticate.admin(request);
  return null;
};
