import React, { useState } from 'react';
import { MilkingRecord, Farmer, CollectionPost } from '../types';

interface AddRecordFormProps {
  onAddRecord: (record: Omit<MilkingRecord, 'id' | 'farmerName' | 'collectionPostName'>) => void;
  farmers: Farmer[];
  collectionPosts: CollectionPost[];
}

const AddRecordForm: React.FC<AddRecordFormProps> = ({ onAddRecord, farmers, collectionPosts }) => {
  const [farmerId, setFarmerId] = useState('');
  const [productionDate, setProductionDate] = useState(new Date().toISOString().split('T')[0]);
  const [morningYield, setMorningYield] = useState('');
  const [eveningYield, setEveningYield] = useState('');
  const [collectionPostId, setCollectionPostId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerId || !productionDate || !morningYield || !eveningYield) {
      setError('Kolom peternak, tanggal, dan liter susu wajib diisi.');
      return;
    }
    const morning = parseFloat(morningYield);
    const evening = parseFloat(eveningYield);

    if (isNaN(morning) || isNaN(evening) || morning < 0 || evening < 0) {
      setError('Liter susu harus berupa angka positif.');
      return;
    }
    
    setError('');
    onAddRecord({
      farmerId: parseInt(farmerId, 10),
      productionDate,
      morningYield: morning,
      eveningYield: evening,
      collectionPostId: collectionPostId ? parseInt(collectionPostId, 10) : null,
    });
    
    setMorningYield('');
    setEveningYield('');
    // Do not reset farmerId and date for easier consecutive entries
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="farmerId" className="block text-sm font-medium text-slate-300 mb-1">Nama Peternak</label>
        <select
          id="farmerId"
          value={farmerId}
          onChange={(e) => setFarmerId(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
        >
          <option value="" disabled>Pilih Peternak</option>
          {farmers.map(farmer => (
            <option key={farmer.id} value={farmer.id}>{farmer.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="productionDate" className="block text-sm font-medium text-slate-300 mb-1">Tanggal Produksi</label>
        <input
            id="productionDate"
            type="date"
            value={productionDate}
            onChange={(e) => setProductionDate(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="morningYield" className="block text-sm font-medium text-slate-300 mb-1">Pagi (Liter)</label>
          <input
            id="morningYield"
            type="number"
            step="0.1"
            value={morningYield}
            onChange={(e) => setMorningYield(e.target.value)}
            placeholder="cth: 15.5"
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
          />
        </div>
        <div>
          <label htmlFor="eveningYield" className="block text-sm font-medium text-slate-300 mb-1">Sore (Liter)</label>
          <input
            id="eveningYield"
            type="number"
            step="0.1"
            value={eveningYield}
            onChange={(e) => setEveningYield(e.target.value)}
            placeholder="cth: 12"
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
          />
        </div>
      </div>
       <div>
        <label htmlFor="collectionPostId" className="block text-sm font-medium text-slate-300 mb-1">Setor ke Pos (Opsional)</label>
        <select
          id="collectionPostId"
          value={collectionPostId}
          onChange={(e) => setCollectionPostId(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
        >
          <option value="">Tidak disetor</option>
          {collectionPosts.map(post => (
            <option key={post.id} value={post.id}>{post.name}</option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button 
        type="submit" 
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        Tambah Catatan
      </button>
    </form>
  );
};

export default AddRecordForm;