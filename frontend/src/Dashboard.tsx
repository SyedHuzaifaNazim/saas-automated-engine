import { useEffect, useState } from 'react';
import api from './api';
import toast from 'react-hot-toast';
import { Plus, RefreshCw, LogOut } from 'lucide-react';

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [records, setRecords] = useState<any[]>([]);
  const [title, setTitle] = useState('');

  const fetchRecords = async () => {
    try {
      const { data } = await api.get('/records');
      setRecords(data);
    } catch (err) {
      toast.error('Failed to load records');
    }
  };

  const createRecord = async () => {
    if (!title) return toast.error('Title is required');
    try {
      //Triggers the Backend -> DB -> n8n Workflow
      await api.post('/records', { title, data: { status: 'new', priority: 'high' } });
      toast.success('Record Created & Automation Triggered!');
      setTitle('');
      fetchRecords();
    } catch (err) {
      toast.error('Failed to create record');
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <button onClick={onLogout} className="flex items-center text-red-600 hover:text-red-700">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>

        {/* Action Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Trigger Automation</h2>
          <div className="flex gap-4">
            <input 
              className="flex-1 p-2 border rounded-lg" 
              placeholder="Record Title (e.g. New User Onboarding)" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button 
              onClick={createRecord}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" /> Create & Trigger
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Recent Records</h3>
            <button onClick={fetchRecords}><RefreshCw className="w-4 h-4 text-gray-500" /></button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50">
                  <td className="p-4 text-xs font-mono text-gray-500">{rec.id.slice(0, 8)}...</td>
                  <td className="p-4 font-medium">{rec.title}</td>
                  <td className="p-4"><span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span></td>
                  <td className="p-4 text-sm text-gray-500">{new Date(rec.created_at).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {records.length === 0 && <div className="p-8 text-center text-gray-500">No records found.</div>}
        </div>
      </div>
    </div>
  );
}