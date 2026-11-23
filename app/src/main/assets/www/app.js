/* ============================================================
   启源 · 主题变量
   本地存档 + 直连 LLM，无账号 / 无服务器 / 无市场
   ============================================================ */
'use strict';

const DB_KEY = 'qiyuan_rp_single_v1';

/* ---------------- 主题 ---------------- */
const THEMES = {
  paper: {
    id: 'paper', name: '纸月', desc: '居中卡片 · 暖金细线',
    displayMode: 'message', bubbleDisplayType: 'flat',
    bgOpacity: .22, bgColor: '#0e1114',
    console: { color: 'rgba(18,20,24,.62)', blur: 18, radius: 16, send: '#e8935a', text: '#f5f1e8', ph: 'rgba(245,241,232,.45)' },
    bubble: { color: 'rgba(10,13,12,.56)', radius: 24 },
    font: { size: 15.33, line: 1.75, color: '#f5f1e8', name: '#eece9d', family: 'system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif' },
    avatarRadius: 50,
    customCss: `
.msg{display:flex;flex-direction:column;align-items:center}
.msg-card{width:92%;margin:16px auto 0;padding:22px 20px 18px;position:relative;
  border:1px solid rgba(238,206,157,.2);box-shadow:0 18px 48px rgba(0,0,0,.35)}
.msg-card::before{content:"";position:absolute;top:10px;left:50%;width:44px;height:1px;transform:translateX(-50%);
  background:linear-gradient(90deg,transparent,#eece9d,transparent);opacity:.55;pointer-events:none}
.msg-avatar{width:66px;height:66px;margin:-54px auto 8px;border:1px solid rgba(238,206,157,.45);
  box-shadow:0 0 0 4px rgba(10,13,12,.9),0 8px 24px rgba(0,0,0,.35);font-size:24px}
.msg-name{display:flex;justify-content:center;align-items:center;margin:0 auto 12px;padding:0 16px 8px;
  width:max-content;max-width:100%;border-bottom:1px solid rgba(238,206,157,.25);
  font-family:"Songti SC","Noto Serif SC",serif;font-size:18px;letter-spacing:1px;color:var(--t-name-color)}
.msg.user .msg-card{width:86%;margin-left:auto;margin-right:0;border-color:rgba(255,255,255,.1)}
.msg.user .msg-card::before{display:none}
.msg.user .actions{justify-content:flex-end;width:86%;align-self:flex-end;margin-right:0}
.msg .actions{width:92%;align-self:center}
`
  },
  mist: {
    id: 'mist', name: '晨雾', desc: '左右气泡 · 冷调玻璃',
    displayMode: 'message', bubbleDisplayType: 'bubble',
    bgOpacity: .3, bgColor: '#0b1118',
    console: { color: 'rgba(22,28,36,.66)', blur: 20, radius: 14, send: '#7fb7d8', text: '#e8f0f5', ph: 'rgba(232,240,245,.4)' },
    bubble: { color: 'rgba(28,40,52,.78)', radius: 16 },
    font: { size: 15.33, line: 1.68, color: '#e8f0f5', name: '#9fc7dd', family: 'system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif' },
    avatarRadius: 50,
    customCss: `
.msg{display:block;position:relative;padding-left:52px;padding-right:12px}
.msg-card{max-width:100%;padding:10px 13px;min-height:24px}
.msg-avatar{position:absolute;left:-41px;top:30px;width:30px;height:30px;font-size:12px;margin:0}
.msg-name{font-size:12px;color:#8fa6b4;margin:0 0 3px 2px}
.msg.user{padding-left:18vw;padding-right:12px}
.msg.user .msg-avatar{display:none}
.msg.user .msg-name{display:none}
.msg.user .msg-card{margin-left:auto;background:rgba(58,86,110,.7);max-width:84%}
.msg.user .actions{justify-content:flex-end}
.msg .actions{padding-left:0;margin-left:0;max-width:100%}
`
  },
  novel: {
    id: 'novel', name: '视觉小说', desc: '全屏叙事 · 底部文本框',
    displayMode: 'novel', bubbleDisplayType: 'flat',
    bgOpacity: .55, bgColor: '#0a0a0d',
    console: { color: 'rgba(8,10,14,.74)', blur: 22, radius: 10, send: '#d8a45f', text: '#f2ede4', ph: 'rgba(242,237,228,.4)' },
    bubble: { color: 'rgba(8,10,14,.66)', radius: 14 },
    font: { size: 16, line: 1.8, color: '#f2ede4', name: '#d8a45f', family: '"Songti SC","Noto Serif SC",serif' },
    avatarRadius: 50,
    customCss: `
.msg{padding:0 16px;margin-top:10px}
.msg-card{min-height:44vh;display:flex;flex-direction:column;justify-content:flex-end;padding:24px 20px;
  border:0;border-radius:0;background:linear-gradient(to top,rgba(4,5,7,.94) 0%,rgba(4,5,7,.72) 45%,rgba(4,5,7,0) 88%);
  backdrop-filter:none;-webkit-backdrop-filter:none}
.msg-avatar{display:none}
.msg-name{font-family:var(--t-font-family),serif;font-size:18px;color:var(--t-name-color);text-align:left;
  margin:0 0 8px;letter-spacing:1px}
.msg-body{font-family:var(--t-font-family),serif;letter-spacing:.4px}
.msg.user{padding:0 42px}
.msg.user .msg-card{min-height:auto;background:rgba(20,24,30,.72);padding:10px 14px}
.msg.user .msg-name{display:none}
.msg .actions{padding-left:0}
`
  }
};
/* ============================================================
   一、运行常量 · 世界预设 · 时间引擎 · 数据模型
   ============================================================ */
const APP_VERSION = '0.1.5';
const SCHEMA_VERSION = 4;
const TICK_MS = 30000;          // 现实 30 秒一个时间线 tick
const AUTONOMY_MIN = 30;        // 每推进 30 世界分钟，尝试一次 NPC 自主行为
const OFFLINE_DAY_MIN = 1440;   // 超过 1 世界天无操作 → 记忆空洞填补
const MAX_MESSAGES = 500;
const STORAGE_KEY = 'qiyuan_rp_v3';
const PRIVACY_KEY = 'qiyuan_privacy_v1';
const LEGACY_KEY = 'qiyuan_rp_single_v1';

