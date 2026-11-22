import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync(new URL('../src/data/grados.json', import.meta.url),'utf8'));
if(!Array.isArray(data)){console.error('El catálogo no es una lista');process.exit(1)}
const tally=(key)=>Object.entries(data.reduce((a,g)=>{const v=String(g?.[key]??'Sin dato').trim()||'Sin dato';a[v]=(a[v]||0)+1;return a},{})).sort((a,b)=>b[1]-a[1]);
const missing=(key)=>data.filter(g=>g?.[key]==null||g[key]===''||(Array.isArray(g[key])&&!g[key].length)).length;
console.log(`\nCATÁLOGO: ${data.length} registros (NO equivale a oferta oficial completa)\n`);
for(const field of ['universidad','rama','ciudad']){console.log(field.toUpperCase());for(const [name,n] of tally(field))console.log(`  ${name}: ${n}`);console.log('')}
console.log('CAMPOS SIN INFORMAR');for(const field of ['notaCorte2026','plazas','precioCredito','empleabilidad','ponderaciones','idiomas','salidas','campus'])console.log(`  ${field}: ${missing(field)}`);
const dupe=(key)=>{const seen=new Set(),repeat=new Set();for(const g of data){const value=g?.[key];if(!value)continue;if(seen.has(value))repeat.add(value);seen.add(value)}return [...repeat]};
for(const key of ['id','slug'])console.log(`Duplicados ${key}: ${dupe(key).join(', ')||'ninguno'}`);
console.log('\nAVISO: auditoría de estructura/cobertura. No confirma exactitud, vigencia ni procedencia de las cifras.');
