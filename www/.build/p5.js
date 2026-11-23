
/* ============================================================
   五、渲染：消息 / 场景面板 / 事件簿 / 记忆 / 主题 / 背景
   ============================================================ */
const BG_PRESETS = [
  { id: 'theme', name: '跟随主题', css: '' },
  {
    id: 'forest', name: '林间薄雾', css:
      'radial-gradient(760px 520px at 18% 4%, #3a5244 0%, transparent 58%),' +
      'radial-gradient(680px 460px at 88% 22%, #4a3a26 0%, transparent 54%),' +
      'radial-gradient(620px 520px at 46% 102%, #17251d 0%, transparent 62%),' +
      'linear-gradient(178deg, #0a0e0b 0%, #16211a 48%, #070a08 100%)'
  },
  {
    id: 'lamp', name: '暖窗灯影', css:
      'radial-gradient(620px 420px at 74% 12%, #6b4a2a 0%, transparent 60%),' +
      'radial-gradient(520px 380px at 12% 40%, #3d2a1c 0%, transparent 62%),' +
      'linear-gradient(180deg, #100b08 0%, #1d1410 52%, #0a0706 100%)'
  },
  {
    id: 'rain', name: '雨夜深蓝', css:
      'radial-gradient(700px 480px at 22% 10%, #1e3b52 0%, transparent 58%),' +
      'radial-gradient(600px 420px at 82% 68%, #213244 0%, transparent 60%),' +
      'linear-gradient(180deg, #070b10 0%, #101a24 55%, #05080b 100%)'
  },
  {
    id: 'frost', name: '霜白晨光', css:
      'radial-gradient(720px 520px at 30% 8%, #4a5560 0%, transparent 62%),' +
      'radial-gradient(560px 420px at 84% 46%, #3a4450 0%, transparent 58%),' +
      'linear-gradient(180deg, #0b0e12 0%, #171c22 58%, #080a0d 100%)'
  },
  {
    id: 'ink', name: '墨色山河', css:
      'radial-gradient(760px 560px at 24% 0%, #2a2438 0%, transparent 60%),' +
      'radial-gradient(600px 460px at 80% 30%, #242a33 0%, transparent 58%),' +
      'linear-gradient(180deg, #08080b 0%, #12121a 56%, #060608 100%)'
  }
];
function defaultBg() { return { preset: 'theme', src: '', opacity: .7, blur: 0 }; }
function storyBg(s) { return Object.assign(defaultBg(), (s && s.bg) || {}); }
function bgName(bg) {
  if (bg.src) return '自定义图片';
  return (BG_PRESETS.find(p => p.id === bg.preset) || BG_PRESETS[0]).name;
}
function applyBg() {
  const el = $('#bg'); if (!el) return;
  const bg = storyBg(activeStory());
  const preset = BG_PRESETS.find(p => p.id === bg.preset) || BG_PRESETS[0];
  const bgUrl = imgRef(bg.src);
  if (bgUrl) el.style.background = 'url("' + bgUrl + '") center/cover no-repeat';
  else if (preset.css) el.style.background = preset.css;
  else el.style.background = '';
  el.style.opacity = bg.src ? Math.max(.12, bg.opacity + .25) : bg.opacity;
  el.style.filter = bg.blur ? 'blur(' + bg.blur + 'px)' : '';
  el.style.transform = bg.blur ? 'scale(1.06)' : '';
}

