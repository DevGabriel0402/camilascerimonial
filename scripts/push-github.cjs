const fs=require('fs');
const {execFileSync}=require('child_process');
const https=require('https');
const git=(...args)=>execFileSync('git',args,{maxBuffer:50*1024*1024});
const repo='DevGabriel0402/camilascerimonial';
async function main(){
 const credential=execFileSync('git',['credential','fill'],{input:'protocol=https\nhost=github.com\npath='+repo+'.git\n\n',encoding:'utf8'});
 const fields=Object.fromEntries(credential.trim().split('\n').map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1)];}));
 if(!fields.password)throw Error('No saved GitHub credential available');
 const api=(path,body,method=body?'POST':'GET')=>new Promise((resolve,reject)=>{
  const data=body?JSON.stringify(body):null;
  const req=https.request({hostname:'api.github.com',path:'/repos/'+repo+path,method,headers:{'Authorization':'Bearer '+fields.password,'User-Agent':'repository-sync','Accept':'application/vnd.github+json',...(data?{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}:{})}},res=>{
   let raw='';res.on('data',c=>raw+=c);res.on('end',()=>{let json;try{json=JSON.parse(raw)}catch{reject(Error('Invalid API response'));return;}if(res.statusCode>=300)reject(Error('GitHub API '+res.statusCode+': '+json.message));else resolve(json);});
  });req.setTimeout(30000,()=>req.destroy(Error('API timeout')));req.on('error',reject);req.end(data);
 });
 const remote=(await api('/git/ref/heads/main')).object.sha;
 const head=git('rev-parse','HEAD').toString().trim();
 if(remote===head){console.log('Already synchronized: '+head);return;}
 git('merge-base','--is-ancestor',remote,head);
 console.log('Verified fast-forward: '+remote.slice(0,7)+' -> '+head.slice(0,7));
 const ids=git('rev-list','--objects',head,'^'+remote).toString().trim().split('\n').map(l=>l.split(' ')[0]);
 const fresh=new Set(ids),done=new Set();
 const date=(ts,zone)=>{const offset=(zone[0]==='-'?-1:1)*(Number(zone.slice(1,3))*60+Number(zone.slice(3)));return new Date((Number(ts)+offset*60)*1000).toISOString().slice(0,19)+zone.slice(0,3)+':'+zone.slice(3);};
 const person=line=>{const m=line.match(/^(.*) <(.*)> (\d+) ([+-]\d{4})$/);if(!m)throw Error('Unsupported commit identity');return {name:m[1],email:m[2],date:date(m[3],m[4])};};
 async function upload(id){
  if(done.has(id)||!fresh.has(id))return;
  const type=git('cat-file','-t',id).toString().trim();let result;
  if(type==='blob')result=await api('/git/blobs',{content:git('cat-file','blob',id).toString('base64'),encoding:'base64'});
  else if(type==='tree'){
   const entries=git('ls-tree','-z',id).toString().split('\0').filter(Boolean).map(l=>{const m=l.match(/^(\d+) (\w+) ([a-f0-9]+)\t([\s\S]+)$/);return {mode:m[1].padStart(6,'0'),type:m[2],sha:m[3],path:m[4]};});
   for(const entry of entries)await upload(entry.sha);
   result=await api('/git/trees',{tree:entries});
  }else if(type==='commit'){
   const raw=git('cat-file','commit',id).toString();const split=raw.indexOf('\n\n');const headers=raw.slice(0,split).split('\n');
   if(headers.some(l=>/^(gpgsig|encoding|mergetag) /.test(l)))throw Error('Unsupported commit metadata; stopped to preserve history');
   const tree=headers.find(l=>l.startsWith('tree ')).slice(5);const parents=headers.filter(l=>l.startsWith('parent ')).map(l=>l.slice(7));
   for(const parent of parents)await upload(parent);await upload(tree);
   result=await api('/git/commits',{message:raw.slice(split+2),tree,parents,author:person(headers.find(l=>l.startsWith('author ')).slice(7)),committer:person(headers.find(l=>l.startsWith('committer ')).slice(10))});
  }else throw Error('Unsupported object type '+type);
  if(result.sha!==id)throw Error('Object identity mismatch for '+type+'; branch left unchanged');
  done.add(id);console.log('Verified '+type+' '+id.slice(0,7));
 }
 await upload(head);
 const latest=(await api('/git/ref/heads/main')).object.sha;if(latest!==remote)throw Error('Remote changed during sync; branch left unchanged');
 await api('/git/refs/heads/main',{sha:head,force:false},'PATCH');
 const final=(await api('/git/ref/heads/main')).object.sha;if(final!==head)throw Error('Remote verification failed');
 console.log('SUCCESS: GitHub main matches local HEAD '+head);
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
