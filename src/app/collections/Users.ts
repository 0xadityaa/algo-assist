import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: {
    tokenExpiration: 7200,
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600 * 1000,
    loginWithUsername: {
        allowEmailLogin: true,
        requireEmail: false,
    }, 
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
};
