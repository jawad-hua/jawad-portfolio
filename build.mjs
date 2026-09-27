import {cp,mkdir,readFile,writeFile} from 'node:fs/promises';
const value=process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
if(!value) throw new Error('Set SITE_URL to your actual public origin, or enable Vercel System Environment Variables.');
const url=new URL(value.includes('://')?value:`https://${value}`);
if(url.protocol!=='https:' || url.username || url.password || url.search || url.hash || url.pathname!=='/') throw new Error('SITE_URL must be an HTTPS origin without a path, credentials or query.');
const origin=url.origin;
const previous='https://muhammad-jawad-portfolio.jawadmjawad06.chatgpt.site';
await mkdir('public',{recursive:true});await cp('site','public',{recursive:true});
for(const file of ['index.html','robots.txt','sitemap.xml']){
 let content=await readFile(`public/${file}`,'utf8');
 content=content.replaceAll(previous,origin);
 if(process.env.VERCEL_ENV && process.env.VERCEL_ENV!=='production'){
  if(file==='index.html')content=content.replace('content="index, follow"','content="noindex, nofollow"');
  if(file==='robots.txt')content='User-agent: *\nDisallow: /\n';
 }
 await writeFile(`public/${file}`,content);
}
console.log(`Built portfolio for ${origin}`);
