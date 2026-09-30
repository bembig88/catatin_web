// 'use client';

// import { useEffect, useState } from 'react';
// import { downloadReport, getCurrentUser } from '../../services/api';
// import { useRouter } from 'next/navigation';
// import DashboardNav from '../../components/DashboardNav';

// type User = {
//   username: string;
//   role: string;
// };


// type ReportPeriod =
//   | 'TODAY'
//   | 'WEEK'
//   | 'MONTH'
//   | 'CUSTOM';


// export default function ReportsPage() {

//   const router = useRouter();

//   const [user, setUser] = useState<User | null>(null);

//   const [period, setPeriod] =
//     useState<ReportPeriod>('TODAY');

//   const [startDate, setStartDate] =
//     useState('');

//   const [endDate, setEndDate] =
//     useState('');

//   const [loading, setLoading] =
//     useState(true);

//   const [downloadLoading, setDownloadLoading] =
//     useState<'excel' | 'pdf' | null>(null);


//   /*
//   =====================================================
//   CEK LOGIN
//   =====================================================
//   */

//   useEffect(() => {

//     async function checkLogin() {

//       try {

//         const currentUser =
//           await getCurrentUser();

//         if (!currentUser) {

//           router.replace('/login');

//           return;
//         }

//         setUser(currentUser);

//       } catch (error) {

//         console.error(
//           'Gagal memeriksa login:',
//           error
//         );

//         router.replace('/login');

//       } finally {

//         setLoading(false);

//       }

//     }

//     checkLogin();

//   }, [router]);


//   /*
//   =====================================================
//   FORMAT TANGGAL YYYY-MM-DD
//   =====================================================
//   */

//   function formatDate(date: Date) {

//     const year =
//       date.getFullYear();

//     const month =
//       String(date.getMonth() + 1)
//         .padStart(2, '0');

//     const day =
//       String(date.getDate())
//         .padStart(2, '0');

//     return `${year}-${month}-${day}`;
//   }


//   /*
//   =====================================================
//   SET PERIODE
//   =====================================================
//   */

//   function handlePeriodChange(
//     value: ReportPeriod
//   ) {

//     setPeriod(value);

//     const today = new Date();

//     const todayString =
//       formatDate(today);


//     /*
//     ============================
//     HARI INI
//     ============================
//     */

//     if (value === 'TODAY') {

//       setStartDate(todayString);
//       setEndDate(todayString);

//       return;
//     }


//     /*
//     ============================
//     7 HARI
//     ============================
//     */

//     if (value === 'WEEK') {

//       const start =
//         new Date(today);

//       start.setDate(
//         today.getDate() - 6
//       );

//       setStartDate(
//         formatDate(start)
//       );

//       setEndDate(todayString);

//       return;
//     }


//     /*
//     ============================
//     BULAN INI
//     ============================
//     */

//     if (value === 'MONTH') {

//       const start =
//         new Date(
//           today.getFullYear(),
//           today.getMonth(),
//           1
//         );

//       setStartDate(
//         formatDate(start)
//       );

//       setEndDate(todayString);

//       return;
//     }

//   }


//   /*
//   =====================================================
//   DEFAULT PERIODE
//   =====================================================
//   */

//   useEffect(() => {

//     handlePeriodChange('TODAY');

//   }, []);


//   /*
//   =====================================================
//   DOWNLOAD
//   =====================================================
//   */

//   async function handleDownload(
//     format: 'excel' | 'pdf'
//   ) {

//     if (!startDate || !endDate) {

//       alert(
//         'Tanggal mulai dan tanggal akhir harus diisi.'
//       );

//       return;
//     }


//     if (startDate > endDate) {

//       alert(
//         'Tanggal mulai tidak boleh lebih besar dari tanggal akhir.'
//       );

//       return;
//     }


//     try {

//       setDownloadLoading(format);


//       await downloadReport(
//         format,
//         startDate,
//         endDate
//       );


//     } catch (error) {

//       console.error(
//         'Download laporan gagal:',
//         error
//       );


//       if (
//         error instanceof Error &&
//         error.message === 'SESSION_EXPIRED'
//       ) {

//         router.replace('/login');

//         return;
//       }


//       alert(
//         'Gagal mengunduh laporan.'
//       );


//     } finally {

//       setDownloadLoading(null);

//     }

//   }


//   /*
//   =====================================================
//   LOADING
//   =====================================================
//   */

//   if (loading) {

//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">

//         <div className="text-gray-500">

//           Memuat laporan...

//         </div>

//       </div>
//     );

//   }


//   if (!user) {

//     return null;

//   }


//   /*
//   =====================================================
//   DASHBOARD LAPORAN
//   =====================================================
//   */

//   return (

//     <div className="min-h-screen bg-gray-50">


//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div className="bg-white border-b border-gray-200">

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">

//           <div className="flex items-center justify-between">

//             <div>

//               <h1 className="text-2xl font-bold text-gray-900">

//                 Laporan Transaksi

//               </h1>

//               <p className="text-sm text-gray-500 mt-1">

//                 Download laporan keuangan Anda

//               </p>

//             </div>


//             <button
//               onClick={() =>
//                 router.push('/dashboard')
//               }
//               className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
//             >

//               ← Kembali ke Dashboard

//             </button>

//           </div>

//         </div>

//       </div>

//       <DashboardNav />

//       {/* =================================================
//           CONTENT
//       ================================================= */}

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">


//         {/* =================================================
//             FILTER LAPORAN
//         ================================================= */}

//         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">


//           <h2 className="text-lg font-semibold text-gray-900">

//             Pilih Periode Laporan

