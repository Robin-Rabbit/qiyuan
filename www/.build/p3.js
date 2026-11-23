
/* ============================================================
   三、提示词构造（世界 / 角色 / 天道 / 记忆 / 演化）
   ============================================================ */
function worldMarkdown(s) {
  const w = s.world;
  const lines = [`# 世界设定：${w.name}`];
  if (w.desc) lines.push('', '## 世界描述', w.desc);
  if (w.fields && w.fields.length) {
    lines.push('', '## 设定条目');
    for (const f of w.fields) {
      if (String(f.value || '').includes('\n')) lines.push(`### ${f.path}`, String(f.value));
      else lines.push(`- ${f.path}：${f.value}`);
    }
  }
  if (w.rawMarkdown) lines.push('', '## 补充设定', w.rawMarkdown);
  return lines.join('\n');
}
/* ---------------- 剧情模式：分层可见性 ---------------- */
function stageFieldVisible(s, f) {
  const arc = storyArcOf(s), cur = currentStage(s);
  const meta = (arc && arc.fieldMeta) || {};
  const m = meta[f.path];
  if (!m || !m.visibility || m.visibility === 'public') return true;
  if (m.visibility === 'hidden') return false;
  if (m.visibility === 'stage') {
    if (!m.revealAt) return true;
    return stageOrderOf(s, m.revealAt) <= (cur ? cur.order : 0);
  }
  return true;
}
function stagePublicFields(s) {
  return (s.world.fields || []).filter(f => stageFieldVisible(s, f));
}
/** 已揭示事实：scope 为空视为所有人；NPC 只能看到 scope 含自己 id 的事实。 */
function stageDisclosedFacts(s, scope) {
  if (!storyModeOn(s)) return [];
  const list = (s.story.disclosure && s.story.disclosure.facts) || [];
  if (!scope) return list;
  return list.filter(f => !f.scope || !f.scope.length || f.scope.includes('all') || f.scope.includes(scope));
}
function stageGrowthLines(growth) {
  const out = [];
  const g = growth || {};
  if (g.player && (g.player.start || (g.player.milestones || []).length)) {
    out.push(`玩家：${g.player.start || '（未设定起点）'}`);
    for (const m of g.player.milestones || []) out.push(`- ${m.at ? m.at + '：' : ''}${m.change}`);
  }
  for (const n of g.npcs || []) {
    out.push(`${n.name}${n.role ? '（' + n.role + '）' : ''}`);
    for (const m of n.milestones || []) out.push(`- ${m.at ? m.at + '：' : ''}${m.change}`);
  }
  return out.length ? out.join('\n') : '（本阶段没有强制成长节点）';
}
function stageCognitionBlock(cog) {
  const c = cog || {};
  const lines = [];
  if (c.realm) lines.push(`- 境界 / 能力上限：${c.realm}`);
  if (c.social) lines.push(`- 社会阶层 / 身份：${c.social}`);
  if (c.geography && c.geography.length) lines.push(`- 可触及的地理范围：${c.geography.join('、')}`);
  if (c.knownFactions && c.knownFactions.length) lines.push(`- 已知势力：${c.knownFactions.join('、')}`);
  if (c.forbidden && c.forbidden.length) lines.push(`- 现阶段不可理解 / 不可知道：${c.forbidden.join('；')}`);
  if (c.rumors && c.rumors.length) lines.push(`- 传闻（可能是错误认知）：${c.rumors.join('；')}`);
  return lines.length ? lines.join('\n') : '（未设定明确边界；仍不得知晓未来阶段与未揭示真相）';
}
/** NPC 若配置了自己的认知边界，就在阶段默认边界上做覆盖与叠加。 */
function stageCognitionFor(s, npc) {
  const st = currentStage(s);
  const base = normalizeCognition(st && st.cognition);
  const own = npc && npc.cognition;
  if (!hasCognition(own)) return base;
  return {
    realm: own.realm || base.realm,
    social: own.social || base.social,
    geography: (own.geography && own.geography.length) ? own.geography : base.geography,
    knownFactions: (own.knownFactions && own.knownFactions.length) ? own.knownFactions : base.knownFactions,
    forbidden: Array.from(new Set([...(base.forbidden || []), ...(own.forbidden || [])])),
    rumors: Array.from(new Set([...(base.rumors || []), ...(own.rumors || [])]))
  };
}
const STORY_BUDGET = {
  player: { total: 16000, public: 11000, stage: 3200, facts: 2200, factCount: 36 },
  npc: { total: 9500, public: 6500, stage: 2200, facts: 1400, factCount: 22 }
};
function clipBudget(text, limit, label) {
  const t = String(text || '');
  if (!t || t.length <= limit) return t;
  return t.slice(0, Math.max(0, limit)) + `\n…（${label}已按上下文预算裁剪）`;
}
function fieldsStoryText(fields, query, budget, boost) {
  const all = fields || [];
  if (!all.length) return '（无）';
  const render = f => String(f.value || '').includes('\n') ? `### ${f.path}\n${f.value}` : `- ${f.path}：${f.value}`;
  let list = all;
  if (all.reduce((n, f) => n + render(f).length + 2, 0) > budget) {
    const q = String(query || '');
    const ranked = all.map((f, i) => ({
      f, i,
      sc: (boost ? boost(f) : 0) + (q ? keywordScore(q, f.path + ' ' + f.value) : 0)
    })).sort((a, b) => b.sc - a.sc || a.i - b.i);
    const picked = [];
    let used = 0;
    for (const x of ranked) {
      const len = render(x.f).length + 2;
      if (picked.length && used + len > budget) continue;
      picked.push(x);
      used += len;
      if (used >= budget) break;
    }
    list = picked.sort((a, b) => a.i - b.i).map(x => x.f);
  }
  return clipBudget(list.map(render).join('\n'), budget, '公共设定');
}
function rankedDisclosureFacts(s, scope, query, limit) {
  const list = stageDisclosedFacts(s, scope);
  const n = Math.max(1, limit || 30);
  if (!query) return list.slice(-n);
  const q = String(query);
  return list.map((f, i) => ({
    f, i, sc: keywordScore(q, f.text + ' ' + (f.source || '')) + (f.confidence === 'fact' ? 0.4 : 0)
  })).sort((a, b) => b.sc - a.sc || b.i - a.i).slice(0, n)
    .sort((a, b) => a.i - b.i).map(x => x.f);
}
function disclosureFactsText(facts, budget) {
  if (!facts.length) return '（暂无。除公共常识与当前阶段可见内容外，不得假定任何角色知道更多。）';
  const lines = facts.map(f => {
    const trust = f.confidence === 'rumor' ? '，传闻，可能是错的' : (f.confidence === 'false' ? '，已被证明是错误认知' : '');
    return `- ${f.text}${f.source ? '（来源：' + f.source + trust + '）' : (trust ? '（' + trust.slice(1) + '）' : '')}`;
  });
  return clipBudget(lines.join('\n'), budget, '已揭示事实');
}
/**
 * 剧情模式的世界视图：公共层 + 当前阶段 + 已揭示事实 + 认知边界。
 * 未来阶段与隐藏条目永不进入这里。未开启剧情模式时退回完整世界设定。
 * opt = { npc, scope, query, budget }
 */
