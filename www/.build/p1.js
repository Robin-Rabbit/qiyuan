/* ============================================================
   一、运行常量 · 世界预设 · 时间引擎 · 数据模型
   ============================================================ */
const APP_VERSION = '0.1.3';
const SCHEMA_VERSION = 4;
const TICK_MS = 30000;          // 现实 30 秒一个时间线 tick
const AUTONOMY_MIN = 30;        // 每推进 30 世界分钟，尝试一次 NPC 自主行为
const OFFLINE_DAY_MIN = 1440;   // 超过 1 世界天无操作 → 记忆空洞填补
const MAX_MESSAGES = 500;
const STORAGE_KEY = 'tavo_rp_v3';
const PRIVACY_KEY = 'qiyuan_privacy_v1';
const LEGACY_KEY = 'tavo_rp_single_v1';

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
      const req = indexedDB.open('tavo_media', 1);
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
