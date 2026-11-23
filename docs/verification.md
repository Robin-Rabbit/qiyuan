# 签名与发布验证

用于 APKMirror、F-Droid 或用户核对 APK 是否由本项目的发布密钥签名。

## 应用标识

| 项目 | 值 |
|---|---|
| 应用名 | 启源 / Qiyuan |
| 包名 | `app.qiyuan.rp` |
| 版本 | 0.1.4（versionCode 8） |
| 开发者 | Qiyuan |
| 联系邮箱 | robinliu721@qq.com |

> 0.1.4 起应用标识更换为 `app.qiyuan.rp`，签名证书同步更换。0.1.3 及更早版本不能覆盖升级，需要先导出世界卡与存档，再安装新版并导入。

## 发布签名证书

- Subject：`CN=Qiyuan RP, OU=Single Player, O=Qiyuan, C=CN`
- SHA-256：`d0452d999f5234db0e843ec4a33dbcb5ac258b010882d3b8e75e6b06de92e58f`
- SHA-1：`53e3051ece9d74ffd53a8e51d00db9f5b1c2b8ea`
- 公钥证书：[`qiyuan-release-cert.pem`](qiyuan-release-cert.pem)

## APK

| 版本 | SHA-256 |
|---|---|
| 0.1.4 | `a613b5567431deddc91b5e8518f87e70a1e5bdf2fc8a153cc7bbc5e5c7b1ddf2` |

## 验证命令

```bash
# 查看 APK 签名证书
apksigner verify --print-certs 启源-0.1.4.apk

# 核对公钥证书指纹
openssl x509 -in docs/qiyuan-release-cert.pem -noout -fingerprint -sha256

# 校验 APK
shasum -a 256 启源-0.1.4.apk
```

## 应用内更新校验

0.1.4 起，应用下载更新包后会校验：

1. 包名必须为 `app.qiyuan.rp`；
2. `versionCode` 必须高于当前版本；
3. APK 签名证书 SHA-256 必须为上述指纹。

任一项不符都会删除下载文件并拒绝安装。
