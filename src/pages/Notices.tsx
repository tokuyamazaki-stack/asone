import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Badge } from '../components/ui/Badge';

export default function Notices() {
  const { currentUser, notices, addNotice } = useStore();
  const canEdit = currentUser?.role === 'admin';
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', important: false });

  function save() {
    if (!form.title.trim()) { alert('タイトルを入力してください'); return; }
    addNotice({ type: 'general', title: form.title, content: form.content, date: new Date().toISOString().slice(0, 10), important: form.important });
    setShowModal(false);
    setForm({ title: '', content: '', important: false });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">お知らせ</h2>
        {canEdit && (
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            ＋ お知らせ作成
          </button>
        )}
      </div>
      <div className="space-y-3">
        {notices.map((n) => (
          <div key={n.id} className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${n.important ? 'border-red-500' : 'border-blue-500'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={n.important ? 'danger' : 'primary'}>{n.important ? '重要' : 'お知らせ'}</Badge>
              <span className="font-bold text-slate-800">{n.title}</span>
              <span className="text-xs text-slate-400 ml-auto">{n.date}</span>
            </div>
            <p className="text-sm text-slate-600">{n.content}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold">お知らせ作成</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 text-xl">✕</button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <label className="block">
                <span className="text-xs font-medium text-slate-600">タイトル</span>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="タイトルを入力" />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-600">内容</span>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="内容を入力" />
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.important} onChange={(e) => setForm({ ...form, important: e.target.checked })} className="accent-blue-600" />
                <span className="text-sm text-slate-700">重要なお知らせとして登録</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm">キャンセル</button>
              <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">投稿する</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
