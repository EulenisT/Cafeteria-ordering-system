export type SandwichesResponse = {
  code: string;
  nom: string;
  disponible: boolean;
  prix: number;
};

export type GarnitureResponse = {
  code: string;
  nom: string;
  disponible: boolean;
  prix: number;
};

export type UserResponse = {
  username: string;
  email: string;
  solde: number;
};

export type SaucesResponse = {
  code: string;
  nom: string;
  disponible: boolean;
  prix: number;
};

export type LigneCmdResponse = {
  num: number;
  nomSandwich: string;
  description: string | null;
  prix: number;
};

export type CommandeResponse = {
  num: number;
  date: string;
  sessionNom: string;
  user: UserResponse;
  lignes: LigneCmdResponse[];
};

export type SessionResponse = {
  num: number;
  active: boolean;
  heure_cloture: number;
  nom: string;
  etat: string;
};
