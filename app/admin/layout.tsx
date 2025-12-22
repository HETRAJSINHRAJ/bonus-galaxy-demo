import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { Role } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Check if user has admin access
  const userRole = user.publicMetadata?.role as Role;
  const allowedRoles = [Role.VIEWER, Role.EDITOR, Role.ADMIN, Role.SUPER_ADMIN];

  if (!userRole || !allowedRoles.includes(userRole)) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">Mission CMS</h2>
            <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
          </div>
          <nav className="px-4 space-y-1">
            <a
              href="/admin/missions"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Missions
            </a>
            <a
              href="/admin/missions/analytics"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Analytics
            </a>
            <a
              href="/admin/missions/create"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Create Mission
            </a>
            {(userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN) && (
              <a
                href="/admin/settings"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Settings
              </a>
            )}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
