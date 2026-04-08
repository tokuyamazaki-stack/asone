import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Badge } from '../components/ui/Badge';
import type { Player } from '../types';

const POSITIONS = ['GK', 'DF', 'MF', 'FW'];
const GRADES = ['U-12', 'U-13', 'U-15', 'U-18'];

const EMPTY_FORM = {
  name: '', number: '', position: 'FW', grade: 'U-15',
  height: '', weight: '', parentName: '', contact: '', notes: '',
};

export default function Players() {
  const { currentUser, players, addPlayer, updatePlayer } = useStore();
  const navigate = useNavigate();
  const canEdit = ['admin', 'coach'].includes(currentUser?.role ?? '');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(p: Player) {
    setEditingId(p.id);
    setForm({
      name: p.name, number: String(p.number), position: p.position,
      grade: p.grade, height: String(p.height), weight: String(p.weight),
      parentName: p.parentName, contact: p.contact, notes: p.notes,
    });
    setShowModal(true);
  }

  function save() {
    if (!form.name.trim()) { alert('名前を入力してください'); return; }
    const data = {
      name: form.name, number: parseInt(form.number) || 99,
      position: form.position, grade: form.grade,
      age: 14, height: parseInt(form.height) || 165, weight: parseInt(form.weight) || 55,
      parentName: form.parentName, contact: form.contact, notes: form.notes,
      joinDate: new Date().toISOString().slice(0, 10),
      evaluation: { heart: 70, head: 70, tech: 70, body: 70 },
    };
    if (editingId) {
      updatePlayer(editingId, data);
    } else {
      addPlayer(data);
    }
    setShowModal(false);
  }

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">選手情報管理</h2>
        {canEdit && (
          <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            ＋ 選手追加
          </button>
        )}
      </div>

      {/* テーブル */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wide bg-slate-50">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">名前</th>
                <th className="px-4 py-3 text-left">ポジション</th>
                <th className="px-4 py-3 text-left">学年</th>
                <th className="px-4 py-3 text-left">身長</th>
                <th className="px-4 py-3 text-left">体重</th>
                <th className="px-4 py-3 text-left">保護者</th>
                <th className="px-4 py-3 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Badge variant="primary">#{p.number}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/players/${p.id}`)}
                      className="flex items-center gap-2 text-left hover:text-blue-600"
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-medium text-sm">{p.name}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3"><Badge variant="gray">{p.position}</Badge></td>
                  <td className="px-4 py-3 text-sm text-slate-600">{p.grade}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{p.height}cm</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{p.weight}kg</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{p.parentName}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/players/${p.id}`)}
                        className="text-xs border border-slate-300 rounded px-2 py-1 hover:bg-slate-100"
                      >詳細</button>
                      {canEdit && (
                        <button
                          onClick={() => openEdit(p)}
                          className="text-xs border border-slate-300 rounded px-2 py-1 hover:bg-slate-100"
                        >編集</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="font-bold text-slate-800">{editingId ? '選手編集' : '選手追加'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 text-xl">✕</button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-medium text-slate-600">名前</span>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="山田 太郎" />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-600">背番号</span>
                  <input type="number" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="10" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-medium text-slate-600">ポジション</span>
                  <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                    {POSITIONS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-600">学年</span>
                  <select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                    {GRADES.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-medium text-slate-600">身長 (cm)</span>
                  <input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="170" />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-600">体重 (kg)</span>
                  <input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="60" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-medium text-slate-600">保護者名</span>
                  <input value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="山田 花子" />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-600">連絡先</span>
                  <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="090-XXXX-XXXX" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-medium text-slate-600">メモ</span>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="特記事項など" />
              </label>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-100">キャンセル</button>
              <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
