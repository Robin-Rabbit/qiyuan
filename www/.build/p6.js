
/* ============================================================
   六、UI 基础设施 · 设置页 · 向导 · 事件绑定 · 启动
   ============================================================ */
let overlayStack = [];

function openSheet({ title, sub, html, items, onMount, maxH }) {
  const wrap = document.createElement('div');
  wrap.className = 'overlay';
  wrap.innerHTML = `<div class="scrim"></div>
    <div class="sheet" style="${maxH ? `max-height:${maxH}` : ''}">
      <div class="handle"></div>
      <div class="stitle">${title || ''}</div>
      ${sub ? `<div class="ssub">${esc(sub)}</div>` : ''}
      <div class="slist"></div>
    </div>`;
  const sheet = $('.sheet', wrap), scrim = $('.scrim', wrap), list = $('.slist', wrap);
  const close = () => {
    sheet.classList.remove('show'); scrim.classList.remove('show');
    setTimeout(() => wrap.remove(), 300);
    overlayStack = overlayStack.filter(o => o.wrap !== wrap);
  };
  scrim.onclick = close;
  if (html) list.innerHTML = html;
  if (items) {
    list.innerHTML = items.map((it, i) => it.sep
      ? `<div class="sitem sep">${esc(it.sep)}</div>`
      : `<button class="sitem ${it.danger ? 'danger' : ''}" data-i="${i}">${it.icon || ''}<span>${esc(it.label)}</span></button>`).join('');
    list.onclick = e => {
      const b = e.target.closest('.sitem'); if (!b) return;
      const it = items[+b.dataset.i];
      if (it && it.onClick) it.onClick(); else close();
    };
  }
  if (onMount) onMount(wrap, close);
  $('#overlays').appendChild(wrap);
  requestAnimationFrame(() => { scrim.classList.add('show'); sheet.classList.add('show'); });
  overlayStack.push({ type: 'sheet', wrap, close });
  return { wrap, close, list };
}
function openDialog({ title, cancel = '取消', ok = '确定', okClass = '', onOk }) {
  const wrap = document.createElement('div');
  wrap.className = 'overlay dialog-wrap';
  wrap.innerHTML = `<div class="scrim"></div>
    <div class="dialog"><div class="dtitle">${title}</div>
      <div class="dbtns"><button class="cancel">${esc(cancel)}</button><button class="ok ${okClass}">${esc(ok)}</button></div>
    </div>`;
  const dlg = $('.dialog', wrap), scrim = $('.scrim', wrap);
  const close = () => {
    dlg.classList.remove('show'); scrim.classList.remove('show');
    setTimeout(() => wrap.remove(), 200);
    overlayStack = overlayStack.filter(o => o.wrap !== wrap);
  };
  $('.cancel', wrap).onclick = close;
  $('.ok', wrap).onclick = () => { close(); onOk && onOk(); };
  scrim.onclick = close;
  $('#overlays').appendChild(wrap);
  requestAnimationFrame(() => { scrim.classList.add('show'); dlg.classList.add('show'); });
  overlayStack.push({ type: 'dialog', wrap, close });
}
function pushPage({ title, body, action, actionClass, onAction }) {
  const page = document.createElement('div');
  page.className = 'page';
  page.innerHTML = `<div class="phead">
      <button class="back"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>
      <div class="ptitle">${esc(title)}</div>
      <button class="pact ${actionClass || ''}">${action || ''}</button>
    </div><div class="pbody"></div>`;
  $('.pbody', page).innerHTML = body || '';
  const close = () => {
    page.classList.remove('show');
    setTimeout(() => page.remove(), 260);
    overlayStack = overlayStack.filter(o => o.page !== page);
  };
  $('.back', page).onclick = close;
  if (action && onAction) $('.pact', page).onclick = onAction;
  $('#overlays').appendChild(page);
  requestAnimationFrame(() => page.classList.add('show'));
  overlayStack.push({ type: 'page', page, close });
  return { page, close, body: $('.pbody', page) };
}
function closeTop() {
  const top = overlayStack[overlayStack.length - 1];
  if (!top) return false;
  top.close();
  return true;
}
window.onAndroidBack = function () {
  if (overlayStack.length) { closeTop(); return true; }
  if ($('#topbar').classList.contains('show')) { hideHeader(); return true; }
  if ($('#drawerLeft').classList.contains('show')) { closeDrawer('left'); return true; }
  if ($('#drawerRight').classList.contains('show')) { closeDrawer('right'); return true; }
  return false;
};
function showHeader() { $('#topbar').classList.add('show'); const f = $('.top-fade'); if (f) f.classList.add('on'); }
function hideHeader() { $('#topbar').classList.remove('show'); const f = $('.top-fade'); if (f) f.classList.remove('on'); }
function openDrawer(side) {
  hideHeader();
  closeDrawer(side === 'left' ? 'right' : 'left');
  $('#drawer' + (side === 'left' ? 'Left' : 'Right')).classList.add('show');
  document.body.classList.add('dr-open');
  $('#scrim').classList.add('show');
  if (side === 'left') renderLeft(); else renderRight();
}
function closeDrawer(side) {
  if (side === 'left') $('#drawerLeft').classList.remove('show');
  else if (side === 'right') $('#drawerRight').classList.remove('show');
  else { $('#drawerLeft').classList.remove('show'); $('#drawerRight').classList.remove('show'); }
  const left = $('#drawerLeft').classList.contains('show');
  const right = $('#drawerRight').classList.contains('show');
  if (!left && !right) { document.body.classList.remove('dr-open'); $('#scrim').classList.remove('show'); }
}

/* ---------------- 角色表单 ---------------- */
const CHAR_FIELDS = [
  ['name', '姓名', 'input'], ['gender', '性别', 'input'], ['age', '年龄', 'input'], ['race', '种族', 'input'],
  ['occupation', '职业 / 身份', 'input'], ['faction', '所属势力', 'input'],
  ['appearance', '外貌', 'textarea'], ['personality', '性格', 'textarea'],
  ['speechStyle', '说话风格', 'textarea'], ['habits', '习惯', 'textarea'],
  ['likesDislikes', '好恶', 'textarea'], ['beliefs', '信念', 'textarea'],
  ['relationships', '关键人际关系', 'textarea'], ['abilities', '能力', 'textarea'], ['weaknesses', '弱点', 'textarea'],
  ['emotion', '情绪', 'input'], ['health', '健康', 'input'],
  ['inventory', '随身物品', 'textarea'], ['currentGoal', '当前目标', 'textarea'],
  ['profileMd', '角色档案补充（Markdown）', 'textarea']
];
function avatarPickerHTML(c) {
  const av = c && c.avatar;
  const avSrc = imgRef(av);
  return `<div class="avatar-pick">
    <div class="avatar-preview">${avSrc ? `<img src="${esc(avSrc)}" alt="">` : esc(((c && c.name) || '？')[0] || '？')}</div>
    <div class="avatar-info">
      <button type="button" class="mini" data-avatar-up="1">上传头像</button>
      ${av ? '<button type="button" class="mini" data-avatar-clear="1">清除</button>' : ''}
      
    </div>
    <input type="file" class="avatar-file" accept="image/*" hidden>
  </div>`;
}
function readAvatarFile(file, cb) {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    try {
      const N = 256;
      const cv = document.createElement('canvas'); cv.width = N; cv.height = N;
      const ctx = cv.getContext('2d');
      const r = Math.max(N / img.width, N / img.height);
      const dw = img.width * r, dh = img.height * r;
      ctx.drawImage(img, (N - dw) / 2, (N - dh) / 2, dw, dh);
      URL.revokeObjectURL(url);
      cb(cv.toDataURL('image/jpeg', 0.85));
    } catch (e) { URL.revokeObjectURL(url); cb(''); }
  };
  img.onerror = () => { URL.revokeObjectURL(url); cb(''); };
  img.src = url;
}
function mountAvatarPicker(root, c, onChange) {
  if (!root || !c) return;
  const prev = $('.avatar-preview', root);
  const file = $('.avatar-file', root);
  const refresh = () => {
    if (prev) prev.innerHTML = imgRef(c.avatar) ? `<img src="${esc(imgRef(c.avatar))}" alt="">` : esc((c.name || '？')[0] || '？');
    const clear = $('[data-avatar-clear]', root);
    if (clear) clear.style.display = c.avatar ? '' : 'none';
  };
  root.addEventListener('click', e => {
    if (e.target.closest('[data-avatar-up]') && file) file.click();
    if (e.target.closest('[data-avatar-clear]')) {
      const old = c.avatar;
      c.avatar = ''; refresh(); if (onChange) onChange(); toast('头像已清除');
      if (isMediaRef(old)) mediaDel(old.slice(MEDIA_PREFIX.length));
    }
  });
  if (file) file.addEventListener('change', () => {
    const f = file.files && file.files[0]; if (!f) return;
    readAvatarFile(f, data => {
      if (data) {
        const old = c.avatar;
        storeImage(c, 'avatar', data).then(() => {
          refresh(); if (onChange) onChange(); toast('头像已更新');
          if (isMediaRef(old)) mediaDel(old.slice(MEDIA_PREFIX.length));
        });
      }
      else toast('头像读取失败', false);
      try { file.value = ''; } catch (err) { }
    });
  });
  refresh();
}
function charForm(c) {
  const basic = ['name', 'gender', 'age', 'race', 'occupation', 'faction'];
  const state = ['emotion', 'health', 'inventory', 'currentGoal'];
  const map = {};
  CHAR_FIELDS.forEach(f => { map[f[0]] = f; });
  const row = k => {
    const [key, label, type] = map[k];
    const v = c[key] == null ? '' : c[key];
    if (type === 'textarea') {
      return `<div class="field"><label>${label}</label><textarea class="input" data-k="${key}" rows="${key === 'appearance' || key === 'profileMd' ? 4 : 3}">${esc(v)}</textarea></div>`;
    }
    return `<div class="field"><label>${label}</label><input class="input" data-k="${key}" value="${esc(v)}"></div>`;
  };
  return `${avatarPickerHTML(c)}<div class="group">基础信息</div>${basic.map(row).join('')}
    <div class="group">性格与表达</div>${['appearance', 'personality', 'speechStyle', 'habits', 'likesDislikes', 'beliefs', 'relationships'].map(row).join('')}
    <div class="group">能力与状态</div>${['abilities', 'weaknesses', ...state].map(row).join('')}
    <div class="group">补充</div>${row('profileMd')}${traitsBlock(c)}`;
}
function traitsBlock(c) {
  const a = c.appearanceTraits || [], h = c.habitTraits || [];
  if (!a.length && !h.length) return '';
  const line = (t, label) => `<div class="trait"><span>${label}</span>${esc(t.text)}<i>${esc(t.time || '')}</i></div>`;
  return `<div class="group">演化特质</div><div class="traits">
    ${a.map(t => line(t, '外貌')).join('')}${h.map(t => line(t, '习惯')).join('')}
  </div>`;
}
function readCharForm(root) {
  const out = {};
  $$('[data-k]', root).forEach(el => { out[el.dataset.k] = el.value.trim(); });
  return out;
}
const MAX_CUSTOM_FIELDS = 10;
function fieldRowHTML(f, i, fixed) {
  return `<div class="frow ${fixed ? 'fixed' : ''}" data-fi="${i}">
    <input class="input fin-path" value="${esc(f.path)}" placeholder="字段名，如 地理/临江镇" ${fixed ? 'readonly' : ''}>
    <textarea class="input fin-val" rows="${fixed ? 7 : 2}" placeholder="字段内容">${esc(f.value)}</textarea>
    ${fixed ? '<span class="ffix">默认</span>' : `<button class="fdel" data-del-field="${i}">删除</button>`}
  </div>`;
}
function fieldsEditor(fields, ensureWorld) {
  let list = (fields || []).map(f => ({ path: f.path, value: f.value }));
  if (ensureWorld && !list.some(f => f.path === '世界观')) list.unshift({ path: '世界观', value: '' });
  let worldSeen = false;
  const rows = list.map((f, i) => {
    const fixed = f.path === '世界观' && !worldSeen;
    if (fixed) worldSeen = true;
    return fieldRowHTML(f, i, fixed);
  }).join('');
  const custom = list.filter(f => f.path !== '世界观').length;
  return `<div class="fields-editor" id="fieldsEditor">${rows}</div>
    <button class="pbtn ghost" id="addField" ${custom >= MAX_CUSTOM_FIELDS ? 'disabled' : ''}>＋ 新增自定义条目（${custom}/${MAX_CUSTOM_FIELDS}）</button>
    `;
}
function addFieldRow(ed, prefix) {
  const custom = $$('.frow', ed).filter(r => {
    const p = $('.fin-path', r); return p && p.value.trim() !== '世界观';
  }).length;
  if (custom >= MAX_CUSTOM_FIELDS) { toast('自定义条目最多 ' + MAX_CUSTOM_FIELDS + ' 条', false); return; }
  const i = $$('.frow', ed).length;
  ed.insertAdjacentHTML('beforeend', fieldRowHTML({ path: '', value: '' }, i, false));
  const btn = $((prefix || '') + '#addField', ed.parentElement) || $('#addField');
  if (btn) {
    const n = custom + 1;
    btn.textContent = '＋ 新增自定义条目（' + n + '/' + MAX_CUSTOM_FIELDS + '）';
    if (n >= MAX_CUSTOM_FIELDS) btn.disabled = true;
  }
}
function refreshFieldCounter(root) {
  const ed = $('#fieldsEditor', root); if (!ed) return;
  const custom = $$('.frow', ed).filter(r => {
    const p = $('.fin-path', r); return p && p.value.trim() !== '世界观';
  }).length;
  const btn = $('#addField', root); if (!btn) return;
  btn.textContent = '＋ 新增自定义条目（' + custom + '/' + MAX_CUSTOM_FIELDS + '）';
  btn.disabled = custom >= MAX_CUSTOM_FIELDS;
}
function readFieldsEditor(root) {
  const all = $$('.frow', root).map(r => ({
    path: $('.fin-path', r).value.trim(),
    value: $('.fin-val', r).value
  })).filter(f => f.path);
  const world = all.find(f => f.path === '世界观');
  const custom = all.filter(f => f.path !== '世界观').slice(0, MAX_CUSTOM_FIELDS);
  return world ? [world, ...custom] : custom;
}

/* ---------------- 设置页 ---------------- */
function coverPickerHTML(w) {
  const active = activeCoverId(w) || 'fog';
  return `<div class="field cover-field"><label>世界封面</label>
    <div class="cover-pick">
      <div class="cover-preview" style="${coverStyle(w)}"></div>
      <div class="cover-grid">
        ${COVERS.map(c => `<button type="button" class="cover-tile ${active === c.id ? 'on' : ''}" data-cover="${c.id}" style="background-image:url('${c.src}')" title="${c.name}" aria-label="${c.name}"></button>`).join('')}
        <button type="button" class="cover-tile up" data-cover-up="1" title="上传图片" aria-label="上传图片">＋</button>
      </div>
      <input type="file" class="cover-file" accept="image/*" hidden>
    </div></div>`;
}
function readCoverFile(file, cb) {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    try {
      const W = 1000, H = 563;
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const ctx = cv.getContext('2d');
      const r = Math.max(W / img.width, H / img.height);
      const dw = img.width * r, dh = img.height * r;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      URL.revokeObjectURL(url);
      cb(cv.toDataURL('image/jpeg', .82));
    } catch (e) { URL.revokeObjectURL(url); cb(''); }
  };
  img.onerror = () => { URL.revokeObjectURL(url); cb(''); };
  img.src = url;
}
function mountCoverPicker(root, w, onDone) {
  if (!root || !w) return;
  const prev = $('.cover-preview', root);
  const file = $('.cover-file', root);
  const refresh = () => {
    if (prev) prev.setAttribute('style', coverStyle(w));
    $$('.cover-tile[data-cover]', root).forEach(x => x.classList.toggle('on', !w.cover && x.dataset.cover === (activeCoverId(w) || 'fog')));
  };
  root.addEventListener('click', e => {
    const tile = e.target.closest('[data-cover]');
    if (tile) {
      w.coverId = tile.dataset.cover; w.cover = '';
      refresh(); if (onDone) onDone(); return;
    }
    if (e.target.closest('[data-cover-up]') && file) file.click();
  });
  if (file) file.addEventListener('change', () => {
    const f = file.files && file.files[0]; if (!f) return;
    readCoverFile(f, data => {
      if (data) {
        const old = w.cover;
        storeImage(w, 'cover', data).then(() => {
          w.coverId = ''; refresh(); if (onDone) onDone(); toast('封面已更新');
          if (isMediaRef(old)) mediaDel(old.slice(MEDIA_PREFIX.length));
        });
      }
      else toast('图片读取失败', false);
      try { file.value = ''; } catch (err) { }
    });
  });
}

function pageWorld(s) {
  const w = s.world;
  const { page, close, body } = pushPage({
    title: '世界设定', action: '保存', actionClass: 'grad',
    body: `
      ${coverPickerHTML(w)}
      <div class="field"><label>世界名称</label><input class="input" id="wName" value="${esc(w.name)}"></div>
      <div class="field"><label>世界描述（玩家可见）</label><textarea class="input" id="wDesc" rows="4">${esc(w.desc)}</textarea></div>
      <div class="field"><label>历法名称</label><input class="input" id="wCal" value="${esc(w.calendarName)}" placeholder="如 大晟、民国、星历"></div>
      <div class="field"><label>起始时间</label><input class="input" id="wStart" value="${esc(w.startTime)}" placeholder="如 大晟二十三年十月十二日戌时"></div>
      <div class="field"><label>地理层级</label><textarea class="input" id="wLoc" rows="2">${esc(w.locationSchema)}</textarea></div>
      <div class="field"><label>天道附加指令（不影响其他提示词）</label><textarea class="input" id="wPrompt" rows="3">${esc(w.tiandaoPrompt)}</textarea></div>
      <div class="group">世界设定条目（会注入所有 Agent 提示词）</div>
      ${fieldsEditor(w.fields)}
      
      <div class="group">剧情模式</div>
      <div class="rowcard">
        <button class="rrow" id="wStory"><span class="rt">剧情阶段</span><span class="rv">${esc(storyModeOn(s) ? storyStageLabel(s) : ((w.storyArc && w.storyArc.stages.length) ? '已规划 · 未开启' : '未开启'))}</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
      </div>
      `,
    onAction: () => {
      w.name = $('#wName', page).value.trim() || w.name;
      w.desc = $('#wDesc', page).value.trim();
      w.calendarName = $('#wCal', page).value.trim();
      w.startTime = $('#wStart', page).value.trim();
      w.locationSchema = $('#wLoc', page).value.trim();
      w.tiandaoPrompt = $('#wPrompt', page).value.trim();
      w.fields = readFieldsEditor(body);
      if (!s.instance.startTime) s.instance.startTime = w.startTime;
      saveDB(); renderAll(); close(); toast('世界设定已保存');
    }
  });
  mountCoverPicker($('.cover-pick', page), w, () => { saveDB(); renderAll(); });
  body.addEventListener('click', e => {
    if (e.target.id === 'addField') { addFieldRow($('#fieldsEditor', body)); }
    const del = e.target.closest('[data-del-field]');
    if (del) { del.closest('.frow').remove(); refreshFieldCounter(body); }
    if (e.target.closest('#wStory')) pageStory(s);
  });
  return { page, close };
}

function pageTime(s) {
  const w = s.world, inst = s.instance;
  const { page, close } = pushPage({
    title: '历法与时间', action: '保存', actionClass: 'grad',
    body: `
      <div class="field"><label>历法名称</label><input class="input" id="tCal" value="${esc(w.calendarName)}" placeholder="如 大晟"></div>
      <div class="field"><label>世界起始时间</label><input class="input" id="tStart" value="${esc(inst.startTime)}"></div>
      <div class="field"><label>当前世界时间</label><input class="input" id="tNow" value="${esc(inst.currentTime)}"></div>
      ${parseWorldTime(inst.currentTime) ? '' : '<div class="hint warn-text" style="margin:-4px 0 10px">当前时间格式无法解析，时间不会推进。支持：2026-05-10 18:30、2026年5月10日 18:30、大晟二十三年十月十二日戌时、贞观三年三月初五。日期后可带「星期日 / 周一」。</div>'}
      <div class="field"><label>流速（现实 1 分钟 = 世界 N 分钟）</label><input class="input" id="tSpeed" type="number" min="1" max="1440" value="${inst.timeSpeed}"></div>
      <div class="field"><label>时间线状态</label>
        <div class="seg" id="tStatus">
          <button data-v="running" class="${inst.timeStatus === 'running' ? 'on' : ''}">运转中</button>
          <button data-v="paused" class="${inst.timeStatus === 'paused' ? 'on' : ''}">暂停</button>
          <button data-v="stopped" class="${inst.timeStatus === 'stopped' ? 'on' : ''}">停止</button>
        </div>
      </div>
      
      <button class="pbtn ghost" id="useNow">以当前时间作为最后互动时间</button>`,
    onAction: () => {
      w.calendarName = $('#tCal', page).value.trim();
      inst.startTime = $('#tStart', page).value.trim() || inst.startTime;
      const nowRaw = $('#tNow', page).value.trim();
      if (nowRaw) inst.currentTime = nowRaw;
      inst.timeSpeed = Math.max(1, parseInt($('#tSpeed', page).value, 10) || 1);
      const on = $('#tStatus button.on', page);
      if (on) inst.timeStatus = on.dataset.v;
      inst.lastTick = nowTs();
      inst._timeCarry = 0;
      saveDB(); renderAll(); close(); toast('时间线已更新');
    }
  });
  $('#tStatus', page).addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#tStatus button', page).forEach(x => x.classList.remove('on'));
    b.classList.add('on');
  });
  $('#useNow', page).onclick = () => {
    const v = $('#tNow', page).value.trim();
    if (v) { $('#tStart', page).value = v; }
    s.instance.lastActiveTime = v || s.instance.currentTime;
    saveDB(); toast('已更新最后互动时间');
  };
  return { page, close };
}

