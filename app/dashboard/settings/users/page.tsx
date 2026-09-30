'use client';

import { useEffect, useState } from 'react';

import {
  getShopUsers,
  createShopUser,
  deleteShopUser,
  getCurrentUser,
  updateShopUser,
} from '../../../services/api';

type ShopUser = {
  userId: number;
  username: string;
  email: string;
  whatsapp_number: string;
  role: string;
  enabled: boolean;
};

type CurrentUser = {
  user_id: number;  
  username: string;
  email: string;
  role: string;
  shop_id: number;
};

type FormData = {
  username: string;
  email: string;
  whatsapp_number: string;
  password: string;
  role: string;
};

const initialForm: FormData = {
  username: '',
  email: '',
  whatsapp_number: '',
  password: '',
  role: 'CASHIER',
};

export default function ShopUsersPage() {
  const [users, setUsers] = useState<ShopUser[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<FormData>(initialForm);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

// ========================================================
                // state edit 
// ========================================================              
  const [showEditModal, setShowEditModal] = useState(false);

  const [editingUser, setEditingUser] =
  useState<ShopUser | null>(null);

  const [editForm, setEditForm] = useState({
   email: '',
   whatsapp_number: '',
   password: '',
   role: 'CASHIER',
   enabled: true,
  });

  const [editSaving, setEditSaving] = useState(false);

  const [editError, setEditError] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deletingUser, setDeletingUser] = useState<ShopUser | null>(null);

  const [deleteSaving, setDeleteSaving] = useState(false);

    // =======modal edit ====================

  function openEditModal(user: ShopUser) {
  setEditingUser(user);

  setEditForm({
    email: user.email || '',
    whatsapp_number: user.whatsapp_number || '',
    password: '',
    role: user.role || 'CASHIER',
    enabled: user.enabled,
  });

  setEditError('');
  setShowEditModal(true);
 }

function closeEditModal() {
  if (editSaving) {
    return;
  }

  setShowEditModal(false);
  setEditingUser(null);
  setEditError('');
}


  function handleEditChange(
  event: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement
  >
    ) {
    const { name, value } = event.target;

    setEditForm((previous) => ({
        ...previous,
        [name]: value,
    }));
    }

function handleEditEnabledChange(
  event: React.ChangeEvent<HTMLInputElement>
) {
  setEditForm((previous) => ({
    ...previous,
    enabled: event.target.checked,
  }));
}

 async function handleEditSubmit(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  if (!editingUser) {
    return;
  }

  setEditError('');

  if (!editForm.email.trim()) {
    setEditError('Email wajib diisi.');
    return;
  }

  if (!editForm.whatsapp_number.trim()) {
    setEditError('Nomor WhatsApp wajib diisi.');
    return;
  }

  if (
    editForm.password &&
    editForm.password.length < 6
  ) {
    setEditError(
      'Password minimal 6 karakter.'
    );
    return;
  }

  try {
    setEditSaving(true);

    const payload: any = {
      email: editForm.email.trim(),
      whatsapp_number:
        editForm.whatsapp_number.trim(),
      role: editForm.role,
      enabled: editForm.enabled,
    };

    /*
     * Password hanya dikirim jika diisi.
     *
     * Kalau kosong berarti password lama
     * tetap dipertahankan.
     */
    if (editForm.password) {
      payload.password = editForm.password;
    }

    await updateShopUser(
      editingUser.userId,
      payload
    );

    setShowEditModal(false);
    setEditingUser(null);
    setEditError('');

    await loadData();

  } catch (err: any) {
    console.error(err);

    setEditError(
      err.message ||
      'Gagal mengubah pengguna.'
    );
  } finally {
    setEditSaving(false);
  }
}


// ======================================================

  const canManage =
    currentUser?.role === 'OWNER' ||
    currentUser?.role === 'ADMIN';


   async function loadData() {
    try {
        setLoading(true);
        setError('');

        // Ambil user yang sedang login terlebih dahulu
        const me = await getCurrentUser();

        setCurrentUser(me);

        // Jika bukan OWNER / ADMIN,
        // jangan panggil endpoint /shop/users
        if (
        me?.role !== 'OWNER' &&
        me?.role !== 'ADMIN'
        ) {
        setUsers([]);
        return;
        }

    // Hanya OWNER / ADMIN yang mengambil daftar pengguna
    const userData = await getShopUsers();

    setUsers(userData);

    } catch (err: any) {
        console.error(err);

        setError(
        err.message || 'Gagal memuat data pengguna'
        );
    } finally {
        setLoading(false);
    }
    }

  useEffect(() => {
    loadData();
  }, []);

  function openAddModal() {
    setForm(initialForm);
    setFormError('');
    setShowModal(true);
  }

  function closeModal() {
    if (saving) {
      return;
    }

    setShowModal(false);
    setFormError('');
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setFormError('');

    if (!form.username.trim()) {
      setFormError('Username wajib diisi.');
      return;
    }

    if (!form.email.trim()) {
      setFormError('Email wajib diisi.');
      return;
    }

    if (!form.whatsapp_number.trim()) {
      setFormError('Nomor WhatsApp wajib diisi.');
      return;
    }

    if (!form.password) {
      setFormError('Password wajib diisi.');
      return;
    }

    if (form.password.length < 6) {
      setFormError('Password minimal 6 karakter.');
      return;
    }

    if (!form.role) {
      setFormError('Role wajib dipilih.');
      return;
    }

    try {
      setSaving(true);

      await createShopUser({
        username: form.username.trim(),
        email: form.email.trim(),
        whatsapp_number: form.whatsapp_number.trim(),
        password: form.password,
        role: form.role,
      });

      setShowModal(false);
      setForm(initialForm);
      setFormError('');

      await loadData();

    } catch (err: any) {
      console.error(err);

      setFormError(
        err.message || 'Gagal menambahkan pengguna.'
      );
    } finally {
      setSaving(false);
    }
  }

  

  function openDeleteModal(user: ShopUser) {
  setDeletingUser(user);
  setShowDeleteModal(true);
}

function closeDeleteModal() {
  if (deleteSaving) {
    return;
  }

  setShowDeleteModal(false);
  setDeletingUser(null);
}

async function handleDeleteConfirm() {
  if (!deletingUser) {
    return;
  }

  try {
    setDeleteSaving(true);

    await deleteShopUser(
      deletingUser.userId
    );

    setShowDeleteModal(false);
    setDeletingUser(null);

    await loadData();

  } catch (err: any) {
    console.error(err);

    alert(
      err.message ||
      'Gagal menonaktifkan pengguna'
    );

  } finally {
    setDeleteSaving(false);
  }
}

  function roleBadge(role: string) {
    const normalizedRole = role.toUpperCase();

    if (normalizedRole === 'OWNER') {
      return 'bg-purple-100 text-purple-700';
    }

    if (normalizedRole === 'ADMIN') {
      return 'bg-blue-100 text-blue-700';
    }

    if (normalizedRole === 'CASHIER') {
      return 'bg-green-100 text-green-700';
    }

    return 'bg-gray-100 text-gray-700';
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">
          Memuat pengguna warung...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Pengguna Warung
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola pengguna dan hak akses warung.
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            + Tambah Pengguna
          </button>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Tambahan */}

      {/* CONTENT */}
      
{!canManage ? (
  <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
    <div className="mb-3 text-4xl">
      🔒
    </div>

    <h2 className="text-lg font-semibold text-gray-800">
      Akses Terbatas
    </h2>

    <p className="mt-2 text-sm text-gray-500">
      Anda tidak memiliki izin untuk mengelola
      pengguna warung.
    </p>

    <p className="mt-1 text-xs text-gray-400">
      Role Anda: {currentUser?.role}
    </p>
  </div>
) : (

     <>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">
          <table className="min-w-full">

            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Pengguna
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Email
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  WhatsApp
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Role
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>

                {canManage && (
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                    Aksi
                  </th>
                )}

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={canManage ? 6 : 5}
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    Belum ada pengguna.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.userId}
                    className="hover:bg-gray-50"
                  >

                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-800">
                        {user.username}
                      </div>

                      {currentUser?.username === user.username && (
                        <div className="text-xs text-gray-400">
                          Anda
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {user.whatsapp_number}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${roleBadge(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {user.enabled ? (
                        <span className="text-sm text-green-600">
                          Aktif
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Nonaktif
                        </span>
                      )}
                    </td>

                   {canManage && (
  <td className="px-5 py-4">
    {user.role !== 'OWNER' &&
      user.userId !== currentUser?.user_id && (
      <div className="flex items-center justify-end gap-2">

        {/* Edit */}
        <button
          type="button"
          onClick={() => openEditModal(user)}
          title="Edit pengguna"
          aria-label={`Edit pengguna ${user.username}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 7.125 16.875 4.5"
            />
          </svg>
        </button>

        {/* Nonaktifkan */}
        <button
          type="button"
          onClick={() => openDeleteModal(user)}
          title="Nonaktifkan pengguna"
          aria-label={`Nonaktifkan pengguna ${user.username}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 7.5h12"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 7.5V5.75A1.75 1.75 0 0 1 10.75 4h2.5A1.75 1.75 0 0 1 15 5.75V7.5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 7.5.65 11.05A1.5 1.5 0 0 0 10.4 20h3.2a1.5 1.5 0 0 0 1.5-1.45l.65-11.05"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 11v5.5M13.5 11v5.5"
            />
          </svg>
        </button>

      </div>
    )}
  </td>
)}

                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>

      </div>

    </>

    )}

      {/* ========================= */}
      {/* MODAL TAMBAH PENGGUNA */}
      {/* ========================= */}

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Tambah Pengguna
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Tambahkan pengguna baru ke warung.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="text-2xl leading-none text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                ×
              </button>

            </div>

            {/* MODAL BODY */}
            <form onSubmit={handleSubmit}>

              <div className="space-y-4 px-6 py-5">

                {/* ERROR FORM */}
                {formError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {formError}
                  </div>
                )}

                {/* USERNAME */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Username
                  </label>

                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="contoh: kasir01"
                    autoComplete="username"
                    disabled={saving}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="kasir@email.com"
                    autoComplete="email"
                    disabled={saving}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  />
                </div>

                {/* WHATSAPP */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nomor WhatsApp
                  </label>

                  <input
                    type="text"
                    name="whatsapp_number"
                    value={form.whatsapp_number}
                    onChange={handleChange}
                    placeholder="628123456789"
                    autoComplete="tel"
                    disabled={saving}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Gunakan format nomor WhatsApp, misalnya
                    628123456789.
                  </p>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimal 6 karakter"
                    autoComplete="new-password"
                    disabled={saving}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  />
                </div>

                {/* ROLE */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Role
                  </label>

                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    disabled={saving}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  >
                    <option value="ADMIN">
                      ADMIN
                    </option>

                    <option value="CASHIER">
                      CASHIER
                    </option>

                    <option value="VIEWER">
                      VIEWER
                    </option>
                  </select>

                  <p className="mt-1 text-xs text-gray-400">
                    OWNER hanya dapat dibuat melalui proses
                    pendaftaran warung.
                  </p>
                </div>

              </div>

              {/* MODAL FOOTER */}
              <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? 'Menyimpan...'
                    : 'Simpan Pengguna'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ========================= */}
        {/* MODAL EDIT PENGGUNA */}
        {/* ========================= */}

        {showEditModal && editingUser && (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
                closeEditModal();
            }
            }}
        >

            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

                <div>
                <h2 className="text-lg font-semibold text-gray-800">
                    Edit Pengguna
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                    Ubah data dan hak akses pengguna.
                </p>
                </div>

                <button
                type="button"
                onClick={closeEditModal}
                disabled={editSaving}
                className="text-2xl leading-none text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                >
                ×
                </button>

            </div>

            {/* FORM */}
            <form onSubmit={handleEditSubmit}>

                <div className="space-y-4 px-6 py-5">

                {/* ERROR */}
                {editError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {editError}
                    </div>
                )}

                {/* USERNAME */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                    Username
                    </label>

                    <input
                    type="text"
                    value={editingUser.username}
                    disabled
                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
                    />

                    <p className="mt-1 text-xs text-gray-400">
                    Username tidak dapat diubah.
                    </p>
                </div>

                {/* EMAIL */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                    </label>

                    <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    disabled={editSaving}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                    />
                </div>

                {/* WHATSAPP */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nomor WhatsApp
                    </label>

                    <input
                    type="text"
                    name="whatsapp_number"
                    value={editForm.whatsapp_number}
                    onChange={handleEditChange}
                    disabled={editSaving}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                    />
                </div>

                {/* PASSWORD */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                    Password Baru
                    </label>

                    <input
                    type="password"
                    name="password"
                    value={editForm.password}
                    onChange={handleEditChange}
                    placeholder="Kosongkan jika tidak ingin mengubah"
                    autoComplete="new-password"
                    disabled={editSaving}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                    />

                    <p className="mt-1 text-xs text-gray-400">
                    Kosongkan jika password tidak ingin diubah.
                    </p>
                </div>

                {/* ROLE */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                    Role
                    </label>

                    <select
                    name="role"
                    value={editForm.role}
                    onChange={handleEditChange}
                    disabled={editSaving}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                    >
                    <option value="ADMIN">
                        ADMIN
                    </option>

                    <option value="CASHIER">
                        CASHIER
                    </option>

                    <option value="VIEWER">
                        VIEWER
                    </option>
                    </select>

                    <p className="mt-1 text-xs text-gray-400">
                    Role OWNER tidak dapat diberikan melalui menu ini.
                    </p>
                </div>

                {/* STATUS */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">

                    <label className="flex cursor-pointer items-center gap-3">

                    <input
                        type="checkbox"
                        checked={editForm.enabled}
                        onChange={handleEditEnabledChange}
                        disabled={editSaving}
                        className="h-4 w-4 rounded border-gray-300"
                    />

                    <div>
                        <div className="text-sm font-medium text-gray-700">
                        Pengguna aktif
                        </div>

                        <div className="text-xs text-gray-400">
                        Pengguna yang nonaktif tidak dapat login.
                        </div>
                    </div>

                    </label>

                </div>

                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">

                <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={editSaving}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Batal
                </button>

                <button
                    type="submit"
                    disabled={editSaving}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {editSaving
                    ? 'Menyimpan...'
                    : 'Simpan Perubahan'}
                </button>

                </div>

            </form>

            </div>

        </div>
        )}

        {/* ========================= */}
{/* MODAL KONFIRMASI NONAKTIFKAN */}
{/* ========================= */}

{showDeleteModal && deletingUser && (
  <div
    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        closeDeleteModal();
      }
    }}
  >

    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

      {/* HEADER */}
      <div className="border-b border-gray-200 px-6 py-5">

        <div className="flex items-start gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            !
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Nonaktifkan Pengguna?
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Anda akan menonaktifkan pengguna berikut:
            </p>

          </div>

        </div>

      </div>

      {/* BODY */}
      <div className="px-6 py-5">

        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">

          <div className="font-medium text-gray-800">
            {deletingUser.username}
          </div>

          <div className="mt-1 text-sm text-gray-500">
            {deletingUser.email}
          </div>

          <div className="mt-1 text-xs text-gray-400">
            Role: {deletingUser.role}
          </div>

        </div>

        <p className="mt-4 text-sm text-gray-600">
          Pengguna ini tidak akan dapat login ke aplikasi
          sampai statusnya diaktifkan kembali.
        </p>

      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">

        <button
          type="button"
          onClick={closeDeleteModal}
          disabled={deleteSaving}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Batal
        </button>

        <button
          type="button"
          onClick={handleDeleteConfirm}
          disabled={deleteSaving}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleteSaving
            ? 'Menonaktifkan...'
            : 'Ya, Nonaktifkan'}
        </button>

      </div>

    </div>

  </div>
)}

    </div>
  );

       

}