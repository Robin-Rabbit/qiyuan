# F-Droid 提交说明

## 1. 前置条件

- 公开源码仓库：`https://github.com/Robin-Rabbit/qiyuan`
- Tag：`v0.1.4`（versionCode 8）
- 许可证：MIT
- 无预编译二进制、无广告 / 统计 SDK
- 构建：`./gradlew assembleRelease`，无 keystore 时输出 `app-release-unsigned.apk`

## 2. 提交方式

F-Droid 通过 GitLab 上的 `fdroiddata` 仓库合并请求收录应用：

1. 登录 <https://gitlab.com>。
2. Fork <https://gitlab.com/fdroid/fdroiddata>。
3. 在 fork 中新增 `metadata/app.qiyuan.rp.yml`，内容使用 `fdroid/app.qiyuan.rp.yml`，把 `Robin-Rabbit` 替换为 GitHub 用户名。
4. 提交 Merge Request 到 `fdroid/fdroiddata` 的 `master`。
5. 在 MR 描述中说明：
   - 应用名：启源 / Qiyuan
   - 包名：app.qiyuan.rp
   - 源码：GitHub 仓库
   - 许可证：MIT
   - 无账号、无自有服务器、无追踪
   - 联网仅用于用户自行配置的第三方模型接口

## 3. 构建配方要点

```yaml
Builds:
  - versionName: 0.1.4
    versionCode: 6
    commit: v0.1.4
    gradle:
      - yes
    output: app/build/outputs/apk/release/app-release-unsigned.apk
```

- `signingConfig` 只在仓库根目录存在 `qiyuan-release.keystore` 时启用；F-Droid 构建环境没有该文件，因此输出未签名 APK，由 F-Droid 统一签名。
- 依赖只有 `androidx.webkit:webkit:1.11.0`（Apache-2.0）。
- 应用不包含 Google Play Services、Firebase、广告、统计或推送 SDK。

## 4. 审核可能关注

- **联网**：应用没有默认接口，也没有开发者服务器；只有用户配置接口并主动触发时才联网。可在 MR 中说明这是 BYOK 客户端。
- **AI 内容**：应用内已标注 AI 生成内容为虚构、仅供娱乐；隐私政策包含 AIGC 说明。
- **明文 HTTP**：`usesCleartextTraffic=true` 用于用户自建的局域网 / HTTP 模型接口；如审核要求，可改为仅允许 HTTPS，但会失去本地模型支持。
- **签名**：F-Droid 版本使用 F-Droid 签名，不能覆盖安装 GitHub Release 版本。

## 5. 收录后

- F-Droid 页面：`https://f-droid.org/packages/app.qiyuan.rp/`
- 后续版本通过 `AutoUpdateMode: Version` + Git tag 自动检测；保持 tag 与 `versionCode` 一致。