function pagePlayer(s) {
  const { page, close, body } = pushPage({
    title: '我的角色', action: '保存', actionClass: 'grad',
    body: `${charForm(s.player)}
      <div class="field"><label>当前位置</label><input class="input" id="pLoc" value="${esc(s.player.currentLocation)}"></div>
      <button class="pbtn ghost" id="relocate">让天道重新生成起始位置</button>
      `,
    onAction: () => {
      const prevAge = s.player.age;
      Object.assign(s.player, readCharForm(body));
      if (s.player.age !== prevAge) resetAgeAnchor(s, s.player);
      const loc = $('#pLoc', page).value.trim();
      if (loc) s.player.currentLocation = loc;
      saveDB(); renderAll(); close(); toast('角色已保存');
    }
  });
  mountAvatarPicker($('.avatar-pick', page), s.player, () => saveDB());
  $('#relocate', page).onclick = async () => {
    if (!hasLLM('tiandao', s)) { toast('请先配置模型', false); return; }
    toast('正在推演位置…');
    try {
      const p = startLocationPrompt(s);
      const res = await llmChat([{ role: 'system', content: p.system }, { role: 'user', content: p.user }],
        { kind: 'tiandao', story: s, maxTokens: 220, temperature: 0.6, stream: false });
      const j = extractJSON(res.text);
      if (j && j.location) {
        s.player.currentLocation = j.location;
        $('#pLoc', page).value = j.location;
        saveDB(); toast('已重新定位：' + j.location);
      } else toast('未能生成位置', false);
    } catch (e) { toast('定位失败：' + e.message, false); }
  };
  return { page, close };
}

function pageNPCs(s) {
  const { page, close } = pushPage({
    title: 'NPC 角色', action: '新增', actionClass: 'grad',
    body: `
      <div class="rowcard" id="npcList">
        ${s.npcs.map(n => `<button class="rrow" data-npc-edit="${n.id}">
          <span class="npc-avatar">${imgRef(n.avatar) ? `<img src="${esc(imgRef(n.avatar))}" alt="">` : esc(n.name[0] || '？')}</span>
          <span class="rt">${esc(n.name)}<em style="display:block;font-size:12px;color:#8a8a8a;font-style:normal;margin-top:3px">${esc(n.occupation || '未设定')} · ${esc(n.currentLocation || '位置未知')}</em></span>
          <span class="rv">v${n.evolutionVersion || 1}</span>
          <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
        </button>`).join('') || ''}
      </div>`,
    onAction: () => {
      const n = Object.assign(blankCharacter(''), {
        id: uid('npc'), currentLocation: s.player.currentLocation, emotion: '平静', health: '良好',
        evolutionVersion: 1, lastEvolutionAt: ''
      });
      s.npcs.push(n); saveDB(); close(); pageNPCEdit(s, n);
    }
  });
  $('#npcList', page).addEventListener('click', e => {
    const b = e.target.closest('[data-npc-edit]'); if (!b) return;
    const n = s.npcs.find(x => x.id === b.dataset.npcEdit); if (!n) return;
    pageNPCEdit(s, n);
  });
  return { page, close };
}
function pageNPCEdit(s, npc) {
  const isNew = !npc.name;
  const { page, close, body } = pushPage({
    title: isNew ? '新增 NPC' : npc.name, action: '保存', actionClass: 'grad',
    body: `${charForm(npc)}
      <div class="field"><label>当前位置（完整地理层级）</label><input class="input" id="nLoc" value="${esc(npc.currentLocation)}"></div>
      <div class="group">认知边界（剧情模式，可选）</div>
      
      <div class="two">
        <div class="field"><label>境界 / 能力上限</label><input class="input" id="nCogRealm" value="${esc((npc.cognition && npc.cognition.realm) || '')}"></div>
        <div class="field"><label>社会阶层 / 身份</label><input class="input" id="nCogSocial" value="${esc((npc.cognition && npc.cognition.social) || '')}"></div>
      </div>
      <div class="field"><label>可及地理（逗号分隔）</label><input class="input" id="nCogGeo" value="${esc(((npc.cognition && npc.cognition.geography) || []).join('，'))}"></div>
      <div class="field"><label>已知势力（逗号分隔）</label><input class="input" id="nCogFactions" value="${esc(((npc.cognition && npc.cognition.knownFactions) || []).join('，'))}"></div>
      <div class="field"><label>不可知道（每行一条）</label><textarea class="input" id="nCogForbid" rows="2">${esc(((npc.cognition && npc.cognition.forbidden) || []).join('\n'))}</textarea></div>
      <div class="field"><label>该 NPC 听过的传闻（每行一条）</label><textarea class="input" id="nCogRumors" rows="2">${esc(((npc.cognition && npc.cognition.rumors) || []).join('\n'))}</textarea></div>
      <button class="pbtn ghost" id="nEvo">查看演化记录</button>
      <button class="pbtn ghost" id="nDel" style="color:#e06a5c;border-color:rgba(224,106,92,.35)">删除该 NPC</button>
      `,
    onAction: () => {
      const prevAge = npc.age;
      Object.assign(npc, readCharForm(body));
      if (npc.age !== prevAge) resetAgeAnchor(s, npc);
      const loc = $('#nLoc', page).value.trim();
      if (loc) npc.currentLocation = loc;
      const cog = {
        realm: $('#nCogRealm', page).value.trim(),
        social: $('#nCogSocial', page).value.trim(),
        geography: ($('#nCogGeo', page).value || '').split(/[，,、]/).map(x => x.trim()).filter(Boolean),
        knownFactions: ($('#nCogFactions', page).value || '').split(/[，,、]/).map(x => x.trim()).filter(Boolean),
        forbidden: ($('#nCogForbid', page).value || '').split('\n').map(x => x.trim()).filter(Boolean),
        rumors: ($('#nCogRumors', page).value || '').split('\n').map(x => x.trim()).filter(Boolean)
      };
      npc.cognition = hasCognition(cog) ? normalizeCognition(cog) : null;
      if (!npc.name) npc.name = '无名者';
      saveDB(); renderAll(); close(); toast('NPC 已保存');
    }
  });
  mountAvatarPicker($('.avatar-pick', page), npc, () => saveDB());
  $('#nEvo', page).onclick = () => {
    const list = s.evolutions.filter(e => e.npcId === npc.id);
    openSheet({
      title: npc.name + ' · 演化记录', sub: `当前版本 v${npc.evolutionVersion || 1}`,
      html: list.length ? `<div class="evo-list">${list.map((e, i) => `<div class="evo-card"><div class="ev-time">${esc(e.time)} · ${esc(e.changeType || '')}</div><div class="mem-ev">${esc(e.description || '')}</div><div class="mem-foot">${esc(e.trigger || '')}</div>${i === 0 ? `<button class="mini evo-revert" data-revo="${e.id}">回退这次演化</button>` : ''}</div>`).join('')}</div>`
        : '<div class="empty-mini"><span>◈</span><p>还没有发生演化。</p><em>当角色积累 5 条以上重要度 ≥7 的记忆时，角色 Agent 会评估是否发生持久改变。</em></div>',
      onMount: (wrap, close) => {
        $('.slist', wrap).addEventListener('click', ev => {
          const btn = ev.target.closest('[data-revo]');
          if (!btn) return;
          const id = btn.dataset.revo;
          openDialog({
            title: '回退这次演化？<br><span style="font-size:12px;color:#bdbdbd">角色会恢复到演化前的档案，这次及之后的演化记录会被删除。</span>',
            ok: '回退', okClass: 'danger',
            onOk: () => {
              if (revertEvolution(s, id)) { close(); renderAll(); toast('已回退演化'); }
              else toast('回退失败', false);
            }
          });
        });
      }
    });
  };
  $('#nDel', page).onclick = () => {
    openDialog({
      title: `删除 ${esc(npc.name)}？<br><span style="font-size:12px;color:#bdbdbd">该角色的记忆也会一并清除。</span>`,
      ok: '删除', okClass: 'danger', onOk: () => {
        s.npcs = s.npcs.filter(n => n.id !== npc.id);
        s.memories = s.memories.filter(m => m.charId !== npc.id);
        s.bookmarks = s.bookmarks.filter(b => b.charId !== npc.id);
        s.working.l1 = s.working.l1.filter(x => x.charId !== npc.id);
        saveDB(); renderAll(); close(); close(); toast('已删除');
      }
    });
  };
  return { page, close };
}

function pageAppearance(s) {
  const bg = storyBg(s);
  const { page, close } = pushPage({
    title: '外观与背景', action: '保存', actionClass: 'grad',
    body: `
      <div class="group">主题</div>
      <div class="pgsec">${Object.values(THEMES).map(t => `<button class="trow ${DB.config.theme === t.id ? 'on' : ''}" data-theme="${t.id}">
        <span class="ticon world">${esc(t.name[0])}</span>
        <span class="tmeta"><b>${esc(t.name)}</b><em>${esc(t.desc)}</em></span>
        <span class="tcheck"></span></button>`).join('')}</div>
      <div class="group">背景</div>
      <div class="bggrid">${BG_PRESETS.map(p => `<button class="bgcell ${bg.preset === p.id && !bg.src ? 'on' : ''}" data-bg="${p.id}">
        <span class="bgsw" style="background:${p.css || 'linear-gradient(135deg,#2a3a34,#1a1f22)'}"></span>
        <span class="bgn">${esc(p.name)}</span></button>`).join('')}</div>
      <div class="field"><label>自定义图片地址</label><input class="input" id="bgSrc" value="${esc(bg.src)}" placeholder="https://… 或 data:image/…"></div>
      <div class="field"><label>不透明度 <span id="bgOv">${Math.round(bg.opacity * 100)}</span>%</label><input class="input" id="bgOp" type="range" min="0" max="100" value="${Math.round(bg.opacity * 100)}"></div>
      <div class="field"><label>模糊 <span id="bgBl">${bg.blur}</span>px</label><input class="input" id="bgBlur" type="range" min="0" max="20" value="${bg.blur}"></div>
      <div class="group">主题微调</div>
      <div class="field"><label>字号（px）</label><input class="input" id="thFont" type="number" step="0.5" value="${DB.config.custom.fontSize || THEMES[DB.config.theme].font.size}"></div>
      <div class="field"><label>行高</label><input class="input" id="thLine" type="number" step="0.05" value="${DB.config.custom.line || THEMES[DB.config.theme].font.line}"></div>
      <div class="field"><label>主色调</label><input class="input color" id="thSend" value="${DB.config.custom.send || THEMES[DB.config.theme].console.send}"></div>
      <div class="field"><label>自定义 CSS</label><textarea class="input" id="thCss" rows="5" placeholder=".msg-body{letter-spacing:.4px}">${esc(DB.config.custom.css || '')}</textarea></div>
      `,
    onAction: () => {
      bg.src = $('#bgSrc', page).value.trim();
      bg.opacity = (+$('#bgOp', page).value) / 100;
      bg.blur = +$('#bgBlur', page).value;
      s.bg = bg;
      DB.config.custom.fontSize = +$('#thFont', page).value || '';
      DB.config.custom.line = +$('#thLine', page).value || '';
      DB.config.custom.send = $('#thSend', page).value;
      DB.config.custom.css = $('#thCss', page).value;
      saveDB(); applyTheme(DB.config.theme, true); applyBg(); renderAll(); close(); toast('外观已保存');
    }
  });
  page.addEventListener('click', e => {
    const t = e.target.closest('[data-theme]');
    if (t) { applyTheme(t.dataset.theme); $$('.trow', page).forEach(x => x.classList.toggle('on', x.dataset.theme === DB.config.theme)); }
    const b = e.target.closest('[data-bg]');
    if (b) {
      bg.preset = b.dataset.bg; bg.src = ''; $('#bgSrc', page).value = '';
      $$('.bgcell', page).forEach(x => x.classList.toggle('on', x.dataset.bg === bg.preset));
      s.bg = bg; applyBg();
    }
  });
  $('#bgOp', page).oninput = e => {
    $('#bgOv', page).textContent = e.target.value;
    s.bg = Object.assign(storyBg(s), { opacity: +e.target.value / 100 });
    applyBg();
  };
  $('#bgBlur', page).oninput = e => {
    $('#bgBl', page).textContent = e.target.value;
    s.bg = Object.assign(storyBg(s), { blur: +e.target.value });
    applyBg();
  };
  return { page, close };
}

