
// 'use client';

// import { usePathname, useRouter } from 'next/navigation';


// export default function DashboardNav() {

//   const router = useRouter();

//   const pathname = usePathname();


//   const menus = [
//     {
//       label: 'Ringkasan',
//       path: '/dashboard',
//     },
//     {
//       label: 'Transaksi',
//       path: '/dashboard/transactions',
//     },
//     {
//       label: 'Laporan',
//       path: '/dashboard/reports',
//     },
//   ];


//   return (

//     <div className="bg-white border-b border-gray-200">

//       <div className="max-w-7xl mx-auto px-4 sm:px-6">

//         <div className="flex gap-2 overflow-x-auto">

//           {menus.map((menu) => {

//             // const active =
//             //   menu.path === '/dashboard'
//             //     ? pathname === '/dashboard'
//             //     : pathname.startsWith(
//             //         menu.path
//             //       );

//             const active =
//                 pathname === menu.path ||
//                 (
//                   menu.label === 'Laporan' &&
//                   pathname.startsWith('/dashboard/reports')
//                 ) ||
//                 (
//                   menu.label === 'Transaksi' &&
//                   pathname.startsWith('/dashboard/transactions')
//                 ); 

//             return (

//               <button
//                 key={menu.label}
//                 onClick={() =>
//                   router.push(menu.path)
//                 }
//                 className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
//                   active
//                     ? 'text-blue-600 border-blue-600'
//                     : 'text-gray-500 border-transparent hover:text-gray-900'
//                 }`}
//               >

//                 {menu.label}

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
    <div className="bg-white border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex gap-1 overflow-x-auto">

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
                  flex items-center gap-2
                  px-5 py-3
                  text-sm font-medium
                  whitespace-nowrap
                  border-b-2
                  transition
                  ${
                    active
                      ? 'text-blue-600 border-blue-600 bg-blue-50/40'
                      : 'text-gray-500 border-transparent hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >

                <span>
                  {menu.icon}
                </span>

                <span>
                  {menu.label}
                </span>

              </button>

            );

          })}

        </div>

      </div>

    </div>
  );
}