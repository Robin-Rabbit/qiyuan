# APKMirror 提交资料

APKMirror 目前以上传表单 + 人工审核为主，需要账号登录。准备以下内容：

| 字段 | 内容 |
|---|---|
| App name | 启源 (Qiyuan) |
| Package | app.qiyuan.rp |
| Version | 0.1.2 |
| Version code | 6 |
| Developer | Qiyuan |
| Category | Books & Reference（或 Entertainment） |
| Requires Android | 8.0+ |
| Architecture | Universal（无 native libs） |
| APK | `android-app/dist/启源-0.1.2.apk` |
| SHA-256 | `3a3e4ce96786da8396905705723561f466fce128446ef7df69fd10f2fcc30cf7` |
| Signing certificate SHA-256 | `959bdb2131935e384f00cc924a253861c102f124d12b9e87ef0c542899faa6d8` |
| Icon | `android-app/store/icon-512.png` |
| Screenshots | `android-app/store/screenshots/*.png` |
| Changelog | 见下方 |

## 简介

启源是一款单机 AI 互动叙事应用。没有账号，没有自有服务器；世界卡、角色、对话、记忆与时间线都保存在设备上。支持自由模式与剧情模式，NPC 拥有独立记忆与演化，模型接口由用户自行配置。

## 更新日志

- 新增首次启动隐私授权与完整隐私政策入口
- 世界卡与实例彻底分离，同一张卡可创建多个实例
- 剧情阶段只属于实例，不再写入世界卡
- 角色演化只修改实例，不回写世界卡
- 体验存档携带实例阶段定义
- 关闭 Android 自动备份

## 上传步骤

1. 登录 <https://www.apkmirror.com/>。
2. 进入 Upload / Submit 页面。
3. 填写应用名、包名、版本、开发者、分类与更新日志。
4. 上传 APK、图标与截图。
5. 提交后等待人工审核；如要求 Play Store 链接或官网，可提供 GitHub Releases 页面。
