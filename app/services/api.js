
const BASE_URL = '/api/v1';


export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Login gagal');
  }

  return data;
}

export async function logout() {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Logout gagal');
  }

  return data;
}

// =====================================================
// REGISTER
// =====================================================

export async function register(data) {

    const response = await fetch(
        `${BASE_URL}/auth/register`,
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
            },

            // credentials: 'include',

            body: JSON.stringify(data),
        }
    );


    let result = null;

    try {
        result = await response.json();
    } catch (error) {
        result = null;
    }


    if (!response.ok) {

        throw new Error(
            result?.message ||
            'Registrasi gagal'
        );
    }


    return result;
}


export async function getCurrentUser() {
  const res = await fetch(
    `${BASE_URL}/auth/me`,
    {
      method: 'GET',
      cache: 'no-store',
      credentials: 'include',
    }
  );

  if (res.status === 401) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Gagal mengambil user: ${res.status}`);
  }

  return res.json();
}

export async function getSummary(period = 'today') {
  const res = await fetch(
    `${BASE_URL}/dashboard/summary?period=${period}`,
    {
      cache: 'no-store',
      credentials: 'include',
    }
  );

  if (!res.ok) {
    throw new Error(
      `Gagal mengambil summary: ${res.status}`
    );
  }

  return res.json();
}

export async function getTransactions(period = 'today') {
  const res = await fetch(
    `${BASE_URL}/dashboard/transactions?period=${period}`,
    {
      cache: 'no-store',
      credentials: 'include',
    }
  );

  if (!res.ok) {
    throw new Error(
      `Gagal mengambil transaksi: ${res.status}`
    );
  }

  return res.json();
}


/*
=====================================================
DOWNLOAD LAPORAN
=====================================================
*/

export async function downloadReport(
  format,
  startDate,
  endDate
) {
  const res = await fetch(
    `${BASE_URL}/reports/transactions/${format}?startDate=${startDate}&endDate=${endDate}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (res.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }

  if (!res.ok) {
    throw new Error(
      `Gagal mengunduh laporan: ${res.status}`
    );
  }

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;

  const extension = format === 'excel'
    ? 'xlsx'
    : 'pdf';

  link.download =
    `laporan-transaksi-${startDate}-sampai-${endDate}.${extension}`;

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
}


export async function getReportData(
  startDate,
  endDate
) {
  const params = new URLSearchParams({
    startDate,
    endDate,
  });

  const res = await fetch(
    `${BASE_URL}/reports/transactions?${params.toString()}`,
    {
      method: 'GET',
      cache: 'no-store',
      credentials: 'include',
    }
  );

  if (res.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }

  if (!res.ok) {
    throw new Error(
      `Gagal mengambil laporan: ${res.status}`
    );
  }

  return res.json();
}


export async function getAllTransactions() {
  const res = await fetch(
    `${BASE_URL}/transactions`,
    {
      method: 'GET',
      cache: 'no-store',
      credentials: 'include',
    }
  );

  if (res.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }

  if (!res.ok) {
    throw new Error(
      `Gagal mengambil transaksi: ${res.status}`
    );
  }

  return res.json();
}


export async function getTransaction(id) {
  const res = await fetch(
    `${BASE_URL}/transactions/${id}`,
    {
      method: 'GET',
      cache: 'no-store',
      credentials: 'include',
    }
  );

  if (res.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }

  if (res.status === 404) {
    throw new Error('TRANSACTION_NOT_FOUND');
  }

  if (!res.ok) {
    throw new Error(
      `Gagal mengambil transaksi: ${res.status}`
    );
  }

  return res.json();
}


export async function updateTransaction(
  id,
  data
) {
  const res = await fetch(
    `${BASE_URL}/transactions/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    }
  );

  if (res.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }

  if (res.status === 404) {
    throw new Error('TRANSACTION_NOT_FOUND');
  }

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message ||
      'Gagal mengubah transaksi'
    );
  }

  return result;
}


export async function deleteTransaction(id) {
  const res = await fetch(
    `${BASE_URL}/transactions/${id}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  );

  if (res.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }

  if (res.status === 404) {
    throw new Error('TRANSACTION_NOT_FOUND');
  }

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message ||
      'Gagal menghapus transaksi'
    );
  }

  return result;
}

export async function createTransaction(data) {

  const res = await fetch(
    `${BASE_URL}/transactions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    }
  );

  if (res.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }

  const result =
    await res.json();

  if (!res.ok) {

    throw new Error(
      result.message ||
      'Gagal menambahkan transaksi'
    );

  }

  return result;
}

export async function getMyShop() {
    const response = await fetch(
        `${BASE_URL}/shop/me`,
        {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store'
        }
    );

    if (!response.ok) {
        throw new Error(
            'Gagal mengambil data warung'
        );
    }

    return response.json();
}

export async function getShopUsers() {
  const response = await fetch(`${BASE_URL}/shop/users`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Gagal mengambil pengguna warung');
  }

  return data;
}

export async function createShopUser(payload) {
  const response = await fetch(`${BASE_URL}/shop/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Gagal menambah pengguna');
  }

  return data;
}

export async function updateShopUser(userId, payload) {
  const response = await fetch(`${BASE_URL}/shop/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Gagal mengubah pengguna');
  }

  return data;
}

export async function deleteShopUser(userId) {
  const response = await fetch(`${BASE_URL}/shop/users/${userId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Gagal menghapus pengguna');
  }

  return data;
}