//           </h2>


//           <p className="text-sm text-gray-500 mt-1 mb-6">

//             Tentukan periode transaksi yang ingin Anda download.

//           </p>


//           {/* PERIODE */}

//           <div className="mb-6">

//             <label className="block text-sm font-medium text-gray-700 mb-2">

//               Periode

//             </label>


//             <select
//               value={period}
//               onChange={(e) =>
//                 handlePeriodChange(
//                   e.target.value as ReportPeriod
//                 )
//               }
//               className="w-full md:w-80 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >

//               <option value="TODAY">
//                 Hari Ini
//               </option>

//               <option value="WEEK">
//                 7 Hari Terakhir
//               </option>

//               <option value="MONTH">
//                 Bulan Ini
//               </option>

//               <option value="CUSTOM">
//                 Custom
//               </option>

//             </select>

//           </div>


//           {/* TANGGAL */}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


//             {/* START DATE */}

//             <div>

//               <label className="block text-sm font-medium text-gray-700 mb-2">

//                 Tanggal Mulai

//               </label>

//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => {
//                   setStartDate(
//                     e.target.value
//                   );
//                   setPeriod('CUSTOM');
//                 }}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />

//             </div>


//             {/* END DATE */}

//             <div>

//               <label className="block text-sm font-medium text-gray-700 mb-2">

//                 Tanggal Akhir

//               </label>

//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => {
//                   setEndDate(
//                     e.target.value
//                   );
//                   setPeriod('CUSTOM');
//                 }}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />

//             </div>

//           </div>

//         </div>


//         {/* =================================================
//             DOWNLOAD
//         ================================================= */}

//         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">


//           <h2 className="text-lg font-semibold text-gray-900">

//             Download Laporan

//           </h2>


//           <p className="text-sm text-gray-500 mt-1 mb-6">

//             Laporan akan dibuat berdasarkan tanggal yang dipilih.

//           </p>


//           <div className="flex flex-col sm:flex-row gap-4">


//             {/* EXCEL */}

//             <button
//               onClick={() =>
//                 handleDownload('excel')
//               }
//               disabled={
//                 downloadLoading !== null
//               }
//               className="flex-1 sm:flex-none px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
//             >

//               {downloadLoading === 'excel'
//                 ? 'Membuat Excel...'
//                 : '↓ Download Excel'}

//             </button>


//             {/* PDF */}

//             <button
//               onClick={() =>
//                 handleDownload('pdf')
//               }
//               disabled={
//                 downloadLoading !== null
//               }
//               className="flex-1 sm:flex-none px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
//             >

//               {downloadLoading === 'pdf'
//                 ? 'Membuat PDF...'
//                 : '↓ Download PDF'}

//             </button>

//           </div>

//         </div>


//         {/* =================================================
//             INFO
//         ================================================= */}

//         <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">

//           <h3 className="font-semibold text-blue-900">

//             Informasi Laporan

//           </h3>

//           <div className="text-sm text-blue-800 mt-3 space-y-2">

//             <p>
//               • Hari Ini: transaksi hari ini.
//             </p>

//             <p>
//               • 7 Hari Terakhir: transaksi 7 hari terakhir.
//             </p>

//             <p>
//               • Bulan Ini: transaksi sejak tanggal 1 bulan berjalan.
//             </p>

//             <p>
//               • Custom: tentukan sendiri tanggal mulai dan tanggal akhir.
//             </p>

//           </div>

//         </div>


//       </main>

//     </div>

//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// import DashboardNav from '../../components/DashboardNav';

// import {
//   getCurrentUser,
//   getReportData,
//   downloadReport,
// } from '../../services/api';


// type ReportPeriod =
//   | 'TODAY'
//   | 'WEEK'
//   | 'MONTH'
//   | 'CUSTOM';


// type Transaction = {
//   id: number;
//   whatsappNumber: string;
//   type: 'IN' | 'OUT';
//   description: string;
//   amount: number;
//   createdAt: string;
// };


// type ReportData = {
//   total_pemasukan: number;
//   total_pengeluaran: number;
//   saldo_periode: number;
//   transactions: Transaction[];
// };


// export default function ReportsPage() {

//   const router = useRouter();


//   // =====================================================
//   // STATE
//   // =====================================================

//   const [period, setPeriod] =
//     useState<ReportPeriod>('TODAY');

//   const [startDate, setStartDate] =
//     useState('');

//   const [endDate, setEndDate] =
//     useState('');


//   const [reportData, setReportData] =
//     useState<ReportData>({
//       total_pemasukan: 0,
//       total_pengeluaran: 0,
//       saldo_periode: 0,
//       transactions: [],
//     });


//   const [loading, setLoading] =
//     useState(true);

//   const [downloadLoading, setDownloadLoading] =
//     useState(false);

//   const [error, setError] =
//     useState('');


//   // =====================================================
//   // FORMAT RUPIAH
//   // =====================================================

//   function formatRupiah(value: number) {

//     return new Intl.NumberFormat('id-ID', {
//       style: 'currency',
//       currency: 'IDR',
//       maximumFractionDigits: 0,
//     }).format(value);

//   }


//   // =====================================================
//   // FORMAT TANGGAL
//   // =====================================================

//   function formatTanggal(tanggal: string) {

//     if (!tanggal) {
//       return '-';
//     }

//     return new Date(tanggal).toLocaleString(
//       'id-ID',
//       {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//       }
//     );

//   }


//   // =====================================================
//   // FORMAT DATE YYYY-MM-DD
//   // =====================================================

//   function formatDate(date: Date) {

