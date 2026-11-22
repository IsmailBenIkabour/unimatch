import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = path.join(root, 'src', 'data', 'grados.json');
const degrees = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const errors = [];
const warnings = [];
const seen = new Set();
const required = ['id', 'slug', 'nombre', 'rama', 'universidad', 'universidadSlug', 'ciudad'];

if (!Array.isArray(degrees)) errors.push('grados.json debe contener un array.');
else {
  degrees.forEach((degree, index) => {
    const label = `Registro ${index + 1}${degree?.nombre ? ` (${degree.nombre})` : ''}`;
    if (!degree || typeof degree !== 'object') { errors.push(`${label}: no es un objeto.`); return; }
    for (const key of required) {
      if (typeof degree[key] !== 'string' || !degree[key].trim()) errors.push(`${label}: falta '${key}'.`);
    }
    const key = degree.id || degree.slug;
    if (key && seen.has(key)) errors.push(`${label}: ID/slug duplicado '${key}'.`);
    if (key) seen.add(key);
    if (degree.notaCorte2026 != null && (!Number.isFinite(degree.notaCorte2026) || degree.notaCorte2026 < 0 || degree.notaCorte2026 > 14)) errors.push(`${label}: notaCorte2026 debe estar entre 0 y 14.`);
    if (degree.plazas != null && (!Number.isFinite(degree.plazas) || degree.plazas <= 0)) errors.push(`${label}: plazas debe ser un número positivo.`);
    if (degree.empleabilidad != null && (!Number.isFinite(degree.empleabilidad) || degree.empleabilidad < 0 || degree.empleabilidad > 100)) errors.push(`${label}: empleabilidad debe estar entre 0 y 100.`);
    if (degree.precioCredito != null && (!Number.isFinite(degree.precioCredito) || degree.precioCredito <= 0)) errors.push(`${label}: precioCredito debe ser positivo.`);
    for (const field of ['salidas', 'idiomas', 'ponderaciones', 'porQueEstudiarlo']) if (degree[field] != null && !Array.isArray(degree[field])) errors.push(`${label}: '${field}' debe ser un array.`);
    for (const field of ['notaCorte2026', 'plazas', 'precioCredito', 'empleabilidad']) if (degree[field] == null) warnings.push(`${label}: '${field}' no informado.`);
  });
}
console.log(`Catálogo revisado: ${degrees.length} registros.`);
if (warnings.length) { console.warn(`\nAvisos (${warnings.length}):`); warnings.forEach(x => console.warn(' - ' + x)); }
if (errors.length) { console.error(`\nERRORES (${errors.length}):`); errors.forEach(x => console.error(' - ' + x)); process.exitCode = 1; }
else console.log('\nNo se encontraron errores estructurales. (Esto no verifica la exactitud de las fuentes de datos.)');
