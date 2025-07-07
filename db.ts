import { MilkingRecord, Farmer, CollectionPost } from './types';

// Memberitahu TypeScript tentang variabel global initSqlJs dari CDN
declare const initSqlJs: (config: { locateFile: (file: string) => string }) => Promise<any>;

let db: any = null;

// Promise untuk memastikan inisialisasi selesai sebelum operasi DB lain dijalankan
const dbPromise = (async () => {
    try {
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
        });
        db = new SQL.Database();

        // Aktifkan foreign key constraint
        db.exec("PRAGMA foreign_keys = ON;");

        // Buat tabel peternak
        const createFarmersTable = `
            CREATE TABLE IF NOT EXISTS farmers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            );
        `;
        db.run(createFarmersTable);
        
        // Buat tabel pos penampungan
        const createCollectionPostsTable = `
            CREATE TABLE IF NOT EXISTS collection_posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            );
        `;
        db.run(createCollectionPostsTable);

        // Buat tabel catatan dengan foreign key ke peternak dan pos penampungan
        const createRecordsTable = `
            CREATE TABLE IF NOT EXISTS records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                farmerId INTEGER NOT NULL,
                productionDate TEXT NOT NULL,
                morningYield REAL NOT NULL,
                eveningYield REAL NOT NULL,
                collectionPostId INTEGER,
                FOREIGN KEY (farmerId) REFERENCES farmers (id) ON DELETE CASCADE,
                FOREIGN KEY (collectionPostId) REFERENCES collection_posts (id) ON DELETE SET NULL
            );
        `;
        db.run(createRecordsTable);
        
    } catch (err) {
        console.error("Inisialisasi database gagal", err);
    }
})();

const getDb = async () => {
    await dbPromise; // Tunggu inisialisasi selesai
    if (!db) throw new Error("Database tidak terinisialisasi");
    return db;
};

// --- Fungsi Peternak ---
export const getFarmers = async (): Promise<Farmer[]> => {
    const db = await getDb();
    const res = db.exec("SELECT id, name FROM farmers ORDER BY name ASC");
    if (!res || res.length === 0 || !res[0].values) return [];
    const { values } = res[0];
    return values.map((row: any[]) => ({ id: row[0], name: row[1] }));
};

export const addFarmer = async (name: string): Promise<void> => {
    const db = await getDb();
    const stmt = db.prepare("INSERT INTO farmers (name) VALUES (?)");
    try {
        stmt.run([name]);
    } catch (e) {
        console.error("Gagal menambah peternak:", e);
        throw e;
    } finally {
        stmt.free();
    }
};

// --- Fungsi Pos Penampungan ---
export const getCollectionPosts = async (): Promise<CollectionPost[]> => {
    const db = await getDb();
    const res = db.exec("SELECT id, name FROM collection_posts ORDER BY name ASC");
    if (!res || res.length === 0 || !res[0].values) return [];
    const { values } = res[0];
    return values.map((row: any[]) => ({ id: row[0], name: row[1] }));
};

export const addCollectionPost = async (name: string): Promise<void> => {
    const db = await getDb();
    const stmt = db.prepare("INSERT INTO collection_posts (name) VALUES (?)");
    try {
        stmt.run([name]);
    } catch (e) {
        console.error("Gagal menambah pos penampungan:", e);
        throw e;
    } finally {
        stmt.free();
    }
};


// --- Fungsi Catatan ---
export const getRecords = async (): Promise<MilkingRecord[]> => {
    const db = await getDb();
    const query = `
        SELECT
            r.id,
            r.farmerId,
            f.name as farmerName,
            r.productionDate,
            r.morningYield,
            r.eveningYield,
            r.collectionPostId,
            cp.name as collectionPostName
        FROM records r
        JOIN farmers f ON r.farmerId = f.id
        LEFT JOIN collection_posts cp ON r.collectionPostId = cp.id
        ORDER BY r.productionDate DESC, r.id DESC;
    `;
    const res = db.exec(query);
    if (!res || res.length === 0 || !res[0].values) return [];
    const { values } = res[0];
    return values.map((row: any[]) => ({
        id: row[0],
        farmerId: row[1],
        farmerName: row[2],
        productionDate: row[3],
        morningYield: row[4],
        eveningYield: row[5],
        collectionPostId: row[6],
        collectionPostName: row[7],
    }));
};

export const addRecord = async (record: Omit<MilkingRecord, 'id' | 'farmerName' | 'collectionPostName'>): Promise<void> => {
    const db = await getDb();
    const stmt = db.prepare("INSERT INTO records (farmerId, productionDate, morningYield, eveningYield, collectionPostId) VALUES (?, ?, ?, ?, ?)");
    stmt.run([record.farmerId, record.productionDate, record.morningYield, record.eveningYield, record.collectionPostId || null]);
    stmt.free();
};

export const deleteRecord = async (id: number): Promise<void> => {
    const db = await getDb();
    const stmt = db.prepare("DELETE FROM records WHERE id = ?");
    stmt.run([id]);
    stmt.free();
};