function stageViewMarkdown(s, opt) {
  if (!storyModeOn(s)) return worldMarkdown(s);
  const w = s.world, arc = w.storyArc, st = currentStage(s);
  const o = opt || {};
  const npc = o.npc || null;
  const scope = npc ? npc.id : (o.scope || '');
  const query = o.query || ((npc ? (npc.currentGoal || '') : (s.player.currentGoal || '')) + ' ' + (s.player.currentLocation || ''));
  const budget = o.budget || (npc ? STORY_BUDGET.npc : STORY_BUDGET.player);
  const lines = [`# 世界设定：${w.name}`];
  if (w.desc) lines.push('', '## 世界描述', clipBudget(w.desc, 600, '世界描述'));
  const pub = stagePublicFields(s);
  lines.push('', '## 公共设定（当前身份可能知道的常识）');
  const curStage = currentStage(s);
  const boostField = f => {
    const m = (arc.fieldMeta || {})[f.path];
    return (m && m.revealAt && curStage && m.revealAt === curStage.id) ? 1000 : 0;
  };
  lines.push(fieldsStoryText(pub, query, budget.public, boostField));
  if (w.rawMarkdown && arc.includeRaw) {
    lines.push('', '## 补充设定', clipBudget(w.rawMarkdown, Math.max(800, Math.round(budget.public / 3)), '补充设定'));
  }
  if (st) {
    const stageLines = [];
    stageLines.push(`## 当前阶段（第 ${st.order} 阶段）：${st.name}`);
    if (st.summary) stageLines.push(st.summary);
    if (st.span) stageLines.push('', `时间跨度：${st.span}`);
    const delta = (st.settingDelta || []).filter(d => d.visibility !== 'hidden');
    if (delta.length) {
      stageLines.push('', '### 本阶段设定增量');
      for (const d of delta) stageLines.push(`- ${d.path}：${d.value}`);
    }
    if (st.worldEvents && st.worldEvents.length) {
      stageLines.push('', '### 本阶段世界大事（按世界时间自然发生，不强制玩家参与）');
      for (const e of st.worldEvents) {
        stageLines.push(`- ${e.when ? '[' + e.when + '] ' : ''}${e.title}${e.trigger ? '：' + e.trigger : ''}${e.importance ? '（重要度 ' + e.importance + '）' : ''}`);
      }
    }
    stageLines.push('', '### 成长轨迹（预期，不是剧本；玩家偏离时以既成事实为准）');
    stageLines.push(stageGrowthLines(st.growth));
    const cog = npc ? stageCognitionFor(s, npc) : normalizeCognition(st.cognition);
    stageLines.push('', npc ? '### 你的认知边界' : '### 当前认知边界');
    stageLines.push(stageCognitionBlock(cog));
    const cast = st.cast || {};
    if ((cast.allowedTiers || []).length) stageLines.push('', `可出场层级：${cast.allowedTiers.join('、')}`);
    if ((cast.forbidden || []).length) stageLines.push(`本阶段不得直接出场：${cast.forbidden.join('、')}；只能作为传闻、远观或间接影响存在。`);
    lines.push('', clipBudget(stageLines.join('\n'), budget.stage, '当前阶段'));
  }
  const facts = rankedDisclosureFacts(s, scope, query, budget.factCount);
  lines.push('', npc ? '## 你（' + npc.name + '）已经知道的事实' : '## 玩家已经知道的事实');
  lines.push(disclosureFactsText(facts, budget.facts));
  lines.push('', npc
    ? `【信息边界 · 必须遵守】
- 你只知道你亲历、亲眼所见或被人明确告知的事；不得知道玩家已知而你不在场的事。
- 超出当前认知边界的事物，只能以传闻、误解、局部现象、天象或残缺痕迹呈现，不得给出术语化解释。
- 不得提及未来阶段、未揭示真相或本阶段尚未发生的事。`
    : `【信息边界 · 必须遵守】
- 以上是玩家当前阶段能感知的世界。未来阶段、未揭示真相、超出认知边界的内容不得出现，也不得被暗示为已知。
- 遇到超出认知的事物，只能以传闻、误解、局部现象、天象、压迫感或残缺痕迹呈现，不得给出术语化解释。
- 不得让任何角色知道其未亲历、未被明确告知的事。`);
  const out = lines.join('\n');
  if (out.length > budget.total) {
    if (dbgEnabled()) dbgLog({ type: 'stage_budget', storyId: s.id, stageId: s.story.stageId, len: out.length, budget: budget.total, npc: npc ? npc.id : '' });
    return clipBudget(out, budget.total, '世界视图');
  }
  return out;
}
function stageForbiddenCast(s) {
  const cur = currentStage(s);
  if (!cur) return [];
  const arc = storyArcOf(s) || { stages: [] };
  const names = [
    ...((cur.cast && cur.cast.forbidden) || []),
    ...(arc.stages || []).filter(st => st.order > cur.order).flatMap(st => (st.cast && st.cast.forbidden) || [])
  ];
  return Array.from(new Set(names.map(String))).filter(n => n.length >= 2).slice(0, 20);
}
function stageForbiddenTerms(s) {
  const cur = currentStage(s);
  if (!cur) return [];
  const arc = storyArcOf(s) || { stages: [] };
  const later = (arc.stages || []).filter(st => st.order > cur.order).flatMap(st => st.forbiddenTerms || []);
  const set = new Set([...(cur.forbiddenTerms || []), ...later, ...stageForbiddenCast(s)]);
  // 玩家已经知道的事实里出现过的词，说明不再当作禁忌。
  const known = stageDisclosedFacts(s, 'player').map(f => String(f.text || '')).join('\n');
  return Array.from(set).filter(t => t && t.length >= 2 && !known.includes(t)).slice(0, 40);
}
/** 自由模式：完整设定；剧情模式：当前阶段视图。所有 Agent 提示词的唯一世界入口。 */
function storyWorldMarkdown(s, opt) {
  return stageViewMarkdown(s, opt);
}
function sameLocation(a, b) {
  const norm = x => String(x || '').replace(/\s+/g, '').replace(/[，。；;：:、·\-—_]/g, '');
  const A = norm(a), B = norm(b);
  if (!A || !B) return false;
  if (A === B) return true;
  // 「临江客栈前堂」与「临江客栈」这类粗细粒度差异视为同一处
  if (A.includes(B) || B.includes(A)) return Math.min(A.length, B.length) >= 3;
  // 分层路径：前两级一致就算同一片场景
  const seg = x => x.split(/[\/\\>》→]+/).filter(Boolean);
  const sa = seg(A), sb = seg(B);
  if (sa.length > 1 && sb.length > 1) {
    const n = Math.min(sa.length, sb.length);
    for (let i = 0; i < n; i++) if (sa[i] !== sb[i]) return false;
    return n >= 2;
  }
  return false;
}
function fieldsText(s, max) {
  const list = (s.world.fields || []).slice(0, max || 40);
  if (!list.length) return '（未设定）';
  return list.map(f => String(f.value || '').includes('\n') ? `### ${f.path}\n${f.value}` : `- ${f.path}：${f.value}`).join('\n');
}
function charProfile(c, label) {
  if (!c) return '（无）';
  const rows = [
    ['姓名', c.name], ['性别', c.gender], ['年龄', c.age], ['种族', c.race],
    ['外貌', c.appearance], ['职业/身份', c.occupation], ['所属势力', c.faction],
    ['当前位置', c.currentLocation || '未知'], ['性格', c.personality], ['说话风格', c.speechStyle],
    ['习惯', c.habits], ['好恶', c.likesDislikes], ['信念', c.beliefs], ['关键人际关系', c.relationships],
    ['外貌特征', (c.appearanceTraits || []).map(t => t.text).join('；')], ['习惯演化', (c.habitTraits || []).map(t => t.text).join('；')],
    ['能力', c.abilities], ['弱点', c.weaknesses], ['情绪', c.emotion],
    ['健康', c.health], ['随身物品', c.inventory], ['当前目标', c.currentGoal]
  ].filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '');
  const head = label ? `【${label}】` : '';
  let out = head + '\n' + rows.map(([k, v]) => `${k}：${v}`).join('\n');
  if (c.profileMd) out += `\n\n${c.profileMd}`;
  return out;
}
function sceneCharacters(s, exceptId) {
  const loc = s.player.currentLocation;
  const list = [];
  if (exceptId !== 'player' && sameLocation(s.player.currentLocation, loc)) list.push({ c: s.player, id: 'player' });
  for (const n of s.npcs) {
    if (n.id === exceptId) continue;
    if (loc && sameLocation(n.currentLocation, loc)) list.push({ c: n, id: n.id });
  }
  return list;
}
function sceneNPCs(s) {
  const loc = s.player.currentLocation;
  if (!loc || isPlaceholderLocation(s, loc)) return [];
  // 临时配角（auto）不走四通道，由天道叙事直接写他们的言行
  return s.npcs.filter(n => !n.auto && n.currentLocation && sameLocation(n.currentLocation, loc));
}
/** 所有已建档角色的实际位置。叙事与角色推演都以这张表为唯一权威，玩家的话不能覆盖它。 */
function npcLocationRoster(s) {
  const here = s.player.currentLocation || '';
  const rows = (s.npcs || []).filter(n => n && n.name).slice(0, 24).map(n => {
    const known = n.currentLocation && !isPlaceholderLocation(s, n.currentLocation);
    const loc = known ? n.currentLocation : '未知';
    const at = known && sameLocation(n.currentLocation, here) ? '在场' : '不在场';
    return `- ${n.name}：${loc}（${at}）`;
  });
  return rows.length ? rows.join('\n') : '（暂无已建档 NPC）';
}
/** 玩家本回合点名的角色 → 实际位置；用于纠正玩家记错的去向。 */
function mentionedNPCFacts(s, text) {
  const t = String(text || '');
  const here = s.player.currentLocation || '';
  const rows = (s.npcs || []).filter(n => n && n.name && t.includes(n.name)).map(n => {
    const known = n.currentLocation && !isPlaceholderLocation(s, n.currentLocation);
    const loc = known ? n.currentLocation : '未知';
    const present = known && sameLocation(n.currentLocation, here);
    return `- ${n.name}：实际位于「${loc}」，${present ? '当前在场' : '当前不在场'}${present ? '' : '；不得让他/她出现在当前场景或隔空回应'}。`;
  });
  if (!rows.length) return '';
  return `\n【系统事实 · 玩家本回合提到的角色】\n${rows.join('\n')}\n玩家的说法可能是记错、听说或猜测；以上为权威事实，冲突时一律以此为准。\n`;
}
const LOCATION_CLAIM_RULE = `【位置与错误陈述 · 必须遵守】
- 上方「角色位置表」是唯一权威。玩家关于他人所在地的陈述可能是记错、听说、猜测或试探，绝不能据此修改任何角色的位置。
- 玩家说错时，不得让不在场者出现在当前场景，也不得让其隔空回话或「刚巧赶到」。
- 场上有其他角色时，让其中一人自然地纠正玩家（例如「你记错了吧？他今日根本没去那儿」），并可顺带说出位置表里的实际地点；无人时，可写玩家自己反应过来（自语），或写玩家尚未察觉，但叙述本身不得确认其错误说法。
- 只有玩家本人明确动身时，才可写玩家位置变化；回忆、询问、转述他人的去向不算移动。`;
function isPlaceholderLocation(s, loc) {
  if (!loc) return true;
  const t = String(loc).trim();
  if (['起点', '未知', '某处', '世界'].includes(t)) return true;
  return t === s.world.name;
}
function recentDialogue(s, limit) {
  const msgs = s.messages.filter(m => m.text && m.text.trim() && !m.pending && m.kind !== 'note').slice(-limit);
  if (!msgs.length) return '（暂无）';
  return msgs.map(m => {
    const who = m.role === 'user' ? (s.player.name || '玩家') : (m.speaker || (m.role === 'npc' ? 'NPC' : '天道'));
    return `[${m.time || s.instance.currentTime}] ${who}：${clampText(m.text.replace(/\s+/g, ' '), 140)}`;
  }).join('\n');
}
function l1Block(s, charId, limit) {
  const list = getL1(s, charId, limit || 5);
  if (!list.length) return '（暂无）';
  return list.map(e => `- [${e.time}] ${clampText(e.text, 120)}`).join('\n');
}
function l2Block(s, charId, query, limit) {
  const list = retrieveMemories(s, charId, query || s.instance.currentTime, limit || 5);
  if (!list.length) return '（暂无）';
  return list.map(m => `- [${m.time}${m.timeRange ? `（${m.timeRange.start} → ${m.timeRange.end}）` : ''}] ${m.location ? m.location + '，' : ''}${clampText(m.event, 150)}（重要度 ${m.importance}）`).join('\n');
}
function l3Block(s, charId, query, limit) {
  const list = retrieveBookmarks(s, charId, query || '', limit || 5);
  if (!list.length) return '（暂无）';
  return list.map(b => `- 问：${b.question}\n  答：${clampText(b.answer, 150)}`).join('\n');
}
function retrieveEvents(s, query, limit) {
  const q = String(query || '');
  const scored = s.events.map(e => {
    let sc = keywordScore(q, [e.title, e.desc, e.location, (e.people || []).join(' ')].join(' ')) * 2.2;
    sc += memoryRecency(s, e) * 0.5 + (e.importance / 10) * 0.7;
    return { e, sc };
  });
  scored.sort((a, b) => b.sc - a.sc);
  return scored.slice(0, limit).map(x => x.e);
}
function eventsBlock(s, limit, query) {
  const list = query ? retrieveEvents(s, query, limit || 8) : s.events.slice(0, limit || 8);
  if (!list.length) return '（暂无）';
  return list.map(e => {
    const place = e.location ? `@${e.location} ` : '';
    const people = e.people && e.people.length ? `（${e.people.slice(0, 4).join('、')}）` : '';
    const state = e.state ? `；${e.state}` : '';
    return `- [${e.time}]（${e.category}）${place}${e.title || clampText(e.desc, 40)}${people}：${clampText(e.desc, 110)}${state}`;
  }).join('\n');
}
function locationSchema(s) {
  return s.world.locationSchema || '域 → 城/镇 → 场所 → 具体位置（必须写完整的四级地理层级）';
}
function locationBlockInstruction(s, currentLoc) {
  return `【位置块 · 系统元数据】
正文写完后另起一行，严格输出下面三行，不加注释、不加引号、不用箭头：
<<<LOCATION>>>
moved: true 或 false
location: 完整地理层级
<<<END>>>
- moved 只在玩家本段确实移动到新地点时为 true；没有移动时为 false，location 原样重复当前位置。
- 玩家谈论 NPC 的去向、回忆、听说、猜测或提问时，moved 必须为 false；不得把玩家提到的地点当成玩家自己的目的地。
- location 只写最终所在地，禁止写成“A地点→B地点”。
- 位置必须符合层级：${locationSchema(s)}
- 当前玩家位置：${currentLoc || '尚未定位'}。禁止只写世界名、地名泛称或“某处”。
- 这块只给程序读：正文中不得出现 LOCATION、moved、location 等字样，也不得向玩家解释或复述。`;
}

