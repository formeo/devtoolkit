'use client';
import Sidebar from '../components/Sidebar';

export default function ClientLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 max-w-[960px] overflow-auto">
        {children}
      </main>
    </div>
  );
}