//     const year =
//       date.getFullYear();

//     const month =
//       String(date.getMonth() + 1)
//         .padStart(2, '0');

//     const day =
//       String(date.getDate())
//         .padStart(2, '0');

//     return `${year}-${month}-${day}`;

//   }


//   // =====================================================
//   // SET PERIODE
//   // =====================================================

//   function setReportPeriod(
//     selectedPeriod: ReportPeriod
//   ) {

//     setPeriod(selectedPeriod);

//     const today = new Date();

//     let start = new Date(today);
//     let end = new Date(today);


//     if (selectedPeriod === 'TODAY') {

//       start = new Date(today);
//       end = new Date(today);

//     }


//     if (selectedPeriod === 'WEEK') {

//       start = new Date(today);

//       start.setDate(
//         today.getDate() - 6
//       );

//       end = new Date(today);

//     }


//     if (selectedPeriod === 'MONTH') {

//       start = new Date(
//         today.getFullYear(),
//         today.getMonth(),
//         1
//       );

//       end = new Date(today);

//     }


//     if (selectedPeriod !== 'CUSTOM') {

//       setStartDate(
//         formatDate(start)
//       );

//       setEndDate(
//         formatDate(end)
//       );

//     }

//   }


//   // =====================================================
//   // CEK LOGIN + SET DEFAULT TODAY
//   // =====================================================

//   useEffect(() => {

//     async function initialize() {

//       try {

//         const currentUser =
//           await getCurrentUser();

//         if (!currentUser) {

//           router.replace('/login');

//           return;
//         }


//         const today =
//           formatDate(new Date());

//         setStartDate(today);
//         setEndDate(today);

//       } catch (error) {

//         console.error(
//           'Gagal mengecek login:',
//           error
//         );

//         router.replace('/login');

//       }

//     }


//     initialize();

//   }, [router]);


//   // =====================================================
//   // LOAD REPORT
//   // =====================================================

//   useEffect(() => {

//     if (!startDate || !endDate) {
//       return;
//     }


//     if (startDate > endDate) {

//       setError(
//         'Tanggal mulai tidak boleh lebih besar dari tanggal akhir.'
//       );

//       return;

//     }


//     async function loadReport() {

//       try {

//         setLoading(true);
//         setError('');


//         const data =
//           await getReportData(
//             startDate,
//             endDate
//           );


//         setReportData(data);

//       } catch (error) {

//         console.error(
//           'Gagal memuat laporan:',
//           error
//         );


//         if (
//           error instanceof Error &&
//           error.message === 'SESSION_EXPIRED'
//         ) {

//           router.replace('/login');

//           return;
//         }


//         setError(
//           'Gagal memuat data laporan.'
//         );

//       } finally {

//         setLoading(false);

//       }

//     }


//     loadReport();

//   }, [
//     startDate,
//     endDate,
//     router,
//   ]);


//   // =====================================================
//   // DOWNLOAD
//   // =====================================================

//   async function handleDownload(
//     format: 'excel' | 'pdf'
//   ) {

//     if (!startDate || !endDate) {

//       alert(
//         'Tanggal laporan belum dipilih.'
//       );

//       return;

//     }


//     if (startDate > endDate) {

//       alert(
//         'Tanggal mulai tidak boleh lebih besar dari tanggal akhir.'
//       );

//       return;

//     }


//     try {

//       setDownloadLoading(true);

//       await downloadReport(
//         format,
//         startDate,
//         endDate
//       );

//     } catch (error) {

//       console.error(
//         'Download laporan gagal:',
//         error
//       );


//       if (
//         error instanceof Error &&
//         error.message === 'SESSION_EXPIRED'
//       ) {

//         router.replace('/login');

//         return;
//       }


//       alert(
//         'Gagal mengunduh laporan.'
//       );

//     } finally {

//       setDownloadLoading(false);

//     }

//   }


//   // =====================================================
//   // RENDER
//   // =====================================================

//   return (
//     <div className="min-h-screen bg-gray-50">

//     <DashboardNav />

//     <main
//       style={{
//         padding: '30px',
//       }}
//     >

//       {/* ================================================= */}
//       {/* HEADER */}
//       {/* ================================================= */}

//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '25px',
//         }}
//       >

//         <div>

//           <h1
//             style={{
//               margin: 0,
//               fontSize: '28px',
//             }}
//           >
//             Laporan Transaksi
//           </h1>

//           <p
//             style={{
//               marginTop: '8px',
//               color: '#666',
//             }}
//           >
//             Laporan pemasukan dan pengeluaran
//           </p>

//         </div>


//         <button
//           onClick={() =>
//             router.push('/dashboard')
//           }
//           style={{
//             padding: '10px 18px',
//             borderRadius: '8px',
//             border: '1px solid #ddd',
//             background: 'white',
//             cursor: 'pointer',
//           }}
//         >
//           ← Dashboard
//         </button>

//       </div>


//       {/* ================================================= */}
//       {/* FILTER */}
//       {/* ================================================= */}

//       <section
//         style={{
//           background: 'white',
//           border: '1px solid #e5e5e5',
//           borderRadius: '12px',
//           padding: '20px',
//           marginBottom: '25px',
//         }}
//       >

//         <h2
//           style={{
//             fontSize: '18px',
//             marginTop: 0,
//           }}
//         >
//           Periode Laporan
//         </h2>


//         <div
//           style={{
//             display: 'flex',
//             gap: '10px',
//             flexWrap: 'wrap',
//             marginBottom: '20px',
//           }}
//         >

