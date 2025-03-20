export type UserSessionInput = {
  id: string;
  role: string;
  name: string;
  avatar?: string;
};

export type UserSessionPayload = UserSessionInput & {
  expiresAt: Date;
};