function apiHost(ep) {
  try { return new URL(String(ep || '')).host || String(ep || ''); } catch (e) { return String(ep || '').replace(/^https?:\/\//, '').split('/')[0] || '未填地址'; }
}
function pageAPIs() {
  const { page, close } = pushPage({ title: '模型与 API', action: '', body: '<div class="pbody-inner"></div>' });
  const root = $('.pbody-inner', page);
  const draw = () => {
    const apis = llmApis();
    const pools = llmPools();
    const assign = DB.config.llmAssign || {};
    const rows = (list, empty) => list.length ? list.join('') : `<div class="empty-mini" style="padding:18px 16px"><p>${empty}</p></div>`;
    root.innerHTML = `
      
      <div class="group">API 接口</div>
      <div class="rowcard">${rows(apis.map(a => {
        const ready = apiReady(a);
        return `<button class="rrow" data-api="${a.id}">
          <span class="rt">${esc(a.name || a.model || '未命名接口')}<em class="rsub">${esc((a.format === 'anthropic' ? 'Anthropic' : 'OpenAI') + ' · ' + (a.model || '未填模型') + ' · ' + apiHost(a.endpoint))}</em></span>
          <span class="rv ${a.enabled === false ? 'muted' : (ready ? 'ok' : 'warn')}">${a.enabled === false ? '已停用' : (ready ? '可用' : '待补全')}</span>
          <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>`;
      }), '还没有接口。')}</div>
      <button class="pbtn ghost" id="addApi">＋ 新增接口</button>
      <div class="group">聚合 · 智能轮询</div>
      <div class="rowcard">${rows(pools.map(p => `<button class="rrow" data-pool="${p.id}">
        <span class="rt">${esc(p.name || '聚合')}<em class="rsub">${poolMembers(p).length} 个可用接口 · 按成功率与延迟轮询</em></span>
        <span class="rv">${p.enabled === false ? '已停用' : poolMembers(p).length ? '可用' : '空组'}</span>
        <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>`), '还没有聚合。')}</div>
      <button class="pbtn ghost" id="addPool">＋ 新建聚合</button>
      <div class="group">全局默认</div>
      <div class="rowcard">${['tiandao', 'character', 'memory'].map(k => `<button class="rrow" data-assign="${k}">
        <span class="rt">${LLM_LABEL[k]} Agent<em class="rsub">${esc(llmRefLabel((assign || {})[k]))}</em></span>
        <span class="rv">全局</span>
        <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>`).join('')}</div>
      `;
    $('#addApi', root).onclick = () => pageApiEdit('');
    $('#addPool', root).onclick = () => pagePoolEdit('');
    $$('[data-api]', root).forEach(b => b.onclick = () => pageApiEdit(b.dataset.api));
    $$('[data-pool]', root).forEach(b => b.onclick = () => pagePoolEdit(b.dataset.pool));
    $$('[data-assign]', root).forEach(b => b.onclick = () => pageLLM(b.dataset.assign, true));
  };
  draw();
  page.__apisDraw = draw;
  PAGE_APIS_PAGES.add(page);
  const oc = close;
  page.__apisClose = () => {
    PAGE_APIS_PAGES.delete(page);
    oc();
  };
  page.close = page.__apisClose;
  const o = overlayStack[overlayStack.length - 1];
  if (o && o.page === page) o.close = page.__apisClose;
  return { page, close: page.__apisClose };
}
const PAGE_APIS_PAGES = new Set();
function refreshAPIPage() {
  PAGE_APIS_PAGES.forEach(p => {
    if (!document.body.contains(p)) { PAGE_APIS_PAGES.delete(p); return; }
    if (typeof p.__apisDraw === 'function') { try { p.__apisDraw(); } catch (e) { } }
  });
}

function pageApiEdit(id) {
  const isNew = !id;
  const src = (id && findApi(id)) || blankApi();
  let enabled = src.enabled !== false;
  let pickedFmt = src.format === 'anthropic' ? 'anthropic' : 'openai';
  const readForm = page => ({
    name: $('#aName', page).value.trim(),
    format: (($('#aFmt button.on', page) || {}).dataset || {}).v === 'anthropic' ? 'anthropic' : 'openai',
    endpoint: $('#aEp', page).value.trim(),
    apiKey: $('#aKey', page).value.trim(),
    model: $('#aModel', page).value.trim(),
    temperature: +$('#aTemp', page).value,
    maxTokens: parseInt($('#aMax', page).value, 10) || 1400
  });
  const { page, close } = pushPage({
    title: isNew ? '新增接口' : '编辑接口', action: '保存', actionClass: 'grad',
    body: `
      <div class="field"><label>名称</label><input class="input" id="aName" value="${esc(src.name || '')}" placeholder="如 DeepSeek / 备用线路"></div>
      <div class="field"><label>接口格式</label><div class="seg" id="aFmt">
        <button data-v="openai" class="${pickedFmt !== 'anthropic' ? 'on' : ''}">OpenAI 兼容</button>
        <button data-v="anthropic" class="${pickedFmt === 'anthropic' ? 'on' : ''}">Anthropic</button></div></div>
      <div class="field"><label>Endpoint</label><input class="input" id="aEp" value="${esc(src.endpoint || '')}" placeholder="https://api.example.com/v1" autocapitalize="off" autocorrect="off"></div>
      <div class="field"><label>API Key</label><input class="input" id="aKey" type="password" value="${esc(secDec(src.apiKey || ''))}" placeholder="sk-..." autocapitalize="off" autocorrect="off"></div>
      <div class="field"><label>模型</label>
        <div class="model-row">
          <input class="input" id="aModel" value="${esc(src.model || '')}" placeholder="gpt-4o-mini" autocapitalize="off" autocorrect="off">
          <button class="mini-btn" id="aFetch">获取</button>
        </div>
        <div class="hint" id="aModelHint" style="margin:7px 0 0"></div>
        <input class="input model-filter" id="aModelFilter" placeholder="筛选模型…" autocapitalize="off" autocorrect="off" style="display:none;margin-top:9px">
        <div class="model-list" id="aModelList"></div>
      </div>
      <div class="field"><label>温度 <span id="aTv">${src.temperature == null ? 0.85 : src.temperature}</span></label><input class="input" id="aTemp" type="range" min="0" max="1.5" step="0.05" value="${src.temperature == null ? 0.85 : src.temperature}"></div>
      <div class="field"><label>最大输出 tokens</label><input class="input" id="aMax" type="number" min="100" max="8000" value="${src.maxTokens || 1400}"></div>
      <button class="pbtn ghost" id="aTest">测试连接</button>
      <button class="pbtn ghost" id="aToggle">${enabled ? '停用这个接口' : '启用这个接口'}</button>
      ${isNew ? '' : '<button class="pbtn ghost" id="aDel" style="color:#e06a5c;border-color:rgba(224,106,92,.35)">删除接口</button>'}
      `,
    onAction: () => {
      const f = readForm(page);
      if (!f.endpoint || !f.model) { toast('请填写 Endpoint 与模型', false); return; }
      let target;
      if (isNew) { target = blankApi(); target.id = uid('api'); llmApis().push(target); }
      else target = findApi(id);
      if (!target) { toast('接口不存在', false); return; }
      Object.assign(target, f, { enabled, apiKey: secEnc(f.apiKey) });
      saveDB(); refreshAPIPage(); close(); renderAll(); toast('接口已保存');
    }
  });
  page.addEventListener('click', e => {
    const f = e.target.closest('#aFmt button');
    if (f) {
      pickedFmt = f.dataset.v === 'anthropic' ? 'anthropic' : 'openai';
      $$('#aFmt button', page).forEach(x => x.classList.toggle('on', x === f));
    }
  });
  $('#aTemp', page).oninput = e => { $('#aTv', page).textContent = e.target.value; };
  const modelBox = $('#aModelList', page);
  const modelFilter = $('#aModelFilter', page);
  const modelHint = $('#aModelHint', page);
  let modelIds = [];
  const paintModels = () => {
    if (!modelBox) return;
    const q = (modelFilter.value || '').trim().toLowerCase();
    const shown = q ? modelIds.filter(id => id.toLowerCase().includes(q)) : modelIds;
    const cur = $('#aModel', page).value.trim();
    modelBox.innerHTML = shown.slice(0, 300).map(id =>
      `<button class="model-chip${id === cur ? ' on' : ''}" data-model="${esc(id)}">${esc(id)}</button>`).join('');
    if (!shown.length) modelBox.innerHTML = '<div class="model-empty">没有匹配的模型</div>';
  };
  const fetchModels = async () => {
    const f = readForm(page);
    if (!f.endpoint) { toast('请先填写 Endpoint', false); return; }
    if (!f.apiKey) { toast('请先填写 API Key', false); return; }
    const btn = $('#aFetch', page);
    btn.disabled = true; btn.textContent = '获取中…';
    if (modelHint) modelHint.textContent = '正在向 ' + modelsUrl(f.endpoint) + ' 请求模型列表…';
    try {
      modelIds = await listModels(f);
      if (modelHint) modelHint.textContent = `获取到 ${modelIds.length} 个模型，点选即可填入。`;
      if (modelFilter) {
        modelFilter.style.display = modelIds.length > 12 ? '' : 'none';
        modelFilter.value = '';
      }
      paintModels();
      if (modelIds.length === 1) {
        $('#aModel', page).value = modelIds[0];
        paintModels();
      }
      toast('已获取 ' + modelIds.length + ' 个模型');
    } catch (e) {
      modelIds = [];
      if (modelBox) modelBox.innerHTML = '';
      if (modelFilter) modelFilter.style.display = 'none';
      if (modelHint) modelHint.textContent = '获取失败：' + e.message;
      toast('获取模型列表失败', false);
    } finally {
      btn.disabled = false; btn.textContent = '获取';
    }
  };
  $('#aFetch', page).onclick = fetchModels;
  if (modelFilter) modelFilter.oninput = paintModels;
  if (modelBox) modelBox.onclick = e => {
    const b = e.target.closest('.model-chip');
    if (!b) return;
    $('#aModel', page).value = b.dataset.model || '';
    $$('.model-chip', modelBox).forEach(x => x.classList.toggle('on', x === b));
  };
  $('#aToggle', page).onclick = () => {
    enabled = !enabled;
    $('#aToggle', page).textContent = enabled ? '停用这个接口' : '启用这个接口';
  };
  $('#aTest', page).onclick = async () => {
    const f = readForm(page);
    if (!f.endpoint || !f.model || !f.apiKey) { toast('请先填写 Endpoint、Key 与模型', false); return; }
    toast('正在测试连接…');
    try {
      const res = await llmChat([{ role: 'user', content: '回复“ok”两个字母。' }], { kind: 'tiandao', config: f, maxTokens: 20, temperature: 0, stream: false });
      toast('连接成功：' + clampText(String(res.text || '').trim(), 20));
    } catch (e) { toast('连接失败：' + e.message, false); }
  };
  const del = $('#aDel', page);
  if (del) del.onclick = () => openDialog({
    title: '删除这个接口？<br><span style="font-size:12px;color:#bdbdbd">引用它的世界和聚合组会变为未配置。</span>',
    ok: '删除', okClass: 'danger',
    onOk: () => {
      DB.config.llmApis = llmApis().filter(a => a.id !== id);
      llmPools().forEach(p => { p.members = p.members.filter(m => m !== id); });
      const as = DB.config.llmAssign || {};
      for (const k of ['tiandao', 'character', 'memory']) if (as[k] === 'api:' + id) as[k] = k === 'tiandao' ? '' : 'tiandao';
      DB.stories.forEach(s => { if (s.llm) for (const k of ['tiandao', 'character', 'memory']) if (s.llm[k] === 'api:' + id) delete s.llm[k]; });
      saveDB(); refreshAPIPage(); close(); renderAll(); toast('接口已删除');
    }
  });
  return { page, close };
}

function pagePoolEdit(id) {
  const isNew = !id;
  const src = (id && findPool(id)) || blankPool();
  let members = (src.members || []).slice();
  const { page, close } = pushPage({
    title: isNew ? '新建聚合' : '编辑聚合', action: '保存', actionClass: 'grad',
    body: `
      <div class="field"><label>聚合名称</label><input class="input" id="pName" value="${esc(src.name || '')}" placeholder="如 主线路聚合"></div>
      <div class="group">成员接口（可多选）</div>
      ${llmApis().length ? llmApis().map(a => `<label class="pick-card ${members.includes(a.id) ? 'on' : ''}">
        <input type="checkbox" class="pCheck" value="${a.id}" ${members.includes(a.id) ? 'checked' : ''}>
        <span class="pk-main"><b>${esc(a.name || a.model || '未命名接口')}</b><em>${esc((a.format === 'anthropic' ? 'Anthropic' : 'OpenAI') + ' · ' + (a.model || '未填模型') + (a.enabled === false ? ' · 已停用' : ''))}</em></span>
      </label>`).join('') : '<div class="empty-mini" style="padding:18px 16px"><p>还没有接口，先去「API 接口」添加。</p></div>'}
      ${isNew ? '' : '<button class="pbtn ghost" id="pDel" style="color:#e06a5c;border-color:rgba(224,106,92,.35)">删除聚合</button>'}
      `,
    onAction: () => {
      const name = $('#pName', page).value.trim();
      if (!name) { toast('请填写聚合名称', false); return; }
      members = $$('.pCheck', page).filter(x => x.checked).map(x => x.value);
      if (!members.length) { toast('请至少选择一个接口', false); return; }
      let target;
      if (isNew) { target = blankPool(); target.id = uid('pool'); llmPools().push(target); }
      else target = findPool(id);
      if (!target) { toast('聚合不存在', false); return; }
      Object.assign(target, { name, members, enabled: true, strategy: 'smart' });
      saveDB(); refreshAPIPage(); close(); renderAll(); toast('聚合已保存');
    }
  });
  page.addEventListener('click', e => {
    const box = e.target.closest('.pick-card');
    if (box) {
      const cb = $('.pCheck', box);
      if (cb && e.target !== cb) { cb.checked = !cb.checked; }
      if (cb) box.classList.toggle('on', cb.checked);
    }
  });
  const del = $('#pDel', page);
  if (del) del.onclick = () => openDialog({
    title: '删除这个聚合？<br><span style="font-size:12px;color:#bdbdbd">选择它的世界会变为未配置；接口本身不受影响。</span>',
    ok: '删除', okClass: 'danger',
    onOk: () => {
      DB.config.llmPools = llmPools().filter(p => p.id !== id);
      const as = DB.config.llmAssign || {};
      for (const k of ['tiandao', 'character', 'memory']) if (as[k] === 'pool:' + id) as[k] = k === 'tiandao' ? '' : 'tiandao';
      DB.stories.forEach(s => { if (s.llm) for (const k of ['tiandao', 'character', 'memory']) if (s.llm[k] === 'pool:' + id) delete s.llm[k]; });
      saveDB(); refreshAPIPage(); close(); renderAll(); toast('聚合已删除');
    }
  });
  return { page, close };
}

function llmPickRows(kind, scoped, curRef) {
  const rows = [];
  if (kind !== 'tiandao') rows.push({ ref: 'tiandao', label: '跟随天道', desc: llmRefLabel(llmRefOf('tiandao', scoped)) });
  if (scoped) rows.push({ ref: '', label: '使用全局默认', desc: llmRefLabel((DB.config.llmAssign || {})[kind]) });
  else rows.push({ ref: '', label: '不指定（未配置）', desc: '未选择接口时对应 Agent 不会运行' });
  llmApis().forEach(a => rows.push({
    ref: 'api:' + a.id,
    label: a.name || a.model || '未命名接口',
    desc: (a.format === 'anthropic' ? 'Anthropic' : 'OpenAI') + ' · ' + (a.model || '未填模型') + (a.enabled === false ? ' · 已停用' : '') + (a.enabled !== false && !apiReady(a) ? ' · 待补全 Key' : '')
  }));
  llmPools().forEach(p => rows.push({
    ref: 'pool:' + p.id,
    label: p.name || '聚合',
    desc: poolMembers(p).length + ' 个接口 · 智能轮询' + (p.enabled === false ? ' · 已停用' : '')
  }));
  return rows.map(r => `<button class="pick-card ${String(curRef || '') === r.ref ? 'on' : ''}" data-ref="${esc(r.ref)}">
    <span class="pk-main"><b>${esc(r.label)}</b><em>${esc(r.desc)}</em></span><span class="pk-dot"></span>
  </button>`).join('');
}
function pageLLM(kind, global) {
  const scoped = global ? null : activeStory();
  const gRef = (DB.config.llmAssign || {})[kind] || (kind === 'tiandao' ? '' : 'tiandao');
  const curRef = global ? gRef : (scoped && scoped.llm && scoped.llm[kind] != null ? scoped.llm[kind] : '');
  let picked = curRef;
  const { page, close } = pushPage({
    title: '模型 · ' + (LLM_LABEL[kind] || ''),
    action: '保存', actionClass: 'grad', body: '',
    onAction: () => {
      if (global) DB.config.llmAssign[kind] = picked;
      else if (scoped) {
        scoped.llm = scoped.llm || {};
        if (picked) scoped.llm[kind] = picked; else delete scoped.llm[kind];
        if (!Object.keys(scoped.llm).length) scoped.llm = null;
      }
      saveDB(); renderRight(); close(); toast('模型选择已保存');
    }
  });
  const root = $('.pbody', page);
  const draw = () => {
    root.innerHTML = `
      
      <div class="group">使用哪个接口</div>
      ${llmPickRows(kind, scoped, picked)}
      <button class="pbtn ghost" id="manageAPIs">管理模型与 API</button>
      ${scoped ? '<button class="pbtn ghost" id="resetLLM">清除本世界设置</button>' : ''}
      `;
    const manage = $('#manageAPIs', page);
    if (manage) manage.onclick = () => {
      pageAPIs();
      const top = overlayStack[overlayStack.length - 1];
      if (!top) return;
      const oc = top.close;
      top.close = () => {
        oc();
        setTimeout(() => { if (document.body.contains(page)) draw(); }, 90);
      };
    };
    const resetBtn = $('#resetLLM', page);
    if (resetBtn) resetBtn.onclick = () => {
      if (scoped && scoped.llm) delete scoped.llm[kind];
      if (scoped && scoped.llm && !Object.keys(scoped.llm).length) scoped.llm = null;
      saveDB(); renderRight(); close(); toast('已清除本世界设置');
    };
  };
  draw();
  page.addEventListener('click', e => {
    const row = e.target.closest('.pick-card');
    if (row) {
      picked = row.dataset.ref;
      $$('.pick-card', page).forEach(x => x.classList.toggle('on', x === row));
    }
  });
  return { page, close };
}
/* ---------------- 记忆 / 书签 / 事件编辑 ---------------- */
function pageMemoryEdit(s, id) {
  const m = (s.memories || []).find(x => x.id === id);
  if (!m) return;
  const { page, close } = pushPage({
    title: '修正记忆', action: '保存', actionClass: 'grad',
    body: `<div class="field"><label>记忆内容</label><textarea class="input" id="mEv" rows="5">${esc(m.event)}</textarea></div>
      <div class="field"><label>重要度（1–10）</label><input class="input" id="mImp" type="number" min="1" max="10" value="${m.importance}"></div>
      <div class="field"><label>世界时间</label><input class="input" id="mTime" value="${esc(m.time)}"></div>
      <div class="field"><label>地点</label><input class="input" id="mLoc" value="${esc(m.location || '')}"></div>
      <div class="field"><label>相关人物（用顿号或逗号分隔）</label><input class="input" id="mPeople" value="${esc((m.people || []).join('、'))}"></div>
      <button class="pbtn ghost" id="mDel" style="color:#e06a5c;border-color:rgba(224,106,92,.35)">删除这条记忆</button>
      `,
    onAction: () => {
      const ev = $('#mEv', page).value.trim();
      if (!ev) { toast('记忆内容不能为空', false); return; }
      m.event = ev;
      m.importance = Math.max(1, Math.min(10, parseInt($('#mImp', page).value, 10) || 5));
      m.time = $('#mTime', page).value.trim();
      m.location = $('#mLoc', page).value.trim();
      m.people = $('#mPeople', page).value.split(/[、,，\s]+/).map(x => x.trim()).filter(Boolean);
      saveDB(); close(); renderRight(); toast('记忆已修正');
    }
  });
  $('#mDel', page).onclick = () => {
    openDialog({
      title: '删除这条记忆？<br><span style="font-size:12px;color:#bdbdbd">删除后无法恢复，但不会影响已写出的正文。</span>',
      ok: '删除', okClass: 'danger',
      onOk: () => {
        s.memories = s.memories.filter(x => x.id !== id);
        saveDB(); close(); renderRight(); toast('记忆已删除');
      }
    });
  };
}
function pageBookmarkEdit(s, id) {
  const b = (s.bookmarks || []).find(x => x.id === id);
  if (!b) return;
  const { page, close } = pushPage({
    title: '修正书签', action: '保存', actionClass: 'grad',
    body: `<div class="field"><label>问题 / 主题</label><input class="input" id="bQ" value="${esc(b.question)}"></div>
      <div class="field"><label>稳定结论</label><textarea class="input" id="bA" rows="5">${esc(b.answer)}</textarea></div>
      <div class="field"><label>类型</label>
        <select class="input" id="bType">
          <option value="concept"${b.type === 'concept' ? ' selected' : ''}>概念</option>
          <option value="state"${b.type === 'state' ? ' selected' : ''}>状态</option>
          <option value="behavioral"${b.type === 'behavioral' ? ' selected' : ''}>行为</option>
        </select></div>
      <button class="pbtn ghost" id="bDel" style="color:#e06a5c;border-color:rgba(224,106,92,.35)">删除这条书签</button>
      `,
    onAction: () => {
      const q = $('#bQ', page).value.trim(), a = $('#bA', page).value.trim();
      if (!q || !a) { toast('问题和结论都不能为空', false); return; }
      b.question = q; b.answer = a; b.type = $('#bType', page).value;
      saveDB(); close(); renderRight(); toast('书签已修正');
    }
  });
  $('#bDel', page).onclick = () => {
    openDialog({
      title: '删除这条书签？', ok: '删除', okClass: 'danger',
      onOk: () => {
        s.bookmarks = s.bookmarks.filter(x => x.id !== id);
        saveDB(); close(); renderRight(); toast('书签已删除');
      }
    });
  };
}
function pageEventEdit(s, id) {
  const e0 = (s.events || []).find(x => x.id === id);
  if (!e0) return;
  const cats = ['地理', '文化', '法则', '格局'];
  const { page, close } = pushPage({
    title: '修正世界事件', action: '保存', actionClass: 'grad',
    body: `<div class="field"><label>标题</label><input class="input" id="eVTitle" value="${esc(e0.title)}"></div>
      <div class="field"><label>描述</label><textarea class="input" id="eVDesc" rows="4">${esc(e0.desc)}</textarea></div>
      <div class="field"><label>分类</label><select class="input" id="eVCat">${cats.map(c => `<option value="${c}"${e0.category === c ? ' selected' : ''}>${c}</option>`).join('')}</select></div>
      <div class="field"><label>重要度（1–10）</label><input class="input" id="eVImp" type="number" min="1" max="10" value="${e0.importance}"></div>
      <div class="field"><label>地点</label><input class="input" id="eVLoc" value="${esc(e0.location || '')}"></div>
      <div class="field"><label>相关人物</label><input class="input" id="eVPeople" value="${esc((e0.people || []).join('、'))}"></div>
      <div class="field"><label>世界状态备注</label><textarea class="input" id="eVState" rows="3">${esc(e0.state || '')}</textarea></div>
      <button class="pbtn ghost" id="eVDel" style="color:#e06a5c;border-color:rgba(224,106,92,.35)">删除这条事件</button>`,
    onAction: () => {
      const title = $('#eVTitle', page).value.trim();
      if (!title) { toast('事件标题不能为空', false); return; }
      e0.title = title;
      e0.desc = $('#eVDesc', page).value.trim();
      e0.category = $('#eVCat', page).value;
      e0.importance = Math.max(1, Math.min(10, parseInt($('#eVImp', page).value, 10) || 5));
      e0.location = $('#eVLoc', page).value.trim();
      e0.people = $('#eVPeople', page).value.split(/[、,，\s]+/).map(x => x.trim()).filter(Boolean);
      e0.state = $('#eVState', page).value.trim();
      saveDB(); close(); renderRight(); toast('事件已修正');
    }
  });
  $('#eVDel', page).onclick = () => {
    openDialog({
      title: '删除这条世界事件？', ok: '删除', okClass: 'danger',
      onOk: () => {
        s.events = s.events.filter(x => x.id !== id);
        saveDB(); close(); renderRight(); toast('事件已删除');
      }
    });
  };
}

function pageAbout() {
  const last = DB.config.lastBackupAt;
  const lastText = last ? fmtTs(last) : '从未导出';
  const dbgOn = typeof dbgEnabled === 'function' && dbgEnabled();
  const dbgCount = (typeof dbg === 'function' && dbg().entries.length) || 0;
  pushPage({
    title: '关于', action: '', body: `
      <div class="about">
        <img class="brand-logo" src="logo.png" alt=""><div class="empty-mark">启源</div>
        <div class="about-slogan">沉浸式虚拟世界体验</div>
        <div class="about-ver">v${APP_VERSION}</div>
        <p class="about-lead">在启源里，你不是在读一个故事，而是在经营一个会自己运转的世界。</p>
        <div class="about-feats">
          <div class="feat"><b>世界由你定义</b><span>从九州的虚无海到你亲手写下的城邦，世界观、地理、势力与法则分层结构化，也可以继续添加自己的条目。</span></div>
          <div class="feat"><b>角色会自己生活</b><span>每位 NPC 都有完整档案、独立记忆与当前目标，按世界时间自主行动、彼此影响，并在经历中缓慢演化。</span></div>
          <div class="feat"><b>记忆不会被遗忘</b><span>四层记忆配合时间衰减检索，很久以前的一句话仍可能在恰当的时刻被想起；世界事件簿记录真正改变格局的大事。</span></div>
          <div class="feat"><b>时间由你掌控</b><span>开始、暂停或跳转时间线；离开应用后世界仍在继续，回来时补上错过的片段。</span></div>
          <div class="feat"><b>三套模型各司其职</b><span>天道负责叙事与裁决，角色负责 NPC 的反应，记忆负责提炼与巩固。可以分开配置，也可以让后两者跟随天道。</span></div>
          <div class="feat"><b>可选的剧情模式</b><span>开启后先把世界真相与常识分层，再生成 3–6 个阶段；运行时只注入当前阶段与已经揭示的事实，未来阶段不会进入提示词。</span></div>
          <div class="feat"><b>完全属于你</b><span>没有账号、没有服务器、没有世界市场。设定、对话、记忆与时间线只保存在这台设备上。</span></div>
        </div>
        <div class="group">本机数据</div>
        <div class="rowcard">
          <div class="rrow"><span class="rt">存档占用</span><span class="rv" id="aboutUsage">计算中…</span></div>
          <div class="rrow"><span class="rt">上次导出备份</span><span class="rv" id="aboutBackup">${esc(lastText)}</span></div>
        </div>
        <div class="group">合规与说明</div>
        <div class="rowcard">
          <button class="rrow" id="aboutPrivacy"><span class="rt">隐私政策</span><span class="rv">数据与第三方接口</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
          <div class="rrow"><span class="rt">AI 生成内容</span><span class="rv">虚构 · 仅供娱乐</span></div>
        </div>
        <div class="group">调试</div>
        <div class="rowcard">
          <div class="rrow" id="dbgToggleRow"><span class="rt">记录系统运转日志${dbgOn ? '（开）' : '（关）'}</span><span class="rv" id="dbgCount">${dbgCount} 条</span></div>
          <button class="pbtn ghost" id="dbgExport">导出调试日志</button>
          <button class="pbtn ghost" id="dbgClear">清空日志</button>
          
        </div>
      </div>`
  });
  if (navigator.storage && navigator.storage.estimate) {
    navigator.storage.estimate().then(est => {
      const el = $('#aboutUsage'); if (!el) return;
      const used = est.usage || 0, quota = est.quota || 0;
      const mb = n => (n / 1048576).toFixed(n < 10485760 ? 1 : 0) + ' MB';
      el.textContent = quota ? `${mb(used)} / ${mb(quota)}` : mb(used);
      if (quota && used / quota > 0.8) el.classList.add('warn-text');
    }).catch(() => { const el = $('#aboutUsage'); if (el) el.textContent = '未知'; });
  } else {
    const el = $('#aboutUsage'); if (el) el.textContent = '未知';
  }
  const privacyRow = $('#aboutPrivacy');
  if (privacyRow) privacyRow.onclick = () => { location.href = 'privacy.html'; };
  const toggle = $('#dbgToggleRow');
  if (toggle) toggle.onclick = () => {
    const next = !dbgEnabled();
    dbgSetEnabled(next);
    const rt = $('.rt', toggle); if (rt) rt.textContent = '记录系统运转日志' + (next ? '（开）' : '（关）');
    toast('调试日志已' + (next ? '开启' : '关闭'));
  };
  const exp = $('#dbgExport');
  if (exp) exp.onclick = () => {
    const d = dbg();
    if (!d.entries.length) { toast('日志还是空的', false); return; }
    const data = JSON.stringify({
      app: '启源', version: APP_VERSION, enabled: d.enabled, count: d.entries.length,
      exported_at: new Date().toISOString(), entries: d.entries
    }, null, 2);
    const name = '启源调试日志.json';
    const r = downloadText(name, data);
    if (r) toast(r === 'saved' ? '已保存到「下载/启源」' : '已请求下载');
    else copyText(data, '日志已复制到剪贴板');
  };
  const clr = $('#dbgClear');
  if (clr) clr.onclick = () => {
    openDialog({
      title: '清空调试日志？', ok: '清空', okClass: 'danger',
      onOk: () => { dbgClear(); const c = $('#dbgCount'); if (c) c.textContent = '0 条'; toast('日志已清空'); }
    });
  };
}

/* ---------------- 世界卡与存档：导入导出 ---------------- */
const CARD_SPEC = 'qiyuan_world_card';
const SAVE_SPEC = 'qiyuan_save';
const CARD_SPEC_VERSION = '1.0.0';
const CARD_STATE_SKIP = ['id', 'avatar', 'name'];

function cardHash(str) {
  let h = 2166136261;
  const t = String(str || '');
  for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); }
  return ('0000000' + (h >>> 0).toString(16)).slice(-8);
}