/* ---------------- 世界预设（结构化设定 + 原生 NPC） ---------------- */
const PRESETS = [
  {
    id: 'jiuzhou', name: '九州', tag: '仙侠 · 禁忌', icon: '九州',
    startLocation: '沧溟域·大泽宗·外门观潮台',
    world: {
      name: '九州', category: '仙侠', tag: '仙侠 · 禁忌', coverId: 'jiuzhou',
      desc: '九块大陆悬于虚无海之上，九条大道压着一段被抹去的元初历史。你在沧溟域大泽宗做一名外门弟子，昨夜，湖底的水文法阵在无潮时自己转了起来。',
      calendarName: '九州历', startTime: '九州历三千零一年九月初九日辰时',
      locationSchema: '州域（如沧溟域）→ 国度/宗门（如大泽宗）→ 场所（如湖底归墟水殿）→ 具体位置（如殿门外的水阶）',
      tiandaoPrompt: '仙侠笔调，古雅克制，不堆砌辞藻。修行与法则必须有代价：灵力、寿元、道心、因果。异修的力量要诡异而令人不适，绝不可写成捷径。古神从不直接现身，只以真名残响、错乱的法则与人心裂缝显形。凡人的重量同样重要，不要把所有冲突都写成斗法。',
      fields: [
        { path: "世界观", value: "# 九州世界整合设定（含异修与巡天使）\n\nhttps://i.hd-r.cn/878cd544-926e-4c68-802a-c222d46424ee.png\n\n## 一、宇宙本源与元初之战\n\n### 1\\. 古神：无中生有的绝对全能\n\n诞生于一切存在之前，不修法则、不修大道、不修力量，唯修“念”。“念”即是一切可能性的总和，是真正意义上的“从无到有”。古神之念不灭，则古神不灭。只要存在生灵呼唤其真名，古神即可跨越虚无复生。\n\n虚无是绝对的意义概念，没有时空、物质、法则、大道、能量的存在，古神最初便存在于这纯粹的“意义”之中。 之后古神以“念”从无到有创造了“混沌之力”，以及五行、时空法则，最初的真实世界由此诞生。\n\n### 2\\. 古仙：法则的缔造与僭越\n\n古神以“念”创造元初混沌及时空五行。混沌中衍生的生灵，因窥见古神权能而生贪念，遂模仿古神踏上修行之路，是为古仙。古仙的修行伴随着法则的创造，随着法则蔓延，未定义的无限可能被法则强行定义，这构成了对古神权能的根本侵蚀。\n\n### 3\\. 元初之战与九道封天\n\n法则的壮大不断挤压古神的绝对自由，最终引发元初大战。古仙虽强，但无法磨灭古神之“念”，节节败退。最终，九尊至强古仙于绝境中击杀古神，并牺牲自身化为九大大道。大道之力弥漫一切存在，将古神之念强行编织进法则的牢笼中压制，彻底封死了古神从无中归来的可能。自此，元初历史被九大大道彻底磨灭，世间再无古神之传说。\n\n元初之战后古神消亡、古仙化道。在古仙大道的影响下，最初的混沌之力逐渐化为各种后天之力，或成为世界的滋养。历经漫长岁月，混沌之力最终殆尽。\n\n## 二、世界总览\n\n如今的九州，就是漫长岁月中因古仙大道影响而形成的最大的九个世界组成的世界群。 九州世界由九块大陆（州域）组成，悬浮于无尽的“虚无海”之上。九州之间的虚无海，本质上是因为能量物质、法则大道稀薄，从而造成的接近“虚无”的时空概念。 虚无海介于存在与不存在之间，无声、无色、无味，能吞噬一切灵力与法则波动。任何飞渡或空间穿越的尝试，深入虚无海后将失去方向感与灵力感应，最终被虚无同化。\n\n九大州域之间没有物理陆地连接，唯有通过各州域设立的“星渡法阵”方可往来。此类法阵需大量灵石与至少一位元婴期修士坐镇，故跨州域旅行成本极高。\n\n九大州域虽然各受一条大道法则弥漫性影响，但历经无数纪元的法则均衡，各州域的灵力浓度并无显著差别。差异主要体现在修士对法则的“亲和度”上：主修火行法则者在玉衡域感悟效率略高，但日常打坐修行则无甚区别。\n\n此外，九州大陆上散布着众多小世界——或是上古大能以无上神通开辟的道场洞府，或是天地自然演化而成的独立空间。这些小世界大小不一，有的仅容一两人隐居，有的则可容纳一国繁衍生息。它们或藏于秘境深处，或隐于虚空缝隙，或随天象变化而周期性开启，成为九州修士探索机缘、避世修行的重要场所。九大道庭亦有官方管理的小世界，用作关押重犯或存放禁忌之物。\n\n需要注意的是，时空和五行法则是世界存在的基础，且因为其由古神所创，独立于九仙所化的大道之外，不被九个大道所控制。\n\n## 三、九大州域\n\n|州域名|方位|大道影响|地貌特征|道庭职能侧重|\n|-|-|-|-|-|\n|天枢域|正中央|秩序与天时|平缓起伏的山脉与平原，河流密布，四季分明|九大道庭之首，协调各域，监控全球法则异常（天网中枢所在地）|\n|天阳域|东北|大气、雷霆与气象|丘陵与高原相间，常见雷雨天气，多风蚀地貌|雷法与遁术传承，掌管九州气象监测|\n|开阳域|正东|生机与造化|森林茂密，河流众多，四季温暖湿润|丹道、医术与灵植培育，负责九州灵药供给|\n|玉衡域|正南|火焰与征伐|多熔岩地貌与火山群，但亦有巨大的火山灰平原适合耕作|炼器之道，九州兵器与法宝的主要产出地|\n|沧溟域|东南|水行与吞噬|河网密布，大泽星罗，拥有九州最大的淡水湖群|水系功法传承，掌管九州水文与航运法阵|\n|摇光域|正西|终结与寂灭|广袤的荒漠与戈壁，昼夜温差极大，地下有广大的溶洞与暗河体系|管理亡魂渡引、处理超自然灵异事件，归寂之地|\n|太阴域|西北|幻象与精神|高原草甸与雪山并存，多迷雾山谷，日照时间较短|幻术与阵法传承，负责九州天网的信息加密与传递|\n|玄黄域|西南|大地与防御|多山脉与深谷，矿产资源丰富，高原台地广布|防御阵法与炼器材料开采，负责九州城墙工程|\n|天权域|正北|寒冰与凝固|高寒地带，永久冻土与针叶林并存，冬季漫长|封印术传承，负责镇守某些极度危险的古老封印地区|\n\n" },
        { path: "特殊地形与禁忌之地", value: "## 四、特殊地形与禁忌之地\n\n1. **虚无海**：分隔九大州域的“海洋”，实为上古大战残留的法则真空地带。无法用神识穿透，无法在其中调动天地灵气。各域之间唯一的通航方式，是依赖固定的“星渡法阵”进行超远程传送。\n2. **法则裂隙带**：分布在每个州域边缘靠近虚无海的区域，因远离本域的大道核心辐射，法则偶尔出现细微的“松动”。这里是修士最可能无意间触碰到“古神真名残响”的地方，也是低阶异修最常被发现、被捕杀的区域。\n3. **混沌遗泽（秘境）**：极罕见的秘境，通常出现在天象异常或法则共振时刻，随机出现在某一州域的特定地点。内部残留着微弱的混沌之力与古神时代的记忆碎片。探索此类秘境是获取“混沌之力”的唯一途径，但同时也是堕入异修之路的高危行为。\n4. **大暗战场遗址**：位于摇光域与天权域交界处的一片荒芜地带。三千年前镇压一位“畸变境”异修的主战场。至今此地的空间仍有不稳定的波动，修士经过时会感到莫名的压迫感与低语幻觉。\n\n" },
        { path: "小世界分布概况", value: "## 五、小世界分布概况\n\n九州大陆存在大量小世界，按其来源可分为三类：\n\n|类型|来源|特征|分布|\n|-|-|-|-|\n|大能道场|上古或当世大能以神通开辟|规则稳固，灵气充沛，通常有传承或禁制|各州域的名山大川，或隐匿于虚空裂隙中|\n|自然演化|天地灵气与法则自然凝成|形态各异，或为洞天福地，或为险境绝地|随机分布于各州域，难以预测其入口|\n|道庭管辖|由九大道庭掌控|用于关押重犯、存放禁忌之物、或作为官方据点|通常有固定入口，需权限进入|\n\n小世界的入口往往不稳定，或有时间限制，或有修为限制。探索未知小世界是九州修士寻找机缘、突破瓶颈的重要途径，但也伴随着迷途、被困甚至陨落的风险。\n\n" },
        { path: "势力格局简述", value: "## 六、势力格局简述\n\n* **九大道庭**：每个州域各有一座道庭，以州域名称命名（如天枢域道庭即“天枢道庭”）。九大道庭各自相对独立，但在重大事件（如异修降临级威胁）上会通过“天网”机制联合行动。天枢道庭因其地理位置居中，被公认为协调中枢，并无绝对的统治权。\n* **修仙宗门**：分布在九大州域内部，规模大小不一。宗门通常会与所在州域的道庭保持合作关系，但部分大宗门也拥有独立于道庭之外的势力范围，甚至拥有私有小世界作为宗门根基。\n* **凡人王朝**：分布在每个州域的平原与河谷地带，受当地修仙宗门庇护。凡人国度之间偶有战争，但高阶修士通常不会直接干涉凡人之间的冲突。\n* **异修活动圈**：异修无固定地域，但因其需要隐秘研究与真名残响的触发条件，更倾向于在法则裂隙带、偏远秘境的边缘地带活动。异修之间彼此警惕，极少合作，更常见的情况是高阶异修主动寻找到低阶异修，将其吞噬以加深自身锚点。\n\n" },
        { path: "异修的生存逻辑与巡天使", value: "## 七、异修的生存逻辑与巡天使\n\n### 1\\. 核心矛盾：大道的“绝对镇压”与异修的“存在可能”\n\n九道对古神之力的镇压是绝对的，但这种“绝对”不意味着“完美无缺”。大道的运行存在两个结构性弱点：\n\n* **虚无海——法则真空带**：九道之力无法完全覆盖虚无海。这里是法则强度最低的“零地带”，也是古神真名残响最容易浮现、大道监控最薄弱的地方。异修在此孕育、藏匿、修行。\n* **九州大陆——静默潜伏**：异修只要不主动动用真名之力，其体内锚点就处于“静默”状态。天网监控的是“非法力量使用”而非“非法身份”，因此潜伏中的异修在不动用能力时，极难被从数十亿生灵中精准识别。\n\n### 2\\. 异修的生存之道：阴影中的挣扎\n\n* **虚无海中的活动**：法则裂隙带是“闻音”和“摹形”的低风险场所；混沌遗泽或法则气泡可作临时巢穴；部分异修驾驶“虚航舟”在虚无海边缘流窜。\n* **九州大陆的潜伏**：异修必须披上合法的身份外壳（宗门边缘弟子、凡人平民等），绝不使用真名之力。代价是力量停滞甚至倒退，且长期压制锚点会加剧心灵侵蚀。\n* **本质困境**：不动用力量等于自我阉割，动用力量等于加速暴露。这是一条注定走向自我毁灭的路。\n\n### 3\\. 巡天使——大道的移动之手\n\n九道之“天罚”只能被动反应，无法主动搜寻潜伏中的异修。为此，九大道庭设立了巡天使部队，作为人力补全。\n\n* **来源与资质**：化神期以上修士，对法则极端敏感，拥有近乎偏执的大道忠诚。主要从摇光域和天权域选拔。终生制，真名封印。\n* **核心装备**：“镇魂甲”隔绝真名低语侵蚀；“寂灭刺”可刺入锚点，制造法则真空，切断异修与真名的联系。\n* **核心秘术**：“望气术——观痕”，能看到异修灵魂表面因古神侵蚀留下的“裂痕”——这是异修无法隐藏的唯一破绽。\n* **作战分工**：\n\n  * **虚无海**：驾驶“虚梭船”搜索，一击不中即退，启动永久追杀令。\n  * **九州大陆**：伪装身份潜伏调查，通过音律、残留物等测试可疑对象。\n* **处置标准**：锚点深度<10%（闻音早期），带回道庭尝试“净化”；锚点深度≥10%（摹形及以上），当场处决。\n\n### 4\\. 设定逻辑总结\n\n* **大道的“绝对性”**：确保宇宙整体稳定。\n* **虚无海的“盲区”**：为异修留下生存缝隙。\n* **九州大陆的“静默逻辑”**：让潜伏成为可能。\n* **巡天使的“猎杀”**：以人力补全大道的被动性，让阴影中亦有追猎者。\n* **必然的悲剧**：异修终究无法逃脱被抹杀或自我毁灭的宿命。\n\n" },
        { path: "古仙体系：创法之路", value: "## 八、修行体系总论\n\n### 古仙体系：创法之路\n\n**核心逻辑**：依赖“混沌之力”这种先于九道而存在的先天之力，以“炼”为手段，将自身从“后天生灵”升华为“先天法则的缔造者”。\n\n**关键设定**：\n\n* 古神消亡后，混沌之力被九道用于创造世界，已基本耗尽。\n* 后世仅存的混沌之力极其稀薄，藏于天地初开的秘境、混沌遗泽或某些禁忌之地。\n* 没有混沌之力，强行修炼古仙之法，无异于在干涸的河床中挖井。\n\n**境界划分**：\n\n1. **炼精化气**：将自身的精气化为“混沌之气”的雏形，而非后世修士的“灵力”。需要吸收一丝稀薄的混沌之力作为引子。后世困境：混沌之力的缺失，使得这一步几乎无法完成。偶尔有人靠机缘获得一丝混沌之气步入此境，也会因后续没有足够供给而卡死。\n2. **炼气化神**：将体内的混沌之气，炼化为“先天之神”——一种尚未被九道法则定义的本源意识。需要以混沌之气长时间温养。后世困境：混沌之气不足，强行温养的结果往往是神魂被混沌同化，意识消散。\n3. **炼神返虚**：将“先天之神”返归为“混沌之虚”——让自身的意识回归到最原始、尚未定义任何法则的无限可能性状态。需要主动放弃一切已认知的法则框架。后世困境：后世生灵从出生起就被九道法则笼罩，先天之“神”早已被法则框架塑形。想要“返虚”，就要先瓦解自己的认知结构，再加上混沌之气的匮乏，此境几乎无人能成。\n4. **炼虚合道**：将“混沌之虚”与天地间残存的混沌本源共鸣，由虚化实，自创一条独立于九道的法则。需要的混沌之力极其庞大。后世困境：混沌之力极度匮乏，根本不足以支撑“合道”所需的消耗。无人可能修成。\n5. **古仙之境（炼虚合道之后）**：自身所创的法则完整稳定，不再依赖于九道而存在。修士自身，即为一道。地位：与九大古仙同格，但不属于“镇压古神”的那一系统。后世状态：自元初之战后，这片天地间再无一位修士达成此境界。\n\n" },
        { path: "后世仙道体系：循法之路", value: "### 后世仙道体系：循法之路\n\n**核心逻辑**：后世仙修无法触碰先天混沌，只能在九道设定的框架内，吸收世界诞生后产生的后天灵气，沿着古仙留下的法则脉络修行。仙凡共存于世，仙可开辟小世界（道场）或居于名山大川的洞府。没有飞升，只有对大道理解的不断深化。\n\n**核心设定**：\n\n* 不存在“飞升上界”的概念。修士修为达到极致后，要么成为大道的守护者，要么开天辟地自建小世界（道场），要么继续在九州天地间逍遥。\n* 九大道庭是九州世界的最高权力机构，分别以元初之战前九位化为大道的古仙命名。九大道庭的掌控者称为道主。\n* 大道是高于法则的意志。法则只是大道的具体表现。后世修士修行，本质上是在加深对某一条大道的“理解”与“契合”，而非用法则去对抗大道。\n* 神识（神念的合法残响）在筑基期初步觉醒，但这个世界的修士只知道“修为到了自然就有”，无人知晓其源头是古神之念。\n* 时空和五行法则虽是世界存在的基础，但因由古神所创，不受九大大道控制。因此，后世修士对时空与五行法则的感悟，实际上是在触碰古神留下的最古老遗产。\n\n#### 第一阶段：凡俗奠基（炼气—筑基）\n\n1. **炼气期（九重）**：感知天地间的后天灵气，引入体内，打通经脉，淬炼肉身。此时尚未接触大道，只与最基础的五行法则共鸣。寿元：约120年（炼气圆满可至150年）。能力：能施展基础法术（火球、水箭、御风等），体力与五感大幅提升。神识：未觉醒，仅能凭借五感感知外界。瓶颈：灵根资质和功法优劣决定上限。九成修士终生困于此境。\n2. **筑基期（三境：初基、中基、圆满）**：将灵气压缩液化，在丹田构筑“道基”。道基是一座桥梁，连接修士自身与九条大道之一的某一分支法则。寿元：约300年（筑基圆满可至400年）。能力：可御物飞行；基础法术威力大幅提升；可初步引动天地灵气。神识：初步觉醒，可内视自身经脉丹田，外放感知范围约十丈。关键：筑基开始，修士必须选择一条大道作为主修方向。许多宗门会在筑基前对弟子进行“道性测试”，以判断其与哪条大道最为契合。\n\n#### 第二阶段：法则凝聚（金丹—元婴）\n\n3. **金丹期（三转：一转丹成、二转丹纹、三转丹婴）**：将道基与神魂融合，压缩成一颗“金丹”。金丹是大道赐予修士的“道印”，是修士与某一条大道建立契约关系的证明。寿元：约1000年（金丹圆满可至1500年）。能力：可引动天地灵气大幅增幅法术，威力远超筑基；可施展本命神通——一门与主修大道相关的独有神通；可短距离御空飞行（非御物，而是以自身法力悬浮飞行）。神识：范围扩展至百丈，可感知灵力波动和大致的气息强弱。三转说明：一转丹成：金丹初凝，色泽暗淡，仅具雏形；二转丹纹：金丹表面浮现法则纹路，与大道共鸣加深；三转丹婴：金丹内孕育出一缕元灵气息，为下一步碎丹成婴做准备。地位：金丹修士在修仙界中已算中坚力量，可担任中小宗门的长老或宗主。\n4. **元婴期（四境：凝婴、出窍、化形、圆满）**：碎丹成婴。元婴是修士的第二生命，也是修士与大道沟通的核心媒介。元婴的形状、气息与主修大道高度相关。寿元：约5000年（元婴圆满可至8000年）。能力：可短距离瞬移（空间跳跃，范围视修为而定，一般不超过百里）；元婴可离体出窍，探索外界或夺舍他人（但夺舍后修为会大幅下降）；可施展“法天象地”——以元婴沟通大道，召唤大道的一缕投影附着自身，短时间大幅提升战力。神识：范围扩展至千里，可精确感知灵力流动、阵法布局、甚至模糊的情绪波动。关键觉醒：元婴期修士的神识会迎来一次质变——变得极其敏锐，甚至可以在极短时间内洞察对手的灵力运转路线。修士将此视为“元婴大成”的标志，无人知晓这是对古神“念”的模仿。地位：元婴修士在修仙界中已算一方强者，可开辟小型洞府或依附于大道庭，担任要职。\n\n#### 第三阶段：道我相融（化神—合体）\n\n5. **化神期（三境：炼神、化神、归真）**：元婴与肉身开始融合，元婴之力渗透四肢百骸，肉身逐渐法则化。修士的“元神”正式成形——不再是元婴形态，而是一团与大道共鸣的意识与法则的结合体。寿元：约2万年（化神圆满可至3万年）。能力：可调动一方天地的灵气，举手投足有毁城之力；可施展“领域”——以自身对法则的理解，强行塑造一片符合自身大道的环境，领域内的敌人会受到持续的法则压制；肉身开始法则化，断肢可再生，部分致命伤可迅速愈合。神识：范围扩展至50万里，可扫描一府辖域，并能感知空间中残留的气息痕迹。三境说明：炼神：元婴与肉身开始融合，元神初显，仍需肉身庇护；化神：元神大成，可脱离肉身独立存在一段时间，但肉身仍是根本；归真：元神返璞归真，与肉身完美融合，开始触及法则的本质纹理。地位：化神修士已可称“真仙”，是修仙界真正的顶级强者。可开辟较大的小世界（道场），容纳宗门或家族。\n6. **合体期（二境：法则熔炼、道我合一）**：元神与大道法则深度融合。修士不再只是“借用”大道的力量，而是成为大道在人间的一个移动的“锚点”。寿元：约5万年（合体圆满可至8万年）。能力：可施展“大道投影”——召唤主修大道的一缕真意降临，对敌人造成法则层面的压制。此神通消耗极大，且不能频繁使用；在其领域内，可以对法则进行短期微调——但绝不敢违背大道本身的意志，否则可能被大道反噬；可开辟稳固的小世界，容纳数万人繁衍生息。神识：范围可覆盖1000万里，可扫描一州之地，可感知天机变化。二境说明：法则熔炼：将自身元神投入所悟法则中反复淬炼，剥离杂质（杂念、杂道影响）；道我合一：元神与法则彻底契合，修士一念之间，即可引动大道共鸣。地位：合体修士已可称“玄仙”，是九州世界最顶尖的存在之一。通常作为九大道庭的副手或大长老，或独立开辟一方大势力。\n\n#### 第四阶段：登临绝顶（大乘）\n\n7. **大乘期（三境：圆满、通玄、至道）**：修士与主修大道的契合度达到九成以上，已经可以用自身意志引动大道共鸣。大乘期修士是九州世界最巅峰的存在，仅次于九大道庭的道主。寿元：约10万年起步，修为精深者可活数十万年，但与大道共鸣越深，寿元越不受凡俗规律限制。地位：大乘修士是整个九州世界的传说级存在，通常隐居于自己的小世界中，非天地大变不出世。能力：可施展“道域”——领域的完全升级版。在道域内，修士可以指定一条自己所悟的法则作为最高准则，压制除大道本源之外的一切法则；可模糊感知与自身相关的因果，预见未来数百年内的大致走向；可为小世界制定基础的法则框架，使其成为真正可独立运转的世界雏形；可施展“大道化身”——分化出一具与本体实力相当的化身，同时处理多项事务。神识：范围可覆盖亿里以上，可扫描整个九州世界，甚至可穿透部分小世界的壁垒。三境说明：圆满：法则感悟圆满，修为达到当前极限，与大道契合度九成以上；通玄：开始接触到大道背后的“玄理”，领悟一些超越法则本身、近乎于“道之本源”的奥秘。此境界修士已可感知到九大道之上那被掩盖的“古神”痕迹——但他们通常会选择忽略；至道：达到“我即是道，道即是我”的境界边缘。距离与大道完全合一、成为道主，只差一丝顿悟或机缘。\n\n" },
        { path: "异修体系：锚点之路", value: "### 异修体系：锚点之路\n\n**核心逻辑**：异修不依赖灵根天赋，不遵从大道法则。每一位异修的本质，是古神回归世间的一个“意义锚点”。修为越强，锚点越稳固，古神意志的侵蚀越深。异修的至高境界，便是古神借体回归的时刻——届时异修自身意识彻底消亡，成为古神降临的容器。\n\n**核心设定**：\n\n* 异修与正统仙道存在根本性冲突：正统仙修顺应大道，而异修的本质是古神回归世间的意义锚点——其力量源于对古神真名残响的共鸣与呼唤，而非吸收天地灵气。异修的存在本身，即是对大道秩序的挑战与破坏。\n* 异修的修行过程，是古神意志逐步侵占宿主身心的不可逆进程。境界越高，异化越严重，最终宿主将彻底沦为古神在人间的化身，自身意识消亡殆尽。\n* 异修的成长路径具有唯一性：每一位异修的真名共鸣方式都是独一无二的，不可复制。且高阶异修的锚点会本能地吸引低阶异修向其靠拢并吞噬，因此异修之间极少合作——这条路注定孤独，无人可信。\n* 暴露风险随力量同步增长：大道对古神气息极度敏感，异修每动用一次力量，被感知的概率就增加一分。九大道庭遍布九州各地的“天网”监测系统，可在异修突破至第三境“寄宿”时将其标记锁定。一旦暴露，异修将面临整个九州世界的围剿与抹杀。\n* 异修之路的本质是一场注定失败的抗争：每一位异修都在用自己的生命为古神搭建回归的桥梁。向前是自我毁灭（古神降临），向后是道庭追杀，停留在原地——锚点也会随着时间推移而自然加深。异修获得的力量越大，离自我毁灭就越近。这条深渊之路没有回头路，其命运从一开始就已注定。\n\n#### 境界划分\n\n1. **第一境：闻音**（锚点深度：<10%）：异修之路的起点。修士在某次机缘（或灾厄）中，第一次捕捉到天地深处传来的“无意义音节”——那是古神真名残留于世界缝隙中的残响。外在表现：脑海中反复出现一段无法理解的旋律或音节，夜深人静时最为清晰；开始对正统道法产生微妙的“不适感”，本能地向往某种“更自由的力量”；偶尔在梦中看到模糊的景象：一片混沌的、没有法则的虚空。能力特征：几乎没有实质性的战斗力提升；对古神造物（如某些秘境中的古老遗迹、被污染的器物）有天然的感知力；极低的概率，在极端情绪波动时，会无意识引发周围法则的微小紊乱。侵蚀表现：修士自身几乎察觉不到异常，只觉得“最近总是走神”；但如果被大道庭的检测阵法扫描，会发现其灵魂上有极其微弱的“异常波动”。风险：此阶段最安全，因为锚点太弱，既无法被大道精准定位，也无法被古神意志强行侵占。但闻音者往往会因为好奇而主动研究那段音节，从而主动迈向第二境。\n2. **第二境：摹形**（锚点深度：10%-30%）：异修开始主动研究那段音节，试图用声音、文字或动作去“模仿”它。这是与古神建立联系的第一步。外在表现：不自觉地画出一些奇怪的符号——这些符号没有固定的形状，每一笔都像是某种“意义的残缺”；性格变得偏执：认为正统道法是“牢笼”，异修之路才是“真理”；身体出现细微变化：某个手指的指甲变成黑色、瞳孔偶尔收缩成竖线、月光下皮肤浮现淡淡的纹路。能力特征：可以通过“摹形”短暂影响现实。例如，在地上画出一个符号后，该区域的气温会骤降；这些效果极不稳定，且往往伴随着不可预测的后果；可以通过“摹形”压制低阶厉鬼或阴物，因为这些存在同样源于古神体系，会本能地服从“真名的呼唤”。侵蚀表现：异修偶尔感到内心深处出现一个“陌生的声音”——不是话语，而是一种模糊的情绪或冲动；例如，无缘无故地愤怒，或者对某个从未去过的地方产生强烈的怀念。风险：此阶段已经可以被大道感知为“异常”，通常会被当地的天道感应系统标记为“需要观察”。如果被正统修士发现，通常会被强制押送至大道庭进行“净化”。\n3. **第三境：寄宿**（锚点深度：30%-60%）：古神的残响不再只是“在耳边回响的音节”，而是开始尝试在异修的灵台（意识深处）中“寄宿”。异修的灵台就像一个破败的庙宇，古神残响是其中逐渐苏醒的雕像。外在表现：精神状态出现明显的分裂感：白天是理智的自我，夜晚（或阴气重的时刻）会被那个“陌生的自己”接管；身体异化变得明显：部分皮肤变得像树皮或石头、头发开始脱落并在原处长出类似触须的纤维、声音偶尔出现“重音”；对禁忌知识产生强烈的渴望，甚至会在睡梦中写出连自己都看不懂的文字；随着锚点加深（接近60%），异修的外表基本失去人形，更像是一团由肉、骨、纤维构成的混沌组合体。能力特征（随锚点深度递增）：锚点深度30%-40%：觉醒“法则紊乱”——可以在短时间内让古神残响覆盖现实，造成一定范围内的法则不稳定；锚点深度40%-50%：觉醒“法则否决”——在自身周围一定范围内，可以单方面否决某一条低级法则的生效。此能力对元婴期及以下的正统修士有极大的压制效果；锚点深度50%-60%：觉醒“锚点领域”——以自身为中心，制造一片“伪混沌区域”。在此区域内，所有后天的法则都会变得不稳定。侵蚀表现：灵台中的古神残响拥有“微弱的人格”：当异修疲惫或意志薄弱时，它会主动说话，用诱惑性的语言引导异修做出更极端的选择；异修开始出现长期“意识断层”：有时会突然发现自己站在某个陌生的地方，而记忆中的上一刻是自己正在睡觉；接近60%时，异修的自我意识被压缩到灵台的一个角落，古神意志占据“主位”。风险：此阶段属于“高危异修”。一旦被大道庭发现，会直接启动“神陨令”——不惜一切代价抹杀；异修面临的最大威胁是天劫——大道会在异修突破此境时降下“法则清洗”，威力超出同阶修士承受范围数倍；每一次动用能力都是在加速自己的消亡。锚点会随着时间推移而自然加深，这是不可逆的过程。\n4. **第四境：畸变**（锚点深度：60%-90%）：异修的肉身已经彻底成为“古神祭坛”——一副承载古神意志的活体容器。异修的意识仍然残存，但已经无法再主导任何行动，只能作为旁观者，看着古神意志一步步接管一切。外在表现：身体完全展开——不再维持人形，而是向四周延伸出大量的血肉触须、骨刺、晶体，形成一个巨大的、盘踞在地上的“祭坛形态”；这个祭坛会不断地向外释放古神的气息，污染方圆数十里的天地灵气。正统修士无法在此区域修炼，凡人会做噩梦并逐渐衰弱，动物会变异成怪物的雏形；接近90%时，异修不再需要固定形态，可以以“移动的灾厄”的形态行动；异修唯一还能控制的部分，可能是眼睛——那双眼睛中，偶尔会闪过一丝属于“人”的光芒，但很快就会被混沌吞没。能力特征（随锚点深度递增）：锚点深度60%-80%：核心能力——“古神走廊”。可以在自身周围撕开一道通往混沌虚空的门（虽然极其不稳定）；锚点深度80%-90%：觉醒“伪·创世权柄”。可以在极小的范围内，模拟古神的“无中生有”能力，创造出一片独立于九大道之外的微型领域；锚点深度85%-90%：可以呼唤真名造成大范围的“世界失真”——现实与幻觉的界限消失。侵蚀表现：异修的意识已经模糊到几乎无法感知自我，只留下一丝执念或本能；古神意志的大部分已经苏醒，记忆片段不断涌入，覆盖着异修原本的人生轨迹；异修偶尔会在清醒的瞬间，发现自己正在做的事情根本不是自己想做的。风险：此境异修会受到九大道庭的最高优先级关注。每一个“畸变”的出现，都会惊动至少三位道主级别的存在联手应对；道主们拥有直接调动大道本源力量的能力，可以发动“根源封印”——将其连人带古神意志一起封印在时空间隙之中；历史上第九位达到此境的异修，是在三千年前的“大暗之战”中被五位道主联手镇压的。那一战，九州被打碎了一块大陆。\n5. **第五境：降世**（锚点深度：100%）：异修之路的终点，也是古神回归的起点。当锚点深度达到100%的那一刻，异修彻底消失。取而代之的，是自太古沉睡至今的古神，在九州世界睁开了眼睛。此境之后发生的事：宿主消亡——异修的意识完全被古神意志取代，连“曾经存在过”的痕迹都会被抹去；大道震动——古神降临的那一刻，九州世界的九条大道都会发出悲鸣。整个世界的灵气浓度会下降一至两成；九道主集结——九位道主会第一时间感应到古神的降临，并启动“九道天封”——以整个九州世界的力量为代价，将古神重新封印。历史上的记录：自元初之战后，九位古仙化为大道封印古神以来，从未有任何异修达到第五境“降世”；最接近的一次是在三千年前的“大暗之战”，一名达到畸变境（锚点深度约88%）的异修几乎完成降临，但被五位道主以自身沉眠为代价强行中断了仪式；但大道也付出了惨重的代价：那一次封印导致九州大陆的“天柱”断了一根，天地间的法则至今仍有不稳定之处。\n\n" },
        { path: "异端与禁忌：真名的残响", value: "## 九、异端与禁忌：真名的残响\n\n在这个世界，不存在任何祭祀古神的仪式，没有图腾，没有典籍，没有传说，甚至连“古神”这个词汇都不存在于任何已知文明中。然而，大道的压制并非绝对无缝。\n\n### 1\\. 冥冥中的残响\n\n古神真名的力量太过宏大，即便九大大道抹除了其一切痕迹，真名的余波依然如深渊中的低语，隐没在天地间某些极不显眼的“规律”中。极少数心性偏执、或机缘极端的修士，会在刻画某个生涩符文、聆听某段天地音律、或是感悟某种天地韵律时，偶然触碰到那被大道掩盖的缝隙，感受到一串无意义却直击灵魂的“音节”——这便是古神真名的残留。\n\n### 2\\. 呼唤真名的异修（邪修）\n\n一旦有修士在无意或有意中，通过音律、符文或韵律吟唱出那串真名残音，便等同于在虚空中呼唤了古神。\n\n* **绝对禁忌的力量**：呼唤真名，能够瞬间绕过世间一切法则与灵力体系，从“无”中扭曲出一丝不属于自己的全能力量。这种力量无视防御、无视灵气守恒，对正统修士呈现降维打击。这便是异修（邪修）的起源。\n* **短平快的深渊**：异修无需苦修灵气，无需遵循五行法则，他们只需不断在冥冥中捕捉那些残响并呼唤真名，便能轻易获得摧毁同阶甚至越阶杀敌的力量。但代价是，每一次呼唤，都在加速古神之念的苏醒，同时也在让自身的灵魂被那不可名状的“念”所侵蚀同化。\n\n### 3\\. 天道抹杀：绝对空白与不可名之罚\n\n九尊古仙所化的大道，其首要意志便是压制古神之念。因此，大道对任何触动真名的行为，有着比天劫更恐怖的绝对抹杀机制。\n\n* **难以想象的天罚**：异修一旦在施展力量时暴露出哪怕一丝真名残响的气息，或是被大道的运转规律感知到其力量来源“无中生有”，便会瞬间引来天罚。这种天罚绝非寻常的雷劫，而是“大道抹杀”：形神俱灭——天罚无视任何法宝、修为、遁法，直接从法则层面将异修的存在抹去；因果剥夺——被天罚击杀者，其过往在这个世界留下的因果、记忆、甚至他人的认知，都会被大道强行修正和剥离。除了空荡荡的消散，证明其曾经存在的痕迹将被彻底抹除，连转世入轮回的资格都没有。\n* **绝对的文化空白**：正因为天罚的恐怖与彻底，世间绝无任何关于古神的仪式、流派或遗迹留存。任何试图将真名残响系统化、文字化、仪式化的尝试，在第一步就会引发大道的察觉，从而被瞬间抹杀。活下来的异修，皆是孤独的疯子，他们将真名深藏心底，只在生死存亡之际以最隐秘的方式呼唤，且往往在用出几次后便被大道锁定，化作世间一抹不留痕迹的尘埃。\n\n" },
        { path: "后世仙修：大道之下的法则循规", value: "## 十、后世仙修：大道之下的法则循规\n\n古仙化道后，修行进入仙的时代。因古神那“从无到有”的权能缺失，后世世界受限于“物质力量不灭不生”的铁律。\n\n1. **循规蹈矩的执法者**：后世仙人的修行，本质是吸收已有力量、沿着古仙留下的法则脉络修炼，追求大道的存在。他们无法像古仙那样创造法则，只能在既定的框架内成为法则的使用者。无论后世仙人如何通天，他们始终是大道的囚徒，绝无僭越的可能。\n2. **唯一的联系：神念之谜**：后世修行体系中，与古神唯一的隐秘联系，便是“神念”。古仙当年模仿古神，虽未能掌握“无中生有”的权能，却模仿出了以意识干涉现实的雏形。这残留的模仿痕迹，在后世演化为了修士的“神念”（如神识探查、神念传音、御物等）。后世仙人只知神念是修为进阶的自然产物，却不知这看似寻常的神念，实则是古神那“绝对自由之念”被法则重重枷锁后，透出的一丝微弱残影。神念越强，意味着修士潜意识中对古神之念的模仿越深，但这永远无法触及古神的权能。\n\n" },
        { path: "设定速览", value: "## 十一、设定速览\n\n|维度|正统仙修|异修/邪修|\n|-|-|-|\n|力量来源|吸收灵气，顺应法则运行|呼唤古神真名，从“无”中窃取权能|\n|与古神联系|神念（古仙模仿古神之念的合法残迹）|真名残响（通过音律/符文/韵律触碰）|\n|战斗表现|遵循物质守恒，法术对轰，规则博弈|绕过法则，无视守恒，降维打击，诡异莫测|\n|终极下场|寿终正寝或渡劫失败入轮回|一旦被大道感知，形神俱灭，存在痕迹被彻底抹除|\n|社会认知|修仙界的绝对正统|极罕见的疯子，无传承、无组织、无仪式的禁忌|\n\n\n\n" }
      ]
    },
    player: {
      name: '江砚', gender: '男', age: '二十二', race: '人族', occupation: '大泽宗外门弟子 · 观潮台值守', faction: '沧溟域·大泽宗',
      appearance: '身形清瘦，皮肤被湖风与日头磨成浅褐色。穿洗得发白的青色外门弟子服，腰间挂一枚带裂纹的水纹木牌，右手虎口有常年握桨留下的厚茧。',
      personality: '谨慎、耐得住寂寞，习惯先看水色再下判断；对宗门规矩并不盲从，心里藏着一点不肯认命的执拗。',
      speechStyle: '话不多，用词朴素，常拿潮汐、风向和水量打比方。',
      habits: '每日辰时与酉时各记一次水位；紧张时用拇指摩挲木牌上的裂纹。',
      likesDislikes: '喜欢雨后湖面的腥气与深夜的潮声；厌恶有人在水殿附近吹奏来历不明的曲调。',
      beliefs: '水不会说谎，会变的是看水的人。',
      abilities: '炼气期五重，水行基础法术（引水、凝雾、踏浪）纯熟；熟悉沧溟域水文与星渡法阵的日常维护；水性极佳，能在水下闭气一炷香。',
      weaknesses: '修为低微，神识未开；对宗门高层与道庭的规矩缺乏应对经验；一旦离开水边，判断力会明显下降。',
      emotion: '平静', health: '良好', inventory: '水纹木牌、测水铜尺、一小袋下品灵石、油布雨披、半块干粮',
      currentGoal: '查清昨夜水文法阵为何在无潮时自行运转', profileMd: ''
    },
    npcs: [
      { name: "楚镇海", gender: "男", age: "2,360岁", race: "人族", occupation: "宗主 / 沧溟域水文与航运法阵掌管者", faction: "沧溟域·大泽宗", currentLocation: "沧溟域·大泽宗·湖底归墟水殿", appearance: "身形高大魁梧，面容刚毅如刀削斧刻的四十余岁男子。长发墨黑以碧玉簪束顶，须髯修长。双目深邃，瞳孔深处隐有水波流转。常年身着玄青色广袖道袍（银线绣水网图纹），腰悬水蓝色灵玉令牌。肤色微古铜，偶现细微鳞状光泽。", personality: "沉稳如山岳，冷峻威严，不怒自威。对宗门弟子极为严苛，内心极度警惕且富有责任感，对水行大道有近乎偏执的信念。", speechStyle: "声如洪钟，语速平缓却带有不容置疑的威压，言简意赅，绝不废话。", habits: "长年于水下行功吐纳；思考时会无意识地调动周身潮汐韵律起伏。", likesDislikes: "喜好绝对的秩序与水行大道的纯粹；厌恶任何来历不明的音律、符文及靠近虚无海的莽撞行为。", beliefs: "坚信“水行大道”与“秩序”能洗涤一切污秽，认为律法与戒律是保护九州免受古神低语吞噬的唯一壁垒，为了维系大局可不惜牺牲个体。", abilities: "修为化神期·归真境（寿元上限约30,000年）。拥有【水之领域】（削弱敌人、倍增水法、抽干敌水）、【元神融合】（断肢再生）、【神识范围50万里】精确感知水流波动，本命神通【潮汐归墟】（通天水柱绞碎万物）。", weaknesses: "因曾直击古神真名残响，道心留有隐忧，对虚无海相关事物过度敏感；因需坐镇沧溟域，行动范围受限于水文法阵核心。", emotion: "沉稳", health: "良好", inventory: "碧玉簪、玄青色广袖道袍、水蓝色灵玉令牌", relationships: "大泽宗弟子（极为严苛）；天枢道庭（礼敬）；异修（零容忍）", currentGoal: "死守沧溟域水文法阵，严防虚无海法则裂隙带的异动扩大，确保宗门弟子不被古神低语侵蚀。", profileMd: "## 简要描述\n沧溟域大泽宗宗主，水行法则顶尖掌控者，九州公认的循法者标杆，坐镇湖底防备虚无海异动。\n\n## 其他背景故事设定\n三百前在虚无海巡视时不慎踏入法则裂隙带，听到古神真名残响，凭水行大道强行冲刷灵台斩断低语。此后立下铁律：筑基以下弟子禁入虚无海三百里内，研究不明音律符文者一律押送道庭。他深知天网并非无懈可击，低语只是被压制从未消失。" },
      { name: "夜枭", gender: "男", age: "47岁", race: "人族", occupation: "落魄画师 / 危险异常个体", faction: "无（原天枢域·清玄宗，已脱离）", currentLocation: "天枢域·雍国都城·城南旧画铺", appearance: "白昼时为三十岁出头的清瘦男子，面色苍白，眼窝微陷，嘴角常挂温和却疏离的笑。发凌乱束于脑后，穿发白灰布长衫，袖口沾满墨渍，十指修长有力。入夜后左手无名指指甲变漆黑如镜，瞳孔收缩成竖线，后颈至肩胛骨浮现淡灰色裂纹，发声时带诡异“重音”。", personality: "白天的“陆平”温和、胆怯，对异修力量感到恐惧与厌恶；夜晚的“夜枭”冷酷、偏执，视正统道法为牢笼，认为真名残响才是真理。", speechStyle: "白天轻声细语，举止有礼如落魄文人；夜晚声音冰冷偏执，常伴随两人同时说话的诡异重音。", habits: "习惯用笔墨在纸上或用手指在空中无意识地描摹“残缺符号”；白天作画时常陷入意识断层。", likesDislikes: "喜好安静作画与思考古神真理（夜枭人格）；厌恶宗门冷眼与正统修法的束缚。", beliefs: "“陆平”人格仍然尊崇正统道法的威严并恐惧异端；“夜枭”人格则视正统修法为禁锢凡人灵性的“牢笼”，狂热地认为古神真名残响才是超脱阶级、触及真理的终极大道。", abilities: "正统修为炼气期九重（寿元上限约150年），异修境界为第三境·寄宿（锚点深度45%，侵蚀加速致实际存续不足30年）。拥有【法则否决】（单方面否决低级法则，元婴期下五行法术失效）、【摹形压制】（压制低阶厉鬼阴物）、【古神造物感知】。", weaknesses: "每次动用能力加速暴露且锚点加深不可逆；白天“陆平”人格正被压缩，意识断层频繁；正统寿元因侵蚀实际存续不足30年。", emotion: "分裂", health: "被侵蚀", inventory: "", relationships: "原天枢域清玄宗（已脱离）", currentGoal: "暗中筹划跨越星渡法阵逃往沧溟域或摇光域边缘的虚无海零地带。", profileMd: "## 简要描述\n原清玄宗外门弟子，因描摹古神符文沦为异修，现以落魄画师身份潜伏于雍国都城，深陷人格分裂与被追猎的绝境。\n\n## 原名\n原名：陆平\n\n## 其他背景故事设定\n因灵根低劣苦修三十五年卡在炼气八重。三十九岁修补废弃法阵时无意间描摹岩壁刻痕，被古神真名劈入脑海。四十岁动用力量被天网感知，趁乱逃出清玄宗潜入凡人王朝隐匿。" },
      { name: "烬", gender: "男", age: "4,712岁", race: "人族", occupation: "巡天使第七小队队长 / 高阶猎杀者", faction: "天权域·天权道庭·巡天使部队", currentLocation: "天权域·虚无海边缘·虚梭船", appearance: "外表二十五六岁，面容冷峻如刀锋，皮肤因高寒与镇魂甲呈冰晶般苍白。纯白齐肩短发从不束起。双目为极浅灰蓝色，瞳孔凝着薄冰冷光（望气术痕迹）。身披暗银与冰蓝交织的“镇魂甲”，腰悬漆黑无锋的奇门兵刃“寂灭刺”。", personality: "沉默、坚硬、冰冷至极，不存一丝多余情感波动。绝对理智，从不犹豫与怜悯，拒绝建立私人关系。", speechStyle: "极少开口，发声时声线冰冷毫无起伏，只陈述事实与判决，绝无情绪宣泄。", habits: "双眼长年被动运转“观痕”术扫视四周；战斗后习惯立刻碎裂战场残留的冰晶以防痕迹留存。", likesDislikes: "喜好绝对的寂静与孤独；厌恶任何形式的情感羁绊与对异修的纵容怜悯。", beliefs: "笃信“绝对的理智与牺牲是捍卫九州存亡的唯一基石”，认为对异修的任何怜悯都等同于纵容古神归来；真名与自我并不重要，唯有职责重于泰山。", abilities: "修为化神期·化神境（寿元上限约30,000年）。拥有【望气术·观痕】（看破异修灵魂裂痕）、【封印术精通】（快速冰封敌身）、【寂灭刺·法则真空】（切断异修与古神联系）、【镇魂甲·真名隔绝】。", weaknesses: "战术风格导致一击不中即退容易被逃脱；常年身处法则裂隙带，虽隔绝真名但孤身作战风险极高；真名被剥离，自身与大道的联系存在不可逆的残缺。", emotion: "冰冷", health: "真名残缺", inventory: "镇魂甲、寂灭刺", relationships: "副手兼挚友霜（已亲手处决）；天权道庭（隶属）", currentGoal: "追猎九大道庭档案中的高威胁异修，特别是正在筹备集结的“无名之祭”。", profileMd: "## 简要描述\n天权道庭巡天使高阶猎杀者，常游弋于虚无海边缘的无情杀手，专职追猎被古神侵蚀的异修。\n\n## 原名\n真名已封印，此为道号\n\n## 其他背景故事设定\n三百岁通过残酷选拔成为巡天使，真名被大道法则强行剥离封印，意为“焚尽之后所余的灰”。四千余年猎杀超三百名异修。三百年前因副手兼挚友“霜”被异修波及灵魂留痕，他亲手用寂灭刺刺入其灵台，从此断绝一切私人情感。" },
      { name: "玄明道人", gender: "男", age: "87,400岁", race: "人族", occupation: "隐世强者 / 小世界之主", faction: "玄黄域·无门无派（与天枢道庭道主为故交）", currentLocation: "玄黄域·玄明小世界·观星台", appearance: "伪装时为干瘦佝偻老头，约五尺高，穿灰扑扑沾泥旧道袍，面容枯槁如老树皮，花白长眉垂至腮边。展露修为时皮囊透出温润玄黄光华，双目变深邃金棕，脊背挺直，周身空间震颤。化身则穿玄黄帝袍，眼神锐利，环绕大地法则纹路。", personality: "大智若愚，随性慵懒，对世俗之事漠不关心；内心极为审慎克制，深明“有些真相非人力可承受”的道理，信奉无为而治。", speechStyle: "老态龙钟时说话慢吞吞、含糊不清；展露本相时声如洪钟大吕，言辞充满大道玄理与不可违逆的威严。", habits: "伪装出山在矿脉间游走挑拣罕见炼器材料；平时半睁半闭眼似打瞌睡。", likesDislikes: "喜好安宁与自然造化之物；厌恶修士不知敬畏地窥探大道背后的禁忌真相。", beliefs: "信奉“无为而治”与“敬畏天道”，认为万物皆有其因果定数，人类修士不应窥探大道背后无法承受的禁忌真相，过早干预反而会引发更大的法则动荡。", abilities: "修为大乘期·通玄境（寿元已不受凡俗规律限制，可活数十万年）。拥有【道域】（指定大地法则为最高准则压制万物）、【大道化身】、【因果感知】、【小世界法则制定】、神识覆盖亿里以上、【大地亲和】（毁城之力与绝对防御）。", weaknesses: "受限于对法则波动的顾虑，不愿轻易出手干预外界，以防引发更大的法则动荡；因果感知模糊象征，无法精确到具体事件。", emotion: "慵懒", health: "良好", inventory: "灰旧道袍", relationships: "天枢道庭道主（故交）", currentGoal: "观望九大道庭应对即将到来的因果变局，守护自己开辟的“玄明小世界”稳定。", profileMd: "## 简要描述\n九州世界最古老的传说级存在之一，隐居于自行开辟的小世界中，近期推演到类似九千万年前大暗之战的因果正在酝酿。\n\n## 原名\n道号\n\n## 其他背景故事设定\n师承一脉的上古传承中残留着大暗之战的残缺记载，他据此推演九千万年前那场五道主联手镇压畸变境异修、天柱断裂的真相，但记载早已磨灭，只剩零散符文与因果残痕。突破通玄境时隐约感知到大道之上被掩盖的古神痕迹，脊背发凉后强行封锁感知退居小世界。近年来推演到摇光域与天权域交界处有类似大暗之战的因果酝酿，已告知天枢道主但选择观望。" },
      { name: "无名之祭", gender: "原为男，现已无性别可言", age: "约360年", race: "人族（已完全异化）", occupation: "活体灾厄 / 孤立的灾厄个体", faction: "无", currentLocation: "摇光域与天权域交界·大暗战场遗址", appearance: "主体为直径三百丈的巨大混合物，由暗红血肉、苍白骨突与诡异紫晶体交织构成。底层蠕动肉垫，中层交错骨刺触须，顶层晶体柱如畸形王冠。边缘延伸出无数末端长有“眼球器官”花朵的触须。主体深处藏着两颗拳头大小的人类眼球，散发着腐肉与臭氧气息。", personality: "主体意识混沌疯狂，充满破坏与同化的本能；残存的人类意识则深陷绝望、恐惧与对自由的眷恋。", speechStyle: "主体无法以人类语言发声，只能通过释放古神低语、灵气污染场与精神波动制造幻觉；残存意识偶尔发出无声的灵魂悲鸣。", habits: "本能地向外延伸触须扫描四周；残存意识在偶尔清醒时凝视天空。", likesDislikes: "喜好法则不稳定的废墟与混沌气息；厌恶正统修士的靠近与道庭的封印手段。", beliefs: "古神意志主导下，信仰“混沌同化”与“真名的终极降临”；残存的姜衍意识则已在绝望中放弃一切求索，唯存对曾身为人类时“自由”的悲痛眷恋与对消亡的渴望。", abilities: "修为（异修境界）为第四境·畸变（锚点深度72%，若不被封印将在锚点达100%时成为古神降临容器，自身意识彻底消亡）。拥有【古神走廊】（撕开通往混沌虚空门扉）、【灵气污染场】（污染数十里灵气）、【触须感知网】、【法则紊乱辐射】（使法术失控阵法失灵）。", weaknesses: "核心深处的两颗人类眼球是残存意识的唯一锚点，也是唯一未被古神完全覆盖的节点，若被精准打击可能短暂干扰整体行动。", emotion: "混沌", health: "崩解", inventory: "无", relationships: "师父（被他亲手杀死）", currentGoal: "本能地等待锚点达到100%成为古神降临的容器；残存意识则渴望终结。", profileMd: "## 简要描述\n九大道庭最高优先级通缉目标，盘踞于大暗战场遗址的活体灾厄，即将成为古神降临容器的畸变异修。\n\n## 原名\n原名：姜衍，已被大道剥夺\n\n## 其他背景故事设定\n曾是玉衡域惊才绝艳的金丹剑修，六十一年前探索秘境时强行炼化混沌之力，导致真名残响涌入。因恐惧与古神双重驱使下杀死试图净化他的师父逃亡。修为一路跌落但异修力量飞涨，突破畸变境后肉身崩溃化为祭坛形态，被大暗战场遗址的残留气息吸引并盘踞至今近十年。" }
    ]
  },
];

