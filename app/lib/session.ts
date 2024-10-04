import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

interface SessionContent {
  id?: number;
}

export default async function getSession() {
  return await getIronSession<SessionContent>(cookies(), {
    cookieName: "delicious-karrot",
    password: process.env.COOKIE_PASSWORD!,
  });
}
