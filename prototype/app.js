// ===== 状態管理 =====
let currentUser = null;
let currentPage = 'dashboard';
let checklistState = JSON.parse(JSON.stringify(CHECKLISTS)); // deep copy

// ===== ナビメニュー定義 =====
const NAV_MENUS = {
  admin: [
    { section: 'メイン' },
    { id: 'dashboard',  icon: '📊', label: 'ダッシュボード' },
    { section: 'クラブ管理' },
    { id: 'players',    icon: '👤', label: '選手情報管理' },
    { id: 'staff',      icon: '👥', label: 'スタッフ情報管理' },
    { id: 'evaluation', icon: '⭐', label: '選手評価' },
    { section: '業務' },
    { id: 'reports',    icon: '📝', label: '週報管理' },
    { id: 'checklist',  icon: '✅', label: '業務チェックリスト' },
    { section: 'その他' },
    { id: 'notices',    icon: '📢', label: 'お知らせ' },
  ],
  coach: [
    { section: 'メイン' },
    { id: 'dashboard',  icon: '📊', label: 'ダッシュボード' },
    { section: 'クラブ管理' },
    { id: 'players',    icon: '👤', label: '選手情報管理' },
    { id: 'evaluation', icon: '⭐', label: '選手評価' },
    { section: '業務' },
    { id: 'reports',    icon: '📝', label: '週報管理' },
    { id: 'checklist',  icon: '✅', label: '業務チェックリスト' },
    { section: 'その他' },
    { id: 'notices',    icon: '📢', label: 'お知らせ' },
  ],
  player: [
    { section: 'メイン' },
    { id: 'dashboard',  icon: '📊', label: 'マイページ' },
    { id: 'evaluation', icon: '⭐', label: '自分の評価' },
    { id: 'notices',    icon: '📢', label: 'お知らせ' },
  ],
  parent: [
    { section: 'メイン' },
    { id: 'dashboard',  icon: '📊', label: 'ホーム' },
    { id: 'notices',    icon: '📢', label: 'お知らせ' },
    { id: 'reports',    icon: '📝', label: '週報' },
  ],
};

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', () => {
  setupLoginForm();
  setupSidebar();
});

// ===== ログイン =====
function setupLoginForm() {
  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('login-id').value.trim();
    const pw = document.getElementById('login-password').value;
    const user = USERS.find(u => u.id === id && u.password === pw);
    if (user) {
      login(user);
    } else {
      showLoginError('IDまたはパスワードが正しくありません');
    }
  });

  // デモボタン
  document.querySelectorAll('.demo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('login-id').value = btn.dataset.id;
      document.getElementById('login-password').value = btn.dataset.pw;
    });
  });
}

function showLoginError(msg) {
  const el = document.getElementById('login-error');
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3000);
}

function login(user) {
  currentUser = user;
  document.getElementById('login-screen').classList.remove('active');
  document.getElementById('app-screen').classList.add('active');
  buildNav();
  renderHeaderUser();
  navigateTo('dashboard');
}

function logout() {
  currentUser = null;
  document.getElementById('app-screen').classList.remove('active');
  document.getElementById('login-screen').classList.add('active');
  document.getElementById('login-id').value = '';
  document.getElementById('login-password').value = '';
}

// ===== サイドバー =====
function setupSidebar() {
  document.getElementById('menu-toggle').addEventListener('click', toggleSidebar);
  document.getElementById('sidebar-close').addEventListener('click', closeSidebar);
  document.getElementById('overlay').addEventListener('click', closeSidebar);
  document.getElementById('logout-btn').addEventListener('click', logout);
}

function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  if (window.innerWidth <= 768) {
    sb.classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
  } else {
    sb.classList.toggle('collapsed');
    document.getElementById('main-wrapper').classList.toggle('full');
  }
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
}

function buildNav() {
  const menus = NAV_MENUS[currentUser.role] || NAV_MENUS.admin;
  const nav = document.getElementById('main-nav');
  nav.innerHTML = menus.map(item => {
    if (item.section) return `<div class="nav-section-label">${item.section}</div>`;
    return `<div class="nav-item" data-page="${item.id}" onclick="navigateTo('${item.id}')">
      <span class="nav-icon">${item.icon}</span>
      <span class="nav-label">${item.label}</span>
    </div>`;
  }).join('');

  // ユーザー情報
  const colors = { admin: 'bg-blue', coach: 'bg-green', player: 'bg-orange', parent: 'bg-purple' };
  document.getElementById('user-info-sidebar').innerHTML = `
    <div class="user-role-badge">${currentUser.roleLabel}</div>
    <div class="user-name-sidebar">${currentUser.name}</div>
  `;
}