//           <button
//             onClick={() =>
//               setReportPeriod('TODAY')
//             }
//             style={{
//               padding: '9px 16px',
//               borderRadius: '8px',
//               border: '1px solid #ddd',
//               cursor: 'pointer',
//               background:
//                 period === 'TODAY'
//                   ? '#eee'
//                   : 'white',
//             }}
//           >
//             Hari Ini
//           </button>


//           <button
//             onClick={() =>
//               setReportPeriod('WEEK')
//             }
//             style={{
//               padding: '9px 16px',
//               borderRadius: '8px',
//               border: '1px solid #ddd',
//               cursor: 'pointer',
//               background:
//                 period === 'WEEK'
//                   ? '#eee'
//                   : 'white',
//             }}
//           >
//             7 Hari Terakhir
//           </button>


//           <button
//             onClick={() =>
//               setReportPeriod('MONTH')
//             }
//             style={{
//               padding: '9px 16px',
//               borderRadius: '8px',
//               border: '1px solid #ddd',
//               cursor: 'pointer',
//               background:
//                 period === 'MONTH'
//                   ? '#eee'
//                   : 'white',
//             }}
//           >
//             Bulan Ini
//           </button>


//           <button
//             onClick={() =>
//               setPeriod('CUSTOM')
//             }
//             style={{
//               padding: '9px 16px',
//               borderRadius: '8px',
//               border: '1px solid #ddd',
//               cursor: 'pointer',
//               background:
//                 period === 'CUSTOM'
//                   ? '#eee'
//                   : 'white',
//             }}
//           >
//             Custom
//           </button>

//         </div>


//         {/* DATE INPUT */}

//         <div
//           style={{
//             display: 'flex',
//             gap: '20px',
//             flexWrap: 'wrap',
//           }}
//         >

//           <div>

//             <label>
//               Tanggal Mulai
//             </label>

//             <br />

//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => {

//                 setPeriod('CUSTOM');

//                 setStartDate(
//                   e.target.value
//                 );

//               }}
//               style={{
//                 padding: '9px',
//                 marginTop: '5px',
//               }}
//             />

//           </div>


//           <div>

//             <label>
//               Tanggal Akhir
//             </label>

//             <br />

//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => {

//                 setPeriod('CUSTOM');

//                 setEndDate(
//                   e.target.value
//                 );

//               }}
//               style={{
//                 padding: '9px',
//                 marginTop: '5px',
//               }}
//             />

//           </div>

//         </div>


//         {error && (

//           <p
//             style={{
//               color: 'red',
//               marginTop: '15px',
//             }}
//           >
//             {error}
//           </p>

//         )}

//       </section>


//       {/* ================================================= */}
//       {/* SUMMARY */}
//       {/* ================================================= */}

//       <section
//         style={{
//           marginBottom: '25px',
//         }}
//       >

//         <h2
//           style={{
//             fontSize: '20px',
//             marginBottom: '15px',
//           }}
//         >
//           Summary
//         </h2>


//         <div
//           style={{
//             display: 'grid',
//             gridTemplateColumns:
//               'repeat(auto-fit, minmax(220px, 1fr))',
//             gap: '15px',
//           }}
//         >

//           {/* PEMASUKAN */}

//           <div
//             style={{
//               background: 'white',
//               border: '1px solid #e5e5e5',
//               borderRadius: '12px',
//               padding: '20px',
//             }}
//           >

//             <div
//               style={{
//                 color: '#666',
//                 marginBottom: '8px',
//               }}
//             >
//               Total Pemasukan
//             </div>

//             <div
//               style={{
//                 fontSize: '24px',
//                 fontWeight: 'bold',
//               }}
//             >
//               {formatRupiah(
//                 reportData.total_pemasukan
//               )}
//             </div>

//           </div>


//           {/* PENGELUARAN */}

//           <div
//             style={{
//               background: 'white',
//               border: '1px solid #e5e5e5',
//               borderRadius: '12px',
//               padding: '20px',
//             }}
//           >

//             <div
//               style={{
//                 color: '#666',
//                 marginBottom: '8px',
//               }}
//             >
//               Total Pengeluaran
//             </div>

//             <div
//               style={{
//                 fontSize: '24px',
//                 fontWeight: 'bold',
//               }}
//             >
//               {formatRupiah(
//                 reportData.total_pengeluaran
//               )}
//             </div>

//           </div>


//           {/* SALDO */}

//           <div
//             style={{
//               background: 'white',
//               border: '1px solid #e5e5e5',
//               borderRadius: '12px',
//               padding: '20px',
//             }}
//           >

//             <div
//               style={{
//                 color: '#666',
//                 marginBottom: '8px',
//               }}
//             >
//               Saldo Periode
//             </div>

//             <div
//               style={{
//                 fontSize: '24px',
//                 fontWeight: 'bold',
//               }}
//             >
//               {formatRupiah(
//                 reportData.saldo_periode
//               )}
//             </div>

//           </div>

//         </div>

//       </section>


//       {/* ================================================= */}
//       {/* TRANSACTIONS */}
//       {/* ================================================= */}

//       <section
//         style={{
//           background: 'white',
//           border: '1px solid #e5e5e5',
//           borderRadius: '12px',
//           padding: '20px',
//           marginBottom: '25px',
//         }}
//       >

//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: '15px',
//           }}
//         >

//           <h2
//             style={{
//               fontSize: '20px',
//               margin: 0,
//             }}
//           >
//             Daftar Transaksi
//           </h2>


//           <span
//             style={{
//               color: '#666',
//             }}
//           >
//             {reportData.transactions.length}
//             {' '}transaksi
//           </span>

//         </div>


//         {loading ? (