/* ---------------- 主题 ---------------- */
function buildThemeCSS(t) {
  const c = Object.assign({}, DB.config.custom || {});
  const pick = (k, fallback) => (c[k] === undefined || c[k] === '') ? fallback : c[k];
  return `/* generated theme css */
#app{
 --t-send:${pick('send', t.console.send)};
 --t-console-bg:${pick('consoleBg', t.console.color)};
 --t-console-blur:${t.console.blur}px;
 --t-console-radius:${pick('consoleRadius', t.console.radius)}px;
 --t-console-text:${t.console.text};
 --t-console-ph:${t.console.ph};
 --t-bubble-bg:${pick('bubbleBg', t.bubble.color)};
 --t-bubble-radius:${pick('bubbleRadius', t.bubble.radius)}px;
 --t-font-size:${pick('fontSize', t.font.size)}px;
 --t-line:${pick('line', t.font.line)};
 --t-font-color:${pick('fontColor', t.font.color)};
 --t-name-color:${pick('nameColor', t.font.name)};
 --t-font-family:${pick('fontFamily', t.font.family)};
 --t-bg-opacity:${t.bgOpacity};
 --t-bg-color:${t.bgColor};
}
.msg-avatar{border-radius:${pick('avatarRadius', t.avatarRadius)}%}
.dr-panel,.drawer{--t-send:${pick('send', t.console.send)}}
`;
}
function applyTheme(id, silent) {
  const t = THEMES[id] || THEMES.paper;
  DB.config.theme = t.id; saveDB();
  const app = $('#app');
  app.dataset.mode = t.displayMode;
  app.dataset.bubble = t.bubbleDisplayType;
  let dyn = $('#tav-dynamic-style');
  if (!dyn) { dyn = document.createElement('style'); dyn.id = 'tav-dynamic-style'; document.head.appendChild(dyn); }
  dyn.textContent = buildThemeCSS(t);
  let cus = $('#tav-custom-style');
  if (!cus) { cus = document.createElement('style'); cus.id = 'tav-custom-style'; document.head.appendChild(cus); }
  cus.textContent = t.customCss + '\n/* 用户自定义 */\n' + ((DB.config.custom && DB.config.custom.css) || '');
  const v = $('#vTheme'); if (v) v.textContent = t.name;
  if (!silent) toast('已切换主题：' + t.name);
  renderMessages();
  scrollToBottom();
}