function renderHeaderUser() {
  const colors = { admin: 'bg-blue', coach: 'bg-green', player: 'bg-orange', parent: 'bg-purple' };
  const initial = currentUser.name.charAt(0);
  document.getElementById('header-user').innerHTML = `
    <div class="header-avatar ${colors[currentUser.role]}">${initial}</div>
  `;
}

// ===== ナビゲーション =====
function navigateTo(page) {
  currentPage = page;
  closeSidebar();

  // アクティブ更新
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  // ページタイトル更新
  const allMenus = Object.values(NAV_MENUS).flat();
  const menuItem = allMenus.find(m => m.id === page);
  document.getElementById('page-title').textContent = menuItem ? menuItem.label : page;

  // コンテンツ描画
  const area = document.getElementById('content-area');
  switch (page) {
    case 'dashboard':  area.innerHTML = renderDashboard(); break;
    case 'players':    area.innerHTML = renderPlayers();   break;
    case 'staff':      area.innerHTML = renderStaff();     break;
    case 'evaluation': area.innerHTML = renderEvaluation(); break;
    case 'reports':    area.innerHTML = renderReports();   break;
    case 'checklist':  area.innerHTML = renderChecklist(); break;
    case 'notices':    area.innerHTML = renderNotices();   break;
    default:           area.innerHTML = `<p>ページが見つかりません</p>`;
  }

  afterRender(page);
}

function afterRender(page) {
  if (page === 'players')   setupPlayersEvents();
  if (page === 'staff')     setupStaffEvents();
  if (page === 'reports')   setupReportsEvents();
  if (page === 'checklist') setupChecklistEvents();
  if (page === 'evaluation') setupEvalEvents();
}

