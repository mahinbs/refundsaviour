import { destroyAdminSession } from "../admin-auth.server";

export async function action({ request }) {
  return destroyAdminSession(request);
}

export async function loader({ request }) {
  return destroyAdminSession(request);
}
