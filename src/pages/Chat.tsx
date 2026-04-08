import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import type { Player } from '../types';

const AI_REPLIES = [
  'なるほど！その気づきはとても大切ですね。',
  'よく頑張っています！具体的に教えてもらえますか？',
  'コーチにも共有しておきますね。',
  'その課題は練習で改善できます。一緒に考えましょう。',
  'ありがとうございます。他に気になることはありますか？',
];

function now() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

export default function Chat() {
  const { currentUser, players, chatMessages, sendMessage } = useStore();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!currentUser) return null;

  // ロール別に表示する選手を決定
  let chatPlayers: Player[] = players;
  if (currentUser.role === 'player') {
    chatPlayers = players.filter((p) => p.name === currentUser.name);
  } else if (currentUser.role === 'parent') {
    chatPlayers = players.filter((p) => p.parentName === currentUser.name);
  }

  // 初期選択
  const activeId = selectedId ?? chatPlayers[0]?.id ?? null;
  const selected = players.find((p) => p.id === activeId);
  const messages = activeId ? (chatMessages[activeId] ?? []) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  function handleSend() {
    if (!input.trim() || activeId === null) return;
    const ts = now();
    sendMessage(activeId, {
      sender: currentUser!.role, senderName: currentUser!.name,
      content: input.trim(), timestamp: ts, read: true,
    });
    setInput('');
    // AI自動返答
    setTimeout(() => {
      const reply = AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)];
      sendMessage(activeId, {
        sender: 'ai', senderName: 'AIコーチ',
        content: reply, timestamp: ts, read: true,
      });
    }, 1200);
  }

  return (
    <div className="flex rounded-xl shadow-sm bg-white overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
      {/* ── サイドバー（選手リスト）── */}
      <div className="w-56 shrink-0 border-r border-slate-200 overflow-y-auto">
        <div className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200">
          選手一覧
        </div>
        {chatPlayers.map((p) => {
          const msgs = chatMessages[p.id] ?? [];
          const unread = msgs.filter((m) => !m.read && m.senderName !== currentUser.name).length;
          const isActive = p.id === activeId;
          return (
            <button
              key={p.id}
              onClick={() => { setSelectedId(p.id); setInput(''); }}
              className={`w-full flex items-center gap-2 px-4 py-3 border-b border-slate-100 text-left transition-colors
                ${isActive ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {p.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate ${isActive ? 'text-blue-700' : 'text-slate-800'}`}>
                  {p.name}
                </div>
                <div className="text-xs text-slate-400">{p.position} / {p.grade}</div>
              </div>
              {unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold shrink-0">
                  {unread}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── メインチャットエリア ── */}
      {selected ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* チャットヘッダー */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-200 shrink-0">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {selected.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-slate-800">{selected.name}</div>
              <div className="text-xs text-slate-400">{selected.position} / {selected.grade} / 保護者：{selected.parentName}</div>
            </div>
            <span className="ml-auto text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">
              AIコーチ対応中
            </span>
          </div>

          {/* メッセージ一覧 */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 chat-messages">
            {messages.map((m) => {
              const isSelf = m.senderName === currentUser.name;
              const isAI = m.sender === 'ai';
              return (
                <div key={m.id} className={`flex gap-2 max-w-[78%] ${isSelf ? 'self-end flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0
                    ${isAI ? 'bg-violet-500' : isSelf ? 'bg-blue-600' : 'bg-green-600'}`}>
                    {m.senderName.charAt(0)}
                  </div>
                  <div>
                    <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed
                      ${isSelf
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-slate-100 text-slate-800 rounded-tl-sm'}`}>
                      {m.content}
                    </div>
                    <div className={`text-[11px] text-slate-400 mt-1 ${isSelf ? 'text-right' : ''}`}>
                      {m.senderName} · {m.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="flex gap-2 items-center px-5 py-3 border-t border-slate-200 shrink-0">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="メッセージを入力..."
              rows={1}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-2xl text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 hover:bg-blue-700 transition-colors"
            >
              ➤
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          選手を選択してください
        </div>
      )}
    </div>
  );
}