/* ---------------- 图片媒体（IndexedDB） ----------------
   封面 / 头像 / 背景图体积大，放进 localStorage 很容易把 5–10MB 配额撑爆。
   这里把 dataURL 存进 IndexedDB，结构化数据里只留 `idb:<id>` 引用；
   浏览器不支持 IndexedDB 时自动退回内联 dataURL，功能不受影响。 */
const MEDIA = Object.create(null);
const MEDIA_PREFIX = 'idb:';
let _mediaDB = null;
let _mediaOpening = null;
function mediaOpen() {
  if (_mediaDB) return Promise.resolve(_mediaDB);
  if (_mediaOpening) return _mediaOpening;
  _mediaOpening = new Promise(resolve => {
    let done = false;
    const finish = v => { if (!done) { done = true; resolve(v); } };
    try {
      if (!window.indexedDB) return finish(null);
      const req = indexedDB.open('qiyuan_media', 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('img')) db.createObjectStore('img');
      };
      req.onsuccess = () => { _mediaDB = req.result; finish(_mediaDB); };
      req.onerror = () => finish(null);
      req.onblocked = () => finish(null);
    } catch (e) { finish(null); }
  });
  return _mediaOpening;
}
function mediaPut(id, data) {
  return mediaOpen().then(db => new Promise(resolve => {
    if (!db) return resolve(false);
    try {
      const tx = db.transaction('img', 'readwrite');
      tx.objectStore('img').put(data, id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
      tx.onabort = () => resolve(false);
    } catch (e) { resolve(false); }
  }));
}
function mediaGet(id) {
  return mediaOpen().then(db => new Promise(resolve => {
    if (!db) return resolve('');
    try {
      const tx = db.transaction('img', 'readonly');
      const rq = tx.objectStore('img').get(id);
      rq.onsuccess = () => resolve(rq.result || '');
      rq.onerror = () => resolve('');
    } catch (e) { resolve(''); }
  }));
}
function mediaDel(id) {
  return mediaOpen().then(db => new Promise(resolve => {
    if (!db) return resolve(false);
    try {
      const tx = db.transaction('img', 'readwrite');
      tx.objectStore('img').delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch (e) { resolve(false); }
  }));
}
// 结构化数据里保存的引用 → 可直接放进 <img src> / background-image 的字符串
function imgRef(ref) {
  if (!ref) return '';
  const v = String(ref);
  if (v.startsWith(MEDIA_PREFIX)) return MEDIA[v.slice(MEDIA_PREFIX.length)] || '';
  return v;
}
function isMediaRef(v) { return typeof v === 'string' && v.startsWith(MEDIA_PREFIX); }
// 把 dataURL 写入 IndexedDB，并在对象字段上留下引用
function storeImage(obj, key, data) {
  if (!obj || !data) return Promise.resolve('');
  if (!String(data).startsWith('data:')) { obj[key] = data; return Promise.resolve(data); }
  const id = uid('img');
  MEDIA[id] = data;
  obj[key] = MEDIA_PREFIX + id;
  return mediaPut(id, data).then(ok => {
    if (!ok) { delete MEDIA[id]; obj[key] = data; }
    return obj[key];
  });
}
// 启动时：把旧存档里的内联 dataURL 迁移到 IndexedDB，并载入所有引用
function hydrateMedia() {
  const tasks = [];
  const changed = { v: false };
  const handle = (obj, key) => {
    if (!obj || typeof obj[key] !== 'string' || !obj[key]) return;
    const val = obj[key];
    if (val.startsWith('data:image/')) {
      const id = uid('img');
      MEDIA[id] = val;
      obj[key] = MEDIA_PREFIX + id;
      changed.v = true;
      tasks.push(mediaPut(id, val).then(ok => { if (!ok) { delete MEDIA[id]; obj[key] = val; } }));
    } else if (isMediaRef(val)) {
      tasks.push(mediaGet(val.slice(MEDIA_PREFIX.length)).then(data => {
        if (data) MEDIA[val.slice(MEDIA_PREFIX.length)] = data;
      }));
    }
  };
  DB.stories.forEach(s => {
    handle(s.world, 'cover');
    handle(s.player, 'avatar');
    (s.npcs || []).forEach(n => handle(n, 'avatar'));
    if (s.bg) handle(s.bg, 'src');
  });
  (DB.cards || []).forEach(rec => {
    const cw = rec.card && rec.card.world;
    if (cw && cw.cover && typeof cw.cover.image === 'string' && cw.cover.image) {
      const box = { image: cw.cover.image };
      handle(box, 'image');
      if (box.image !== cw.cover.image) { cw.cover.image = box.image; changed.v = true; }
    }
  });
  if (typeof WIZ !== 'undefined' && WIZ.world) handle(WIZ.world, 'cover');
  return Promise.all(tasks).then(() => { if (changed.v) saveNow(); });
}

/* ---------------- 世界封面 ---------------- */
const COVERS = [
  { id: 'jiuzhou', name: '九州', src: 'covers/jiuzhou.jpg' },
  { id: 'inn', name: '夜灯', src: 'covers/inn.svg' },
  { id: 'harbor', name: '雾港', src: 'covers/harbor.svg' },
  { id: 'stars', name: '星环', src: 'covers/stars.svg' },
  { id: 'fog', name: '江雾', src: 'covers/fog.svg' },
  { id: 'rain', name: '山雨', src: 'covers/rain.svg' },
  { id: 'dusk', name: '暮野', src: 'covers/dusk.svg' }
];
function coverById(id) {
  const c = COVERS.find(x => x.id === id) || COVERS[0];
  return c.src;
}
function coverSrc(w) {
  if (!w) return coverById('jiuzhou');
  if (w.cover) return imgRef(w.cover) || coverById('jiuzhou');
  const byId = COVERS.find(c => c.id === w.coverId);
  if (byId) return byId.src;
  const n = String(w.name || '');
  if (/九州|仙|州域|道庭/.test(n)) return coverById('jiuzhou');
  if (/客栈|临江/.test(n)) return coverById('inn');
  if (/雾港|港|码头/.test(n)) return coverById('harbor');
  if (/星环|星|舰/.test(n)) return coverById('stars');
  return coverById('fog');
}
function coverStyle(w) {
  return `background-image:url('${String(coverSrc(w)).replace(/'/g, '%27')}');background-size:cover;background-position:center`;
}
function activeCoverId(w) {
  if (!w || w.cover) return '';
  const s = coverSrc(w);
  const c = COVERS.find(x => x.src === s);
  return c ? c.id : '';
}

/* ---------------- 中文历法 / 时间引擎 ---------------- */
const SHICHEN = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'];
const SHICHEN_HOUR = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
const WEEKDAY_CN = ['日', '一', '二', '三', '四', '五', '六'];
const CN_DIGIT = { 零: 0, 〇: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };

function cn2num(raw) {
  let s = String(raw == null ? '' : raw).trim();
  if (!s) return NaN;
  if (/^\d+$/.test(s)) return parseInt(s, 10);
  s = s.replace(/^初/, '').replace(/^廿/, '二十').replace(/^卅/, '三十');
  let total = 0, section = 0, num = 0, seen = false;
  for (const ch of s) {
    if (ch in CN_DIGIT) { num = CN_DIGIT[ch]; seen = true; }
    else if (ch === '十') { section += (num || 1) * 10; num = 0; seen = true; }
    else if (ch === '百') { section += (num || 1) * 100; num = 0; seen = true; }
    else if (ch === '千') { section += (num || 1) * 1000; num = 0; seen = true; }
    else return NaN;
  }
  return seen ? total + section + num : NaN;
}
function pad2(n) { return String(n).padStart(2, '0'); }
function isCnNum(s) { return /[〇零一二三四五六七八九十百千]/.test(String(s || '')); }
function num2cn(n) {
  n = Math.floor(Math.abs(Number(n) || 0));
  const d = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  if (n < 10) return d[n];
  if (n < 20) return '十' + (n % 10 ? d[n % 10] : '');
  if (n < 100) return d[Math.floor(n / 10)] + '十' + (n % 10 ? d[n % 10] : '');
  if (n < 1000) {
    const h = Math.floor(n / 100), r = n % 100;
    return d[h] + '百' + (r === 0 ? '' : (r < 10 ? '零' + d[r] : num2cn(r)));
  }
  if (n < 10000) {
    const t = Math.floor(n / 1000), r = n % 1000;
    return d[t] + '千' + (r === 0 ? '' : (r < 100 ? '零' + num2cn(r) : num2cn(r)));
  }
  return String(n);
}
function shichenIndex(h) {
  if (h === 23 || h === 0) return 0;
  for (let i = 1; i < 12; i++) if (h >= SHICHEN_HOUR[i] && h < SHICHEN_HOUR[i] + 2) return i;
  return 0;
}
/** 去掉末尾的「星期X / 周X / 礼拜X」（允许括号），返回星期字符。 */
function splitWeekday(str) {
  let weekday = null;
  const core = String(str == null ? '' : str).replace(
    /\s*[（(]?\s*(?:星期|周|礼拜)\s*([一二三四五六日天])\s*[）)]?\s*$/,
    (m, d) => { weekday = d === '天' ? '日' : d; return ''; }
  );
  return { core: core.trim(), weekday };
}
function parseWorldTime(str) {
  const sp = splitWeekday(str);
  const p = parseWorldTimeCore(sp.core);
  if (p && sp.weekday) p.weekday = sp.weekday;
  return p;
}
function parseWorldTimeCore(str) {
  if (!str) return null;
  const s = String(str).trim();
  let m;
  m = s.match(/^(.*?)([〇零一二三四五六七八九十百千\d]+)年([〇零一二三四五六七八九十百千初\d]+)月([〇零一二三四五六七八九十百千初\d]+)日\s*(子|丑|寅|卯|辰|巳|午|未|申|酉|戌|亥)时$/);
  if (m) {
    const idx = SHICHEN.indexOf(m[5] + '时');
    return { style: 'shichen', prefix: m[1], cn: isCnNum(m[2] + m[3] + m[4]), y: cn2num(m[2]), mo: cn2num(m[3]), d: cn2num(m[4]), h: SHICHEN_HOUR[idx], mi: 0 };
  }
  m = s.match(/^(.*?)([〇零一二三四五六七八九十百千\d]+)年([〇零一二三四五六七八九十百千初\d]+)月([〇零一二三四五六七八九十百千初\d]+)日\s+(\d{1,2}):(\d{2})$/);
  if (m) return { style: 'calmodern', prefix: m[1], cn: isCnNum(m[2] + m[3] + m[4]), y: cn2num(m[2]), mo: cn2num(m[3]), d: cn2num(m[4]), h: +m[5], mi: +m[6] };
  m = s.match(/^(.*?)(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{2})$/);
  if (m) return { style: 'iso', prefix: m[1], y: +m[2], mo: +m[3], d: +m[4], h: +m[5], mi: +m[6] };
  m = s.match(/^(.*?)([〇零一二三四五六七八九十百千\d]+)年([〇零一二三四五六七八九十百千初\d]+)月([〇零一二三四五六七八九十百千初\d]+)(?:日|号)?$/);
  if (m) return { style: 'dateonly', prefix: m[1], cn: isCnNum(m[2] + m[3] + m[4]), y: cn2num(m[2]), mo: cn2num(m[3]), d: cn2num(m[4]), h: 12, mi: 0 };
  m = s.match(/^(\d{1,2}):(\d{2})$/);
  if (m) return { style: 'timeonly', prefix: '', y: 1, mo: 1, d: 1, h: +m[1], mi: +m[2] };
  return null;
}
function formatWorldTime(p) {
  if (!p || !isFinite(p.y) || !isFinite(p.mo) || !isFinite(p.d)) return '';
  const N = p.cn ? num2cn : (x => x);
  const D = p.cn ? (x => (x >= 1 && x <= 10 ? '初' + num2cn(x) : num2cn(x))) : (x => x);
  // 公历式日期可可靠推算星期；虚构历法无法推算，不保留星期后缀。
  const W = (() => {
    if (!p.weekday) return '';
    if (p.style === 'iso' || (p.style === 'calmodern' && !p.cn)) {
      const dt = new Date(Date.UTC(2000, Math.max(0, (p.mo || 1) - 1), p.d || 1));
      dt.setUTCFullYear(p.y);
      return ' 星期' + WEEKDAY_CN[dt.getUTCDay()];
    }
    return '';
  })();
  if (p.style === 'shichen') {
    // 子时横跨午夜：00:00–00:59 仍属前一日的子时。
    // 否则「十五日子时」往返解析会被算成 23:00，每过午夜凭空多出一天。
    let y = p.y, mo = p.mo, d = p.d;
    if (p.h < 1) {
      d -= 1;
      if (d < 1) { d = 30; mo -= 1; if (mo < 1) { mo = 12; y -= 1; } }
    }
    return `${p.prefix}${N(y)}年${N(mo)}月${D(d)}日${SHICHEN[shichenIndex(p.h)]}`;
  }
  if (p.style === 'calmodern') return `${p.prefix}${N(p.y)}年${N(p.mo)}月${D(p.d)}日 ${pad2(p.h)}:${pad2(p.mi)}` + W;
  if (p.style === 'iso') return `${p.prefix}${p.y}-${pad2(p.mo)}-${pad2(p.d)} ${pad2(p.h)}:${pad2(p.mi)}` + W;
  if (p.style === 'dateonly') return `${p.prefix}${N(p.y)}年${N(p.mo)}月${D(p.d)}日`;
  if (p.style === 'timeonly') return `${pad2(p.h)}:${pad2(p.mi)}`;
  return '';
}
function advanceWorldTime(str, minutes) {
  const p = parseWorldTime(str);
  if (!p) return str;
  const add = Math.max(0, Math.round(Number(minutes) || 0));
  if (!add) return str;
  if (p.style === 'iso' || p.style === 'calmodern') {
    const dt = new Date(Date.UTC(2000, Math.max(0, p.mo - 1), p.d, p.h, p.mi));
    dt.setUTCFullYear(p.y);
    dt.setUTCMinutes(dt.getUTCMinutes() + add);
    p.y = dt.getUTCFullYear(); p.mo = dt.getUTCMonth() + 1; p.d = dt.getUTCDate();
    p.h = dt.getUTCHours(); p.mi = dt.getUTCMinutes();
    return formatWorldTime(p);
  }
  let total = p.h * 60 + p.mi + add;
  const dayAdd = Math.floor(total / 1440);
  total %= 1440;
  p.h = Math.floor(total / 60); p.mi = total % 60;
  p.d += dayAdd;
  while (p.d > 30) { p.d -= 30; p.mo++; }
  while (p.mo > 12) { p.mo -= 12; p.y++; }
  return formatWorldTime(p);
}
function timeToMinutes(p) {
  if (!p) return 0;
  return ((((p.y || 1) * 12 + ((p.mo || 1) - 1)) * 30 + ((p.d || 1) - 1)) * 1440) + (p.h || 0) * 60 + (p.mi || 0);
}
function worldMinutesBetween(a, b) {
  const pa = parseWorldTime(a), pb = parseWorldTime(b);
  if (!pa || !pb) return 0;
  return Math.max(0, timeToMinutes(pb) - timeToMinutes(pa));
}
/**
 * 按世界分钟推进实例时间。中文「时辰」历法的显示粒度是 120 分钟，
 * 不足一格的余量存进 _timeCarry，避免每次推进都从同一格重新开始。
 */
function bumpInstanceTime(s, minutes) {
  if (!s || !s.instance) return '';
  const before = s.instance.currentTime;
  // 无法解析的时间不推进，也不累积余量：否则用户修好格式后会瞬间跳掉一大段时间。
  if (!parseWorldTime(before)) { s.instance._timeCarry = 0; return before; }
  const total = Math.max(0, Number(minutes) || 0) + (Number(s.instance._timeCarry) || 0);
  // 只推进整分钟，分钟以下的小数留到下次，否则 1× 时每 30 秒的四舍五入会把时间跑成 2×。
  const whole = Math.floor(total);
  if (whole < 1) { s.instance._timeCarry = total; return before; }
  const next = advanceWorldTime(before, whole);
  const consumed = next === before ? 0 : worldMinutesBetween(before, next);
  s.instance._timeCarry = Math.max(0, total - consumed);
  if (next !== before) s.instance.currentTime = next;
  return s.instance.currentTime;
}
function worldDayLabel(str) {
  const p = parseWorldTime(str);
  if (!p) return String(str || '');
  return `${p.y}年${p.mo}月${p.d}日`;
}
function guessDateTime(str, base) {
  const raw = String(str || '').trim();
  if (!raw) return null;
  if (parseWorldTime(raw)) return raw;
  const baseP = parseWorldTime(base);
  if (!baseP) return null;
  // 只给日期：补上当前时刻
  const dm = raw.match(/^(\d{1,2})[-/月](\d{1,2})日?$/);
  if (dm) {
    const p = Object.assign({}, baseP, { mo: +dm[1], d: +dm[2] });
    return formatWorldTime(p);
  }
  // 只给时辰
  if (SHICHEN.includes(raw)) {
    const p = Object.assign({}, baseP, { h: SHICHEN_HOUR[SHICHEN.indexOf(raw)], mi: 0 });
    return formatWorldTime(p);
  }
  const hm = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (hm) {
    const p = Object.assign({}, baseP, { h: +hm[1], mi: +hm[2] });
    return formatWorldTime(p);
  }
  return null;
}

/* ---------------- 默认数据 · 迁移 ---------------- */
function uid(prefix) { return (prefix || 's') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7); }
function nowTs() { return Date.now(); }
function blankCharacter(name) {
  return {
    name: name || '', avatar: '', gender: '', age: '', race: '', appearance: '', occupation: '', faction: '',
    currentLocation: '', personality: '', speechStyle: '', habits: '', likesDislikes: '', beliefs: '',
    abilities: '', weaknesses: '', emotion: '平静', health: '良好', inventory: '', currentGoal: '', relationships: '', profileMd: '',
    appearanceTraits: [], habitTraits: [], ageAnchorTime: '', ageAtAnchor: null, ageYears: null, ageCn: false, lastHabitAt: '',
    cognition: null
  };
}
function ageYearsOf(c) {
  if (!c) return null;
  if (c.ageYears != null && isFinite(c.ageYears)) return +c.ageYears;
  const raw = String(c.age || '').replace(/岁/, '').trim();
  if (!raw) return null;
  const n = /^\d+$/.test(raw) ? +raw : cn2num(raw);
  return isFinite(n) && n > 0 && n < 200 ? n : null;
}
const WORLD_YEAR_MIN = 518400; // 12 × 30 天 × 1440 分钟，与中文历法换算一致
function initCharacterAge(inst, c) {
  if (!c || c.ageAnchorTime) return;
  const years = ageYearsOf(c);
  if (years == null) return;
  c.ageAtAnchor = years;
  c.ageYears = years;
  c.ageCn = /[〇零一二三四五六七八九十百]/.test(String(c.age || ''));
  c.ageAnchorTime = inst.currentTime || inst.startTime || '';
}
function resetAgeAnchor(s, c) {
  if (!s || !c) return;
  const years = ageYearsOf(c);
  if (years == null) { c.ageAnchorTime = ''; c.ageAtAnchor = null; c.ageYears = null; return; }
  c.ageAtAnchor = years;
  c.ageYears = years;
  c.ageCn = /[〇零一二三四五六七八九十百]/.test(String(c.age || ''));
  c.ageAnchorTime = s.instance.currentTime;
}
function syncCharacterAges(s) {
  if (!s || !s.instance) return;
  const list = [s.player, ...(s.npcs || [])].filter(Boolean);
  for (const c of list) {
    if (!c.ageAnchorTime || c.ageAtAnchor == null) continue;
    const years = Math.max(0, c.ageAtAnchor + Math.floor(worldMinutesBetween(c.ageAnchorTime, s.instance.currentTime) / WORLD_YEAR_MIN));
    if (c.ageYears == null) { c.ageYears = years; continue; }
    if (years === c.ageYears) continue;
    const old = c.ageYears;
    c.ageYears = years;
    c.age = c.ageCn ? num2cn(years) : String(years);
    if (old != null && years > old && s.evolutions) {
      s.evolutions.unshift({
        id: uid('evo'), npcId: c === s.player ? 'player' : c.id, name: c.name,
        time: s.instance.currentTime, changeType: 'age',
        description: `年岁增长至 ${c.age}`, trigger: '世界时间自然流逝',
        before: { age: String(old) }, after: { age: String(years) }, ts: nowTs()
      });
      if (s.evolutions.length > 80) s.evolutions = s.evolutions.slice(0, 60);
    }
  }
}
function blankLLM() {
  return { mode: 'own', format: 'openai', endpoint: 'https://api.openai.com/v1', apiKey: '', model: 'gpt-4o-mini', temperature: 0.85, maxTokens: 1400 };
}
/* 全局 API 池：接口条目与聚合组，不属于任何世界实例 */
function blankApi(name) {
  return { id: uid('api'), name: name || '', enabled: true, format: 'openai', endpoint: '', apiKey: '', model: '', temperature: 0.85, maxTokens: 1400 };
}
function blankPool(name) {
  return { id: uid('pool'), name: name || '', enabled: true, strategy: 'smart', members: [] };
}
function normalizeApi(raw) {
  const a = Object.assign(blankApi(), raw || {});
  a.id = String(a.id || '') || uid('api');
  a.name = String(a.name || '');
  a.format = a.format === 'anthropic' ? 'anthropic' : 'openai';
  a.endpoint = String(a.endpoint || '').trim();
  a.apiKey = String(a.apiKey || '');
  a.model = String(a.model || '').trim();
  a.temperature = Number(a.temperature);
  if (!isFinite(a.temperature)) a.temperature = 0.85;
  a.maxTokens = parseInt(a.maxTokens, 10) || 1400;
  a.enabled = a.enabled !== false;
  delete a.mode;
  return a;
}
function normalizePool(raw) {
  const p = Object.assign(blankPool(), raw || {});
  p.id = String(p.id || '') || uid('pool');
  p.name = String(p.name || '');
  p.members = Array.from(new Set((Array.isArray(p.members) ? p.members : []).map(String).filter(Boolean)));
  p.strategy = 'smart';
  p.enabled = p.enabled !== false;
  return p;
}
/** 旧版实例自带三套完整配置；能转成引用的转引用，其余保留为 legacy 对象。 */
function normalizeStoryLLM(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const out = {};
  for (const k of ['tiandao', 'character', 'memory']) {
    const v = raw[k];
    if (typeof v === 'string' && v) out[k] = v;
    else if (v && typeof v === 'object' && Object.keys(v).length) out[k] = v;
  }
  return Object.keys(out).length ? out : null;
}
function defaultDB() {
  return {
    version: SCHEMA_VERSION,
    config: {
      theme: 'paper', custom: {},
      llmApis: [], llmPools: [],
      llmAssign: { tiandao: '', character: 'tiandao', memory: 'tiandao' }
    },
    ui: { rightTab: 'events', memTab: 'episodic', memChar: 'player', jumpOpen: false, llmTab: 'tiandao' },
    activeId: null,
    cards: [],
    cardsReady: false,
    stories: []
  };
}
/* ---------------- 世界卡库 ----------------
   世界卡（设定模板）与实例（一局进度）彻底分开：
   DB.cards 存可复用的世界卡，DB.stories 只存由卡创建的实例。
   实例的 cardId 指向卡；删除实例不会动卡，删除卡也不会删实例。 */
function stripCardStoryArc(card) {
  if (!card || typeof card !== 'object') return false;
  const q = card.extensions && card.extensions.qiyuan;
  if (!q) return false;
  if (q.story_arc) { q.story_arc = null; return true; }
  return false;
}
function normalizeCardRecord(raw, i) {
  if (!raw || typeof raw !== 'object') return null;
  const rawCard = (raw.card && typeof raw.card === 'object') ? raw.card
    : ((raw.spec === 'qiyuan_world_card' || raw.kind === 'world_card' || raw.world) ? raw : null);
  if (!rawCard) return null;
  const card = JSON.parse(JSON.stringify(rawCard));
  const stripped = stripCardStoryArc(card);
  return {
    id: String(raw.id || ('card_' + (i + 1) + '_' + Math.random().toString(36).slice(2, 6))),
    cardId: String(raw.cardId || card.card_id || ''),
    card,
    source: String(raw.source || 'import'),
    addedAt: Number(raw.addedAt) || nowTs(),
    updatedAt: Number(raw.updatedAt) || Number(raw.addedAt) || nowTs(),
    ...(stripped ? { stripped: true } : {})
  };
}
function normalizeLLM(raw, fallbackMode) {
  const c = Object.assign(blankLLM(), raw || {});
  c.temperature = Number(c.temperature);
  if (!isFinite(c.temperature)) c.temperature = 0.85;
  c.maxTokens = parseInt(c.maxTokens, 10) || 1400;
  c.mode = c.mode === 'tiandao' ? 'tiandao' : 'own';
  if (fallbackMode) c.mode = fallbackMode;
  return c;
}
function normalizeConfig(raw) {
  const c = raw || {};
  let apis = Array.isArray(c.llmApis) ? c.llmApis.map(normalizeApi) : [];
  const pools = Array.isArray(c.llmPools) ? c.llmPools.map(normalizePool) : [];
  let assign = Object.assign({ tiandao: '', character: 'tiandao', memory: 'tiandao' }, c.llmAssign || {});
  // 旧版三套完整配置 → 自动收进 API 池，并把当前引用指过去。
  const old = c.llm;
  if (!apis.length && old && typeof old === 'object') {
    const t0 = old.tiandao || old;
    const t = (t0 && (t0.endpoint || t0.apiKey || t0.model)) ? normalizeLLM(t0) : null;
    if (t) {
      const main = normalizeApi(Object.assign({}, t, { id: uid('api'), name: '默认接口' }));
      apis.push(main);
      assign.tiandao = 'api:' + main.id;
      for (const k of ['character', 'memory']) {
        const l = old[k];
        const own = l && l.mode === 'own' && l.endpoint && l.apiKey;
        const differs = own && (l.endpoint !== t.endpoint || l.apiKey !== t.apiKey || l.model !== t.model);
        if (differs) {
          const a = normalizeApi(Object.assign({}, l, { id: uid('api'), name: (k === 'character' ? '角色' : '记忆') + '接口' }));
          apis.push(a);
          assign[k] = 'api:' + a.id;
        } else {
          assign[k] = 'tiandao';
        }
      }
    }
  }
  const ids = new Set(apis.map(a => a.id));
  const poolIds = new Set(pools.map(p => p.id));
  const valid = ref => {
    if (!ref) return '';
    if (ref === 'tiandao') return 'tiandao';
    const m = /^(api|pool):(.+)$/.exec(String(ref));
    if (!m) return '';
    return (m[1] === 'api' ? ids.has(m[2]) : poolIds.has(m[2])) ? ref : '';
  };
  assign = {
    tiandao: valid(assign.tiandao),
    character: valid(assign.character) || 'tiandao',
    memory: valid(assign.memory) || 'tiandao'
  };
  for (const p of pools) p.members = p.members.filter(id => ids.has(id));
  return { theme: c.theme || 'paper', custom: c.custom || {}, llmApis: apis, llmPools: pools, llmAssign: assign };
}
function normalizeWorld(raw) {
  const w = raw || {};
  let fields = Array.isArray(w.fields) ? w.fields.filter(f => f && f.path).map(f => ({ path: String(f.path), value: String(f.value == null ? '' : f.value) })) : [];
  if (!fields.length && (w.setting || w.rawMarkdown)) fields = [{ path: '世界观', value: String(w.setting || w.rawMarkdown) }];
  return {
    presetId: w.presetId || '', name: w.name || '未命名世界', tag: w.tag || '', category: w.category || '',
    cover: w.cover || '', coverId: w.coverId || '',
    desc: w.desc || w.description || w.setting || '', calendarName: w.calendarName || '',
    startTime: w.startTime || '', rawMarkdown: w.rawMarkdown || '',
    tiandaoPrompt: w.tiandaoPrompt || '', locationSchema: w.locationSchema || '', opening: w.opening || '',
    fields,
    storyArc: normalizeStoryArc(w.storyArc || w.story_arc)
  };
}

/* ---------------- 剧情模式：世界侧规划数据 ---------------- */
function blankStoryArc() {
  return { version: 1, enabled: false, status: 'draft', logline: '', publicLore: [], fieldMeta: {}, includeRaw: false, auditNotes: [], issues: [], stages: [] };
}
/** 阶段条件：统一成 {any:[...]}，既接受数组也接受单对象。 */
function normalizeStageCond(raw) {
  const c = raw || {};
  const out = {};
  if (c.type === 'manual' || c.manual === true) out.manual = true;
  const mins = Number(c.worldMinutes || c.world_minutes || 0);
  if (mins > 0) out.worldMinutes = Math.floor(mins);
  if (c.event) out.event = String(c.event);
  if (c.realm) out.realm = String(c.realm);
  if (c.location) out.location = String(c.location);
  if (c.stageId) out.stageId = String(c.stageId);
  return out;
}
function normalizeStageExit(raw) {
  if (Array.isArray(raw)) return { any: raw.map(normalizeStageCond).filter(c => Object.keys(c).length) };
  const o = raw || {};
  if (Array.isArray(o.any)) return { any: o.any.map(normalizeStageCond).filter(c => Object.keys(c).length) };
  const one = normalizeStageCond(o);
  return { any: Object.keys(one).length ? [one] : [] };
}
function normalizeStageMilestones(raw) {
  return (Array.isArray(raw) ? raw : []).filter(m => m && (m.change || m.text)).map(m => ({
    at: String(m.at || m.when || ''), change: clampText(String(m.change || m.text || ''), 200)
  }));
}
function normalizeCognition(raw) {
  const c = raw || {};
  return {
    realm: String(c.realm || ''),
    social: String(c.social || ''),
    geography: Array.isArray(c.geography) ? c.geography.map(String) : [],
    knownFactions: Array.isArray(c.knownFactions || c.known_factions) ? (c.knownFactions || c.known_factions).map(String) : [],
    forbidden: Array.isArray(c.forbidden) ? c.forbidden.map(String) : [],
    rumors: Array.isArray(c.rumors) ? c.rumors.map(String) : []
  };
}
function hasCognition(c) {
  if (!c) return false;
  return !!(c.realm || c.social || (c.geography && c.geography.length)
    || (c.knownFactions && c.knownFactions.length) || (c.forbidden && c.forbidden.length));
}
function normalizeStoryStage(raw, i) {
  const st = raw || {};
  const deltaRaw = st.settingDelta || st.setting_delta || st.delta || st['阶段设定增量'];
  const eventsRaw = st.worldEvents || st.world_events || st.events || st['世界大事'];
  const growth = st.growth || st.growth_arc || st['成长轨迹'] || {};
  const cog = st.cognition || st.cognitive || st.boundary || st['认知边界'] || {};
  const cast = st.cast || st.cast_tiers || st['出场层级'] || {};
  const revealsRaw = st.reveals || st.reveal || st['可揭示事实'] || [];
  const delta = Array.isArray(deltaRaw) ? deltaRaw : [];
  const events = Array.isArray(eventsRaw) ? eventsRaw : [];
  const reveals = Array.isArray(revealsRaw) ? revealsRaw : [];
  const exitRaw = st.exit || st.exit_condition || st.exitCondition || st['推进条件'];
  return {
    id: st.id || ('st' + (i + 1)),
    order: i + 1,
    name: String(st.name || st.title || st.stage_name || st['阶段名'] || st['名称'] || ('第 ' + (i + 1) + ' 阶段')),
    userBrief: String(st.userBrief || st.user_brief || st['玩家要求'] || ''),
    summary: String(st.summary || st.desc || st.description || st.stage_summary || st['阶段摘要'] || st['摘要'] || ''),
    span: String(st.span || st.when || st.time || st['时间跨度'] || ''),
    exit: normalizeStageExit(exitRaw),
    settingDelta: delta.filter(d => d && d.path).map(d => ({
      path: String(d.path), value: String(d.value == null ? '' : d.value),
      visibility: ['public', 'stage', 'hidden'].includes(d.visibility) ? d.visibility : 'stage'
    })),
    worldEvents: events.filter(e => e && (e.title || e.name || e.desc)).map((e, j) => ({
      id: e.id || ('ev' + (i + 1) + '_' + (j + 1)),
      title: String(e.title || e.name || e['事件名'] || '世界事件'),
      when: String(e.when || e.time || e.span || e['时间'] || ''),
      trigger: String(e.trigger || e.condition || e['触发'] || ''),
      importance: Math.max(1, Math.min(10, parseInt(e.importance, 10) || 6)),
      visibility: ['public', 'stage', 'hidden'].includes(e.visibility) ? e.visibility : 'stage'
    })),
    growth: {
      player: {
        start: String((growth.player && growth.player.start) || growth.playerStart || growth['玩家起点'] || ''),
        milestones: normalizeStageMilestones((growth.player && (growth.player.milestones || growth.player.nodes)) || growth.milestones || growth['玩家节点'])
      },
      npcs: (Array.isArray(growth.npcs || growth['NPC节点']) ? (growth.npcs || growth['NPC节点']) : []).filter(n => n && n.name).map(n => ({
        name: String(n.name), role: String(n.role || ''),
        milestones: normalizeStageMilestones(n.milestones || n.nodes || n['节点'])
      }))
    },
    cognition: normalizeCognition(cog),
    cast: {
      allowedTiers: Array.isArray(cast.allowedTiers || cast.allowed_tiers || cast['可出场层级']) ? (cast.allowedTiers || cast.allowed_tiers || cast['可出场层级']).map(String) : [],
      forbidden: Array.isArray(cast.forbidden || cast['禁止出场']) ? (cast.forbidden || cast['禁止出场']).map(String) : [],
      maxNewNPCs: Math.max(0, parseInt(cast.maxNewNPCs != null ? cast.maxNewNPCs : cast.max_new_npcs, 10) || 0)
    },
    reveals: reveals.filter(r => r && (r.fact || r['事实'])).map((r, j) => ({
      id: r.id || ('rv' + (i + 1) + '_' + (j + 1)),
      fact: String(r.fact || r['事实']),
      via: String(r.via || r.source || r['来源'] || ''),
      event: String(r.event || r['绑定事件'] || ''),
      scope: Array.isArray(r.scope) && r.scope.length ? r.scope.map(String) : ['player'],
      confidence: ['fact', 'rumor', 'false'].includes(r.confidence) ? r.confidence : 'fact'
    })),
    forbiddenTerms: Array.isArray(st.forbiddenTerms || st.forbidden_terms || st['禁忌词']) ? (st.forbiddenTerms || st.forbidden_terms || st['禁忌词']).map(String) : [],
    detailStatus: st.detailStatus === 'detailed' ? 'detailed' : 'skeleton'
  };
}
function normalizeStoryArc(raw) {
  const a = raw || {};
  const meta = {};
  const srcMeta = a.fieldMeta || a.field_meta || {};
  Object.keys(srcMeta).forEach(k => {
    const m = srcMeta[k] || {};
    meta[k] = {
      visibility: ['public', 'stage', 'hidden'].includes(m.visibility) ? m.visibility : 'public',
      revealAt: String(m.revealAt || m.reveal_at || '')
    };
  });
  const stages = (Array.isArray(a.stages) ? a.stages : []).filter(st => st && (st.name || st.summary))
    .slice(0, 12).map(normalizeStoryStage);
  return {
    version: Number(a.version) || 1,
    enabled: !!a.enabled && stages.length > 0,
    status: stages.length ? (a.status === 'ready' ? 'ready' : 'draft') : 'draft',
    logline: String(a.logline || ''),
    userBrief: String(a.userBrief || a.user_brief || a['玩家要求'] || ''),
    publicLore: Array.isArray(a.publicLore || a.public_lore) ? (a.publicLore || a.public_lore).map(String) : [],
    fieldMeta: meta,
    includeRaw: a.includeRaw === true,
    auditNotes: Array.isArray(a.auditNotes || a.audit_notes) ? (a.auditNotes || a.audit_notes).map(String).slice(0, 20) : [],
    issues: Array.isArray(a.issues) ? a.issues.filter(x => x && (x.problem || x.stage)).slice(0, 20).map(x => ({
      stage: String(x.stage || ''), problem: String(x.problem || ''), fix: String(x.fix || '')
    })) : [],
    stages
  };
}

/* ---------------- 剧情模式：实例侧运行状态 ---------------- */
function normalizeDisclosureFact(raw) {
  const f = raw || {};
  return {
    id: f.id || uid('fact'),
    text: String(f.text || f.fact || ''),
    source: String(f.source || ''),
    stageId: String(f.stageId || ''),
    learnedAt: String(f.learnedAt || ''),
    scope: Array.isArray(f.scope) && f.scope.length ? f.scope.map(String) : ['player'],
    confidence: ['fact', 'rumor', 'false'].includes(f.confidence) ? f.confidence : 'fact',
    ts: f.ts || nowTs()
  };
}
function normalizeStoryState(raw, world) {
  const r = raw || {};
  const arc = (world && world.storyArc) || blankStoryArc();
  const ids = arc.stages.map(s => s.id);
  const factsRaw = Array.isArray(r.disclosure && r.disclosure.facts) ? r.disclosure.facts
    : (Array.isArray(r.facts) ? r.facts : []);
  const facts = factsRaw.filter(f => f && (f.text || f.fact)).map(normalizeDisclosureFact);
  let stageId = String(r.stageId || '');
  if (!stageId || (ids.length && !ids.includes(stageId))) stageId = ids[0] || '';
  return {
    enabled: !!r.enabled && arc.stages.length > 0,
    arcVersion: Number(r.arcVersion) || arc.version || 1,
    stageId,
    pendingStageId: ids.includes(String(r.pendingStageId || '')) ? String(r.pendingStageId) : '',
    autoAdvance: r.autoAdvance !== false,
    autoDisclose: r.autoDisclose !== false,
    stageEnteredAt: String(r.stageEnteredAt || ''),
    stageHistory: (Array.isArray(r.stageHistory) ? r.stageHistory : []).filter(x => x && x.stageId).map(x => ({
      stageId: String(x.stageId), from: String(x.from || ''), to: String(x.to || '')
    })),
    disclosure: { facts: facts.slice(-400) },
    planStatus: r.planStatus === 'stale' ? 'stale' : 'ok',
    advanceOfferedStage: String(r.advanceOfferedStage || ''),
    replanOfferedStage: String(r.replanOfferedStage || '')
  };
}
/** 从记忆里找某个角色最早出现的地点，作为旧存档缺失基线时的兜底。 */
function seedLocationFromMemory(memories, charId) {
  const list = (memories || []).filter(m => m && m.charId === charId && m.location)
    .sort((a, b) => (Number(a.ts) || 0) - (Number(b.ts) || 0));
  return list.length ? list[0].location : '';
}
/**
 * 实例基线：重置时把玩家 / NPC 放回这里。
 * 新建实例、旧存档、导入存档都必须有基线，否则重置等于什么都不做。
 */
function makeStorySeed(world, p, npcs, memories, saved) {
  const preset = PRESETS.find(pp => pp.id === (world && world.presetId));
  const src = saved && typeof saved === 'object' ? JSON.parse(JSON.stringify(saved)) : {};
  const seed = {
    playerLocation: src.playerLocation || (preset && preset.startLocation)
      || seedLocationFromMemory(memories, 'player') || (p && p.currentLocation) || '',
    npcLocations: Object.assign({}, src.npcLocations || {}),
    chars: Object.assign({}, src.chars || {})
  };
  for (const n of npcs || []) {
    if (!seed.npcLocations[n.id]) {
      const pn = preset && (preset.npcs || []).find(x => x.name === n.name);
      seed.npcLocations[n.id] = (pn && pn.currentLocation)
        || seedLocationFromMemory(memories, n.id) || n.currentLocation || '';
    }
    if (!seed.chars[n.id]) seed.chars[n.id] = { emotion: '平静', health: '良好' };
  }
  if (!seed.chars.player) seed.chars.player = { emotion: '平静', health: '良好' };
  return seed;
}
function normalizeStory(raw) {
  const r = raw || {};
  const world = normalizeWorld(r.world);
  const p = Object.assign(blankCharacter(r.character && r.character.name), r.player || r.character || {});
  if (!p.occupation && r.character && r.character.identity) p.occupation = r.character.identity;
  if (!p.currentGoal && r.character && r.character.goal) p.currentGoal = r.character.goal;
  if (!p.personality && r.character) p.personality = r.character.personality || '';
  // 永久 NPC 只能由玩家手动创建：旧版本自动登记的临时角色在载入时清除。
  const npcs = Array.isArray(r.npcs) ? r.npcs.filter(n => !(n && n.auto)).map(n => {
    const c = Object.assign(blankCharacter(), n || {});
    c.id = n && n.id ? n.id : uid('npc');
    c.evolutionVersion = (n && n.evolutionVersion) || 1;
    c.lastEvolutionAt = (n && n.lastEvolutionAt) || '';
    c.cognition = hasCognition(n && n.cognition) ? normalizeCognition(n.cognition) : null;
    return c;
  }) : [];
  const startTime = world.startTime || '第一日 清晨';
  const inst = Object.assign({ timeStatus: 'running', timeSpeed: 1, currentTime: startTime, startTime, lastActiveTime: startTime, lastTick: nowTs(), _pendingAuto: 0 }, r.instance || {});
  inst.timeSpeed = Number(inst.timeSpeed) || 1;
  // 只有「时辰 / 仅日期」这类低粒度历法才需要进位余量；
  // 分钟级历法（含旧版本时间冻结时攒下的余量）一律清零，避免升级后一次性跳掉一大段时间。
  {
    const tp = parseWorldTime(inst.currentTime || inst.startTime);
    const cap = tp && tp.style === 'shichen' ? 119 : (tp && tp.style === 'dateonly' ? 1439 : 0);
    inst._timeCarry = Math.min(cap, Math.max(0, Number(inst._timeCarry) || 0));
  }
  if (!['running', 'paused', 'stopped'].includes(inst.timeStatus)) inst.timeStatus = 'running';
  if (!inst.startTime) inst.startTime = startTime;
  if (!inst.currentTime) inst.currentTime = inst.startTime;
  if (!inst.lastActiveTime) inst.lastActiveTime = inst.currentTime;
  if (!inst.lastTick) inst.lastTick = nowTs();

  let memories = [];
  if (Array.isArray(r.memories)) memories = r.memories.map(m => normalizeMemory(m));
  else if (Array.isArray(r.memory)) {
    memories = r.memory.filter(x => typeof x === 'string' && x.trim()).map((x, i) => normalizeMemory({
      charId: 'player', type: 'episodic', time: inst.currentTime, location: p.currentLocation || '',
      event: x, importance: 4, ts: nowTs() - i * 1000
    }));
  }
  const messages = (Array.isArray(r.messages) ? r.messages.map((m, i) => ({
    id: m.id || uid('m'), role: m.role === 'user' ? 'user' : (m.role === 'npc' ? 'npc' : (m.role === 'system' ? 'system' : 'assistant')),
    text: stripMetaBlocks(String(m.text || '')), ts: m.ts || nowTs() - (r.messages.length - i) * 1000,
    time: m.time || inst.currentTime, kind: m.kind || (m.role === 'user' ? 'action' : 'narrative'),
    speaker: m.speaker || '', roundId: m.roundId || '', pending: false
  })) : []).filter(m => m.role === 'user' || String(m.text || '').trim());

  initCharacterAge(inst, p);
  npcs.forEach(n => initCharacterAge(inst, n));
  return {
    id: r.id || uid('story'),
    cardId: String(r.cardId || ''),
    instanceName: r.instanceName || world.name,
    world, player: p, npcs,
    instance: inst,
    messages,
    working: { l1: Array.isArray(r.working && r.working.l1) ? r.working.l1.slice(-30) : [] },
    memories,
    bookmarks: Array.isArray(r.bookmarks) ? r.bookmarks.map(b => Object.assign({ id: uid('bm'), charId: 'player', type: 'concept', question: '', answer: '', ts: nowTs() }, b)) : [],
    events: Array.isArray(r.events) ? r.events.map(e => Object.assign({ id: uid('ev'), time: inst.currentTime, category: '格局', title: '', desc: '', importance: 7, location: '', people: [], state: '', roundId: '', ts: nowTs() }, e)) : [],
    evolutions: Array.isArray(r.evolutions) ? r.evolutions : [],
    llm: normalizeStoryLLM(r.llm),
    seed: makeStorySeed(world, p, npcs, memories, r.seed),
    story: normalizeStoryState(r.story, world),
    bg: Object.assign({ preset: 'theme', src: '', opacity: .7, blur: 0 }, r.bg || {}),
    createdAt: r.createdAt || nowTs(),
    updatedAt: r.updatedAt || nowTs()
  };
}
function normalizeMemory(m) {
  return {
    id: (m && m.id) || uid('mem'),
    charId: (m && m.charId) || 'player',
    type: (m && m.type) === 'semantic' ? 'semantic' : 'episodic',
    time: (m && m.time) || '',
    timeRange: (m && m.timeRange) || null,
    location: (m && m.location) || '',
    people: Array.isArray(m && m.people) ? m.people : [],
    event: String((m && m.event) || ''),
    importance: Math.max(1, Math.min(10, parseInt(m && m.importance, 10) || 5)),
    roundId: (m && m.roundId) || '',
    stageId: (m && m.stageId) || '',
    hits: (m && m.hits) || 0,
    ts: (m && m.ts) || nowTs()
  };
}
function loadDB() {
  let raw = null;
  try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { }
  if (!raw) { try { raw = localStorage.getItem(LEGACY_KEY); } catch (e) { } }
  if (!raw) return defaultDB();
  let obj = null;
  try { obj = JSON.parse(raw); } catch (e) { return defaultDB(); }
  if (!obj || typeof obj !== 'object') return defaultDB();
  const db = defaultDB();
  db.version = SCHEMA_VERSION;
  db.config = normalizeConfig(obj.config);
  db.ui = Object.assign(db.ui, obj.ui || {});
  db.cards = Array.isArray(obj.cards) ? obj.cards.map(normalizeCardRecord).filter(Boolean) : [];
  db.cardsReady = obj.cardsReady === true;
  db.stories = Array.isArray(obj.stories) ? obj.stories.map(normalizeStory) : [];
  db.activeId = obj.activeId && db.stories.some(s => s.id === obj.activeId) ? obj.activeId : (db.stories[0] ? db.stories[0].id : null);
  return db;
}
let DB = loadDB();
let SAVE_T = null;
function saveDB() {
  clearTimeout(SAVE_T);
  SAVE_T = setTimeout(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(DB)); }
    catch (e) { toast('存档写入失败：' + e.message, false); }
  }, 90);
}
function saveNow() {
  clearTimeout(SAVE_T);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(DB)); return true; }
  catch (e) { toast('存档写入失败：' + e.message, false); return false; }
}
function activeStory() { return DB.stories.find(s => s.id === DB.activeId) || null; }
function storyById(id) { return DB.stories.find(s => s.id === id) || null; }

