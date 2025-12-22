'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Mission {
  id: string;
  title: string;
  type: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  pointsReward: number;
  currentCompletions: number;
  createdAt: string;
  _count: {
    userProgress: number;
  };
}

export default function MissionsPage() {
  const router = useRouter();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    isActive: '',
    page: 1,
  });
  const [selectedMissions, setSelectedMissions] = useState<string[]>([]);

  useEffect(() => {
    fetchMissions();
  }, [filters]);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.isActive) params.append('isActive', filters.isActive);
      params.append('page', filters.page.toString());

      const response = await fetch(`/api/admin/missions?${params}`);
      const data = await response.json();

      if (response.ok) {
        setMissions(data.missions);
      }
    } catch (error) {
      console.error('Error fetching missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedMissions.length === 0) return;

    try {
      const response = await fetch('/api/admin/missions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionIds: selectedMissions,
          action,
        }),
      });

      if (response.ok) {
        fetchMissions();
        setSelectedMissions([]);
      }
    } catch (error) {
      console.error('Bulk action error:', error);
    }
  };

  const toggleMissionSelection = (id: string) => {
    setSelectedMissions((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Missions</h1>
        <button
          onClick={() => router.push('/admin/missions/create')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Mission
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search missions..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Types</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="one-time">One-time</option>
            <option value="recurring">Recurring</option>
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Categories</option>
            <option value="shopping">Shopping</option>
            <option value="social">Social</option>
            <option value="engagement">Engagement</option>
            <option value="partner">Partner</option>
            <option value="special">Special</option>
          </select>
          <select
            value={filters.isActive}
            onChange={(e) => setFilters({ ...filters, isActive: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedMissions.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center justify-between">
          <span className="text-sm text-gray-700">
            {selectedMissions.length} mission(s) selected
          </span>
          <div className="space-x-2">
            <button
              onClick={() => handleBulkAction('activate')}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Activate
            </button>
            <button
              onClick={() => handleBulkAction('deactivate')}
              className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
            >
              Deactivate
            </button>
            <button
              onClick={() => handleBulkAction('feature')}
              className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
            >
              Feature
            </button>
            <button
              onClick={() => handleBulkAction('duplicate')}
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              Duplicate
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Missions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedMissions(
                      e.target.checked ? missions.map((m) => m.id) : []
                    )
                  }
                  checked={selectedMissions.length === missions.length && missions.length > 0}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Completions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : missions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  No missions found
                </td>
              </tr>
            ) : (
              missions.map((mission) => (
                <tr key={mission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedMissions.includes(mission.id)}
                      onChange={() => toggleMissionSelection(mission.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{mission.title}</div>
                    {mission.isFeatured && (
                      <span className="text-xs text-yellow-600">★ Featured</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{mission.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{mission.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{mission.pointsReward}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {mission.currentCompletions}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        mission.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {mission.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => router.push(`/admin/missions/${mission.id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => router.push(`/admin/missions/${mission.id}/analytics`)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Analytics
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
