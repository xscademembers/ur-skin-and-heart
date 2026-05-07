import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, 'data');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

function filePath(name) {
    return path.join(dataDir, `${name}.json`);
}

function readAll(name) {
    const fp = filePath(name);
    if (!fs.existsSync(fp)) return [];
    try {
        const raw = fs.readFileSync(fp, 'utf8');
        return raw ? JSON.parse(raw) : [];
    } catch (err) {
        console.error(`Failed reading ${name}.json:`, err.message);
        return [];
    }
}

function writeAll(name, items) {
    fs.writeFileSync(filePath(name), JSON.stringify(items, null, 2), 'utf8');
}

function genId() {
    return crypto.randomBytes(12).toString('hex');
}

export function list(name) {
    const items = readAll(name);
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getById(name, id) {
    return readAll(name).find(item => item._id === id) || null;
}

export function create(name, data) {
    const items = readAll(name);
    const item = {
        _id: genId(),
        ...data,
        createdAt: new Date().toISOString(),
    };
    items.push(item);
    writeAll(name, items);
    return item;
}

export function remove(name, id) {
    const items = readAll(name);
    const idx = items.findIndex(item => item._id === id);
    if (idx === -1) return null;
    const [removed] = items.splice(idx, 1);
    writeAll(name, items);
    return removed;
}

export function update(name, id, patch) {
    const items = readAll(name);
    const idx = items.findIndex(item => item._id === id);
    if (idx === -1) return null;
    const current = items[idx];
    const updated = {
        ...current,
        ...patch,
        _id: current._id,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString(),
    };
    items[idx] = updated;
    writeAll(name, items);
    return updated;
}
