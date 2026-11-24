# APKMirror 提交资料

APKMirror 目前以上传表单 + 人工审核为主，需要账号登录。准备以下内容：

| 字段 | 内容 |
|---|---|
| App name | 启源 (Qiyuan) |
| Package | app.qiyuan.rp |
| Version | 0.1.4 |
| Version code | 9 |
| Developer | Qiyuan |
| Category | Books & Reference（或 Entertainment） |
| Requires Android | 8.0+ |
| Architecture | Universal（无 native libs） |
| APK | `android-app/dist/启源-0.1.4.apk` |
| SHA-256 | `9e57a7bc912a47e3609e409f765e94cd4caecc2c437956b2702a26bbea42e849` |
| Signing certificate SHA-256 | `d0452d999f5234db0e843ec4a33dbcb5ac258b010882d3b8e75e6b06de92e58f` |
| Icon | `android-app/store/icon-512.png` |
| Screenshots | `android-app/store/screenshots/*.png` |
| Changelog | 见下方 |

## 简介

启源是一款单机 AI 互动叙事应用。没有账号，没有自有服务器；世界卡、角色、对话、记忆与时间线都保存在设备上。支持自由模式与剧情模式，NPC 拥有独立记忆与演化，模型接口由用户自行配置。

## 更新日志

- 新增应用内更新：从 GitHub Releases 检查、下载并校验签名后安装
- 应用标识更换为 app.qiyuan.rp 与新的发布签名证书；旧版需导出存档后重装
- 剧情规划支持玩家要求与单阶段生成
- 世界卡与实例彻底分离，剧情阶段只属于实例
- 隐私政策补充更新检查与安装权限说明

## 上传步骤

1. 登录 <https://www.apkmirror.com/>。
2. 进入 Upload / Submit 页面。
3. 填写应用名、包名、版本、开发者、分类与更新日志。
4. 上传 APK、图标与截图。
5. 提交后等待人工审核；GitHub Releases：<https://github.com/Robin-Rabbit/qiyuan/releases/tag/v0.1.4>。
6. 0.1.4 使用新包名与新签名证书，与 0.1.2 投稿不是同一应用标识，请在审核说明中注明。
