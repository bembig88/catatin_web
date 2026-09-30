import DashboardNav from '../components/DashboardNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex min-h-screen">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <DashboardNav />


        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="flex-1 min-w-0">

          {children}

        </main>

      </div>

    </div>
  );
}