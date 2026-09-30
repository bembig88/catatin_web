'use client';

import DashboardNav from '../components/DashboardNav';
import { useEffect, useMemo, useState } from 'react';
import {
  getCurrentUser,
  getSummary,
  getTransactions,
  getMyShop,
  logout,
} from '../services/api';
import { useRouter } from 'next/navigation';

type User = {
  username: string;
  role: string;
};


type Shop = {
  id: number;
  name: string;
};


type Transaction = {
  id: number;
  whatsappNumber: string;
  type: 'IN' | 'OUT';
  description: string;
  amount: number;
  createdAt: string;
};



type FilterType = 'today' | 'week' | 'month';


export default function Dashboard() {

  const router = useRouter();

  // =====================================================
  // USER
  // =====================================================

  const [user, setUser] =
    useState<User | null>(null);


  // =====================================================
  // FILTER
  // =====================================================

  const [filter, setFilter] =
    useState<FilterType>('today');


  // =====================================================
  // DATA
  // =====================================================

  const [summary, setSummary] = useState({
    total_pemasukan: 0,
    total_pengeluaran: 0,
    saldo_saat_ini: 0,
  });

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);


  const [shop, setShop] = useState<Shop | null>(null);
  
    

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] =
    useState(true);

  const [logoutLoading, setLogoutLoading] =
    useState(false);


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {

    let cancelled = false;


    async function loadDashboard() {

      try {

        setLoading(true);


        // -------------------------------------------------
        // 1. CEK LOGIN
        // -------------------------------------------------

        const currentUser =
          await getCurrentUser();


        if (!currentUser) {

          router.replace('/login');

          return;
        }


        if (cancelled) {
          return;
        }


        setUser(currentUser);


        // -------------------------------------------------
        // 2. AMBIL SUMMARY + TRANSACTIONS
        // -------------------------------------------------

        const [
          summaryData,
          transactionData,
          shopData
        ] = await Promise.all([

          getSummary(filter),

          getTransactions(filter),

          getMyShop()

        ]);


        if (cancelled) {
          return;
        }


        // -------------------------------------------------
        // 3. UPDATE STATE
        // -------------------------------------------------

        setSummary(summaryData);

        setTransactions(transactionData);

        setShop(shopData);

      } catch (error) {

        if (cancelled) {
          return;
        }


        console.error(
          'Gagal memuat dashboard:',
          error
        );


        // -------------------------------------------------
        // SESSION EXPIRED
        // -------------------------------------------------

        if (
          error instanceof Error &&
          error.message === 'SESSION_EXPIRED'
        ) {

          router.replace('/login');

          return;
        }


        // -------------------------------------------------
        // ERROR AUTH / API
        // -------------------------------------------------

        router.replace('/login');


      } finally {

        if (!cancelled) {

          setLoading(false);

        }

      }

    }


    loadDashboard();


    return () => {

      cancelled = true;

    };


  }, [router, filter]);


  // =====================================================
  // LOGOUT
  // =====================================================

  async function handleLogout() {

    try {

      setLogoutLoading(true);


      await logout();


      router.replace('/login');


    } catch (error) {

      console.error(
        'Logout gagal:',
        error
      );


      alert('Logout gagal');


    } finally {

      setLogoutLoading(false);

    }

  }


  // =====================================================
  // FORMAT RUPIAH
  // =====================================================

  const formatRupiah = (
    value: number
  ) => {

    return new Intl.NumberFormat(
      'id-ID',
      {
        maximumFractionDigits: 0,
      }
    ).format(value);

  };


  // =====================================================
  // FORMAT TANGGAL
  // =====================================================

  const formatTanggal = (
    tanggal: string
  ) => {

    if (!tanggal) {
      return '-';
    }


    return new Date(
      tanggal
    ).toLocaleDateString(
      'id-ID',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );

  };


  // =====================================================
  // FORMAT JAM
  // =====================================================

  const formatJam = (
    tanggal: string
  ) => {

    if (!tanggal) {
      return '-';
    }


    return new Date(
      tanggal
    ).toLocaleTimeString(
      'id-ID',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    );

  };


  // =====================================================
  // TRANSAKSI
  // =====================================================

  const filteredTransactions =
    useMemo(() => {

      return [...transactions]
        .sort(
          (a, b) =>
            new Date(
              b.createdAt
            ).getTime()
            -
            new Date(
              a.createdAt
            ).getTime()
        );

    }, [transactions]);


  // =====================================================
  // TOTAL PEMASUKAN PERIODE
  // =====================================================

  const filteredIncome =
    filteredTransactions
      .filter(
        (tx) =>
          tx.type === 'IN'
      )
      .reduce(
        (total, tx) =>
          total + Number(tx.amount),
        0
      );


  // =====================================================
  // TOTAL PENGELUARAN PERIODE
  // =====================================================

  const filteredExpense =
    filteredTransactions
      .filter(
        (tx) =>
          tx.type === 'OUT'
      )
      .reduce(
        (total, tx) =>
          total + Number(tx.amount),
        0
      );


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-gray-500">

          Memuat data keuangan...

        </div>

      </div>

    );

  }


  // =====================================================
  // USER BELUM ADA
  // =====================================================

  if (!user) {

    return null;

  }


  // =====================================================
  // DASHBOARD
  // =====================================================

  return (

    <div className="min-h-screen bg-gray-50">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
           
            {/* TITLE */}

            <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏪</span>

                  <h1 className="text-2xl font-bold text-gray-900">
                    {shop ? shop.name : 'Memuat warung...'}
                  </h1>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Dashboard keuangan warung Anda
                </p>
              </div>


            {/* USER */}

            <div className="flex items-center gap-4">

              <div className="text-sm text-gray-500">

                Halo,{' '}

                <span className="font-semibold text-gray-700">

                  {user.username}

                </span>

              </div>


              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm font-medium transition"
              >

                {logoutLoading
                  ? 'Logout...'
                  : 'Logout'}

              </button>

            </div>

          </div>

        </div>

      </div>


      {/* NAVIGASI */}

        <DashboardNav />


      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">


        {/* =================================================
            SALDO UTAMA
        ================================================= */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">


            <div>

              {shop && (
                <p className="text-sm font-medium text-blue-600 mb-2">
                  🏪 {shop.name}
                </p>
              )}

              <p className="text-sm text-gray-500">

                Saldo Saat Ini

              </p>


              <h2 className="text-3xl font-bold text-gray-900 mt-2">

                Rp{' '}

                {formatRupiah(
                  summary.saldo_saat_ini
                )}

              </h2>


              <p className="text-xs text-gray-400 mt-2">

                Saldo berdasarkan seluruh transaksi

              </p>

            </div>


            <div>

              <div className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">

                💰 Keuangan Anda

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            PEMASUKAN / PENGELUARAN
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">


          {/* PEMASUKAN */}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

            <div className="flex items-center justify-between">


              <div>

                <p className="text-sm text-gray-500">

                  Total Pemasukan

                </p>


                <p className="text-2xl font-bold text-green-600 mt-2">

                  Rp{' '}

                  {formatRupiah(
                    summary.total_pemasukan
                  )}

                </p>

              </div>


              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl">

                ↓

              </div>

            </div>


            <div className="mt-4 pt-4 border-t border-gray-100">

              <p className="text-xs text-gray-400">

                Periode terpilih

              </p>


              <p className="text-sm font-semibold text-green-600 mt-1">

                + Rp{' '}

                {formatRupiah(
                  filteredIncome
                )}

              </p>

            </div>

          </div>


          {/* PENGELUARAN */}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

            <div className="flex items-center justify-between">


              <div>

                <p className="text-sm text-gray-500">

                  Total Pengeluaran

                </p>


                <p className="text-2xl font-bold text-red-600 mt-2">

                  Rp{' '}

                  {formatRupiah(
                    summary.total_pengeluaran
                  )}

                </p>

              </div>


              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-xl">

                ↑

              </div>

            </div>


            <div className="mt-4 pt-4 border-t border-gray-100">

              <p className="text-xs text-gray-400">

                Periode terpilih

              </p>


              <p className="text-sm font-semibold text-red-600 mt-1">

                - Rp{' '}

                {formatRupiah(
                  filteredExpense
                )}

              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            FILTER
        ================================================= */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">


            <div>

              <h2 className="font-semibold text-gray-900">

                Ringkasan Transaksi

              </h2>


              <p className="text-xs text-gray-400 mt-1">

                Menampilkan transaksi berdasarkan periode

              </p>

            </div>


            <div className="flex gap-2">


              {/* TODAY */}

              <button
                onClick={() =>
                  setFilter('today')
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'today'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >

                Hari Ini

              </button>


              {/* WEEK */}

              <button
                onClick={() =>
                  setFilter('week')
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >

                7 Hari

              </button>


              {/* MONTH */}

              <button
                onClick={() =>
                  setFilter('month')
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >

                Bulan Ini

              </button>

            </div>

          </div>

        </div>


        {/* =================================================
            TABEL TRANSAKSI
        ================================================= */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">


          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">


            <div>

              <h2 className="font-semibold text-lg text-gray-900">

                Transaksi Terbaru

              </h2>


              <p className="text-xs text-gray-400 mt-1">

                Riwayat transaksi via WhatsApp

              </p>

            </div>


            <div className="text-sm text-gray-400">

              {filteredTransactions.length}{' '}

              transaksi

            </div>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full">


              <thead>

                <tr className="bg-gray-50 text-xs uppercase text-gray-500">


                  <th className="px-6 py-4 text-left">

                    Tanggal

                  </th>


                  <th className="px-6 py-4 text-left">

                    WhatsApp

                  </th>


                  <th className="px-6 py-4 text-left">

                    Keterangan

                  </th>


                  <th className="px-6 py-4 text-center">

                    Tipe

                  </th>


                  <th className="px-6 py-4 text-right">

                    Nominal

                  </th>


                </tr>

              </thead>


              <tbody>


                {filteredTransactions.length === 0 ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-400"
                    >

                      Belum ada transaksi pada periode ini.

                    </td>

                  </tr>

                ) : (

                  filteredTransactions.map(
                    (tx) => (

                      <tr
                        key={tx.id}
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                      >


                        {/* TANGGAL */}

                        <td className="px-6 py-4 whitespace-nowrap">

                          <div className="text-sm font-medium text-gray-800">

                            {formatTanggal(
                              tx.createdAt
                            )}

                          </div>


                          <div className="text-xs text-gray-400 mt-1">

                            {formatJam(
                              tx.createdAt
                            )}

                          </div>

                        </td>


                        {/* WHATSAPP */}

                        <td className="px-6 py-4 whitespace-nowrap">

                          <span className="text-sm font-mono text-gray-700">

                            {tx.whatsappNumber}

                          </span>

                        </td>


                        {/* KETERANGAN */}

                        <td className="px-6 py-4">

                          <span className="text-sm text-gray-700">

                            {tx.description}

                          </span>

                        </td>


                        {/* TIPE */}

                        <td className="px-6 py-4 text-center">

                          {tx.type === 'IN' ? (

                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">

                              MASUK

                            </span>

                          ) : (

                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">

                              KELUAR

                            </span>

                          )}

                        </td>


                        {/* NOMINAL */}

                        <td className="px-6 py-4 text-right whitespace-nowrap">

                          <span
                            className={`text-sm font-bold ${
                              tx.type === 'IN'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >

                            {tx.type === 'IN'
                              ? '+'
                              : '-'}

                            {' '}Rp{' '}

                            {formatRupiah(
                              Number(
                                tx.amount
                              )
                            )}

                          </span>

                        </td>


                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>


      </main>

    </div>

  );
}