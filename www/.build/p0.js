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