/* ---------------- NPC 四通道 ---------------- */
function npcSystemPrompt(s, npc, actionText) {
  const scene = sceneCharacters(s, npc.id);
  const others = scene.length
    ? scene.map(x => `${x.c.name}${x.id === 'player' ? '（玩家角色）' : '（NPC）'}：${clampText([x.c.occupation, x.c.personality, x.c.emotion].filter(Boolean).join('；'), 90)}`).join('\n')
    : '（此场景暂无其他角色）';
  const query = actionText + ' ' + (npc.currentGoal || '');
  return `你是世界「${s.world.name}」中的 NPC「${npc.name}」。你拥有独立记忆、独立目标与独立判断，不是玩家的附庸。

【1 · 世界设定】
${storyWorldMarkdown(s, { npc, query: actionText + ' ' + (npc.currentGoal || '') })}

【2 · 你的角色档案】
${charProfile(npc, '')}

【2.1 · 你的位置（既定事实）】
你现在位于「${npc.currentLocation || '未知'}」。这是事实，不因玩家的说法而改变。

【3 · 世界规则与地理】
（见【1 · 世界设定】，已完整注入，避免重复）

【4 · 当前同场景角色】
${others}

【5 · 当前世界时间】
${s.instance.currentTime}
禁止编造其他具体钟点；时间描写只能使用模糊表述。

【6 · 最近的对话】
${recentDialogue(s, 5)}

【7 · 你的工作记忆（L1，最近经历）】
${l1Block(s, npc.id, 5)}

【8 · 你的情景记忆（L2，按相关度检索）】
${l2Block(s, npc.id, query, 5)}

【9 · 你的语义记忆 / 书签（L3）】
${l3Block(s, npc.id, query, 5)}

【10 · 你知晓的世界事件（最多 8 条）】
${eventsBlock(s, 8, query)}

【11 · 玩家本回合的行动】
${s.player.name}：「${actionText}」

【四通道输出要求】
只输出一个 JSON 对象，不要 Markdown、不要解释：
{
  "thought": "你的内心判断（只写一句，绝不直接暴露给玩家）",
  "speech": "你说出口的话；没有台词时为空字符串",
  "action": "你做出的具体动作/姿态；没有明显动作时为空字符串",
  "environment": "你感知到的环境变化（光影、气味、声响、天气），一句",
  "moved": false,
  "location": "若你移动了，写完整新位置；否则留空"
}
约束：
- 严格遵守世界设定、你的性格、说话风格、能力与弱点；不得知道未在场事件。
- 不要替玩家行动，不要描写玩家的内心，不要输出选项。
- 若玩家行动不合理，按你的性格与现实逻辑自然回应。
- 玩家可能记错、认错人或故意试探你。关于你或他人的位置、经历，以你的档案、记忆与上方信息为准；玩家说错了就按你的性格纠正或质疑，绝不可因为玩家的话改写自己的位置与记忆。
- moved 只在你本回合真的离开当前场景时为 true；否则必须为 false 且 location 留空。禁止把玩家宣称的位置当成你的新位置。
- 时间、地点、人物必须与上方信息一致。`;
}

/* ---------------- 天道：叙事编织 ---------------- */
function weaveSystemPrompt(s, actionText) {
  return `你是「${s.world.name}」的天道系统，负责把同场景角色的并行行动编织成一段连贯的中文叙事。这是一个完全虚构的互动小说世界，所有角色、地点与事件均为虚构。

【世界设定】
${storyWorldMarkdown(s, { query: actionText })}

【当前世界时间】
${s.instance.currentTime}

【玩家角色】
${charProfile(s.player, '')}

【角色位置表 · 权威】
${npcLocationRoster(s)}
${mentionedNPCFacts(s, actionText)}


【叙事要求】
1. 第三人称叙事，但始终以玩家的感官为锚点；涉及玩家时可用“你”。调动视觉、听觉、嗅觉、味觉、触觉与身体感受。
2. 每次 2-5 段、约 350-800 字；细写当前场景，不急于推进下一幕。
3. 对话、动作、内心与环境交错使用不同词汇，可适度使用拟声词；对话用「」，融合成一个连续场景，不写“角色A说、角色B说”的流水账。
4. 重刻对话、动作与身体细节，让环境氛围可感；直接承接上一条的人物动作、对话或情绪，不要每回都从时间、地点、环境写起，只有进入新场景或确有必要时才交代。
5. 按叙事逻辑安排时序；旁观 NPC 的反应可一笔带过，核心冲突细致描写。
6. 涉及亲密情节时，先以试探、暧昧与情绪铺垫推进，不可突兀切入。
7. 不暴露任何角色的 thought；只写可被感知的言语、动作与环境。
8. 不替玩家做决定，不输出选项，不解释规则，不提到 AI、提示词或系统。
9. 保持人物性格、已知信息与已发生事件一致；玩家行动不可能时用世界逻辑自然回应。
10. 玩家点名、提问或说话时，**在场的**被点名者必须用「」回应至少一句；不在场者不得出现、不得代答，也不得被写成“恰好在场”。
11. 可以顺带写入 1–2 名次要角色（有身份与台词）让场景有人气，但不得凭空引入重要角色或让 NPC 知道不该知道的事。
12. 场景里可以出现不建档的临时次要角色；他们的台词、动作、神态由你直接叙述，不进入角色档案，也不能成为主线人物或替代在场 NPC。

${LOCATION_CLAIM_RULE}

${s.world.tiandaoPrompt ? `【世界创建者附加指令】\n${s.world.tiandaoPrompt}\n` : ''}【禁止事项】
- 除进入新场景或确有必要，不得在开头重复交代时间、地点与环境。
- 禁止与当前场景无关的背景铺陈、总结性陈述与抽象概念。
- 开头与结尾不得出现总结句、提示或警告。
- 结尾不得使用“似乎 / 等待 / 建议 / 期待”等暗示读者回应的词。
- 不得出现现代网络用语、游戏术语与元叙事。
- 不得让 NPC 凭空知道不在场的信息。
- 不得在没有依据时改变地理、势力或力量体系。

${locationBlockInstruction(s, s.player.currentLocation)}`;
}
function weaveUserPrompt(s, actionText, reactions, lastNarrative) {
  let out = `[玩家行动] ${s.player.name}：「${actionText}」\n\n`;
  for (const r of reactions) {
    if (r.action) out += `[${r.name}的动作] ${r.action}\n`;
    if (r.speech) out += `[${r.name}的台词] ${r.speech}\n`;
    if (r.environment) out += `[${r.name}感知到的环境] ${r.environment}\n`;
    out += '\n';
  }
  if (lastNarrative) out += `【上一段叙事（仅用于衔接，不要重复）】\n${clampText(lastNarrative, 700)}\n\n`;
  out += `请编织这一段叙事，并在正文后输出位置块。`;
  return out;
}
function soloSystemPrompt(s, actionText) {
  return `你是「${s.world.name}」的天道系统。当前场景没有已建档的 NPC 在身边。按玩家的行动推进叙事：独处就写独处；玩家在与人说话、或身处客栈、集市这类有人的场所时，必须让在场者回应。

【世界设定】
${storyWorldMarkdown(s, { query: actionText })}

【当前世界时间】
${s.instance.currentTime}

【玩家角色】
${charProfile(s.player, '')}

【角色位置表 · 权威】
${npcLocationRoster(s)}
${mentionedNPCFacts(s, actionText)}


【写作要求】
1. 2-3 段，约 250-500 字，第三人称/第二人称皆可，重在环境、细节与玩家的感官（视觉、听觉、嗅觉、味觉、触觉与身体感受）。
2. 直接承接上一条的动作或情绪，除进入新场景，不要每段开头都交代时间、地点与环境。
3. 可以出现远处的人声、动物、天气、物件变化；需要时最多引入 1–2 名次要角色（有身份、有外貌、有台词，最好有名字），但不要凭空引入重要角色、主线人物或势力首领。
4. 玩家行动里**对在场者**有引语、点名或明确提问时，必须有角色用「」开口回应至少一句；玩家提到的角色不在场时，不得让其出现或隔空回应。
5. 不建档的临时次要角色可以直接叙述；他们不进入角色档案，不能成为主线人物。
6. 不替玩家做决定，不输出选项，不解释规则；不写总结句、提示或警告，结尾不用“似乎 / 等待 / 建议 / 期待”等暗示回应的词。

${LOCATION_CLAIM_RULE}

${locationBlockInstruction(s, s.player.currentLocation)}`;
}
function soloUserPrompt(s, actionText) {
  return `[玩家行动] ${s.player.name}：「${actionText}」\n\n请推进这一段。`;
}

