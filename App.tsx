import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MilkingRecord, Farmer, CollectionPost } from './types';
import Header from './components/Header';
import AddRecordForm from './components/AddRecordForm';
import RecordTable from './components/RecordTable';
import SummaryDashboard from './components/SummaryDashboard';
import MilkChart from './components/MilkChart';
import ExportButtons from './components/ExportButtons';
import ManageFarmers from './components/ManageFarmers';
import ManageCollectionPosts from './components/ManageCollectionPosts';
import BottomNavigation from './components/BottomNavigation';
import * as db from './db';

type MobileView = 'home' | 'add' | 'manage';

const App: React.FC = () => {
  const [records, setRecords] = useState<MilkingRecord[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [collectionPosts, setCollectionPosts] = useState<CollectionPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileView, setMobileView] = useState<MobileView>('home');

  const loadData = useCallback(async () => {
    try {
      const [recordsData, farmersData, postsData] = await Promise.all([
        db.getRecords(), 
        db.getFarmers(),
        db.getCollectionPosts()
      ]);
      setRecords(recordsData);
      setFarmers(farmersData);
      setCollectionPosts(postsData);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    loadData();
  }, [loadData]);

  const handleAddRecord = useCallback(async (record: Omit<MilkingRecord, 'id' | 'farmerName' | 'collectionPostName'>) => {
    await db.addRecord(record);
    await loadData();
    setMobileView('home'); // Kembali ke home setelah menambah data di mobile
  }, [loadData]);

  const handleDeleteRecord = useCallback(async (id: number) => {
    await db.deleteRecord(id);
    await loadData();
  }, [loadData]);
  
  const handleAddFarmer = useCallback(async (name: string) => {
    await db.addFarmer(name);
    await loadData();
  }, [loadData]);

  const handleAddCollectionPost = useCallback(async (name: string) => {
    await db.addCollectionPost(name);
    await loadData();
  }, [loadData]);


  const summaryStats = useMemo(() => {
    const totalMilk = records.reduce((sum, record) => sum + record.morningYield + record.eveningYield, 0);
    const totalRecords = records.length;
    const averageYield = totalRecords > 0 ? totalMilk / totalRecords : 0;
    return { totalMilk, totalRecords, averageYield };
  }, [records]);

  const chartData = useMemo(() => {
    const aggregatedData: { [key: string]: number } = {};
    records.forEach(record => {
      const totalYield = record.morningYield + record.eveningYield;
      if (aggregatedData[record.farmerName]) {
        aggregatedData[record.farmerName] += totalYield;
      } else {
        aggregatedData[record.farmerName] = totalYield;
      }
    });
    return Object.entries(aggregatedData).map(([name, total]) => ({ name, total }));
  }, [records]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-200 font-sans">
        <svg className="animate-spin h-10 w-10 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl">Mempersiapkan database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans pb-24 md:pb-0">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        
        {/* DESKTOP LAYOUT */}
        <div className="hidden md:block">
          <SummaryDashboard summary={summaryStats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
            <div className="lg:col-span-1 flex flex-col gap-8">
              <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
                  <h2 className="text-2xl font-bold mb-4 text-cyan-400">Tambah Catatan Baru</h2>
                  <AddRecordForm onAddRecord={handleAddRecord} farmers={farmers} collectionPosts={collectionPosts} />
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
                   <h2 className="text-2xl font-bold mb-4 text-cyan-400">Kelola Data Master</h2>
                   <div className="flex flex-col gap-6">
                      <ManageFarmers onAddFarmer={handleAddFarmer} />
                      <hr className="border-slate-700" />
                      <ManageCollectionPosts onAddCollectionPost={handleAddCollectionPost} />
                   </div>
              </div>
            </div>
            <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl shadow-lg">
               <h2 className="text-2xl font-bold mb-4 text-cyan-400">Visualisasi Produksi Susu</h2>
               <MilkChart data={chartData} />
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                <h2 className="text-2xl font-bold text-cyan-400">Daftar Catatan Produksi</h2>
                <ExportButtons records={records} summary={summaryStats} farmers={farmers} />
              </div>
              <RecordTable records={records} onDeleteRecord={handleDeleteRecord} />
          </div>
        </div>

        {/* MOBILE LAYOUT */}
        <div className="md:hidden">
          { mobileView === 'home' && (
            <div className="space-y-8">
              <SummaryDashboard summary={summaryStats} />
              <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Visualisasi Produksi Susu</h2>
                <MilkChart data={chartData} />
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                  <h2 className="text-2xl font-bold text-cyan-400">Daftar Catatan Produksi</h2>
                  <ExportButtons records={records} summary={summaryStats} farmers={farmers} />
                </div>
                <RecordTable records={records} onDeleteRecord={handleDeleteRecord} />
              </div>
            </div>
          )}
          { mobileView === 'add' && (
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Tambah Catatan Baru</h2>
                <AddRecordForm onAddRecord={handleAddRecord} farmers={farmers} collectionPosts={collectionPosts} />
            </div>
          )}
          { mobileView === 'manage' && (
            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
                 <h2 className="text-2xl font-bold mb-4 text-cyan-400">Kelola Data Master</h2>
                 <div className="flex flex-col gap-6">
                    <ManageFarmers onAddFarmer={handleAddFarmer} />
                    <hr className="border-slate-700" />
                    <ManageCollectionPosts onAddCollectionPost={handleAddCollectionPost} />
                 </div>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center p-4 mt-8 text-slate-500 hidden md:block">
        Dibuat dengan ❤️ untuk para peternak Indonesia.
      </footer>
      
      <BottomNavigation activeView={mobileView} setActiveView={setMobileView} />
    </div>
  );
};

export default App;