//           <div
//             style={{
//               padding: '30px',
//               textAlign: 'center',
//             }}
//           >
//             Memuat laporan...
//           </div>

//         ) : reportData.transactions.length === 0 ? (

//           <div
//             style={{
//               padding: '30px',
//               textAlign: 'center',
//               color: '#777',
//             }}
//           >
//             Tidak ada transaksi pada periode ini.
//           </div>

//         ) : (

//           <div
//             style={{
//               overflowX: 'auto',
//             }}
//           >

//             <table
//               style={{
//                 width: '100%',
//                 borderCollapse: 'collapse',
//               }}
//             >

//               <thead>

//                 <tr>

//                   <th style={thStyle}>
//                     No
//                   </th>

//                   <th style={thStyle}>
//                     Tanggal
//                   </th>

//                   <th style={thStyle}>
//                     WhatsApp
//                   </th>

//                   <th style={thStyle}>
//                     Jenis
//                   </th>

//                   <th style={thStyle}>
//                     Keterangan
//                   </th>

//                   <th
//                     style={{
//                       ...thStyle,
//                       textAlign: 'right',
//                     }}
//                   >
//                     Nominal
//                   </th>

//                 </tr>

//               </thead>


//               <tbody>

//                 {reportData.transactions.map(
//                   (transaction, index) => (

//                     <tr
//                       key={transaction.id}
//                     >

//                       <td style={tdStyle}>
//                         {index + 1}
//                       </td>

//                       <td style={tdStyle}>
//                         {formatTanggal(
//                           transaction.createdAt
//                         )}
//                       </td>

//                       <td style={tdStyle}>
//                         {transaction.whatsappNumber}
//                       </td>

//                       <td style={tdStyle}>

//                         {transaction.type === 'IN'
//                           ? 'Pemasukan'
//                           : 'Pengeluaran'}

//                       </td>

//                       <td style={tdStyle}>
//                         {transaction.description}
//                       </td>

//                       <td
//                         style={{
//                           ...tdStyle,
//                           textAlign: 'right',
//                           fontWeight: 'bold',
//                         }}
//                       >
//                         {formatRupiah(
//                           transaction.amount
//                         )}
//                       </td>

//                     </tr>

//                   )
//                 )}

//               </tbody>

//             </table>

//           </div>

//         )}

//       </section>


//       {/* ================================================= */}
//       {/* DOWNLOAD */}
//       {/* ================================================= */}

//       <section
//         style={{
//           background: 'white',
//           border: '1px solid #e5e5e5',
//           borderRadius: '12px',
//           padding: '20px',
//         }}
//       >

//         <h2
//           style={{
//             fontSize: '20px',
//             marginTop: 0,
//           }}
//         >
//           Download Laporan
//         </h2>


//         <p
//           style={{
//             color: '#666',
//           }}
//         >
//           Download transaksi berdasarkan periode:
//           {' '}
//           <strong>
//             {startDate || '-'}
//           </strong>
//           {' '}sampai{' '}
//           <strong>
//             {endDate || '-'}
//           </strong>
//         </p>


//         <div
//           style={{
//             display: 'flex',
//             gap: '10px',
//             flexWrap: 'wrap',
//           }}
//         >

//           <button
//             onClick={() =>
//               handleDownload('excel')
//             }
//             disabled={downloadLoading}
//             style={{
//               padding: '11px 20px',
//               borderRadius: '8px',
//               border: 'none',
//               cursor: 'pointer',
//             }}
//           >
//             {downloadLoading
//               ? 'Memproses...'
//               : 'Download Excel'}
//           </button>


//           <button
//             onClick={() =>
//               handleDownload('pdf')
//             }
//             disabled={downloadLoading}
//             style={{
//               padding: '11px 20px',
//               borderRadius: '8px',
//               border: 'none',
//               cursor: 'pointer',
//             }}
//           >
//             {downloadLoading
//               ? 'Memproses...'
//               : 'Download PDF'}
//           </button>

//         </div>

//       </section>

//     </main>

//     </div>

//   );
// }


// // =====================================================
// // TABLE STYLE
// // =====================================================

// const thStyle: React.CSSProperties = {
//   textAlign: 'left',
//   padding: '12px',
//   borderBottom: '2px solid #eee',
//   whiteSpace: 'nowrap',
// };


// const tdStyle: React.CSSProperties = {
//   padding: '12px',
//   borderBottom: '1px solid #eee',
// };


'use client';

import DashboardNav from '../../components/DashboardNav';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  getCurrentUser,
  getReportData,
  downloadReport,
} from '../../services/api';


type ReportPeriod =
  | 'TODAY'
  | 'WEEK'
  | 'MONTH'
  | 'CUSTOM';


type Transaction = {
  id: number;
  whatsappNumber: string;
  type: 'IN' | 'OUT';
  description: string;
  amount: number;
  createdAt: string;
};


type ReportData = {
  total_pemasukan: number;
  total_pengeluaran: number;
  saldo_periode: number;
  transactions: Transaction[];
};