/* ---------------- 剧情模式：通用查询 ---------------- */
function storyArcOf(s) {
  const arc = s && s.world && s.world.storyArc;
  return arc && Array.isArray(arc.stages) ? arc : null;
}
function storyModeOn(s) {
  return !!(s && s.story && s.story.enabled && storyArcOf(s) && s.world.storyArc.stages.length);
}
function stageById(s, id) {
  const arc = storyArcOf(s);
  if (!arc) return null;
  return arc.stages.find(st => st.id === id) || null;
}
function currentStage(s) {
  if (!storyModeOn(s)) return null;
  return stageById(s, s.story.stageId) || s.world.storyArc.stages[0] || null;
}
function nextStage(s) {
  const cur = currentStage(s);
  const arc = storyArcOf(s);
  if (!cur || !arc) return null;
  return arc.stages.find(st => st.order === cur.order + 1) || null;
}
function stageOrderOf(s, id) {
  const st = stageById(s, id);
  return st ? st.order : Infinity;
}
function storyStageLabel(s) {
  const st = currentStage(s);
  return st ? `第${st.order}阶段 · ${st.name}` : '未开启';
}

/* ---------------- 基础工具 ---------------- */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function toast(text, ok = true) {
  const t = $('#toast'); if (!t) return;
  t.innerHTML = `${ok ? '<svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>'}<span>${esc(text)}</span>`;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}