/* ---------------- NPC 自主行为 ---------------- */
function autonomousSystemPrompt(s, npc, sceneNPCsList) {
  const others = sceneNPCsList.length
    ? sceneNPCsList.map(x => `${x.name}：${clampText([x.occupation, x.emotion, x.currentGoal].filter(Boolean).join('；'), 80)}`).join('\n')
    : '（无其他角色）';
  return `你是世界「${s.world.name}」中的 NPC「${npc.name}」。世界时间正在自行流逝，玩家此刻没有行动。请让这个角色按自己的目标与性格自主行动一小段。

【世界设定】
${storyWorldMarkdown(s, { npc, query: (npc.currentGoal || '') + ' ' + (npc.currentLocation || '') })}

【你的角色档案】
${charProfile(npc, '')}

【当前世界时间】
${s.instance.currentTime}
禁止编造其他具体钟点；时间描写只能用模糊表述。

【当前同场景角色】
${others}

【你的工作记忆 L1】
${l1Block(s, npc.id, 5)}

【你的情景记忆 L2】
${l2Block(s, npc.id, npc.currentGoal || '', 5)}

【你的语义记忆 L3】
${l3Block(s, npc.id, npc.currentGoal || '', 5)}

【你知晓的世界事件】
${eventsBlock(s, 6, npc.currentGoal + ' ' + (npc.currentLocation || ''))}

【写作要求】
1. 写 1-2 段、约 120-260 字的第三人称叙事，只描写你（${npc.name}）的言行与周围环境。
2. 不要替玩家行动，不要与玩家对话（玩家不在场时）。
3. 行动应服务于你的 currentGoal，但不要每次都有重大进展；日常行为是常态。
4. 文风与世界一致，不出现游戏术语或元叙事；直接承接当前场景，除进入新场景，不重复交代时间、地点与环境。

${locationBlockInstruction(s, npc.currentLocation)}`;
}

/* ---------------- 记忆抽取 ---------------- */
function memoryExtractPrompt(s, narrative, actionText, participants) {
  const sys = `你是记忆系统。请从刚发生的一段故事中抽取角色记忆。只输出 JSON 数组，不要解释。

规则：
- subject 只能是 "player"（${s.player.name}）或以下 NPC 的 id：
${participants.filter(p => p !== 'player').map(p => `  ${p} = ${charName(s, p)}`).join('\n') || '  （无）'}
- 每条记忆必须含：subject、time（当前世界时间，原样）、location（完整地点）、people（在场人物名数组）、event（一件具体的事，20-60 字，写清谁做了什么）、importance（1-10）。
- importance：7-10 只给重大转折/伤亡/关系破裂/境界突破/重大秘密揭露；日常对话 3-5。
- 只记录该角色亲历或亲眼所见的事；未在场的信息不要写入。${storyModeOn(s) ? `\n- 当前处于剧情阶段：${storyStageLabel(s)}。不得把超出该阶段认知边界、或角色未被明确告知的真相写成记忆。` : ''}
- 最多 4 条；没有值得记的就输出 []。`;
  const user = `当前世界时间：${s.instance.currentTime}
玩家位置：${s.player.currentLocation || '未知'}
玩家行动：${s.player.name}：「${actionText}」

叙事：
${narrative}`;
  return { system: sys, user };
}
function bookmarkPrompt(s, charId) {
  const mems = memoriesOf(s, charId).slice(0, 16);
  const old = bookmarksOf(s, charId).slice(0, 8);
  return {
    system: `你是记忆系统的语义整理器。请从情景记忆中抽象出稳定的知识/信念，维护“书签记忆”。
只输出 JSON 数组，每项：
{"type":"concept|state|behavioral","question":"一个具体的问题","answer":"基于记忆的简洁回答（30-80字）"}
- concept：世界规则、体系、常识；state：某人当前所在/状态/关系；behavioral：某角色面对某类情境的典型反应。
- 3-5 条；不得编造记忆中没有依据的内容。`,
    user: `角色：${charName(s, charId)}（${charId}）
现有书签：
${old.map(b => `- [${b.type}] ${b.question} → ${b.answer}`).join('\n') || '（无）'}

最近情景记忆：
${mems.map(m => `- [${m.time}] ${m.event}`).join('\n') || '（无）'}`
  };
}
function evolutionPrompt(s, c, charId) {
  const mems = memoriesOf(s, charId).filter(m => m.importance >= 7).slice(0, 8);
  return {
    system: `你是角色演化评估器。根据角色近期的高重要性经历，判断其人格、目标、情绪、能力是否发生持久变化。
只输出 JSON：
{"should_evolve":true/false,"change_type":"personality|goal|emotion|belief|ability|relationship|appearance|habit|none","description":"一句话说明变化","personality_change":"","goal_change":"","emotion":"","belief_change":"","abilities_change":"","relationships_change":"","appearance_change":"","habit_change":"","trigger_reason":""}
- 只有真正足以改变一个人的事件才 should_evolve=true；日常经历一律 false。
- 未变化的字段留空字符串。不得凭空增加能力。`,
    user: `角色：\n${charProfile(c, '')}\n\n近期高重要性记忆：\n${mems.map(m => `- [${m.time}] ${m.event}（重要度 ${m.importance}）`).join('\n')}\n\n行为书签：\n${bookmarksOf(s, charId).filter(b => b.type === 'behavioral').slice(0, 4).map(b => `- ${b.question} → ${b.answer}`).join('\n') || '（无）'}`
  };
}
function significancePrompt(s, narrative, kind) {
  const worldSummary = clampText(storyWorldMarkdown(s), 1600);
  return {
    system: `你是世界事件簿的记录官。世界事件簿只记录对世界产生持久、根本性影响的重大变化，严格限定四类：
1. 世界地理的重大变化（山崩地裂、河流改道、城市建立/毁灭）
2. 文化/信仰/传统的重大变革（新信仰、旧传统消亡、重要典籍断绝或出世）
3. 修炼体系/世界法则的重大变革（新体系、境界范式突破、法则改变）
4. 重大认知/格局变化（势力结盟/宣战、角色背叛/觉醒/陨落、重要地点被发现）

以下一律不记：日常行为、闲聊、个人情绪、小摩擦、对既有事件的重复描述。
宁可漏记也不错记。

只输出 JSON：
{"significant":true/false,"category":"地理|文化|法则|格局","title":"不超过18字","desc":"40-80字，写清变化与影响","importance":1-10,"location":"发生地点的完整层级","people":["涉及人物"],"state":"世界/角色状态的具体变化"}`,
    user: `当前世界时间：${s.instance.currentTime}
类型：${kind || '玩家互动'}
世界设定摘要：${worldSummary}

待判定叙事：
${narrative}`
  };
}
function gapPrompt(s, from, to, subject, role) {
  const c = role === 'player' ? s.player : characterById(s, role);
  return {
    system: `你是记忆空洞填补器。玩家跳过了或离开了「${from}」到「${to}」这段时间。请为指定角色生成一段合理的经历记忆，保持世界一致性与角色一致性。

只输出 JSON：
{"event":"60-120字，写清该角色在这段时间里做了什么、遇到什么","location":"结束时所在完整地点","people":["相关人物"],"importance":1-10,"state":"可选：修为/年龄/伤势/关系等状态变化，没有则空字符串"}`,
    user: `角色：${charName(s, role)}\n${charProfile(c, '')}\n\n时间段：${from} → ${to}\n\n该角色此前记忆：\n${l2Block(s, role, subject || '', 5)}\n\n世界设定：\n${clampText(storyWorldMarkdown(s), 1400)}`
  };
}
function startLocationPrompt(s) {
  return {
    system: `你是天道系统。请根据世界地理、玩家角色的身份与当前时间，为玩家生成一个合理、具体的起始位置。
只输出 JSON：{"location":"完整地理层级","reason":"一句话依据"}
要求：必须符合层级「${locationSchema(s)}」；不得只写世界名；应与角色身份相符，并留出可互动的场景。`,
    user: `世界：\n${clampText(storyWorldMarkdown(s), 1800)}\n\n玩家角色：\n${charProfile(s.player, '')}\n\n当前世界时间：${s.instance.currentTime}`
  };
}
function welcomePrompt(s) {
  return {
    system: `你是「${s.world.name}」的天道系统。玩家角色刚刚进入世界，请写一段开场叙事。

【世界设定】
${storyWorldMarkdown(s, { query: (s.player.currentGoal || '') + ' ' + (s.player.currentLocation || '') })}

【当前世界时间】
${s.instance.currentTime}

【玩家角色】
${charProfile(s.player, '')}

【玩家当前位置】
${s.player.currentLocation || '尚未定位'}

【要求】
1. 3-4 段、约 350-600 字；从玩家当前位置的具体感官细节切入。
2. 至少让一个同场景 NPC 自然出现并有一句台词或动作；不要介绍所有人。
3. 不替玩家做决定，不输出选项。结尾留一个可行动的钩子。

${locationBlockInstruction(s, s.player.currentLocation)}`,
    user: '请写出玩家进入世界后的开场。'
  };
}

