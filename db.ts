import { supabase } from './supabaseClient';
import { MilkingRecord, Farmer, CollectionPost } from './types';

// --- Fungsi Petugas (Farmers) ---
export const getFarmers = async (): Promise<Farmer[]> => {
    const { data, error } = await supabase
        .from('farmers')
        .select('id, name')
        .order('name', { ascending: true });
    
    if (error) {
        console.error("Error fetching farmers:", error);
        throw error;
    }
    return data || [];
};

export const addFarmer = async (name: string): Promise<void> => {
    const { error } = await supabase
        .from('farmers')
        .insert({ name });

    if (error) {
        console.error("Error adding farmer:", error);
        // Melempar error agar bisa ditangkap di komponen dan menampilkan feedback ke user
        throw error;
    }
};

// --- Fungsi Pos Penampungan (Collection Posts) ---
export const getCollectionPosts = async (): Promise<CollectionPost[]> => {
    const { data, error } = await supabase
        .from('collection_posts')
        .select('id, name')
        .order('name', { ascending: true });

    if (error) {
        console.error("Error fetching collection posts:", error);
        throw error;
    }
    return data || [];
};

export const addCollectionPost = async (name: string): Promise<void> => {
    const { error } = await supabase
        .from('collection_posts')
        .insert({ name });

    if (error) {
        console.error("Error adding collection post:", error);
        throw error;
    }
};


// --- Fungsi Catatan (Records) ---
export const getRecords = async (): Promise<MilkingRecord[]> => {
    // Mengambil data dari 'records' dan menggabungkannya dengan data dari 'farmers' dan 'collection_posts'
    const { data, error } = await supabase
        .from('records')
        .select(`
            id,
            farmer_id,
            production_date,
            morning_yield,
            evening_yield,
            collection_post_id,
            farmers ( name ),
            collection_posts ( name )
        `)
        .order('production_date', { ascending: false })
        .order('id', { ascending: false });

    if (error) {
        console.error("Error fetching records:", error);
        throw error;
    }
    if (!data) return [];

    // Memetakan data dari format Supabase (snake_case, nested objects) ke format aplikasi (camelCase, flat object)
    return data.map((record: any) => ({
        id: record.id,
        farmerId: record.farmer_id,
        farmerName: record.farmers?.name || 'Petugas tidak ditemukan',
        productionDate: record.production_date,
        morningYield: record.morning_yield,
        eveningYield: record.evening_yield,
        collectionPostId: record.collection_post_id,
        collectionPostName: record.collection_posts?.name || null,
    }));
};

export const addRecord = async (record: Omit<MilkingRecord, 'id' | 'farmerName' | 'collectionPostName'>): Promise<void> => {
    // Memetakan properti camelCase dari aplikasi ke kolom snake_case di database
    const { error } = await supabase.from('records').insert({
        farmer_id: record.farmerId,
        production_date: record.productionDate,
        morning_yield: record.morningYield,
        evening_yield: record.eveningYield,
        collection_post_id: record.collectionPostId || null,
    });

    if (error) {
        console.error("Error adding record:", error);
        throw error;
    }
};

export const deleteRecord = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('records')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Error deleting record:", error);
        throw error;
    }
};
