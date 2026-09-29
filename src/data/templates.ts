import { CellValue, CellStyle } from '../types/spreadsheet';

export interface TemplateItem {
  id: string;
  name: string;
  category: string;
  description: string;
  data: {
    r: number;
    c: number;
    v: CellValue;
    f?: string;
    style?: CellStyle;
  }[];
}

export const TEMPLATES: TemplateItem[] = [
  {
    id: 'blank',
    name: 'Lembar Kerja Kosong',
    category: 'Dasar',
    description: 'Kanvas kosong untuk eksplorasi rumus dan latihan mandiri.',
    data: [
      { r: 0, c: 0, v: 'Selamat Datang di Excel LearnHub!' },
      { r: 1, c: 0, v: 'Ketik data atau rumus dimulai tanda sama dengan (=).' },
    ],
  },
  {
    id: 'monthly_sales',
    name: 'Laporan Penjualan Toko',
    category: 'Bisnis',
    description: 'Template ringkasan penjualan produk dengan kolom Quantity, Harga, Subtotal, dan Grand Total.',
    data: [
      { r: 0, c: 0, v: 'Kode', style: { bold: true } },
      { r: 0, c: 1, v: 'Nama Produk', style: { bold: true } },
      { r: 0, c: 2, v: 'Qty', style: { bold: true, align: 'right' } },
      { r: 0, c: 3, v: 'Harga (Rp)', style: { bold: true, align: 'right' } },
      { r: 0, c: 4, v: 'Subtotal (Rp)', style: { bold: true, align: 'right' } },
      { r: 1, c: 0, v: 'PRD-01' },
      { r: 1, c: 1, v: 'Kopi Robusta 250g' },
      { r: 1, c: 2, v: 12 },
      { r: 1, c: 3, v: 45000, style: { format: 'currency' } },
      { r: 1, c: 4, v: 540000, f: '=C2*D2', style: { format: 'currency' } },
      { r: 2, c: 0, v: 'PRD-02' },
      { r: 2, c: 1, v: 'Teh Hijau Organik' },
      { r: 2, c: 2, v: 8 },
      { r: 2, c: 3, v: 35000, style: { format: 'currency' } },
      { r: 2, c: 4, v: 280000, f: '=C3*D3', style: { format: 'currency' } },
      { r: 3, c: 0, v: 'PRD-03' },
      { r: 3, c: 1, v: 'Gula Aren Cair 500ml' },
      { r: 3, c: 2, v: 15 },
      { r: 3, c: 3, v: 28000, style: { format: 'currency' } },
      { r: 3, c: 4, v: 420000, f: '=C4*D4', style: { format: 'currency' } },
      { r: 4, c: 3, v: 'TOTAL OMSET', style: { bold: true } },
      { r: 4, c: 4, v: 1240000, f: '=SUM(E2:E4)', style: { bold: true, format: 'currency', borderTop: true } },
    ],
  },
  {
    id: 'student_grades',
    name: 'Rekap Nilai Siswa',
    category: 'Pendidikan',
    description: 'Template nilai siswa lengkap dengan rata-rata, predikat nilai, dan status kelulusan.',
    data: [
      { r: 0, c: 0, v: 'Nama Siswa', style: { bold: true } },
      { r: 0, c: 1, v: 'Tugas', style: { bold: true, align: 'right' } },
      { r: 0, c: 2, v: 'UTS', style: { bold: true, align: 'right' } },
      { r: 0, c: 3, v: 'UAS', style: { bold: true, align: 'right' } },
      { r: 0, c: 4, v: 'Rata-Rata', style: { bold: true, align: 'right' } },
      { r: 0, c: 5, v: 'Status', style: { bold: true, align: 'center' } },
      { r: 1, c: 0, v: 'Aditya Pratama' },
      { r: 1, c: 1, v: 85 },
      { r: 1, c: 2, v: 80 },
      { r: 1, c: 3, v: 90 },
      { r: 1, c: 4, v: 85, f: '=AVERAGE(B2:D2)' },
      { r: 1, c: 5, v: 'LULUS', f: '=IF(E2>=75, "LULUS", "REMEDIAL")', style: { align: 'center' } },
      { r: 2, c: 0, v: 'Bunga Citra' },
      { r: 2, c: 1, v: 70 },
      { r: 2, c: 2, v: 65 },
      { r: 2, c: 3, v: 68 },
      { r: 2, c: 4, v: 67.67, f: '=AVERAGE(B3:D3)' },
      { r: 2, c: 5, v: 'REMEDIAL', f: '=IF(E3>=75, "LULUS", "REMEDIAL")', style: { align: 'center' } },
    ],
  },
];
