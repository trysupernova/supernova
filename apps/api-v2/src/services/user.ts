import jwt from "jsonwebtoken";
import config from "../config";
import { prisma } from "../db";

// create another access token with the sub as the user ID
export function createUserAccessToken(userId: string) {
  const jwtAccessToken = jwt.sign({ sub: userId }, config.JWT_SECRET);
  return jwtAccessToken;
}

export async function upsertUser(user: { email: string; displayName: string }) {
  const upsertedUser = await prisma.user.upsert({
    where: {
      email: user.email,
    },
    update: {
      name: user.displayName,
    },
    create: {
      email: user.email,
      name: user.displayName,
    },
  });

  return upsertedUser;
}
