
// 'use client';

// import { usePathname, useRouter } from 'next/navigation';

// export default function DashboardNav() {

//   const router = useRouter();
//   const pathname = usePathname();

//   const menus = [
//     {
//       label: 'Ringkasan',
//       path: '/dashboard',
//       icon: '🏠',
//     },
//     {
//       label: 'Transaksi',
//       path: '/dashboard/transactions',
//       icon: '💰',
//     },
//     {
//       label: 'Laporan',
//       path: '/dashboard/reports',
//       icon: '📊',
//     },
//   ];

//   return (
//     <div className="bg-white border-b border-gray-200">

//       <div className="max-w-7xl mx-auto px-4 sm:px-6">

//         <div className="flex gap-1 overflow-x-auto">

//           {menus.map((menu) => {

//             const active =
//               menu.path === '/dashboard'
//                 ? pathname === '/dashboard'
//                 : pathname.startsWith(menu.path);

//             return (

//               <button
//                 key={menu.label}
//                 onClick={() => router.push(menu.path)}
//                 className={`
//                   flex items-center gap-2
//                   px-5 py-3
//                   text-sm font-medium
//                   whitespace-nowrap
//                   border-b-2
//                   transition
//                   ${
//                     active
//                       ? 'text-blue-600 border-blue-600 bg-blue-50/40'
//                       : 'text-gray-500 border-transparent hover:text-gray-900 hover:bg-gray-50'
//                   }
//                 `}
//               >

//                 <span>
//                   {menu.icon}
//                 </span>

//                 <span>
//                   {menu.label}
//                 </span>

//               </button>

//             );

//           })}

//         </div>

//       </div>

//     </div>
//   );
// }

'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function DashboardNav() {

  const router = useRouter();
  const pathname = usePathname();

  const menus = [
    {
      label: 'Ringkasan',
      path: '/dashboard',
      icon: '🏠',
    },
    {
      label: 'Transaksi',
      path: '/dashboard/transactions',
      icon: '💰',
    },
    {
      label: 'Laporan',
      path: '/dashboard/reports',
      icon: '📊',
    },
  ];

  return (
    // <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-81px)]">
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* =====================================================
          LOGO
      ===================================================== */}

      <div className="px-6 py-6 border-b border-gray-100">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl">
            🏪
          </div>

          <div>

            <div className="font-bold text-gray-900 text-lg">
              CATATAN
            </div>

            <div className="text-xs text-gray-400">
              Keuangan UMKM
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          MENU
      ===================================================== */}

      <nav className="p-4">

        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
          Menu Utama
        </div>

        <div className="space-y-1">

          {menus.map((menu) => {

            const active =
              menu.path === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(menu.path);

            return (

              <button
                key={menu.label}
                onClick={() => router.push(menu.path)}
                className={`
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-sm
                  font-medium
                  transition
                  text-left
                  ${
                    active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >

                <span className="text-lg w-6 text-center">
                  {menu.icon}
                </span>

                <span>
                  {menu.label}
                </span>

              </button>

            );

          })}

        </div>

      </nav>

 {/* =====================================================
          SETTING
      ===================================================== */}

          <div className="mt-6 mb-2 px-3 text-xs font-semibold uppercase text-gray-400">
            Pengaturan
          </div>

          <a
            href="/dashboard/settings/users"
            className="flex items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            👥
            <span className="ml-3">Pengguna Warung</span>
          </a>

      {/* =====================================================
          INFO
      ===================================================== */}

      <div className="px-4 mt-4">

        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">

          <div className="text-sm font-semibold text-blue-700">
            💡 Catatan
          </div>

          <p className="text-xs text-blue-600 mt-1 leading-relaxed">
            Catat pemasukan dan pengeluaran
            warung Anda dengan mudah.
          </p>

        </div>

      </div>

    </aside>
  );
}