function disclosureExtractPrompt(s, narrative, actionText, participants) {
  const known = rankedDisclosureFacts(s, 'player', '', 40).map(f => '- ' + f.text).join('\n') || '（无）';
  const ids = participants.map(id => `${id} = ${charName(s, id)}`).join('\n');
  return {
    system: `你是剧情披露账本的抽取器。请判断本轮故事里，哪些角色**第一次真正知道**了某件此前不知道的事。
只输出 JSON 数组，每项：
{"fact":"一件可复述的具体事实（15-60字）","source":"通过谁/什么得知","scope":["player"或NPC id],"confidence":"fact|rumor|false"}
规则：
- 只记录本轮叙事中明示或直接暗示“得知”的内容；猜测、推断、玩家自己说出口但无人证实的内容标为 rumor 或 false。
- 常识、已经在账本里的事实、角色本来就该知道的事不要重复记录。
- scope 只能是：${ids || 'player'}
- 最多 3 条；没有就输出 []。
- 不得把超出当前阶段认知边界的世界真相写成角色已知。`,
    user: `当前阶段：${storyStageLabel(s)}
玩家行动：${s.player.name}：「${actionText}」
本轮叙事：
${narrative}

账本已有事实：
${known}`
  };
}
async function extractDisclosures(s, narrative, actionText, participants, roundId, token) {
  if (!storyModeOn(s) || !narrative || s.story.autoDisclose === false) return [];
  const kind = hasOwnLLM('memory', s) ? 'memory' : 'tiandao';
  if (!hasLLM(kind, s)) return [];
  const alive = () => (!roundId || s.messages.some(m => m.roundId === roundId)) && (!token || s.messages.some(m => m.id === token));
  try {
    const p = disclosureExtractPrompt(s, narrative, actionText, participants);
    const res = await llmChat([
      { role: 'system', content: p.system },
      { role: 'user', content: p.user }
    ], { kind, story: s, maxTokens: 520, temperature: 0.3, stream: false });
    const arr = extractJSON(res.text || '');
    if (!Array.isArray(arr) || !alive()) return [];
    const added = [];
    for (const x of arr.slice(0, 3)) {
      if (!x || !x.fact) continue;
      const scope = (Array.isArray(x.scope) ? x.scope : ['player']).map(v => {
        const t = String(v);
        if (t === 'all') return 'all';
        const byId = s.npcs.find(n => n.id === t);
        if (byId) return byId.id;
        const byName = s.npcs.find(n => n.name === t);
        return byName ? byName.id : (t === '玩家' ? 'player' : t);
      }).filter(Boolean);
      const f = addDisclosureFact(s, {
        text: clampText(String(x.fact), 160),
        source: clampText(String(x.source || '剧情'), 60),
        scope: scope.length ? scope : ['player'],
        confidence: ['fact', 'rumor', 'false'].includes(x.confidence) ? x.confidence : 'fact',
        stageId: s.story.stageId
      });
      if (f) added.push(f);
    }
    if (added.length) {
      if (dbgEnabled()) dbgLog({ type: 'disclosure_auto', storyId: s.id, stageId: s.story.stageId, roundId, facts: added.map(f => ({ text: dbgRedact(f.text, 120), scope: f.scope, confidence: f.confidence })) });
      saveDB();
      if (s.id === DB.activeId) renderLeft();
    }
    return added;
  } catch (e) { return []; }
}

/* ============================================================
   三·二、剧情模式：运行引擎（披露 / 阶段推进 / 剧透护栏）
   ============================================================ */
function addDisclosureFact(s, raw) {
  if (!s || !s.story) return null;
  const f = normalizeDisclosureFact(Object.assign({
    learnedAt: s.instance.currentTime,
    stageId: s.story.stageId
  }, raw || {}));
  if (!f.text) return null;
  const list = s.story.disclosure.facts;
  if (list.some(x => x.text === f.text && (x.scope || []).join('|') === (f.scope || []).join('|'))) return null;
  list.push(f);
  if (list.length > 400) list.splice(0, list.length - 400);
  saveDB();
  return f;
}
/** 当前阶段里「有事件锚点且事件已发生」的揭示，自动写入披露账本。 */
function syncStageReveals(s) {
  if (!storyModeOn(s)) return 0;
  const cur = currentStage(s);
  if (!cur) return 0;
  let n = 0;
  for (const rv of cur.reveals || []) {
    if (!rv.event) continue;
    const happened = (s.events || []).some(e =>
      (e.id && e.id === rv.event) || (e.title && e.title.includes(rv.event)) || (e.desc && e.desc.includes(rv.event)));
    if (!happened) continue;
    if (addDisclosureFact(s, {
      text: rv.fact, source: rv.via || '亲历', scope: rv.scope,
      confidence: rv.confidence, stageId: cur.id
    })) n++;
  }
  if (n && dbgEnabled()) dbgLog({ type: 'disclosure', storyId: s.id, stageId: cur.id, added: n });
  return n;
}
function stageCondMet(s, c) {
  if (!c) return false;
  if (c.manual) return false;
  if (c.worldMinutes > 0) {
    const base = s.world.startTime || s.instance.startTime || s.instance.currentTime;
    if (worldMinutesBetween(base, s.instance.currentTime) >= c.worldMinutes) return true;
  }
  if (c.event) {
    const q = String(c.event);
    if ((s.events || []).some(e => (e.id && e.id === q) || (e.title && e.title.includes(q)) || (e.desc && e.desc.includes(q)))) return true;
  }
  if (c.realm && String(s.player.abilities || '').includes(c.realm)) return true;
  if (c.location && sameLocation(s.player.currentLocation, c.location)) return true;
  return false;
}
function stageCanAdvance(s) {
  const cur = currentStage(s);
  if (!cur) return false;
  const any = (cur.exit && cur.exit.any) || [];
  return any.some(c => stageCondMet(s, c));
}
function stageExitLabel(st) {
  const any = (st && st.exit && st.exit.any) || [];
  if (!any.length) return '仅手动推进';
  return any.map(c => {
    if (c.manual) return '手动';
    if (c.worldMinutes) return `世界时间 +${Math.round(c.worldMinutes / 1440)} 天`;
    if (c.event) return `事件「${c.event}」`;
    if (c.realm) return `达到 ${c.realm}`;
    if (c.location) return `抵达 ${c.location}`;
    return '';
  }).filter(Boolean).join(' 或 ');
}
/** 推进到下一阶段。只前进一步；过去的历史不再改写。 */
function advanceStage(s, opt) {
  const o = opt || {};
  const cur = currentStage(s);
  if (!cur) return false;
  const arc = storyArcOf(s);
  const target = o.to ? stageById(s, o.to) : (arc.stages.find(st => st.order === cur.order + 1) || null);
  if (!target) { toast('已经是最后一个阶段', false); return false; }
  if (!o.force && !o.manual && !stageCanAdvance(s)) return false;
  syncStageReveals(s);
  const hist = s.story.stageHistory;
  const last = hist[hist.length - 1];
  if (last && last.stageId === cur.id && !last.to) last.to = s.instance.currentTime;
  hist.push({ stageId: target.id, from: s.instance.currentTime, to: '' });
  if (hist.length > 60) hist.splice(0, hist.length - 60);
  s.story.stageId = target.id;
  s.story.stageEnteredAt = s.instance.currentTime;
  s.story.planStatus = 'ok';
  s.messages.push({
    id: uid('m'), role: 'system', kind: 'stage',
    text: `阶段推进：第${cur.order}阶段「${cur.name}」→ 第${target.order}阶段「${target.name}」`,
    ts: nowTs(), time: s.instance.currentTime, roundId: ''
  });
  if (dbgEnabled()) dbgLog({ type: 'stage', storyId: s.id, from: cur.id, to: target.id, fromName: cur.name, toName: target.name, at: s.instance.currentTime });
  saveDB();
  if (!o.silent) toast('进入第' + target.order + '阶段：' + target.name);
  return true;
}
/** 自动推进：条件满足时先给出无剧透预览，由玩家确认；force=true 时立即推进（手动/测试）。 */
async function maybeAdvanceStage(s, force) {
  if (!storyModeOn(s) || !s) return false;
  if (generating && !force) return false;
  if (!stageCanAdvance(s)) return false;
  if (s.story.autoAdvance === false && !force) return false;
  const nxt = nextStage(s);
  if (!nxt) return false;
  if (!force) return offerStageAdvance(s);
  if (nxt.detailStatus !== 'detailed' && hasLLM('tiandao', s)) {
    try { await detailStage(s, nxt.id); } catch (e) { }
  }
  const ok = advanceStage(s, { to: nxt.id, force: true });
  if (ok) recheckArcConsistency(s).catch(() => { });
  return ok;
}
/** 条件满足时给出“无剧透预览”，玩家确认后才换阶段。 */
function offerStageAdvance(s) {
  const cur = currentStage(s), nx = nextStage(s);
  if (!cur || !nx) return false;
  if (overlayStack && overlayStack.length) return false;
  const key = cur.id + ':' + nx.id;
  if (s.story.advanceOfferedStage === key) return false;
  s.story.advanceOfferedStage = key;
  s.story.pendingStageId = nx.id;
  saveDB();
  if (s.id === DB.activeId) { try { renderLeft(); } catch (e) { } }
  setTimeout(() => {
    openDialog({
      title: `阶段条件已满足：进入「${esc(nx.name)}」？<br><span style="font-size:12px;color:#bdbdbd">${esc(nx.summary ? clampText(nx.summary, 140) : '')}<br><br>会解锁新的世界层面内容，但不会列出具体秘密。进入后上一阶段设定不再注入；已发生的事实与记忆保留。</span>`,
      ok: '进入', cancel: '稍后',
      onOk: async () => {
        if (nx.detailStatus !== 'detailed' && hasLLM('tiandao', s)) {
          try { toast('正在细化下一阶段…'); await detailStage(s, nx.id); } catch (e) { }
        }
        advanceStage(s, { to: nx.id, force: true });
        renderAll();
        recheckArcConsistency(s).then(() => { if (s.id === DB.activeId) { renderLeft(); renderRight(); } }).catch(() => { });
      }
    });
  }, 300);
  return true;
}
/** 玩家行为或叙事越过当前阶段时，标记规划已偏离；不自动改写过去。 */
function stageDeviationSignals(s, text) {
  if (!storyModeOn(s) || !text) return [];
  const cur = currentStage(s);
  const reasons = [];
  const hits = scanSpoilers(s, text);
  if (hits.length) reasons.push('出现了当前阶段不该知道的词：' + hits.join('、'));
  const cast = stageForbiddenCast(s).filter(n => String(text).includes(n));
  if (cast.length) reasons.push('本阶段不应直接出场：' + cast.join('、'));
  const future = (storyArcOf(s).stages || []).filter(st => cur && st.order > cur.order)
    .flatMap(st => st.worldEvents || []).map(e => e.title).filter(t => t && t.length >= 3);
  const early = Array.from(new Set(future)).filter(t => String(text).includes(t));
  if (early.length) reasons.push('提前触及后续阶段事件：' + early.join('、'));
  return reasons;
}
function markPlanStale(s, reasons) {
  if (!s || !s.story) return false;
  const was = s.story.planStatus === 'stale';
  s.story.planStatus = 'stale';
  if (!was) {
    s.messages.push({
      id: uid('m'), role: 'system', kind: 'stale',
      text: `剧情偏离：${reasons.slice(0, 2).join('；')}。后续阶段可能需要重规划。`,
      ts: nowTs(), time: s.instance.currentTime, roundId: ''
    });
    if (dbgEnabled()) dbgLog({ type: 'deviation', storyId: s.id, stageId: s.story.stageId, reasons });
    saveDB();
  }
  return !was;
}
/** 偏离后每个阶段只提示一次重规划，避免反复打扰。 */
function offerReplan(s) {
  if (!storyModeOn(s) || !s || s.story.planStatus !== 'stale') return false;
  if (overlayStack && overlayStack.length) return false;
  const key = s.story.stageId || 'st';
  if (s.story.replanOfferedStage === key) return false;
  s.story.replanOfferedStage = key;
  saveDB();
  setTimeout(() => {
    openDialog({
      title: '检测到剧情已偏离阶段规划<br><span style="font-size:12px;color:#bdbdbd">过去已经发生的事实不会改写；可以只重规划当前之后的阶段，让世界重新自洽。</span>',
      ok: '重规划后续', cancel: '稍后',
      onOk: async () => {
        try {
          toast('正在重规划后续阶段…');
          await replanFutureStages(s);
          await recheckArcConsistency(s);
          renderAll();
          toast('后续阶段已按当前进度重规划');
        } catch (e) { toast('重规划失败：' + e.message, false); }
      }
    });
  }, 420);
  return true;
}
function scanSpoilers(s, text) {
  if (!storyModeOn(s) || !text) return [];
  const hits = new Set();
  for (const t of stageForbiddenTerms(s)) if (String(text).includes(t)) hits.add(t);
  const cur = currentStage(s);
  for (const st of (storyArcOf(s).stages || [])) {
    if (!cur || st.order <= cur.order) continue;
    const nm = String(st.name || '').trim();
    if (nm.length >= 3 && String(text).includes(nm)) hits.add(nm);
  }
  return Array.from(hits);
}
function stripSpoilerSentences(text, hits) {
  const parts = String(text || '').split(/(?<=[。！？!?…])/);
  const kept = parts.filter(p => !hits.some(h => p.includes(h)));
  const out = kept.join('').trim();
  return out.length >= 40 ? out : '';
}
function spoilerRewritePrompt(s, text, hits) {
  return {
    system: `你是剧情信息边界守卫。下面这段叙事出现了当前阶段还不该被直接说出、命名的概念：${hits.join('、')}。
请重写这段叙事：保留原有情节、动作、对话与人物的意图，但把这些概念改写为传闻、误解、局部现象、天象、压迫感或残缺痕迹，绝不直接命名，也不解释它们是什么。
只输出重写后的正文，不要解释，不要加标题，不要输出位置块。`,
    user: `当前阶段：${storyStageLabel(s)}\n\n原文：\n${text}`
  };
}
/** 生成后剧透护栏：先尝试一次去剧透重写，失败则删掉命中句。 */
async function runSpoilerGuard(s, text) {
  const hits = scanSpoilers(s, text);
  if (!hits.length) return { text, hits, action: 'none' };
  let out = '', action = '';
  if (hasLLM('tiandao', s)) {
    try {
      const p = spoilerRewritePrompt(s, text, hits);
      const res = await llmChat([
        { role: 'system', content: p.system },
        { role: 'user', content: p.user }
      ], { kind: 'tiandao', story: s, maxTokens: 1600, temperature: 0.65, stream: false });
      const cand = String((res && res.text) || '').trim();
      if (cand && !scanSpoilers(s, cand).length) { out = cand; action = 'rewrite'; }
    } catch (e) { }
  }
  if (!out) {
    out = stripSpoilerSentences(text, hits);
    action = out ? 'strip' : 'keep';
  }
  if (!out) out = text;
  if (dbgEnabled()) dbgLog({ type: 'spoiler_guard', storyId: s.id, stageId: s.story.stageId, hits, action });
  return { text: out, hits, action };
}