/* ---------------- 世界卡库：卡是模板，实例是一局进度 ---------------- */
function cardContentId(card) {
  if (!card) return '';
  if (card.card_id) return String(card.card_id);
  const w = card.world || {};
  const raw = [card.name, w.name, w.tag, w.category,
    (w.calendar && w.calendar.start_time) || '',
    (w.lore || []).map(e => (e.path || '') + '=' + (e.content || '')).join('|'),
    (card.protagonist && card.protagonist.name) || '',
    (card.characters || []).map(c => (c && c.name) || '').join(','),
    JSON.stringify(((card.extensions && card.extensions.qiyuan) || {}).preset_id || ''),
    JSON.stringify(((card.extensions && card.extensions.qiyuan) || {}).raw_markdown || '')].join('\u0001');
  return 'qy_' + cardHash(raw);
}
function cardRecordById(id) { return (DB.cards || []).find(c => c.id === id) || null; }
function cardRecordByContent(cid) { return cid ? ((DB.cards || []).find(c => c.cardId === cid) || null) : null; }
function storiesForCard(id) { return id ? DB.stories.filter(s => s.cardId === id) : []; }
function addCardRecord(card, source, opts) {
  if (!card || typeof card !== 'object') return null;
  const o = opts || {};
  // 卡是模板：入库前深拷贝，并且永远不携带剧情阶段（阶段只属于实例）。
  const clean = JSON.parse(JSON.stringify(card));
  stripCardStoryArc(clean);
  const cid = cardContentId(clean);
  let rec = cardRecordByContent(cid);
  if (rec) {
    if (o.overwrite === false) {
      if (source && !rec.source) rec.source = source;
      return rec;
    }
    rec.card = clean; rec.cardId = cid; rec.updatedAt = nowTs();
    if (source) rec.source = source;
  } else {
    rec = { id: uid('card'), cardId: cid, card: clean, source: source || 'import', addedAt: nowTs(), updatedAt: nowTs() };
    (DB.cards || (DB.cards = [])).unshift(rec);
  }
  DB.cardsReady = true;
  saveDB();
  return rec;
}
function cardForExport(card) {
  const out = JSON.parse(JSON.stringify(card || {}));
  stripCardStoryArc(out);
  if (out.world && out.world.cover && out.world.cover.image) out.world.cover.image = imgRef(out.world.cover.image) || '';
  return out;
}
function cardCoverStyle(card) {
  const w = (card && card.world) || {};
  const cover = (w.cover && w.cover.image) || '';
  return coverStyle({ cover, coverId: (w.cover && w.cover.preset) || '', name: (card && card.name) || '' });
}
function cardRecordFromStory(s) {
  const card = worldCardForExport(s);
  return {
    id: uid('card'), cardId: card.card_id || cardContentId(card), card,
    source: 'migrated', addedAt: nowTs(), updatedAt: nowTs()
  };
}
function worldOnlyFingerprint(card) {
  const c = card || {};
  const w = c.world || {};
  const raw = [c.name, w.name, w.tag, w.category,
    (w.calendar && w.calendar.start_time) || '',
    (w.lore || []).map(e => (e.path || '') + '=' + (e.content || '')).join('|'),
    (c.protagonist && c.protagonist.name) || '',
    (c.characters || []).map(x => (x && x.name) || '').join(',')].join('\u0001');
  return 'qyw_' + cardHash(raw);
}
function ensureCardForStory(s, source) {
  if (s.cardId) {
    const linked = cardRecordById(s.cardId);
    if (linked) return linked;
  }
  const card = worldCardForExport(s);
  const cid = cardContentId(card);
  let rec = cardRecordByContent(cid);
  if (!rec) {
    // 导入的卡与实例导出的结构可能不同（lore/规划被规范化），按世界本体再匹配一次；
    // 匹配到只关联，不回写，避免实例中的演化覆盖模板角色。
    const wf = worldOnlyFingerprint(card);
    rec = (DB.cards || []).find(c => c.card && worldOnlyFingerprint(c.card) === wf) || null;
  }
  if (!rec) rec = addCardRecord(card, source || 'instance', { overwrite: false });
  if (rec) s.cardId = rec.id;
  return rec;
}
/** 旧数据升级：给已有的实例补一张世界卡，但不覆盖用户已删除的卡。 */
function migrateCards() {
  let changed = false;
  // 旧版可能把剧情阶段写进了世界卡；载入后统一剥离，阶段只保留在各个实例里。
  (DB.cards || []).forEach(c => {
    if (c.stripped) { delete c.stripped; changed = true; }
    if (c.card && stripCardStoryArc(c.card)) changed = true;
  });
  if (DB.cardsReady) {
    if (changed) saveNow();
    return changed;
  }
  DB.stories.forEach(s => {
    if (s.cardId && cardRecordById(s.cardId)) return;
    const cid = cardContentId(worldCardForExport(s));
    let rec = cardRecordByContent(cid);
    if (!rec) { rec = cardRecordFromStory(s); (DB.cards || (DB.cards = [])).push(rec); changed = true; }
    s.cardId = rec.id; changed = true;
  });
  DB.cardsReady = true;
  saveNow();
  return changed;
}
function findCardRecord(ref) {
  const r = ref || {};
  if (r.record_id) { const byId = cardRecordById(r.record_id); if (byId) return byId; }
  if (r.card_id) { const byCid = cardRecordByContent(r.card_id); if (byCid) return byCid; }
  const nm = String(r.name || '');
  return (DB.cards || []).find(c => (((c.card && c.card.name) || '') === nm)) || null;
}
function deleteStoryById(id) {
  DB.stories = DB.stories.filter(x => x.id !== id);
  if (DB.activeId === id) DB.activeId = DB.stories[0] ? DB.stories[0].id : null;
  saveDB();
}
function deleteCardRecord(id) {
  DB.cards = (DB.cards || []).filter(c => c.id !== id);
  DB.stories.forEach(s => { if (s.cardId === id) s.cardId = ''; });
  saveDB();
}
function worldCardId(w) {
  return 'qy_' + cardHash([w.name, w.tag, w.calendarName, w.startTime,
    (w.fields || []).map(f => f.path + '=' + f.value).join('|')].join('\u0001'));
}
function isoOf(ts) {
  const n = Number(ts);
  try { return new Date(isFinite(n) && n > 0 ? n : Date.now()).toISOString(); } catch (e) { return new Date().toISOString(); }
}

/* 角色 → 世界卡角色结构（对齐 chara_card_v2，启源字段放在 extensions.qiyuan） */
function characterToCard(c, role) {
  return {
    name: c.name || '',
    description: c.profileMd || [c.appearance, c.occupation, c.faction].filter(Boolean).join('；'),
    personality: c.personality || '',
    scenario: c.currentLocation || '',
    mes_example: c.speechStyle || '',
    creator_notes: '',
    system_prompt: '',
    post_history_instructions: '',
    tags: [role === 'player' ? '主角' : 'NPC'],
    extensions: {
      qiyuan: {
        gender: c.gender || '', age: c.age || '', race: c.race || '',
        appearance: c.appearance || '', occupation: c.occupation || '', faction: c.faction || '',
        current_location: c.currentLocation || '', personality: c.personality || '',
        speech_style: c.speechStyle || '', habits: c.habits || '', likes_dislikes: c.likesDislikes || '',
        beliefs: c.beliefs || '', abilities: c.abilities || '', weaknesses: c.weaknesses || '',
        inventory: c.inventory || '', current_goal: c.currentGoal || '', relationships: c.relationships || '',
        profile_md: c.profileMd || ''
      }
    }
  };
}
function characterFromCard(cd, opts) {
  const o = opts || {};
  const q = (cd && cd.extensions && cd.extensions.qiyuan) || {};
  const c = Object.assign(blankCharacter((cd && cd.name) || o.name || ''), {
    gender: q.gender || '', age: q.age || '', race: q.race || '',
    appearance: q.appearance || (cd && cd.description) || '', occupation: q.occupation || '',
    faction: q.faction || '', currentLocation: q.current_location || (cd && cd.scenario) || '',
    personality: (cd && cd.personality) || q.personality || '',
    speechStyle: q.speech_style || (cd && cd.mes_example) || '',
    habits: q.habits || '', likesDislikes: q.likes_dislikes || '', beliefs: q.beliefs || '',
    abilities: q.abilities || '', weaknesses: q.weaknesses || '', inventory: q.inventory || '',
    currentGoal: q.current_goal || '', relationships: q.relationships || '',
    profileMd: q.profile_md || (cd && cd.description) || ''
  });
  if (o.npc) { c.id = uid('npc'); c.evolutionVersion = 1; c.lastEvolutionAt = ''; }
  return c;
}

/* 实例 → 世界卡（世界设定 + 主角 + NPC） */
function worldCardForExport(s) {
  const w = s.world || {};
  const lore = (w.fields || []).map((f, i) => {
    const segs = String(f.path || '').split('/').map(x => x.trim()).filter(Boolean);
    return {
      id: 'lore_' + (i + 1),
      title: segs[segs.length - 1] || ('条目 ' + (i + 1)),
      path: String(f.path || ''),
      content: String(f.value || ''),
      keys: [],
      enabled: true,
      insertion_order: i + 1
    };
  });
  return {
    spec: CARD_SPEC,
    spec_version: CARD_SPEC_VERSION,
    kind: 'world_card',
    card_id: worldCardId(w),
    name: w.name || '未命名世界',
    description: w.desc || '',
    creator: '',
    character_version: '1.0',
    tags: [w.tag, w.category].filter(Boolean),
    created_at: isoOf(s.createdAt),
    exported_at: new Date().toISOString(),
    generator: { app: '启源', version: APP_VERSION },
    world: {
      name: w.name || '',
      tag: w.tag || '',
      category: w.category || '',
      description: w.desc || '',
      calendar: {
        name: w.calendarName || '',
        start_time: w.startTime || '',
        location_schema: w.locationSchema || ''
      },
      opening: w.opening || '',
      director_prompt: w.tiandaoPrompt || '',
      cover: { preset: w.coverId || '', image: w.cover ? imgRef(w.cover) : '' },
      lore
    },
    protagonist: characterToCard(s.player || {}, 'player'),
    characters: (s.npcs || []).map(n => characterToCard(n, 'npc')),
    extensions: { qiyuan: { preset_id: w.presetId || '', raw_markdown: w.rawMarkdown || '', story_arc: null } }
  };
}

/* 世界卡 → 新实例（只有设定，没有剧情数据） */
function storyFromCard(card) {
  const ext = (card.extensions && card.extensions.qiyuan) || {};
  const cw = card.world || {};
  const cal = cw.calendar || {};
  const lore = Array.isArray(cw.lore) ? cw.lore.slice().sort((a, b) => (a.insertion_order || 0) - (b.insertion_order || 0)) : [];
  const world = normalizeWorld({
    presetId: ext.preset_id || '',
    name: card.name || cw.name || '',
    tag: cw.tag || '',
    category: cw.category || '',
    desc: cw.description || card.description || '',
    calendarName: cal.name || '',
    startTime: cal.start_time || '',
    locationSchema: cal.location_schema || '',
    opening: cw.opening || '',
    tiandaoPrompt: cw.director_prompt || '',
    rawMarkdown: ext.raw_markdown || '',
    cover: (cw.cover && cw.cover.image) || '',
    coverId: (cw.cover && cw.cover.preset) || '',
    storyArc: null,
    fields: lore.map(e => ({ path: e.path || e.title || '世界观', value: e.content || '' }))
  });
  const player = characterFromCard(card.protagonist || {}, {});
  player.emotion = '平静'; player.health = '良好';
  const npcs = (Array.isArray(card.characters) ? card.characters : []).map(cd => characterFromCard(cd, { npc: true }));
  const startTime = world.startTime || '第一日 清晨';
  const story = normalizeStory({
    instanceName: world.name,
    world, player, npcs,
    messages: [], memories: [], bookmarks: [], events: [], evolutions: [],
    instance: { timeStatus: 'stopped', timeSpeed: 1, startTime, currentTime: startTime, lastActiveTime: startTime }
  });
  story.id = uid('story');
  story.instance.timeStatus = 'stopped';
  return story;
}

/* 实例 → 体验存档（时间线、消息、记忆、事件簿、角色状态快照） */
function saveForExport(s) {
  const d = JSON.parse(JSON.stringify({
    instance: s.instance,
    messages: s.messages,
    memories: s.memories,
    bookmarks: s.bookmarks,
    events: s.events,
    evolutions: s.evolutions,
    working: s.working,
    bg: s.bg,
    story: s.story,
    storyArc: s.world && s.world.storyArc ? s.world.storyArc : null,
    states: { player: s.player, npcs: s.npcs }
  }));
  if (d.bg && d.bg.src) d.bg.src = imgRef(d.bg.src);
  const strip = c => {
    if (!c) return c;
    delete c.avatar;
    delete c.relationships_snapshot;
    return c;
  };
  strip(d.states.player);
  (d.states.npcs || []).forEach(strip);
  return {
    spec: SAVE_SPEC,
    spec_version: CARD_SPEC_VERSION,
    kind: 'save',
    exported_at: new Date().toISOString(),
    generator: { app: '启源', version: APP_VERSION },
    card_ref: { record_id: s.cardId || '', card_id: worldCardId(s.world || {}), name: (s.world || {}).name || '' },
    instance_name: s.instanceName || (s.world || {}).name || '启源存档',
    data: d
  };
}

function findCardStory(ref) {
  const rec = findCardRecord(ref);
  return rec ? rec.card : null;
}

/* 存档数据 → 实例（设定取自世界卡，体验数据覆盖） */
function applySaveToStory(target, save) {
  const d = (save && save.data) || {};
  const tmp = normalizeStory({
    world: target.world, player: target.player, npcs: target.npcs,
    instance: d.instance, messages: d.messages, memories: d.memories,
    bookmarks: d.bookmarks, events: d.events, evolutions: d.evolutions,
    working: d.working, bg: d.bg, instanceName: save.instance_name
  });
  target.instance = tmp.instance;
  target.messages = tmp.messages;
  target.memories = tmp.memories;
  target.bookmarks = tmp.bookmarks;
  target.events = tmp.events;
  target.evolutions = tmp.evolutions;
  target.working = tmp.working;
  target.bg = tmp.bg;
  // 剧情阶段属于实例：存档自带阶段定义，导入时恢复到实例，不依赖世界卡。
  if (d.storyArc && Array.isArray(d.storyArc.stages) && d.storyArc.stages.length) {
    target.world.storyArc = normalizeStoryArc(d.storyArc);
  }
  target.story = normalizeStoryState(d.story, target.world);
  target.instanceName = save.instance_name || target.instanceName;
  const st = d.states || {};
  const merge = (t, sv) => {
    if (!t || !sv) return;
    Object.keys(sv).forEach(k => { if (!CARD_STATE_SKIP.includes(k)) t[k] = sv[k]; });
  };
  merge(target.player, st.player);
  const saved = Array.isArray(st.npcs) ? st.npcs : [];
  (target.npcs || []).forEach(n => {
    const sv = saved.find(x => x && x.name === n.name);
    if (sv) merge(n, sv);
  });
  target.instance.lastTick = nowTs();
  target.instance.lastActiveTime = target.instance.currentTime;
  trimMessages(target);
  return target;
}

function downloadJSON(filename, data) {
  return downloadText(filename, data);
}
function downloadText(filename, data) {
  try {
    if (window.AndroidFile && typeof AndroidFile.saveText === 'function') {
      const r = String(AndroidFile.saveText(filename, data, 'application/json') || '');
      if (r === 'saved') return 'saved';
      if (r.indexOf('err:') === 0) return '';
    }
  } catch (e) { /* 落到浏览器下载 */ }
  try {
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    return 'blob';
  } catch (e) { return ''; }
}

/** 读取用户选中的 JSON 文件；失败时回传空文本。 */
function readJSONFile(file, cb) {
  const rd = new FileReader();
  rd.onload = () => cb(String(rd.result || ''), null);
  rd.onerror = () => cb('', rd.error || new Error('读取失败'));
  rd.readAsText(file);
}

/** 文件选择 → 立即导入。粘贴框只作为兜底，默认收起。 */
function mountJSONImport(page, onText) {
  const inp = $('.json-file', page);
  if (!inp) return;
  const pick = $('.pick-file', page) || $('#pickCardFile', page) || $('#pickSaveFile', page);
  const note = $('.file-note', page);
  const toggle = $('.paste-toggle', page);
  const box = $('.paste-box', page);
  if (pick) pick.onclick = () => inp.click();
  if (toggle && box) {
    toggle.onclick = () => {
      box.hidden = !box.hidden;
      toggle.textContent = box.hidden ? '或粘贴 JSON 文本' : '收起粘贴框';
      if (!box.hidden) { const t = $('textarea', box); if (t) try { t.focus(); } catch (e) {} }
    };
  }
  inp.onchange = () => {
    const f = inp.files && inp.files[0];
    if (!f) return;
    if (f.size > 32 * 1024 * 1024) { toast('文件过大（上限 32MB）', false); inp.value = ''; return; }
    const label = (note ? note.textContent : '');
    if (note) note.textContent = '正在读取 ' + f.name + ' …';
    readJSONFile(f, (text, err) => {
      inp.value = '';
      if (err || !text) {
        if (note) note.textContent = label || '读取失败';
        toast('文件读取失败', false);
        return;
      }
      if (note) note.textContent = '已选择 ' + f.name;
      onText(text, f.name);
    });
  };
}
function copyText(text, okMsg) {
  if (!navigator.clipboard) { toast('当前环境不支持剪贴板', false); return; }
  navigator.clipboard.writeText(text).then(() => toast(okMsg || '已复制')).catch(() => toast('复制失败', false));
}
/** 导入成功后收起创建世界向导，直接进入新实例。 */
function dismissWizard() {
  overlayStack = overlayStack.filter(o => {
    if (o.type === 'page' && o.page && o.page.dataset.wizard) { o.page.remove(); return false; }
    return true;
  });
}
/* 实例导出世界卡：有关联卡时导出模板原样，实例中的演化不会改写角色设定。 */
function storyExportCard(s) {
  const rec = s && s.cardId ? cardRecordById(s.cardId) : null;
  if (rec && rec.card) return { card: cardForExport(rec.card), linked: true };
  return { card: cardForExport(worldCardForExport(s)), linked: false };
}
function pageExportCard(s) {
  const picked = storyExportCard(s);
  const data = JSON.stringify(picked.card, null, 2);
  const name = '启源世界卡-' + ((s.world && s.world.name) || '未命名') + '.json';
  const { page } = pushPage({
    title: '导出世界卡', action: '', body: `
      
      <div class="field"><textarea class="input" id="expText" rows="16" readonly>${esc(data)}</textarea></div>
      <button class="pbtn" id="copyExp">复制到剪贴板</button>
      <button class="pbtn ghost" id="downloadExp">下载世界卡 JSON</button>`
  });
  $('#copyExp', page).onclick = () => copyText(data, '世界卡已复制');
  $('#downloadExp', page).onclick = () => {
    const r = downloadJSON(name, data);
    if (r) toast(r === 'saved' ? '已保存到「下载/启源」' : '已请求下载');
    else toast('保存失败', false);
  };
}

function exportCardRecord(rec) {
  if (!rec) return;
  const data = JSON.stringify(cardForExport(rec.card), null, 2);
  const name = '启源世界卡-' + ((rec.card && rec.card.name) || '未命名') + '.json';
  const { page } = pushPage({
    title: '导出世界卡', action: '', body: `
      <div class="field"><textarea class="input" id="expText" rows="16" readonly>${esc(data)}</textarea></div>
      <button class="pbtn" id="copyExp">复制到剪贴板</button>
      <button class="pbtn ghost" id="downloadExp">下载世界卡 JSON</button>`
  });
  $('#copyExp', page).onclick = () => copyText(data, '世界卡已复制');
  $('#downloadExp', page).onclick = () => {
    const r = downloadJSON(name, data);
    if (r) toast(r === 'saved' ? '已保存到「下载/启源」' : '已请求下载');
    else toast('保存失败', false);
  };
}
function closeCardsPages() {
  overlayStack.slice().forEach(o => {
    if (o.type === 'page' && o.page && o.page.dataset.cardsPage) o.close();
  });
}
function cardDisplayName(card) {
  return (card && (card.name || (card.world && card.world.name))) || '未命名世界';
}
function pageCards(openId) {
  const cards = DB.cards || [];
  const list = cards.length ? cards.map(rec => {
    const card = rec.card || {};
    const w = card.world || {};
    const inst = storiesForCard(rec.id).length;
    return `<button class="preset-card card-lib" data-card-rec="${rec.id}">
      <span class="p-cover" style="${cardCoverStyle(card)}"><i>${esc(w.tag || w.category || '世界卡')}</i><b>${esc(cardDisplayName(card))}</b></span>
      <span class="p-meta"><em>${esc(w.description || card.description || '')}</em><i>${inst} 个实例 · ${(w.lore || []).length} 条设定 · ${(card.characters || []).length} 位 NPC</i></span>
    </button>`;
  }).join('') : `<div class="card-empty"><p>世界卡库还是空的。</p></div>`;
  const { page, close } = pushPage({
    title: '世界卡库', action: '', body: `
      <button class="pbtn" id="libImport">导入世界卡</button>
      <div class="preset-list card-lib-list">${list}</div>`
  });
  page.dataset.cardsPage = '1';
  $('#libImport', page).onclick = () => pageImportCard();
  page.addEventListener('click', e => {
    const b = e.target.closest('[data-card-rec]');
    if (b) pageCardDetail(b.dataset.cardRec);
  });
  if (openId && cardRecordById(openId)) pageCardDetail(openId);
  return { page, close };
}
function pageCardDetail(id) {
  const rec = cardRecordById(id);
  if (!rec) { toast('世界卡不存在', false); return null; }
  const card = rec.card || {};
  const w = card.world || {};
  const instances = storiesForCard(rec.id);
  const name = cardDisplayName(card);
  const { page, close } = pushPage({
    title: '世界卡', body: `
      <div class="card-hero" style="${cardCoverStyle(card)}">
        <div><i>${esc(w.tag || w.category || '世界卡')}</i><b>${esc(name)}</b></div>
      </div>
      <div class="card-desc">${esc(w.description || card.description || '')}</div>
      <div class="card-stats">
        <span><b>${(w.lore || []).length}</b><em>设定</em></span>
        <span><b>${(card.characters || []).length}</b><em>NPC</em></span>
        <span><b>${instances.length}</b><em>实例</em></span>
      </div>
      <div class="group">从这个世界卡创建的实例</div>
      ${instances.length ? `<div class="rowcard">${instances.map(s => `<button class="rrow" data-inst="${s.id}"><span class="rt">${esc(s.instanceName || s.world.name)}</span><span class="rv">${esc(s.instance.currentTime)}</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>`).join('')}</div>` : `<div class="card-empty"><p>还没有实例。</p></div>`}
      <button class="pbtn" id="cardFree">以自由模式创建实例</button>
      <button class="pbtn ghost" id="cardStory">以剧情模式创建实例</button>
      <button class="pbtn ghost" id="cardExport">导出世界卡</button>
      <button class="pbtn danger-outline" id="cardDelete">删除世界卡</button>
    `
  });
  page.dataset.cardsPage = '1';
  page.addEventListener('click', e => {
    if (e.target.closest('#cardFree')) { pageCardCreate(rec.id, 'free'); return; }
    if (e.target.closest('#cardStory')) { pageCardCreate(rec.id, 'story'); return; }
    if (e.target.closest('#cardExport')) { exportCardRecord(rec); return; }
    if (e.target.closest('#cardDelete')) {
      openDialog({
        title: `删除世界卡「${esc(name)}」？<br><span style="font-size:12px;color:#bdbdbd">已创建的 ${instances.length} 个实例会保留各自进度，不受影响。世界卡本身删除后无法恢复。</span>`,
        ok: '删除', okClass: 'danger',
        onOk: () => {
          deleteCardRecord(rec.id);
          closeCardsPages();
          pageCards();
          renderAll();
          toast('世界卡已删除，实例保留');
        }
      });
      return;
    }
    const ins = e.target.closest('[data-inst]');
    if (ins) {
      DB.activeId = ins.dataset.inst; saveDB();
      closeCardsPages(); closeDrawer('left'); closeDrawer('right');
      renderAll(); toast('已切换到该实例');
    }
  });
  return { page, close };
}
function pageCardCreate(id, mode) {
  const rec = cardRecordById(id);
  if (!rec) { toast('世界卡不存在', false); return null; }
  const card = rec.card || {};
  const w = card.world || {};
  const name = cardDisplayName(card);
  let m = mode === 'story' ? 'story' : 'free';
  const defName = name + '-' + (storiesForCard(rec.id).length + 1);
  const { page, close } = pushPage({
    title: '创建实例', action: '进入', actionClass: 'grad',
    onAction: () => create()
  });
  page.dataset.cardsPage = '1';
  const draw = () => {
    page.querySelector('.pbody').innerHTML = `
      <div class="card-ref">
        <span class="card-ref-cover" style="${cardCoverStyle(card)}"></span>
        <span class="card-ref-meta"><b>${esc(name)}</b><em>${esc(w.tag || w.category || '世界卡')}</em></span>
      </div>
      <div class="field"><label>实例名称</label><input class="input" id="ciName" value="${esc(defName)}"></div>
      <div class="group">游玩模式</div>
      <div class="seg wiz-mode" id="ciMode">
        <button data-v="free" class="${m === 'free' ? 'on' : ''}">自由模式</button>
        <button data-v="story" class="${m === 'story' ? 'on' : ''}">剧情模式</button>
      </div>
      <div class="card-mode-note" id="ciNote">${m === 'story' ? '创建后先生成阶段骨架，由你确认后进入第一阶段。' : '按原有玩法自由游玩，不启用阶段限定。'}</div>
    `;
    $('#ciMode', page).addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const cur = ($('#ciName', page) || {}).value;
      m = b.dataset.v;
      draw();
      const inp = $('#ciName', page);
      if (inp && cur != null) inp.value = cur;
    });
  };
  draw();
  const create = () => {
    const nm = ($('#ciName', page) && $('#ciName', page).value.trim()) || defName;
    const story = storyFromCard(card);
    story.id = uid('story');
    story.cardId = rec.id;
    story.instanceName = nm;
    story.createdAt = nowTs(); story.updatedAt = nowTs();
    story.instance.timeStatus = 'running';
    story.instance.lastTick = nowTs();
    story.instance.lastActiveTime = story.instance.currentTime;
    // 剧情阶段不属于世界卡：新实例从空白规划开始，创建后再生成。
    story.story.enabled = false;
    DB.stories.unshift(story);
    DB.activeId = story.id;
    saveDB();
    closeCardsPages();
    closeDrawer('left'); closeDrawer('right');
    renderAll();
    toast(m === 'story' ? '实例已创建，请生成剧情骨架' : '实例已创建');
    if (m === 'story') { pageStoryPlan(story, { firstRun: true }); return; }
    if (hasLLM('tiandao', story)) generateOpening(story);
    else {
      story.messages.push({ id: uid('m'), role: 'assistant', kind: 'narrative', speaker: '天道', text: story.world.opening || `${story.world.name}的故事从这里开始。`, ts: nowTs(), time: story.instance.currentTime, roundId: uid('r') });
      saveDB(); renderAll();
    }
  };
  return { page, close };
}


