'use client';

// import DashboardNav from '../../components/DashboardNav';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

// import {
//   getCurrentUser,
//   getTransactions,
// } from '../../services/api';

import {
  getCurrentUser,
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getMyShop,
} from '../../services/api';


type Shop = {
  id: number;
  name: string;
};

type FilterType =
  | 'today'
  | 'week'
  | 'month';


type Transaction = {
  id: number;
  whatsappNumber: string;
  type: 'IN' | 'OUT';
  description: string;
  amount: number;
  createdAt: string;
};


type User = {
  username: string;
  role: string;
};


export default function TransactionsPage() {

  const router = useRouter();


  // =====================================================
  // USER
  // =====================================================

  const [user, setUser] =
    useState<User | null>(null);

  

  // =====================================================
  // FILTER PERIODE
  // =====================================================

  const [filter, setFilter] =
    useState<FilterType>('today');


  // =====================================================
  // TRANSACTIONS
  // =====================================================

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);


  // =====================================================
  // SEARCH
  // =====================================================

  const [search, setSearch] =
    useState('');


  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 10;


  // =====================================================
  // DETAIL TRANSACTION
  // =====================================================

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

    const [shop, setShop] = useState<Shop | null>(null);

    // =====================================================
    // EDIT TRANSACTION
    // =====================================================

    const [editTransaction, setEditTransaction] =
    useState<Transaction | null>(null);

    const [editType, setEditType] =
    useState<'IN' | 'OUT'>('IN');

    const [editDescription, setEditDescription] =
    useState('');

    const [editAmount, setEditAmount] =
    useState('');

    const [savingEdit, setSavingEdit] =
    useState(false);


    // =====================================================
    // DELETE TRANSACTION
    // =====================================================

    const [deleteTarget, setDeleteTarget] =
    useState<Transaction | null>(null);

    const [deleting, setDeleting] =
    useState(false);

    // =====================================================
    // TAMBAH TRANSAKSI
    // =====================================================

    const [showAddTransaction, setShowAddTransaction] =
    useState(false);

    const [addType, setAddType] =
    useState<'IN' | 'OUT'>('IN');

    const [addDescription, setAddDescription] =
    useState('');

    const [addAmount, setAddAmount] =
    useState('');

    const [savingAdd, setSavingAdd] =
    useState(false);

    // =====================================================
    // DETAIL LOADING
    // =====================================================

    const [detailLoading, setDetailLoading] =
    useState(false);

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] =
    useState(true);


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
    ).format(
      Number(value) || 0
    );

  }


  // =====================================================
  // FORMAT TANGGAL
  // =====================================================

  function formatTanggal(
    tanggal: string
  ) {

    if (!tanggal) {
      return '-';
    }

    const date =
      new Date(tanggal);

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

  function formatJam(
    tanggal: string
  ) {

    if (!tanggal) {
      return '-';
    }

    const date =
      new Date(tanggal);

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


    //========================================================
    // LOAD loadTransactions
  // =====================================================
  async function loadTransactions() {

  try {

    setLoading(true);
    setError('');
   

    const data =
      await getTransactions(
        filter
      );

    setTransactions(
      Array.isArray(data)
        ? data
        : []
    );

    setCurrentPage(1);

  } catch (error) {

    console.error(
      'Gagal memuat transaksi:',
      error
    );

    if (
      error instanceof Error &&
      error.message === 'SESSION_EXPIRED'
    ) {

      router.replace('/login');

      return;

    }

    setError(
      'Gagal memuat data transaksi.'
    );

  } finally {

    setLoading(false);

  }

}

  
useEffect(() => {

  let cancelled = false;

  async function loadData() {

    try {

      setLoading(true);
      setError('');
      

    // -------------------------------------------------
   // 2. AMBIL NAMA WARUNG
  // -------------------------------------------------
        
                const [
                    shopData
                ] = await Promise.all([
        
                        
                  getMyShop()
        
                ]);
            
                setShop(shopData);
      

      // -----------------------------------------------
      // CEK LOGIN
      // -----------------------------------------------

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

      // -----------------------------------------------
      // TRANSAKSI
      // -----------------------------------------------

      const data =
        await getTransactions(
          filter
        );

      if (cancelled) {
        return;
      }

      setTransactions(
        Array.isArray(data)
          ? data
          : []
      );

      setCurrentPage(1);

    } catch (error) {

      if (cancelled) {
        return;
      }

      console.error(
        'Gagal memuat transaksi:',
        error
      );

      if (
        error instanceof Error &&
        error.message === 'SESSION_EXPIRED'
      ) {

        router.replace('/login');

        return;

      }

      setError(
        'Gagal memuat data transaksi.'
      );

    } finally {

      if (!cancelled) {

        setLoading(false);

      }

    }

  }

  loadData();

  return () => {

    cancelled = true;

  };

}, [
  router,
  filter,
]);

  // =====================================================
  // SEARCH + SORT
  // =====================================================

  const filteredTransactions =
    useMemo(() => {

      const keyword =
        search
          .trim()
          .toLowerCase();


      const result =
        transactions.filter(
          (transaction) => {

            if (!keyword) {
              return true;
            }


            const description =
              transaction.description
                ?.toLowerCase() || '';


            const whatsapp =
              transaction.whatsappNumber
                ?.toLowerCase() || '';


            return (
              description.includes(
                keyword
              ) ||
              whatsapp.includes(
                keyword
              )
            );

          }
        );


      return [...result].sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime()
          -
          new Date(
            a.createdAt
          ).getTime()
      );

    }, [
      transactions,
      search,
    ]);


  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages =
    Math.ceil(
      filteredTransactions.length /
      itemsPerPage
    );


  const paginatedTransactions =
    useMemo(() => {

      const startIndex =
        (currentPage - 1) *
        itemsPerPage;


      const endIndex =
        startIndex +
        itemsPerPage;


      return filteredTransactions.slice(
        startIndex,
        endIndex
      );

    }, [
      filteredTransactions,
      currentPage,
    ]);


  // =====================================================
  // TOTAL PEMASUKAN
  // =====================================================

  const totalIncome =
    filteredTransactions
      .filter(
        tx => tx.type === 'IN'
      )
      .reduce(
        (total, tx) =>
          total +
          Number(tx.amount),
        0
      );


  // =====================================================
  // TOTAL PENGELUARAN
  // =====================================================

  const totalExpense =
    filteredTransactions
      .filter(
        tx => tx.type === 'OUT'
      )
      .reduce(
        (total, tx) =>
          total +
          Number(tx.amount),
        0
      );


  // =====================================================
  // SALDO PERIODE
  // =====================================================

  const periodBalance =
    totalIncome -
    totalExpense;


  // =====================================================
  // SEARCH CHANGE
  // =====================================================

  function handleSearch(
    value: string
  ) {

    setSearch(value);

    setCurrentPage(1);

  }


  // =====================================================
  // GANTI PERIODE
  // =====================================================

  function handleFilter(
    selectedFilter: FilterType
  ) {

    setFilter(
      selectedFilter
    );

    setSearch('');

    setCurrentPage(1);

    setSelectedTransaction(null);

  }


  // =====================================================
  // PAGINATION
  // =====================================================

  function goToPage(
    page: number
  ) {

    if (
      page < 1 ||
      page > totalPages
    ) {

      return;

    }


    setCurrentPage(page);


    // kembali ke atas tabel

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

  }


  // =====================================================
// BUKA DETAIL TRANSAKSI
// =====================================================

async function openDetail(
  transaction: Transaction
) {

  try {

    setDetailLoading(true);

    const data =
      await getTransaction(
        transaction.id
      );

    setSelectedTransaction(data);

  } catch (error) {

    console.error(
      'Gagal mengambil detail transaksi:',
      error
    );

    if (
      error instanceof Error &&
      error.message === 'SESSION_EXPIRED'
    ) {

      router.replace('/login');

      return;

    }

    if (
      error instanceof Error &&
      error.message === 'TRANSACTION_NOT_FOUND'
    ) {

      alert(
        'Transaksi tidak ditemukan atau sudah dihapus.'
      );

      await loadTransactions();

      return;

    }

    alert(
      'Gagal mengambil detail transaksi.'
    );

  } finally {

    setDetailLoading(false);

  }

}


    // =========================================================
//          openEdit
    // ===========================================================
    function openEdit(
  transaction: Transaction
) {

  setEditTransaction(
    transaction
  );

  setEditType(
    transaction.type
  );

  setEditDescription(
    transaction.description
  );

  setEditAmount(
    String(transaction.amount)
  );

}

    // ==================================================
    // SAVE EDIT
    // ====================================================

    async function saveEdit() {

  if (!editTransaction) {
    return;
  }

  if (
    !editDescription.trim()
  ) {

    alert(
      'Keterangan tidak boleh kosong.'
    );

    return;

  }

  const amount =
    Number(editAmount);

  if (
    !amount ||
    amount <= 0
  ) {

    alert(
      'Nominal harus lebih besar dari 0.'
    );

    return;

  }

  try {

    setSavingEdit(true);

    await updateTransaction(
      editTransaction.id,
      {
        type: editType,
        description:
          editDescription.trim(),
        amount: amount,
      }
    );

    setEditTransaction(null);

    await loadTransactions();

  } catch (error) {

    console.error(
      'Gagal mengubah transaksi:',
      error
    );

    if (
      error instanceof Error &&
      error.message === 'SESSION_EXPIRED'
    ) {

      router.replace('/login');

      return;

    }

    if (
      error instanceof Error &&
      error.message === 'TRANSACTION_NOT_FOUND'
    ) {

      alert(
        'Transaksi tidak ditemukan atau sudah dihapus.'
      );

      setEditTransaction(null);

      await loadTransactions();

      return;

    }

    alert(
      error instanceof Error
        ? error.message
        : 'Gagal mengubah transaksi.'
    );

  } finally {

    setSavingEdit(false);

  }

}

    // ================================================
    // CONFIRM DELETE
    // =================================================

    async function confirmDelete() {

  if (!deleteTarget) {
    return;
  }

  try {

    setDeleting(true);

    await deleteTransaction(
      deleteTarget.id
    );

    setDeleteTarget(null);

    await loadTransactions();

  } catch (error) {

    console.error(
      'Gagal menghapus transaksi:',
      error
    );

    if (
      error instanceof Error &&
      error.message === 'SESSION_EXPIRED'
    ) {

      router.replace('/login');

      return;

    }

    if (
      error instanceof Error &&
      error.message === 'TRANSACTION_NOT_FOUND'
    ) {

      alert(
        'Transaksi tidak ditemukan atau sudah dihapus.'
      );

      setDeleteTarget(null);

      await loadTransactions();

      return;

    }

    alert(
      error instanceof Error
        ? error.message
        : 'Gagal menghapus transaksi.'
    );

  } finally {

    setDeleting(false);

  }

}
  

  // =====================================================
  // RENDER LOADING AWAL
  // =====================================================

  if (
    loading &&
    !user
  ) {

    return (

      <div className="min-h-screen bg-gray-50">

        {/* <DashboardNav /> */}

        <div className="min-h-[70vh] flex items-center justify-center">

          <div className="text-gray-500">

            Memuat transaksi...

          </div>

        </div>

      </div>

    );

  }

  // =====================================================
// SIMPAN TRANSAKSI BARU
// =====================================================

async function saveAddTransaction() {

  if (!addDescription.trim()) {

    alert(
      'Keterangan tidak boleh kosong.'
    );

    return;

  }

  const amount =
    Number(addAmount);

  if (!amount || amount <= 0) {

    alert(
      'Nominal harus lebih besar dari 0.'
    );

    return;

  }

  try {

    setSavingAdd(true);

    await createTransaction({
      type: addType,
      description:
        addDescription.trim(),
      amount: amount,
    });

    // ================================================
    // RESET FORM
    // ================================================

    setAddType('IN');
    setAddDescription('');
    setAddAmount('');

    setShowAddTransaction(false);

    // ================================================
    // REFRESH DATA
    // ================================================

    await loadTransactions();

  } catch (error) {

    console.error(
      'Gagal menambahkan transaksi:',
      error
    );

    if (
      error instanceof Error &&
      error.message === 'SESSION_EXPIRED'
    ) {

      router.replace('/login');

      return;

    }

    alert(
      error instanceof Error
        ? error.message
        : 'Gagal menambahkan transaksi.'
    );

  } finally {

    setSavingAdd(false);

  }

}

  // =====================================================
  // RENDER
  // =====================================================

  return (

    <>

        
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

                  {/* {user.username} */}

                </span>

              </div>


            

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          NAVIGATION
      ================================================= */}
    
    <div className="flex">

     {/* SIDEBAR */}
      {/* <DashboardNav /> */}


      {/* =================================================
          MAIN
      ================================================= */}

      {/* <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6"> */}


        {/* =================================================
            HEADER
        ================================================= */}

        {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"> */}

      <div className="flex-1 min-w-0">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          <div className="flex items-center justify-between">


          <div>

            <h1 className="text-2xl font-bold text-gray-900">

              Transaksi

            </h1>


            <p className="text-sm text-gray-500 mt-1">

              Riwayat pemasukan dan pengeluaran Anda

            </p>

          </div>


            <div className="flex flex-wrap items-center gap-2">

                <button
                    onClick={() =>
                    setShowAddTransaction(true)
                    }
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
                >

                    + Tambah Transaksi

                </button>


                <button
                    onClick={() =>
                    router.push('/dashboard')
                    }
                    className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition"
                >

                    ← Dashboard

                </button>

            </div>

          </div>
        </div>

        {/* =================================================
            FILTER PERIODE
        ================================================= */}

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">


          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">


            <div>

              <h2 className="font-semibold text-gray-900">

                Periode Transaksi

              </h2>


              <p className="text-xs text-gray-400 mt-1">

                Pilih periode transaksi yang ingin dilihat

              </p>

            </div>


            <div className="flex flex-wrap gap-2">


              {/* TODAY */}

              <button
                onClick={() =>
                  handleFilter('today')
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                  filter === 'today'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >

                Hari Ini

              </button>


              {/* WEEK */}

              <button
                onClick={() =>
                  handleFilter('week')
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                  filter === 'week'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >

                7 Hari

              </button>


              {/* MONTH */}

              <button
                onClick={() =>
                  handleFilter('month')
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                  filter === 'month'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >

                Bulan Ini

              </button>

            </div>

          </div>

        </section>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">

            {error}

          </div>

        )}


        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">


          {/* PEMASUKAN */}

          <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">

                  Pemasukan

                </p>


                <p className="text-2xl font-bold text-green-600 mt-2">

                  {formatRupiah(
                    totalIncome
                  )}

                </p>

              </div>


              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">

                ↓

              </div>

            </div>


            <p className="text-xs text-gray-400 mt-4">

              Total hasil pencarian

            </p>

          </div>


          {/* PENGELUARAN */}

          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">

                  Pengeluaran

                </p>


                <p className="text-2xl font-bold text-red-600 mt-2">

                  {formatRupiah(
                    totalExpense
                  )}

                </p>

              </div>


              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl">

                ↑

              </div>

            </div>


            <p className="text-xs text-gray-400 mt-4">

              Total hasil pencarian

            </p>

          </div>


          {/* SALDO */}

          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">

                  Selisih Periode

                </p>


                <p
                  className={`text-2xl font-bold mt-2 ${
                    periodBalance >= 0
                      ? 'text-blue-600'
                      : 'text-red-600'
                  }`}
                >

                  {formatRupiah(
                    periodBalance
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

        </section>


        {/* =================================================
            SEARCH
        ================================================= */}

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">


          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">


            <div>

              <h2 className="font-semibold text-gray-900">

                Cari Transaksi

              </h2>


              <p className="text-xs text-gray-400 mt-1">

                Cari berdasarkan keterangan atau nomor WhatsApp

              </p>

            </div>


            <div className="w-full md:w-96">

              <div className="relative">

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    handleSearch(
                      e.target.value
                    )
                  }
                  placeholder="Cari transaksi..."
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />


                {search && (

                  <button
                    onClick={() =>
                      handleSearch('')
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    title="Hapus pencarian"
                  >

                    ×

                  </button>

                )}

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            TABLE
        ================================================= */}

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">


          {/* TABLE HEADER */}

          <div className="px-5 sm:px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

            <div>

              <h2 className="text-lg font-semibold text-gray-900">

                Daftar Transaksi

              </h2>


              <p className="text-xs text-gray-400 mt-1">

                Menampilkan transaksi terbaru terlebih dahulu

              </p>

            </div>


            <div className="text-sm text-gray-400">

              {filteredTransactions.length}{' '}

              transaksi

            </div>

          </div>


          {/* LOADING */}

          {loading ? (

            <div className="px-6 py-16 text-center">

              <div className="text-gray-500">

                Memuat transaksi...

              </div>

            </div>

          ) : filteredTransactions.length === 0 ? (

            /* EMPTY */

            <div className="px-6 py-16 text-center">

              <div className="text-4xl mb-3">

                📋

              </div>


              <p className="text-gray-500 font-medium">

                Tidak ada transaksi

              </p>


              <p className="text-sm text-gray-400 mt-1">

                {search
                  ? 'Tidak ditemukan transaksi yang sesuai dengan pencarian.'
                  : 'Belum ada transaksi pada periode ini.'
                }

              </p>

            </div>

          ) : (

            /* TABLE */

            <>

              <div className="overflow-x-auto">

                <table className="w-full min-w-[950px]">


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

                        Keterangan

                      </th>


                      <th className="px-5 py-4 text-center">

                        Tipe

                      </th>


                      <th className="px-5 py-4 text-right">

                        Nominal

                      </th>


                      <th className="px-5 py-4 text-center">

                        AKSI

                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {paginatedTransactions.map(
                      (
                        transaction,
                        index
                      ) => (

                        <tr
                          key={
                            transaction.id
                          }
                          className="border-t border-gray-100 hover:bg-gray-50 transition"
                        >


                          {/* NO */}

                          <td className="px-5 py-4 text-sm text-gray-500">

                            {(
                              (
                                currentPage -
                                1
                              ) *
                                itemsPerPage
                            ) +
                              index +
                              1}

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

                            <span className="font-mono text-sm text-gray-700">

                              {
                                transaction.whatsappNumber
                              }

                            </span>

                          </td>


                          {/* KETERANGAN */}

                          <td className="px-5 py-4">

                            <span className="text-sm text-gray-700">

                              {
                                transaction.description
                              }

                            </span>

                          </td>


                          {/* TIPE */}

                          <td className="px-5 py-4 text-center">

                            {transaction.type ===
                            'IN' ? (

                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">

                                PEMASUKAN

                              </span>

                            ) : (

                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">

                                PENGELUARAN

                              </span>

                            )}

                          </td>


                          {/* NOMINAL */}

                          <td className="px-5 py-4 text-right whitespace-nowrap">

                            <span
                              className={`text-sm font-bold ${
                                transaction.type ===
                                'IN'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >

                              {transaction.type ===
                              'IN'
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


                              {/* AKSI */}

                            <td className="px-5 py-4">

                            <div className="flex items-center justify-center gap-2">

                                {/* DETAIL */}

                                <button
                                onClick={() =>
                                    openDetail(transaction)
                                }
                                disabled={detailLoading}
                                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold transition disabled:opacity-50"
                                >

                                Detail

                                </button>


                                {/* EDIT */}

                                <button
                                onClick={() =>
                                    openEdit(transaction)
                                }
                                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs font-semibold transition"
                                >

                                Edit

                                </button>


                                {/* DELETE */}

                                <button
                                onClick={() =>
                                    setDeleteTarget(transaction)
                                }
                                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition"
                                >

                                Hapus

                                </button>

{/* =================================================
    TAMBAH TRANSAKSI MODAL
================================================= */}

{showAddTransaction && (

  <div
    className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40"
    onClick={() => {

      if (!savingAdd) {
        setShowAddTransaction(false);
      }

    }}
  >

    <div
      className="w-full max-w-lg bg-white rounded-2xl shadow-xl"
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      {/* ============================================
          HEADER
      ============================================ */}

      <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">

        <div>

          <h2 className="text-lg font-bold text-gray-900">

            Tambah Transaksi

          </h2>

          <p className="text-xs text-gray-400 mt-1">

            Catat pemasukan atau pengeluaran

          </p>

        </div>


        <button
          disabled={savingAdd}
          onClick={() =>
            setShowAddTransaction(false)
          }
          className="w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-500 text-xl transition disabled:opacity-40"
          aria-label="Tutup"
        >

          ×

        </button>

      </div>


      {/* ============================================
          FORM
      ============================================ */}

      <div className="p-6 space-y-5">


        {/* JENIS TRANSAKSI */}

        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">

            Jenis Transaksi

          </label>


          <div className="grid grid-cols-2 gap-3">


            {/* PEMASUKAN */}

            <button
              type="button"
              disabled={savingAdd}
              onClick={() =>
                setAddType('IN')
              }
              className={`py-3 rounded-xl border text-sm font-semibold transition ${
                addType === 'IN'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >

              <div className="text-lg mb-1">

                ↓

              </div>

              Pemasukan

            </button>


            {/* PENGELUARAN */}

            <button
              type="button"
              disabled={savingAdd}
              onClick={() =>
                setAddType('OUT')
              }
              className={`py-3 rounded-xl border text-sm font-semibold transition ${
                addType === 'OUT'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >

              <div className="text-lg mb-1">

                ↑

              </div>

              Pengeluaran

            </button>

          </div>

        </div>


        {/* KETERANGAN */}

        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">

            Keterangan

          </label>

          <input
            type="text"
            value={addDescription}
            onChange={(e) =>
              setAddDescription(
                e.target.value
              )
            }
            disabled={savingAdd}
            placeholder="Contoh: Jual Baju Anak"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />

        </div>


        {/* NOMINAL */}

        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">

            Nominal

          </label>

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">

              Rp

            </span>

            <input
              type="number"
              min="1"
              value={addAmount}
              onChange={(e) =>
                setAddAmount(
                  e.target.value
                )
              }
              disabled={savingAdd}
              placeholder="150000"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />

          </div>

          <p className="text-xs text-gray-400 mt-2">

            Masukkan nominal tanpa titik atau koma.

          </p>

        </div>


        {/* PREVIEW */}

        {addAmount &&
          Number(addAmount) > 0 && (

          <div
            className={`rounded-xl p-4 border ${
              addType === 'IN'
                ? 'bg-green-50 border-green-100'
                : 'bg-red-50 border-red-100'
            }`}
          >

            <div className="flex items-center justify-between">

              <span className="text-sm text-gray-500">

                Preview

              </span>

              <span
                className={`text-lg font-bold ${
                  addType === 'IN'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >

                {addType === 'IN'
                  ? '+'
                  : '-'}

                {' '}

                {formatRupiah(
                  Number(addAmount)
                )}

              </span>

            </div>


            <p className="text-xs text-gray-400 mt-2">

              {addDescription ||
                'Belum ada keterangan'}

            </p>

          </div>

        )}

      </div>


      {/* ============================================
          FOOTER
      ============================================ */}

      <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">

        <button
          type="button"
          disabled={savingAdd}
          onClick={() =>
            setShowAddTransaction(false)
          }
          className="px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition disabled:opacity-50"
        >

          Batal

        </button>


        <button
          type="button"
          disabled={
            savingAdd ||
            !addDescription.trim() ||
            !addAmount ||
            Number(addAmount) <= 0
          }
          onClick={saveAddTransaction}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >

          {savingAdd
            ? 'Menyimpan...'
            : 'Simpan Transaksi'}

        </button>

      </div>

    </div>

  </div>

)}




                            </div>

                            </td>


                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>


              {/* =================================================
                  PAGINATION
              ================================================= */}

              {totalPages > 1 && (

                <div className="px-5 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">


                  {/* INFO */}

                  <div className="text-sm text-gray-500">

                    Menampilkan{' '}

                    <span className="font-semibold text-gray-700">

                      {
                        (
                          (
                            currentPage -
                            1
                          ) *
                            itemsPerPage
                        ) +
                        1
                      }

                    </span>

                    {' '}sampai{' '}

                    <span className="font-semibold text-gray-700">

                      {Math.min(
                        currentPage *
                          itemsPerPage,
                        filteredTransactions.length
                      )}

                    </span>

                    {' '}dari{' '}

                    <span className="font-semibold text-gray-700">

                      {
                        filteredTransactions.length
                      }

                    </span>

                    {' '}transaksi

                  </div>


                  {/* BUTTON */}

                  <div className="flex items-center gap-1">


                    {/* PREVIOUS */}

                    <button
                      onClick={() =>
                        goToPage(
                          currentPage - 1
                        )
                      }
                      disabled={
                        currentPage === 1
                      }
                      className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >

                      ←

                    </button>


                    {/* PAGE NUMBERS */}

                    {Array.from(
                      {
                        length: totalPages,
                      },
                      (_, index) =>
                        index + 1
                    ).map(
                      (page) => (

                        <button
                          key={page}
                          onClick={() =>
                            goToPage(
                              page
                            )
                          }
                          className={`min-w-[38px] px-3 py-2 rounded-lg text-sm font-medium transition ${
                            currentPage ===
                            page
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >

                          {page}

                        </button>

                      )
                    )}


                    {/* NEXT */}

                    <button
                      onClick={() =>
                        goToPage(
                          currentPage + 1
                        )
                      }
                      disabled={
                        currentPage ===
                        totalPages
                      }
                      className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >

                      →

                    </button>

                  </div>

                </div>

              )}

            </>

          )}

        </section>


        {/* =================================================
            FOOTER INFO
        ================================================= */}

        <div className="mt-4 text-xs text-gray-400">

          Data transaksi ditampilkan berdasarkan akun yang sedang login.

        </div>


      </div>


      {/* =================================================
          DETAIL MODAL
      ================================================= */}

      {selectedTransaction && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() =>
            setSelectedTransaction(null)
          }
            // onClick={() =>
            // openDetail(transaction)
            // }
        >

          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* MODAL HEADER */}

            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-bold text-gray-900">

                  Detail Transaksi

                </h2>


                <p className="text-xs text-gray-400 mt-1">

                  ID Transaksi #{selectedTransaction.id}

                </p>

              </div>


              <button
                onClick={() =>
                  setSelectedTransaction(null)
                }
                className="w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-500 text-xl transition"
                aria-label="Tutup"
              >

                ×

              </button>

            </div>


            {/* MODAL CONTENT */}

            <div className="p-6 space-y-5">


              {/* NOMINAL */}

              <div className="text-center py-3">

                <p className="text-sm text-gray-500">

                  {selectedTransaction.type ===
                  'IN'
                    ? 'Pemasukan'
                    : 'Pengeluaran'}

                </p>


                <p
                  className={`text-3xl font-bold mt-2 ${
                    selectedTransaction.type ===
                    'IN'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >

                  {selectedTransaction.type ===
                  'IN'
                    ? '+'
                    : '-'}

                  {' '}

                  {formatRupiah(
                    Number(
                      selectedTransaction.amount
                    )
                  )}

                </p>

              </div>


              {/* DETAIL ROW */}

              <div className="border-t border-gray-100 pt-4 space-y-4">


                {/* TANGGAL */}

                <div className="flex justify-between gap-4">

                  <span className="text-sm text-gray-500">

                    Tanggal

                  </span>


                  <div className="text-right">

                    <p className="text-sm font-medium text-gray-800">

                      {formatTanggal(
                        selectedTransaction.createdAt
                      )}

                    </p>


                    <p className="text-xs text-gray-400 mt-1">

                      {formatJam(
                        selectedTransaction.createdAt
                      )}

                    </p>

                  </div>

                </div>


                {/* WHATSAPP */}

                <div className="flex justify-between gap-4">

                  <span className="text-sm text-gray-500">

                    WhatsApp

                  </span>


                  <span className="text-sm font-mono text-gray-800">

                    {
                      selectedTransaction.whatsappNumber
                    }

                  </span>

                </div>


                {/* JENIS */}

                <div className="flex justify-between gap-4">

                  <span className="text-sm text-gray-500">

                    Jenis

                  </span>


                  {selectedTransaction.type ===
                  'IN' ? (

                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">

                      PEMASUKAN

                    </span>

                  ) : (

                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">

                      PENGELUARAN

                    </span>

                  )}

                </div>


                {/* KETERANGAN */}

                <div>

                  <p className="text-sm text-gray-500 mb-2">

                    Keterangan

                  </p>


                  <div className="bg-gray-50 rounded-lg p-3">

                    <p className="text-sm text-gray-800">

                      {
                        selectedTransaction.description
                      }

                    </p>

                  </div>

                </div>


              </div>

            </div>


            {/* MODAL FOOTER */}

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">

              <button
                onClick={() =>
                  setSelectedTransaction(null)
                }
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition"
              >

                Tutup

              </button>

            </div>

          </div>

        </div>

      )}

      {/* =================== */}

      {/* =================================================
    EDIT MODAL
================================================= */}

{editTransaction && (

  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    onClick={() => {

      if (!savingEdit) {
        setEditTransaction(null);
      }

    }}
  >

    <div
      className="w-full max-w-lg bg-white rounded-2xl shadow-xl"
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      {/* HEADER */}

      <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">

        <div>

          <h2 className="text-lg font-bold text-gray-900">

            Edit Transaksi

          </h2>

          <p className="text-xs text-gray-400 mt-1">

            ID Transaksi #{editTransaction.id}

          </p>

        </div>

        <button
          disabled={savingEdit}
          onClick={() =>
            setEditTransaction(null)
          }
          className="w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-500 text-xl transition disabled:opacity-40"
        >

          ×

        </button>

      </div>


      {/* FORM */}

      <div className="p-6 space-y-5">

        {/* TYPE */}

        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">

            Jenis Transaksi

          </label>

          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={() =>
                setEditType('IN')
              }
              className={`py-2.5 rounded-lg border text-sm font-semibold transition ${
                editType === 'IN'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >

              Pemasukan

            </button>

            <button
              type="button"
              onClick={() =>
                setEditType('OUT')
              }
              className={`py-2.5 rounded-lg border text-sm font-semibold transition ${
                editType === 'OUT'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >

              Pengeluaran

            </button>

          </div>

        </div>


        {/* DESCRIPTION */}

        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">

            Keterangan

          </label>

          <input
            type="text"
            value={editDescription}
            onChange={(e) =>
              setEditDescription(
                e.target.value
              )
            }
            disabled={savingEdit}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />

        </div>


        {/* AMOUNT */}

        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">

            Nominal

          </label>

          <input
            type="number"
            min="1"
            value={editAmount}
            onChange={(e) =>
              setEditAmount(
                e.target.value
              )
            }
            disabled={savingEdit}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />

        </div>

      </div>


      {/* FOOTER */}

      <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">

        <button
          onClick={() =>
            setEditTransaction(null)
          }
          disabled={savingEdit}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium disabled:opacity-50"
        >

          Batal

        </button>


        <button
          onClick={saveEdit}
          disabled={savingEdit}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50"
        >

          {savingEdit
            ? 'Menyimpan...'
            : 'Simpan Perubahan'}

        </button>

      </div>

    </div>

  </div>

)}

    {/* =================================================
    DELETE CONFIRMATION MODAL
================================================= */}

{deleteTarget && (

  <div
    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40"
    onClick={() => {

      if (!deleting) {
        setDeleteTarget(null);
      }

    }}
  >

    <div
      className="w-full max-w-md bg-white rounded-2xl shadow-xl"
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      {/* HEADER */}

      <div className="p-6">

        <div className="flex items-start gap-4">

          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl flex-shrink-0">

            !

          </div>


          <div>

            <h2 className="text-lg font-bold text-gray-900">

              Hapus Transaksi?

            </h2>

            <p className="text-sm text-gray-500 mt-1">

              Transaksi ini akan dihapus secara permanen.

            </p>

          </div>

        </div>


        {/* TRANSACTION INFO */}

        <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100">

          <div className="flex justify-between gap-4">

            <span className="text-sm text-gray-500">

              Keterangan

            </span>

            <span className="text-sm font-medium text-gray-800 text-right">

              {deleteTarget.description}

            </span>

          </div>


          <div className="flex justify-between gap-4 mt-3">

            <span className="text-sm text-gray-500">

              Jenis

            </span>

            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                deleteTarget.type === 'IN'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >

              {deleteTarget.type === 'IN'
                ? 'PEMASUKAN'
                : 'PENGELUARAN'}

            </span>

          </div>


          <div className="flex justify-between gap-4 mt-3">

            <span className="text-sm text-gray-500">

              Nominal

            </span>

            <span
              className={`text-sm font-bold ${
                deleteTarget.type === 'IN'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >

              {deleteTarget.type === 'IN'
                ? '+'
                : '-'}

              {' '}

              {formatRupiah(
                Number(
                  deleteTarget.amount
                )
              )}

            </span>

          </div>

        </div>

      </div>


      {/* FOOTER */}

      <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">

        <button
          disabled={deleting}
          onClick={() =>
            setDeleteTarget(null)
          }
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium disabled:opacity-50"
        >

          Batal

        </button>


        <button
          disabled={deleting}
          onClick={confirmDelete}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-50"
        >

          {deleting
            ? 'Menghapus...'
            : 'Ya, Hapus Transaksi'}

        </button>

      </div>

    </div>

  </div>

)}

    </div>

    </>

  );

}