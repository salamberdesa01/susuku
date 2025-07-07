
export interface Farmer {
  id: string;
  name: string;
}

export interface CollectionPost {
  id: string;
  name: string;
}

export interface MilkingRecord {
  id: string;
  farmerId: string;
  farmerName: string; // Derived from a JOIN with farmers table
  productionDate: string; // Stored as YYYY-MM-DD
  morningYield: number;
  eveningYield: number;
  collectionPostId?: string | null; // Optional foreign key
  collectionPostName?: string | null; // Derived from a LEFT JOIN
}