function pageImportCard() {
  let dismiss = () => {};
  const doImport = raw => {
    raw = String(raw || '').trim();
    if (!raw) { toast('请先选择世界卡文件', false); return false; }
    let obj;
    try { obj = JSON.parse(raw); } catch (e) { toast('JSON 解析失败：' + e.message, false); return false; }
    if (obj.spec === SAVE_SPEC) {
      toast('这是体验存档，请用「导入存档」', false);
      openDialog({ title: '这是体验存档<br><span style="font-size:12px;color:#bdbdbd">存档需要对应的世界卡，去导入存档？</span>', ok: '去导入存档', onOk: () => pageImport() });
      return false;
    }
    const isCard = obj.spec === CARD_SPEC || obj.kind === 'world_card';
    const looksLegacy = !obj.spec && obj.world;
    if (!isCard) {
      if (looksLegacy) {
        toast('这是旧版完整存档，请用「导入存档」', false);
        openDialog({ title: '这是旧版存档<br><span style="font-size:12px;color:#bdbdbd">里面带着某一局的进度，不是世界卡。去导入存档？</span>', ok: '去导入存档', onOk: () => pageImport() });
      } else {
        toast('不是有效的世界卡文件', false);
      }
      return false;
    }
    try {
      const existed = !!cardRecordByContent(cardContentId(obj));
      const rec = addCardRecord(obj, 'import');
      if (!rec) { toast('不是有效的世界卡文件', false); return false; }
      const name = (rec.card && rec.card.name) || (rec.card && rec.card.world && rec.card.world.name) || '未命名世界';
      dismiss();
      dismissWizard();
      closeCardsPages();
      hydrateMedia().then(() => renderAll()).catch(() => {});
      toast((existed ? '世界卡已更新：' : '世界卡已加入卡库：') + name);
      pageCards(rec.id);
      return true;
    } catch (e) { toast('导入失败：' + e.message, false); return false; }
  };
  const { page, close } = pushPage({
    title: '导入世界卡', action: '导入', actionClass: 'grad',
    body: `
      <button class="pbtn" id="pickCardFile">选择世界卡 JSON 文件</button>
      <input type="file" class="json-file" accept=".json,application/json,text/plain" hidden>
      <div class="file-note">支持 .json 文件</div>
      <div class="paste-toggle">或粘贴 JSON 文本</div>
      <div class="paste-box" hidden><div class="field"><textarea class="input" id="impText" rows="12" placeholder='{"spec":"${CARD_SPEC}",…}'></textarea></div></div>`,
    onAction: () => {
      const raw = $('#impText', page).value.trim();
      if (!raw) { $('#pickCardFile', page).click(); return; }
      doImport(raw);
    }
  });
  dismiss = close;
  mountJSONImport(page, text => doImport(text));
  return { page, close, doImport };
}

function markBackup() {
  DB.config.lastBackupAt = nowTs();
  saveDB();
}
function pageExport(s) {
  const data = JSON.stringify(saveForExport(s), null, 2);  const name = '启源存档-' + (s.instanceName || '存档') + '.json';
  const { page } = pushPage({
    title: '导出存档', action: '', body: `
      
      <div class="field"><textarea class="input" id="expText" rows="16" readonly>${esc(data)}</textarea></div>
      <button class="pbtn" id="copyExp">复制到剪贴板</button>
      <button class="pbtn ghost" id="downloadExp">下载存档 JSON</button>`
  });
  $('#copyExp', page).onclick = () => {
    copyText(data, '存档已复制');
    markBackup();
  };
  $('#downloadExp', page).onclick = () => {
    const r = downloadJSON(name, data);
    if (r) { toast(r === 'saved' ? '已保存到「下载/启源」' : '已请求下载'); markBackup(); } else toast('保存失败', false);
  };
}

function importLegacyStory(obj) {
  const story = normalizeStory(obj);
  story.id = uid('story');
  story.instanceName = story.instanceName || story.world.name;
  if (!story.instance.startTime) story.instance.startTime = story.world.startTime || '第一日 清晨';
  if (!story.instance.currentTime) story.instance.currentTime = story.instance.startTime;
  story.llm = null;
  story.instance.lastTick = nowTs();
  story.instance.lastActiveTime = story.instance.currentTime;
  trimMessages(story);
  ensureCardForStory(story, 'legacy');
  return story;
}

function pageImport() {
  let dismiss = () => {};
  const doImport = raw => {
    raw = String(raw || '').trim();
    if (!raw) { toast('请先选择存档文件', false); return false; }
    let obj;
    try { obj = JSON.parse(raw); } catch (e) { toast('JSON 解析失败：' + e.message, false); return false; }
    if (obj.spec === CARD_SPEC) {
      toast('这是世界卡，请用「导入世界卡」', false);
      openDialog({ title: '这是世界卡<br><span style="font-size:12px;color:#bdbdbd">世界卡只含设定，不含这一局的过程数据。去导入世界卡？</span>', ok: '去导入世界卡', onOk: () => pageImportCard() });
      return false;
    }
    let story;
    try {
      if (obj.spec === SAVE_SPEC || (obj.kind === 'save' && obj.data)) {
        const cardRec = findCardRecord(obj.card_ref);
        if (!cardRec) {
          const nm = (obj.card_ref && obj.card_ref.name) || '目标世界';
          toast('未找到世界卡「' + nm + '」', false);
          openDialog({
            title: '缺少对应的世界卡<br><span style="font-size:12px;color:#bdbdbd">存档只保存过程数据，需要先导入「' + esc(nm) + '」的世界卡。</span>',
            ok: '去导入世界卡',
            onOk: () => { pageImportCard(); }
          });
          return false;
        }
        story = storyFromCard(cardRec.card);
        story.cardId = cardRec.id;
        applySaveToStory(story, obj);
      } else if (!obj.spec && obj.world) {
        story = importLegacyStory(obj);
      } else {
        toast('不是有效的存档文件', false); return false;
      }
      DB.stories.unshift(story);
      DB.activeId = story.id;
      saveDB();
      renderAll();
      hydrateMedia().then(() => renderAll());
      dismiss();
      dismissWizard();
      toast('存档已导入：' + (story.instanceName || story.world.name || '新实例'));
      return true;
    } catch (e) { toast('导入失败：' + e.message, false); return false; }
  };
  const { page, close } = pushPage({
    title: '导入存档', action: '导入', actionClass: 'grad',
    body: `
      <button class="pbtn" id="pickSaveFile">选择存档 JSON 文件</button>
      <input type="file" class="json-file" accept=".json,application/json,text/plain" hidden>
      <div class="file-note">支持 .json 文件</div>
      <div class="paste-toggle">或粘贴 JSON 文本</div>
      <div class="paste-box" hidden><div class="field"><textarea class="input" id="impText" rows="12" placeholder='{"spec":"${SAVE_SPEC}",…}'></textarea></div></div>`,
    onAction: () => {
      const raw = $('#impText', page).value.trim();
      if (!raw) { $('#pickSaveFile', page).click(); return; }
      doImport(raw);
    }
  });
  dismiss = close;
  mountJSONImport(page, text => doImport(text));
  return { page, close, doImport };
}

/* ---------------- 向导 ---------------- */
const WIZ = { step: 0, presetId: '', world: null, player: null, npcs: [], suffix: '', timeSpeed: 1, storyMode: false };
function openWizard() {
  WIZ.step = 0; WIZ.presetId = ''; WIZ.world = null; WIZ.player = null; WIZ.npcs = []; WIZ.suffix = ''; WIZ.timeSpeed = 1; WIZ.storyMode = false;
  renderWizard();
}
function wizardReset(preset) {
  if (!preset) {
    WIZ.world = normalizeWorld({ name: '', desc: '', fields: [{ path: '世界观', value: '' }], calendarName: '', startTime: '', locationSchema: '域 → 城/镇 → 场所 → 具体位置' });
    WIZ.player = Object.assign(blankCharacter(''), { emotion: '平静', health: '良好' });
    WIZ.npcs = [];
  } else {
    const src = JSON.parse(JSON.stringify(preset.world));
    // 预设自带结构化设定：保留每一条，不再合并成单一「世界观」。
    WIZ.world = normalizeWorld(Object.assign({ presetId: preset.id }, src));
    WIZ.world.presetId = preset.id;
    WIZ.player = Object.assign(blankCharacter(preset.player.name), JSON.parse(JSON.stringify(preset.player)));
    WIZ.player.currentLocation = preset.startLocation || '';
    WIZ.npcs = (preset.npcs || []).map(n => Object.assign(blankCharacter(n.name), JSON.parse(JSON.stringify(n)), { id: uid('npc'), evolutionVersion: 1, lastEvolutionAt: '' }));
  }
}
function renderWizard() {
  overlayStack = overlayStack.filter(o => {
    if (o.type === 'page' && o.page && o.page.dataset.wizard) { o.page.remove(); return false; }
    return true;
  });
  const step = WIZ.step;
  let body = '', action = '下一步', canNext = true;
  if (step === 0) {
    body = `<div class="wizard-hero"><div class="wiz-brand">启源 · 沉浸式虚拟世界体验</div><h2>从一个世界开始</h2></div>
      <div class="cardio top">
        <div class="two">
          <button class="pbtn ghost" id="wizImportCard">导入世界卡</button>
          ${activeStory() ? `<button class="pbtn ghost" id="wizExportCard">导出当前世界卡</button>` : ''}
        </div>
        ${(DB.cards || []).length ? `<button class="pbtn ghost" id="wizCards" style="margin-top:8px">世界卡库 · ${(DB.cards || []).length} 张</button>` : ''}
      </div>
      <div class="group">游玩模式</div>
      <div class="seg wiz-mode" id="wizMode">
        <button data-v="free" class="${WIZ.storyMode ? '' : 'on'}">自由模式</button>
        <button data-v="story" class="${WIZ.storyMode ? 'on' : ''}">剧情模式</button>
      </div>
      
      <div class="preset-list">${PRESETS.map(p => `<button class="preset-card ${WIZ.presetId === p.id ? 'sel' : ''}" data-preset="${p.id}">
        <span class="p-cover" style="${coverStyle(p.world)}"><i>${esc(p.tag)}</i><b>${esc(p.name)}</b></span>
        <span class="p-meta"><em>${esc(p.world.desc)}</em><i>预设世界观 · ${p.npcs.length} 位 NPC · ${esc(p.world.startTime)}</i></span>
      </button>`).join('')}
      <button class="preset-card custom ${WIZ.presetId === 'custom' ? 'sel' : ''}" data-preset="custom">
        <span class="p-cover" style="${coverStyle({ coverId: 'fog' })}"><i>完全本地 · 无审核</i><b>自定义世界</b></span>
        <span class="p-meta"><em>从空白开始，自己写世界设定、历法与角色。</em><i>封面与卡片可随时更换</i></span>
      </button></div>`;
    canNext = !!WIZ.presetId;
  } else if (step === 1) {
    const w = WIZ.world;
    body = `
      ${coverPickerHTML(w)}
      <div class="field"><label>世界名称</label><input class="input" id="wzName" value="${esc(w.name)}"></div>
      <div class="field"><label>世界描述（玩家可见）</label><textarea class="input" id="wzDesc" rows="3">${esc(w.desc)}</textarea></div>
      <div class="field"><label>历法名称</label><input class="input" id="wzCal" value="${esc(w.calendarName)}" placeholder="如 大晟、民国、星历"></div>
      <div class="field"><label>起始时间</label><input class="input" id="wzStart" value="${esc(w.startTime)}" placeholder="如 大晟二十三年十月十二日戌时"></div>
      <div class="field"><label>地理层级</label><textarea class="input" id="wzLoc" rows="2">${esc(w.locationSchema)}</textarea></div>
      <div class="group">世界设定条目</div>
      ${fieldsEditor(w.fields, true)}
      <div class="field"><label>天道附加指令（可选，≤500 字）</label><textarea class="input" id="wzPrompt" rows="3">${esc(w.tiandaoPrompt)}</textarea></div>`;
    canNext = !!w.name && ((w.fields || []).some(f => String(f.value || '').trim()) || !!w.desc);
  } else if (step === 2) {
    body = `
      ${charForm(WIZ.player)}
      <div class="field"><label>起始位置（预设世界可留空，由天道生成）</label><input class="input" id="wzLoc2" value="${esc(WIZ.player.currentLocation)}"></div>
      ${WIZ.npcs.length ? `<div class="group">这个世界的原生 NPC</div><div class="rowcard">${WIZ.npcs.map(n => `<div class="rrow"><span class="npc-avatar">${esc(n.name[0] || '？')}</span><span class="rt">${esc(n.name)}<em style="display:block;font-size:12px;color:#8a8a8a;font-style:normal">${esc(n.occupation || '')} · ${esc(n.currentLocation || '位置未知')}</em></span></div>`).join('')}</div>` : ''}`;
    canNext = !!WIZ.player.name;
  } else {
    const name = (WIZ.world.name || '世界') + '-' + (WIZ.suffix || '新旅程');
    body = `
      <div class="field"><label>实例名称</label><div class="inst-name"><span>${esc(WIZ.world.name)}-</span><input class="input" id="wzSuffix" value="${esc(WIZ.suffix)}" placeholder="如 新手之旅"></div></div>
      <div class="field"><label>时间流速（现实 1 分钟 = 世界 N 分钟）</label><div class="seg" id="wzSpeed">${[1, 2, 6, 12, 24].map(n => `<button data-v="${n}" class="${WIZ.timeSpeed === n ? 'on' : ''}">${n}×</button>`).join('')}</div></div>
      ${llmWizardBlock()}
      `;
    action = '进入世界';
    canNext = resolveLLMRef((WIZ.llm && WIZ.llm.tiandao) || (DB.config.llmAssign || {}).tiandao).length > 0;
  }
  const page = pushPage({ title: '', body, action, actionClass: 'grad', onAction: () => wizardNext() }).page;
  page.dataset.wizard = '1';
  $('.phead', page).style.display = 'none';
  page.querySelector('.pbody').insertAdjacentHTML('afterbegin', `
    <div class="phead wizhead" style="display:flex">
      <button class="back" id="wizBack"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>
      <div class="ptitle">${['选择世界', '世界设定', '玩家角色', '实例与模型'][step]}</div>
      <button class="pact" id="wizNext">${action}</button>
    </div>
    <div class="steps">${[0, 1, 2, 3].map(i => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>`);
  const cp = $('.cover-pick', page);
  if (cp && WIZ.world) mountCoverPicker(cp, WIZ.world);
  const ap = $('.avatar-pick', page);
  if (ap && WIZ.player) mountAvatarPicker(ap, WIZ.player);
  $('#wizBack', page).onclick = () => { if (WIZ.step === 0) page.remove(), overlayStack = overlayStack.filter(o => o.page !== page); else { collectWizard(); WIZ.step--; renderWizard(); } };
  $('#wizNext', page).onclick = () => wizardNext();
  page.addEventListener('click', e => {
    const lr = e.target.closest('.wz-llm-ref');
    if (lr) { openWizardLLMPicker(page, lr.dataset.k, lr); return; }
    if (e.target.closest('#wizImportCard')) { pageImportCard(); return; }
    if (e.target.closest('#wizCards')) { dismissWizard(); pageCards(); return; }
    if (e.target.closest('#wizExportCard')) {
      const s = activeStory();
      if (s) pageExportCard(s); else toast('没有可导出的实例', false);
      return;
    }
    if (e.target.closest('#wizManageAPIs')) {
      collectWizard();
      pageAPIs();
      const top = overlayStack[overlayStack.length - 1];
      if (top) {
        const oc = top.close;
        top.close = () => {
          oc();
          setTimeout(() => { if (document.querySelector('.page[data-wizard]')) renderWizard(); }, 90);
        };
      }
      return;
    }
    const p = e.target.closest('[data-preset]');
    if (p) {
      WIZ.presetId = p.dataset.preset;
      wizardReset(p.dataset.preset === 'custom' ? null : PRESETS.find(x => x.id === p.dataset.preset));
      if (WIZ.presetId !== 'custom') WIZ.suffix = '新旅程';
      $$('.preset-card', page).forEach(x => x.classList.toggle('sel', x.dataset.preset === WIZ.presetId));
    }
    const sp = e.target.closest('#wzSpeed button');
    if (sp) {
      WIZ.timeSpeed = +sp.dataset.v;
      $$('#wzSpeed button', page).forEach(x => x.classList.remove('on'));
      sp.classList.add('on');
    }
    const md = e.target.closest('#wizMode button');
    if (md) {
      WIZ.storyMode = md.dataset.v === 'story';
      renderWizard();
      toast(WIZ.storyMode ? '已选择剧情模式：创建后先生成阶段骨架' : '已选择自由模式');
    }
    if (e.target.id === 'addField') { addFieldRow($('#fieldsEditor', page)); }
    const del = e.target.closest('.fdel, [data-del-field]');
    if (del) { del.closest('.frow').remove(); refreshFieldCounter(page); }
  });
  if (step === 3) mountWizardLLM(page);
}
function collectWizard() {
  const page = $('.page[data-wizard]');
  if (!page) return;
  if (WIZ.step === 0) return;
  if (WIZ.step === 1) {
    WIZ.world.name = $('#wzName', page).value.trim() || WIZ.world.name;
    WIZ.world.desc = $('#wzDesc', page).value.trim();
    WIZ.world.calendarName = $('#wzCal', page).value.trim();
    WIZ.world.startTime = $('#wzStart', page).value.trim();
    WIZ.world.locationSchema = $('#wzLoc', page).value.trim();
    WIZ.world.tiandaoPrompt = $('#wzPrompt', page).value.trim();
    WIZ.world.fields = readFieldsEditor(page);
  } else if (WIZ.step === 2) {
    Object.assign(WIZ.player, readCharForm(page));
    const loc = $('#wzLoc2', page) && $('#wzLoc2', page).value.trim();
    if (loc) WIZ.player.currentLocation = loc;
  } else if (WIZ.step === 3) {
    WIZ.suffix = ($('#wzSuffix', page) && $('#wzSuffix', page).value.trim()) || '新旅程';
    const sp = $('#wzSpeed button.on', page);
    if (sp) WIZ.timeSpeed = +sp.dataset.v;
    WIZ.llm = readWizardLLM(page);
  }
}
function wizardNext() {
  collectWizard();
  if (WIZ.step === 0 && !WIZ.presetId) { toast('请选择一个世界或自定义', false); return; }
  if (WIZ.step === 3) {
    const ref = (WIZ.llm && WIZ.llm.tiandao) || (DB.config.llmAssign || {}).tiandao;
    if (!resolveLLMRef(ref).length) { toast('请先配置并选择天道模型', false); return; }
    finishWizard(); return;
  }
  WIZ.step++;
  renderWizard();
}
function wizardRefLabel(kind, ref) {
  const assign = DB.config.llmAssign || {};
  if (ref === 'tiandao') return '跟随天道 · ' + llmRefLabel(llmRefOf('tiandao'));
  if (!ref) return '全局默认' + (assign[kind] ? ' · ' + llmRefLabel(assign[kind]) : '（未配置）');
  if (ref.indexOf('api:') === 0) {
    const a = findApi(ref.slice(4));
    return a ? ((a.name || a.model || '未命名接口') + (a.model ? ' · ' + a.model : '') + (a.enabled === false ? ' · 已停用' : '')) : '接口已删除';
  }
  if (ref.indexOf('pool:') === 0) {
    const p = findPool(ref.slice(5));
    return p ? ((p.name || '聚合') + ' · 智能轮询' + (p.enabled === false ? ' · 已停用' : '')) : '聚合组已删除';
  }
  return '未配置的引用';
}
function openWizardLLMPicker(page, kind, btn) {
  const assign = DB.config.llmAssign || {};
  let closeSheet = () => { };
  const setRef = ref => {
    btn.dataset.ref = ref;
    const t = $('.wiz-ref-t', btn);
    if (t) t.textContent = wizardRefLabel(kind, ref);
    WIZ.llm = readWizardLLM(page);
    closeSheet();
    toast('已选择：' + wizardRefLabel(kind, ref));
  };
  const items = [];
  if (kind !== 'tiandao') {
    items.push({ label: '跟随天道 · ' + llmRefLabel(llmRefOf('tiandao')), onClick: () => setRef('tiandao') });
  }
  items.push({ label: '全局默认' + (assign[kind] ? ' · ' + llmRefLabel(assign[kind]) : '（未配置）'), onClick: () => setRef('') });
  llmApis().forEach(a => items.push({
    label: (a.name || a.model || '未命名接口') + (a.model ? ' · ' + a.model : '') + (a.enabled === false ? ' · 已停用' : ''),
    onClick: () => setRef('api:' + a.id)
  }));
  llmPools().forEach(p => items.push({
    label: (p.name || '聚合') + ' · 智能轮询' + (p.enabled === false ? ' · 已停用' : ''),
    onClick: () => setRef('pool:' + p.id)
  }));
  const sheet = openSheet({ title: (LLM_LABEL[kind] || '') + ' Agent', items });
  closeSheet = sheet.close;
}
function llmWizardBlock() {
  const assign = DB.config.llmAssign || {};
  const cur = WIZ.llm || assign;
  return `<div class="group">模型分配（可稍后在右侧「模型」修改）</div>
    <div class="wiz-llm">
      ${['tiandao', 'character', 'memory'].map(k => `<div class="field"><label>${LLM_LABEL[k]} Agent</label>
        <button type="button" class="input wiz-ref wz-llm-ref" data-k="${k}" data-ref="${esc(cur[k] || '')}">
          <span class="wiz-ref-t">${esc(wizardRefLabel(k, cur[k] || ''))}</span>
          <span class="wiz-ref-x">更换</span>
        </button></div>`).join('')}
    </div>
    <button class="pbtn ghost" id="wizManageAPIs" type="button">管理模型与 API</button>
    `;
}
function mountWizardLLM(page) { }
function readWizardLLM(page) {
  const out = {};
  for (const k of ['tiandao', 'character', 'memory']) {
    const el = $(`.wz-llm-ref[data-k="${k}"]`, page);
    out[k] = el ? (el.dataset.ref || '') : '';
  }
  return out;
}
function finishWizard() {
  const L = WIZ.llm || DB.config.llmAssign || {};
  const refs = {};
  for (const k of ['tiandao', 'character', 'memory']) if (L[k]) refs[k] = L[k];
  const world = normalizeWorld(WIZ.world);
  world.presetId = WIZ.presetId;
  const story = normalizeStory({
    instanceName: world.name + '-' + (WIZ.suffix || '新旅程'),
    world, player: WIZ.player, npcs: WIZ.npcs,
    instance: { startTime: world.startTime, currentTime: world.startTime, timeStatus: 'running', timeSpeed: WIZ.timeSpeed, lastActiveTime: world.startTime },
    messages: [], memories: [], bookmarks: [], events: [], working: { l1: [] },
    llm: Object.keys(refs).length ? refs : null
  });
  story.seed = makeStorySeed(story.world, story.player, story.npcs, [], story.seed);
  story.createdAt = nowTs(); story.updatedAt = nowTs();
  ensureCardForStory(story, 'wizard');
  DB.stories.unshift(story);
  DB.activeId = story.id;
  overlayStack = overlayStack.filter(o => { if (o.type === 'page' && o.page && o.page.dataset.wizard) { o.page.remove(); return false; } return true; });
  saveDB(); renderAll(); closeDrawer('left');
  toast('世界已创建');
  if (WIZ.storyMode) { pageStoryPlan(story, { firstRun: true }); return; }
  if (hasLLM('tiandao', story)) generateOpening(story);
  else {
    story.messages.push({ id: uid('m'), role: 'assistant', kind: 'narrative', speaker: '天道', text: world.opening || `${world.name}的故事从这里开始。`, ts: nowTs(), time: story.instance.currentTime, roundId: uid('r') });
    saveDB(); renderAll();
  }
}

