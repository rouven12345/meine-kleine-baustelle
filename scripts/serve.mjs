import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
http.createServer(async(req,res)=>{try{const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(file!==root && !file.startsWith(root+path.sep)){res.writeHead(403).end();return;}const target=file===root?path.join(root,'index.html'):file;res.setHeader('Content-Type',target.endsWith('.js')?'text/javascript':target.endsWith('.css')?'text/css':'text/html');res.end(await readFile(target));}catch{res.writeHead(404).end('Nicht gefunden');}}).listen(5173,()=>console.log('http://localhost:5173'));
