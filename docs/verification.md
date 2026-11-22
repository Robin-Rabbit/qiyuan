# 签名与发布验证

用于 APKMirror、F-Droid 或用户核对 APK 是否由本项目的发布密钥签名。

## 应用标识

| 项目 | 值 |
|---|---|
| 应用名 | 启源 / Qiyuan |
| 包名 | `app.tavo.rp` |
| 版本 | 0.1.2（versionCode 6） |
| 开发者 | Tavo |
| 联系邮箱 | robinliu721@qq.com |

## 发布签名证书

- Subject：`CN=Tavo RP, OU=Single Player, O=Tavo, L=Local, ST=Local, C=CN`
- SHA-256：`959bdb2131935e384f00cc924a253861c102f124d12b9e87ef0c542899faa6d8`
- SHA-1：`b2b7f27f020c25a034bd7c19f46f8e1f154c5cbd`
- 公钥证书：[`qiyuan-release-cert.pem`](qiyuan-release-cert.pem)

## APK

| 版本 | SHA-256 |
|---|---|
| 0.1.2 | `3a3e4ce96786da8396905705723561f466fce128446ef7df69fd10f2fcc30cf7` |

## 验证命令

```bash
# 查看 APK 签名证书
apksigner verify --print-certs 启源-0.1.2.apk

# 核对公钥证书指纹
openssl x509 -in docs/qiyuan-release-cert.pem -noout -fingerprint -sha256

# 校验 APK
shasum -a 256 启源-0.1.2.apk
```

预期证书 SHA-256：

```
959bdb2131935e384f00cc924a253861c102f124d12b9e87ef0c542899faa6d8
```

## 发布渠道

- GitHub Releases：<https://github.com/OWNER/qiyuan/releases>
- 源码：<https://github.com/OWNER/qiyuan>
- APKMirror：提交审核中

## 说明

- APKMirror 的上传表单是开放的社区提交入口，不是开发者后台；它通过 APK 签名、历史版本、官方仓库 / 官网与上传者邮箱交叉验证归属。
- 对于首次提交的新应用，APKMirror 可能联系上传邮箱要求补充证明；本文件与公开仓库、Release 页面、签名证书可作为归属证明。
- 项目后续版本会继续使用同一发布证书签名；如证书变更，会在 Release Notes 中说明。
