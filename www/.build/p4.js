
/* ============================================================
   四、Agent 管线 · 时间线 · 自主行为 · 记忆巩固
   ============================================================ */
const MAX_SCENE_REACTIONS = 6;
let generating = false;
let currentAbort = null;

/* 位置块是机器元数据：解析要宽容，输出要彻底清洗。
   注意：正则全部写成字面量，避免在 loadDB() 阶段引用尚未初始化的 const。 */
function stripMetaBlocks(text) {
  let t = String(text == null ? '' : text);
  if (!t) return t;
  t = t.replace(/[<＜《]{2,4}\s*LOCATION\s*[>＞》]{2,4}[\s\S]*?[<＜《]{2,4}\s*END\s*[>＞》]{2,4}/gi, '');
  if (/[<＜《]{2,4}\s*LOCATION\s*[>＞》]{2,4}/i.test(t)) {
    const out = [];
    let meta = false;
    for (const line of t.split('\n')) {
      if (/[<＜《]{2,4}\s*LOCATION\s*[>＞》]{2,4}/i.test(line)) {
        meta = true;
        const rest = line
          .replace(/[<＜《]{2,4}\s*LOCATION\s*[>＞》]{2,4}/gi, '')
          .replace(/[<＜《]{2,4}\s*END\s*[>＞》]{2,4}/gi, '');
        if (rest.trim() && !/moved|location|位置|移动/i.test(rest)) out.push(rest.trim());
        continue;
      }
      if (meta) {
        if (/moved\s*[:：]|location\s*[:：]|^\s*(位置|是否移动)\s*[:：]/i.test(line)) continue;
        if (!line.trim()) { meta = false; continue; }
        meta = false;
      }
      out.push(line);
    }
    t = out.join('\n');
  }
  t = t.replace(/[<＜《]{2,4}\s*(?:LOCATION|END)\s*[>＞》]{2,4}/gi, '');
  t = t.replace(/[<＜《]{1,4}\s*(?:L|LO|LOC|LOCA|LOCAT|LOCATI|LOCATIO)\s*[>＞》]{0,4}$/i, '');
  return t.replace(/\n{3,}/g, '\n\n').trim();
}
function maskStream(text) { return stripMetaBlocks(text); }

function parseLocationBlock(text) {
  const raw = String(text == null ? '' : text);
  let body = '';
  const at = raw.search(/[<＜《]{2,4}\s*LOCATION\s*[>＞》]{2,4}/i);
  if (at >= 0) {
    const rest = raw.slice(at).replace(/[<＜《]{2,4}\s*LOCATION\s*[>＞》]{2,4}/i, '');
    const tail = rest.search(/[<＜《]{2,4}\s*END\s*[>＞》]{2,4}/i);
    body = tail >= 0 ? rest.slice(0, tail) : rest.split('\n').slice(0, 8).join('\n');
  } else {
    const tail = raw.slice(-500);
    if (/moved\s*[:：]/i.test(tail) && /location\s*[:：]/i.test(tail)) body = tail;
    else return { text: stripMetaBlocks(raw), moved: false, location: '', found: false };
  }
  const moved = /"moved"\s*:\s*true/i.test(body) || /moved\s*[:：]\s*["“]?(true|是|1|yes)/i.test(body);
  let loc = '';
  let m = body.match(/"location"\s*:\s*["“]([^"”\n]*)["”]/i) || body.match(/"location"\s*:\s*([^,}\n]+)/i);
  if (m) loc = m[1];
  if (!loc) { m = body.match(/location\s*[:：]\s*["“]([^"”\n]*)["”]/i); if (m) loc = m[1]; }
  if (!loc) { m = body.match(/location\s*[:：]\s*([^\n；;]+)/i); if (m) loc = m[1]; }
  loc = String(loc || '').replace(/^[\s"'“”「」]+|[\s"'“”「」]+$/g, '');
  if (/[➡→]|->|=>/.test(loc)) loc = loc.split(/[➡→]|->|=>/).pop();
  loc = normalizeLocation(loc);
  return { text: stripMetaBlocks(raw), moved, location: loc, found: true };
}
/* ---------------- 位置校正 / 世界治理 ---------------- */
const LOC_ANCHORS = /(域|州|府|郡|县|城|镇|村|街|巷|路|山|岭|谷|河|江|湖|海|岛|港|渡|关|寺|观|宫|殿|楼|堂|院|房|屋|店|铺|栈|驿|寨|庄|营|舱|站|区|层|间|门|桥|塔|井|场|馆|室|廊|庭|园|京|都|邑|堡|屯|集|镇)/g;
function normalizeLocation(loc) {
  return String(loc == null ? '' : loc)
    .replace(/[\uFE0F\u200D\u20E3]/g, '')
    .replace(/[➡→]|->|=>/g, '/')
    .replace(/\s+/g, ' ')
    .replace(/^[\s，。；;：:\-\/]+|[\s，。；;：:\-\/]+$/g, '')
    .slice(0, 80);
}
function locationIncomplete(s, loc) {
  const t = normalizeLocation(loc);
  if (!t || isPlaceholderLocation(s, t)) return true;
  if (t.length < 2) return true;
  if (/^(这里|那里|附近|外面|里面|远处|某处|原地|屋内|门外|楼上|楼下)$/.test(t)) return true;
  // 只有楼层/房间、没有场所名的短地址视为不完整（如「二楼」「三楼走廊」）
  if (/^([一二三四五六七八九十百\d]+)(楼|层)(走廊)?(东|西|南|北|头)?$/.test(t)) return true;
  return false;
}
async function completeLocation(s, loc, hint, baseLoc) {
  if (!hasLLM('tiandao', s)) return '';
  try {
    const res = await llmChat([
      { role: 'system', content: `你是天道系统的位置校正器。把给出的地点补全为符合「${locationSchema(s)}」的完整地理层级，只输出 JSON：{"location":"完整地点"}` },
      { role: 'user', content: `世界：${s.world.name}\n当前时间：${s.instance.currentTime}\n角色当前位置：${baseLoc || s.player.currentLocation || '未知'}\n待补全地点：${loc}\n上下文：${clampText(hint || '', 300)}` }
    ], { kind: 'tiandao', story: s, maxTokens: 120, temperature: 0.2, stream: false });
    const j = extractJSON(res.text);
    const out = normalizeLocation(j && j.location);
    return locationIncomplete(s, out) ? '' : out;
  } catch (e) { return ''; }
}
async function resolveLocation(s, loc, hint, allowComplete, baseLoc) {
  const t = normalizeLocation(loc);
  if (!t || isPlaceholderLocation(s, t)) return '';
  if (!locationIncomplete(s, t)) return t;
  if (allowComplete) {
    const c = await completeLocation(s, t, hint, baseLoc);
    if (c) return c;
  }
  return '';
}

/* ---------------- 行动里的移动意图 ---------------- */
const MOVE_VERB = /(去|到|往|走向|走进|进入|回到|返回|离开|出门|上楼|下楼|赶到|赶来|直奔|前往|抵达|到达|踏进|步入|穿过|进城|回城|来到|钻进|爬上|走下)/;
const PLACE_HINT = /(城|镇|村|店|楼|院|堂|馆|铺|栈|驿|街|巷|路|山|河|江|湖|海|府|宫|寺|观|关|渡|港|门|房|屋|厅|间|室|庭|园|寨|营|林|洞|塔|桥|码头|集市|客栈)/;
function looksLikeMove(text) { return MOVE_VERB.test(String(text || '')); }
function hasPlaceHint(text) { return PLACE_HINT.test(String(text || '')); }

/* 用一次极小的调用把“我要去某处”解析成完整地点，先于人设与叙事执行 */
async function inferMove(s, hint, actionText) {
  if (!hasLLM('tiandao', s)) return '';
  try {
    const res = await llmChat([
      { role: 'system', content: `你是行动解析器。判断玩家这一句是否让角色真的离开当前位置，并给出最终所在地点。只输出 JSON：{"moved":true|false,"location":"完整地理层级"}。以下情况 moved 必须为 false：只是想法、回忆、比喻（如“想到城里”）、原地转身、看向某处、询问方位、打算但还没动身；**谈论、询问或转述第三人（NPC）的去向**（如“我记得A今天去了南京”“A是不是去了南京”）也一律为 false，除非玩家本人同时明确表示要动身。不确定去哪时不要移动。地点层级：${locationSchema(s)}` },
      { role: 'user', content: `世界：${s.world.name}\n当前位置：${s.player.currentLocation || '未知'}\n世界时间：${s.instance.currentTime}\n玩家行动：「${actionText}」${hint ? `\n本回合叙事：${clampText(hint, 400)}` : ''}` }
    ], { kind: 'tiandao', story: s, maxTokens: 120, temperature: 0.15, stream: false });
    const j = extractJSON(res.text) || {};
    if (!j.moved) return '';
    const loc = normalizeLocation(String(j.location || '').split(/[➡→]|->/).pop());
    if (!loc || isPlaceholderLocation(s, loc) || locationIncomplete(s, loc)) return '';
    return loc === s.player.currentLocation ? '' : loc;
  } catch (e) { return ''; }
}

/* 玩家只是在回忆 / 询问 / 转述第三人的去向时，不能据此移动玩家或 NPC。 */
function isLocationClaim(s, text) {
  const t = String(text || '');
  // 玩家本人明确动身时优先算移动：即使句尾在提问、句中出现 NPC 名字，也不当作“关于他人的位置陈述”。
  const selfMove = /我(?:们)?(?!\s*(?:记得|想起|听说|据说|回忆|印象中|好像|似乎))[^。；！？]{0,12}(?:去|到|往|回|走|进|离开|出门|前往|赶|动身|出发|上楼|下楼|踏上|走进|走向)/
    .test(t)
    || /(?:^|[，,。；;])\s*(?:往|朝|向)[^，。；！？]{0,10}(?:走|去|行|迈|踏|上|下)/.test(t)
    || /(?:上楼|下楼|走进|踏入|动身|出发|起身离开)/.test(t);
  if (selfMove) return false;
  const claim = /(记得|想起|听说|据说|回忆|印象中|是不是|在哪|去了哪|去过哪)/.test(t)
    || (/[？?]\s*$/.test(t) || /(吗|呢)\s*[。！!]?\s*$/.test(t)) && (s.npcs || []).some(n => n.name && t.includes(n.name));
  return claim;
}
/** NPC 是否在自己的动作里真的离开了原处；只靠玩家话术带出的位置一律丢弃。 */
const NPC_MOVE_IN_ACTION = /(起身|离开|走出|走到|出了|回到|返回|退开|转身|动身|赶去|赶往|奔向|跑|上楼|下楼|进门|出门|跨过|穿过|钻进|跃|翻|踏出|踏进|推门|朝.{0,6}(?:走|去|奔))/;
function sanitizeReactionLocation(s, npc, r, actionText) {
  if (!r) return false;
  if (!r.location) { r.moved = false; return false; }
  if (!r.moved) { r.location = ''; return false; }
  // 反应里没有任何离开/移动动作，却给出新位置：判定为被玩家的话带偏，保留原位。
  if (!NPC_MOVE_IN_ACTION.test(String(r.action || ''))) {
    if (dbgEnabled()) {
      dbgLog({
        type: 'loc_guard', storyId: s.id, npc: npc && npc.name,
        from: npc && npc.currentLocation, rejected: r.location, action: dbgRedact(actionText, 120)
      });
    }
    r.location = '';
    r.moved = false;
    return true;
  }
  // 位置来自玩家话术、而 NPC 自己的动作没有提到该地点：同样丢弃。
  const segs = String(r.location).split(/[\/\\>》→·]/).filter(Boolean);
  const supported = String(r.action || '').includes(String(r.location))
    || segs.some(x => x.length >= 2 && String(r.action || '').includes(x));
  const fromPlayer = segs.some(x => x.length >= 2 && String(actionText || '').includes(x));
  // 玩家直接差遣（「你去后院看看」）不算错误陈述。
  const directed = /(你|您)(?:先|就|快|赶紧|马上|现在|也)?[^。！？!?]{0,2}(?:去|到|往|回|走|进|离开|出门|前往|赶)/.test(String(actionText || ''));
  if (fromPlayer && !supported && !directed) {
    if (dbgEnabled()) {
      dbgLog({
        type: 'loc_guard', storyId: s.id, npc: npc && npc.name,
        from: npc && npc.currentLocation, rejected: r.location, action: dbgRedact(actionText, 120)
      });
    }
    r.location = '';
    r.moved = false;
    return true;
  }
  return false;
}

/* ---------------- 玩家点名的人必须在场 ---------------- */
function addressedNames(s, text) {
  const t = String(text || '');
  return (s.npcs || []).filter(n => n.name && t.includes(n.name));
}
/* 玩家点名的已建档 NPC：位置未知时对齐到玩家所在地；不创建任何新角色 */
function ensureAddressedNPCs(s, text) {
  const here = s.player.currentLocation || '';
  const out = [];
  for (const n of addressedNames(s, text)) {
    if (!n.currentLocation || isPlaceholderLocation(s, n.currentLocation) || sameLocation(n.currentLocation, here)) {
      if (here && !sameLocation(n.currentLocation, here)) n.currentLocation = here;
      out.push(n);
    }
  }
  if (out.length) saveDB();
  return out.filter(Boolean);
}

/* ---------------- 世界法则一致性 ----------------
   天道只裁决「是否违反世界设定」，不引用现实世界的法律、伦理或平台规则。
   因此这里不做内容拦截，只在「古代 / 仙侠类世界出现现代事物」时追加世界内的观感提示。 */
const PRE_MODERN_WORLD = /古代|仙侠|武侠|历史|古风/;
const MODERN_TERMS = /手机|电脑|网络|互联网|汽车|飞机|电视|视频|直播|电梯|电灯|电话|枪械/;
function worldMismatch(s, text) {
  if (!s || !s.world) return false;
  if (!PRE_MODERN_WORLD.test(String(s.world.category || ''))) return false;
  return MODERN_TERMS.test(String(text || ''));
}
function governNarrative(s, text) {
  const raw = String(text || '');
  if (!raw) return raw;
  if (!worldMismatch(s, raw)) return raw;
  return raw + '\n\n（这句话在周围人听来格外突兀，几道视线悄悄落在你身上。）';
}
function updateStreaming(s, msg, full) {
  msg.text = full;
  const el = document.getElementById('body-' + msg.id);
  if (el) {
    el.innerHTML = paragraphs(maskStream(full)) + '<span class="cursor"></span>';
    scrollToBottom();
  }
}
function finishMessage(s, msg, text) {
  msg.text = String(text || '').trim();
  delete msg.pending;
  s.updatedAt = nowTs();
  const el = document.getElementById('body-' + msg.id);
  if (el) el.innerHTML = paragraphs(msg.text);
}
function setGenerating(v) {
  generating = v;
  const comp = $('#composer'); if (comp) comp.classList.toggle('generating', v);
  const round = $('#sendRound'); if (round) round.classList.toggle('stop', v);
  const icon = $('#sendIcon');
  if (icon) icon.innerHTML = v
    ? '<rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" stroke="none"/>'
    : '<path d="M12 19V5M6 11l6-6 6 6"/>';
  const input = $('#input');
  if (input) {
    const has = !!activeStory();
    input.disabled = !has;
    input.placeholder = !has ? '先创建一个世界' : (v ? '正在书写…（点右侧停止）' : '你要做什么？');
  }
  const bs = $('#btnSend'); if (bs) bs.disabled = !activeStory();
  renderQuick();
}
function stopGeneration() {
  if (!generating) return;
  const id = window.__nativeActive;
  if (id && window.__llmPending && window.__llmPending[id]) {
    const p = window.__llmPending[id];
    try { p.reject(new Error('aborted')); } catch (e) { }
    delete window.__llmPending[id];
  }
  if (window.AndroidLLM && window.AndroidLLM.cancelAll) { try { AndroidLLM.cancelAll(); } catch (e) { } }
  window.__nativeActive = null;
  if (currentAbort) { try { currentAbort.abort(); } catch (e) { } }
  toast('已停止生成');
}

function frozenToast() { toast('该世界处于冻结状态，暂时不可互动！', false); }
function canInteract(s) {
  if (!s) return false;
  if (s.instance.timeStatus !== 'running') { frozenToast(); return false; }
  return true;
}
function hasAnyLLM(s) { return hasLLM('tiandao', s); }

/* ---------------- 单条 NPC 推理 ---------------- */
async function inferNPC(s, npc, actionText) {
  const sys = npcSystemPrompt(s, npc, actionText);
  if (!hasLLM('character', s)) {
    return {
      id: npc.id, name: npc.name,
      thought: '先看看他究竟想做什么。',
      speech: '', action: `${npc.name}没有立刻接话，只把手边的动作放慢了半拍。`,
      environment: '', moved: false, location: ''
    };
  }
  try {
    const res = await llmChat([
      { role: 'system', content: sys },
      { role: 'user', content: `请以 ${npc.name} 的身份回应玩家的行动，只输出 JSON。` }
    ], { kind: 'character', story: s, maxTokens: 520, temperature: 0.82, stream: false });
    const j = extractJSON(res.text);
    if (!j || typeof j !== 'object') throw new Error('bad json');
    return {
      id: npc.id, name: npc.name,
      thought: String(j.thought || ''), speech: String(j.speech || ''),
      action: String(j.action || ''), environment: String(j.environment || ''),
      moved: !!j.moved, location: String(j.location || '')
    };
  } catch (e) {
    return {
      id: npc.id, name: npc.name, thought: '（模型未能给出有效反应）',
      speech: '', action: `${npc.name}沉默了一瞬。`, environment: '', moved: false, location: ''
    };
  }
}
function arbitrate(reactions) {
  // 规则裁决：同一场景内出现直接争夺/攻击时，按角色能力描述与随机先后裁一次
  const conflictWords = /抢|夺|扑|刺|斩|抓|撞|推开|按住/;
  const clash = reactions.filter(r => conflictWords.test(r.action || ''));
  if (clash.length < 2) return reactions;
  const ordered = reactions.slice().sort((a, b) => {
    const ca = characterById(activeStory(), a.id), cb = characterById(activeStory(), b.id);
    const sa = /刀|剑|武|快|力|杀/.test((ca && (ca.abilities || '')) || '') ? 1 : 0;
    const sb = /刀|剑|武|快|力|杀/.test((cb && (cb.abilities || '')) || '') ? 1 : 0;
    return (sb - sa) || Math.random() - .5;
  });
  ordered.forEach((r, i) => {
    if (i === 0) r.action = (r.action || '') + '（先一步得手）';
    else r.action = (r.action || '').replace(/^(.*?)(扑|抓|夺|抢|刺|斩)/, '$1终究慢了半拍，$2');
  });
  return ordered;
}

/* ---------------- 叙事编织 ---------------- */
async function weaveNarrative(s, actionText, reactions, msg) {
  const last = [...s.messages].reverse().find(m => m.role === 'assistant' && m.text && m.id !== msg.id);
  const messages = [
    { role: 'system', content: weaveSystemPrompt(s, actionText) },
    { role: 'user', content: weaveUserPrompt(s, actionText, reactions, last ? last.text : '') }
  ];
  const res = await llmChat(messages, {
    kind: 'tiandao', story: s, maxTokens: 1500, temperature: 0.9, stream: true,
    onDelta: (piece, full) => updateStreaming(s, msg, full)
  });
  return res.text || msg.text || '';
}
async function soloNarrative(s, actionText, msg) {
  const messages = [
    { role: 'system', content: soloSystemPrompt(s, actionText) },
    { role: 'user', content: soloUserPrompt(s, actionText) }
  ];
  const res = await llmChat(messages, {
    kind: 'tiandao', story: s, maxTokens: 1100, temperature: 0.9, stream: true,
    onDelta: (piece, full) => updateStreaming(s, msg, full)
  });
  return res.text || msg.text || '';
}

/* ---------------- 记忆写入 ---------------- */
function localMemories(s, narrative, actionText, participants, roundId) {
  const loc = s.player.currentLocation || '';
  const names = participants.map(p => charName(s, p));
  const imp = /死|杀|血|断|毁|真相|秘密|突破|背叛|盟|宣战|陨落|成神|大火|爆炸/.test(narrative + actionText) ? 8
    : (/攻击|逃|救|告白|决裂|受伤|追|藏/.test(narrative + actionText) ? 6 : 4);
  const summary = `${s.player.name}：${clampText(actionText.replace(/\s+/g, ' '), 48)}。${clampText(narrative.replace(/\s+/g, ' '), 70)}`;
  const out = [];
  for (const p of participants) {
    out.push({
      charId: p, type: 'episodic', time: s.instance.currentTime, location: loc,
      people: names.filter(n => n !== charName(s, p)), event: summary,
      importance: imp, roundId, stageId: storyModeOn(s) ? s.story.stageId : ''
    });
  }
  return out;
}
async function extractMemories(s, narrative, actionText, participants, roundId, token) {
  let mems = [];
  if (hasOwnLLM('memory', s)) {
    try {
      const p = memoryExtractPrompt(s, narrative, actionText, participants);
      const res = await llmChat([
        { role: 'system', content: p.system },
        { role: 'user', content: p.user }
      ], { kind: 'memory', story: s, maxTokens: 700, temperature: 0.4, stream: false });
      const arr = extractJSON(res.text);
      if (Array.isArray(arr)) {
        mems = arr.filter(x => x && x.subject && x.event).slice(0, 4).map(x => ({
          charId: x.subject === 'player' ? 'player' : (s.npcs.some(n => n.id === x.subject || n.name === x.subject) ? (s.npcs.find(n => n.id === x.subject || n.name === x.subject) || {}).id : 'player'),
          type: 'episodic', time: x.time || s.instance.currentTime, location: x.location || s.player.currentLocation || '',
          people: Array.isArray(x.people) ? x.people : [], event: String(x.event).slice(0, 220),
          importance: Math.max(1, Math.min(10, parseInt(x.importance, 10) || 5)), roundId,
          stageId: storyModeOn(s) ? s.story.stageId : ''
        }));
      }
    } catch (e) { }
  }
  const alive = () => (!roundId || s.messages.some(m => m.roundId === roundId)) && (!token || s.messages.some(m => m.id === token));
  if (!alive()) return [];
  if (!mems.length) mems = localMemories(s, narrative, actionText, participants, roundId);
  if (!alive()) return [];
  mems.forEach(m => addMemory(s, m));
  return mems;
}
async function judgeSignificance(s, narrative, kind, roundId) {
  if (!hasLLM('tiandao', s)) return null;
  try {
    const p = significancePrompt(s, narrative, kind);
    const res = await llmChat([
      { role: 'system', content: p.system },
      { role: 'user', content: p.user }
    ], { kind: 'tiandao', story: s, maxTokens: 220, temperature: 0.2, stream: false });
    const j = extractJSON(res.text);
    if (!j || !j.significant) return null;
    const people = Array.isArray(j.people) && j.people.length
      ? j.people.slice(0, 8)
      : [s.player.name, ...sceneNPCs(s).map(n => n.name)].filter(Boolean).slice(0, 8);
    const ev = addEvent(s, {
      time: s.instance.currentTime, category: ['地理', '文化', '法则', '格局'].includes(j.category) ? j.category : '格局',
      title: clampText(j.title || '世界变动', 24), desc: clampText(j.desc || narrative, 160),
      importance: Math.max(1, Math.min(10, parseInt(j.importance, 10) || 7)),
      location: normalizeLocation(j.location) || s.player.currentLocation || '',
      people, state: clampText(j.state || '', 90), roundId
    });
    return ev;
  } catch (e) { return null; }
}
async function maybeEvolve(s, participants, roundId) {
  for (const id of participants) {
    const c = characterById(s, id);
    if (!c) continue;
    const high = memoriesOf(s, id).filter(m => m.importance >= 7);
    if (high.length < 5) continue;
    if (!hasLLM('character', s)) continue;
    if (c.lastEvalAt && nowTs() - c.lastEvalAt < 10 * 60 * 1000) continue;
    c.lastEvalAt = nowTs();
    try {
      const p = evolutionPrompt(s, c, id);
      const res = await llmChat([
        { role: 'system', content: p.system },
        { role: 'user', content: p.user }
      ], { kind: 'character', story: s, maxTokens: 420, temperature: 0.4, stream: false });
      const j = extractJSON(res.text);
      if (!j || !j.should_evolve) continue;
      const before = { personality: c.personality, currentGoal: c.currentGoal, emotion: c.emotion, beliefs: c.beliefs, abilities: c.abilities };
      if (j.personality_change) c.personality = j.personality_change;
      if (j.goal_change) c.currentGoal = j.goal_change;
      if (j.emotion) c.emotion = j.emotion;
      if (j.belief_change) c.beliefs = j.belief_change;
      if (j.abilities_change) c.abilities = j.abilities_change;
      if (j.relationships_change) c.relationships = j.relationships_change;
      let traitId = '';
      if (j.appearance_change) traitId = addCharacterTrait(s, c, 'appearance', j.appearance_change, roundId) || '';
      if (j.habit_change) {
        const lastMins = c.lastHabitAt ? worldMinutesBetween(c.lastHabitAt, s.instance.currentTime) : Infinity;
        if (lastMins >= 43200) {
          const hid = addCharacterTrait(s, c, 'habit', j.habit_change, roundId);
          if (hid) { traitId = hid; c.lastHabitAt = s.instance.currentTime; }
        }
      }
      c.evolutionVersion = (c.evolutionVersion || 1) + 1;
      c.lastEvolutionAt = new Date().toISOString();
      s.evolutions.unshift({
        id: uid('evo'), npcId: id, name: c.name, time: s.instance.currentTime,
        changeType: j.change_type || 'personality', description: clampText(j.description || '', 160),
        trigger: clampText(j.trigger_reason || '', 120), traitId,
        before, after: { personality: c.personality, currentGoal: c.currentGoal, emotion: c.emotion, beliefs: c.beliefs, abilities: c.abilities, relationships: c.relationships }, ts: nowTs()
      });
      if (s.evolutions.length > 80) s.evolutions = s.evolutions.slice(0, 60);
      if (dbgEnabled()) dbgLog({ type: 'evolve', storyId: s.id, roundId, name: c.name, changeType: j.change_type || 'personality', desc: dbgRedact(j.description || '', 160) });
      toast(`${c.name} 发生了转变：${clampText(j.description || j.change_type, 18)}`);
    } catch (e) { }
  }
}

/* ---------------- 主流程 ---------------- */
async function sendAction(text) {
  const s = activeStory();
  if (!s) return;
  if (!canInteract(s)) return;
  if (generating) return;
  if (!hasAnyLLM(s)) { toast('请先在右侧「模型」配置 API Key', false); return; }
  const roundId = uid('r');
  const userMsg = {
    id: uid('m'), role: 'user', text: String(text).trim(), ts: nowTs(),
    time: s.instance.currentTime, kind: 'action', roundId, prevLocation: s.player.currentLocation
  };
  s.messages.push(userMsg);
  s.instance.lastActiveTime = s.instance.currentTime;
  s.updatedAt = nowTs();
  saveDB(); renderMessages(); renderQuick();
  await runRound(s, { actionText: userMsg.text, roundId, userMsg });
}

async function runRound(s, { actionText, roundId, userMsg, refresh }) {
  setGenerating(true);
  currentAbort = new AbortController();
  const reply = {
    id: uid('m'), role: 'assistant', text: '', ts: nowTs(), pending: true,
    time: s.instance.currentTime, kind: 'narrative', roundId, speaker: '天道'
  };
  if (!refresh) s.messages.push(reply);
  else s.messages.push(reply);
  saveDB(); renderMessages();
  try {
    // 先解析移动意图：目的地确定后，同场景角色才是目的地的那些人
    const startLoc = s.player.currentLocation;
    if (!isLocationClaim(s, actionText) && looksLikeMove(actionText) && hasPlaceHint(actionText)) {
      const dest = await inferMove(s, '', actionText);
      if (dest) {
        s.player.currentLocation = dest;
        addL1(s, roundId, 'player', `你从${startLoc || '未知'}来到${dest}。`);
      }
    }
    ensureAddressedNPCs(s, actionText);
    const npcs = sceneNPCs(s).slice(0, MAX_SCENE_REACTIONS);
    const reactions = (await Promise.all(npcs.map(n => inferNPC(s, n, actionText)))).filter(Boolean);
    const ordered = reactions.length > 1 ? arbitrate(reactions) : reactions;
    let raw = '';
    if (ordered.length) raw = await weaveNarrative(s, actionText, ordered, reply);
    else raw = await soloNarrative(s, actionText, reply);

    if (!raw || !raw.trim()) throw new Error('模型没有返回内容');
    const parsed = parseLocationBlock(raw);
    let narrative = parsed.text || raw;
    narrative = governNarrative(s, narrative);
    if (storyModeOn(s)) {
      const reasons = stageDeviationSignals(s, narrative + '\n' + actionText);
      if (reasons.length) markPlanStale(s, reasons);
      const guard = await runSpoilerGuard(s, narrative);
      if (guard.action !== 'none') narrative = guard.text;
    }
    const safeAction = actionText;
    if (dbgEnabled()) {
      dbgLog({
        type: 'round', storyId: s.id, roundId, action: dbgRedact(actionText, 200),
        scene: npcs.map(n => n.name),
        reactions: ordered.map(r => ({
          id: r.id, name: r.name, moved: r.moved, location: r.location || '',
          thought: dbgRedact(r.thought, 120), speech: dbgRedact(r.speech, 160),
          action: dbgRedact(r.action, 160), environment: dbgRedact(r.environment, 120)
        })),
        locationMoved: parsed.moved, location: parsed.location || '',
        narrativeLen: narrative.length,
        narrative: dbgRedact(narrative, 6000)
      });
    }

    // 位置更新：玩家与 NPC（含首次定位、完整性校验与补全）
    const prevLoc = s.player.currentLocation;
    if (!isLocationClaim(s, actionText) && parsed.moved && parsed.location) {
      const loc = await resolveLocation(s, parsed.location, actionText + '\n' + narrative, true, s.player.currentLocation);
      if (loc && loc !== prevLoc) {
        s.player.currentLocation = loc;
        addL1(s, roundId, 'player', `你从${prevLoc || '未知'}来到${loc}。`);
      }
    } else if (!isLocationClaim(s, actionText) && (!parsed.found || !parsed.location) && looksLikeMove(actionText)) {
      // 位置块没写或写歪时的兜底：从叙事里再判断一次，避免位置滞后几轮
      const dest = await inferMove(s, narrative, actionText);
      if (dest && dest !== prevLoc) {
        s.player.currentLocation = dest;
        addL1(s, roundId, 'player', `你从${prevLoc || '未知'}来到${dest}。`);
      }
    }
    for (const r of ordered) {
      const npc = characterById(s, r.id);
      if (!npc) continue;
      // NPC 的位置只能由他自己的动作改变；玩家说错的去向不能把 NPC 带走。
      sanitizeReactionLocation(s, npc, r, actionText);
      if (!r.location) continue;
      const wasPlaceholder = isPlaceholderLocation(s, npc.currentLocation);
      if (!r.moved && !wasPlaceholder) continue;
      const loc = await resolveLocation(s, r.location, actionText + '\n' + narrative, !!r.moved, npc.currentLocation);
      if (loc) npc.currentLocation = loc;
    }

    finishMessage(s, reply, narrative);
    if (s.id === DB.activeId) { renderLeft(); renderHeader(); }

    // L1 工作记忆
    const reactionsText = ordered.map(r => `${r.name}${r.speech ? `说「${clampText(r.speech, 40)}」` : ''}${r.action ? `，${clampText(r.action, 40)}` : ''}`).join('；');
    addL1(s, roundId, 'player', `你${clampText(safeAction, 60)}${reactionsText ? '；' + reactionsText : ''}`);
    for (const r of ordered) addL1(s, roundId, r.id, `${s.player.name}${clampText(actionText, 50)}；你${clampText(r.action || r.speech || '保持沉默', 50)}`);

    const participants = ['player', ...ordered.map(r => r.id)];
    reply.time = s.instance.currentTime;
    s.instance.lastActiveTime = s.instance.currentTime;
    s.updatedAt = nowTs();
    saveDB(); renderMessages();

    // 记忆 / 事件 / 演化（异步，不阻塞输入）
    extractMemories(s, narrative, safeAction, participants, roundId, reply.id).then(() => {
      if (!s.messages.some(m => m.roundId === roundId) || !s.messages.some(m => m.id === reply.id)) return;
      saveDB(); if (s.id === DB.activeId) { renderRight(); renderLeft(); }
      maybeEvolve(s, participants, roundId).catch(() => { });
    }).catch(() => { });
    extractDisclosures(s, narrative, safeAction, participants, roundId, reply.id).then(() => {
      if (s.id === DB.activeId) { renderRight(); renderLeft(); }
    }).catch(() => { });
    judgeSignificance(s, narrative, '玩家互动', roundId).then(ev => {
      if (!ev) return;
      if (!s.messages.some(m => m.roundId === roundId)) { s.events = s.events.filter(e => e.roundId !== roundId); return; }
      if (storyModeOn(s)) syncStageReveals(s);
      saveDB(); if (s.id === DB.activeId) renderRight();
      toast('世界事件簿新增：' + ev.title);
    }).catch(() => { });

    // 时间随互动轻微推进
    const addMin = 2 + Math.min(8, actionText.length / 12);
    bumpInstanceTime(s, addMin);
    syncCharacterAges(s);
    if (storyModeOn(s)) {
      syncStageReveals(s);
      const offered = await maybeAdvanceStage(s);
      if (!offered) offerReplan(s);
      if (s.id === DB.activeId) renderLeft();
    }
    saveDB();
    renderHeader();
  } catch (e) {
    const isStop = /aborted|abort/i.test(e && e.message);
    if (isStop) {
      if (reply.text && reply.text.trim()) finishMessage(s, reply, maskStream(reply.text));
      else s.messages = s.messages.filter(m => m.id !== reply.id);
      toast('已停止生成');
    } else {
      s.messages = s.messages.filter(m => m.id !== reply.id);
      s.messages.push({
        id: uid('m'), role: 'system', kind: 'note', text: `模型连接失败：${e.message}。可在右侧「模型」检查配置。`,
        ts: nowTs(), time: s.instance.currentTime, roundId
      });
      toast('生成失败：' + e.message, false);
    }
  } finally {
    currentAbort = null;
    trimMessages(s);
    setGenerating(false);
    s.updatedAt = nowTs();
    saveDB(); renderAll();
  }
}

async function maybeNaturalEvent(s) {
  if (!s || !hasLLM('tiandao', s)) return;
  const mins = s.instance._eventClock || 0;
  if (mins < 360) return;
  s.instance._eventClock = 0;
  const recent = s.messages.filter(m => m.kind === 'autonomous').slice(-5)
    .map(m => `${m.speaker || 'NPC'}：${String(m.text || '').replace(/\s+/g, ' ').slice(0, 80)}`).join('\n');
  const text = recent || '世界在这段时间里平静地运转，没有玩家行动。';
  const ev = await judgeSignificance(s, text, '自然时间', '');
  if (ev) {
    saveDB();
    if (s.id === DB.activeId) renderRight();
    toast('世界事件簿新增：' + ev.title);
  }
}

function addCharacterTrait(s, c, type, text, roundId) {
  if (!c || !text) return;
  const key = type === 'appearance' ? 'appearanceTraits' : 'habitTraits';
  c[key] = c[key] || [];
  const t = clampText(String(text), 90);
  if (!t || c[key].some(x => x.text === t)) return;
  const id = uid('tr');
  c[key].unshift({ id, text: t, time: s.instance.currentTime, roundId: roundId || '', source: 'evolution' });
  if (c[key].length > 12) c[key].length = 12;
  return id;
}

// 回退一条演化：恢复该条记录发生前的字段，并删除该角色更新的演化记录
function revertEvolution(s, evoId) {
  if (!s) return false;
  const idx = s.evolutions.findIndex(e => e.id === evoId);
  if (idx < 0) return false;
  const evo = s.evolutions[idx];
  const c = evo.npcId === 'player' ? s.player : (s.npcs || []).find(n => n.id === evo.npcId);
  if (!c) return false;
  const b = evo.before || {};
  for (const k of ['personality', 'currentGoal', 'emotion', 'beliefs', 'abilities', 'relationships']) {
    if (b[k] !== undefined) c[k] = b[k];
  }
  if (b.age !== undefined && b.age !== '') {
    c.age = b.age;
    resetAgeAnchor(s, c);
  }
  if (evo.traitId) {
    if (Array.isArray(c.appearanceTraits)) c.appearanceTraits = c.appearanceTraits.filter(t => t.id !== evo.traitId);
    if (Array.isArray(c.habitTraits)) c.habitTraits = c.habitTraits.filter(t => t.id !== evo.traitId);
  }
  let removed = 0;
  s.evolutions = s.evolutions.filter((e, i) => {
    if (e.npcId !== evo.npcId || i > idx) return true;
    removed++; return false;
  });
  c.evolutionVersion = Math.max(1, (c.evolutionVersion || 1) - Math.max(1, removed));
  c.lastEvolutionAt = '';
  return true;
}

function purgeRoundData(s, roundIds) {
  if (!s || !roundIds || !roundIds.size) return;
  const has = id => !!id && roundIds.has(id);
  s.memories = s.memories.filter(m => !has(m.roundId));
  s.working.l1 = s.working.l1.filter(e => !has(e.roundId));
  s.events = s.events.filter(e => !has(e.roundId));
  s.bookmarks = s.bookmarks.filter(b => !has(b.roundId));
  for (const c of [s.player, ...(s.npcs || [])]) {
    if (!c) continue;
    if (Array.isArray(c.appearanceTraits)) c.appearanceTraits = c.appearanceTraits.filter(t => !has(t.roundId));
    if (Array.isArray(c.habitTraits)) c.habitTraits = c.habitTraits.filter(t => !has(t.roundId));
  }
}

async function refreshLast() {
  const s = activeStory(); if (!s) return;
  if (!canInteract(s)) return;
  if (generating) return;
  if (!hasAnyLLM(s)) { toast('请先配置模型', false); return; }
  const idx = [...s.messages].map(m => m).findLastIndex(m => m.role === 'assistant');
  if (idx < 0) { toast('还没有可刷新的叙事', false); return; }
  const reply = s.messages[idx];
  let userIdx = -1;
  for (let i = idx - 1; i >= 0; i--) if (s.messages[i].role === 'user') { userIdx = i; break; }
  if (userIdx < 0) {
    // 开场没有对应的玩家行动：把它当作「重写开场」，而不是报错。
    const before = s.messages.slice(0, idx);
    const onlyOpening = before.every(m => m.role === 'system');
    if (!onlyOpening) { toast('这条叙事没有对应的玩家行动，暂时无法重写', false); return; }
    const removed = s.messages.slice(idx);
    const rounds = new Set(removed.map(m => m.roundId).filter(Boolean));
    purgeRoundData(s, rounds);
    s.messages = [];
    saveDB(); renderMessages();
    toast('正在重写开场…');
    await generateOpening(s);
    return;
  }
  const userMsg = s.messages[userIdx];
  const roundId = userMsg.roundId || reply.roundId || uid('r');
  // 清掉本轮及其后所有消息的派生物（含 NPC 自主、跳转、空洞记忆）
  const removed = s.messages.slice(idx);
  const rounds = new Set(removed.map(m => m.roundId).filter(Boolean));
  rounds.add(roundId);
  purgeRoundData(s, rounds);
  s.messages = s.messages.slice(0, idx);
  s.player.currentLocation = userMsg.prevLocation || s.player.currentLocation;
  saveDB(); renderMessages();
  toast('正在重写这一段…');
  await runRound(s, { actionText: userMsg.text, roundId, userMsg, refresh: true });
}

function undoLast() {
  const s = activeStory(); if (!s) return;
  if (generating) { toast('正在生成，稍后再试', false); return; }
  const idx = [...s.messages].map(m => m).findLastIndex(m => m.role === 'user');
  if (idx < 0) { toast('还没有可撤回的行动', false); return; }
  openDialog({
    title: '撤回最后一次行动？<br><span style="font-size:12px;color:#bdbdbd">该轮叙事、记忆与事件将一并移除；只影响本机存档。</span>',
    ok: '撤回', okClass: 'danger', onOk: () => {
      const removed = s.messages.slice(idx);
      const roundIds = new Set(removed.map(m => m.roundId).filter(Boolean));
      const first = s.messages[idx];
      purgeRoundData(s, roundIds);
      s.messages = s.messages.slice(0, idx);
      if (first && first.prevLocation) s.player.currentLocation = first.prevLocation;
      s.updatedAt = nowTs();
      saveDB(); renderAll(); toast('已撤回');
    }
  });
}

async function continueStory() {
  const s = activeStory(); if (!s) return;
  if (!canInteract(s)) return;
  if (generating) return;
  if (!hasAnyLLM(s)) { toast('请先配置模型', false); return; }
  if (!s.messages.some(m => m.role === 'assistant' || m.role === 'npc')) { toast('暂无可继续的剧情，请先进行互动', false); return; }
  const roundId = uid('r');
  const reply = { id: uid('m'), role: 'assistant', text: '', ts: nowTs(), pending: true, time: s.instance.currentTime, kind: 'narrative', roundId, speaker: '天道' };
  s.messages.push(reply);
  setGenerating(true);
  saveDB(); renderMessages();
  try {
    const actionText = '你沉默着，没有立刻行动，任由这一刻继续。';
    const raw = await soloNarrative(s, actionText, reply);
    const parsed = parseLocationBlock(raw);
    let narrative = parsed.text || raw;
    narrative = governNarrative(s, narrative);
    if (parsed.moved && parsed.location) {
      const loc = await resolveLocation(s, parsed.location, narrative, true, s.player.currentLocation);
      if (loc) s.player.currentLocation = loc;
    }
    finishMessage(s, reply, narrative);
    addL1(s, roundId, 'player', `你静观其变；${clampText(narrative, 80)}`);
    extractMemories(s, narrative, actionText, ['player', ...sceneNPCs(s).map(n => n.id)], roundId, reply.id).catch(() => { });
    bumpInstanceTime(s, 20 + Math.round(Math.random() * 40));
    syncCharacterAges(s);
    s.instance.lastActiveTime = s.instance.currentTime;
    s.updatedAt = nowTs();
    saveDB();
  } catch (e) {
    s.messages = s.messages.filter(m => m.id !== reply.id);
    toast('继续失败：' + e.message, false);
  } finally {
    trimMessages(s);
    setGenerating(false); saveDB(); renderAll();
  }
}

/* ---------------- 开场 / 起始位置 ---------------- */
async function ensureStartLocation(s) {
  if (s.player.currentLocation && !isPlaceholderLocation(s, s.player.currentLocation)) return s.player.currentLocation;
  const preset = PRESETS.find(p => p.id === s.world.presetId);
  if (preset && preset.startLocation) {
    s.player.currentLocation = normalizeLocation(preset.startLocation) || preset.startLocation;
    return s.player.currentLocation;
  }
  if (hasLLM('tiandao', s)) {
    try {
      const p = startLocationPrompt(s);
      const res = await llmChat([{ role: 'system', content: p.system }, { role: 'user', content: p.user }],
        { kind: 'tiandao', story: s, maxTokens: 260, temperature: 0.6, stream: false });
      const j = extractJSON(res.text);
      const loc = normalizeLocation(j && j.location);
      if (loc && !locationIncomplete(s, loc)) { s.player.currentLocation = loc; return loc; }
    } catch (e) { }
  }
  s.player.currentLocation = '起点';
  return s.player.currentLocation;
}

async function generateOpening(s) {
  if (generating) return;
  if (s.messages.length) return;
  if (s.instance.timeStatus !== 'running') {
    s.instance.timeStatus = 'running';
    s.instance.lastTick = nowTs();
    saveDB();
  }
  setGenerating(true);
  toast('天道正在编织开场…');
  try {
    await ensureStartLocation(s);
    // 自定义世界的 NPC 若没有位置，让其中 1-2 个出现在玩家附近
    const preset = PRESETS.find(p => p.id === s.world.presetId);
    if (!preset) {
      const noLoc = s.npcs.filter(n => !n.currentLocation);
      noLoc.slice(0, 2).forEach(n => { n.currentLocation = s.player.currentLocation; });
    }
    const reply = { id: uid('m'), role: 'assistant', text: '', ts: nowTs(), pending: true, time: s.instance.currentTime, kind: 'narrative', roundId: uid('r'), speaker: '天道' };
    s.messages.push(reply);
    saveDB(); renderMessages();
    const p = welcomePrompt(s);
    const res = await llmChat([{ role: 'system', content: p.system }, { role: 'user', content: p.user }], {
      kind: 'tiandao', story: s, maxTokens: 1600, temperature: 0.92, stream: true,
      onDelta: (piece, full) => updateStreaming(s, reply, full)
    });
    const parsed = parseLocationBlock(res.text || reply.text || '');
    let narrative = parsed.text || '故事从这里开始。';
    narrative = governNarrative(s, narrative);
    if (storyModeOn(s)) {
      const reasons = stageDeviationSignals(s, narrative);
      if (reasons.length) markPlanStale(s, reasons);
      const guard = await runSpoilerGuard(s, narrative);
      if (guard.action !== 'none') narrative = guard.text;
    }
    if (parsed.moved && parsed.location) {
      const loc = await resolveLocation(s, parsed.location, narrative, true, s.player.currentLocation);
      if (loc) s.player.currentLocation = loc;
    }
    finishMessage(s, reply, narrative);
    addL1(s, reply.roundId, 'player', `你来到了${s.player.currentLocation}。`);
    s.instance.lastActiveTime = s.instance.currentTime;
    s.updatedAt = nowTs();
    saveDB(); renderAll();
    setTimeout(() => scrollToMessageTop(reply.id), 60);
  } catch (e) {
    if (typeof dbgEnabled === 'function' && dbgEnabled()) {
      dbgLog({ type: 'opening_error', storyId: s.id, err: String((e && e.message) || e) });
    }
    const fallback = s.world.opening || `${s.world.name}的故事从这里开始。`;
    const pending = s.messages.find(m => m.pending && (m.role === 'assistant' || m.role === 'npc'));
    if (pending) finishMessage(s, pending, fallback);
    else s.messages.push({
      id: uid('m'), role: 'assistant', kind: 'narrative', speaker: '天道', text: fallback,
      ts: nowTs(), time: s.instance.currentTime, roundId: uid('r')
    });
    toast('开场生成失败：' + e.message, false);
    saveDB(); renderAll();
  } finally {
    trimMessages(s);
    setGenerating(false); saveDB(); renderAll();
  }
}

/* ---------------- 时间跳转 ---------------- */
async function jumpTime(targetRaw) {
  const s = activeStory(); if (!s) return;
  if (!canInteract(s)) return;
  const target = guessDateTime(targetRaw, s.instance.currentTime);
  if (!target) { toast('无法识别该时间，请写成「贞观三年三月初五」或「2026-11-20 08:00」', false); return; }
  const cur = parseWorldTime(s.instance.currentTime), tgt = parseWorldTime(target);
  if (!cur || !tgt || timeToMinutes(tgt) <= timeToMinutes(cur)) { toast('时间跳转只能前往未来', false); return; }
  const from = s.instance.currentTime;
  openDialog({
    title: `跳转到「${esc(target)}」？<br><span style="font-size:12px;color:#bdbdbd">跳转期间的时间空白会由天道与角色 Agent 填补为记忆。</span>`,
    ok: '跳转', onOk: async () => {
      const jumpRound = uid('r');
      s.instance.currentTime = target;
      s.instance._timeCarry = 0;
      s.instance.lastActiveTime = target;
      syncCharacterAges(s);
      s.messages.push({
        id: uid('m'), role: 'system', kind: 'jump', text: `时间跳转：${from} → ${target}`,
        ts: nowTs(), time: target, roundId: jumpRound
      });
      addEvent(s, { time: target, category: '格局', title: '时间线跳转', desc: `世界时间由 ${from} 跳转至 ${target}。`, importance: 6, roundId: jumpRound });
      saveDB(); renderAll();
      toast('正在填补时间空白…');
      await fillGap(s, from, target, jumpRound);
      if (storyModeOn(s)) { syncStageReveals(s); const offered = await maybeAdvanceStage(s); if (!offered) offerReplan(s); }
      saveDB(); renderAll();
    }
  });
}
async function fillGap(s, from, to, roundId) {
  const subjects = ['player', ...s.npcs.slice(0, 4).map(n => n.id)];
  const range = { start: from, end: to };
  for (const id of subjects) {
    let mem = null;
    const kindName = id === 'player' ? 'tiandao' : 'character';
    if (hasLLM(kindName, s)) {
      try {
        const p = gapPrompt(s, from, to, s.player.currentGoal || '', id);
        const res = await llmChat([{ role: 'system', content: p.system }, { role: 'user', content: p.user }],
          { kind: kindName, story: s, maxTokens: 520, temperature: 0.7, stream: false });
        const j = extractJSON(res.text);
        if (j && j.event) {
          mem = {
            charId: id, type: 'episodic', time: to, timeRange: range,
            location: (j.location ? normalizeLocation(j.location) : '') || (id === 'player' ? s.player.currentLocation : (characterById(s, id) || {}).currentLocation) || '',
            people: Array.isArray(j.people) ? j.people : [], event: String(j.event).slice(0, 240),
            importance: Math.max(1, Math.min(10, parseInt(j.importance, 10) || 5))
          };
          const jloc = normalizeLocation(j.location);
          if (jloc && !locationIncomplete(s, jloc)) {
            if (id === 'player') s.player.currentLocation = jloc;
            else { const c = characterById(s, id); if (c) c.currentLocation = jloc; }
          }
        }
      } catch (e) { }
    }
    if (!mem) {
      const name = charName(s, id);
      mem = {
        charId: id, type: 'episodic', time: to, timeRange: range,
        location: id === 'player' ? (s.player.currentLocation || '') : ((characterById(s, id) || {}).currentLocation || ''),
        people: [], event: `${from} 至 ${to}，${name}在自己的生活里度过了一段平静而模糊的日子。`,
        importance: 3
      };
    }
    mem.roundId = roundId || '';
    mem.stageId = storyModeOn(s) ? s.story.stageId : '';
    addMemory(s, mem);
    addL1(s, roundId || '', id, `[${from} → ${to}] ${clampText(mem.event, 90)}`);
  }
  s.messages.push({
    id: uid('m'), role: 'system', kind: 'note',
    text: `时间空白已填补：${from} → ${to}。相关记忆可在右侧「记忆」查看。`,
    ts: nowTs(), time: to
  });
  trimMessages(s);
  toast('时间空白已填补');
}

async function judgeGapEvent(s, from, to) {
  if (!hasLLM('tiandao', s)) return;
  const mems = s.memories.filter(m => m.timeRange && m.timeRange.start === from && m.timeRange.end === to).slice(0, 6);
  if (!mems.length) return;
  const text = mems.map(m => `${charName(s, m.charId)}：${m.event}`).join('\n');
  const ev = await judgeSignificance(s, text, '离线/时间跨越', '');
  if (ev) {
    ev.time = to;
    ev.location = s.player.currentLocation || '';
    ev.people = [...new Set(mems.flatMap(m => m.people || []))].slice(0, 8);
    ev.state = '世界在空白期内继续运转。';
    saveDB();
  }
}

/* ---------------- NPC 自主行为 / 离线记忆 ---------------- */
function npsGroups(s) {
  const groups = {};
  for (const n of s.npcs) {
    if (!n.currentLocation) continue;
    (groups[n.currentLocation] = groups[n.currentLocation] || []).push(n);
  }
  return groups;
}
async function autonomousTick(s) {
  if (document.hidden) return;
  if (generating) return;
  if (!hasLLM('character', s) && !hasLLM('tiandao', s)) return;
  if (s.instance.timeStatus !== 'running') return;
  if ((s.instance._pendingAuto || 0) < AUTONOMY_MIN) return;
  const groups = npsGroups(s);
  const locs = Object.keys(groups);
  if (!locs.length) { s.instance._pendingAuto = 0; return; }

  const playerLoc = s.player.currentLocation;
  let candidates = locs.slice();
  // 玩家所在位置 30% 概率触发，避免抢戏
  candidates = candidates.filter(loc => {
    if (!sameLocation(loc, playerLoc)) return true;
    return Math.random() < 0.3;
  });
  if (!candidates.length) { s.instance._pendingAuto = 0; return; }
  const loc = candidates[Math.floor(Math.random() * candidates.length)];
  const npc = groups[loc][Math.floor(Math.random() * groups[loc].length)];
  s.instance._pendingAuto = Math.max(0, (s.instance._pendingAuto || 0) - AUTONOMY_MIN);
  if (!npc) return;

  const sceneNPCsList = s.npcs.filter(n => sameLocation(n.currentLocation, loc) && n.id !== npc.id);
  try {
    const p = autonomousSystemPrompt(s, npc, sceneNPCsList);
    const res = await llmChat([{ role: 'system', content: p.system }, { role: 'user', content: '请让这个角色自主行动一小段，并输出位置块。' }],
      { kind: 'character', story: s, maxTokens: 700, temperature: 0.85, stream: false });
    const parsed = parseLocationBlock(res.text || '');
    if (!parsed.text) return;
    let text = parsed.text;
    text = governNarrative(s, text);
    const wasPlaceholder = isPlaceholderLocation(s, npc.currentLocation);
    if (parsed.location && (parsed.moved || wasPlaceholder)) {
      const newLoc = await resolveLocation(s, parsed.location, text, !!parsed.moved, npc.currentLocation);
      if (newLoc) npc.currentLocation = newLoc;
    }
    const roundId = uid('r');
    if (dbgEnabled()) dbgLog({ type: 'auto', storyId: s.id, roundId, npc: npc.name, location: npc.currentLocation || loc, len: text.length, head: dbgRedact(text, 200) });
    s.messages.push({
      id: uid('m'), role: 'npc', kind: 'autonomous', speaker: npc.name,
      text, ts: nowTs(), time: s.instance.currentTime, roundId
    });
    addL1(s, roundId, npc.id, `你${clampText(text, 100)}`);
    if (sameLocation(npc.currentLocation, playerLoc)) addL1(s, roundId, 'player', `你看见${npc.name}${clampText(text, 80)}`);
    addMemory(s, {
      charId: npc.id, type: 'episodic', time: s.instance.currentTime, location: npc.currentLocation || loc,
      people: sceneNPCsList.map(n => n.name), event: clampText(text.replace(/\s+/g, ' '), 200),
      importance: /死|杀|血|断|毁|真相|秘密|突破|背叛|盟|宣战|陨落/.test(text) ? 8 : 3, roundId
    });
    judgeSignificance(s, text, 'NPC 自主行为', roundId).then(ev => {
      if (ev) { saveDB(); if (s.id === DB.activeId) renderRight(); }
    }).catch(() => { });
    s.updatedAt = nowTs();
    trimMessages(s);
    saveDB();
    if (s.id === DB.activeId) { renderMessages(); renderLeft(); renderHeader(); }
  } catch (e) { }
}
async function offlineFill(s) {
  if (s.instance.timeStatus !== 'running') return;
  if (s.instance._filling) return;
  const gap = worldMinutesBetween(s.instance.lastActiveTime, s.instance.currentTime);
  if (gap < OFFLINE_DAY_MIN) return;
  s.instance._filling = true;
  const from = s.instance.lastActiveTime, to = s.instance.currentTime;
  try {
    await fillGap(s, from, to);
    await judgeGapEvent(s, from, to);
    s.instance.lastActiveTime = to;
  } finally {
    s.instance._filling = false;
    saveDB();
  }
}

/* ---------------- 时间线 tick ---------------- */
function tick() {
  const now = nowTs();
  let changed = false;
  for (const s of DB.stories) {
    if (s.instance.timeStatus !== 'running') { s.instance.lastTick = now; continue; }
    const realMin = Math.max(0, (now - (s.instance.lastTick || now)) / 60000);
    s.instance.lastTick = now;
    if (realMin < 0.08) continue;
    const add = realMin * (s.instance.timeSpeed || 1);
    const before = s.instance.currentTime;
    // 中文历法的显示粒度可能是“时辰”（120 分钟），不足一格的推进由 _timeCarry 累积。
    bumpInstanceTime(s, add);
    const next = s.instance.currentTime;
    s.instance._pendingAuto = (s.instance._pendingAuto || 0) + add;
    s.instance._eventClock = (s.instance._eventClock || 0) + add;
    if (next !== before) {
      syncCharacterAges(s);
      changed = true;
    } else if (add >= 1 && !s.instance._timeWarned && !parseWorldTime(before)) {
      // 时间格式无法解析时 advanceWorldTime 会原样返回，时间会永久停在原地。
      s.instance._timeWarned = true;
      if (typeof dbgEnabled === 'function' && dbgEnabled()) {
        dbgLog({ type: 'time_error', storyId: s.id, time: before, msg: '世界时间无法解析，时间不会推进' });
      }
    }
  }
  const s0 = activeStory();
  const running = !!s0 && s0.instance.timeStatus === 'running';
  const due = running && ((s0.instance._pendingAuto || 0) >= AUTONOMY_MIN || (s0.instance._eventClock || 0) >= 360);
  if (changed || due) {
    saveDB();
    const s = s0;
    if (s) {
      renderHeader();
      if ($('#drawerLeft') && $('#drawerLeft').classList.contains('show')) refreshLeftTime();
      if (s.instance.timeStatus === 'running') {
        offlineFill(s).catch(() => { });
        if (s.id === DB.activeId && !generating) {
          autonomousTick(s).catch(() => { });
          maybeNaturalEvent(s).catch(() => { });
          maybeAdvanceStage(s).catch(() => { });
        }
      }
    }
  }
}
let TICK_TIMER = null;
function startTick() {
  if (TICK_TIMER) clearInterval(TICK_TIMER);
  TICK_TIMER = setInterval(tick, TICK_MS);
}

/* ---------------- 记忆巩固 ---------------- */
function consolidateLocal(s, silent) {
  for (const id of ['player', ...s.npcs.map(n => n.id)]) {
    const list = memoriesOf(s, id);
    if (list.length > 260) {
      list.sort((a, b) => (b.importance + memoryRecency(s, b)) - (a.importance + memoryRecency(s, a)));
      const keep = new Set(list.slice(0, 220).map(m => m.id));
      s.memories = s.memories.filter(m => m.charId !== id || keep.has(m.id));
    }
  }
  // 本地书签：把最近情景记忆抽象成一条状态书签
  for (const id of ['player', ...s.npcs.map(n => n.id)]) {
    const recent = memoriesOf(s, id).slice(0, 3);
    if (recent.length < 2) continue;
    const q = `${charName(s, id)}最近在做什么？`;
    const answer = recent.map(m => `${m.time}，${clampText(m.event, 60)}`).join('；');
    const exists = s.bookmarks.find(b => b.charId === id && b.question === q);
    if (exists) Object.assign(exists, { answer, time: s.instance.currentTime, ts: nowTs() });
    else addBookmark(s, { charId: id, type: 'state', question: q, answer });
  }
  saveDB();
  if (!silent) toast('记忆已整理');
}
async function refreshBookmarksLLM(s) {
  if (!hasOwnLLM('memory', s)) { consolidateLocal(s, false); return; }
  let ok = 0;
  for (const id of ['player', ...sceneNPCs(s).map(n => n.id)]) {
    try {
      const p = bookmarkPrompt(s, id);
      const res = await llmChat([{ role: 'system', content: p.system }, { role: 'user', content: p.user }],
        { kind: 'memory', story: s, maxTokens: 620, temperature: 0.4, stream: false });
      const arr = extractJSON(res.text);
      const items = Array.isArray(arr) ? arr.filter(x => x && x.question).slice(0, 6) : [];
      if (items.length) {
        s.bookmarks = s.bookmarks.filter(b => b.charId !== id);
        items.forEach(x => {
          addBookmark(s, { charId: id, type: ['concept', 'state', 'behavioral'].includes(x.type) ? x.type : 'concept', question: String(x.question).slice(0, 90), answer: String(x.answer || '').slice(0, 260) });
        });
        ok++;
      }
    } catch (e) { }
  }
  saveDB();
  toast(ok ? '语义书签已更新' : '书签更新失败，已保留原书签', !!ok);
}