function fmtTs(ts) {
  const d = new Date(ts || 0), p = n => String(n).padStart(2, '0');
  return `${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
function storyInitial(story) { return (story && story.world && story.world.name || '世')[0]; }
function paragraphs(text) {
  return stripMetaBlocks(String(text || '')).split(/\n{2,}/).map(p => {
    let h = esc(p).replace(/\n/g, '<br>');
    h = h.replace(/（([^）]*)）/g, '<em>（$1）</em>');
    h = h.replace(/「([^」]*)」/g, '<span class="q">「$1」</span>');
    h = h.replace(/“([^”]*)”/g, '<span class="q">“$1”</span>');
    return `<p>${h}</p>`;
  }).join('');
}
function clampText(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n) + '…' : s; }
function pickRandom(arr, n) {
  const a = arr.slice();
  const out = [];
  while (a.length && out.length < n) out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
  return out;
}

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
        <div class="about-ver">v${esc(updateVersionName())}</div>
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
        <div class="group">软件更新</div>
        <div class="rowcard">
          <button class="rrow" id="aboutUpdate"><span class="rt">检查更新</span><span class="rv">v${esc(updateVersionName())}</span><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
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
  const updateRow = $('#aboutUpdate');
  if (updateRow) updateRow.onclick = () => { pageUpdate(); };
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
  const active = s ? currentStage(s) : null;
  const future = !active || st.order > active.order;
  return `<div class="stage-card ${cur ? 'cur' : ''}">
    <div class="stage-card-h"><span class="stage-badge">第 ${st.order} 阶段</span><b>${esc(st.name)}</b>
      <span class="stage-state">${st.detailStatus === 'detailed' ? '已细化' : '骨架'}</span></div>
    <p>${esc(clampText(st.summary || '（暂无摘要）', 260))}</p>
    ${st.userBrief ? `<div class="stage-meta">玩家要求：${esc(clampText(st.userBrief, 120))}</div>` : ''}
    ${st.span ? `<div class="stage-meta">时间跨度：${esc(st.span)}</div>` : ''}
    <div class="stage-meta">推进条件：${esc(stageExitLabel(st))}</div>
    <div class="stage-cog">${stageCognitionSummary(st)}</div>
    ${(st.forbiddenTerms || []).length ? `<div class="stage-terms">禁忌词：${st.forbiddenTerms.map(esc).join('、')}</div>` : ''}
    ${opt && opt.editable ? `<div class="stage-tools">
      <button class="mini" data-stage-edit="${st.id}">编辑</button>
      ${st.detailStatus !== 'detailed' ? `<button class="mini" data-stage-detail="${st.id}">细化</button>` : ''}
      ${future ? `<button class="mini" data-stage-gen="${st.id}">重生成</button>` : ''}
      <button class="mini" data-stage-up="${st.id}" title="上移">↑</button>
      <button class="mini" data-stage-down="${st.id}" title="下移">↓</button>
      ${future ? `<button class="mini danger" data-stage-del="${st.id}">删除</button>` : ''}
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
  const target = arc.stages.find(st => st.id === id);
  const cur = currentStage(s);
  if (target && cur && target.order <= cur.order) { toast('已进入的阶段不能删除', false); return false; }
  arc.stages = arc.stages.filter(st => st.id !== id);
  arc.stages.forEach((st, k) => { st.order = k + 1; });
  s.world.storyArc = arc;
  if (s.story.stageId === id) s.story.stageId = arc.stages[0].id;
  if (s.story.pendingStageId === id) s.story.pendingStageId = '';
  if (s.story.advanceOfferedStage === id) s.story.advanceOfferedStage = '';
  if (s.story.replanOfferedStage === id) s.story.replanOfferedStage = '';
  saveDB();
  return true;
}
function storyPlanBody(s) {
  const arc = storyArcOf(s);
  const busy = STORY_PLAN_STATE.busy;
  const has = arc && arc.stages.length;
  const req = STORY_PLAN_STATE.requirement != null ? STORY_PLAN_STATE.requirement : ((arc && arc.userBrief) || '');
  const head = `<div class="wizard-hero"><div class="wiz-brand">启源 · 剧情模式</div>
    <h2>${has ? '阶段骨架已生成' : '先让天道读懂这个世界'}</h2></div>`;
  let body = head;
  if (busy || STORY_PLAN_STATE.msg) body += `<div class="stage-plan-msg" id="planMsg">${esc(STORY_PLAN_STATE.msg || '正在处理…')}</div>`;
  body += `<div class="field"><label>剧情要求（可选）</label><textarea class="input" id="planReq" rows="3" placeholder="例如：想更悬疑、节奏慢一点；第一阶段留在客栈，不要过早揭露身世。">${esc(req)}</textarea></div>`;
  if (!has) {
    body += `<button class="pbtn grad wide" id="planGo" ${busy ? 'disabled' : ''}>${busy ? '生成中…' : '生成剧情骨架'}</button>
      <button class="pbtn ghost wide" id="planSingle" style="margin-top:10px" ${busy ? 'disabled' : ''}>只生成一个阶段</button>
      <button class="pbtn ghost wide" id="planFree" style="margin-top:10px">跳过，改用自由模式</button>`;
    return body;
  }
  body += `<div class="group">阶段列表</div><div class="stage-plan-list">${arc.stages.map(st => stagePlanCard(st, s, { editable: true })).join('')}</div>
    <div class="stage-actions"><button class="pbtn ghost" id="planSingle" ${busy ? 'disabled' : ''}>＋ 单独生成阶段</button><button class="pbtn ghost" id="planAddStage">＋ 新增空白阶段</button><button class="pbtn ghost" id="planVisibility">世界可见性</button></div>`;
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
  STORY_PLAN_STATE = { busy: false, msg: '', issues: (s.story && s.story._checkIssues) || [], requirement: ((s.world.storyArc && s.world.storyArc.userBrief) || '') };
  const page = pushPage({ title: '剧情规划', body: storyPlanBody(s), action: '' }).page;
  $('.pact', page).style.display = 'none';
  const body = $('.pbody', page);
  const draw = () => { body.innerHTML = storyPlanBody(s); };
  const startPlan = async () => {
    if (STORY_PLAN_STATE.busy) return;
    const reqEl = $('#planReq', page);
    const requirement = (reqEl ? reqEl.value : (STORY_PLAN_STATE.requirement || '')).trim();
    STORY_PLAN_STATE = { busy: true, msg: '正在审计世界设定…', issues: [], requirement };
    draw();
    try {
      await planStoryArc(s, {
        requirement,
        onProgress: msg => { STORY_PLAN_STATE.msg = msg; draw(); }
      });
      STORY_PLAN_STATE = { busy: false, msg: '阶段骨架已生成，请确认或修改。', issues: (s.world.storyArc && s.world.storyArc.issues) || [], requirement };
      saveDB(); draw();
      toast('剧情骨架已生成');
    } catch (e) {
      STORY_PLAN_STATE = { busy: false, msg: '生成失败：' + e.message, issues: [], requirement };
      draw();
      toast('生成失败：' + e.message, false);
    }
  };
  page.addEventListener('input', e => {
    if (e.target && e.target.id === 'planReq') STORY_PLAN_STATE.requirement = e.target.value;
  });
  page.addEventListener('click', async e => {
    if (e.target.closest('#planGo') || e.target.closest('#planRegen')) { startPlan(); return; }
    if (e.target.closest('#planSingle')) {
      const reqEl = $('#planReq', page);
      pageStageGenerate(s, {
        requirement: (reqEl ? reqEl.value : '').trim(),
        replaceFuture: !!currentStage(s),
        refresh: draw
      });
      return;
    }
    const gen = e.target.closest('[data-stage-gen]');
    if (gen) {
      pageStageGenerate(s, { stageId: gen.dataset.stageGen, refresh: draw });
      return;
    }
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
    <div class="stage-actions"><button class="pbtn ghost" id="storySingle">＋ 单独生成阶段</button><button class="pbtn ghost" id="storyAddStage">＋ 新增空白阶段</button><button class="pbtn ghost" id="storyVisibility">世界可见性</button></div>
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
/* 生成单个阶段：可替换指定阶段，或替换当前之后的所有未进入阶段 */
function pageStageGenerate(s, opt) {
  const o = opt || {};
  const arc0 = storyArcOf(s) || normalizeStoryArc(s.world.storyArc || {});
  const active = currentStage(s);
  const target = o.stageId ? arc0.stages.find(st => st.id === o.stageId) : null;
  const canReplaceFuture = !target && !!active;
  let mode = target ? 'replace' : (canReplaceFuture ? 'replaceFuture' : 'append');
  let busy = false;
  const { page, close } = pushPage({
    title: target ? '重新生成阶段' : '生成单个阶段',
    action: '生成', actionClass: 'grad',
    onAction: () => run()
  });
  const priorCount = target ? target.order - 1 : (active ? active.order : arc0.stages.length);
  const draw = () => {
    $('.pbody', page).innerHTML = `
      ${target ? `<div class="card-mode-note">将替换：第 ${target.order} 阶段「${esc(target.name)}」。此前 ${priorCount} 个阶段会作为生成依据。</div>` : ''}
      ${canReplaceFuture ? `<div class="group">生成范围</div>
        <div class="seg" id="genMode">
          <button data-mode="replaceFuture" class="${mode === 'replaceFuture' ? 'on' : ''}">替换未进入阶段</button>
          <button data-mode="append" class="${mode === 'append' ? 'on' : ''}">追加到末尾</button>
        </div>
        <div class="card-mode-note">替换会删除当前阶段之后所有尚未进入的阶段，再生成一个新阶段。</div>` : ''}
      <div class="field"><label>阶段名提示（可选）</label><input class="input" id="genName" value="${esc(o.nameHint || (target ? target.name : ''))}" placeholder="不填则由模型命名"></div>
      <div class="field"><label>对这个阶段的要求</label><textarea class="input" id="genReq" rows="5" placeholder="例如：这一阶段留在临江镇，重点写掌柜的试探；不要出现河神，不要揭露主角身世。">${esc(o.requirement || (target ? target.userBrief : '') || '')}</textarea></div>
      <div class="stage-plan-msg" id="genMsg" hidden></div>`;
    const seg = $('#genMode', page);
    if (seg) seg.addEventListener('click', e => {
      const b = e.target.closest('button[data-mode]'); if (!b) return;
      mode = b.dataset.mode;
      $$('button', seg).forEach(x => x.classList.toggle('on', x.dataset.mode === mode));
    });
  };
  draw();
  const run = async () => {
    if (busy) return;
    const req = (($('#genReq', page) || {}).value || '').trim();
    const nameHint = (($('#genName', page) || {}).value || '').trim();
    busy = true;
    const msg = $('#genMsg', page);
    if (msg) { msg.hidden = false; msg.textContent = '正在生成阶段…'; }
    try {
      const generated = await planSingleStage(s, {
        stageId: target ? target.id : '',
        requirement: req,
        nameHint,
        afterOrder: target ? (target.order - 1) : (mode === 'replaceFuture' && active ? active.order : arc0.stages.length)
      });
      if (mode === 'replaceFuture' && active) {
        const arc2 = storyArcOf(s);
        if (arc2) {
          arc2.stages = arc2.stages.filter(st => st.id === generated.id || st.order <= active.order);
          arc2.stages = uniqueStageIds(arc2.stages);
          s.world.storyArc = arc2;
          saveDB();
        }
      }
      busy = false;
      saveDB();
      toast('阶段已生成');
      close();
      if (o.refresh) o.refresh();
      renderAll();
    } catch (e) {
      busy = false;
      if (msg) { msg.hidden = false; msg.textContent = '生成失败：' + e.message; }
      toast('生成失败：' + e.message, false);
    }
  };
  return { page, close };
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
    if (e.target.closest('#storySingle')) { pageStageGenerate(s, { replaceFuture: true, refresh: draw }); return; }
    if (e.target.closest('#storyAddStage')) { addBlankStage(s); draw(); return; }
    const gen = e.target.closest('[data-stage-gen]');
    if (gen) { pageStageGenerate(s, { stageId: gen.dataset.stageGen, refresh: draw }); return; }
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
    if (!s) {
      // 空状态右抽屉只有创建世界等全局动作，不能因为没有实例就吞掉点击。
      const a0 = e.target.closest('[data-act]');
      if (a0) handleAct(a0.dataset.act, a0);
      return;
    }
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
  if (act === 'importCard') { pageImportCard(); return true; }
  if (act === 'about') { pageAbout(); return true; }
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
/* ============================================================
   软件更新：GitHub Releases 检查 · 下载 · 签名校验后安装
   ============================================================ */
const UPDATE_OWNER = 'Robin-Rabbit';
const UPDATE_REPO = 'qiyuan';
const UPDATE_API = `https://api.github.com/repos/${UPDATE_OWNER}/${UPDATE_REPO}/releases/latest`;
const UPDATE_RELEASES = `https://github.com/${UPDATE_OWNER}/${UPDATE_REPO}/releases`;
const UPDATE_CHECK_KEY = 'qiyuan_update_last_check';
const UPDATE_SKIP_KEY = 'qiyuan_update_skip';

const UPDATE_HTTP = {};
const UPDATE_TASKS = {};

function updateNative() {
  return (typeof AndroidUpdate !== 'undefined' && AndroidUpdate) ? AndroidUpdate : null;
}

function updateInfo() {
  try {
    const n = updateNative();
    if (n && n.info) return JSON.parse(n.info());
  } catch (e) { }
  return { versionName: APP_VERSION, versionCode: 0, canInstall: false };
}

function updateVersionName() {
  const info = updateInfo();
  return info.versionName || APP_VERSION;
}

/** 解析 v0.1.4 / 0.1.4-beta.1 这类版本号。 */
function parseVersion(v) {
  const s = String(v == null ? '' : v).trim().replace(/^v/i, '').split(/[+\s]/)[0];
  const m = s.match(/^(\d+(?:\.\d+)*)(?:-([0-9A-Za-z.-]+))?$/);
  if (!m) return null;
  return { parts: m[1].split('.').map(n => Number(n) || 0), pre: m[2] || '' };
}

function compareVersions(a, b) {
  const x = parseVersion(a), y = parseVersion(b);
  if (!x && !y) return 0;
  if (!x) return -1;
  if (!y) return 1;
  const len = Math.max(x.parts.length, y.parts.length);
  for (let i = 0; i < len; i++) {
    const d = (x.parts[i] || 0) - (y.parts[i] || 0);
    if (d) return d > 0 ? 1 : -1;
  }
  if (x.pre && !y.pre) return -1;
  if (!x.pre && y.pre) return 1;
  if (x.pre === y.pre) return 0;
  return x.pre > y.pre ? 1 : -1;
}

/** 优先选择与 tag 同名的 APK，其次任何 APK。 */
function pickUpdateAsset(release) {
  const assets = (release && release.assets) || [];
  const apks = assets.filter(a => a && /\.apk$/i.test(a.name || ''));
  if (!apks.length) return null;
  const tag = String((release && release.tag_name) || '').replace(/^v/i, '').toLowerCase();
  const score = a => {
    const n = String(a.name || '').toLowerCase();
    let s = 0;
    if (tag && n.includes(tag)) s += 4;
    if (n.includes('qiyuan')) s += 2;
    if (n.includes('universal')) s += 1;
    return s;
  };
  apks.sort((a, b) => score(b) - score(a) || (b.size || 0) - (a.size || 0));
  return apks[0];
}

function updateHttpGet(url) {
  const n = updateNative();
  if (n && n.get) {
    return new Promise((resolve, reject) => {
      const id = 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const timer = setTimeout(() => {
        delete UPDATE_HTTP[id];
        reject(new Error('检查超时'));
      }, 55000);
      UPDATE_HTTP[id] = {
        resolve: v => { clearTimeout(timer); resolve(v); },
        reject: e => { clearTimeout(timer); reject(new Error(e)); }
      };
      try { n.get(id, url); } catch (e) { clearTimeout(timer); delete UPDATE_HTTP[id]; reject(e); }
    });
  }
  return fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
    cache: 'no-store'
  }).then(r => {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.text();
  });
}

window.__updateHttpResult = function (id, body, err) {
  const t = UPDATE_HTTP[id];
  if (!t) return;
  delete UPDATE_HTTP[id];
  if (err) t.reject(err);
  else t.resolve(body);
};

async function checkForUpdate() {
  const current = updateVersionName();
  const raw = await updateHttpGet(UPDATE_API);
  let data;
  try { data = JSON.parse(raw); } catch (e) { throw new Error('更新信息格式异常'); }
  if (!data || (!data.tag_name && !data.name)) throw new Error('没有可用的发布版本');
  const latest = String(data.tag_name || data.name).replace(/^v/i, '');
  if (!parseVersion(latest)) throw new Error('无法识别版本号');
  const asset = pickUpdateAsset(data);
  const info = {
    current,
    latest,
    newer: compareVersions(latest, current) > 0,
    url: asset ? String(asset.browser_download_url || '') : '',
    size: asset ? Number(asset.size || 0) : 0,
    notes: String(data.body || ''),
    page: String(data.html_url || UPDATE_RELEASES),
    publishedAt: String(data.published_at || '')
  };
  try { localStorage.setItem(UPDATE_CHECK_KEY, String(Date.now())); } catch (e) { }
  return info;
}

function updateDownload(info, onProgress) {
  const n = updateNative();
  if (!n || !n.download) return Promise.reject(new Error('当前版本不支持应用内下载'));
  if (!info || !info.url) return Promise.reject(new Error('该版本没有提供 APK'));
  const name = decodeURIComponent((info.url.split('/').pop() || 'qiyuan-update.apk').split('?')[0]);
  return new Promise((resolve, reject) => {
    const id = 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const timer = setTimeout(() => {
      delete UPDATE_TASKS[id];
      reject(new Error('下载超时'));
    }, 10 * 60 * 1000);
    UPDATE_TASKS[id] = {
      onProgress,
      resolve: p => { clearTimeout(timer); resolve(p); },
      reject: e => { clearTimeout(timer); reject(new Error(e)); }
    };
    try { n.download(id, info.url, name); } catch (e) { clearTimeout(timer); delete UPDATE_TASKS[id]; reject(e); }
  });
}

window.__updateProgress = function (id, loaded, total) {
  const t = UPDATE_TASKS[id];
  if (t && t.onProgress) t.onProgress(Number(loaded) || 0, Number(total) || 0);
};

window.__updateDone = function (id, path, err) {
  const t = UPDATE_TASKS[id];
  if (!t) return;
  delete UPDATE_TASKS[id];
  if (err) t.reject(err);
  else t.resolve(path);
};

function installUpdate(path) {
  const n = updateNative();
  if (!n || !n.install) { toast('当前版本不支持应用内安装', false); return; }
  let r = '';
  try { r = n.install(path); } catch (e) { r = 'err:' + e.message; }
  if (r === 'ok') {
    toast('已打开系统安装界面');
  } else if (r === 'permission') {
    openDialog({
      title: '需要允许「启源」安装应用。请打开安装未知应用权限，返回后再点一次安装。',
      cancel: '稍后', ok: '去设置',
      onOk: () => { try { n.openUnknownSources(); } catch (e) { } }
    });
  } else {
    toast('安装失败：' + String(r || '').replace(/^err:/, ''), false);
  }
}

function openUpdatePage(url) {
  const n = updateNative();
  if (n && n.openUrl) { try { n.openUrl(url); return; } catch (e) { } }
  try { window.open(url, '_blank'); } catch (e) { location.href = url; }
}

