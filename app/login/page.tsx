'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../services/api';

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (!username.trim()) {
      setError('Username wajib diisi');
      return;
    }

    if (!password) {
      setError('Password wajib diisi');
      return;
    }

    try {
      setLoading(true);

      await login(username, password);

      // Login berhasil
      router.replace('/dashboard');

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login gagal');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f6fa',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: '#ffffff',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <h1
          style={{
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          BukuWarung ADZRA
        </h1>

        <p
          style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '28px',
          }}
        >
          Silakan login ke akun Anda
        </p>

        {error && (
          <div
            style={{
              background: '#ffe5e5',
              color: '#c62828',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="username"
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
              }}
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              autoComplete="username"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '500',
              }}
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              autoComplete="current-password"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              background: loading ? '#999' : '#1976d2',
              color: '#fff',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Sedang login...' : 'Login'}
          </button>

            <p className="text-center text-sm text-gray-500 mt-6">
    Belum punya akun?{' '}
    <button
        type="button"
        onClick={() => router.push('/register')}
        className="font-medium text-blue-600 hover:text-blue-700"
    >
        Daftar sekarang
    </button>
</p>

        </form>
      </div>
    </main>
  );
}