/* ---------------- 剧情模式：规划器与阶段面板 ---------------- */
let STORY_PLAN_STATE = { busy: false, msg: '', issues: [] };
function stageIssueRow(it) {
  return `<div class="stage-issue"><b>${esc(it.stage || '整体')}</b><span>${esc(it.problem || '')}</span>${it.fix ? `<em>建议：${esc(it.fix)}</em>` : ''}</div>`;
}
function stageCognitionSummary(st) {
  const c = (st && st.cognition) || {};
  const rows = [];
  if (c.realm) rows.push('境界：' + c.realm);
  if (c.social) rows.push('阶层：' + c.social);
  if ((c.geography || []).length) rows.push('地理：' + c.geography.join('、'));
  if ((c.knownFactions || []).length) rows.push('势力：' + c.knownFactions.join('、'));
  if ((c.forbidden || []).length) rows.push('不可知：' + c.forbidden.join('；'));
  return rows.length ? rows.join('<br>') : '（未设定）';
}
function stagePlanCard(st, s, opt) {
  const cur = s && storyModeOn(s) && s.story.stageId === st.id;
  return `<div class="stage-card ${cur ? 'cur' : ''}">
    <div class="stage-card-h"><span class="stage-badge">第 ${st.order} 阶段</span><b>${esc(st.name)}</b>
      <span class="stage-state">${st.detailStatus === 'detailed' ? '已细化' : '骨架'}</span></div>
    <p>${esc(clampText(st.summary || '（暂无摘要）', 260))}</p>
    ${st.span ? `<div class="stage-meta">时间跨度：${esc(st.span)}</div>` : ''}
    <div class="stage-meta">推进条件：${esc(stageExitLabel(st))}</div>
    <div class="stage-cog">${stageCognitionSummary(st)}</div>
    ${(st.forbiddenTerms || []).length ? `<div class="stage-terms">禁忌词：${st.forbiddenTerms.map(esc).join('、')}</div>` : ''}
    ${opt && opt.editable ? `<div class="stage-tools">
      <button class="mini" data-stage-edit="${st.id}">编辑</button>
      ${st.detailStatus !== 'detailed' ? `<button class="mini" data-stage-detail="${st.id}">细化</button>` : ''}
      <button class="mini" data-stage-up="${st.id}" title="上移">↑</button>
      <button class="mini" data-stage-down="${st.id}" title="下移">↓</button>
      <button class="mini danger" data-stage-del="${st.id}">删除</button>
    </div>` : ''}
  </div>`;
}
function moveStage(s, id, dir) {
  const arc = storyArcOf(s);
  if (!arc) return false;
  const i = arc.stages.findIndex(st => st.id === id);
  const j = i + (dir < 0 ? -1 : 1);
  if (i < 0 || j < 0 || j >= arc.stages.length) return false;
  const t = arc.stages[i]; arc.stages[i] = arc.stages[j]; arc.stages[j] = t;
  arc.stages.forEach((st, k) => { st.order = k + 1; });
  s.world.storyArc = arc;
  saveDB();
  return true;
}
function addBlankStage(s) {
  const arc = storyArcOf(s);
  if (!arc) return null;
  if (arc.stages.length >= 12) { toast('最多 12 个阶段', false); return null; }
  const i = arc.stages.length;
  const st = normalizeStoryStage({
    id: 'st' + (i + 1) + '_' + Math.random().toString(36).slice(2, 5),
    name: '新阶段', summary: '', span: '',
    exit: { any: [] }, cognition: {}, cast: {}, detailStatus: 'skeleton'
  }, i);
  st.order = i + 1;
  arc.stages.push(st);
  s.world.storyArc = arc;
  saveDB();
  return st;
}
function deleteStage(s, id) {
  const arc = storyArcOf(s);
  if (!arc || arc.stages.length <= 1) { toast('至少保留一个阶段', false); return false; }
  arc.stages = arc.stages.filter(st => st.id !== id);
  arc.stages.forEach((st, k) => { st.order = k + 1; });
  s.world.storyArc = arc;
  if (s.story.stageId === id) s.story.stageId = arc.stages[0].id;
  saveDB();
  return true;
}
function storyPlanBody(s) {
  const arc = storyArcOf(s);
  const busy = STORY_PLAN_STATE.busy;
  const has = arc && arc.stages.length;
  const head = `<div class="wizard-hero"><div class="wiz-brand">启源 · 剧情模式</div>
    <h2>${has ? '阶段骨架已生成' : '先让天道读懂这个世界'}</h2></div>`;
  let body = head;
  if (busy || STORY_PLAN_STATE.msg) body += `<div class="stage-plan-msg" id="planMsg">${esc(STORY_PLAN_STATE.msg || '正在处理…')}</div>`;
  if (!has) {
    body += `<button class="pbtn grad wide" id="planGo" ${busy ? 'disabled' : ''}>${busy ? '生成中…' : '生成剧情骨架'}</button>
      
      <button class="pbtn ghost wide" id="planFree" style="margin-top:10px">跳过，改用自由模式</button>`;
    return body;
  }
  body += `<div class="group">阶段列表</div><div class="stage-plan-list">${arc.stages.map(st => stagePlanCard(st, s, { editable: true })).join('')}</div>
    <div class="stage-actions"><button class="pbtn ghost" id="planAddStage">＋ 新增阶段</button><button class="pbtn ghost" id="planVisibility">世界可见性</button></div>`;
  if (arc.auditNotes && arc.auditNotes.length) {
    body += `<div class="group">世界审计备注</div><div class="stage-notes">${arc.auditNotes.map(n => `<div class="stage-note">${esc(n)}</div>`).join('')}</div>`;
  }
  const issues = (arc && arc.issues) || [];
  if (issues.length) {
    body += `<div class="group">一致性校对</div><div class="stage-issues">${issues.map(stageIssueRow).join('')}</div>`;
  }
  body += `<div class="stage-plan-actions">
    <button class="pbtn grad wide" id="planConfirm" ${busy ? 'disabled' : ''}>确认并开始游玩</button>
    <button class="pbtn ghost wide" id="planRegen" ${busy ? 'disabled' : ''}>重新生成骨架</button>
    <button class="pbtn ghost wide" id="planFree">改用自由模式</button>
  </div>`;
  return body;
}
function inWorldVisibilityRow(s, field) {
  const arc = storyArcOf(s) || blankStoryArc();
  const m = (arc.fieldMeta || {})[field.path] || { visibility: 'public', revealAt: '' };
  const stages = arc.stages || [];
  return `<div class="vis-row">
    <div class="vis-head"><b>${esc(field.path)}</b><em>${esc(clampText(String(field.value || '').replace(/\s+/g, ' '), 90))}</em></div>
    <div class="two">
      <div class="field"><label>可见性</label><select class="input" data-vis-path="${esc(field.path)}">
        <option value="public" ${m.visibility === 'public' ? 'selected' : ''}>公共（始终注入）</option>
        <option value="stage" ${m.visibility === 'stage' ? 'selected' : ''}>阶段解锁</option>
        <option value="hidden" ${m.visibility === 'hidden' ? 'selected' : ''}>隐藏（永不注入）</option>
      </select></div>
      <div class="field"><label>解锁阶段</label><select class="input" data-reveal-path="${esc(field.path)}">
        <option value="" ${!m.revealAt ? 'selected' : ''}>（立即 / 不指定）</option>
        ${stages.map(st => `<option value="${esc(st.id)}" ${m.revealAt === st.id ? 'selected' : ''}>第 ${st.order} 阶段 · ${esc(st.name)}</option>`).join('')}
      </select></div>
    </div>
  </div>`;
}
function pageWorldVisibility(s, onDone) {
  const arc = normalizeStoryArc(s.world.storyArc || {});
  const fields = s.world.fields || [];
  const body = `<div class="wizard-hero"><h2>世界可见性</h2></div>
    
    ${fields.length ? fields.map(f => inWorldVisibilityRow(s, f)).join('') : ''}
    <label class="stage-auto"><input type="checkbox" id="visRaw" ${arc.includeRaw ? 'checked' : ''}> 把「补充设定 Markdown」也注入剧情模式</label>
    ${(arc.auditNotes && arc.auditNotes.length) ? `<div class="group">世界审计备注</div><div class="stage-notes">${arc.auditNotes.map(n => `<div class="stage-note">${esc(n)}</div>`).join('')}</div>` : ''}
    <div class="stage-actions">
      <button class="pbtn ghost" id="visAllPublic">全部设为公共</button>
      <button class="pbtn ghost" id="visAllStage">全部设为阶段解锁</button>
    </div>
    `;
  const pg = pushPage({
    title: '世界可见性', body, action: '保存', actionClass: 'grad',
    onAction: () => {
      const map = {};
      const vis = {}, rev = {};
      $$('[data-vis-path]', pg.page).forEach(sel => { vis[sel.dataset.visPath] = sel.value; });
      $$('[data-reveal-path]', pg.page).forEach(sel => { rev[sel.dataset.revealPath] = sel.value; });
      fields.forEach(f => {
        map[f.path] = { visibility: vis[f.path] || 'public', revealAt: rev[f.path] || '' };
      });
      const next = normalizeStoryArc(Object.assign({}, arc, {
        fieldMeta: map,
        includeRaw: !!$('#visRaw', pg.page).checked
      }));
      s.world.storyArc = next;
      saveDB();
      pg.close();
      toast('世界可见性已保存');
      if (onDone) onDone();
    }
  });
  const setAll = v => {
    $$('[data-vis-path]', pg.page).forEach(sel => { sel.value = v; });
  };
  const allPub = $('#visAllPublic', pg.page);
  if (allPub) allPub.onclick = () => setAll('public');
  const allStage = $('#visAllStage', pg.page);
  if (allStage) allStage.onclick = () => setAll('stage');
}
function pageStoryPlan(s, opt) {
  STORY_PLAN_STATE = { busy: false, msg: '', issues: (s.story && s.story._checkIssues) || [] };
  const page = pushPage({ title: '剧情规划', body: storyPlanBody(s), action: '' }).page;
  $('.pact', page).style.display = 'none';
  const body = $('.pbody', page);
  const draw = () => { body.innerHTML = storyPlanBody(s); };
  const startPlan = async () => {
    if (STORY_PLAN_STATE.busy) return;
    STORY_PLAN_STATE = { busy: true, msg: '正在审计世界设定…', issues: [] };
    draw();
    try {
      await planStoryArc(s, {
        onProgress: msg => { STORY_PLAN_STATE.msg = msg; draw(); }
      });
      STORY_PLAN_STATE = { busy: false, msg: '阶段骨架已生成，请确认或修改。', issues: (s.world.storyArc && s.world.storyArc.issues) || [] };
      saveDB(); draw();
      toast('剧情骨架已生成');
    } catch (e) {
      STORY_PLAN_STATE = { busy: false, msg: '生成失败：' + e.message, issues: [] };
      draw();
      toast('生成失败：' + e.message, false);
    }
  };
  page.addEventListener('click', async e => {
    if (e.target.closest('#planGo') || e.target.closest('#planRegen')) { startPlan(); return; }
    if (e.target.closest('#planVisibility') || e.target.closest('#storyVisibility')) {
      pageWorldVisibility(s, draw);
      return;
    }
    if (e.target.closest('#planAddStage')) {
      addBlankStage(s); draw(); return;
    }
    if (e.target.closest('#planFree')) {
      s.world.storyArc.enabled = false;
      s.story.enabled = false;
      saveDB();
      overlayStack = overlayStack.filter(o => o.page !== page); page.remove();
      renderAll();
      if (!s.messages.length) {
        if (hasLLM('tiandao', s)) generateOpening(s);
        else {
          s.messages.push({ id: uid('m'), role: 'assistant', kind: 'narrative', speaker: '天道', text: s.world.opening || `${s.world.name}的故事从这里开始。`, ts: nowTs(), time: s.instance.currentTime, roundId: uid('r') });
          saveDB(); renderAll();
        }
      }
      toast('已改用自由模式');
      return;
    }
    if (e.target.closest('#planConfirm')) {
      if (!storyArcOf(s) || !s.world.storyArc.stages.length) return;
      s.world.storyArc.enabled = true;
      s.story = normalizeStoryState(Object.assign({}, s.story, {
        enabled: true, arcVersion: s.world.storyArc.version,
        stageId: s.world.storyArc.stages[0].id,
        stageEnteredAt: s.instance.currentTime,
        stageHistory: [{ stageId: s.world.storyArc.stages[0].id, from: s.instance.currentTime, to: '' }]
      }), s.world);
      saveDB();
      overlayStack = overlayStack.filter(o => o.page !== page); page.remove();
      renderAll();
      if (!s.messages.length) {
        if (hasLLM('tiandao', s)) generateOpening(s);
        else {
          s.messages.push({ id: uid('m'), role: 'assistant', kind: 'narrative', speaker: '天道', text: s.world.opening || `${s.world.name}的故事从这里开始。`, ts: nowTs(), time: s.instance.currentTime, roundId: uid('r') });
          saveDB(); renderAll();
        }
      }
      toast('已进入第 1 阶段');
      return;
    }
    const ed = e.target.closest('[data-stage-edit]');
    if (ed) { pageStageEdit(s, ed.dataset.stageEdit, () => draw()); return; }
    const up = e.target.closest('[data-stage-up]');
    if (up) { moveStage(s, up.dataset.stageUp, -1); draw(); return; }
    const down = e.target.closest('[data-stage-down]');
    if (down) { moveStage(s, down.dataset.stageDown, 1); draw(); return; }
    const del = e.target.closest('[data-stage-del]');
    if (del) {
      openDialog({
        title: '删除这个阶段？<br><span style="font-size:12px;color:#bdbdbd">已发生的消息与记忆不会删除；只影响后续注入。</span>',
        ok: '删除', okClass: 'danger',
        onOk: () => { deleteStage(s, del.dataset.stageDel); draw(); }
      });
      return;
    }
    const dt = e.target.closest('[data-stage-detail]');
    if (dt) {
      try {
        STORY_PLAN_STATE.msg = '正在细化…'; STORY_PLAN_STATE.busy = true; draw();
        await detailStage(s, dt.dataset.stageDetail);
        STORY_PLAN_STATE = { busy: false, msg: '已细化。', issues: STORY_PLAN_STATE.issues };
        saveDB(); draw();
      } catch (err) {
        STORY_PLAN_STATE = { busy: false, msg: '细化失败：' + err.message, issues: STORY_PLAN_STATE.issues };
        draw();
      }
    }
  });
  return page;
}

