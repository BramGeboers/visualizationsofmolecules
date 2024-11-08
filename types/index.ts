import { UUID } from "crypto";

export interface Plant {
  id: number|undefined;
  plantModel: PlantModel;
  name: string;
  species?: string;
  owner: User;
  lastWatered: number;
  currentMoistureLevel: number;
  wateringInterval: number;
  waterNeed: number;
  idealMoisture: number;
  worstMoisture: number;
  xp: number;
  filelink: string;
  temperature: number;
  lightLevel: number;
  autoPilot: boolean;
  deviceId: string;
}

export interface PlantModel {
  id?: number;
  modelLink: string;
  rotation: number;
  scale: number;
  x: number;
  y: number;
  z: number;
}

export interface User {
  userId: number;
  username: string;
  email: string;
  password: string;
  role: "MEMBER" | "ADMIN";
  locked?: boolean;
  enabled?: boolean;
  accountNonLocked?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  token: string;
  role: "MEMBER" | "ADMIN";
  id: number;
}

export type ErrorResponse = {
  status: number;
  errorMessage: string;
};

export type StatusMessage = {
  type: string;
  message: string;
  color?: string;
};
