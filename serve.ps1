$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

$port = 8765
$listening = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue
if ($listening) {
    Write-Host "Ya hay un servidor escuchando en el puerto $port."
    Write-Host "Abre: http://127.0.0.1:$port/"
    exit 0
}

$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) { $python = Get-Command py -ErrorAction SilentlyContinue }

Write-Host "Sirviendo $PSScriptRoot"
Write-Host "Abre: http://127.0.0.1:$port/"
Write-Host "Deten con Ctrl+C."
Write-Host ""

if ($python) {
    & $python.Source -m http.server $port --bind 127.0.0.1
} elseif (Get-Command node -ErrorAction SilentlyContinue) {
    node -e "const h=require('http'),f=require('fs'),p=require('path'),u=require('url');const t={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml','.ico':'image/x-icon','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.mp4':'video/mp4','.pdf':'application/pdf'};h.createServer((q,s)=>{let n=decodeURIComponent(u.parse(q.url).pathname);let g=p.join(process.cwd(),n);if(n.endsWith('/'))g=p.join(g,'index.html');f.stat(g,(e,st)=>{if(e||!st.isFile()){const i=p.join(process.cwd(),n,'index.html');return f.stat(i,(e2,s2)=>{(e2||!s2.isFile())?(s.writeHead(404),s.end('404')):(s.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}),f.createReadStream(i).pipe(s))})}s.writeHead(200,{'Content-Type':t[p.extname(g).toLowerCase()]||'application/octet-stream'});f.createReadStream(g).pipe(s)})}).listen($port,'127.0.0.1',()=>console.log('http://127.0.0.1:$port/'))"
} else {
    Write-Error "No se encontro Python ni Node.js en el PATH."
}