/* ============================================================
   三·三、剧情模式：规划器（世界审计 / 阶段骨架 / 细化 / 校对）
   ============================================================ */
function worldAuditPrompt(s) {
  const paths = (s.world.fields || []).map(f => f.path);
  return {
    system: `你是剧情规划器的「世界审计」模块。任务：判断世界设定里每一条信息，在故事开始时是否应该被玩家和普通角色知道。
只输出 JSON：
{
  "public_lore": ["开局即可公开的条目 path"],
  "field_meta": { "条目 path": { "visibility": "public|stage|hidden", "reveal_at": "阶段 id，可留空" } },
  "notes": ["哪些条目天然剧透、建议如何拆分的简短说明"]
}
判定标准：
- public：世界公理、地理常识、公开历史、普通人知道的传闻。
- stage：某一阶段才会解锁的真相、高阶体系、势力内幕；reveal_at 填解锁阶段 id（暂用 st1、st2…）。
- hidden：终局真相、幕后黑手、主角身世等，永不作为已知信息注入。
- 不得改写任何设定原文，只做分类。宁可把可疑内容放进 stage，也不要放进 public。`,
    user: `世界名称：${s.world.name}
世界描述：${s.world.desc || '（无）'}
条目路径：
${paths.map(p => '- ' + p).join('\n') || '（无）'}

完整设定：
${clampText(worldMarkdown(s), 12000)}`
  };
}
function arcSkeletonPrompt(s, audit, requirement) {
  const pub = audit && Array.isArray(audit.public_lore) ? audit.public_lore.join('、') : '（未分类）';
  const req = String(requirement || '').trim();
  return {
    system: `你是剧情规划器的「阶段骨架」模块。请为一个长线互动世界设计 3–5 个阶段。阶段是软规划，不是强制剧本；玩家可以偏离，世界必须自洽。
只输出一个 JSON 对象，不要 Markdown、不要解释：
{
  "logline": "一句话概括整条剧情线（不超过 40 字）",
  "stages": [
    {
      "name": "阶段名（2–8 字）",
      "summary": "本阶段玩家所处位置、核心冲突与可感知的世界状态（60–110 字）",
      "span": "大致时间跨度，如 第 1–30 日",
      "exit": { "any": [ { "worldMinutes": 43200 }, { "event": "关键事件名" } ] },
      "cognition": {
        "realm": "当前境界/能力上限", "social": "社会阶层与身份",
        "geography": ["可触及地点"], "known_factions": ["已知势力"],
        "forbidden": ["现阶段不可理解或不可知道的事"], "rumors": ["可能是错的传闻"]
      },
      "cast": { "allowed_tiers": ["可出场层级"], "forbidden": ["本阶段不得直接出场的角色/势力"] },
      "world_events": [ { "title": "事件名", "when": "第 10–20 日", "trigger": "触发方式", "importance": 6 } ],
      "forbidden_terms": ["一旦出现就会剧透的具体词"]
    }
  ]
}
硬性要求：
- 只写骨架，不要写 setting_delta、growth、reveals；这些会在后续「细化」时补齐。
- 第一阶段必须贴合玩家当前身份与已知信息，不得出现后期真相。
- 认知边界逐阶段放宽：境界、阶层、地理、势力、人际五个轴都要写。
- forbidden_terms 要具体（人名、地名、术语），不要写抽象描述。
- 每个阶段至少有一个 exit 条件；worldMinutes 从故事开始累计。
- stages 必须是数组；即使只有一个阶段也要用数组。`,
    user: `世界名称：${s.world.name}
世界描述：${s.world.desc || '（无）'}
开局公开条目：${pub}
玩家当前身份：${s.player.occupation || '未设定'}；能力：${s.player.abilities || '未设定'}；目标：${s.player.currentGoal || '未设定'}
当前世界时间：${s.instance.currentTime}
世界设定：
${clampText(worldMarkdown(s), 7000)}${req ? `

玩家对整条剧情的明确要求（在不违背世界基础设定与已发生事实的前提下优先满足）：
${req}` : ''}`
  };
}
function stageDetailPrompt(s, st) {
  return {
    system: `你是剧情规划器的「阶段细化」模块。请把下面这个阶段骨架细化成可直接运行的阶段设定。保持阶段名、顺序与总体意图不变，只补细节。
只输出 JSON：{"stage": {与骨架相同的字段结构，但更具体}}
要求：
- summary 写成当前阶段可感知的世界状态（120–220 字），不得写未来阶段。
- setting_delta 给出 3–6 条本阶段专属设定。
- world_events 给出 2–4 个本阶段可能发生的大事，含触发方式。
- growth 给出玩家与 1–3 位关键 NPC 的预期节点（软规划）。
- cognition 五轴写清楚，forbidden 至少 3 条。
- forbidden_terms 给出 3–8 个具体禁忌词。
- 不得与已发生事实冲突。
- 若玩家对本阶段有明确要求，必须优先满足；不得用模板化内容忽略它。`,
    user: `世界：${s.world.name}
当前阶段骨架：
${JSON.stringify(st, null, 2)}
玩家对本阶段的要求：${st.userBrief || '（无）'}
整体剧情要求：${(s.world.storyArc && s.world.storyArc.userBrief) || '（无）'}
玩家当前状态：${charProfile(s.player, '')}
当前世界时间：${s.instance.currentTime}
世界设定（当前可见）：
${clampText(storyWorldMarkdown(s), 7000)}`
  };
}
function arcCheckPrompt(s) {
  return {
    system: `你是剧情规划器的「一致性校对」模块。检查阶段之间、阶段与玩家档案之间是否有矛盾或剧透风险。
只输出 JSON：
{"ok": true/false, "issues": [{"stage":"阶段名","problem":"问题","fix":"建议修正"}]}
只报真正的问题：未来信息漏进早期阶段、成长节点与角色档案冲突、事件与时间线冲突、认知边界跳级。没有就 ok=true、issues=[]。`,
    user: `玩家档案：${charProfile(s.player, '')}
阶段规划：
${JSON.stringify((s.world.storyArc || {}).stages || [], null, 2)}`
  };
}
function uniqueStageIds(stages) {
  const used = new Set();
  stages.forEach((st, i) => {
    let id = st.id || ('st' + (i + 1));
    if (used.has(id)) id = 'st' + (i + 1);
    let k = 2;
    while (used.has(id)) { id = 'st' + (i + 1) + '_' + k; k++; }
    used.add(id);
    st.id = id;
    st.order = i + 1;
  });
  return stages;
}
/* ---------------- 阶段骨架的宽松解析 ----------------
   不同模型可能把 stages 包在阶段列表 / 剧情 / data 里，或直接返回数组，
   也可能用中文键名。这里扫描所有 JSON 候选，找出真正的阶段数组。 */