function disclosureRows(s) {
  const list = (s.story.disclosure && s.story.disclosure.facts) || [];
  if (!list.length) return '';
  return list.slice().reverse().map(f => `<div class="fact-row">
    <div><b>${esc(f.text)}</b><em>${esc([f.source ? '来源：' + f.source : '', f.confidence === 'rumor' ? '传闻' : (f.confidence === 'false' ? '错误认知' : ''), f.learnedAt].filter(Boolean).join(' · '))}</em></div>
    <button class="mini" data-fact-del="${f.id}">删除</button>
  </div>`).join('');
}
function storyPanelBody(s) {
  const arc = storyArcOf(s);
  const on = storyModeOn(s);
  const cur = currentStage(s);
  let body = `<div class="wizard-hero"><h2>剧情阶段</h2></div>`;
  if (!arc || !arc.stages.length) {
    body += `<button class="pbtn grad wide" id="storyPlan">生成剧情骨架</button>
      `;
    return body;
  }
  if (on && cur) {
    body += `<div class="stage-current">
      <div class="stage-card-h"><span class="stage-badge">当前 · 第 ${cur.order} 阶段</span><b>${esc(cur.name)}</b></div>
      <p>${esc(cur.summary || '')}</p>
      <div class="stage-meta">推进条件：${esc(stageExitLabel(cur))} ${stageCanAdvance(s) ? '· <b class="ok-text">已满足，可推进</b>' : ''}</div>
      <div class="stage-cog">${stageCognitionSummary(cur)}</div>
      ${s.story.planStatus === 'stale' ? `<div class="stage-stale">剧情已偏离阶段规划。已发生的事实不会改写；可以只重规划当前之后的阶段。</div>` : ''}
      <div class="stage-actions">
        ${nextStage(s) ? `<button class="pbtn" id="stageAdvance">推进到「${esc(nextStage(s).name)}」</button>` : '<span class="hint">已是最后一个阶段</span>'}
        <button class="pbtn ghost" id="stageEditCur">编辑本阶段</button>
      </div>
    </div>`;
  }
  body += `<div class="group">全部阶段</div><div class="stage-plan-list">${arc.stages.map(st => stagePlanCard(st, s, { editable: true })).join('')}</div>
    <div class="stage-actions"><button class="pbtn ghost" id="storyAddStage">＋ 新增阶段</button><button class="pbtn ghost" id="storyVisibility">世界可见性</button></div>
    <div class="stage-plan-actions">
      ${on ? '<button class="pbtn ghost wide" id="storyOff">关闭剧情模式</button>' : '<button class="pbtn grad wide" id="storyOn">开启剧情模式</button>'}
      <label class="stage-auto"><input type="checkbox" id="storyAuto" ${s.story.autoAdvance === false ? '' : 'checked'}> 条件满足时弹出无剧透预览，由我确认后进入下一阶段</label>
      <label class="stage-auto"><input type="checkbox" id="storyAutoDisclose" ${s.story.autoDisclose === false ? '' : 'checked'}> 每轮自动抽取“角色第一次得知的事实”写入披露账本</label>
      <button class="pbtn ghost wide" id="storyReplan">从当前进度重规划后续</button>
      <button class="pbtn ghost wide" id="storyRegenAll">重新生成整条剧情骨架</button>
    </div>
    ${(arc.auditNotes && arc.auditNotes.length) ? `<div class="group">世界审计备注</div><div class="stage-notes">${arc.auditNotes.map(n => `<div class="stage-note">${esc(n)}</div>`).join('')}</div>` : ''}
    ${(arc.issues && arc.issues.length) ? `<div class="group">一致性校对</div><div class="stage-issues">${arc.issues.map(stageIssueRow).join('')}</div>` : ''}
    <div class="group">已揭示事实 · 披露账本</div>
    <div class="stage-facts">${disclosureRows(s)}</div>
    <div class="stage-actions"><button class="pbtn ghost" id="factAdd">补录一条事实</button></div>
    `;
  return body;
}
function pageFactAdd(s, onDone) {
  const body = `    <div class="field"><label>事实内容</label><textarea class="input" id="factText" rows="3" placeholder="如：外门每年都有人失踪"></textarea></div>
    <div class="field"><label>来源（谁说的 / 怎么知道的）</label><input class="input" id="factSource" placeholder="如：陈师兄的含糊回答"></div>
    <div class="field"><label>可信度</label><select class="input" id="factConf">
      <option value="fact">事实</option><option value="rumor">传闻（可能是错的）</option><option value="false">错误认知</option>
    </select></div>
    <div class="field"><label>知情范围（玩家 / NPC 名字，逗号分隔；留空 = 所有人）</label><input class="input" id="factScope" placeholder="player, 陈师兄"></div>
    `;
  const pg = pushPage({
    title: '补录事实', body, action: '保存', actionClass: 'grad',
    onAction: () => {
      const text = ($('#factText', pg.page).value || '').trim();
      if (!text) { toast('请填写事实内容', false); return; }
      const raw = ($('#factScope', pg.page).value || '').split(/[，,、\s]+/).map(x => x.trim()).filter(Boolean);
      const scope = raw.map(x => {
        if (x === 'player' || x === '玩家' || x === '所有人' || x === 'all') return x === '所有人' ? 'all' : (x === '玩家' ? 'player' : x);
        const n = (s.npcs || []).find(nn => nn.name === x || nn.id === x);
        return n ? n.id : x;
      });
      addDisclosureFact(s, {
        text,
        source: ($('#factSource', pg.page).value || '').trim() || '手动补录',
        confidence: $('#factConf', pg.page).value,
        scope: scope.length ? scope : ['player']
      });
      pg.close();
      toast('已写入披露账本');
      if (onDone) onDone();
    }
  });
}
function pageStory(s) {
  if (!s) return;
  const page = pushPage({ title: '剧情阶段', body: storyPanelBody(s), action: '' }).page;
  $('.pact', page).style.display = 'none';
  const body = $('.pbody', page);
  const draw = () => { body.innerHTML = storyPanelBody(s); };
  page.addEventListener('click', async e => {
    if (e.target.closest('#storyPlan') || e.target.closest('#storyRegenAll')) {
      if (e.target.closest('#storyRegenAll')) {
        openDialog({
          title: '重新生成整条剧情骨架？<br><span style="font-size:12px;color:#bdbdbd">会覆盖现有阶段规划；已揭示事实、消息与记忆不变。</span>',
          ok: '重新生成', okClass: 'danger',
          onOk: async () => {
            s.world.storyArc = normalizeStoryArc({});
            s.story = normalizeStoryState(Object.assign({}, s.story, { enabled: false, stageId: '' }), s.world);
            saveDB();
            pageStoryPlan(s, { firstRun: true });
          }
        });
      } else {
        pageStoryPlan(s, { firstRun: true });
      }
      return;
    }
    if (e.target.closest('#storyVisibility')) { pageWorldVisibility(s, draw); return; }
    if (e.target.closest('#storyAddStage')) { addBlankStage(s); draw(); return; }
    const up = e.target.closest('[data-stage-up]');
    if (up) { moveStage(s, up.dataset.stageUp, -1); draw(); return; }
    const down = e.target.closest('[data-stage-down]');
    if (down) { moveStage(s, down.dataset.stageDown, 1); draw(); return; }
    const del = e.target.closest('[data-stage-del]');
    if (del) {
      openDialog({
        title: '删除这个阶段？<br><span style="font-size:12px;color:#bdbdbd">已发生的消息与记忆不会删除；只影响后续注入。</span>',
        ok: '删除', okClass: 'danger',
        onOk: () => { deleteStage(s, del.dataset.stageDel); draw(); }
      });
      return;
    }
    if (e.target.closest('#storyOn')) {
      if (!s.world.storyArc.stages.length) { toast('还没有阶段规划', false); return; }
      s.world.storyArc.enabled = true;
      s.story = normalizeStoryState(Object.assign({}, s.story, {
        enabled: true, stageId: s.story.stageId || s.world.storyArc.stages[0].id,
        stageEnteredAt: s.instance.currentTime
      }), s.world);
      saveDB(); draw(); toast('剧情模式已开启');
      return;
    }
    if (e.target.closest('#storyOff')) {
      s.story.enabled = false;
      s.world.storyArc.enabled = false;
      saveDB(); draw(); toast('剧情模式已关闭，回到自由模式');
      return;
    }
    if (e.target.closest('#stageAdvance')) {
      const nx = nextStage(s);
      if (!nx) return;
      openDialog({
        title: `推进到「${esc(nx.name)}」？<br><span style="font-size:12px;color:#bdbdbd">推进后，上一阶段的设定不再注入；已发生的事实与记忆保留。</span>`,
        ok: '推进',
        onOk: async () => {
          if (nx.detailStatus !== 'detailed' && hasLLM('tiandao', s)) {
            try { toast('正在细化下一阶段…'); await detailStage(s, nx.id); } catch (err) { }
          }
          advanceStage(s, { to: nx.id, force: true });
          draw(); renderAll();
        }
      });
      return;
    }
    if (e.target.closest('#stageEditCur')) { pageStageEdit(s, currentStage(s).id, draw); return; }
    const ed = e.target.closest('[data-stage-edit]');
    if (ed) { pageStageEdit(s, ed.dataset.stageEdit, draw); return; }
    const dt = e.target.closest('[data-stage-detail]');
    if (dt) {
      try {
        toast('正在细化…');
        await detailStage(s, dt.dataset.stageDetail);
        saveDB(); draw(); toast('已细化');
      } catch (err) { toast('细化失败：' + err.message, false); }
      return;
    }
    if (e.target.closest('#storyReplan')) {
      openDialog({
        title: '从当前进度重规划后续阶段？<br><span style="font-size:12px;color:#bdbdbd">当前与过去阶段保留，只替换未来阶段。</span>',
        ok: '重规划',
        onOk: async () => {
          try {
            toast('正在重规划…');
            await replanFutureStages(s);
            await recheckArcConsistency(s);
            saveDB(); draw(); toast('后续阶段已重规划');
          } catch (err) { toast('重规划失败：' + err.message, false); }
        }
      });
      return;
    }
    if (e.target.closest('#factAdd')) {
      pageFactAdd(s, draw);
      return;
    }
    const fd = e.target.closest('[data-fact-del]');
    if (fd) {
      s.story.disclosure.facts = s.story.disclosure.facts.filter(f => f.id !== fd.dataset.factDel);
      saveDB(); draw();
    }
  });
  page.addEventListener('change', e => {
    if (e.target && e.target.id === 'storyAuto') {
      s.story.autoAdvance = !!e.target.checked;
      saveDB();
      toast(s.story.autoAdvance ? '条件满足时会先弹出预览' : '已关闭自动预览，可在面板手动推进');
    }
    if (e.target && e.target.id === 'storyAutoDisclose') {
      s.story.autoDisclose = !!e.target.checked;
      saveDB();
      toast(s.story.autoDisclose ? '已开启自动披露抽取' : '已关闭自动披露抽取');
    }
  });
}
function stageDeltaText(st) {
  return (st.settingDelta || []).map(d => [d.path, d.value, d.visibility].join(' | ')).join('\n');
}
function stageEventsText(st) {
  return (st.worldEvents || []).map(e => [e.title, e.when, e.trigger, e.importance, e.visibility].join(' | ')).join('\n');
}
function stagePlayerMilestonesText(st) {
  return (((st.growth || {}).player || {}).milestones || []).map(m => [m.at, m.change].join(' | ')).join('\n');
}
function stageNpcGrowthText(st) {
  const out = [];
  for (const n of ((st.growth || {}).npcs || [])) {
    if (!(n.milestones || []).length) out.push([n.name, n.role, '', ''].join(' | '));
    for (const m of n.milestones || []) out.push([n.name, n.role, m.at, m.change].join(' | '));
  }
  return out.join('\n');
}
function stageRevealsText(st) {
  return (st.reveals || []).map(r => [r.fact, r.via, r.event, (r.scope || []).join('/'), r.confidence].join(' | ')).join('\n');
}
function parsePipeLines(text) {
  return String(text || '').split('\n').map(line => line.split(/\s*[|｜]\s*/).map(x => x.trim())).filter(c => c.some(Boolean));
}
function pageStageEdit(s, stageId, onDone) {
  const st = stageById(s, stageId);
  if (!st) return;
  const exitAny = (st.exit && st.exit.any) || [];
  const days = ((exitAny.find(x => x.worldMinutes) || {}).worldMinutes || 0) / 1440;
  const evName = ((exitAny.find(x => x.event) || {}).event || '');
  const realmCond = ((exitAny.find(x => x.realm) || {}).realm || '');
  const locCond = ((exitAny.find(x => x.location) || {}).location || '');
  const manual = exitAny.some(x => x.manual);
  const body = `
    <div class="field"><label>阶段名</label><input class="input" id="stName" value="${esc(st.name)}"></div>
    <div class="field"><label>阶段摘要</label><textarea class="input" id="stSummary" rows="4">${esc(st.summary)}</textarea></div>
    <div class="field"><label>时间跨度（显示用）</label><input class="input" id="stSpan" value="${esc(st.span)}"></div>

    <div class="group">阶段设定增量</div>
    <div class="field"><label>每行：路径 | 内容 | visibility(public/stage/hidden)</label><textarea class="input" id="stDelta" rows="4" placeholder="临江镇/规矩 | 入夜后不渡江 | stage">${esc(stageDeltaText(st))}</textarea></div>

    <div class="group">本阶段世界大事</div>
    <div class="field"><label>每行：标题 | 时间 | 触发 | 重要度(1-10) | visibility</label><textarea class="input" id="stEvents" rows="4" placeholder="雾夜断牌 | 第一夜 | 玩家追问楼上客人 | 7 | stage">${esc(stageEventsText(st))}</textarea></div>

    <div class="group">成长轨迹（软规划）</div>
    <div class="field"><label>玩家起点</label><input class="input" id="stGrowthStart" value="${esc(((st.growth || {}).player || {}).start || '')}"></div>
    <div class="field"><label>玩家节点 · 每行：时间 | 变化</label><textarea class="input" id="stGrowthPlayer" rows="3">${esc(stagePlayerMilestonesText(st))}</textarea></div>
    <div class="field"><label>NPC 节点 · 每行：姓名 | 身份 | 时间 | 变化</label><textarea class="input" id="stGrowthNpc" rows="4">${esc(stageNpcGrowthText(st))}</textarea></div>

    <div class="group">认知边界</div>
    <div class="two">
      <div class="field"><label>境界 / 能力上限</label><input class="input" id="stRealm" value="${esc(st.cognition.realm)}"></div>
      <div class="field"><label>社会阶层 / 身份</label><input class="input" id="stSocial" value="${esc(st.cognition.social)}"></div>
    </div>
    <div class="field"><label>可及地理（逗号分隔）</label><input class="input" id="stGeo" value="${esc((st.cognition.geography || []).join('，'))}"></div>
    <div class="field"><label>已知势力（逗号分隔）</label><input class="input" id="stFactions" value="${esc((st.cognition.knownFactions || []).join('，'))}"></div>
    <div class="field"><label>不可理解 / 不可知道（每行一条）</label><textarea class="input" id="stForbid" rows="3">${esc((st.cognition.forbidden || []).join('\n'))}</textarea></div>
    <div class="field"><label>传闻（每行一条，可能是错的）</label><textarea class="input" id="stRumors" rows="2">${esc((st.cognition.rumors || []).join('\n'))}</textarea></div>

    <div class="group">可揭示事实（披露账本）</div>
    <div class="field"><label>每行：事实 | 来源 | 绑定事件(可空) | scope(player/NPC名，可空=player) | fact/rumor/false</label><textarea class="input" id="stReveals" rows="4">${esc(stageRevealsText(st))}</textarea></div>

    <div class="group">出场层级</div>
    <div class="field"><label>可出场层级（逗号分隔）</label><input class="input" id="stTiers" value="${esc((st.cast.allowedTiers || []).join('，'))}"></div>
    <div class="field"><label>本阶段不得直接出场（逗号分隔）</label><input class="input" id="stCastForbid" value="${esc((st.cast.forbidden || []).join('，'))}"></div>
    <div class="field"><label>临时配角上限（0 = 不额外引入）</label><input class="input" id="stMaxNpc" type="number" min="0" value="${st.cast.maxNewNPCs || 0}"></div>
    <div class="field"><label>禁忌词（逗号分隔，用于生成后剧透扫描；不会写入提示词）</label><input class="input" id="stTerms" value="${esc((st.forbiddenTerms || []).join('，'))}"></div>

    <div class="group">推进条件（满足任意一条）</div>
    <div class="two">
      <div class="field"><label>世界天数（从开局累计）</label><input class="input" id="stDays" type="number" min="0" value="${days || ''}"></div>
      <div class="field"><label>关键事件名</label><input class="input" id="stEvent" value="${esc(evName)}"></div>
    </div>
    <div class="two">
      <div class="field"><label>境界关键词</label><input class="input" id="stRealmCond" value="${esc(realmCond)}" placeholder="如 筑基"></div>
      <div class="field"><label>抵达地点关键词</label><input class="input" id="stLocCond" value="${esc(locCond)}" placeholder="如 渡口公所"></div>
    </div>
    <label class="stage-auto"><input type="checkbox" id="stManual" ${manual ? 'checked' : ''}> 允许手动推进（不依赖条件）</label>
    `;
  const pg = pushPage({
    title: '编辑阶段', body, action: '保存', actionClass: 'grad',
    onAction: () => {
      const val = id => ($(id, pg.page) ? $(id, pg.page).value : '');
      st.name = (val('#stName') || st.name).trim();
      st.summary = val('#stSummary').trim();
      st.span = val('#stSpan').trim();
      st.settingDelta = parsePipeLines(val('#stDelta')).map(c => ({
        path: c[0] || '', value: c[1] || '',
        visibility: ['public', 'stage', 'hidden'].includes(c[2]) ? c[2] : 'stage'
      })).filter(d => d.path);
      st.worldEvents = parsePipeLines(val('#stEvents')).map((c, i) => ({
        id: 'ev_' + st.id + '_' + (i + 1),
        title: c[0] || '世界事件', when: c[1] || '', trigger: c[2] || '',
        importance: Math.max(1, Math.min(10, parseInt(c[3], 10) || 6)),
        visibility: ['public', 'stage', 'hidden'].includes(c[4]) ? c[4] : 'stage'
      })).filter(e => e.title);
      const npcMap = {};
      for (const c of parsePipeLines(val('#stGrowthNpc'))) {
        if (!c[0]) continue;
        if (!npcMap[c[0]]) npcMap[c[0]] = { name: c[0], role: c[1] || '', milestones: [] };
        if (c[3]) npcMap[c[0]].milestones.push({ at: c[2] || '', change: c[3] });
      }
      st.growth = {
        player: {
          start: val('#stGrowthStart').trim(),
          milestones: parsePipeLines(val('#stGrowthPlayer')).filter(c => c[1]).map(c => ({ at: c[0] || '', change: c[1] }))
        },
        npcs: Object.keys(npcMap).map(k => npcMap[k])
      };
      st.cognition = normalizeCognition({
        realm: val('#stRealm').trim(), social: val('#stSocial').trim(),
        geography: val('#stGeo').split(/[，,、]/).map(x => x.trim()).filter(Boolean),
        knownFactions: val('#stFactions').split(/[，,、]/).map(x => x.trim()).filter(Boolean),
        forbidden: val('#stForbid').split('\n').map(x => x.trim()).filter(Boolean),
        rumors: val('#stRumors').split('\n').map(x => x.trim()).filter(Boolean)
      });
      st.reveals = parsePipeLines(val('#stReveals')).filter(c => c[0]).map((c, i) => ({
        id: 'rv_' + st.id + '_' + (i + 1),
        fact: c[0], via: c[1] || '', event: c[2] || '',
        scope: (c[3] || 'player').split(/[\/、,，]/).map(x => x.trim()).filter(Boolean),
        confidence: ['fact', 'rumor', 'false'].includes(c[4]) ? c[4] : 'fact'
      }));
      st.cast = {
        allowedTiers: val('#stTiers').split(/[，,、]/).map(x => x.trim()).filter(Boolean),
        forbidden: val('#stCastForbid').split(/[，,、]/).map(x => x.trim()).filter(Boolean),
        maxNewNPCs: Math.max(0, parseInt(val('#stMaxNpc'), 10) || 0)
      };
      st.forbiddenTerms = val('#stTerms').split(/[，,、]/).map(x => x.trim()).filter(Boolean);
      const any = [];
      const dayN = Number(val('#stDays'));
      if (dayN > 0) any.push({ worldMinutes: Math.round(dayN * 1440) });
      const ev = val('#stEvent').trim(); if (ev) any.push({ event: ev });
      const rc = val('#stRealmCond').trim(); if (rc) any.push({ realm: rc });
      const lc = val('#stLocCond').trim(); if (lc) any.push({ location: lc });
      if ($('#stManual', pg.page) && $('#stManual', pg.page).checked) any.push({ manual: true });
      st.exit = { any };
      s.world.storyArc = normalizeStoryArc(s.world.storyArc);
      saveDB();
      toast('阶段已保存');
      pg.close();
      if (onDone) onDone();
    }
  });
}
function resetInstance(s) {
  if (!s) return;
  if (generating) { toast('正在生成，稍后再试', false); return; }
  openDialog({
    title: '重置当前实例？<br><span style="font-size:12px;color:#bdbdbd">会清空消息、L1–L3 记忆与事件簿；保留实例名、世界设定、角色档案（含演化历史）与模型配置。玩家与 NPC 的位置、情绪、健康会恢复到本局开始时的状态；剧情模式会回到第一阶段并清空披露账本。时间线回到起始时间并停止。</span>',
    ok: '重置', okClass: 'danger',
    onOk: () => {
      const start = s.world.startTime || s.instance.startTime || s.instance.currentTime;
      // 基线必须在清空记忆前取：旧存档没有 seed 时要用最早记忆推断初始位置。
      s.seed = makeStorySeed(s.world, s.player, s.npcs, s.memories, s.seed);
      const seed = s.seed;
      s.messages = [];
      s.memories = [];
      s.bookmarks = [];
      s.events = [];
      s.working = { l1: [] };
      s.instance.currentTime = start;
      s.instance.startTime = start;
      syncCharacterAges(s);
      s.instance.timeStatus = 'stopped';
      s.instance.timeSpeed = 1;
      s.instance.lastActiveTime = start;
      s.instance.lastTick = nowTs();
      s.instance._pendingAuto = 0;
      s.instance._eventClock = 0;
      s.instance._timeCarry = 0;
      delete s.instance._filling;
      delete s.instance._timeWarned;
      const restoreChar = (c, loc, key) => {
        if (!c) return;
        if (loc) c.currentLocation = loc;
        const base = seed.chars && seed.chars[key];
        c.emotion = (base && base.emotion) || '平静';
        c.health = (base && base.health) || '良好';
        delete c.lastEvalAt;
      };
      restoreChar(s.player, seed.playerLocation, 'player');
      s.npcs.forEach(n => restoreChar(n, (seed.npcLocations || {})[n.id], n.id));
      // 剧情模式：回到第一阶段，清空披露账本；阶段规划与世界设定保留。
      if (s.world && s.world.storyArc && s.world.storyArc.stages.length) {
        s.story = normalizeStoryState({
          enabled: storyModeOn(s),
          arcVersion: s.world.storyArc.version,
          stageId: s.world.storyArc.stages[0].id,
          stageEnteredAt: start,
          stageHistory: [{ stageId: s.world.storyArc.stages[0].id, from: start, to: '' }],
          disclosure: { facts: [] }
        }, s.world);
      }
      s.updatedAt = nowTs();
      saveDB(); renderAll(); closeDrawer('left');
      toast('实例已重置，点「让天道写下开场」或启动时间线重新开始');
    }
  });
}