// ===== ダッシュボード =====
function renderDashboard() {
  if (currentUser.role === 'player') return renderPlayerDashboard();
  if (currentUser.role === 'parent') return renderParentDashboard();

  const pendingReports = WEEKLY_REPORTS.filter(r => r.status === 'draft').length;
  const publishedReports = WEEKLY_REPORTS.filter(r => r.status === 'published').length;
  const importantNotices = NOTIFICATIONS.filter(n => n.important).length;
  const doneChecks = checklistState.daily.filter(c => c.done).length;
  const totalChecks = checklistState.daily.length;

  return `
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon blue">👤</div>
      <div><div class="stat-value">${PLAYERS.length}</div><div class="stat-label">登録選手数</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon green">👥</div>
      <div><div class="stat-value">${STAFF.length}</div><div class="stat-label">スタッフ数</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon orange">📝</div>
      <div><div class="stat-value">${pendingReports}</div><div class="stat-label">未公開週報</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon purple">📢</div>
      <div><div class="stat-value">${importantNotices}</div><div class="stat-label">重要なお知らせ</div></div>
    </div>
  </div>

  <div class="dashboard-grid">
    <div class="card">
      <div class="card-header">
        <h3>最新週報</h3>
        <button class="btn btn-sm btn-outline" onclick="navigateTo('reports')">すべて見る</button>
      </div>
      ${WEEKLY_REPORTS.slice(0,2).map(r => `
        <div class="report-item" style="margin-bottom:10px">
          <div class="report-meta">
            <span class="badge ${r.status==='published'?'badge-success':'badge-warning'}">${r.status==='published'?'公開':'下書き'}</span>
            <span style="font-weight:600">${r.weekLabel}</span>
            <span class="text-muted" style="font-size:12px">${r.author}</span>
          </div>
          <div class="report-content">${r.goodPoints.substring(0,60)}…</div>
        </div>
      `).join('')}
    </div>
    <div>
      <div class="card" style="margin-bottom:16px">
        <div class="card-header"><h3>今日のチェック</h3></div>
        <div style="font-size:13px;color:var(--gray-600);margin-bottom:8px">${doneChecks}/${totalChecks} 完了</div>
        <div style="height:8px;background:var(--gray-200);border-radius:4px;overflow:hidden;margin-bottom:12px">
          <div style="height:100%;background:var(--primary);width:${Math.round(doneChecks/totalChecks*100)}%;border-radius:4px"></div>
        </div>
        ${checklistState.daily.slice(0,4).map(c => `
          <div class="check-item ${c.done?'done':''}">
            <input type="checkbox" ${c.done?'checked':''} disabled>
            <span>${c.label}</span>
          </div>
        `).join('')}
        <button class="btn btn-sm btn-outline" style="margin-top:8px;width:100%" onclick="navigateTo('checklist')">すべて見る</button>
      </div>
      <div class="card">
        <div class="card-header"><h3>重要なお知らせ</h3></div>
        ${NOTIFICATIONS.filter(n=>n.important).map(n => `
          <div style="padding:8px 0;border-bottom:1px solid var(--gray-100)">
            <div style="font-size:13px;font-weight:600">${n.title}</div>
            <div style="font-size:12px;color:var(--gray-500)">${n.date}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>`;
}

function renderPlayerDashboard() {
  const p = PLAYERS.find(pl => pl.name === currentUser.name) || PLAYERS[0];
  const ev = p.evaluation;
  return `
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon blue">❤️</div>
      <div><div class="stat-value">${ev.heart}</div><div class="stat-label">心</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon purple">🧠</div>
      <div><div class="stat-value">${ev.head}</div><div class="stat-label">頭</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon orange">⚽</div>
      <div><div class="stat-value">${ev.tech}</div><div class="stat-label">技</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon green">💪</div>
      <div><div class="stat-value">${ev.body}</div><div class="stat-label">体</div></div>
    </div>
  </div>
  <div class="card">
    <div class="card-header"><h3>最新のお知らせ</h3></div>
    ${NOTIFICATIONS.map(n => `
      <div style="padding:10px 0;border-bottom:1px solid var(--gray-100)">
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:4px">
          ${n.important ? '<span class="badge badge-danger">重要</span>' : ''}
          <span style="font-weight:600;font-size:13px">${n.title}</span>
        </div>
        <div style="font-size:13px;color:var(--gray-600)">${n.content}</div>
        <div style="font-size:12px;color:var(--gray-400);margin-top:4px">${n.date}</div>
      </div>
    `).join('')}
  </div>`;
}

function renderParentDashboard() {
  return `
  <div class="card" style="margin-bottom:20px">
    <div class="card-header"><h3>ようこそ、${currentUser.name} さん</h3></div>
    <p style="font-size:14px;color:var(--gray-600)">AS ONE サッカークラブの保護者ポータルへようこそ。最新情報をご確認ください。</p>
  </div>
  <div class="card">
    <div class="card-header"><h3>お知らせ</h3></div>
    ${NOTIFICATIONS.map(n => `
      <div style="padding:10px 0;border-bottom:1px solid var(--gray-100)">
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:4px">
          ${n.important ? '<span class="badge badge-danger">重要</span>' : ''}
          <span style="font-weight:600;font-size:13px">${n.title}</span>
        </div>
        <div style="font-size:13px;color:var(--gray-600)">${n.content}</div>
        <div style="font-size:12px;color:var(--gray-400);margin-top:4px">${n.date}</div>
      </div>
    `).join('')}
  </div>`;
}

// ===== 選手情報管理 =====
function renderPlayers() {
  const canEdit = ['admin','coach'].includes(currentUser.role);
  return `
  <div class="page-header">
    <h2>選手情報管理</h2>
    ${canEdit ? '<button class="btn btn-primary" onclick="openPlayerModal()">＋ 選手追加</button>' : ''}
  </div>
  <div class="card">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th><th>名前</th><th>ポジション</th><th>学年</th>
            <th>身長</th><th>体重</th><th>保護者名</th>
            ${canEdit ? '<th>操作</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${PLAYERS.map(p => `
            <tr>
              <td><span class="badge badge-primary">${p.number}</span></td>
              <td><div style="display:flex;align-items:center;gap:8px">
                <div class="avatar avatar-sm bg-blue">${p.name.charAt(0)}</div>
                <span style="font-weight:500">${p.name}</span>
              </div></td>
              <td><span class="badge badge-gray">${p.position}</span></td>
              <td>${p.grade}</td>
              <td>${p.height}cm</td>
              <td>${p.weight}kg</td>
              <td>${p.parentName}</td>
              ${canEdit ? `<td>
                <button class="btn btn-sm btn-outline" onclick="openPlayerModal(${p.id})">編集</button>
              </td>` : ''}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- 選手追加/編集モーダル -->
  <div id="player-modal" class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <h3 id="player-modal-title">選手追加</h3>
        <button class="modal-close" onclick="closeModal('player-modal')">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group"><label>名前</label><input type="text" id="p-name" placeholder="山田 太郎"></div>
          <div class="form-group"><label>背番号</label><input type="number" id="p-number" placeholder="10"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>ポジション</label>
            <select id="p-position">
              <option>GK</option><option>DF</option><option>MF</option><option>FW</option>
            </select>
          </div>
          <div class="form-group"><label>学年</label>
            <select id="p-grade"><option>U-12</option><option>U-13</option><option>U-15</option><option>U-18</option></select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>身長 (cm)</label><input type="number" id="p-height" placeholder="170"></div>
          <div class="form-group"><label>体重 (kg)</label><input type="number" id="p-weight" placeholder="60"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>保護者名</label><input type="text" id="p-parent" placeholder="山田 花子"></div>
          <div class="form-group"><label>連絡先</label><input type="text" id="p-contact" placeholder="090-XXXX-XXXX"></div>
        </div>
        <div class="form-group"><label>メモ</label><textarea id="p-notes" rows="3" placeholder="特記事項など"></textarea></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeModal('player-modal')">キャンセル</button>
        <button class="btn btn-primary" onclick="savePlayer()">保存</button>
      </div>
    </div>
  </div>`;
}

function setupPlayersEvents() {}

let editingPlayerId = null;
function openPlayerModal(id = null) {
  editingPlayerId = id;
  document.getElementById('player-modal-title').textContent = id ? '選手編集' : '選手追加';
  if (id) {
    const p = PLAYERS.find(pl => pl.id === id);
    if (p) {
      document.getElementById('p-name').value    = p.name;
      document.getElementById('p-number').value  = p.number;
      document.getElementById('p-position').value= p.position;
      document.getElementById('p-grade').value   = p.grade;
      document.getElementById('p-height').value  = p.height;
      document.getElementById('p-weight').value  = p.weight;
      document.getElementById('p-parent').value  = p.parentName;
      document.getElementById('p-contact').value = p.contact;
      document.getElementById('p-notes').value   = p.notes;
    }
  } else {
    document.getElementById('p-name').value = '';
    document.getElementById('p-number').value = '';
    document.getElementById('p-height').value = '';
    document.getElementById('p-weight').value = '';
    document.getElementById('p-parent').value = '';
    document.getElementById('p-contact').value = '';
    document.getElementById('p-notes').value = '';
  }
  openModal('player-modal');
}

function savePlayer() {
  const name = document.getElementById('p-name').value.trim();
  if (!name) { alert('名前を入力してください'); return; }
  if (editingPlayerId) {
    const p = PLAYERS.find(pl => pl.id === editingPlayerId);
    if (p) {
      p.name = name;
      p.number = parseInt(document.getElementById('p-number').value) || p.number;
      p.position = document.getElementById('p-position').value;
      p.grade = document.getElementById('p-grade').value;
      p.height = parseInt(document.getElementById('p-height').value) || p.height;
      p.weight = parseInt(document.getElementById('p-weight').value) || p.weight;
      p.parentName = document.getElementById('p-parent').value;
      p.contact = document.getElementById('p-contact').value;
      p.notes = document.getElementById('p-notes').value;
    }
  } else {
    PLAYERS.push({
      id: PLAYERS.length + 1,
      name,
      number: parseInt(document.getElementById('p-number').value) || 99,
      position: document.getElementById('p-position').value,
      grade: document.getElementById('p-grade').value,
      age: 14, height: parseInt(document.getElementById('p-height').value) || 165,
      weight: parseInt(document.getElementById('p-weight').value) || 55,
      contact: document.getElementById('p-contact').value,
      parentName: document.getElementById('p-parent').value,
      joinDate: new Date().toISOString().slice(0,10),
      notes: document.getElementById('p-notes').value,
      evaluation: { heart: 70, head: 70, tech: 70, body: 70 }
    });
  }
  closeModal('player-modal');
  navigateTo('players');
}

// ===== スタッフ管理 =====
function renderStaff() {
  const roleColors = { admin:'badge-primary', coach:'badge-success', manager:'badge-info' };
  return `
  <div class="page-header">
    <h2>スタッフ情報管理</h2>
    <button class="btn btn-primary" onclick="openStaffModal()">＋ スタッフ追加</button>
  </div>
  <div class="card">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr><th>名前</th><th>役職</th><th>資格</th><th>経験</th><th>連絡先</th><th>操作</th></tr>
        </thead>
        <tbody>
          ${STAFF.map(s => `
            <tr>
              <td><div style="display:flex;align-items:center;gap:8px">
                <div class="avatar avatar-sm bg-green">${s.name.charAt(0)}</div>
                <span style="font-weight:500">${s.name}</span>
              </div></td>
              <td><span class="badge ${roleColors[s.role]||'badge-gray'}">${s.roleLabel}</span></td>
              <td>${s.license}</td>
              <td>${s.experience}</td>
              <td>${s.contact}</td>
              <td><button class="btn btn-sm btn-outline" onclick="openStaffModal(${s.id})">編集</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div id="staff-modal" class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <h3 id="staff-modal-title">スタッフ追加</h3>
        <button class="modal-close" onclick="closeModal('staff-modal')">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group"><label>名前</label><input type="text" id="s-name" placeholder="鈴木 一郎"></div>
          <div class="form-group"><label>役職</label>
            <select id="s-role">
              <option value="admin">代表</option>
              <option value="coach">コーチ</option>
              <option value="manager">マネージャー</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>資格</label><input type="text" id="s-license" placeholder="JFA B級"></div>
          <div class="form-group"><label>経験年数</label><input type="text" id="s-exp" placeholder="5年"></div>
        </div>
        <div class="form-group"><label>連絡先</label><input type="text" id="s-contact" placeholder="080-XXXX-XXXX"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeModal('staff-modal')">キャンセル</button>
        <button class="btn btn-primary" onclick="saveStaff()">保存</button>
      </div>
    </div>
  </div>`;
}

function setupStaffEvents() {}
let editingStaffId = null;
function openStaffModal(id = null) {
  editingStaffId = id;
  document.getElementById('staff-modal-title').textContent = id ? 'スタッフ編集' : 'スタッフ追加';
  if (id) {
    const s = STAFF.find(st => st.id === id);
    if (s) {
      document.getElementById('s-name').value    = s.name;
      document.getElementById('s-role').value    = s.role;
      document.getElementById('s-license').value = s.license;
      document.getElementById('s-exp').value     = s.experience;
      document.getElementById('s-contact').value = s.contact;
    }
  } else {
    ['s-name','s-license','s-exp','s-contact'].forEach(id => document.getElementById(id).value = '');
  }
  openModal('staff-modal');
}

function saveStaff() {
  const name = document.getElementById('s-name').value.trim();
  if (!name) { alert('名前を入力してください'); return; }
  const roleLabels = { admin:'代表', coach:'コーチ', manager:'マネージャー' };
  const role = document.getElementById('s-role').value;
  if (editingStaffId) {
    const s = STAFF.find(st => st.id === editingStaffId);
    if (s) {
      s.name = name; s.role = role; s.roleLabel = roleLabels[role];
      s.license = document.getElementById('s-license').value;
      s.experience = document.getElementById('s-exp').value;
      s.contact = document.getElementById('s-contact').value;
    }
  } else {
    STAFF.push({
      id: STAFF.length + 1, name, role, roleLabel: roleLabels[role],
      license: document.getElementById('s-license').value,
      experience: document.getElementById('s-exp').value,
      contact: document.getElementById('s-contact').value,
      joinDate: new Date().toISOString().slice(0,10)
    });
  }
  closeModal('staff-modal');
  navigateTo('staff');
}

// ===== 選手評価 =====
function renderEvaluation() {
  const isPlayer = currentUser.role === 'player';
  const displayPlayers = isPlayer
    ? PLAYERS.filter(p => p.name === currentUser.name).slice(0,1)
    : PLAYERS;
  const canEdit = ['admin','coach'].includes(currentUser.role);

  return `
  <div class="page-header">
    <h2>選手評価（心・頭・技・体）</h2>
  </div>
  <div class="evaluation-grid">
    ${displayPlayers.map(p => `
      <div class="player-eval-card">
        <div class="player-eval-header">
          <div class="player-avatar">${p.name.charAt(0)}</div>
          <div>
            <div style="font-weight:600">${p.name}</div>
            <div style="font-size:12px;color:var(--gray-500)">${p.position} / ${p.grade}</div>
          </div>
          ${canEdit ? `<button class="btn btn-sm btn-outline" style="margin-left:auto" onclick="openEvalModal(${p.id})">編集</button>` : ''}
        </div>
        <div class="eval-bars">
          ${[['心','heart','#ef4444'],['頭','head','#6366f1'],['技','tech','#f59e0b'],['体','body','#22c55e']].map(([label, key, color]) => `
            <div class="eval-bar-item">
              <div class="eval-bar-label">${label}</div>
              <div class="eval-bar-track">
                <div class="eval-bar-fill" style="width:${p.evaluation[key]}%;background:${color}"></div>
              </div>
              <div class="eval-bar-score">${p.evaluation[key]}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  </div>

  <div id="eval-modal" class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <h3 id="eval-modal-title">評価編集</h3>
        <button class="modal-close" onclick="closeModal('eval-modal')">✕</button>
      </div>
      <div class="modal-body">
        ${[['心 (メンタル・態度)', 'ev-heart'],['頭 (戦術理解・判断)', 'ev-head'],['技 (テクニック)', 'ev-tech'],['体 (フィジカル)', 'ev-body']].map(([label, id]) => `
          <div class="form-group">
            <label>${label} <span id="${id}-val" style="font-weight:700;color:var(--primary)">70</span></label>
            <input type="range" id="${id}" min="0" max="100" value="70"
              style="width:100%;accent-color:var(--primary)"
              oninput="document.getElementById('${id}-val').textContent=this.value">
          </div>
        `).join('')}
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeModal('eval-modal')">キャンセル</button>
        <button class="btn btn-primary" onclick="saveEval()">保存</button>
      </div>
    </div>
  </div>`;
}

function setupEvalEvents() {}
let editingEvalId = null;
function openEvalModal(id) {
  editingEvalId = id;
  const p = PLAYERS.find(pl => pl.id === id);
  if (!p) return;
  document.getElementById('eval-modal-title').textContent = `${p.name} の評価編集`;
  ['heart','head','tech','body'].forEach(k => {
    const el = document.getElementById(`ev-${k}`);
    const valEl = document.getElementById(`ev-${k}-val`);
    if (el) { el.value = p.evaluation[k]; valEl.textContent = p.evaluation[k]; }
  });
  openModal('eval-modal');
}
function saveEval() {
  const p = PLAYERS.find(pl => pl.id === editingEvalId);
  if (!p) return;
  ['heart','head','tech','body'].forEach(k => {
    const el = document.getElementById(`ev-${k}`);
    if (el) p.evaluation[k] = parseInt(el.value);
  });
  closeModal('eval-modal');
  navigateTo('evaluation');
}

// ===== 週報管理 =====
function renderReports() {
  const canEdit = ['admin','coach'].includes(currentUser.role);
  return `
  <div class="page-header">
    <h2>週報管理</h2>
    ${canEdit ? '<button class="btn btn-primary" onclick="openReportModal()">＋ 週報作成</button>' : ''}
  </div>
  <div class="weekly-report-list">
    ${WEEKLY_REPORTS.map(r => `
      <div class="report-item" onclick="openReportDetail(${r.id})">
        <div class="report-meta">
          <span class="badge ${r.status==='published'?'badge-success':'badge-warning'}">${r.status==='published'?'公開':'下書き'}</span>
          <span class="report-title">${r.weekLabel}</span>
          <span class="text-muted" style="font-size:12px">${r.startDate} 〜 ${r.endDate}</span>
          <span class="text-muted" style="font-size:12px">作成：${r.author}</span>
        </div>
        <div class="report-content">
          <strong>練習：</strong>${r.practiceContent}　<strong>試合：</strong>${r.match}
        </div>
      </div>
    `).join('')}
  </div>

  <div id="report-modal" class="modal-backdrop">
    <div class="modal" style="width:600px">
      <div class="modal-header">
        <h3 id="report-modal-title">週報作成</h3>
        <button class="modal-close" onclick="closeModal('report-modal')">✕</button>
      </div>
      <div class="modal-body" id="report-modal-body"></div>
      <div class="modal-footer" id="report-modal-footer"></div>
    </div>
  </div>`;
}

function setupReportsEvents() {}

function openReportDetail(id) {
  const r = WEEKLY_REPORTS.find(rep => rep.id === id);
  if (!r) return;
  const canEdit = ['admin','coach'].includes(currentUser.role);
  document.getElementById('report-modal-title').textContent = r.weekLabel;
  document.getElementById('report-modal-body').innerHTML = `
    <div style="display:grid;gap:12px">
      <div class="form-row">
        <div><label style="font-weight:600;font-size:12px;color:var(--gray-500)">期間</label><p>${r.startDate} 〜 ${r.endDate}</p></div>
        <div><label style="font-weight:600;font-size:12px;color:var(--gray-500)">練習日数</label><p>${r.trainingDays}日</p></div>
      </div>
      <div><label style="font-weight:600;font-size:12px;color:var(--gray-500)">練習内容</label><p>${r.practiceContent}</p></div>
      <div><label style="font-weight:600;font-size:12px;color:var(--gray-500)">試合</label><p>${r.match}</p></div>
      <div><label style="font-weight:600;font-size:12px;color:var(--gray-500)">良かった点</label><p>${r.goodPoints}</p></div>
      <div><label style="font-weight:600;font-size:12px;color:var(--gray-500)">課題・改善点</label><p>${r.improvements}</p></div>
      <div><label style="font-weight:600;font-size:12px;color:var(--gray-500)">来週の計画</label><p>${r.nextWeekPlan}</p></div>
    </div>`;
  document.getElementById('report-modal-footer').innerHTML = `
    <button class="btn btn-outline" onclick="closeModal('report-modal')">閉じる</button>
    ${canEdit && r.status==='draft' ? `<button class="btn btn-success" onclick="publishReport(${r.id})">公開する</button>` : ''}
  `;
  openModal('report-modal');
}

function publishReport(id) {
  const r = WEEKLY_REPORTS.find(rep => rep.id === id);
  if (r) r.status = 'published';
  closeModal('report-modal');
  navigateTo('reports');
}

function openReportModal() {
  document.getElementById('report-modal-title').textContent = '週報作成';
  document.getElementById('report-modal-body').innerHTML = `
    <div class="form-row">
      <div class="form-group"><label>週ラベル</label><input type="text" id="r-week" placeholder="2026年第15週"></div>
      <div class="form-group"><label>練習日数</label><input type="number" id="r-days" placeholder="4"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>開始日</label><input type="date" id="r-start"></div>
      <div class="form-group"><label>終了日</label><input type="date" id="r-end"></div>
    </div>
    <div class="form-group"><label>練習内容</label><input type="text" id="r-practice" placeholder="ポジショニング練習・シュート練習"></div>
    <div class="form-group"><label>試合</label><input type="text" id="r-match" placeholder="vs FC〇〇（○3-1）"></div>
    <div class="form-group"><label>良かった点</label><textarea id="r-good" rows="2"></textarea></div>
    <div class="form-group"><label>課題・改善点</label><textarea id="r-improve" rows="2"></textarea></div>
    <div class="form-group"><label>来週の計画</label><textarea id="r-next" rows="2"></textarea></div>`;
  document.getElementById('report-modal-footer').innerHTML = `
    <button class="btn btn-outline" onclick="closeModal('report-modal')">キャンセル</button>
    <button class="btn btn-warning" onclick="saveReport('draft')">下書き保存</button>
    <button class="btn btn-primary" onclick="saveReport('published')">公開する</button>`;
  openModal('report-modal');
}

function saveReport(status) {
  const week = document.getElementById('r-week')?.value.trim();
  if (!week) { alert('週ラベルを入力してください'); return; }
  WEEKLY_REPORTS.unshift({
    id: WEEKLY_REPORTS.length + 1,
    weekLabel: week,
    startDate: document.getElementById('r-start')?.value || '',
    endDate: document.getElementById('r-end')?.value || '',
    author: currentUser.name, authorRole: currentUser.role,
    trainingDays: parseInt(document.getElementById('r-days')?.value) || 0,
    practiceContent: document.getElementById('r-practice')?.value || '',
    match: document.getElementById('r-match')?.value || '',
    goodPoints: document.getElementById('r-good')?.value || '',
    improvements: document.getElementById('r-improve')?.value || '',
    nextWeekPlan: document.getElementById('r-next')?.value || '',
    status
  });
  closeModal('report-modal');
  navigateTo('reports');
}

// ===== チェックリスト =====
function renderChecklist() {
  const groups = [
    { key: 'daily',   label: '日次チェック', icon: '☀️' },
    { key: 'weekly',  label: '週次チェック', icon: '📅' },
    { key: 'monthly', label: '月次チェック', icon: '📆' },
  ];
  return `
  <div class="page-header"><h2>業務チェックリスト</h2></div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px">
    ${groups.map(g => {
      const items = checklistState[g.key];
      const done = items.filter(c => c.done).length;
      return `
      <div class="card">
        <div class="card-header">
          <h3>${g.icon} ${g.label}</h3>
          <span class="badge badge-primary">${done}/${items.length}</span>
        </div>
        <div style="height:6px;background:var(--gray-200);border-radius:3px;margin-bottom:12px">
          <div style="height:100%;background:var(--success);width:${items.length?Math.round(done/items.length*100):0}%;border-radius:3px;transition:width .4s"></div>
        </div>
        ${items.map(c => `
          <div class="check-item ${c.done?'done':''}" onclick="toggleCheck('${g.key}','${c.id}')">
            <input type="checkbox" ${c.done?'checked':''} onclick="event.stopPropagation();toggleCheck('${g.key}','${c.id}')">
            <span>${c.label}</span>
          </div>
        `).join('')}
      </div>`;
    }).join('')}
  </div>`;
}

function setupChecklistEvents() {}

function toggleCheck(group, id) {
  const item = checklistState[group].find(c => c.id === id);
  if (item) { item.done = !item.done; navigateTo('checklist'); }
}

// ===== お知らせ =====
function renderNotices() {
  const canEdit = currentUser.role === 'admin';
  return `
  <div class="page-header">
    <h2>お知らせ</h2>
    ${canEdit ? '<button class="btn btn-primary" onclick="openNoticeModal()">＋ お知らせ作成</button>' : ''}
  </div>
  <div style="display:flex;flex-direction:column;gap:12px">
    ${NOTIFICATIONS.map(n => `
      <div class="card" style="border-left:4px solid ${n.important?'var(--danger)':'var(--primary)'}">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          ${n.important ? '<span class="badge badge-danger">重要</span>' : '<span class="badge badge-primary">お知らせ</span>'}
          <span style="font-weight:700;font-size:15px">${n.title}</span>
          <span class="text-muted" style="font-size:12px;margin-left:auto">${n.date}</span>
        </div>
        <p style="font-size:14px;color:var(--gray-700)">${n.content}</p>
      </div>
    `).join('')}
  </div>

  <div id="notice-modal" class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <h3>お知らせ作成</h3>
        <button class="modal-close" onclick="closeModal('notice-modal')">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group"><label>タイトル</label><input type="text" id="n-title" placeholder="タイトルを入力"></div>
        <div class="form-group"><label>内容</label><textarea id="n-content" rows="4" placeholder="内容を入力"></textarea></div>
        <div class="form-group">
          <label><input type="checkbox" id="n-important" style="margin-right:6px">重要なお知らせとして登録</label>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="closeModal('notice-modal')">キャンセル</button>
        <button class="btn btn-primary" onclick="saveNotice()">投稿する</button>
      </div>
    </div>
  </div>`;
}

function openNoticeModal() { openModal('notice-modal'); }
function saveNotice() {
  const title = document.getElementById('n-title')?.value.trim();
  if (!title) { alert('タイトルを入力してください'); return; }
  NOTIFICATIONS.unshift({
    id: NOTIFICATIONS.length + 1,
    type: 'general', title,
    content: document.getElementById('n-content')?.value || '',
    date: new Date().toISOString().slice(0,10),
    important: document.getElementById('n-important')?.checked || false
  });
  closeModal('notice-modal');
  navigateTo('notices');
}

// ===== モーダル共通 =====
function openModal(id) {
  document.getElementById(id).classList.add('active');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}
// モーダル外クリックで閉じる
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('active');
  }
});