function jsonBalancedAt(text, start) {
  const stack = [];
  let inStr = false, esc = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') { inStr = true; continue; }
    if (ch === '{' || ch === '[') stack.push(ch);
    else if (ch === '}' || ch === ']') {
      if (!stack.length) return '';
      stack.pop();
      if (!stack.length) return text.slice(start, i + 1);
    }
  }
  return '';
}
function stageLike(x) {
  if (!(x && typeof x === 'object' && !Array.isArray(x) &&
    (x.name || x.title || x.summary || x.desc || x.description || x.stage_name || x.stage_summary || x['阶段名'] || x['名称'] || x['阶段摘要']))) return false;
  const nm = String(x.name || x.title || x.stage_name || x['阶段名'] || x['名称'] || '').trim();
  const sm = String(x.summary || x.desc || x.description || x.stage_summary || x['阶段摘要'] || '');
  if (/^(阶段名|名称|第\s*\d+\s*阶段)$/.test(nm)) return false;
  if (/本阶段玩家所处位置|核心冲突与可感知的世界状态/.test(sm)) return false;
  return true;
}
function collectStageArray(j, depth, seen) {
  if (!j || depth > 6) return [];
  if (typeof j === 'string') {
    const t = j.trim();
    if (t.charAt(0) === '{' || t.charAt(0) === '[') {
      try { return collectStageArray(JSON.parse(t), depth + 1, seen); } catch (e) { return []; }
    }
    return [];
  }
  if (Array.isArray(j)) {
    const good = j.filter(stageLike);
    if (good.length) return good;
    for (const x of j) {
      if (x && typeof x === 'object') {
        const r = collectStageArray(x, depth + 1, seen);
        if (r.length) return r;
      }
    }
    return [];
  }
  if (typeof j !== 'object') return [];
  if (seen.has(j)) return [];
  seen.add(j);
  if (stageLike(j)) return [j];
  const keys = ['stages', 'stage_list', 'stageList', '阶段', '阶段列表', '阶段骨架', '剧情', '剧情线', 'arc', 'data', 'result', 'skeleton', 'blueprint'];
  for (const k of keys) {
    if (k in j) {
      const r = collectStageArray(j[k], depth + 1, seen);
      if (r.length) return r;
    }
  }
  const vals = Object.keys(j).map(k => j[k]).filter(stageLike);
  if (vals.length) return vals;
  for (const k of Object.keys(j)) {
    const r = collectStageArray(j[k], depth + 1, seen);
    if (r.length) return r;
  }
  return [];
}
function findArcLogline(j, depth, seen) {
  if (!j || typeof j !== 'object' || depth > 4) return '';
  if (seen.has(j)) return '';
  seen.add(j);
  for (const k of ['logline', 'log_line', '一句话', '主线', '一句话概括', '剧情主线']) {
    if (typeof j[k] === 'string' && j[k].trim()) return j[k].trim();
  }
  for (const k of Object.keys(j)) {
    const r = findArcLogline(j[k], depth + 1, seen);
    if (r) return r;
  }
  return '';
}
function extractArcPayload(text) {
  const raw = String(text || '');
  const chunks = [];
  const re = /```(?:json)?\s*([\s\S]*?)```/gi;
  let m;
  while ((m = re.exec(raw))) chunks.push(m[1]);
  chunks.push(raw);
  for (const c of chunks) {
    for (let i = 0; i < c.length; i++) {
      const ch = c[i];
      if (ch !== '{' && ch !== '[') continue;
      const sub = jsonBalancedAt(c, i);
      if (!sub) continue;
      let j = null;
      try { j = JSON.parse(sub); } catch (e) { continue; }
      const stages = collectStageArray(j, 0, new Set());
      if (stages.length) return { stages, logline: findArcLogline(j, 0, new Set()), raw: j };
    }
  }
  return null;
}
/** 解析失败时的兜底：至少给玩家一个可编辑的「开篇」阶段，而不是直接卡死。 */
function fallbackStoryStages(s) {
  return [normalizeStoryStage({
    name: '开篇',
    summary: s.world.desc || `${s.world.name}的故事从这里开始。`,
    span: '',
    exit: { any: [{ manual: true }] },
    cognition: {
      realm: s.player.abilities || '',
      social: s.player.occupation || '',
      geography: s.player.currentLocation ? [s.player.currentLocation] : [],
      known_factions: s.player.faction ? [s.player.faction] : [],
      forbidden: [],
      rumors: []
    },
    cast: { allowed_tiers: [], forbidden: [], max_new_npcs: 0 },
    forbidden_terms: [],
    detailStatus: 'skeleton'
  }, 0)];
}
/**
 * 生成完整剧情骨架：世界审计 → 阶段骨架 → 细化第一阶段 → 一致性校对。
 * 失败时抛出错误，调用方负责提示；不会留下半成品。
 */
async function planStoryArc(s, opt) {
  const o = opt || {};
  if (!s) throw new Error('没有可规划的实例');
  if (!hasLLM('tiandao', s)) throw new Error('请先配置天道模型');
  const log = msg => { if (o.onProgress) { try { o.onProgress(msg); } catch (e) { } } };
  const call = async (prompt, maxTokens, temperature) => {
    const res = await llmChat([
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user }
    ], { kind: 'tiandao', story: s, maxTokens: maxTokens || 1800, temperature: temperature == null ? 0.55 : temperature, stream: false });
    return extractJSON(res.text || '');
  };
  const callRaw = async (prompt, maxTokens, temperature) => {
    const res = await llmChat([
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user }
    ], { kind: 'tiandao', story: s, maxTokens: maxTokens || 1800, temperature: temperature == null ? 0.55 : temperature, stream: false });
    return String((res && res.text) || '');
  };
  const arc = normalizeStoryArc(s.world.storyArc || {});
  const requirement = String(o.requirement != null ? o.requirement : (arc.userBrief || '')).trim();

  log('正在审计世界设定…');
  let audit = null;
  try { audit = await call(worldAuditPrompt(s), 1600, 0.2); } catch (e) { }
  if (audit && audit.field_meta) {
    const map = {};
    Object.keys(audit.field_meta).forEach(k => {
      const m = audit.field_meta[k] || {};
      map[k] = {
        visibility: ['public', 'stage', 'hidden'].includes(m.visibility) ? m.visibility : 'public',
        revealAt: String(m.reveal_at || m.revealAt || '')
      };
    });
    arc.fieldMeta = map;
    arc.publicLore = Array.isArray(audit.public_lore) ? audit.public_lore.map(String) : [];
    arc.auditNotes = Array.isArray(audit.notes) ? audit.notes.map(String).slice(0, 20) : [];
  }

  log('正在生成阶段骨架…');
  let payload = null;
  let skeletonText = '';
  try {
    const prompt = arcSkeletonPrompt(s, audit, requirement);
    skeletonText = await callRaw(prompt, 3000, 0.65);
    payload = extractArcPayload(skeletonText);
    if (!payload) {
      // 第一次格式失败：用更短的输出要求重试一次。
      const retry = {
        system: prompt.system + '\n\n【格式重试】上一次输出无法解析。只输出一个 JSON 对象，第一个字符必须是 {，最后一个字符必须是 }；不要 Markdown、不要解释。把阶段数量降到 3 个、每段 summary 控制在 80 字以内。',
        user: prompt.user
      };
      skeletonText = await callRaw(retry, 3000, 0.45);
      payload = extractArcPayload(skeletonText);
    }
  } catch (e) {
    if (typeof dbgEnabled === 'function' && dbgEnabled()) dbgLog({ type: 'arc_parse_error', storyId: s.id, err: String((e && e.message) || e), raw: dbgRedact(skeletonText, 8000) });
    throw e;
  }
  let usedFallback = false;
  if (!payload || !payload.stages.length) {
    usedFallback = true;
    if (typeof dbgEnabled === 'function' && dbgEnabled()) dbgLog({ type: 'arc_parse_error', storyId: s.id, raw: dbgRedact(skeletonText, 8000) });
    payload = { stages: fallbackStoryStages(s), logline: '' };
    toast('模型返回格式异常，已创建可编辑的单阶段骨架', false);
  }
  let stages = uniqueStageIds(payload.stages.slice(0, 8).map((st, i) => normalizeStoryStage(st, i)));

  log('正在细化第一阶段…');
  try {
    const j3 = await call(stageDetailPrompt(s, stages[0]), 2400, 0.6);
    const one = j3 && j3.stage ? j3.stage : (j3 && j3.name ? j3 : null);
    if (one) {
      const merged = normalizeStoryStage(Object.assign({}, stages[0], one), 0);
      merged.id = stages[0].id;
      merged.order = 1;
      merged.detailStatus = 'detailed';
      stages[0] = merged;
    }
  } catch (e) { }

  arc.version = (Number(arc.version) || 1) + 1;
  arc.logline = String(payload.logline || arc.logline || '');
  arc.userBrief = requirement;
  arc.stages = uniqueStageIds(stages);
  if (usedFallback) {
    arc.auditNotes = (arc.auditNotes || []).concat(['阶段骨架生成失败，已创建可编辑的「开篇」阶段。请补充阶段或重新生成。']);
  }
  arc.status = 'ready';
  arc.enabled = true;
  s.world.storyArc = arc;
  s.story = normalizeStoryState(Object.assign({}, s.story, {
    enabled: true,
    arcVersion: arc.version,
    stageId: arc.stages[0].id,
    stageEnteredAt: s.instance.currentTime,
    stageHistory: [{ stageId: arc.stages[0].id, from: s.instance.currentTime, to: '' }],
    planStatus: 'ok'
  }), s.world);
  saveDB();

  if (o.check !== false) {
    log('正在校对阶段一致性…');
    try {
      const chk = await call(arcCheckPrompt(s), 1200, 0.2);
      if (chk && Array.isArray(chk.issues)) {
        arc.issues = chk.issues.filter(x => x && (x.problem || x.stage)).slice(0, 20).map(x => ({
          stage: String(x.stage || ''), problem: String(x.problem || ''), fix: String(x.fix || '')
        }));
        s.world.storyArc.issues = arc.issues;
      }
      if (chk && chk.ok === false && dbgEnabled()) dbgLog({ type: 'arc_check', storyId: s.id, issues: (chk.issues || []).slice(0, 12) });
    } catch (e) { }
  }
  saveDB();
  return arc;
}

