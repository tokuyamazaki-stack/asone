import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Badge } from '../components/ui/Badge';

const ROLE_BADGE: Record<string, 'primary' | 'success' | 'info' | 'gray'> = {
  admin: 'primary', coach: 'success', manager: 'info',
};
const ROLE_OPTIONS = [
  { value: 'admin', label: '代表' },
  { value: 'coach', label: 'コーチ' },
  { value: 'manager', label: 'マネージャー' },
];
const EMPTY = { name: '', role: 'coach', license: '', experience: '', contact: '' };

export default function Staff() {
  const { staff } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">スタッフ情報管理</h2>
        <button onClick={() => { setForm(EMPTY); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          ＋ スタッフ追加
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wide bg-slate-50">
                <th className="px-4 py-3 text-left">名前</th>
                <th className="px-4 py-3 text-left">役職</th>
                <th className="px-4 py-3 text-left">資格</th>
                <th className="px-4 py-3 text-left">経験</th>
                <th className="px-4 py-3 text-left">連絡先</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                        {s.name.charAt(0)}
                      </div>
                      <span className="font-medium text-sm">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant={ROLE_BADGE[s.role] ?? 'gray'}>{s.roleLabel}</Badge></td>
                  <td className="px-4 py-3 text-sm text-slate-600">{s.license}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{s.experience}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{s.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold">スタッフ追加</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 text-xl">✕</button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {[['名前', 'name', 'text', '鈴木 一郎'], ['資格', 'license', 'text', 'JFA B級'], ['経験年数', 'experience', 'text', '5年'], ['連絡先', 'contact', 'text', '080-XXXX-XXXX']].map(([label, key, type, ph]) => (
                <label key={key} className="block">
                  <span className="text-xs font-medium text-slate-600">{label}</span>
                  <input type={type} value={(form as Record<string, string>)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={ph} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </label>
              ))}
              <label className="block">
                <span className="text-xs font-medium text-slate-600">役職</span>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                  {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm">キャンセル</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
