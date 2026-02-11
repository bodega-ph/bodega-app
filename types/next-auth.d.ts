import { DefaultSession, DefaultUser } from "next-auth";
import { SystemRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: SystemRole;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: SystemRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: SystemRole;
  }
}
