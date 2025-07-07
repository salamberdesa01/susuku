import React from 'react';
import { MilkingRecord } from '../types';

interface RecordTableProps {
  records: MilkingRecord[];
  onDeleteRecord: (id: number) => void;
}

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);


const RecordTable: React.FC<RecordTableProps> = ({ records, onDeleteRecord }) => {
  if (records.length === 0) {
    return <p className="text-center text-slate-400 mt-4">Belum ada data yang dicatat.</p>;
  }

  const formatDate = (dateString: string) => {
    // Tambahkan 'T00:00:00' untuk memastikan parsing zona waktu konsisten
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-700/50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Tanggal Produksi</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Nama Petugas</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Pagi (L)</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Sore (L)</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Total Harian</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Pos Penampungan</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Hapus</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-slate-800 divide-y divide-slate-700">
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-slate-700/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{formatDate(record.productionDate)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{record.farmerName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{record.morningYield.toFixed(1)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{record.eveningYield.toFixed(1)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-cyan-400">
                {(record.morningYield + record.eveningYield).toFixed(1)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{record.collectionPostName || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => onDeleteRecord(record.id)} 
                  className="text-red-500 hover:text-red-400 transition"
                  aria-label={`Hapus catatan untuk ${record.farmerName} tanggal ${record.productionDate}`}
                >
                  <TrashIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecordTable;