
/* ============================================================
   二、模型传输 · JSON 解析 · 记忆检索
   ============================================================ */
const LLM_LABEL = { tiandao: '天道', character: '角色', memory: '记忆' };
function secEnc(v) {
  const t = v == null ? '' : String(v);
  if (!t || !window.AndroidSecure || t.startsWith('enc:')) return t;
  try { return AndroidSecure.encrypt(t) || t; } catch (e) { return t; }
}
function secDec(v) {
  const t = v == null ? '' : String(v);
  if (!t || !window.AndroidSecure || !t.startsWith('enc:')) return t;
  try { return AndroidSecure.decrypt(t) || ''; } catch (e) { return ''; }
}
function withSecret(c) {
  if (!c || !c.apiKey) return c;
  const plain = secDec(c.apiKey);
  return plain === c.apiKey ? c : Object.assign({}, c, { apiKey: plain });
}
function llmScope(story) {
  if (story) return story;
  try { return typeof activeStory === 'function' ? activeStory() : null; } catch (e) { return null; }
}
function mergeLLM(a, b) { return Object.assign({}, a || {}, b || {}); }

/* ---------------- 全局 API 池 ---------------- */
function llmApis() { return DB.config.llmApis || []; }
function llmPools() { return DB.config.llmPools || []; }
function findApi(id) { return llmApis().find(a => a.id === id) || null; }
function findPool(id) { return llmPools().find(p => p.id === id) || null; }
function apiReady(a) { return !!(a && a.enabled !== false && a.endpoint && a.apiKey && a.model); }
function apiConfig(a) { return withSecret(Object.assign({}, a, { mode: 'own' })); }
function poolMembers(p) { return ((p && p.members) || []).map(findApi).filter(apiReady); }
function llmRefOf(kind, story) {
  const s = llmScope(story);
  const O = (s && s.llm) || {};
  if (O[kind] != null && O[kind] !== '') return O[kind];
  const G = DB.config.llmAssign || {};
  if (G[kind]) return G[kind];
  return kind === 'tiandao' ? '' : 'tiandao';
}
function resolveLLMRef(ref, depth = 0) {
  if (!ref) return [];
  if (typeof ref === 'object') {
    if (ref.mode === 'tiandao') return resolveLLMRef('tiandao', depth + 1);
    const c = withSecret(normalizeLLM(ref));
    return c.endpoint && c.apiKey && c.model ? [{ apiId: '', config: c, label: '旧版配置' }] : [];
  }
  if (ref === 'tiandao') return depth ? [] : resolveLLMRef(llmRefOf('tiandao'), depth + 1);
  const m = /^(api|pool):(.+)$/.exec(String(ref));
  if (!m) return [];
  if (m[1] === 'api') {
    const a = findApi(m[2]);
    return apiReady(a) ? [{ apiId: a.id, config: apiConfig(a), label: a.name || a.model }] : [];
  }
  const p = findPool(m[2]);
  if (!p || p.enabled === false) return [];
  return poolMembers(p).map(a => ({ apiId: a.id, config: apiConfig(a), label: a.name || a.model }));
}
function llmRefLabel(ref) {
  if (!ref) return '未配置';
  if (typeof ref === 'object') return '旧版配置';
  if (ref === 'tiandao') return '跟随天道';
  const m = /^(api|pool):(.+)$/.exec(String(ref));
  if (!m) return '未配置';
  if (m[1] === 'api') { const a = findApi(m[2]); return a ? (a.name || a.model || '未命名接口') : '接口已删除'; }
  const p = findPool(m[2]);
  return p ? ((p.name || '聚合') + ' · ' + poolMembers(p).length + ' 个接口') : '聚合已删除';
}
function llmRefCandidates(kind, story) { return resolveLLMRef(llmRefOf(kind, story)); }
function llmCfg(kind, story) {
  const k = kind || 'tiandao';
  const cands = llmRefCandidates(k, story);
  if (!cands.length) return Object.assign(blankLLM(), { endpoint: '', apiKey: '', model: '' });
  const c = withSecret(Object.assign({}, cands[0].config));
  c.__ref = llmRefOf(k, story);
  c.__label = cands[0].label;
  return c;
}
function hasLLM(kind, story) { return llmRefCandidates(kind || 'tiandao', story).length > 0; }
function hasOwnLLM(kind, story) {
  if (!kind || kind === 'tiandao') return hasLLM('tiandao', story);
  const ref = llmRefOf(kind, story);
  return !!ref && ref !== 'tiandao' && llmRefCandidates(kind, story).length > 0;
}
function normBase(ep) { return String(ep || '').trim().replace(/\/+$/, ''); }
function openaiUrl(ep) {
  const u = normBase(ep);
  if (/\/chat\/completions$/.test(u)) return u;
  if (/\/v1$/.test(u)) return u + '/chat/completions';
  return u + '/v1/chat/completions';
}
function anthropicUrl(ep) {
  const u = normBase(ep);
  if (/\/v1\/messages$/.test(u)) return u;
  if (/\/v1$/.test(u)) return u + '/messages';
  return u + '/v1/messages';
}
/** 模型列表地址：从用户填的 Endpoint 推导出 /models。 */
function modelsUrl(ep) {
  let u = normBase(ep);
  if (/\/models$/i.test(u)) return u;
  u = u.replace(/\/(chat\/completions|completions|messages)$/i, '');
  if (/\/(v\d+(beta)?|openai)$/i.test(u)) return u + '/models';
  return u + '/v1/models';
}

/* 原生 HTTP 桥（Android WebView）；浏览器环境回退 fetch */
function nativePost(url, headers, body) {
  return new Promise((resolve, reject) => {
    if (!window.AndroidLLM) return reject(new Error('native bridge unavailable'));
    const id = 'llm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    window.__llmPending = window.__llmPending || {};
    window.__llmPending[id] = { resolve, reject };
    try { AndroidLLM.post(id, url, JSON.stringify(headers), JSON.stringify(body)); }
    catch (e) { delete window.__llmPending[id]; reject(e); }
  });
}
window.__llmResult = function (id, response, error) {
  const p = window.__llmPending && window.__llmPending[id];
  if (!p) return;
  delete window.__llmPending[id];
  if (error) p.reject(new Error(error)); else p.resolve(response);
};
function nativeStream(url, headers, body, onDelta) {
  return new Promise((resolve, reject) => {
    if (!window.AndroidLLM || !window.AndroidLLM.postStream) return reject(new Error('bridge unavailable'));
    const id = 'llm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    window.__llmPending = window.__llmPending || {};
    let full = '';
    window.__nativeActive = id;
    window.__llmPending[id] = {
      onDelta: piece => { full += piece; try { onDelta(piece, full); } catch (e) { } },
      resolve: () => { if (window.__nativeActive === id) window.__nativeActive = null; resolve({ text: full }); },
      reject: err => { if (window.__nativeActive === id) window.__nativeActive = null; reject(err); }
    };
    try { AndroidLLM.postStream(id, url, JSON.stringify(headers), JSON.stringify(body)); }
    catch (e) { delete window.__llmPending[id]; reject(e); }
  });
}
window.__llmDelta = function (id, text) {
  const p = window.__llmPending && window.__llmPending[id];
  if (p && p.onDelta) p.onDelta(text);
};
window.__llmDone = function (id, full, error) {
  const p = window.__llmPending && window.__llmPending[id];
  if (!p) return;
  delete window.__llmPending[id];
  if (error) p.reject(new Error(error)); else p.resolve({ text: full || '' });
};

/* ---------------- 自动获取模型列表 ---------------- */
/** GET 请求：优先走原生桥绕开 CORS，浏览器环境回退 fetch。 */
function nativeGet(url, headers) {
  return new Promise((resolve, reject) => {
    if (!window.AndroidLLM || typeof window.AndroidLLM.get !== 'function') return reject(new Error('native bridge unavailable'));
    const id = 'get_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    window.__llmGetPending = window.__llmGetPending || {};
    window.__llmGetPending[id] = { resolve, reject };
    try { window.AndroidLLM.get(id, url, JSON.stringify(headers || {})); }
    catch (e) { delete window.__llmGetPending[id]; reject(e); }
  });
}
window.__llmGetResult = function (id, response, error) {
  const p = window.__llmGetPending && window.__llmGetPending[id];
  if (!p) return;
  delete window.__llmGetPending[id];
  if (error) p.reject(new Error(error)); else p.resolve(response);
};
function modelsHeaders(cfg) {
  if (cfg.format === 'anthropic') {
    return {
      'Accept': 'application/json',
      'x-api-key': cfg.apiKey || '',
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    };
  }
  return { 'Accept': 'application/json', 'Authorization': 'Bearer ' + (cfg.apiKey || '') };
}
function parseModelList(raw) {
  let json;
  try { json = typeof raw === 'string' ? JSON.parse(raw) : raw; }
  catch { throw new Error('接口返回了非 JSON 内容：' + String(raw || '').slice(0, 90)); }
  const arr = Array.isArray(json) ? json
    : (Array.isArray(json.data) ? json.data
      : (Array.isArray(json.models) ? json.models
        : (Array.isArray(json.result) ? json.result : [])));
  const ids = [];
  for (const it of arr) {
    if (it == null) continue;
    let id = '';
    if (typeof it === 'string') id = it;
    else id = String(it.id || it.name || it.model || it.slug || '');
    id = id.replace(/^models\//, '').trim();
    if (id && !ids.includes(id)) ids.push(id);
  }
  if (!ids.length) throw new Error('接口没有返回可用的模型列表');
  return ids.sort((a, b) => a.localeCompare(b));
}
/** 按 base URL + Key 拉取模型列表。 */
async function listModels(cfg) {
  if (!cfg || !cfg.endpoint) throw new Error('请先填写 Endpoint');
  if (!cfg.apiKey) throw new Error('请先填写 API Key');
  const primary = modelsUrl(cfg.endpoint);
  const base = normBase(cfg.endpoint).replace(/\/(chat\/completions|completions|messages)$/i, '');
  const fallback = /\/models$/i.test(base) ? '' : base + '/models';
  const headers = modelsHeaders(cfg);
  const getRaw = async url => {
    if (window.AndroidLLM && typeof window.AndroidLLM.get === 'function') return nativeGet(url, headers);
    const res = await fetch(url, { method: 'GET', headers });
    const raw = await res.text();
    if (!res.ok) throw new Error('HTTP ' + res.status + '：' + String(raw || '').slice(0, 120));
    return raw;
  };
  let raw, used = primary, firstErr = null;
  try {
    raw = await getRaw(primary);
  } catch (e) {
    firstErr = e;
    if (!fallback || fallback === primary) throw e;
    // 有些服务把模型列表挂在真正的 base 下（不带 /v1），再试一次。
    try { raw = await getRaw(fallback); used = fallback; }
    catch (e2) { throw firstErr; }
  }
  const ids = parseModelList(raw);
  if (typeof dbgEnabled === 'function' && dbgEnabled()) {
    dbgLog({ type: 'models', url: used, count: ids.length, sample: ids.slice(0, 20).join(', ') });
  }
  return ids;
}
function parseLLMText(kind, raw) {
  let json;
  try { json = JSON.parse(raw); }
  catch { throw new Error('接口返回了非 JSON 内容：' + String(raw || '').slice(0, 90)); }
  if (kind === 'anthropic') return (json.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
  return json.choices?.[0]?.message?.content || json.choices?.[0]?.text || '';
}

async function llmChatOnce(messages, opt = {}) {
  const kindName = opt.kind || 'tiandao';
  const c = opt.config || llmCfg(kindName, opt.story);
  if (!c.apiKey || !c.endpoint || !c.model) throw new Error(`尚未配置${LLM_LABEL[kindName] || ''}模型`);
  const stream = opt.stream !== false && !!opt.onDelta;
  const maxTokens = opt.maxTokens || c.maxTokens || 1400;
  const temperature = opt.temperature == null ? (c.temperature == null ? 0.85 : c.temperature) : opt.temperature;
  const fmt = c.format === 'anthropic' ? 'anthropic' : 'openai';
  const signal = opt.signal;

  if (window.AndroidLLM) {
    let url, headers, body;
    if (fmt === 'anthropic') {
      const sys = messages.find(m => m.role === 'system');
      const conversation = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));
      body = { model: c.model, messages: conversation, max_tokens: maxTokens, temperature, stream: false };
      if (sys) body.system = sys.content;
      url = anthropicUrl(c.endpoint);
      headers = { 'Content-Type': 'application/json', 'x-api-key': c.apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' };
    } else {
      body = { model: c.model, messages, max_tokens: maxTokens, temperature, stream: false };
      url = openaiUrl(c.endpoint);
      headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + c.apiKey };
    }
    if (stream && window.AndroidLLM.postStream) {
      body.stream = true;
      return nativeStream(url, headers, body, opt.onDelta);
    }
    const raw = await nativePost(url, headers, body);
    const text = parseLLMText(fmt, raw);
    if (text && opt.onDelta) opt.onDelta(text);
    return { text };
  }

  let url, headers, body;
  if (fmt === 'anthropic') {
    const sys = messages.find(m => m.role === 'system');
    const conversation = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));
    body = { model: c.model, messages: conversation, max_tokens: maxTokens, temperature, stream };
    if (sys) body.system = sys.content;
    url = anthropicUrl(c.endpoint);
    headers = { 'Content-Type': 'application/json', 'x-api-key': c.apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' };
  } else {
    body = { model: c.model, messages, max_tokens: maxTokens, temperature, stream };
    url = openaiUrl(c.endpoint);
    headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + c.apiKey };
  }
  const res = await fetch(url, { method: 'POST', signal, headers, body: JSON.stringify(body) });
  return handleResponse(res, fmt, stream, opt.onDelta);
}
async function handleResponse(res, kind, stream, onDelta) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let msg = `HTTP ${res.status}`;
    try { const j = JSON.parse(text); msg = j.error?.message || j.message || msg; } catch { if (text) msg += ' ' + text.slice(0, 90); }
    throw new Error(msg);
  }
  const ct = res.headers.get('content-type') || '';
  if (!stream || !res.body || !ct.includes('event-stream')) {
    const json = await res.json();
    let text = '';
    if (kind === 'anthropic') text = (json.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    else text = json.choices?.[0]?.message?.content || json.choices?.[0]?.text || '';
    if (text && onDelta) onDelta(text);
    return { text };
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '', full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const parts = buf.split(/\n\n/);
    buf = parts.pop() || '';
    for (const part of parts) {
      for (const line of part.split('\n')) {
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (!data || data === '[DONE]') continue;
        try {
          const obj = JSON.parse(data);
          let piece = '';
          if (kind === 'anthropic') {
            if (obj.type === 'content_block_delta' && obj.delta?.type === 'text_delta') piece = obj.delta.text || '';
          } else {
            piece = obj.choices?.[0]?.delta?.content || '';
          }
          if (piece) { full += piece; onDelta && onDelta(piece, full); }
        } catch (e) { }
      }
    }
  }
  return { text: full };
}
/* 智能轮询：按成功率、延迟与冷却时间在聚合成员间加权轮转 */
const LLM_RT = {};
function llmRt(apiId) {
  const k = apiId || '_';
  return LLM_RT[k] || (LLM_RT[k] = { ok: 0, fail: 0, fails: 0, avgMs: 0, coolUntil: 0, lastUsed: 0 });
}
function llmOrder(cands) {
  const now = Date.now();
  return cands.map((c, i) => {
    const st = llmRt(c.apiId);
    const rel = (st.ok + 1) / (st.ok + st.fail + 2);
    const spd = 1 / (1 + (st.avgMs || 1200) / 1500);
    const fresh = now - st.lastUsed > 8000 ? 1.15 : 0.85;
    const cool = st.coolUntil > now ? 0.02 : 1;
    const streak = 1 / (1 + st.fails);
    return { c, i, w: Math.max(0.005, rel * spd * fresh * cool * streak) * (0.75 + Math.random() * 0.5) };
  }).sort((a, b) => b.w - a.w || a.i - b.i).map(x => x.c);
}
function llmOk(apiId, ms) {
  const st = llmRt(apiId);
  st.ok++; st.fails = 0; st.coolUntil = 0;
  st.avgMs = st.avgMs ? Math.round(st.avgMs * 0.7 + ms * 0.3) : Math.round(ms);
  st.lastUsed = Date.now();
}
function llmFail(apiId) {
  const st = llmRt(apiId);
  st.fail++; st.fails++;
  st.lastUsed = Date.now();
  st.coolUntil = Date.now() + Math.min(600000, 3000 * Math.pow(2, Math.min(7, st.fails - 1)));
}

