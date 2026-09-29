import { ExerciseItem } from '../types/spreadsheet';

export const EXERCISES: ExerciseItem[] = [
  {
    id: 1,
    title: 'Latihan 1: Penjumlahan Dasar (SUM)',
    category: 'Dasar',
    difficulty: 'Pemula',
    instruction: 'Gunakan fungsi SUM pada sel B6 untuk menghitung total penjualan seluruh produk (Laptop, Mouse, Keyboard, dan Monitor).',
    targetCells: ['B6'],
    expectedFormulaKeywords: ['SUM'],
    hint: 'Ketik rumus =SUM(B2:B5) pada sel B6 lalu tekan Enter.',
    solutionFormula: '=SUM(B2:B5)',
    solutionExplanation: 'Fungsi SUM(B2:B5) menjumlahkan seluruh angka dari baris 2 hingga 5 pada kolom B: 15.000.000 + 250.000 + 500.000 + 2.000.000 = 17.750.000.',
    initialSheetData: [
      { r: 0, c: 0, v: 'Produk', style: { bold: true } },
      { r: 0, c: 1, v: 'Total Terjual (Rp)', style: { bold: true, align: 'right' } },
      { r: 1, c: 0, v: 'Laptop ASUS' },
      { r: 1, c: 1, v: 15000000, style: { format: 'currency' } },
      { r: 2, c: 0, v: 'Mouse Logitech' },
      { r: 2, c: 1, v: 250000, style: { format: 'currency' } },
      { r: 3, c: 0, v: 'Keyboard Mechanical' },
      { r: 3, c: 1, v: 500000, style: { format: 'currency' } },
      { r: 4, c: 0, v: 'Monitor LED 24"' },
      { r: 4, c: 1, v: 2000000, style: { format: 'currency' } },
      { r: 5, c: 0, v: 'TOTAL PENJUALAN', style: { bold: true } },
      { r: 5, c: 1, v: '', style: { bold: true, format: 'currency', borderTop: true } },
    ],
    validate: (getVal, getFormula) => {
      const val = getVal(5, 1);
      const formula = getFormula(5, 1);
      if (val === 17750000) {
        return {
          isCorrect: true,
          feedback: '🎉 Sempurna! Total penjualan 17.750.000 berhasil dihitung dengan benar menggunakan rumus SUM.',
        };
      }
      if (formula && !formula.toUpperCase().includes('SUM')) {
        return {
          isCorrect: false,
          feedback: '💡 Anda belum menggunakan fungsi =SUM(...). Harap gunakan rumus =SUM(B2:B5) di sel B6.',
        };
      }
      return {
        isCorrect: false,
        feedback: `❌ Nilai pada sel B6 saat ini "${val ?? 'kosong'}". Jawaban yang diharapkan adalah 17.750.000. Cek kembali rentang sel Anda.`,
      };
    },
  },
  {
    id: 2,
    title: 'Latihan 2: Rata-Rata Nilai (AVERAGE)',
    category: 'Statistik',
    difficulty: 'Pemula',
    instruction: 'Hitung nilai rata-rata ujian siswa pada sel B6 menggunakan rumus AVERAGE.',
    targetCells: ['B6'],
    expectedFormulaKeywords: ['AVERAGE'],
    hint: 'Klik sel B6, ketik =AVERAGE(B2:B5) lalu tekan Enter.',
    solutionFormula: '=AVERAGE(B2:B5)',
    solutionExplanation: 'AVERAGE(B2:B5) menjumlahkan (85 + 90 + 78 + 92 = 345) lalu membaginya dengan 4 = 86.25.',
    initialSheetData: [
      { r: 0, c: 0, v: 'Nama Siswa', style: { bold: true } },
      { r: 0, c: 1, v: 'Nilai Ujian', style: { bold: true, align: 'right' } },
      { r: 1, c: 0, v: 'Andi Pratama' },
      { r: 1, c: 1, v: 85 },
      { r: 2, c: 0, v: 'Budi Santoso' },
      { r: 2, c: 1, v: 90 },
      { r: 3, c: 0, v: 'Citra Kirana' },
      { r: 3, c: 1, v: 78 },
      { r: 4, c: 0, v: 'Dewi Lestari' },
      { r: 4, c: 1, v: 92 },
      { r: 5, c: 0, v: 'RATA-RATA KELAS', style: { bold: true } },
      { r: 5, c: 1, v: '', style: { bold: true, borderTop: true } },
    ],
    validate: (getVal, getFormula) => {
      const val = Number(getVal(5, 1));
      const formula = getFormula(5, 1);
      if (Math.abs(val - 86.25) < 0.01) {
        return {
          isCorrect: true,
          feedback: '🎉 Luar biasa! Rata-rata nilai ujian siswa adalah 86.25.',
        };
      }
      if (formula && !formula.toUpperCase().includes('AVERAGE')) {
        return {
          isCorrect: false,
          feedback: '💡 Harap gunakan fungsi =AVERAGE(B2:B5) untuk menghitung rata-rata secara dinamis.',
        };
      }
      return {
        isCorrect: false,
        feedback: `❌ Nilai pada sel B6 saat ini "${val}". Hasil yang diharapkan adalah 86.25.`,
      };
    },
  },
  {
    id: 3,
    title: 'Latihan 3: Logika Status Kelulusan (IF)',
    category: 'Logika',
    difficulty: 'Menengah',
    instruction: 'Tentukan status kelulusan di sel C2 sampai C5. Siswa dinyatakan "LULUS" jika Nilai >= 75, jika kurang dari 75 berstatus "REMEDIAL".',
    targetCells: ['C2', 'C3', 'C4', 'C5'],
    expectedFormulaKeywords: ['IF'],
    hint: 'Pada sel C2, ketik rumus =IF(B2>=75, "LULUS", "REMEDIAL"), lalu terapkan juga untuk sel C3, C4, dan C5.',
    solutionFormula: '=IF(B2>=75, "LULUS", "REMEDIAL")',
    solutionExplanation: 'Kondisi B2>=75 menguji apakah nilai mencapai batas minimal kelulusan 75.',
    initialSheetData: [
      { r: 0, c: 0, v: 'Nama Siswa', style: { bold: true } },
      { r: 0, c: 1, v: 'Nilai Akhir', style: { bold: true, align: 'right' } },
      { r: 0, c: 2, v: 'Status', style: { bold: true, align: 'center' } },
      { r: 1, c: 0, v: 'Fajar Kurnia' },
      { r: 1, c: 1, v: 82 },
      { r: 1, c: 2, v: '' },
      { r: 2, c: 0, v: 'Gita Nirmala' },
      { r: 2, c: 1, v: 64 },
      { r: 2, c: 2, v: '' },
      { r: 3, c: 0, v: 'Hadi Wijaya' },
      { r: 3, c: 1, v: 75 },
      { r: 3, c: 2, v: '' },
      { r: 4, c: 0, v: 'Indah Pertiwi' },
      { r: 4, c: 1, v: 90 },
      { r: 4, c: 2, v: '' },
    ],
    validate: (getVal) => {
      const v2 = String(getVal(1, 2) ?? '').trim().toUpperCase();
      const v3 = String(getVal(2, 2) ?? '').trim().toUpperCase();
      const v4 = String(getVal(3, 2) ?? '').trim().toUpperCase();
      const v5 = String(getVal(4, 2) ?? '').trim().toUpperCase();

      if (v2 === 'LULUS' && v3 === 'REMEDIAL' && v4 === 'LULUS' && v5 === 'LULUS') {
        return {
          isCorrect: true,
          feedback: '🎉 Hebat sekali! Seluruh status siswa (C2:C5) telah diisi dengan logika IF yang tepat.',
        };
      }
      return {
        isCorrect: false,
        feedback: `❌ Status belum sesuai seluruhnya. Cek kembali: Fajar (82 -> LULUS), Gita (64 -> REMEDIAL), Hadi (75 -> LULUS), Indah (90 -> LULUS).`,
      };
    },
  },
  {
    id: 4,
    title: 'Latihan 4: Pencarian Harga Barang (VLOOKUP)',
    category: 'Lookup',
    difficulty: 'Menengah',
    instruction: 'Gunakan fungsi VLOOKUP pada sel F2 untuk mencari Harga Satuan barang berdasarkan Kode Barang yang ada di sel E2.',
    targetCells: ['F2'],
    expectedFormulaKeywords: ['VLOOKUP'],
    hint: 'Gunakan rumus =VLOOKUP(E2, A2:C5, 3, FALSE) pada sel F2. Kolom 3 adalah kolom Harga Satuan.',
    solutionFormula: '=VLOOKUP(E2, A2:C5, 3, FALSE)',
    solutionExplanation: 'VLOOKUP mencari nilai sel E2 ("BRG-03") pada kolom pertama rentang A2:C5, lalu mengembalikan data pada kolom ke-3 (Harga Satuan: Rp 850.000).',
    initialSheetData: [
      { r: 0, c: 0, v: 'Kode', style: { bold: true } },
      { r: 0, c: 1, v: 'Nama Produk', style: { bold: true } },
      { r: 0, c: 2, v: 'Harga Satuan', style: { bold: true, align: 'right' } },
      { r: 1, c: 0, v: 'BRG-01' },
      { r: 1, c: 1, v: 'Flashdisk 64GB' },
      { r: 1, c: 2, v: 95000, style: { format: 'currency' } },
      { r: 2, c: 0, v: 'BRG-02' },
      { r: 2, c: 1, v: 'Webcam 1080p' },
      { r: 2, c: 2, v: 420000, style: { format: 'currency' } },
      { r: 3, c: 0, v: 'BRG-03' },
      { r: 3, c: 1, v: 'Headset Gaming' },
      { r: 3, c: 2, v: 850000, style: { format: 'currency' } },
      { r: 4, c: 0, v: 'BRG-04' },
      { r: 4, c: 1, v: 'Speaker Bluetooth' },
      { r: 4, c: 2, v: 310000, style: { format: 'currency' } },
      // Lookup box
      { r: 0, c: 4, v: 'Cari Kode', style: { bold: true } },
      { r: 0, c: 5, v: 'Harga Ditemukan', style: { bold: true } },
      { r: 1, c: 4, v: 'BRG-03' },
      { r: 1, c: 5, v: '', style: { format: 'currency', bold: true } },
    ],
    validate: (getVal, getFormula) => {
      const val = Number(getVal(1, 5));
      const formula = getFormula(1, 5);
      if (val === 850000) {
        return {
          isCorrect: true,
          feedback: '🎉 Mantap! VLOOKUP berhasil menemukan harga produk BRG-03 yaitu Rp 850.000.',
        };
      }
      if (formula && !formula.toUpperCase().includes('VLOOKUP')) {
        return {
          isCorrect: false,
          feedback: '💡 Harap gunakan rumus =VLOOKUP(E2, A2:C5, 3) di sel F2.',
        };
      }
      return {
        isCorrect: false,
        feedback: `❌ Nilai pada sel F2 adalah "${val}". Nilai yang tepat untuk BRG-03 adalah 850000.`,
      };
    },
  },
  {
    id: 5,
    title: 'Latihan 5: Frekuensi Transaksi Lunas (COUNTIF)',
    category: 'Statistik',
    difficulty: 'Menengah',
    instruction: 'Gunakan fungsi COUNTIF pada sel B7 untuk menghitung berapa banyak transaksi yang memiliki status "Lunas".',
    targetCells: ['B7'],
    expectedFormulaKeywords: ['COUNTIF'],
    hint: 'Ketik rumus =COUNTIF(B2:B6, "Lunas") pada sel B7.',
    solutionFormula: '=COUNTIF(B2:B6, "Lunas")',
    solutionExplanation: 'COUNTIF(B2:B6, "Lunas") menghitung berapa kali kata "Lunas" muncul di kolom status.',
    initialSheetData: [
      { r: 0, c: 0, v: 'ID Invoice', style: { bold: true } },
      { r: 0, c: 1, v: 'Status Pembayaran', style: { bold: true } },
      { r: 1, c: 0, v: 'INV-201' },
      { r: 1, c: 1, v: 'Lunas' },
      { r: 2, c: 0, v: 'INV-202' },
      { r: 2, c: 1, v: 'Pending' },
      { r: 3, c: 0, v: 'INV-203' },
      { r: 3, c: 1, v: 'Lunas' },
      { r: 4, c: 0, v: 'INV-204' },
      { r: 4, c: 1, v: 'Batal' },
      { r: 5, c: 0, v: 'INV-205' },
      { r: 5, c: 1, v: 'Lunas' },
      { r: 6, c: 0, v: 'Jumlah Faktur Lunas', style: { bold: true } },
      { r: 6, c: 1, v: '', style: { bold: true, borderTop: true } },
    ],
    validate: (getVal, getFormula) => {
      const val = Number(getVal(6, 1));
      const formula = getFormula(6, 1);
      if (val === 3) {
        return {
          isCorrect: true,
          feedback: '🎉 Jawaban benar! Terdapat 3 faktur dengan status "Lunas".',
        };
      }
      if (formula && !formula.toUpperCase().includes('COUNTIF')) {
        return {
          isCorrect: false,
          feedback: '💡 Harap gunakan fungsi =COUNTIF(B2:B6, "Lunas") pada sel B7.',
        };
      }
      return {
        isCorrect: false,
        feedback: `❌ Nilai pada sel B7 saat ini "${val}". Jumlah transaksi Lunas seharusnya adalah 3.`,
      };
    },
  },
  {
    id: 6,
    title: 'Latihan 6: Total Penjualan Kategori (SUMIF)',
    category: 'Dasar',
    difficulty: 'Menengah',
    instruction: 'Gunakan fungsi SUMIF pada sel E2 untuk menghitung total pendapatan khusus kategori "Elektronik".',
    targetCells: ['E2'],
    expectedFormulaKeywords: ['SUMIF'],
    hint: 'Gunakan rumus =SUMIF(B2:B6, "Elektronik", C2:C6) pada sel E2.',
    solutionFormula: '=SUMIF(B2:B6, "Elektronik", C2:C6)',
    solutionExplanation: 'SUMIF menguji kolom B jika bernilai "Elektronik", lalu menjumlahkan nominal pada kolom C (Laptop: 12.000.000 + TV: 4.500.000 = 16.500.000).',
    initialSheetData: [
      { r: 0, c: 0, v: 'Nama Produk', style: { bold: true } },
      { r: 0, c: 1, v: 'Kategori', style: { bold: true } },
      { r: 0, c: 2, v: 'Penjualan (Rp)', style: { bold: true, align: 'right' } },
      { r: 1, c: 0, v: 'Laptop Pro' },
      { r: 1, c: 1, v: 'Elektronik' },
      { r: 1, c: 2, v: 12000000, style: { format: 'currency' } },
      { r: 2, c: 0, v: 'Kemeja Katun' },
      { r: 2, c: 1, v: 'Fashion' },
      { r: 2, c: 2, v: 350000, style: { format: 'currency' } },
      { r: 3, c: 0, v: 'Smart TV 43"' },
      { r: 3, c: 1, v: 'Elektronik' },
      { r: 3, c: 2, v: 4500000, style: { format: 'currency' } },
      { r: 4, c: 0, v: 'Sepatu Lari' },
      { r: 4, c: 1, v: 'Fashion' },
      { r: 4, c: 2, v: 750000, style: { format: 'currency' } },
      { r: 5, c: 0, v: 'Meja Kerja' },
      { r: 5, c: 1, v: 'Furnitur' },
      { r: 5, c: 2, v: 1200000, style: { format: 'currency' } },
      // Target box
      { r: 0, c: 4, v: 'Total Elektronik (Rp)', style: { bold: true } },
      { r: 1, c: 4, v: '', style: { bold: true, format: 'currency' } },
    ],
    validate: (getVal, getFormula) => {
      const val = Number(getVal(1, 4));
      const formula = getFormula(1, 4);
      if (val === 16500000) {
        return {
          isCorrect: true,
          feedback: '🎉 Tepat sekali! Total penjualan produk kategori Elektronik adalah Rp 16.500.000.',
        };
      }
      if (formula && !formula.toUpperCase().includes('SUMIF')) {
        return {
          isCorrect: false,
          feedback: '💡 Harap gunakan rumus =SUMIF(B2:B6, "Elektronik", C2:C6).',
        };
      }
      return {
        isCorrect: false,
        feedback: `❌ Nilai pada sel E2 adalah "${val}". Total omset Elektronik yang diharapkan adalah 16.500.000.`,
      };
    },
  },
  {
    id: 7,
    title: 'Latihan 7: Analisis Nilai Tertinggi & Terendah (MAX & MIN)',
    category: 'Statistik',
    difficulty: 'Pemula',
    instruction: 'Cari Nilai Tertinggi pada sel B7 menggunakan MAX, dan Nilai Terendah pada sel B8 menggunakan MIN.',
    targetCells: ['B7', 'B8'],
    expectedFormulaKeywords: ['MAX', 'MIN'],
    hint: 'Gunakan =MAX(B2:B6) pada sel B7, dan =MIN(B2:B6) pada sel B8.',
    solutionFormula: 'B7: =MAX(B2:B6) | B8: =MIN(B2:B6)',
    solutionExplanation: 'MAX(B2:B6) mengambil angka terbesar (95), sedangkan MIN(B2:B6) mengambil angka terkecil (65).',
    initialSheetData: [
      { r: 0, c: 0, v: 'Nama Karyawan', style: { bold: true } },
      { r: 0, c: 1, v: 'Skor Kinerja', style: { bold: true, align: 'right' } },
      { r: 1, c: 0, v: 'Alamsyah' },
      { r: 1, c: 1, v: 88 },
      { r: 2, c: 0, v: 'Baskara' },
      { r: 2, c: 1, v: 95 },
      { r: 3, c: 0, v: 'Clara' },
      { r: 3, c: 1, v: 65 },
      { r: 4, c: 0, v: 'Danang' },
      { r: 4, c: 1, v: 78 },
      { r: 5, c: 0, v: 'Erlina' },
      { r: 5, c: 1, v: 92 },
      { r: 6, c: 0, v: 'SKOR TERTINGGI', style: { bold: true } },
      { r: 6, c: 1, v: '', style: { bold: true, borderTop: true } },
      { r: 7, c: 0, v: 'SKOR TERENDAH', style: { bold: true } },
      { r: 7, c: 1, v: '', style: { bold: true } },
    ],
    validate: (getVal) => {
      const maxVal = Number(getVal(6, 1));
      const minVal = Number(getVal(7, 1));
      if (maxVal === 95 && minVal === 65) {
        return {
          isCorrect: true,
          feedback: '🎉 Mantap! Skor tertinggi 95 dan terendah 65 berhasil ditentukan secara akurat.',
        };
      }
      return {
        isCorrect: false,
        feedback: `❌ Nilai belum tepat. Skor Tertinggi (B7) seharusnya 95, Skor Terendah (B8) seharusnya 65.`,
      };
    },
  },
  {
    id: 8,
    title: 'Latihan 8: Penggabungan Nama (CONCAT / &)',
    category: 'Teks',
    difficulty: 'Pemula',
    instruction: 'Gabungkan Nama Depan (kolom A) dan Nama Belakang (kolom B) dengan spasi di kolom C (sel C2:C4).',
    targetCells: ['C2', 'C3', 'C4'],
    expectedFormulaKeywords: ['CONCAT', '&'],
    hint: 'Pada sel C2, ketik =A2 & " " & B2 atau =CONCAT(A2, " ", B2), lalu terapkan untuk baris berikutnya.',
    solutionFormula: '=A2 & " " & B2',
    solutionExplanation: 'Karakter & atau rumus CONCAT menggabungkan teks dari dua sel dengan menyisipkan spasi pemisah " ".',
    initialSheetData: [
      { r: 0, c: 0, v: 'Nama Depan', style: { bold: true } },
      { r: 0, c: 1, v: 'Nama Belakang', style: { bold: true } },
      { r: 0, c: 2, v: 'Nama Lengkap', style: { bold: true } },
      { r: 1, c: 0, v: 'Rian' },
      { r: 1, c: 1, v: 'Pratama' },
      { r: 1, c: 2, v: '' },
      { r: 2, c: 0, v: 'Siti' },
      { r: 2, c: 1, v: 'Nurhaliza' },
      { r: 2, c: 2, v: '' },
      { r: 3, c: 0, v: 'Teguh' },
      { r: 3, c: 1, v: 'Santoso' },
      { r: 3, c: 2, v: '' },
    ],
    validate: (getVal) => {
      const c2 = String(getVal(1, 2) ?? '').trim();
      const c3 = String(getVal(2, 2) ?? '').trim();
      const c4 = String(getVal(3, 2) ?? '').trim();

      if (c2.toLowerCase() === 'rian pratama' && c3.toLowerCase() === 'siti nurhaliza' && c4.toLowerCase() === 'teguh santoso') {
        return {
          isCorrect: true,
          feedback: '🎉 Luar biasa! Seluruh nama lengkap telah digabungkan dengan rapi.',
        };
      }
      return {
        isCorrect: false,
        feedback: `❌ Format nama belum sesuai. Pastikan ada spasi pemisah di antara nama depan dan belakang. Contoh: "Rian Pratama".`,
      };
    },
  },
  {
    id: 9,
    title: 'Latihan 9: Perkalian & Total Belanja (* dan SUM)',
    category: 'Dasar',
    difficulty: 'Pemula',
    instruction: 'Hitung Subtotal di sel D2:D4 (Jumlah Beli * Harga Satuan), lalu hitung Grand Total pada sel D5.',
    targetCells: ['D2', 'D3', 'D4', 'D5'],
    hint: 'Di sel D2 gunakan =B2*C2, lakukan hal sama untuk D3 dan D4. Di D5 gunakan =SUM(D2:D4).',
    solutionFormula: 'Subtotal: =B2*C2 | Total: =SUM(D2:D4)',
    solutionExplanation: 'Perkalian menggunakan operator asterik (*), dan total diakumulasi dengan SUM.',
    initialSheetData: [
      { r: 0, c: 0, v: 'Item', style: { bold: true } },
      { r: 0, c: 1, v: 'Qty', style: { bold: true, align: 'right' } },
      { r: 0, c: 2, v: 'Harga (Rp)', style: { bold: true, align: 'right' } },
      { r: 0, c: 3, v: 'Subtotal (Rp)', style: { bold: true, align: 'right' } },
      { r: 1, c: 0, v: 'Kertas A4 (Rim)' },
      { r: 1, c: 1, v: 5 },
      { r: 1, c: 2, v: 45000, style: { format: 'currency' } },
      { r: 1, c: 3, v: '', style: { format: 'currency' } },
      { r: 2, c: 0, v: 'Tinta Printer Hitam' },
      { r: 2, c: 1, v: 2 },
      { r: 2, c: 2, v: 120000, style: { format: 'currency' } },
      { r: 2, c: 3, v: '', style: { format: 'currency' } },
      { r: 3, c: 0, v: 'Stapler Besar' },
      { r: 3, c: 1, v: 3 },
      { r: 3, c: 2, v: 35000, style: { format: 'currency' } },
      { r: 3, c: 3, v: '', style: { format: 'currency' } },
      { r: 4, c: 2, v: 'GRAND TOTAL', style: { bold: true } },
      { r: 4, c: 3, v: '', style: { bold: true, format: 'currency', borderTop: true } },
    ],
    validate: (getVal) => {
      const d2 = Number(getVal(1, 3));
      const d3 = Number(getVal(2, 3));
      const d4 = Number(getVal(3, 3));
      const d5 = Number(getVal(4, 3));

      if (d2 === 225000 && d3 === 240000 && d4 === 105000 && d5 === 570000) {
        return {
          isCorrect: true,
          feedback: '🎉 Hebat! Subtotal dan Grand Total Rp 570.000 terhitung secara akurat.',
        };
      }
      return {
        isCorrect: false,
        feedback: `❌ Perhitungan belum sesuai. D2 seharusnya 225.000, D3: 240.000, D4: 105.000, dan D5: 570.000.`,
      };
    },
  },
  {
    id: 10,
    title: 'Latihan 10: Lookup Lanjutan (INDEX & MATCH)',
    category: 'Lookup',
    difficulty: 'Lanjutan',
    instruction: 'Gunakan kombinasi rumus INDEX dan MATCH pada sel F2 untuk mencari Divisi dari karyawan yang namanya tertulis di sel E2 ("Dewi").',
    targetCells: ['F2'],
    expectedFormulaKeywords: ['INDEX', 'MATCH'],
    hint: 'Gunakan rumus =INDEX(B2:B5, MATCH(E2, A2:A5, 0)) pada sel F2.',
    solutionFormula: '=INDEX(B2:B5, MATCH(E2, A2:A5, 0))',
    solutionExplanation: 'MATCH(E2, A2:A5, 0) menemukan posisi baris ke-4 untuk nama "Dewi", lalu INDEX(B2:B5, 4) mengambil divisi di baris ke-4 yaitu "Keuangan".',
    initialSheetData: [
      { r: 0, c: 0, v: 'Nama Karyawan', style: { bold: true } },
      { r: 0, c: 1, v: 'Divisi', style: { bold: true } },
      { r: 0, c: 2, v: 'Gaji Pokok', style: { bold: true, align: 'right' } },
      { r: 1, c: 0, v: 'Agus' },
      { r: 1, c: 1, v: 'Pemasaran' },
      { r: 1, c: 2, v: 6500000, style: { format: 'currency' } },
      { r: 2, c: 0, v: 'Bambang' },
      { r: 2, c: 1, v: 'Teknologi' },
      { r: 2, c: 2, v: 9500000, style: { format: 'currency' } },
      { r: 3, c: 0, v: 'Citra' },
      { r: 3, c: 1, v: 'Operasional' },
      { r: 3, c: 2, v: 5500000, style: { format: 'currency' } },
      { r: 4, c: 0, v: 'Dewi' },
      { r: 4, c: 1, v: 'Keuangan' },
      { r: 4, c: 2, v: 8000000, style: { format: 'currency' } },
      // Lookup box
      { r: 0, c: 4, v: 'Karyawan', style: { bold: true } },
      { r: 0, c: 5, v: 'Divisi Ditemukan', style: { bold: true } },
      { r: 1, c: 4, v: 'Dewi' },
      { r: 1, c: 5, v: '', style: { bold: true } },
    ],
    validate: (getVal) => {
      const val = String(getVal(1, 5) ?? '').trim();
      if (val.toLowerCase() === 'keuangan') {
        return {
          isCorrect: true,
          feedback: '🎉 Luar biasa! Formula INDEX & MATCH berhasil menemukan divisi "Keuangan" untuk karyawan Dewi.',
        };
      }
      return {
        isCorrect: false,
        feedback: `❌ Hasil pada F2 adalah "${val}". Divisi yang diharapkan untuk Dewi adalah "Keuangan".`,
      };
    },
  },
];