/* ---------------- 顶栏 / 消息 ---------------- */
function statusText(s) {
  if (!s) return '';
  return { running: '运转中', paused: '已暂停', stopped: '已停止' }[s.instance.timeStatus] || '运转中';
}
function renderHeader() {
  const s = activeStory();
  const t1 = $('#title .t1'), t2 = $('#title .t2');
  if (!t1) return;
  t1.textContent = s ? (s.instanceName || s.world.name) : '启源';
  t2.textContent = s ? `${s.instance.currentTime} · ${statusText(s)} · ${s.player.name || '未命名'}` : '沉浸式虚拟世界体验';
  const app = $('#app'); if (app) app.dataset.status = s ? s.instance.timeStatus : '';
}
function renderQuick() {
  const s = activeStory();
  const el = $('#quickState');
  if (el) {
    el.textContent = !s ? '未创建世界' : (generating ? '书写中…' : statusText(s));
    el.className = 'quick-state ' + (s ? s.instance.timeStatus : '') + (generating ? ' busy' : '');
  }
  const frozen = !s || s.instance.timeStatus !== 'running';
  $$('#quickRow button[data-quick]').forEach(b => {
    const q = b.dataset.quick;
    const off = !s || generating || (q !== 'undo' && frozen);
    b.classList.toggle('off', off);
    b.disabled = off;
  });
}
function isNearBottom() {
  const el = $('#msgList');
  return el.scrollHeight - el.scrollTop - el.clientHeight < 160;
}
function lastAssistantId(s) {
  for (let i = s.messages.length - 1; i >= 0; i--) if (s.messages[i].role === 'assistant') return s.messages[i].id;
  return null;
}
function renderMessages() {
  const s = activeStory();
  const list = $('#msgList');
  if (!list) return;
  if (!s) {
    const nc = (DB.cards || []).length;
    list.innerHTML = `<div class="empty">
      <img class="brand-logo" src="logo.png" alt=""><div class="empty-mark">启源</div>
      <div class="empty-title">沉浸式虚拟世界体验</div>
      <div class="empty-sub">没有账号，没有服务器，没有世界市场。<br>所有设定、记忆与时间线都保存在这台设备上。</div>
      ${nc
        ? `<button class="pbtn" data-act="cards">从世界卡开始 · ${nc}</button>
           <button class="pbtn ghost" data-act="new-story" style="margin-top:10px">创建新世界</button>`
        : `<button class="pbtn" data-act="new-story">创建第一个世界</button>
           <button class="pbtn ghost" data-act="importCard" style="margin-top:10px">导入世界卡</button>`}
    </div>`;
    $$('[data-act]', list).forEach(b => {
      b.onclick = ev => { ev.stopPropagation(); handleAct(b.dataset.act, b); };
    });
    list.dataset.story = '';
    return;
  }
  const freshStory = list.dataset.story !== s.id;
  const singleNarrative = s.messages.length === 1 && s.messages[0].role !== 'user';
  const stick = !singleNarrative && ((freshStory && s.messages.length > 1) || isNearBottom());
  if (!s.messages.length) {
    list.innerHTML = `<div class="empty">
      <div class="empty-mark">${esc(storyInitial(s))}<span>世界</span></div>
      <div class="empty-title">${esc(s.world.name)}</div>
      <div class="empty-sub">${esc(s.world.desc || '故事尚未开始。')}</div>
      <button class="pbtn" data-act="opening">让天道写下开场</button>
    </div>`;
    list.dataset.story = s.id;
    return;
  }
  const lastA = lastAssistantId(s);
  const html = s.messages.map(m => {
    if (m.role === 'system') {
      return `<div class="sysnote ${m.kind || ''}">${esc(m.text)}</div>`;
    }
    if (m.role === 'user') {
      return `<div class="msg user" data-id="${m.id}">
        <div class="msg-card">
          <div class="msg-body">${paragraphs(m.text)}</div>
          <div class="msg-meta">${esc(s.player.name || '你')} · ${esc(m.time || '')}</div>
        </div>
        <div class="actions">
          <button class="abtn" data-act="copy" data-id="${m.id}" title="复制"><svg viewBox="0 0 24 24"><rect x="8" y="8" width="11" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2h2"/></svg></button>
          <button class="abtn" data-act="edit" data-id="${m.id}" title="编辑"><svg viewBox="0 0 24 24"><path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="M13 5l4 4"/></svg></button>
        </div>
      </div>`;
    }
    const isNpc = m.role === 'npc';
    const name = m.speaker || (isNpc ? 'NPC' : '天道');
    const initial = isNpc ? name[0] : storyInitial(s);
    const npcAv = isNpc ? imgRef((s.npcs.find(n => n.name === name) || {}).avatar || '') : '';
    const badge = m.kind === 'autonomous' ? '<span class="badge">自主</span>' : '';
    // 天道 / 系统回复的头像使用当前世界封面缩略图；NPC 仍用角色头像或首字。
    const avClass = isNpc ? 'msg-avatar' : 'msg-avatar cover';
    const avStyle = isNpc ? '' : coverStyle(s.world);
    const avInner = npcAv ? `<img src="${esc(npcAv)}" alt="">` : (isNpc ? esc(initial) : '');
    return `<div class="msg assistant ${isNpc ? 'npc' : ''}" data-id="${m.id}">
      <div class="msg-card">
        <div class="${avClass}" style="${avStyle}">${avInner}</div>
        <div class="msg-name">${esc(name)}${badge}<span class="dot"></span><span class="mtime">${esc(m.time || '')}</span></div>
        <div class="msg-body" id="body-${m.id}">${m.pending && !m.text ? '<div class="typing"><i></i><i></i><i></i></div>' : paragraphs(maskStream(m.text))}</div>
      </div>
      <div class="actions">
        ${m.id === lastA ? `<button class="abtn" data-act="regen" data-id="${m.id}" title="重写"><svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 11-2.3-5.6"/><path d="M20 4v5h-5"/></svg></button>` : ''}
        <button class="abtn" data-act="copy" data-id="${m.id}" title="复制"><svg viewBox="0 0 24 24"><rect x="8" y="8" width="11" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2h2"/></svg></button>
        <button class="abtn" data-act="del" data-id="${m.id}" title="删除至结尾"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13"/></svg></button>
      </div>
    </div>`;
  }).join('');
  list.innerHTML = html;
  list.dataset.story = s.id;
  if (singleNarrative) scrollToMessageTop(s.messages[0].id);
  else if (stick) scrollToBottom();
}
function scrollToBottom() {
  requestAnimationFrame(() => { const el = $('#msgList'); if (el) el.scrollTop = el.scrollHeight; });
}
function scrollToMessageTop(id) {
  requestAnimationFrame(() => {
    const el = $('#msgList'); if (!el) return;
    const m = el.querySelector('.msg[data-id="' + id + '"]'); if (!m) return;
    const top = m.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop;
    el.scrollTop = Math.max(0, top - 14);
  });
}

/* ---------------- 左抽屉：场景状态 ---------------- */
function renderStoryList() {
  const el = $('#storyList'); if (!el) return;
  if (!DB.stories.length) {
    el.innerHTML = ``;
    return;
  }
  el.innerHTML = DB.stories.map(s => {
    const last = [...s.messages].reverse().find(m => m.text);
    const pv = last ? last.text.replace(/\s+/g, ' ').slice(0, 40) : '尚未开始';
    return `<div class="story ${s.id === DB.activeId ? 'active' : ''}" data-sid="${s.id}">
      <div class="s-av cover" style="${coverStyle(s.world)}"></div>
      <div class="s-meta">
        <div class="s-name">${esc(s.instanceName || s.world.name)}</div>
        <div class="s-pv">${esc(pv)}</div>
        <div class="s-time"><i class="st-dot ${s.instance.timeStatus}"></i>${esc(s.instance.currentTime)} · ${esc(s.player.name)}</div>
      </div>
      <button class="s-more" data-more="${s.id}"><svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none"/></svg></button>
    </div>`;
  }).join('');
}
/** tick 时只更新时间文本，避免重建抽屉导致跳转输入框失焦。 */
function refreshLeftTime() {
  const s = activeStory();
  const root = $('#drawerLeft');
  if (!s || !root) return;
  const el = $('.sc-time', root);
  if (el && el.textContent !== s.instance.currentTime) el.textContent = s.instance.currentTime;
}
function renderLeft() {
  const el = $('#lScroll'); if (!el) return;
  const s = activeStory();
  const brandIcon = s
    ? `<span class="dr-logo cover" style="${coverStyle(s.world)}" role="img" aria-label="当前世界封面"></span>`
    : `<img class="dr-logo" src="logo.png" alt="启源">`;
  const brand = `<div class="dr-brand">
    ${brandIcon}
    <div class="dr-brand-meta"><b>启源</b><em>沉浸式虚拟世界体验</em></div>
  </div>`;
  if (!s) {
    const nc = (DB.cards || []).length;
    el.innerHTML = brand + `<div class="l-empty"><p>${nc ? `世界卡库里有 ${nc} 张世界卡，可以直接开始一局。` : '还没有世界实例。'}</p>
      <button class="pbtn" data-act="new-story">创建新世界</button>
      ${nc
        ? `<button class="pbtn ghost" data-act="cards" style="margin-top:10px">世界卡库 · ${nc} 张</button>`
        : `<button class="pbtn ghost" data-act="importCard" style="margin-top:10px">导入世界卡</button>`}
    </div>
    <div class="dr-foot"><button class="pbtn ghost" data-act="apis">模型与 API</button></div>`;
    // 空状态没有实例，抽屉内的按钮直接绑定，避免依赖委托时被其他逻辑吞掉。
    $$('[data-act]', el).forEach(b => {
      b.onclick = ev => { ev.stopPropagation(); handleAct(b.dataset.act, b); };
    });
    return;
  }
  const inst = s.instance;
  const running = inst.timeStatus === 'running';
  const paused = inst.timeStatus === 'paused';
  const npcs = s.npcs;
  el.innerHTML = brand + `
    <div class="dr-h"><span>世界状态</span><span class="live ${inst.timeStatus}">${statusText(s)}</span></div>
    <div class="status-card ${inst.timeStatus}">
      <div class="sc-head"><span class="sc-label">世界时间</span>${running ? '<span class="time-dot"></span>' : ''}</div>
      <div class="sc-time">${esc(inst.currentTime)}</div>
      <div class="time-controls">
        <button class="ctrl-btn ${running ? 'on' : ''}" data-act="tl:start" title="开始" aria-label="开始">
          <svg viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5z" fill="currentColor" stroke="none"/></svg></button>
        <button class="ctrl-btn ${paused ? 'on' : ''}" data-act="tl:pause" title="暂停" aria-label="暂停">
          <svg viewBox="0 0 24 24"><rect x="7" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" stroke="none"/><rect x="13.4" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" stroke="none"/></svg></button>
        <button class="ctrl-btn ${DB.ui.jumpOpen ? 'on' : ''}" data-act="tl:jump" title="时间跳转" aria-label="时间跳转">
          <svg viewBox="0 0 24 24"><path d="M4 12h11"/><path d="M11.5 8l4 4-4 4"/><path d="M19 5v14"/></svg></button>
      </div>
      ${DB.ui.jumpOpen ? `<div class="jump-row"><input class="jump-input" id="jumpInput" placeholder="目标时间，如 贞观三年三月初五" value=""><button class="jump-btn" data-act="tl:jump-go">跳转</button></div>
        <div class="jump-quick">${[['1时辰', 120], ['1天', 1440], ['7天', 10080]].map(([label, m]) => `<button class="mini" data-jump-add="${m}">+${label}</button>`).join('')}</div>
        <div class="jump-preview" id="jumpPreview">输入目标时间后显示预览</div>` : ''}
      <div class="speed-row"><span class="speed-label">流速</span>
        <div class="speed-chips">${[1, 2, 6, 12, 24].map(n => `<button class="speed-chip ${Number(inst.timeSpeed) === n ? 'on' : ''}" data-act="tl:speed" data-speed="${n}">${n}×</button>`).join('')}
        <input class="speed-custom" id="speedCustom" type="number" min="1" max="1440" placeholder="自定义" value="${[1, 2, 6, 12, 24].includes(Number(inst.timeSpeed)) ? '' : inst.timeSpeed}">
        </div>
      </div>
      <div class="loc-row"><span class="loc-label">你的位置</span><span class="loc-text">${esc(s.player.currentLocation || '未知')}</span></div>
      <div class="sc-note">${inst.timeStatus === 'running' ? `现实 1 分钟 ≈ 世界 ${inst.timeSpeed} 分钟` : '时间线冻结时，所有 Agent 停止运转。'}</div>
      ${parseWorldTime(inst.currentTime) ? '' : '<div class="sc-note warn-text">当前时间格式无法解析，时间不会推进。请在「历法与时间」改成受支持的格式（如 2026年5月10日 18:30 或 大晟二十三年十月十二日戌时）。</div>'}
    </div>
    ${storyModeOn(s) && currentStage(s) ? `<button class="stage-card left-stage" data-act="story">
      <div class="stage-card-h"><span class="stage-badge">第 ${currentStage(s).order} 阶段</span><b>${esc(currentStage(s).name)}</b></div>
      <div class="stage-meta">${esc(clampText(currentStage(s).summary || '', 86))}</div>
      <div class="stage-meta">${stageCanAdvance(s) ? '<b class="ok-text">推进条件已满足，点此查看</b>' : '推进条件：' + esc(stageExitLabel(currentStage(s)))}</div>
    </button>` : ''}
    <div class="npc-block">
      <div class="dr-sub" style="display:flex;align-items:center;justify-content:space-between">同世界角色<button class="mini" data-act="npcs">＋ 新建</button></div>
      ${npcs.length ? npcs.map(n => `<div class="npc-card" data-npc="${n.id}">
        <span class="emo-dot" style="background:${emotionColor(n.emotion)}"></span>
        <div class="npc-meta"><b>${esc(n.name)}</b><em>${esc(n.currentLocation || '位置未知')}</em></div>
        <span class="npc-emo">${esc(n.emotion || '')}</span>
      </div>`).join('') : ''}
    </div>
    <div class="dr-h" style="margin-top:6px"><span>故事存档</span><span style="display:flex;align-items:center;gap:10px"><button class="mini" data-act="cards">世界卡库</button><button class="mini" data-act="new-story">＋ 新建</button></span></div>
    <div class="story-list-inline" id="storyList"></div>
    <div class="dr-foot"><button class="pbtn danger-outline" data-act="tl:reset">重置当前实例</button><button class="pbtn ghost" data-act="apis">模型与 API</button><button class="pbtn ghost" data-act="new-story">创建新实例</button></div>
  `;
  renderStoryList();
}
function emotionColor(e) {
  const t = String(e || '');
  if (/怒|愤|暴躁/.test(t)) return '#e06a5c';
  if (/惧|怕|不安|紧张|警觉|戒备/.test(t)) return '#d8a45f';
  if (/悲|伤|倦|疲|低落/.test(t)) return '#7f9bbd';
  if (/喜|愉|轻松|平静|安稳/.test(t)) return '#7fbf9a';
  return '#9aa39e';
}

/* ---------------- 右抽屉：事件簿 / 模型 / 记忆 ---------------- */
function renderRight() {
  const el = $('#rScroll'); if (!el) return;
  const s = activeStory();
  if (!s) {
    el.innerHTML = `<div class="l-empty"><p>创建世界后，这里会显示事件簿、模型与记忆。</p><button class="pbtn" data-act="new-story">创建世界</button></div>`;
    $$('[data-act]', el).forEach(b => {
      b.onclick = ev => { ev.stopPropagation(); handleAct(b.dataset.act, b); };
    });
    return;
  }
  const ui = DB.ui;
  const tab = ui.rightTab || 'events';
  let body = '';
  if (tab === 'events') body = rightEvents(s);
  else if (tab === 'llm') body = rightLLM(s);
  else body = rightMemory(s);
  el.innerHTML = `
    <div class="rhead">
      <div class="r-avatar cover" style="${coverStyle(s.world)}" role="img" aria-label="世界封面"></div>
      <div class="r-meta"><div class="r-name">${esc(s.instanceName || s.world.name)}</div>
      <div class="r-sub">${esc(s.world.name)} · ${esc(s.player.name)} · ${esc(s.instance.currentTime)}</div></div>
    </div>
    <div class="cfg-tabs">
      <button class="cfg-tab ${tab === 'events' ? 'on' : ''}" data-tab="events">事件簿</button>
      <button class="cfg-tab ${tab === 'llm' ? 'on' : ''}" data-tab="llm">模型</button>
      <button class="cfg-tab ${tab === 'memory' ? 'on' : ''}" data-tab="memory">记忆</button>
    </div>
    <div class="tab-body">${body}</div>
    <div class="rgroup">世界</div>
    <div class="rowcard">
      <button class="rrow" data-act="world"><span class="rt">世界设定</span><span class="rv">${(s.world.fields || []).length} 条</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
      ${(s.world.storyArc && s.world.storyArc.stages.length) ? `<button class="rrow" data-act="story"><span class="rt">剧情阶段</span><span class="rv">${esc(storyModeOn(s) ? storyStageLabel(s) : '未开启')}</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>` : ''}
      <button class="rrow" data-act="timecfg"><span class="rt">历法与时间</span><span class="rv">${esc(s.world.calendarName || '未设定')}</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
      <button class="rrow" data-act="player"><span class="rt">我的角色</span><span class="rv">${esc(s.player.name)}</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
      <button class="rrow" data-act="npcs"><span class="rt">NPC 角色</span><span class="rv">${s.npcs.length} 位</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
    </div>
    <div class="rgroup">外观</div>
    <div class="rowcard">
      <button class="rrow" data-act="theme"><span class="rt">主题</span><span class="rv">${esc((THEMES[DB.config.theme] || THEMES.paper).name)}</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
      <button class="rrow" data-act="bg"><span class="rt">背景</span><span class="rv">${esc(bgName(storyBg(s)))}</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
    </div>
    <div class="rgroup">存档与实例</div>
    <div class="rowcard">
      <button class="rrow" data-act="cards"><span class="rt">世界卡库</span><span class="rv">${(DB.cards || []).length} 张 · 可复用</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
      <button class="rrow" data-act="rename"><span class="rt">修改实例名</span><span class="rv">${esc(s.instanceName)}</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
      <button class="rrow" data-act="exportCard"><span class="rt">导出世界卡</span><span class="rv">设定 · 可分享</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
      <button class="rrow" data-act="export"><span class="rt">导出存档</span><span class="rv">过程数据</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
      <button class="rrow" data-act="import"><span class="rt">导入存档</span><span class="rv">接世界卡</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
      <button class="rrow" data-act="delete"><span class="rt danger">删除实例</span><span class="rv">不可恢复</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
    </div>
    <div class="rgroup">关于</div>
    <div class="rowcard">
      <button class="rrow" data-act="about"><span class="rt">启源</span><span class="rv">v${esc(updateVersionName())}</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
    </div>
  `;
}
function rightEvents(s) {
  if (!s.events.length) {
    return `<div class="empty-mini"><span>◈</span><p>世界事件簿还是空的。</p></div>`;
  }
  return `<div class="ev-list">${s.events.map(e => `
    <div class="ev-card tappable" data-ev="${e.id}" data-text="${esc((e.title + ' ' + e.desc + ' ' + (e.location || '') + ' ' + (e.people || []).join(' ')).toLowerCase())}">
      <div class="ev-top"><span class="ev-cat c-${e.category}">${esc(e.category)}</span><span class="ev-time">${esc(e.time)}</span></div>
      <div class="ev-title">${esc(e.title)}</div>
      <div class="ev-desc">${esc(e.desc)}</div>
      ${(e.location || (e.people && e.people.length) || e.state) ? `<div class="ev-meta">${e.location ? `📍 ${esc(e.location)}` : ''}${e.people && e.people.length ? `${e.location ? ' · ' : ''}${esc(e.people.slice(0, 4).join('、'))}` : ''}${e.state ? `<div>${esc(e.state)}</div>` : ''}</div>` : ''}
      <div class="ev-imp">重要度 ${e.importance}/10</div>
    </div>`).join('')}</div>`;
}
function rightLLM(s) {
  const rows = [
    ['tiandao', '天道 Agent', '叙事编织 · 冲突裁决 · 事件判定'],
    ['character', '角色 Agent', 'NPC 四通道 · 自主行为 · 演化'],
    ['memory', '记忆 Agent', '情景抽取 · 书签巩固']
  ];
  return `<div class="llm-summary">
    ${rows.map(([k, name, desc]) => {
      const ref = llmRefOf(k, s);
      const ready = llmRefCandidates(k, s).length > 0;
      const follow = k !== 'tiandao' && ref === 'tiandao';
      const label = follow ? '跟随天道' : llmRefLabel(ref);
      return `<button class="cfg-card" data-act="llm:${k}">
        <div class="cfg-c-main"><b>${name}</b><em>${desc}</em></div>
        <div class="cfg-c-side"><span class="${ready ? 'ok' : 'warn'}">${esc(label)}</span><i>${follow ? '与天道共用' : (ref && String(ref).startsWith('pool:') ? '聚合 · 智能轮询' : '单接口')}</i></div>
      </button>`;
    }).join('')}
  </div>
  <button class="pbtn ghost" data-act="apis">管理模型与 API</button>
  `;
}
function rightMemory(s) {
  const ui = DB.ui;
  const charId = ui.memChar || 'player';
  const tab = ui.memTab || 'episodic';
  const chars = [['player', s.player.name], ...s.npcs.map(n => [n.id, n.name])];
  const mems = memoriesOf(s, charId);
  const bms = bookmarksOf(s, charId);
  let list = '';
  if (tab === 'episodic') {
    list = mems.length ? mems.slice(0, 60).map(m => `
      <div class="mem-card tappable" data-mem="${m.id}" data-text="${esc((m.event + ' ' + (m.location || '') + ' ' + (m.people || []).join(' ') + ' ' + m.time).toLowerCase())}">
        <div class="mem-top"><span class="imp i${Math.min(5, Math.ceil(m.importance / 2))}">${m.importance}</span><span class="mem-time">${esc(m.time)}${m.timeRange ? ' · 空洞' : ''}</span></div>
        <div class="mem-ev">${esc(m.event)}</div>
        <div class="mem-foot">${esc(m.location || '位置未知')}${m.people && m.people.length ? ' · ' + esc(m.people.join('、')) : ''}</div>
      </div>`).join('') : `<div class="empty-mini"><span>◈</span><p>还没有情景记忆。</p></div>`;
  } else {
    list = bms.length ? bms.slice(0, 50).map(b => `
      <div class="mem-card bm tappable" data-bm="${b.id}" data-text="${esc((b.question + ' ' + b.answer).toLowerCase())}">
        <div class="mem-top"><span class="bm-type t-${b.type}">${b.type === 'concept' ? '概念' : b.type === 'state' ? '状态' : '行为'}</span><span class="mem-time">${esc(b.time || '')}</span></div>
        <div class="bm-q">${esc(b.question)}</div>
        <div class="mem-ev">${esc(b.answer)}</div>
      </div>`).join('') : `<div class="empty-mini"><span>◈</span><p>还没有语义书签。</p></div>`;
  }
  return `<div class="mem-head">
    <div class="mem-counts"><span>情景 ${mems.length}</span><span>书签 ${bms.length}</span><span>L1 ${s.working.l1.filter(e => e.charId === charId).length}</span></div>
    <button class="mini" data-act="mem:consolidate">整理书签</button>
  </div>
  <div class="mem-search"><input class="input" id="memSearch" value="${esc(ui.memQuery || '')}" placeholder="搜索记忆 / 地点 / 人物" autocomplete="off"></div>
  <div class="mem-chars">${chars.map(([id, name]) => `<button class="chip ${id === charId ? 'on' : ''}" data-act="mem:char" data-char="${id}">${esc(name)}</button>`).join('')}</div>
  <div class="mem-subtabs"><button class="${tab === 'episodic' ? 'on' : ''}" data-act="mem:tab" data-tab="episodic">情景记忆</button><button class="${tab === 'semantic' ? 'on' : ''}" data-act="mem:tab" data-tab="semantic">语义书签</button></div>
  <div class="mem-list">${list}</div>`;
}

/* ---------------- 总渲染 ---------------- */
function renderAll() {
  if (DB.stories.length && !DB.stories.some(x => x.id === DB.activeId)) DB.activeId = DB.stories[0].id;
  applyBg();
  renderHeader();
  renderMessages();
  renderQuick();
  renderLeft();
  renderRight();
  setGenerating(generating);
}
