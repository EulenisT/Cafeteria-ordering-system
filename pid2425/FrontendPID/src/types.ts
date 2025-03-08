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
  type: string;
  nomSandwich: string;
  description: string | null;
  prix: number;
  qt: number;
};

export type CommandeResponse = {
  num: number;
  date: string;
  lignes: LigneCmdResponse[];
};

export type SessionResponse = {
  num: number;
  active: boolean;
  heure_clture: number;
  heure_ouverture: number;
  nom: string;
};
