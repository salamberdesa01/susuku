
export interface Farmer {
  id: number;
  name: string;
}

export interface CollectionPost {
  id: number;
  name: string;
}

export interface MilkingRecord {
  id: number;
  farmerId: number;
  farmerName: string; // Derived from a JOIN with farmers table
  productionDate: string; // Stored as YYYY-MM-DD
  morningYield: number;
  eveningYield: number;
  collectionPostId?: number | null; // Optional foreign key
  collectionPostName?: string | null; // Derived from a LEFT JOIN
}