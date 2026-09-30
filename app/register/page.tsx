'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../services/api';

export default function RegisterPage() {

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [shopName, setShopName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  async function handleRegister(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    setError('');
    setSuccess('');


    // =====================================================
    // VALIDASI FRONTEND
    // =====================================================

    if (!shopName.trim()) {
      setError('Nama warung wajib diisi');
      return;
    }

    if (!username.trim()) {
      setError('Username wajib diisi');
      return;
    }

    if (!email.trim()) {
      setError('Email wajib diisi');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    if (!whatsappNumber.trim()) {
      setError('Nomor WhatsApp wajib diisi');
      return;
    }


    try {

      setLoading(true);


      // =====================================================
      // REQUEST REGISTER
      // =====================================================

      try {

    setLoading(true);

    await register({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        whatsapp_number: whatsappNumber.trim(),
        shop_name: shopName.trim(),
    });


    // =================================================
    // SUCCESS
    // =================================================

    setSuccess(
        'Registrasi berhasil. Silakan login.'
    );


    // Bersihkan form

    setUsername('');
    setEmail('');
    setPassword('');
    setWhatsappNumber('');
    setShopName('');


    // Pindah ke login

    setTimeout(() => {
        router.push('/login');
    }, 1500);


} catch (error) {

    console.error(
        'Register error:',
        error
    );


    setError(
        error instanceof Error
            ? error.message
            : 'Registrasi gagal'
    );

} finally {

    setLoading(false);

}

      // =====================================================
      // SUCCESS
      // =====================================================

      setSuccess(
        'Registrasi berhasil. Silakan login.'
      );


      // Bersihkan form

      setUsername('');
      setEmail('');
      setPassword('');
      setWhatsappNumber('');
      setShopName('');


      // Pindah ke login

      setTimeout(() => {
        router.push('/login');
      }, 1500);


    } catch (error) {

      console.error(
        'Register error:',
        error
      );

      setError(
        'Tidak dapat terhubung ke server'
      );

    } finally {

      setLoading(false);

    }
  }


  return (

    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* =================================================
            CARD
        ================================================= */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="text-center mb-8">

            <div className="text-4xl mb-3">
              🏪
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Buat Akun
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Daftarkan warung Anda
            </p>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>

          )}


          {/* =================================================
              SUCCESS
          ================================================= */}

          {success && (

            <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              {success}
            </div>

          )}


          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >


            {/* =================================================
                NAMA WARUNG
            ================================================= */}

            <div>

              <label
                htmlFor="shopName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama Warung
              </label>

              <input
                id="shopName"
                type="text"
                value={shopName}
                onChange={(event) =>
                  setShopName(event.target.value)
                }
                placeholder="Contoh: Warung Gysha Qisthy"
                maxLength={150}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />

              <p className="text-xs text-gray-400 mt-1">
                Nama warung yang akan tampil di dashboard
              </p>

            </div>


            {/* =================================================
                USERNAME
            ================================================= */}

            <div>

              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Username"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />

            </div>


            {/* =================================================
                EMAIL
            ================================================= */}

            <div>

              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="nama@email.com"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />

            </div>


            {/* =================================================
                WHATSAPP
            ================================================= */}

            <div>

              <label
                htmlFor="whatsappNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nomor WhatsApp
              </label>

              <input
                id="whatsappNumber"
                type="text"
                value={whatsappNumber}
                onChange={(event) =>
                  setWhatsappNumber(event.target.value)
                }
                placeholder="628123456789"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />

              <p className="text-xs text-gray-400 mt-1">
                Gunakan nomor yang digunakan untuk mencatat transaksi WhatsApp
              </p>

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div>

              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Minimal 6 karakter"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />

            </div>


            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold transition"
            >

              {loading
                ? 'Mendaftarkan...'
                : 'Daftar Sekarang'}

            </button>

          </form>


          {/* =================================================
              LOGIN
          ================================================= */}

          <div className="text-center mt-6">

            <p className="text-sm text-gray-500">

              Sudah punya akun?{' '}

              <button
                type="button"
                onClick={() =>
                  router.push('/login')
                }
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Login
              </button>

            </p>

          </div>

        </div>

      </div>

    </div>

  );
}