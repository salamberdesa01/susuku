import React, { useState, useMemo } from 'react';
import { MilkingRecord, Farmer } from '../types';

interface ExportButtonsProps {
  records: MilkingRecord[];
  farmers: Farmer[];
  summary: {
    totalMilk: number;
    totalRecords: number;
    averageYield: number;
  };
}

const ExcelIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm2 2v2h12V5H4zm0 4v2h12V9H4zm0 4v2h12v-2H4z" />
    </svg>
);

const PdfIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6zm3 3a1 1 0 00-1 1v2a1 1 0 102 0V8a1 1 0 00-1-1zm0 4a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11zm2 0a1 1 0 100 2h.01a1 1 0 100-2H13zM9 14a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11z" clipRule="evenodd" />
    </svg>
);


const ExportButtons: React.FC<ExportButtonsProps> = ({ records, farmers }) => {
    const [selectedFarmerId, setSelectedFarmerId] = useState<string>('');

    const filteredRecords = useMemo(() => {
        if (!selectedFarmerId) {
            return records;
        }
        return records.filter(
            (record) => record.farmerId === parseInt(selectedFarmerId, 10)
        );
    }, [records, selectedFarmerId]);
    
    const filteredSummary = useMemo(() => {
        const totalMilk = filteredRecords.reduce((sum, record) => sum + record.morningYield + record.eveningYield, 0);
        const totalRecords = filteredRecords.length;
        const averageYield = totalRecords > 0 ? totalMilk / totalRecords : 0;
        return { totalMilk, totalRecords, averageYield };
    }, [filteredRecords]);


    const formatDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('id-ID');
    };

    const handleExportExcel = () => {
        const XLSX = (window as any).XLSX;
        if (!XLSX || filteredRecords.length === 0) {
            alert("Tidak ada data untuk diekspor atau library belum siap.");
            return;
        }

        const dataToExport = filteredRecords.map(rec => ({
            'Tanggal Produksi': formatDate(rec.productionDate),
            'Nama Peternak': rec.farmerName,
            'Susu Pagi (Liter)': rec.morningYield,
            'Susu Sore (Liter)': rec.eveningYield,
            'Total Harian (Liter)': rec.morningYield + rec.eveningYield,
            'Pos Penampungan': rec.collectionPostName || '-',
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
          for (let C = 2; C <= 4; ++C) { // Kolom C, D, E
            const cell_address = {c:C, r:R};
            const cell_ref = XLSX.utils.encode_cell(cell_address);
            if(worksheet[cell_ref]) worksheet[cell_ref].z = '0.0';
          }
        }
        
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Catatan Susu');

        const headers = dataToExport.length > 0 ? Object.keys(dataToExport[0]) : [];
        const maxWidths = headers.map(header => header.length);

        dataToExport.forEach(row => {
            Object.values(row).forEach((cell, i) => {
                const cellLength = (cell || '').toString().length;
                if (cellLength > maxWidths[i]) {
                    maxWidths[i] = cellLength;
                }
            });
        });
        worksheet["!cols"] = maxWidths.map(wch => ({ wch: wch + 2 }));
        
        const selectedFarmer = farmers.find(f => f.id === parseInt(selectedFarmerId, 10));
        const fileName = selectedFarmer 
            ? `laporan-susu-${selectedFarmer.name.replace(/\s+/g, '_')}.xlsx` 
            : 'laporan-susu-semua-peternak.xlsx';

        XLSX.writeFile(workbook, fileName);
    };

    const handleExportPdf = () => {
        const { jsPDF } = (window as any).jspdf;
        if (!jsPDF || filteredRecords.length === 0) {
            alert("Tidak ada data untuk diekspor atau library belum siap.");
            return;
        }

        const doc = new jsPDF();
        
        const selectedFarmer = farmers.find(f => f.id === parseInt(selectedFarmerId, 10));
        const reportTitle = selectedFarmer 
            ? `Laporan Produksi Susu - ${selectedFarmer.name}`
            : 'Laporan Produksi Susu (Semua Peternak)';

        doc.setFontSize(18);
        doc.text(reportTitle, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 29);

        doc.setFontSize(12);
        doc.text('Ringkasan Data (Sesuai Filter)', 14, 45);
        doc.setFontSize(10);
        doc.text(`- Total Susu Terkumpul: ${filteredSummary.totalMilk.toFixed(1)} Liter`, 14, 52);
        doc.text(`- Jumlah Catatan: ${filteredSummary.totalRecords} catatan`, 14, 58);
        doc.text(`- Rata-rata Per Catatan: ${filteredSummary.averageYield.toFixed(1)} Liter`, 14, 64);

        const tableColumn = ["Tanggal", "Nama Peternak", "Pagi (L)", "Sore (L)", "Total (L)", "Pos Penampungan"];
        const tableRows: (string | number)[][] = [];

        filteredRecords.forEach(record => {
            const recordData = [
                formatDate(record.productionDate),
                record.farmerName,
                record.morningYield.toFixed(1),
                record.eveningYield.toFixed(1),
                (record.morningYield + record.eveningYield).toFixed(1),
                record.collectionPostName || '-'
            ];
            tableRows.push(recordData);
        });

        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 75,
            theme: 'grid',
            headStyles: { fillColor: [14, 165, 233] },
        });

        const fileName = selectedFarmer 
            ? `laporan-susu-${selectedFarmer.name.replace(/\s+/g, '_')}.pdf`
            : 'laporan-susu-semua-peternak.pdf';
        doc.save(fileName);
    };

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
             <div>
                <label htmlFor="farmerFilter" className="sr-only">Filter Peternak</label>
                <select
                    id="farmerFilter"
                    value={selectedFarmerId}
                    onChange={(e) => setSelectedFarmerId(e.target.value)}
                    className="w-full sm:w-auto bg-slate-700 border border-slate-600 rounded-md px-3 py-2 h-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                >
                    <option value="">Semua Peternak</option>
                    {farmers.map(farmer => (
                        <option key={farmer.id} value={farmer.id}>{farmer.name}</option>
                    ))}
                </select>
            </div>
            <button
                onClick={handleExportExcel}
                disabled={filteredRecords.length === 0}
                className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
                <ExcelIcon />
                <span>Export Excel</span>
            </button>
            <button
                onClick={handleExportPdf}
                disabled={filteredRecords.length === 0}
                className="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
                <PdfIcon />
                <span>Download PDF</span>
            </button>
        </div>
    );
};

export default ExportButtons;