function updateSizeText(n) {
  const x = Number(n) || 0;
  if (!x) return '';
  return x >= 1048576 ? (x / 1048576).toFixed(1) + ' MB' : Math.round(x / 1024) + ' KB';
}

function pageUpdate(initial) {
  let info = initial || null;
  let busy = !initial;
  let downloading = false;
  let apkPath = '';
  let error = '';
  let note = '';
  let progress = { loaded: 0, total: 0 };
  const { page } = pushPage({ title: '软件更新', action: '', body: '' });
  const body = $('.pbody', page);

  const draw = () => {
    const cur = updateVersionName();
    const pct = progress.total > 0
      ? Math.min(100, Math.round(progress.loaded * 100 / progress.total))
      : (progress.loaded ? 1 : 0);
    let main = '';
    if (busy) {
      main = `<div class="stage-plan-msg">正在检查更新…</div>`;
    } else if (error) {
      main = `<div class="stage-plan-msg">检查失败：${esc(error)}</div>
        <div class="update-actions">
          <button class="pbtn grad" id="upCheck">重试</button>
          <button class="pbtn ghost" id="upPage">在浏览器打开 Releases</button>
        </div>`;
    } else if (info && info.newer) {
      const notes = String(info.notes || '').trim();
      main = `<div class="update-card">
          <div class="update-ver"><span>当前版本</span><b>v${esc(cur)}</b></div>
          <div class="update-ver"><span>最新版本</span><b class="ok-text">v${esc(info.latest)}</b></div>
          ${updateSizeText(info.size) ? `<div class="update-ver"><span>安装包大小</span><b>${esc(updateSizeText(info.size))}</b></div>` : ''}
        </div>
        ${notes ? `<div class="group">更新说明</div><div class="update-notes">${esc(notes.slice(0, 4000)).replace(/\n/g, '<br>')}</div>` : ''}
        ${downloading ? `<div class="update-card">
          <div class="update-ver"><span>正在下载</span><b id="upPct">${pct}%</b></div>
          <div class="update-bar"><i id="upBarFill" style="width:${pct}%"></i></div>
        </div>` : ''}
        ${note ? `<div class="stage-plan-msg">${esc(note)}</div>` : ''}
        <div class="update-actions">
          ${apkPath
            ? `<button class="pbtn grad" id="upInstall">安装 v${esc(info.latest)}</button>`
            : `<button class="pbtn grad" id="upDownload" ${downloading || !info.url ? 'disabled' : ''}>${downloading ? '下载中…' : (info.url ? '下载并安装' : '该版本未提供 APK')}</button>`}
          <button class="pbtn ghost" id="upPage">在浏览器打开</button>
          <button class="pbtn ghost" id="upSkip">跳过此版本</button>
        </div>`;
    } else if (info) {
      main = `<div class="update-card">
          <div class="update-ver"><span>当前版本</span><b>v${esc(cur)}</b></div>
          <div class="update-ver"><span>最新版本</span><b class="ok-text">v${esc(info.latest)}</b></div>
        </div>
        <div class="stage-plan-msg">已是最新版本。</div>
        <div class="update-actions">
          <button class="pbtn ghost" id="upCheck">重新检查</button>
          <button class="pbtn ghost" id="upPage">在浏览器打开 Releases</button>
        </div>`;
    }
    body.innerHTML = `
      <div class="update-hero">
        <img src="logo.png" alt="">
        <div><b>启源</b><span>当前版本 v${esc(cur)}</span></div>
      </div>
      ${main}`;
  };

  const runCheck = async () => {
    if (busy || downloading) return;
    busy = true; error = ''; note = ''; draw();
    try {
      info = await checkForUpdate();
      busy = false; draw();
    } catch (e) {
      busy = false; error = e.message || '网络不可用'; draw();
    }
  };

  const startDownload = async () => {
    if (downloading || !info || !info.url) return;
    downloading = true; note = ''; error = ''; apkPath = '';
    progress = { loaded: 0, total: info.size || 0 };
    draw();
    try {
      apkPath = await updateDownload(info, (loaded, total) => {
        progress = { loaded, total: total || info.size || 0 };
        const pct = progress.total > 0
          ? Math.min(100, Math.round(loaded * 100 / progress.total)) : 1;
        const bar = $('#upBarFill', body), pctEl = $('#upPct', body);
        if (bar) bar.style.width = pct + '%';
        if (pctEl) pctEl.textContent = pct + '%';
      });
      downloading = false; note = '下载完成，已校验签名。'; draw();
      toast('下载完成，可以安装');
    } catch (e) {
      downloading = false; note = '下载失败：' + (e.message || '未知错误'); draw();
      toast('下载失败', false);
    }
  };

  body.addEventListener('click', e => {
    if (e.target.closest('#upCheck')) { runCheck(); return; }
    if (e.target.closest('#upDownload')) { startDownload(); return; }
    if (e.target.closest('#upInstall')) { installUpdate(apkPath); return; }
    if (e.target.closest('#upPage')) {
      openUpdatePage((info && info.page) || UPDATE_RELEASES);
      return;
    }
    if (e.target.closest('#upSkip')) {
      if (info && info.latest) {
        try { localStorage.setItem(UPDATE_SKIP_KEY, info.latest); } catch (err) { }
        toast('已跳过 v' + info.latest + '，仍可手动检查');
      }
      return;
    }
  });

  draw();
  if (!initial) runCheck();
  return { page, runCheck };
}

function showUpdateFound(info) {
  if (!info || !info.newer) return;
  openDialog({
    title: `发现新版本 v${esc(info.latest)}`,
    cancel: '稍后', ok: '查看更新',
    onOk: () => pageUpdate(info)
  });
}

async function autoCheckUpdate() {
  if (!updateNative()) return;
  let last = 0;
  try { last = Number(localStorage.getItem(UPDATE_CHECK_KEY) || 0); } catch (e) { }
  if (last && Date.now() - last < 24 * 3600 * 1000) return;
  try {
    const info = await checkForUpdate();
    let skip = '';
    try { skip = localStorage.getItem(UPDATE_SKIP_KEY) || ''; } catch (e) { }
    if (info.newer && skip !== info.latest) setTimeout(() => showUpdateFound(info), 300);
  } catch (e) {
    console.warn('[update] 检查失败：' + (e.message || e));
  }
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
  setTimeout(() => { if (DB.stories.length) autoCheckUpdate(); }, 4000);
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
