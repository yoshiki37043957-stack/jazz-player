// 黒本プレイヤー：アプリ本体を端末に保存してオフラインで動かす
const CACHE='kurohon-app-202611281530';
const FILES=["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "lib/pdf.min.js", "lib/pdf.worker.min.js", "lib/wasm/jbig2.wasm", "lib/wasm/jbig2_nowasm_fallback.js", "lib/wasm/openjpeg.wasm", "lib/wasm/openjpeg_nowasm_fallback.js", "lib/wasm/qcms_bg.wasm"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('kurohon-app-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.includes('/pack/'))return;
  if(e.request.mode==='navigate'||u.pathname.endsWith('/index.html')){
    // 画面本体：つながるときは最新を取り、つながらないときは保存済みを使う
    e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put('index.html',cp));}return r;}).catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(m=>m||fetch(e.request)));
});