/* ---------------- 调试日志 ---------------- */
const DBG_KEY = 'qiyuan_rp_debug_v1';
const DBG_MAX = 300;
let DBG = null;
function dbg() {
  if (DBG) return DBG;
  DBG = { enabled: true, entries: [] };
  try {
    const raw = localStorage.getItem(DBG_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && Array.isArray(p.entries)) {
        DBG.enabled = p.enabled !== false;
        DBG.entries = p.entries;
      }
    }
  } catch (e) { }
  return DBG;
}
function dbgEnabled() { return dbg().enabled; }
function dbgSetEnabled(v) {
  const d = dbg();
  d.enabled = !!v;
  try { localStorage.setItem(DBG_KEY, JSON.stringify(d)); } catch (e) { }
  return d.enabled;
}
function dbgLog(entry) {
  const d = dbg();
  if (!d.enabled) return;
  entry.ts = nowTs();
  d.entries.push(entry);
  if (d.entries.length > DBG_MAX) d.entries.splice(0, d.entries.length - DBG_MAX);
  try { localStorage.setItem(DBG_KEY, JSON.stringify(d)); } catch (e) { }
}
function dbgClear() {
  const d = dbg();
  d.entries = [];
  try { localStorage.setItem(DBG_KEY, JSON.stringify(d)); } catch (e) { }
}
function dbgRedact(text, maxLen) {
  let t = String(text == null ? '' : text);
  t = t.replace(/sk-[A-Za-z0-9_\-]{10,}/g, 'sk-***');
  t = t.replace(/Bearer\s+[A-Za-z0-9_\-]{10,}/gi, 'Bearer ***');
  t = t.replace(/["']?apiKey["']?\s*[:=]\s*["']?[^"'\s,}]{4,}["']?/gi, '"apiKey":"***"');
  t = t.replace(/enc:[A-Za-z0-9+/=:_\-]+/g, 'enc:***');
  if (maxLen && t.length > maxLen) t = t.slice(0, maxLen) + '…';
  return t;
}
async function llmChat(messages, opt = {}) {
  const kindName = opt.kind || 'tiandao';
  const cands = opt.config ? [{ apiId: '', config: opt.config, label: '' }] : llmRefCandidates(kindName, opt.story);
  if (!cands.length) throw new Error(`尚未配置${LLM_LABEL[kindName] || ''}模型`);
  const order = llmOrder(cands);
  if (dbgEnabled()) {
    const s = opt.story || (typeof activeStory === 'function' ? activeStory() : null);
    // 完整保留每一次 LLM 请求的上下文（全部 messages，逐字不截断），仅脱敏 Key。
    const fullContext = messages.map(m => ({ role: m.role, content: dbgRedact(String(m.content || ''), 40000) }));
    dbgLog({
      type: 'llm', agent: kindName,
      storyId: s ? s.id : '', storyName: s ? (s.instanceName || s.world.name) : '',
      stageId: s && typeof storyModeOn === 'function' && storyModeOn(s) ? s.story.stageId : '',
      stageName: s && typeof storyModeOn === 'function' && storyModeOn(s) ? storyStageLabel(s) : '',
      blockedStages: s && typeof storyModeOn === 'function' && storyModeOn(s)
        ? (storyArcOf(s).stages || []).filter(st => st.order > (currentStage(s) || {}).order).map(st => st.name)
        : [],
      ref: (cands[0] && cands[0].label) || (opt.__ref || ''),
      label: cands.map(c => c.label || c.apiId).join(' > '),
      context: fullContext,
      contextChars: fullContext.reduce((n, m) => n + String(m.content || '').length, 0),
      stream: !!(opt.stream !== false && opt.onDelta),
      maxTokens: opt.maxTokens || (opt.config && opt.config.maxTokens) || 1400,
      temperature: opt.temperature != null ? opt.temperature : (opt.config && opt.config.temperature)
    });
  }
  const streaming = opt.stream !== false && !!opt.onDelta;
  const dbgOn = dbgEnabled();
  if (streaming) {
    // 流式：按健康度依次尝试；一旦已经输出内容就停止换节点，避免正文重影。
    let lastErr = null;
    for (const cand of order) {
      let emitted = false;
      const t0 = Date.now();
      try {
        const r = await llmChatOnce(messages, Object.assign({}, opt, {
          config: cand.config,
          onDelta: (p, f) => { emitted = true; try { opt.onDelta(p, f); } catch (e) { } }
        }));
        llmOk(cand.apiId, Date.now() - t0);
        if (dbgOn) dbgLog({ type: 'llm_result', agent: kindName, ok: true, ms: Date.now() - t0, len: String((r && r.text) || '').length, apiId: cand.apiId });
        return r;
      } catch (e) {
        llmFail(cand.apiId);
        lastErr = e;
        if (dbgOn) dbgLog({ type: 'llm_result', agent: kindName, ok: false, err: String((e && e.message) || e), apiId: cand.apiId });
        if (emitted || /abort|cancel|停止/i.test(String((e && e.message) || ''))) break;
      }
    }
    if (dbgOn) dbgLog({ type: 'llm_result', agent: kindName, ok: false, err: String((lastErr && lastErr.message) || '模型调用失败') });
    throw lastErr || new Error('模型调用失败');
  }
  const attempts = order.length > 1 ? Math.min(3, order.length) : 2;
  let lastErr = null;
  for (let i = 0; i < attempts; i++) {
    const cand = order[i % order.length];
    const t0 = Date.now();
    try {
      const r = await llmChatOnce(messages, Object.assign({}, opt, { config: cand.config }));
      llmOk(cand.apiId, Date.now() - t0);
      if (dbgOn) dbgLog({ type: 'llm_result', agent: kindName, ok: true, ms: Date.now() - t0, len: String((r && r.text) || '').length, apiId: cand.apiId });
      return r;
    } catch (e) {
      llmFail(cand.apiId);
      lastErr = e;
      if (dbgOn) dbgLog({ type: 'llm_result', agent: kindName, ok: false, err: String((e && e.message) || e), apiId: cand.apiId });
      const msg = String((e && e.message) || '');
      if (i >= attempts - 1 || /abort|cancel|停止/i.test(msg)) break;
      await new Promise(r => setTimeout(r, 500));
    }
  }
  if (dbgOn) dbgLog({ type: 'llm_result', agent: kindName, ok: false, err: String((lastErr && lastErr.message) || '模型调用失败') });
  throw lastErr || new Error('模型调用失败');
}
function extractJSON(text) {
  let s = String(text || '').replace(/```json/gi, '```').trim();
  const fenced = s.match(/```([\s\S]*?)```/);
  if (fenced) s = fenced[1];
  // 按出现位置选择 { 或 [，避免数组里的第一个对象被误当成整体
  const cands = [];
  for (const pair of [['{', '}'], ['[', ']']]) {
    const at = s.indexOf(pair[0]);
    if (at >= 0) cands.push([at, pair]);
  }
  cands.sort((a, b) => a[0] - b[0]);
  for (const [start, pair] of cands) {
    let depth = 0, inStr = false, escape = false;
    for (let i = start; i < s.length; i++) {
      const ch = s[i];
      if (inStr) {
        if (escape) escape = false;
        else if (ch === '\\') escape = true;
        else if (ch === '"') inStr = false;
        continue;
      }
      if (ch === '"') { inStr = true; continue; }
      if (ch === pair[0]) depth++;
      else if (ch === pair[1]) {
        depth--;
        if (depth === 0) {
          const raw = s.slice(start, i + 1);
          try { return JSON.parse(raw); } catch (e) { break; }
        }
      }
    }
  }
  return null;
}

/* ---------------- 记忆检索 ---------------- */
function normalizeForScore(t) {
  return String(t || '').toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '');
}
function bigrams(t) {
  const s = normalizeForScore(t);
  const out = [];
  for (let i = 0; i < s.length - 1; i++) out.push(s.slice(i, i + 2));
  if (!out.length && s) out.push(s);
  return out;
}
function keywordScore(query, text) {
  const q = bigrams(query), t = bigrams(text);
  if (!q.length || !t.length) return 0;
  const set = new Set(t);
  let hit = 0;
  for (const g of q) if (set.has(g)) hit++;
  return hit / q.length;
}
function memoryRecency(s, m) {
  const cur = s.instance.currentTime;
  const mins = worldMinutesBetween(m.time, cur);
  if (!mins) return .5;
  const days = mins / 1440;
  return 1 / (1 + days / 14);
}
function retrieveMemories(s, charId, query, limit) {
  const curLoc = characterById(s, charId)?.currentLocation || '';
  const list = s.memories.filter(m => m.charId === charId);
  const scored = list.map(m => {
    let sc = keywordScore(query || '', [m.event, m.location, (m.people || []).join(' ')].join(' ')) * 2.4;
    sc += memoryRecency(s, m) * 0.7 + (m.importance / 10) * 0.9;
    if (m.type === 'semantic') sc += 0.35;
    if (curLoc && m.location && (m.location.includes(curLoc) || curLoc.includes(m.location))) sc += 0.5;
    if (m.timeRange) sc += 0.15;
    return { m, sc };
  });
  scored.sort((a, b) => b.sc - a.sc);
  const out = scored.slice(0, limit).map(x => x.m);
  out.forEach(m => { m.hits = (m.hits || 0) + 1; });
  return out;
}
function retrieveBookmarks(s, charId, query, limit) {
  return s.bookmarks.filter(b => b.charId === charId)
    .map(b => ({ b, sc: keywordScore(query || '', b.question + ' ' + b.answer) + (b.type === 'state' ? .2 : 0) }))
    .sort((x, y) => y.sc - x.sc).slice(0, limit).map(x => x.b);
}
function characterById(s, id) {
  if (id === 'player') return s.player;
  return s.npcs.find(n => n.id === id) || null;
}
function charName(s, id) { const c = characterById(s, id); return c ? c.name : '某人'; }

function addL1(s, roundId, charId, text) {
  s.working.l1.push({ id: uid('l1'), roundId, charId, text: String(text || ''), time: s.instance.currentTime, ts: nowTs() });
  if (s.working.l1.length > 40) s.working.l1 = s.working.l1.slice(-40);
  if (typeof dbgEnabled === 'function' && dbgEnabled() && roundId) dbgLog({ type: 'l1', storyId: s.id, roundId, charId, text: dbgRedact(text, 140) });
}
function getL1(s, charId, limit) {
  return s.working.l1.filter(e => e.charId === charId).slice(-limit).reverse();
}
function addMemory(s, m) {
  const mem = normalizeMemory(m);
  s.memories.unshift(mem);
  if (typeof dbgEnabled === 'function' && dbgEnabled() && mem.roundId) dbgLog({ type: 'memory', storyId: s.id, roundId: mem.roundId, charId: mem.charId, importance: mem.importance, event: dbgRedact(mem.event, 160) });
  if (s.memories.length > 900) {
    s.memories.sort((a, b) => (b.importance + memoryRecency(s, b)) - (a.importance + memoryRecency(s, a)));
    s.memories = s.memories.slice(0, 600);
  }
  return mem;
}
function trimMessages(s) {
  if (!s || !Array.isArray(s.messages) || s.messages.length <= MAX_MESSAGES) return;
  const first = s.messages[0];
  s.messages = [first, ...s.messages.slice(-(MAX_MESSAGES - 1))];
}

function addEvent(s, e) {
  const ev = Object.assign({ id: uid('ev'), time: s.instance.currentTime, category: '格局', title: '', desc: '', importance: 7, location: '', people: [], state: '', roundId: '', stageId: storyModeOn(s) ? s.story.stageId : '', ts: nowTs() }, e);
  s.events.unshift(ev);
  if (s.events.length > 300) s.events = s.events.slice(0, 200);
  return ev;
}
function lastUserRoundId(s) {
  for (let i = (s.messages || []).length - 1; i >= 0; i--) {
    const m = s.messages[i];
    if (m.role === 'user' && m.roundId) return m.roundId;
  }
  return '';
}
function addBookmark(s, b) {
  const bm = Object.assign({ id: uid('bm'), charId: 'player', type: 'concept', question: '', answer: '', time: s.instance.currentTime, roundId: lastUserRoundId(s), ts: nowTs() }, b);
  s.bookmarks.unshift(bm);
  if (s.bookmarks.length > 200) s.bookmarks = s.bookmarks.slice(0, 150);
  return bm;
}
function memoriesOf(s, charId) { return s.memories.filter(m => m.charId === charId); }
function bookmarksOf(s, charId) { return s.bookmarks.filter(b => b.charId === charId); }
