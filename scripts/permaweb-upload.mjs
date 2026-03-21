/**
 * Upload a file to Arweave. Used by .github/workflows/arweave-publish.yml.
 *
 * Env:
 *   ARWEAVE_WALLET_KEY — JWK JSON string (GitHub secret). BOM / outer quotes stripped.
 *   EXPECTED_ARWEAVE_ADDRESS — optional; if set, must match the address derived from the JWK.
 *   ARWEAVE_HOST — optional gateway hostname (default: ar-io.net).
 *   GITHUB_OUTPUT — set by Actions; tx_id is written for downstream steps.
 *
 * Tries ar-io.net first (recommended in current tooling docs), then arweave.net, and
 * retries PSS salt lengths 32 and RSA-max for 4096-bit keys. Node-local verify can pass
 * while gateways reject; multiple combinations match what different verifiers expect.
 */
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import Arweave from 'arweave';

function parseWalletKey(raw) {
  let s = raw.replace(/^\uFEFF/, '').trim();
  if (
    (s.startsWith("'") && s.endsWith("'")) ||
    (s.startsWith('"') && s.endsWith('"'))
  ) {
    s = s.slice(1, -1);
  }
  return JSON.parse(s);
}

/** Max EMSA-PSS salt length (bytes) for RSA modulus length and SHA-256. */
function maxPssSaltBytes(modulusNBase64Url) {
  const buf = Arweave.utils.b64UrlToBuffer(modulusNBase64Url);
  const emLen = buf.length;
  const hLen = 32; // SHA-256
  return Math.max(0, emLen - hLen - 2);
}

function makeArweave(host) {
  return Arweave.init({
    host,
    port: 443,
    protocol: 'https',
  });
}

async function buildAndSignTx(arweave, data, key, saltLength) {
  const tx = await arweave.createTransaction({ data }, key);
  tx.addTag('Content-Type', 'text/markdown; charset=UTF-8');
  tx.addTag('App-Name', 'swarm-orchestration-spec');
  await arweave.transactions.sign(tx, key, { saltLength });
  const ok = await arweave.transactions.verify(tx);
  if (!ok) {
    return null;
  }
  return tx;
}

const filePath = resolve(process.argv[2] ?? '');
if (!process.argv[2] || !existsSync(filePath)) {
  console.error('Usage: node scripts/permaweb-upload.mjs <path-to-file>');
  process.exit(1);
}

const keyRaw = process.env.ARWEAVE_WALLET_KEY;
if (!keyRaw || keyRaw.trim() === '') {
  console.error('ARWEAVE_WALLET_KEY is missing or empty (add repo secret).');
  process.exit(1);
}

let key;
try {
  key = parseWalletKey(keyRaw);
} catch {
  console.error(
    'ARWEAVE_WALLET_KEY must be valid JSON (Arweave JWK). Strip BOM and outer quotes if pasted from an editor.',
  );
  process.exit(1);
}

const primaryHost = process.env.ARWEAVE_HOST || 'ar-io.net';
const hosts = [...new Set([primaryHost, 'ar-io.net', 'arweave.net'])];
const saltLengths = [
  32,
  maxPssSaltBytes(key.n),
].filter((n, i, a) => a.indexOf(n) === i && n >= 0);

const data = new Uint8Array(readFileSync(filePath));

const ar0 = makeArweave(hosts[0]);
const derived = await ar0.wallets.jwkToAddress(key);
const expected = process.env.EXPECTED_ARWEAVE_ADDRESS;
if (expected && derived !== expected) {
  console.error(
    `Wallet JWK maps to ${derived}, but EXPECTED_ARWEAVE_ADDRESS is ${expected}.`,
  );
  process.exit(1);
}

try {
  const bal = await ar0.wallets.getBalance(derived);
  console.log('Wallet balance (winston):', bal);
} catch (e) {
  console.warn('Could not fetch wallet balance:', e?.message ?? e);
}

let lastErr = '';
for (const host of hosts) {
  const arweave = makeArweave(host);
  for (const saltLength of saltLengths) {
    const tx = await buildAndSignTx(arweave, data, key, saltLength);
    if (!tx) {
      lastErr = `local verify failed (host=${host} salt=${saltLength})`;
      continue;
    }
    const response = await arweave.transactions.post(tx);
    if (response.status === 200 || response.status === 208) {
      console.log(`Posted via ${host} (PSS salt ${saltLength} bytes)`);
      console.log('Arweave txId:', tx.id);
      const ghOut = process.env.GITHUB_OUTPUT;
      if (ghOut) {
        appendFileSync(ghOut, `tx_id=${tx.id}\n`);
      }
      process.exit(0);
    }
    const body =
      typeof response.data === 'object'
        ? JSON.stringify(response.data)
        : String(response.data);
    lastErr = `${host} salt=${saltLength}: ${response.status} ${body}`;
    console.warn('Attempt failed:', lastErr);
  }
}

console.error('Arweave POST failed after all attempts. Last:', lastErr);
process.exit(1);
