package app.qiyuan.rp;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.provider.Settings;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;
import androidx.core.content.FileProvider;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.KeyStore;
import java.security.MessageDigest;
import java.util.Iterator;
import java.util.Map;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.util.concurrent.ConcurrentHashMap;

public class MainActivity extends Activity {

    private static final String START_URL =
            "https://appassets.androidplatform.net/assets/www/index.html";

    private WebView web;
    private int topInset = 0;
    private int bottomInset = 0;

    private static final int FILE_CHOOSER_REQ = 4211;
    private ValueCallback<Uri[]> filePathCallback;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setStatusBarColor(Color.parseColor("#0b0d0e"));
        getWindow().setNavigationBarColor(Color.parseColor("#0b0d0e"));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            getWindow().setStatusBarContrastEnforced(false);
            getWindow().setNavigationBarContrastEnforced(false);
        }

        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#0b0d0e"));
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setTextZoom(100);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);

        boolean debuggable = (getApplicationInfo().flags & android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0;
        WebView.setWebContentsDebuggingEnabled(debuggable);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String scheme = uri.getScheme() == null ? "" : uri.getScheme();
                if (scheme.equals("https") && uri.getHost() != null
                        && uri.getHost().equals("appassets.androidplatform.net")) {
                    return false;
                }
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                } catch (Exception ignored) {
                }
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                Log.i("QiyuanRP", "onPageFinished " + url);
                pushInsets();
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request,
                                        android.webkit.WebResourceError error) {
                Log.e("QiyuanRP", "onReceivedError " + request.getUrl() + " -> "
                        + error.getErrorCode() + " " + error.getDescription());
            }

            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest request,
                                            WebResourceResponse response) {
                Log.e("QiyuanRP", "onReceivedHttpError " + request.getUrl() + " -> " + response.getStatusCode());
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage msg) {
                Log.d("QiyuanRP", msg.message() + " @" + msg.sourceId() + ":" + msg.lineNumber());
                return true;
            }

            /**
             * 头像 / 封面等 <input type="file"> 需要原生实现文件选择器，
             * 否则 WebView 默认不会响应点击。
             */
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback,
                                             FileChooserParams params) {
                if (filePathCallback != null) {
                    filePathCallback.onReceiveValue(null);
                }
                filePathCallback = callback;
                Intent intent;
                try {
                    intent = params.createIntent();
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                } catch (Exception e) {
                    intent = new Intent(Intent.ACTION_GET_CONTENT)
                            .addCategory(Intent.CATEGORY_OPENABLE)
                            .setType("*/*");
                }
                try {
                    startActivityForResult(Intent.createChooser(intent, "选择文件"), FILE_CHOOSER_REQ);
                    return true;
                } catch (Exception e) {
                    Log.w("QiyuanRP", "file chooser failed", e);
                    filePathCallback = null;
                    return false;
                }
            }
        });

        web.addJavascriptInterface(new LlmBridge(), "AndroidLLM");
        web.addJavascriptInterface(new SecureBridge(), "AndroidSecure");
        web.addJavascriptInterface(new FileBridge(), "AndroidFile");
        web.addJavascriptInterface(new UpdateBridge(), "AndroidUpdate");

        // 把系统栏高度交给前端，前端通过 --safe-top / --safe-bottom 使用
        web.setOnApplyWindowInsetsListener((v, insets) -> {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                android.graphics.Insets bars = insets.getInsets(
                        WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                setInsets(bars.top, bars.bottom);
            } else {
                setInsets(insets.getSystemWindowInsetTop(), insets.getSystemWindowInsetBottom());
            }
            return insets;
        });

        setContentView(web);
        web.loadUrl(START_URL);
    }

    /**
     * 系统手势导航会优先吃掉屏幕边缘的横滑，导致抽屉手势失效、甚至直接退出。
     * 这里把左右各 30dp 的竖条排除在系统返回手势之外（系统上限 200dp，足够）。
     */
    private void setInsets(int top, int bottom) {
        if (top == topInset && bottom == bottomInset) return;
        topInset = top;
        bottomInset = bottom;
        pushInsets();
    }

    private void postJs(final String js) {
        final WebView w = web;
        if (w == null) return;
        try {
            w.post(() -> {
                if (web == null) return;
                try {
                    web.evaluateJavascript(js, null);
                } catch (Exception ignored) {
                }
            });
        } catch (Exception ignored) {
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_REQ) {
            if (filePathCallback != null) {
                Uri[] result = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
                filePathCallback.onReceiveValue(result);
                filePathCallback = null;
            }
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    private void pushInsets() {
        if (web == null) return;
        float density = getResources().getDisplayMetrics().density;
        int topDp = Math.round(topInset / density);
        int bottomDp = Math.round(bottomInset / density);
        String js = "document.documentElement.style.setProperty('--safe-top','" + topDp + "px');"
                + "document.documentElement.style.setProperty('--safe-bottom','" + bottomDp + "px');";
        web.evaluateJavascript(js, null);
    }

    /** 原生 HTTP 桥：绕过 WebView 的 CORS 限制，直接请求 LLM API。 */
    private static final String SECRET_ALIAS = "qiyuan_llm_secret_v1";

    private SecretKey getSecretKey() throws Exception {
        KeyStore ks = KeyStore.getInstance("AndroidKeyStore");
        ks.load(null);
        if (ks.containsAlias(SECRET_ALIAS)) {
            KeyStore.Entry e = ks.getEntry(SECRET_ALIAS, null);
            if (e instanceof KeyStore.SecretKeyEntry) return ((KeyStore.SecretKeyEntry) e).getSecretKey();
        }
        KeyGenerator kg = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore");
        kg.init(new KeyGenParameterSpec.Builder(SECRET_ALIAS,
                KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .build());
        return kg.generateKey();
    }

    /**
     * 世界卡 / 存档导出。WebView 对 blob: 下载支持不稳定，
     * 这里直接写进「下载/启源」目录（Android 10+ 走 MediaStore，无需权限）。
     */
    public class FileBridge {
        @JavascriptInterface
        public String saveText(String name, String content, String mime) {
            String safe = name == null ? "" : name.replaceAll("[\\\\/:*?\"<>|]", "_").trim();
            if (safe.isEmpty()) safe = "启源导出.json";
            byte[] bytes = (content == null ? "" : content).getBytes(StandardCharsets.UTF_8);
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentValues cv = new ContentValues();
                    cv.put(MediaStore.MediaColumns.DISPLAY_NAME, safe);
                    cv.put(MediaStore.MediaColumns.MIME_TYPE,
                            mime == null ? "application/octet-stream" : mime);
                    cv.put(MediaStore.MediaColumns.RELATIVE_PATH,
                            Environment.DIRECTORY_DOWNLOADS + "/启源");
                    Uri uri = getContentResolver()
                            .insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, cv);
                    if (uri == null) return "err:insert";
                    OutputStream os = getContentResolver().openOutputStream(uri);
                    if (os == null) return "err:stream";
                    try {
                        os.write(bytes);
                    } finally {
                        os.close();
                    }
                    return "saved";
                }
                File dir = new File(getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), "启源");
                if (!dir.exists() && !dir.mkdirs()) return "err:mkdir";
                File out = new File(dir, safe);
                try (FileOutputStream fos = new FileOutputStream(out)) {
                    fos.write(bytes);
                }
                return "saved";
            } catch (Exception e) {
                Log.w("QiyuanRP", "saveText failed", e);
                return "err:" + e.getMessage();
            }
        }
    }

    public class SecureBridge {
        @JavascriptInterface
        public String encrypt(String plain) {
            if (plain == null || plain.isEmpty()) return "";
            try {
                Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
                c.init(Cipher.ENCRYPT_MODE, getSecretKey());
                byte[] iv = c.getIV();
                byte[] ct = c.doFinal(plain.getBytes(StandardCharsets.UTF_8));
                return "enc:" + Base64.encodeToString(iv, Base64.NO_WRAP) + ":"
                        + Base64.encodeToString(ct, Base64.NO_WRAP);
            } catch (Exception e) {
                Log.w("QiyuanRP", "encrypt failed", e);
                return plain;
            }
        }

        @JavascriptInterface
        public String decrypt(String payload) {
            if (payload == null || payload.isEmpty()) return "";
            if (!payload.startsWith("enc:")) return payload;
            try {
                String[] parts = payload.split(":");
                if (parts.length != 3) return "";
                byte[] iv = Base64.decode(parts[1], Base64.NO_WRAP);
                byte[] ct = Base64.decode(parts[2], Base64.NO_WRAP);
                Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
                c.init(Cipher.DECRYPT_MODE, getSecretKey(), new GCMParameterSpec(128, iv));
                return new String(c.doFinal(ct), StandardCharsets.UTF_8);
            } catch (Exception e) {
                Log.w("QiyuanRP", "decrypt failed", e);
                return "";
            }
        }

        @JavascriptInterface
        public void exitApp() {
            runOnUiThread(() -> finishAffinity());
        }
    }

    public class LlmBridge {

        private final Map<String, HttpURLConnection> active = new ConcurrentHashMap<>();

        @JavascriptInterface
        public void post(final String id, final String url, final String headersJson, final String bodyJson) {
            new Thread(() -> {
                String response = "";
                String error = "";
                HttpURLConnection conn = null;
                try {
                    conn = open(url, headersJson, bodyJson);
                    int status = conn.getResponseCode();
                    InputStream is = status >= 400 ? conn.getErrorStream() : conn.getInputStream();
                    ByteArrayOutputStream bos = new ByteArrayOutputStream();
                    if (is != null) {
                        byte[] buf = new byte[8192];
                        int n;
                        while ((n = is.read(buf)) != -1) bos.write(buf, 0, n);
                        is.close();
                    }
                    response = bos.toString("UTF-8");
                    if (status >= 400) {
                        error = "HTTP " + status + ": " + response;
                        response = "";
                    }
                } catch (Exception e) {
                    error = e.getMessage() == null ? e.toString() : e.getMessage();
                } finally {
                    if (conn != null) {
                        try { conn.disconnect(); } catch (Exception ignored) { }
                    }
                }
                final String r = response;
                final String err = error;
                postJs("window.__llmResult(" + JSONObject.quote(id) + "," +
                        JSONObject.quote(r) + "," + JSONObject.quote(err) + ");");
            }).start();
        }

        @JavascriptInterface
        public void get(final String id, final String url, final String headersJson) {
            new Thread(() -> {
                String response = "";
                String error = "";
                HttpURLConnection conn = null;
                try {
                    conn = (HttpURLConnection) new URL(url).openConnection();
                    conn.setRequestMethod("GET");
                    conn.setConnectTimeout(20000);
                    conn.setReadTimeout(30000);
                    conn.setRequestProperty("Accept", "application/json");
                    try {
                        JSONObject headers = new JSONObject(headersJson);
                        Iterator<String> keys = headers.keys();
                        while (keys.hasNext()) {
                            String k = keys.next();
                            conn.setRequestProperty(k, headers.optString(k));
                        }
                    } catch (Exception ignored) {
                    }
                    int status = conn.getResponseCode();
                    InputStream is = status >= 400 ? conn.getErrorStream() : conn.getInputStream();
                    ByteArrayOutputStream bos = new ByteArrayOutputStream();
                    if (is != null) {
                        byte[] buf = new byte[8192];
                        int n;
                        while ((n = is.read(buf)) != -1) bos.write(buf, 0, n);
                        is.close();
                    }
                    response = bos.toString("UTF-8");
                    if (status >= 400) {
                        error = "HTTP " + status + ": " + response;
                        response = "";
                    }
                } catch (Exception e) {
                    error = e.getMessage() == null ? e.toString() : e.getMessage();
                } finally {
                    if (conn != null) {
                        try { conn.disconnect(); } catch (Exception ignored) { }
                    }
                }
                final String r = response;
                final String err = error;
                postJs("window.__llmGetResult(" + JSONObject.quote(id) + "," +
                        JSONObject.quote(r) + "," + JSONObject.quote(err) + ");");
            }).start();
        }

        @JavascriptInterface
        public void cancelAll() {
            for (HttpURLConnection c : active.values()) {
                try { c.disconnect(); } catch (Exception ignored) { }
            }
            active.clear();
        }

        @JavascriptInterface
        public void postStream(final String id, final String url,
                               final String headersJson, final String bodyJson) {
            new Thread(() -> {
                String full = "";
                String error = "";
                HttpURLConnection conn = null;
                try {
                    conn = open(url, headersJson, bodyJson);
                    active.put(id, conn);
                    int status = conn.getResponseCode();
                    if (status >= 400) {
                        InputStream es = conn.getErrorStream();
                        ByteArrayOutputStream eb = new ByteArrayOutputStream();
                        if (es != null) {
                            byte[] b = new byte[4096];
                            int n;
                            while ((n = es.read(b)) != -1) eb.write(b, 0, n);
                            es.close();
                        }
                        error = "HTTP " + status + ": " + eb.toString("UTF-8");
                    } else {
                        BufferedReader reader = new BufferedReader(
                                new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
                        String line;
                        StringBuilder raw = new StringBuilder();
                        StringBuilder acc = new StringBuilder();
                        while ((line = reader.readLine()) != null) {
                            if (raw.length() > 0) raw.append('\n');
                            raw.append(line);
                            if (!line.startsWith("data:")) continue;
                            String data = line.substring(5).trim();
                            if (data.isEmpty() || data.equals("[DONE]")) continue;
                            String piece = extractDelta(data);
                            if (piece != null && !piece.isEmpty()) {
                                acc.append(piece);
                                final String p = piece;
                                postJs("window.__llmDelta(" + JSONObject.quote(id) + "," +
                                        JSONObject.quote(p) + ");");
                            }
                        }
                        reader.close();
                        full = acc.toString();
                        if (full.isEmpty()) {
                            // 服务端忽略了 stream，返回普通 JSON
                            full = extractFull(raw.toString());
                        }
                    }
                } catch (Exception e) {
                    error = e.getMessage() == null ? e.toString() : e.getMessage();
                } finally {
                    active.remove(id);
                    if (conn != null) {
                        try { conn.disconnect(); } catch (Exception ignored) { }
                    }
                }
                final String f = full;
                final String err = error;
                postJs("window.__llmDone(" + JSONObject.quote(id) + "," +
                        JSONObject.quote(f) + "," + JSONObject.quote(err) + ");");
            }).start();
        }

        private HttpURLConnection open(String url, String headersJson, String bodyJson) throws Exception {
            HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
            conn.setRequestMethod("POST");
            conn.setConnectTimeout(30000);
            conn.setReadTimeout(180000);
            conn.setDoOutput(true);
            conn.setRequestProperty("Accept", "application/json, text/event-stream");
            try {
                JSONObject headers = new JSONObject(headersJson);
                Iterator<String> keys = headers.keys();
                while (keys.hasNext()) {
                    String k = keys.next();
                    conn.setRequestProperty(k, headers.optString(k));
                }
            } catch (Exception ignored) {
            }
            byte[] payload = bodyJson.getBytes(StandardCharsets.UTF_8);
            conn.setFixedLengthStreamingMode(payload.length);
            try (OutputStream os = conn.getOutputStream()) {
                os.write(payload);
            }
            return conn;
        }

        /** 从一条 SSE data 中取出增量文本，兼容 OpenAI 与 Anthropic。 */
        private String extractDelta(String data) {
            try {
                JSONObject o = new JSONObject(data);
                if (o.has("choices") && o.optJSONArray("choices") != null
                        && o.optJSONArray("choices").length() > 0) {
                    JSONObject ch = o.optJSONArray("choices").optJSONObject(0);
                    JSONObject d = ch.optJSONObject("delta");
                    if (d != null && d.has("content") && !d.isNull("content")) return d.optString("content");
                    JSONObject m = ch.optJSONObject("message");
                    if (m != null && m.has("content") && !m.isNull("content")) return m.optString("content");
                    return null;
                }
                if ("content_block_delta".equals(o.optString("type"))) {
                    JSONObject d = o.optJSONObject("delta");
                    if (d != null && "text_delta".equals(d.optString("type"))) return d.optString("text");
                }
                if (o.optJSONArray("content") != null) {
                    return joinContent(o);
                }
            } catch (Exception ignored) {
            }
            return null;
        }

        /** 非流式响应兜底。 */
        private String extractFull(String raw) {
            try {
                JSONObject o = new JSONObject(raw);
                if (o.optJSONArray("choices") != null && o.optJSONArray("choices").length() > 0) {
                    JSONObject ch = o.optJSONArray("choices").optJSONObject(0);
                    JSONObject m = ch != null ? ch.optJSONObject("message") : null;
                    if (m != null) return m.optString("content", "");
                    return ch != null ? ch.optString("text", "") : "";
                }
                if (o.optJSONArray("content") != null) {
                    return joinContent(o);
                }
            } catch (Exception ignored) {
            }
            return "";
        }

        private String joinContent(JSONObject o) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < o.optJSONArray("content").length(); i++) {
                JSONObject b = o.optJSONArray("content").optJSONObject(i);
                if (b != null && "text".equals(b.optString("type"))) sb.append(b.optString("text"));
            }
            return sb.toString();
        }
    }

    /**
     * 应用内更新：检查 GitHub Releases、下载 APK、校验签名后交给系统安装器。
     * 只接受 GitHub 域名；APK 必须与当前应用同包名、同签名，且版本号更高。
     */
    public class UpdateBridge {
        private static final String EXPECTED_CERT =
                "d0452d999f5234db0e843ec4a33dbcb5ac258b010882d3b8e75e6b06de92e58f";
        private static final String UPDATE_DIR = "updates";
        private static final long MAX_JSON = 1024 * 1024;

        @JavascriptInterface
        public String info() {
            try {
                PackageInfo pi = getPackageManager().getPackageInfo(getPackageName(), 0);
                JSONObject o = new JSONObject();
                o.put("versionName", pi.versionName == null ? "" : pi.versionName);
                o.put("versionCode", Build.VERSION.SDK_INT >= 28 ? pi.getLongVersionCode() : pi.versionCode);
                o.put("canInstall", Build.VERSION.SDK_INT < 26
                        || getPackageManager().canRequestPackageInstalls());
                return o.toString();
            } catch (Exception e) {
                return "{}";
            }
        }

        @JavascriptInterface
        public void get(final String id, final String url) {
            new Thread(() -> {
                String body = "";
                String error = "";
                try {
                    if (!allowed(url)) throw new IllegalArgumentException("不支持的更新地址");
                    HttpURLConnection conn = open(url, "application/vnd.github+json");
                    try {
                        int status = conn.getResponseCode();
                        if (status != 200) throw new java.io.IOException("HTTP " + status);
                        body = read(conn.getInputStream(), MAX_JSON);
                    } finally {
                        conn.disconnect();
                    }
                } catch (Exception e) {
                    error = message(e);
                }
                final String b = body, er = error;
                postJs("window.__updateHttpResult(" + JSONObject.quote(id) + ","
                        + JSONObject.quote(b) + "," + JSONObject.quote(er) + ");");
            }).start();
        }

        @JavascriptInterface
        public void download(final String id, final String url, final String fileName) {
            new Thread(() -> {
                String path = "";
                String error = "";
                File target = null;
                try {
                    if (!allowed(url)) throw new IllegalArgumentException("不支持的下载地址");
                    File dir = new File(getCacheDir(), UPDATE_DIR);
                    if (dir.exists()) {
                        File[] old = dir.listFiles();
                        if (old != null) {
                            for (File f : old) {
                                if (f.isFile()) f.delete();
                            }
                        }
                    }
                    if (!dir.exists() && !dir.mkdirs()) throw new java.io.IOException("无法创建下载目录");
                    String safe = fileName == null ? "qiyuan-update.apk"
                            : fileName.replaceAll("[^A-Za-z0-9._-]", "_");
                    if (!safe.toLowerCase().endsWith(".apk")) safe = safe + ".apk";
                    target = new File(dir, safe);
                    HttpURLConnection conn = open(url, "application/vnd.android.package-archive");
                    try {
                        int status = conn.getResponseCode();
                        if (status != 200) throw new java.io.IOException("HTTP " + status);
                        long total = conn.getContentLengthLong();
                        long loaded = 0;
                        long last = 0;
                        try (InputStream is = conn.getInputStream();
                             FileOutputStream fos = new FileOutputStream(target)) {
                            byte[] buf = new byte[65536];
                            int n;
                            while ((n = is.read(buf)) != -1) {
                                fos.write(buf, 0, n);
                                loaded += n;
                                if (loaded - last >= 262144 || (total > 0 && loaded >= total)) {
                                    last = loaded;
                                    final long l = loaded, t = total;
                                    postJs("window.__updateProgress(" + JSONObject.quote(id)
                                            + "," + l + "," + t + ");");
                                }
                            }
                        }
                        String bad = verify(target);
                        if (bad != null) throw new java.io.IOException(bad);
                        path = target.getAbsolutePath();
                    } finally {
                        conn.disconnect();
                    }
                } catch (Exception e) {
                    error = message(e);
                    if (target != null) {
                        try {
                            target.delete();
                        } catch (Exception ignored) {
                        }
                    }
                }
                final String p = path, er = error;
                postJs("window.__updateDone(" + JSONObject.quote(id) + ","
                        + JSONObject.quote(p) + "," + JSONObject.quote(er) + ");");
            }).start();
        }

        /** 返回 ok / permission / err:原因。permission 时会打开“安装未知应用”设置。 */
        @JavascriptInterface
        public String install(String path) {
            try {
                if (path == null) return "err:missing";
                File f = new File(path);
                String cache = getCacheDir().getCanonicalPath() + File.separator;
                if (!f.getCanonicalPath().startsWith(cache)) return "err:path";
                if (!f.isFile()) return "err:missing";
                if (Build.VERSION.SDK_INT >= 26 && !getPackageManager().canRequestPackageInstalls()) {
                    return "permission";
                }
                Uri uri = FileProvider.getUriForFile(MainActivity.this, getPackageName() + ".files", f);
                Intent i = new Intent(Intent.ACTION_VIEW);
                i.setDataAndType(uri, "application/vnd.android.package-archive");
                i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                runOnUiThread(() -> {
                    try {
                        startActivity(i);
                    } catch (Exception e) {
                        Log.w("QiyuanRP", "install intent failed", e);
                    }
                });
                return "ok";
            } catch (Exception e) {
                return "err:" + message(e);
            }
        }

        @JavascriptInterface
        public void openUnknownSources() {
            runOnUiThread(() -> {
                try {
                    Intent i = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                            Uri.parse("package:" + getPackageName()));
                    i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(i);
                } catch (Exception e) {
                    try {
                        startActivity(new Intent(Settings.ACTION_SECURITY_SETTINGS));
                    } catch (Exception ignored) {
                    }
                }
            });
        }

        @JavascriptInterface
        public void openUrl(String url) {
            if (!allowed(url)) return;
            runOnUiThread(() -> {
                try {
                    Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(i);
                } catch (Exception ignored) {
                }
            });
        }

        private boolean allowed(String url) {
            try {
                String host = new URL(url).getHost();
                if (host == null) return false;
                host = host.toLowerCase();
                return host.equals("github.com") || host.endsWith(".github.com")
                        || host.equals("githubusercontent.com")
                        || host.endsWith(".githubusercontent.com");
            } catch (Exception e) {
                return false;
            }
        }

        private HttpURLConnection open(String url, String accept) throws Exception {
            String cur = url;
            for (int i = 0; i < 6; i++) {
                HttpURLConnection conn = (HttpURLConnection) new URL(cur).openConnection();
                conn.setInstanceFollowRedirects(false);
                conn.setConnectTimeout(20000);
                conn.setReadTimeout(30000);
                conn.setRequestProperty("Accept", accept);
                conn.setRequestProperty("User-Agent", "Qiyuan-Android");
                int status = conn.getResponseCode();
                if (status == 301 || status == 302 || status == 303 || status == 307 || status == 308) {
                    String loc = conn.getHeaderField("Location");
                    conn.disconnect();
                    if (loc == null || loc.isEmpty()) throw new java.io.IOException("重定向缺少地址");
                    cur = new URL(new URL(cur), loc).toString();
                    if (!allowed(cur)) throw new java.io.IOException("重定向到不支持的地址");
                    continue;
                }
                return conn;
            }
            throw new java.io.IOException("重定向次数过多");
        }

        private String read(InputStream is, long max) throws Exception {
            try (InputStream in = is; ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
                byte[] buf = new byte[16384];
                int n;
                long total = 0;
                while ((n = in.read(buf)) != -1) {
                    total += n;
                    if (total > max) throw new java.io.IOException("响应过大");
                    bos.write(buf, 0, n);
                }
                return bos.toString("UTF-8");
            }
        }

        /** 校验包名、版本号与签名；通过返回 null。 */
        private String verify(File apk) throws Exception {
            PackageManager pm = getPackageManager();
            PackageInfo self = pm.getPackageInfo(getPackageName(), 0);
            int flags = Build.VERSION.SDK_INT >= 28
                    ? PackageManager.GET_SIGNING_CERTIFICATES : PackageManager.GET_SIGNATURES;
            PackageInfo pi = pm.getPackageArchiveInfo(apk.getAbsolutePath(), flags);
            if (pi == null) return "下载的文件不是有效的 APK";
            if (!getPackageName().equals(pi.packageName)) return "安装包包名不匹配";
            long code = Build.VERSION.SDK_INT >= 28 ? pi.getLongVersionCode() : pi.versionCode;
            long cur = Build.VERSION.SDK_INT >= 28 ? self.getLongVersionCode() : self.versionCode;
            if (code <= cur) return "安装包版本不高于当前版本";
            String actual = null;
            if (Build.VERSION.SDK_INT >= 28) {
                if (pi.signingInfo != null) {
                    Signature[] sigs = pi.signingInfo.hasMultipleSigners()
                            ? pi.signingInfo.getApkContentsSigners()
                            : pi.signingInfo.getSigningCertificateHistory();
                    if (sigs != null && sigs.length > 0) actual = sha256(sigs[0].toByteArray());
                }
            } else if (pi.signatures != null && pi.signatures.length > 0) {
                actual = sha256(pi.signatures[0].toByteArray());
            }
            if (actual == null) return "无法读取安装包签名";
            if (!EXPECTED_CERT.equalsIgnoreCase(actual)) return "安装包签名与当前应用不一致";
            return null;
        }

        private String sha256(byte[] data) throws Exception {
            byte[] out = MessageDigest.getInstance("SHA-256").digest(data);
            StringBuilder sb = new StringBuilder();
            for (byte b : out) sb.append(String.format("%02x", b & 0xff));
            return sb.toString();
        }

        private String message(Exception e) {
            return e.getMessage() == null ? e.toString() : e.getMessage();
        }
    }

    private void systemBack() {
        super.onBackPressed();
    }

    @Override
    public void onBackPressed() {
        if (web == null) {
            systemBack();
            return;
        }
        web.evaluateJavascript(
                "(window.onAndroidBack && window.onAndroidBack()) ? 'true' : 'false'",
                value -> {
                    boolean handled = value != null && value.contains("true");
                    if (!handled) systemBack();
                });
    }

    @Override
    protected void onDestroy() {
        if (web != null) {
            web.destroy();
            web = null;
        }
        super.onDestroy();
    }
}