export default function ReportsPage() {

  const router = useRouter();


  // =====================================================
  // STATE PERIODE
  // =====================================================

  const [period, setPeriod] =
    useState<ReportPeriod>('TODAY');

  const [startDate, setStartDate] =
    useState('');

  const [endDate, setEndDate] =
    useState('');


  // =====================================================
  // STATE PERIODE YANG SUDAH DITERAPKAN
  // =====================================================

  const [appliedStartDate, setAppliedStartDate] =
    useState('');

  const [appliedEndDate, setAppliedEndDate] =
    useState('');


  // =====================================================
  // REPORT DATA
  // =====================================================

  const [reportData, setReportData] =
    useState<ReportData>({
      total_pemasukan: 0,
      total_pengeluaran: 0,
      saldo_periode: 0,
      transactions: [],
    });


  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] =
    useState(true);

  const [downloadLoading, setDownloadLoading] =
    useState(false);


  // =====================================================
  // ERROR
  // =====================================================

  const [error, setError] =
    useState('');


  // =====================================================
  // FORMAT RUPIAH
  // =====================================================

  function formatRupiah(value: number) {

    return new Intl.NumberFormat(
      'id-ID',
      {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }
    ).format(Number(value) || 0);

  }


  // =====================================================
  // FORMAT TANGGAL
  // =====================================================

  function formatTanggal(tanggal: string) {

    if (!tanggal) {
      return '-';
    }

    const date = new Date(tanggal);

    if (isNaN(date.getTime())) {
      return '-';
    }

    return date.toLocaleDateString(
      'id-ID',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );

  }


  // =====================================================
  // FORMAT JAM
  // =====================================================

  function formatJam(tanggal: string) {

    if (!tanggal) {
      return '-';
    }

    const date = new Date(tanggal);

    if (isNaN(date.getTime())) {
      return '-';
    }

    return date.toLocaleTimeString(
      'id-ID',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    );

  }


  // =====================================================
  // FORMAT DATE YYYY-MM-DD
  // =====================================================

  function formatDate(date: Date) {

    const year =
      date.getFullYear();

    const month =
      String(date.getMonth() + 1)
        .padStart(2, '0');

    const day =
      String(date.getDate())
        .padStart(2, '0');

    return `${year}-${month}-${day}`;

  }


  // =====================================================
  // SET PERIODE
  // =====================================================

  function setReportPeriod(
    selectedPeriod: ReportPeriod
  ) {

    setPeriod(selectedPeriod);

    const today =
      new Date();

    let start =
      new Date(today);

    let end =
      new Date(today);


    // ---------------------------------------------------
    // HARI INI
    // ---------------------------------------------------

    if (selectedPeriod === 'TODAY') {

      start =
        new Date(today);

      end =
        new Date(today);

    }


    // ---------------------------------------------------
    // 7 HARI TERAKHIR
    // ---------------------------------------------------

    if (selectedPeriod === 'WEEK') {

      start =
        new Date(today);

      start.setDate(
        today.getDate() - 6
      );

      end =
        new Date(today);

    }


    // ---------------------------------------------------
    // BULAN INI
    // ---------------------------------------------------

    if (selectedPeriod === 'MONTH') {

      start =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );

      end =
        new Date(today);

    }


    // ---------------------------------------------------
    // CUSTOM
    // ---------------------------------------------------

    if (selectedPeriod !== 'CUSTOM') {

      setStartDate(
        formatDate(start)
      );

      setEndDate(
        formatDate(end)
      );

    }

  }


  // =====================================================
  // CEK LOGIN + DEFAULT TODAY
  // =====================================================

  useEffect(() => {

    let cancelled = false;


    async function initialize() {

      try {

        setLoading(true);

        const currentUser =
          await getCurrentUser();


        if (!currentUser) {

          router.replace('/login');

          return;

        }


        if (cancelled) {
          return;
        }


        const today =
          formatDate(new Date());


        // ------------------------------------------------
        // DEFAULT FILTER
        // ------------------------------------------------

        setPeriod('TODAY');

        setStartDate(today);
        setEndDate(today);


        // ------------------------------------------------
        // DEFAULT REPORT
        // ------------------------------------------------

        setAppliedStartDate(today);
        setAppliedEndDate(today);


      } catch (error) {

        console.error(
          'Gagal mengecek login:',
          error
        );


        if (!cancelled) {

          router.replace('/login');

        }

      }


    }


    initialize();


    return () => {

      cancelled = true;

    };

  }, [router]);


  // =====================================================
  // LOAD REPORT
  // =====================================================

  useEffect(() => {

    if (
      !appliedStartDate ||
      !appliedEndDate
    ) {

      return;

    }


    if (
      appliedStartDate >
      appliedEndDate
    ) {

      setError(
        'Tanggal mulai tidak boleh lebih besar dari tanggal akhir.'
      );

      return;

    }


    let cancelled = false;


    async function loadReport() {

      try {

        setLoading(true);

        setError('');


        const data =
          await getReportData(
            appliedStartDate,
            appliedEndDate
          );


        if (cancelled) {
          return;
        }


        setReportData({
          total_pemasukan:
            Number(
              data.total_pemasukan
            ) || 0,

          total_pengeluaran:
            Number(
              data.total_pengeluaran
            ) || 0,

          saldo_periode:
            Number(
              data.saldo_periode
            ) || 0,

          transactions:
            Array.isArray(
              data.transactions
            )
              ? data.transactions
              : [],
        });


      } catch (error) {

        if (cancelled) {
          return;
        }


        console.error(
          'Gagal memuat laporan:',
          error
        );


        if (
          error instanceof Error &&
          error.message ===
            'SESSION_EXPIRED'
        ) {

          router.replace('/login');

          return;

        }


        setError(
          'Gagal memuat data laporan.'
        );


      } finally {

        if (!cancelled) {

          setLoading(false);

        }

      }

    }


    loadReport();


    return () => {

      cancelled = true;

    };

  }, [
    appliedStartDate,
    appliedEndDate,
    router,
  ]);


  // =====================================================
  // TAMPILKAN LAPORAN
  // =====================================================

  function handleShowReport() {

    if (
      !startDate ||
      !endDate
    ) {

      setError(
        'Tanggal mulai dan tanggal akhir harus dipilih.'
      );

      return;

    }


    if (
      startDate >
      endDate
    ) {

      setError(
        'Tanggal mulai tidak boleh lebih besar dari tanggal akhir.'
      );

      return;

    }


    setError('');


    setAppliedStartDate(
      startDate
    );

    setAppliedEndDate(
      endDate
    );

  }


  // =====================================================
  // DOWNLOAD
  // =====================================================

  async function handleDownload(
    format: 'excel' | 'pdf'
  ) {

    if (
      !startDate ||
      !endDate
    ) {

      alert(
        'Tanggal laporan belum dipilih.'
      );

      return;

    }


    if (
      startDate >
      endDate
    ) {

      alert(
        'Tanggal mulai tidak boleh lebih besar dari tanggal akhir.'
      );

      return;

    }


    try {

      setDownloadLoading(true);


      await downloadReport(
        format,
        startDate,
        endDate
      );


    } catch (error) {

      console.error(
        'Download laporan gagal:',
        error
      );


      if (
        error instanceof Error &&
        error.message ===
          'SESSION_EXPIRED'
      ) {

        router.replace('/login');

        return;

      }


      alert(
        'Gagal mengunduh laporan.'
      );


    } finally {

      setDownloadLoading(false);

    }

  }


  // =====================================================
  // LOADING INITIAL
  // =====================================================

  if (
    loading &&
    !appliedStartDate
  ) {

    return (

      <div className="min-h-screen bg-gray-50">

        <DashboardNav />

        <div className="min-h-[70vh] flex items-center justify-center">

          <div className="text-gray-500">

            Memuat laporan...

          </div>

        </div>

      </div>

    );

  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="min-h-screen bg-gray-50">

      {/* =================================================
          NAVIGASI
      ================================================= */}

      <DashboardNav />


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>

            <h1 className="text-2xl font-bold text-gray-900">

              Laporan Transaksi

            </h1>


            <p className="text-sm text-gray-500 mt-1">

              Laporan pemasukan dan pengeluaran berdasarkan periode

            </p>

          </div>


          <button
            onClick={() =>
              router.push('/dashboard')
            }
            className="self-start md:self-auto px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition"
          >

            ← Dashboard

          </button>

        </div>


        {/* =================================================
            FILTER PERIODE
        ================================================= */}

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">

          <div className="flex flex-col gap-5">


            <div>

              <h2 className="font-semibold text-gray-900">

                Periode Laporan

              </h2>


              <p className="text-xs text-gray-400 mt-1">

                Pilih periode laporan yang ingin ditampilkan

              </p>

            </div>


            {/* ------------------------------------------------
                PRESET
            ------------------------------------------------ */}

            <div className="flex flex-wrap gap-2">


              {/* TODAY */}

              <button
                onClick={() =>
                  setReportPeriod('TODAY')
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                  period === 'TODAY'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >

                Hari Ini

              </button>


              {/* WEEK */}

              <button
                onClick={() =>
                  setReportPeriod('WEEK')
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                  period === 'WEEK'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >

                7 Hari Terakhir

              </button>


              {/* MONTH */}

              <button
                onClick={() =>
                  setReportPeriod('MONTH')
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                  period === 'MONTH'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >

                Bulan Ini

              </button>


              {/* CUSTOM */}

              <button
                onClick={() =>
                  setPeriod('CUSTOM')
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                  period === 'CUSTOM'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >

                Custom

              </button>

            </div>


            {/* ------------------------------------------------
                DATE INPUT
            ------------------------------------------------ */}

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">


              {/* TANGGAL MULAI */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">

                  Tanggal Mulai

                </label>


                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {

                    setPeriod('CUSTOM');

                    setStartDate(
                      e.target.value
                    );

                  }}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

              </div>


              {/* TANGGAL AKHIR */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">

                  Tanggal Akhir

                </label>


                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {

                    setPeriod('CUSTOM');

                    setEndDate(
                      e.target.value
                    );

                  }}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

              </div>


              {/* TAMPILKAN */}

              <button
                onClick={
                  handleShowReport
                }
                disabled={
                  loading
                }
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-semibold transition whitespace-nowrap"
              >

                {loading
                  ? 'Memuat...'
                  : 'Tampilkan Laporan'}

              </button>

            </div>


            {/* ERROR */}

            {error && (

              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">

                {error}

              </div>

            )}

          </div>

        </section>


        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="mb-6">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-lg font-semibold text-gray-900">

                Ringkasan

              </h2>


              <p className="text-xs text-gray-400 mt-1">

                Periode{' '}

                <span className="font-medium text-gray-500">

                  {appliedStartDate || '-'}

                </span>

                {' '}sampai{' '}

                <span className="font-medium text-gray-500">

                  {appliedEndDate || '-'}

                </span>

              </p>

            </div>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


            {/* =================================================
                PEMASUKAN
            ================================================= */}

            <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">

                    Total Pemasukan

                  </p>


                  <p className="text-2xl font-bold text-green-600 mt-2">

                    {formatRupiah(
                      reportData.total_pemasukan
                    )}

                  </p>

                </div>


                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">

                  ↓

                </div>

              </div>


              <p className="text-xs text-gray-400 mt-4">

                Total uang masuk pada periode

              </p>

            </div>


            {/* =================================================
                PENGELUARAN
            ================================================= */}

            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">

                    Total Pengeluaran

                  </p>


                  <p className="text-2xl font-bold text-red-600 mt-2">

                    {formatRupiah(
                      reportData.total_pengeluaran
                    )}

                  </p>

                </div>


                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl">

                  ↑

                </div>

              </div>


              <p className="text-xs text-gray-400 mt-4">

                Total uang keluar pada periode

              </p>

            </div>


            {/* =================================================
                SALDO
            ================================================= */}

            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">

                    Saldo Periode

                  </p>


                  <p className="text-2xl font-bold text-blue-600 mt-2">

                    {formatRupiah(
                      reportData.saldo_periode
                    )}

                  </p>

                </div>


                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">

                  💰

                </div>

              </div>


              <p className="text-xs text-gray-400 mt-4">

                Pemasukan dikurangi pengeluaran

              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            TRANSACTIONS
        ================================================= */}

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">


          {/* HEADER */}

          <div className="px-5 sm:px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

            <div>

              <h2 className="text-lg font-semibold text-gray-900">

                Daftar Transaksi

              </h2>


              <p className="text-xs text-gray-400 mt-1">

                Riwayat transaksi pada periode yang dipilih

              </p>

            </div>


            <div className="text-sm text-gray-400">

              {reportData.transactions.length}{' '}

              transaksi

            </div>

          </div>


          {/* LOADING */}

          {loading ? (

            <div className="px-6 py-16 text-center">

              <div className="text-gray-500">

                Memuat laporan...

              </div>

            </div>

          ) : reportData.transactions.length === 0 ? (

            /* EMPTY */

            <div className="px-6 py-16 text-center">

              <div className="text-4xl mb-3">

                📋

              </div>


              <p className="text-gray-500 font-medium">

                Tidak ada transaksi

              </p>


              <p className="text-sm text-gray-400 mt-1">

                Tidak ditemukan transaksi pada periode ini.

              </p>

            </div>

          ) : (

            /* TABLE */

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">


                <thead>

                  <tr className="bg-gray-50 text-xs uppercase text-gray-500">

                    <th className="px-5 py-4 text-left">

                      No

                    </th>


                    <th className="px-5 py-4 text-left">

                      Tanggal

                    </th>


                    <th className="px-5 py-4 text-left">

                      WhatsApp

                    </th>


                    <th className="px-5 py-4 text-left">

                      Jenis

                    </th>


                    <th className="px-5 py-4 text-left">

                      Keterangan

                    </th>


                    <th className="px-5 py-4 text-right">

                      Nominal

                    </th>

                  </tr>

                </thead>


                <tbody>

                  {reportData.transactions.map(
                    (transaction, index) => (

                      <tr
                        key={transaction.id}
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                      >


                        {/* NO */}

                        <td className="px-5 py-4 text-sm text-gray-500">

                          {index + 1}

                        </td>


                        {/* TANGGAL */}

                        <td className="px-5 py-4 whitespace-nowrap">

                          <div className="text-sm font-medium text-gray-800">

                            {formatTanggal(
                              transaction.createdAt
                            )}

                          </div>


                          <div className="text-xs text-gray-400 mt-1">

                            {formatJam(
                              transaction.createdAt
                            )}

                          </div>

                        </td>


                        {/* WHATSAPP */}

                        <td className="px-5 py-4 whitespace-nowrap">

                          <span className="text-sm font-mono text-gray-700">

                            {transaction.whatsappNumber}

                          </span>

                        </td>


                        {/* JENIS */}

                        <td className="px-5 py-4">

                          {transaction.type === 'IN' ? (

                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">

                              PEMASUKAN

                            </span>

                          ) : (

                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">

                              PENGELUARAN

                            </span>

                          )}

                        </td>


                        {/* KETERANGAN */}

                        <td className="px-5 py-4">

                          <span className="text-sm text-gray-700">

                            {transaction.description}

                          </span>

                        </td>


                        {/* NOMINAL */}

                        <td className="px-5 py-4 text-right whitespace-nowrap">

                          <span
                            className={`text-sm font-bold ${
                              transaction.type === 'IN'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >

                            {transaction.type === 'IN'
                              ? '+'
                              : '-'}

                            {' '}

                            {formatRupiah(
                              Number(
                                transaction.amount
                              )
                            )}

                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {/* =================================================
            DOWNLOAD
        ================================================= */}

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">


            {/* INFO */}

            <div>

              <h2 className="text-lg font-semibold text-gray-900">

                Download Laporan

              </h2>


              <p className="text-sm text-gray-500 mt-1">

                Download laporan transaksi dalam format Excel atau PDF.

              </p>


              <p className="text-xs text-gray-400 mt-2">

                Periode:{' '}

                <span className="font-medium text-gray-600">

                  {startDate || '-'}

                </span>

                {' '}sampai{' '}

                <span className="font-medium text-gray-600">

                  {endDate || '-'}

                </span>

              </p>

            </div>


            {/* BUTTON */}

            <div className="flex flex-wrap gap-3">


              {/* EXCEL */}

              <button
                onClick={() =>
                  handleDownload('excel')
                }
                disabled={
                  downloadLoading ||
                  loading ||
                  !startDate ||
                  !endDate
                }
                className="px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-semibold transition"
              >

                {downloadLoading
                  ? 'Memproses...'
                  : '📊 Download Excel'}

              </button>


              {/* PDF */}

              <button
                onClick={() =>
                  handleDownload('pdf')
                }
                disabled={
                  downloadLoading ||
                  loading ||
                  !startDate ||
                  !endDate
                }
                className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm font-semibold transition"
              >

                {downloadLoading
                  ? 'Memproses...'
                  : '📄 Download PDF'}

              </button>

            </div>

          </div>

        </section>


      </main>

    </div>

  );

}