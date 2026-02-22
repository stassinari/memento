import { createRemoteJWKSet, jwtVerify } from "jose";

const PROJECT_ID = process.env.VITE_FB_PROJECT_ID!;

const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
  ),
);

export async function verifyFirebaseToken(token: string): Promise<{ uid: string }> {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: `https://securetoken.google.com/${PROJECT_ID}`,
    audience: PROJECT_ID,
  });

  return { uid: payload.sub! };
}
