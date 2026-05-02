import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    tier: string;
    sessionId?: string;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      tier?: string;
      image?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    tier?: string;
    sessionId?: string;
  }
}