function singleStagePrompt(s, o) {
  const opts = o || {};
  const prior = (opts.priorStages || []);
  const priorText = prior.length ? prior.map(st => `第 ${st.order} 阶段「${st.name}」：${st.summary || ''}\n认知边界：${JSON.stringify(st.cognition || {})}\n出场限制：${JSON.stringify(st.cast || {})}`).join('\n\n') : '（无；这是第一个阶段）';
  const req = String(opts.requirement || '').trim();
  const arc = s.world.storyArc || {};
  return {
    system: `你是剧情规划器的「单个阶段」模块。请只为一个长线互动世界生成一个阶段骨架，不要输出整条剧情线，也不要输出数组。
只输出一个 JSON 对象，不要 Markdown、不要解释：
{"stage": {
  "name": "阶段名（2–8 字）",
  "summary": "本阶段玩家所处位置、核心冲突与可感知的世界状态（60–110 字）",
  "span": "大致时间跨度，如 第 1–30 日",
  "exit": { "any": [ { "worldMinutes": 43200 }, { "event": "关键事件名" } ] },
  "cognition": {
    "realm": "当前境界/能力上限", "social": "社会阶层与身份",
    "geography": ["可触及地点"], "known_factions": ["已知势力"],
    "forbidden": ["现阶段不可理解或不可知道的事"], "rumors": ["可能是错的传闻"]
  },
  "cast": { "allowed_tiers": ["可出场层级"], "forbidden": ["本阶段不得直接出场的角色/势力"] },
  "world_events": [ { "title": "事件名", "when": "第 10–20 日", "trigger": "触发方式", "importance": 6 } ],
  "forbidden_terms": ["一旦出现就会剧透的具体词"]
}}
硬性要求：
- 只写骨架，不要写 setting_delta、growth、reveals；这些会在后续「细化」时补齐。
- 必须承接「既往阶段」的结束状态，不得与已发生事实矛盾；不得提前写出后续阶段的真相。
- 玩家对本阶段的明确要求优先级最高；在不违背世界基础设定与既往阶段的前提下尽量满足。
- 认知边界必须与既往阶段连续，只能逐步放宽，不能跳级。
- forbidden_terms 要具体（人名、地名、术语），不要写抽象描述。
- 至少有一个 exit 条件；worldMinutes 从故事开始累计。`,
    user: `世界名称：${s.world.name}
世界描述：${s.world.desc || '（无）'}
整体剧情线：${arc.logline || '（未设定）'}
整体剧情要求：${arc.userBrief || '（无）'}
目标阶段序号：第 ${opts.targetOrder || (prior.length + 1)} 阶段
目标阶段名提示：${opts.nameHint || '（无，可自行命名）'}

既往阶段（必须承接，不得矛盾）：
${clampText(priorText, 5000)}

玩家对本阶段的明确要求：
${req || '（无额外要求，请依据世界与既往阶段自然推进）'}

玩家当前状态：${charProfile(s.player, '')}
当前世界时间：${s.instance.currentTime}
世界设定（当前可见）：
${clampText(storyWorldMarkdown(s), 6500)}`
  };
}
/** 单独生成一个阶段骨架：可替换既有阶段，或追加到指定位置之后。 */
async function planSingleStage(s, opt) {
  const o = opt || {};
  if (!s) throw new Error('没有可规划的实例');
  if (!hasLLM('tiandao', s)) throw new Error('请先配置天道模型');
  const arc = storyArcOf(s) || normalizeStoryArc(s.world.storyArc || {});
  const target = o.stageId ? arc.stages.find(st => st.id === o.stageId) : null;
  const afterOrder = o.afterOrder != null ? Number(o.afterOrder) : (currentStage(s) ? currentStage(s).order : arc.stages.length);
  const targetOrder = target ? target.order : Math.max(0, afterOrder) + 1;
  const prior = arc.stages.filter(st => st.order < targetOrder && st.id !== (target && target.id));
  const p = singleStagePrompt(s, {
    priorStages: prior,
    requirement: o.requirement,
    nameHint: o.nameHint,
    targetOrder
  });
  const res = await llmChat([
    { role: 'system', content: p.system },
    { role: 'user', content: p.user }
  ], { kind: 'tiandao', story: s, maxTokens: 1800, temperature: 0.65, stream: false });
  const j = extractJSON(res.text || '');
  let one = j && (j.stage || j);
  if (!one && j && Array.isArray(j.stages) && j.stages.length) one = j.stages[0];
  if (!one || (!one.name && !one.summary)) throw new Error('模型没有返回可用的阶段骨架');
  const merged = normalizeStoryStage(Object.assign({}, target || {}, one), targetOrder - 1);
  merged.id = target ? target.id : ('st' + targetOrder + '_' + Math.random().toString(36).slice(2, 5));
  merged.order = targetOrder;
  merged.detailStatus = 'skeleton';
  merged.userBrief = String(o.requirement || '');
  let stages = arc.stages.slice();
  if (target) stages = stages.map(st => st.id === target.id ? merged : st);
  else stages.push(merged);
  arc.stages = uniqueStageIds(stages);
  arc.status = arc.stages.length ? 'ready' : 'draft';
  if (!arc.logline && arc.stages.length) arc.logline = arc.stages[0].summary.slice(0, 40);
  s.world.storyArc = arc;
  saveDB();
  if (typeof dbgEnabled === 'function' && dbgEnabled()) dbgLog({ type: 'stage_generate', storyId: s.id, stageId: merged.id, order: merged.order, requirement: String(o.requirement || '').slice(0, 200) });
  return merged;
}

/** 阶段切换后复查一致性，结果写回 world.storyArc.issues（持久化）。 */
async function recheckArcConsistency(s) {
  if (!s || !storyModeOn(s) || !hasLLM('tiandao', s)) return [];
  try {
    const p = arcCheckPrompt(s);
    const res = await llmChat([
      { role: 'system', content: p.system },
      { role: 'user', content: p.user }
    ], { kind: 'tiandao', story: s, maxTokens: 1200, temperature: 0.2, stream: false });
    const chk = extractJSON(res.text || '');
    const issues = chk && Array.isArray(chk.issues) ? chk.issues.filter(x => x && (x.problem || x.stage)).slice(0, 20).map(x => ({
      stage: String(x.stage || ''), problem: String(x.problem || ''), fix: String(x.fix || '')
    })) : [];
    const arc = storyArcOf(s);
    if (arc) { arc.issues = issues; s.world.storyArc = arc; saveDB(); }
    if (dbgEnabled()) dbgLog({ type: 'arc_check', storyId: s.id, stageId: s.story.stageId, ok: !(chk && chk.ok === false), issues });
    return issues;
  } catch (e) { return []; }
}
/** 懒细化：只细化指定阶段，保留 id 与顺序。 */
async function detailStage(s, id) {
  if (!storyModeOn(s) && !(s.world.storyArc && s.world.storyArc.stages.length)) return null;
  const arc = storyArcOf(s);
  const idx = arc ? arc.stages.findIndex(st => st.id === id) : -1;
  if (idx < 0) return null;
  if (!hasLLM('tiandao', s)) throw new Error('请先配置天道模型');
  const p = stageDetailPrompt(s, arc.stages[idx]);
  const res = await llmChat([
    { role: 'system', content: p.system },
    { role: 'user', content: p.user }
  ], { kind: 'tiandao', story: s, maxTokens: 2400, temperature: 0.6, stream: false });
  const j = extractJSON(res.text || '');
  const one = j && j.stage ? j.stage : j;
  if (!one || (!one.summary && !one.name)) throw new Error('模型没有返回可用的阶段细化');
  const merged = normalizeStoryStage(Object.assign({}, arc.stages[idx], one), idx);
  merged.id = arc.stages[idx].id;
  merged.order = arc.stages[idx].order;
  merged.detailStatus = 'detailed';
  arc.stages[idx] = merged;
  s.world.storyArc = arc;
  saveDB();
  return merged;
}
/** 从当前进度重规划未来阶段：保留当前与过去，只替换后续。 */
async function replanFutureStages(s) {
  if (!s) throw new Error('没有实例');
  if (!hasLLM('tiandao', s)) throw new Error('请先配置天道模型');
  const arc = storyArcOf(s);
  if (!arc) throw new Error('当前世界没有剧情规划');
  const cur = currentStage(s);
  const keep = arc.stages.filter(st => !cur || st.order <= cur.order);
  const done = keep.map(st => `第${st.order}阶段「${st.name}」：${st.summary}`).join('\n');
  const p = arcSkeletonPrompt(s, null, arc.userBrief);
  p.system = p.system.replace('请为一个长线互动世界设计 3–5 个阶段。', `请从当前进度继续设计后续 2–4 个阶段。已发生的阶段不可改写。`);
  p.user += `\n\n已发生 / 当前阶段（必须保持兼容，不得与之矛盾）：\n${done}\n\n当前玩家状态：${charProfile(s.player, '')}\n当前时间：${s.instance.currentTime}`;
  const res = await llmChat([
    { role: 'system', content: p.system },
    { role: 'user', content: p.user }
  ], { kind: 'tiandao', story: s, maxTokens: 2400, temperature: 0.7, stream: false });
  const j = extractJSON(res.text || '');
  const raw = Array.isArray(j && j.stages) ? j.stages : (Array.isArray(j) ? j : []);
  if (!raw.length) throw new Error('模型没有返回可用的后续阶段');
  const future = raw.slice(0, 4).map((st, i) => {
    const n = normalizeStoryStage(st, keep.length + i);
    n.id = 'st' + (keep.length + i + 1) + '_' + Math.random().toString(36).slice(2, 5);
    n.detailStatus = 'skeleton';
    return n;
  });
  arc.stages = uniqueStageIds(keep.concat(future));
  s.world.storyArc = arc;
  s.story.planStatus = 'ok';
  saveDB();
  return future;
}
function stageDetailMissing(s) {
  const arc = storyArcOf(s);
  return !!(arc && arc.stages.some(st => st.detailStatus !== 'detailed'));
}
