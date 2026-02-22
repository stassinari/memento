import { createMiddleware } from "@tanstack/react-start";
import { db } from "~/db/db";
import { verifyFirebaseToken } from "~/lib/firebase-verify.server";

export const authMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    // Dynamic import so firebaseConfig is never loaded on the server
    const { auth } = await import("~/firebaseConfig");
    const token = (await auth.currentUser?.getIdToken()) ?? "";
    return next({ sendContext: { token } });
  })
  .server(async ({ context, next }) => {
    if (!context.token) throw new Error("Unauthorized: missing token");

    const { uid } = await verifyFirebaseToken(context.token);

    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.fbId, uid),
    });

    if (!user) throw new Error("Unauthorized: user not found");

    return next({ context: { userId: user.id } });
  });
