export interface Login {
  email: string;
  password: string;
}

export interface Register {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface StatusMessage {
  type: string;
  message: string;
}