function instanceMenu(id) {
  const s = storyById(id); if (!s) return;
  openSheet({
    title: '', items: [
      { label: s.id === DB.activeId ? '当前实例' : '切换到该实例', onClick: () => { DB.activeId = id; saveDB(); closeTop(); closeDrawer('left'); renderAll(); } },
      { label: '修改实例名', onClick: () => { closeTop(); renameInstance(id); } },
      {
        label: s.instance.timeStatus === 'running' ? '暂停时间线' : '启动时间线', onClick: () => {
          s.instance.timeStatus = s.instance.timeStatus === 'running' ? 'paused' : 'running';
          s.instance.lastTick = nowTs(); saveDB(); closeTop(); renderAll(); toast(s.instance.timeStatus === 'running' ? '时间线已启动' : '时间线已暂停');
        }
      },
      { label: '导出世界卡', onClick: () => { closeTop(); DB.activeId = id; saveDB(); renderAll(); pageExportCard(s); } },
      { label: '导出存档', onClick: () => { closeTop(); DB.activeId = id; saveDB(); renderAll(); pageExport(s); } },
      {
        label: '删除实例', danger: true, onClick: () => {
          closeTop();
          openDialog({
            title: `删除「${esc(s.instanceName)}」？<br><span style="font-size:12px;color:#bdbdbd">角色记忆、事件簿与互动记录会全部清除，不可恢复。世界卡与其它实例不受影响。</span>`,
            ok: '删除', okClass: 'danger', onOk: () => {
              deleteStoryById(id);
              renderAll(); toast('实例已删除，世界卡保留');
            }
          });
        }
      }
    ]
  });
}
function renameInstance(id) {
  const s = storyById(id); if (!s) return;
  const prefix = (s.world.name || '世界') + '-';
  const suffix = String(s.instanceName || '').startsWith(prefix) ? s.instanceName.slice(prefix.length) : s.instanceName;
  openSheet({
    title: '修改实例名',
    html: `<div class="field"><label>实例名称</label><div class="inst-name"><span>${esc(prefix)}</span><input class="input" id="newSuffix" value="${esc(suffix)}" placeholder="自定义后缀"></div></div>
      <button class="pbtn" id="okRename">保存</button>`,
    onMount: (wrap, close) => {
      $('#okRename', wrap).onclick = () => {
        const v = $('#newSuffix', wrap).value.trim();
        s.instanceName = prefix + (v || '新旅程');
        saveDB(); renderAll(); close(); toast('实例名已更新');
      };
    }
  });
}
function messageMenu(id) {
  const s = activeStory(); if (!s) return;
  const m = s.messages.find(x => x.id === id); if (!m) return;
  const items = [{ label: '复制这段文字', onClick: () => { closeTop(); copyText(m.text); } }];
  if (m.role === 'user') items.push({ label: '编辑这条行动', onClick: () => { closeTop(); editMessage(id); } });
  if (m.role === 'assistant' || m.role === 'npc') items.push({ label: '重写这一段', onClick: () => { closeTop(); refreshLast(); } });
  items.push({ label: '从这里删除到结尾', danger: true, onClick: () => { closeTop(); deleteFrom(id); } });
  openSheet({ title: '', items });
}
function copyText(t) {
  if (navigator.clipboard) navigator.clipboard.writeText(t || '').then(() => toast('已复制')).catch(() => toast('复制失败', false));
  else toast('当前环境不支持复制', false);
}
function editMessage(id) {
  const s = activeStory(); const m = s && s.messages.find(x => x.id === id); if (!m) return;
  openSheet({
    title: '编辑行动', html: `<div class="field"><textarea class="input" id="editText" rows="4">${esc(m.text)}</textarea></div><button class="pbtn" id="okEdit">保存</button>`,
    onMount: (wrap, close) => {
      $('#okEdit', wrap).onclick = () => {
        const v = $('#editText', wrap).value.trim();
        if (v) m.text = v;
        saveDB(); renderMessages(); close();
      };
    }
  });
}
function deleteFrom(id) {
  const s = activeStory(); if (!s) return;
  const i = s.messages.findIndex(m => m.id === id); if (i < 0) return;
  openDialog({
    title: '删除这条及其之后的内容？<br><span style="font-size:12px;color:#bdbdbd">对应记忆与事件也会移除，只影响本机存档。</span>',
    ok: '删除', okClass: 'danger', onOk: () => {
      const rounds = new Set(s.messages.slice(i).map(m => m.roundId).filter(Boolean));
      purgeRoundData(s, rounds);
      s.messages = s.messages.slice(0, i);
      saveDB(); renderAll(); toast('已删除');
    }
  });
}

/* ---------------- 事件绑定 ---------------- */
function bindUI() {
  $('#btnLeft').onclick = () => openDrawer('left');
  $('#btnRight').onclick = () => openDrawer('right');
  $('#scrim').onclick = () => closeDrawer();
  $('#btnSend').onclick = () => { if (generating) stopGeneration(); else submitInput(); };
  $('#btnPlus').onclick = () => openSheet({
    title: '快捷操作', items: [
      { label: '继续剧情', onClick: () => { closeTop(); continueStory(); } },
      { label: '刷新上一段', onClick: () => { closeTop(); refreshLast(); } },
      { label: '撤回上一次行动', onClick: () => { closeTop(); undoLast(); } },
      { sep: '场景' },
      { label: '打开世界状态', onClick: () => { closeTop(); openDrawer('left'); } },
      { label: '打开事件簿 / 记忆', onClick: () => { closeTop(); DB.ui.rightTab = 'events'; openDrawer('right'); } }
    ]
  });
  const input = $('#input');
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submitInput(); }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(112, input.scrollHeight) + 'px';
  });
  $('#quickRow').addEventListener('click', e => {
    const b = e.target.closest('button[data-quick]'); if (!b) return;
    if (b.dataset.quick === 'undo') undoLast();
    else if (b.dataset.quick === 'refresh') refreshLast();
    else if (b.dataset.quick === 'continue') continueStory();
  });
  $('#scrollBottom').onclick = scrollToBottom;
  $('#msgList').addEventListener('scroll', () => {
    const el = $('#msgList');
    $('#scrollBottom').classList.toggle('show', el.scrollHeight - el.scrollTop - el.clientHeight > 420);
  });

  $('#app').addEventListener('click', e => {
    // 抽屉里的按钮可能在处理过程中重绘，closest('#lScroll') 会失效；
    // 用事件派发时固定的 composedPath 判断来源，避免同一个动作被执行两次。
    const path = e.composedPath ? e.composedPath() : [];
    const inPanel = path.some(n => n && (n.id === 'lScroll' || n.id === 'rScroll' || n.id === 'storyList'));
    const actEl = e.target.closest('[data-act]');
    if (actEl && !inPanel) {
      const act = actEl.dataset.act;
      if (handleAct(act, actEl)) { e.preventDefault(); return; }
    }
    const inDrawer = path.some(n => n && n.classList && (n.classList.contains('drawer') || n.classList.contains('overlay')));
    if (e.target.closest('.composer') || e.target.closest('.topbar') || inDrawer ||
      e.target.closest('.scroll-bottom')) return;
    if (!overlayStack.length && e.clientY > 0 && e.clientY < 96) showHeader();
  });
  $('#msgList').addEventListener('click', e => {
    if (e.target.closest('.abtn')) return;
    const bubble = e.target.closest('.msg');
    if (bubble && bubble.dataset.lp === '1') { bubble.dataset.lp = ''; return; }
    if ($('#topbar').classList.contains('show')) hideHeader();
  });
  // 长按消息 → 操作菜单（点击只用于收起顶栏）
  let lpTimer = null, lpEl = null, lpX = 0, lpY = 0;
  const lpCancel = () => { if (lpTimer) clearTimeout(lpTimer); lpTimer = null; lpEl = null; };
  $('#msgList').addEventListener('pointerdown', e => {
    const bubble = e.target.closest('.msg');
    if (!bubble || e.target.closest('.abtn')) return;
    lpCancel();
    lpEl = bubble; lpX = e.clientX; lpY = e.clientY;
    bubble.dataset.lp = '';
    lpTimer = setTimeout(() => {
      lpTimer = null;
      if (lpEl !== bubble || overlayStack.length) return;
      bubble.dataset.lp = '1';
      try { if (navigator.vibrate) navigator.vibrate(10); } catch (err) { }
      messageMenu(bubble.dataset.id);
    }, 460);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => $('#msgList').addEventListener(t, lpCancel));
  $('#msgList').addEventListener('pointermove', e => {
    if (!lpTimer) return;
    if (Math.abs(e.clientX - lpX) > 9 || Math.abs(e.clientY - lpY) > 9) lpCancel();
  });
  $('#msgList').addEventListener('contextmenu', e => { if (e.target.closest('.msg')) e.preventDefault(); });
  $('#lScroll').addEventListener('click', e => {
    const s = activeStory();
    const a = e.target.closest('[data-act]');
    if (a && handleAct(a.dataset.act, a)) return;
    const more = e.target.closest('[data-more]');
    if (more) { instanceMenu(more.dataset.more); return; }
    const nc = e.target.closest('[data-npc]');
    if (nc) {
      if (!s) return;
      const npc = s.npcs.find(x => x.id === nc.dataset.npc);
      if (npc) { pageNPCEdit(s, npc); return; }
    }
    const st = e.target.closest('.story');
    if (st && st.dataset.sid) {
      DB.activeId = st.dataset.sid;
      st.dataset.sid = DB.activeId;
      saveDB(); renderAll(); closeDrawer('left'); setTimeout(() => showHeader(), 80);
    }
  });
  $('#rScroll').addEventListener('click', e => {
    const s = activeStory();
    const tab = e.target.closest('[data-tab]:not([data-act])');
    if (tab && tab.parentElement.classList.contains('cfg-tabs')) {
      DB.ui.rightTab = tab.dataset.tab; saveDB(); renderRight(); return;
    }
    if (!s) return;
    const mem = e.target.closest('[data-mem]');
    if (mem) { pageMemoryEdit(s, mem.dataset.mem); return; }
    const bm = e.target.closest('[data-bm]');
    if (bm) { pageBookmarkEdit(s, bm.dataset.bm); return; }
    const ev = e.target.closest('[data-ev]');
    if (ev) { pageEventEdit(s, ev.dataset.ev); return; }
    const a = e.target.closest('[data-act]');
    if (a) handleAct(a.dataset.act, a);
  });
  $('#rScroll').addEventListener('input', e => {
    if (e.target.id !== 'memSearch') return;
    const q = e.target.value.trim().toLowerCase();
    DB.ui.memQuery = e.target.value;
    $$('#rScroll .mem-card, #rScroll .ev-card', document).forEach(card => {
      const t = card.dataset.text || '';
      card.classList.toggle('hide', !!q && !t.includes(q));
    });
  });
  $('#lScroll').addEventListener('input', e => {
    if (e.target.id === 'speedCustom') {
      const v = Math.max(1, Math.min(1440, parseInt(e.target.value, 10) || 0));
      const s = activeStory(); if (!s) return;
      s.instance.timeSpeed = v; s.instance.lastTick = nowTs(); saveDB(); renderHeader();
    }
  });
  $('#lScroll').addEventListener('keydown', e => {
    if (e.target.id === 'jumpInput' && e.key === 'Enter') {
      const v = e.target.value.trim(); if (v) jumpTime(v);
    }
  });
  $('#lScroll').addEventListener('click', e => {
    const q = e.target.closest('[data-jump-add]');
    if (!q) return;
    const st = activeStory(); if (!st) return;
    const add = parseInt(q.dataset.jumpAdd, 10) || 0;
    const target = advanceWorldTime(st.instance.currentTime, add);
    const inp = $('#jumpInput');
    if (inp) { inp.value = target; updateJumpPreview(); }
    e.stopPropagation();
  });
  $('#lScroll').addEventListener('input', e => {
    if (e.target.id === 'jumpInput') updateJumpPreview();
  });
  window.addEventListener('resize', updateSafeArea);
  if (window.visualViewport) { window.visualViewport.addEventListener('resize', updateSafeArea); window.visualViewport.addEventListener('scroll', updateSafeArea); }
  const inp0 = $('#input'); if (inp0) inp0.addEventListener('focus', () => setTimeout(scrollToBottom, 280));
  document.addEventListener('visibilitychange', () => {
    const s = activeStory();
    if (document.hidden) {
      if (s) {
        if (hasOwnLLM('memory', s)) refreshBookmarksLLM(s).catch(() => { });
        else consolidateLocal(s, true);
        saveNow();
      }
    }
    else if (s) {
      // 回到前台：不重置 lastTick，让 tick 把离开期间的现实时间按流速补进世界时间；
      // 跨越 1 世界天以上时由 offlineFill 生成空隙记忆。
      tick();
      if (!generating) renderAll();
    }
  });
  setInterval(() => { const s = activeStory(); if (s && s.instance.timeStatus === 'running' && !generating) renderHeader(); }, 15000);
}
function submitInput() {
  const s = activeStory();
  if (!s) { openWizard(); return; }
  const input = $('#input');
  const v = input.value.trim();
  if (!v) return;
  if (generating) return;
  if (!canInteract(s)) return;
  input.value = '';
  input.style.height = 'auto';
  sendAction(v);
}
function handleAct(act, el) {
  const s = activeStory();
  if (!act) return false;
  if (act === 'new-story') { openWizard(); return true; }
  if (act === 'cards') { pageCards(); return true; }
  if (act === 'apis') { pageAPIs(); return true; }
  if (act === 'opening') { if (s) generateOpening(s); return true; }
  if (!s) return false;
  if (act === 'copy') { const m = s.messages.find(x => x.id === el.dataset.id); copyText(m && m.text); return true; }
  if (act === 'edit') { editMessage(el.dataset.id); return true; }
  if (act === 'regen') { refreshLast(); return true; }
  if (act === 'del') { deleteFrom(el.dataset.id); return true; }
  if (act === 'tl:reset') { resetInstance(s); return true; }
  if (act === 'tl:start') { s.instance.timeStatus = 'running'; s.instance.lastTick = nowTs(); saveDB(); renderAll(); toast('时间线已启动'); return true; }
  if (act === 'tl:pause') { s.instance.timeStatus = 'paused'; saveDB(); renderAll(); toast('时间线已暂停'); return true; }
  if (act === 'tl:stop') {
    openDialog({
      title: '停止该实例的时间线？<br><span style="font-size:12px;color:#bdbdbd">停止后世界归档，所有 Agent 不再运转。</span>',
      ok: '停止', okClass: 'danger', onOk: () => { s.instance.timeStatus = 'stopped'; saveDB(); renderAll(); toast('时间线已停止'); }
    }); return true;
  }
  if (act === 'tl:jump') {
    DB.ui.jumpOpen = !DB.ui.jumpOpen; saveDB(); renderLeft();
    if (DB.ui.jumpOpen) setTimeout(() => { const inp = $('#jumpInput'); if (inp) inp.focus(); }, 60);
    return true;
  }
  if (act === 'tl:jump-go') {
    const v = ($('#jumpInput') && $('#jumpInput').value.trim()) || '';
    if (!v) { toast('请输入目标时间', false); return true; }
    jumpTime(v); return true;
  }
  if (act === 'tl:speed') {
    const n = Math.max(1, parseInt(el.dataset.speed, 10) || 1);
    s.instance.timeSpeed = n; s.instance.lastTick = nowTs(); saveDB(); renderAll(); toast(`流速：${n}×`); return true;
  }
  if (act === 'world') { pageWorld(s); return true; }
  if (act === 'story') { pageStory(s); return true; }
  if (act === 'timecfg') { pageTime(s); return true; }
  if (act === 'player') { pagePlayer(s); return true; }
  if (act === 'npcs') { pageNPCs(s); return true; }
  if (act === 'theme') { pageAppearance(s); return true; }
  if (act === 'bg') { pageAppearance(s); return true; }
  if (act === 'rename') { renameInstance(s.id); return true; }
  if (act === 'exportCard') { pageExportCard(s); return true; }
  if (act === 'importCard') { pageImportCard(); return true; }
  if (act === 'export') { pageExport(s); return true; }
  if (act === 'import') { pageImport(); return true; }
  if (act === 'delete') {
    openDialog({
      title: `删除「${esc(s.instanceName)}」？<br><span style="font-size:12px;color:#bdbdbd">角色记忆、事件簿与互动记录会全部清除。世界卡与其它实例不受影响。</span>`,
      ok: '删除', okClass: 'danger', onOk: () => {
        deleteStoryById(s.id);
        renderAll(); closeDrawer('right'); toast('实例已删除，世界卡保留');
      }
    }); return true;
  }
  if (act === 'about') { pageAbout(); return true; }
  if (act.startsWith('llm:')) { pageLLM(act.slice(4)); return true; }
  if (act.startsWith('mem:')) {
    const sub = act.slice(4);
    if (sub === 'consolidate') { refreshBookmarksLLM(s); return true; }
    if (sub === 'char') { DB.ui.memChar = el.dataset.char; saveDB(); renderRight(); return true; }
    if (sub === 'tab') { DB.ui.memTab = el.dataset.tab; saveDB(); renderRight(); return true; }
  }
  return false;
}

function fmtDuration(mins) {
  const m = Math.max(0, Math.round(mins || 0));
  if (!m) return '0 分钟';
  const d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mm = m % 60;
  return [d ? d + ' 天' : '', h ? h + ' 小时' : '', (!d && mm) ? mm + ' 分钟' : ''].filter(Boolean).join(' ') || '不足 1 分钟';
}
function updateJumpPreview() {
  const el = $('#jumpPreview'); if (!el) return;
  const s = activeStory(); if (!s) return;
  const raw = ($('#jumpInput') && $('#jumpInput').value.trim()) || '';
  if (!raw) { el.textContent = '输入目标时间后显示预览'; el.classList.remove('bad'); return; }
  const target = guessDateTime(raw, s.instance.currentTime);
  if (!target) { el.textContent = '无法识别，请写成「贞观三年三月初五」或「2026-11-20 08:00」'; el.classList.add('bad'); return; }
  const mins = worldMinutesBetween(s.instance.currentTime, target);
  if (mins <= 0) { el.textContent = '只能前往未来'; el.classList.add('bad'); return; }
  el.classList.remove('bad');
  el.innerHTML = `目标 <b>${esc(target)}</b> · 相隔 ${esc(fmtDuration(mins))}`;
}

/* ---------------- 安全区 / 启动 ---------------- */
function updateSafeArea() {
  const vv = window.visualViewport;
  const h = window.innerHeight;
  const w = window.innerWidth;
  if (!window.__maxH || h > window.__maxH || Math.abs((window.__maxW || w) - w) > 60) {
    window.__maxH = h;
    window.__maxW = w;
  }
  const bottom = vv ? Math.max(0, h - vv.height - vv.offsetTop) : 0;
  const kb = bottom > 80 || h < window.__maxH - 80;
  document.documentElement.style.setProperty('--kb', kb ? Math.max(bottom, window.__maxH - h) + 'px' : '0px');
  document.body.classList.toggle('kb', kb);
  if (kb) setTimeout(scrollToBottom, 120);
}
function encryptStoredSecrets() {
  if (!window.AndroidSecure) return false;
  let changed = false;
  const convKey = obj => {
    if (!obj || !obj.apiKey) return;
    if (!String(obj.apiKey).startsWith('enc:')) { obj.apiKey = secEnc(obj.apiKey); changed = true; }
  };
  const convLegacy = obj => {
    if (!obj) return;
    for (const k of ['tiandao', 'character', 'memory']) convKey(obj[k]);
  };
  llmApis().forEach(convKey);
  DB.stories.forEach(s => convLegacy(s.llm));
  if (changed) saveNow();
  return changed;
}
function privacyAccepted() {
  try { return localStorage.getItem(PRIVACY_KEY) === '1'; } catch (e) { return false; }
}
function showPrivacyGate() {
  const old = document.getElementById('privacyGate');
  if (old) old.remove();
  const el = document.createElement('div');
  el.id = 'privacyGate';
  el.className = 'privacy-gate';
  el.innerHTML = `
    <div class="privacy-card">
      <img class="privacy-logo" src="logo.png" alt="">
      <h2>使用前请了解</h2>
      <p class="privacy-lead">启源是单机互动叙事应用。你的世界、对话、角色与记忆只保存在这台设备上。</p>
      <ul class="privacy-list">
        <li>只有你主动使用 AI 生成时，应用才会把必要的叙事上下文发送给你自己配置的第三方模型接口；不经过开发者服务器。</li>
        <li>API Key 仅保存在本机系统加密存储中，不导出、不上传。</li>
        <li>应用内叙事由 AI 生成，内容为虚构，仅供娱乐。</li>
      </ul>
      <button class="privacy-link" id="privacyRead">阅读完整《隐私政策》</button>
      <div class="privacy-actions">
        <button class="pbtn ghost" id="privacyNo">不同意</button>
        <button class="pbtn grad" id="privacyYes">同意并继续</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  $('#privacyRead', el).onclick = () => { location.href = 'privacy.html'; };
  $('#privacyYes', el).onclick = () => {
    try { localStorage.setItem(PRIVACY_KEY, '1'); } catch (e) { }
    location.reload();
  };
  $('#privacyNo', el).onclick = () => {
    if (window.AndroidSecure && AndroidSecure.exitApp) { AndroidSecure.exitApp(); return; }
    el.classList.add('denied');
    const b = $('#privacyNo', el);
    if (b) b.textContent = '需要同意后才能使用';
  };
}
function boot() {
  applyTheme(DB.config.theme, true);
  if (!privacyAccepted()) {
    if (window.__splashHide) setTimeout(() => { try { window.__splashHide(); } catch (e) { } }, 1200);
    showPrivacyGate();
    return;
  }
  encryptStoredSecrets();
  applyBg();
  syncCharacterAges(activeStory());
  renderAll();
  const splashStart = window.__splashAt || performance.now();
  const finishSplash = () => {
    const left = Math.max(0, 1900 - (performance.now() - splashStart));
    setTimeout(() => { if (window.__splashHide) window.__splashHide(); }, left);
  };
  setTimeout(finishSplash, 2500);
  hydrateMedia().then(() => { migrateCards(); renderAll(); finishSplash(); }).catch(() => finishSplash());
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { }
  bindUI();
  startTick();
  showHeader();
  setTimeout(hideHeader, 2200);
  updateSafeArea();
  if (!DB.stories.length) setTimeout(() => {
    if (DB.stories.length) return;
    if ((DB.cards || []).length) pageCards();
    else openWizard();
  }, 550);
  // 启动时补一次离线跨度
  const s = activeStory();
  if (s) {
    s.instance.lastTick = nowTs();
    setTimeout(() => { offlineFill(s).catch(() => { }); }, 800);
  }
  console.log('启源 v' + APP_VERSION + ' ready');
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
