/**
 * Upload a file to Arweave (arweave.net). Used by .github/workflows/arweave-publish.yml.
 *
 * Env:
 *   ARWEAVE_WALLET_KEY — JWK JSON string (GitHub secret).
 *   EXPECTED_ARWEAVE_ADDRESS — optional; if set, must match the address derived from the JWK.
 *   GITHUB_OUTPUT — set by Actions; tx_id is written for downstream steps.
 */
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import Arweave from 'arweave';

const filePath = resolve(process.argv[2] ?? '');
if (!process.argv[2] || !existsSync(filePath)) {
  console.error('Usage: node scripts/permaweb-upload.mjs <path-to-file>');
  process.exit(1);
}

const keyJson = process.env.ARWEAVE_WALLET_KEY;
if (!keyJson || keyJson.trim() === '') {
  console.error('ARWEAVE_WALLET_KEY is missing or empty (add repo secret).');
  process.exit(1);
}

let key;
try {
  key = JSON.parse(keyJson);
} catch {
  console.error('ARWEAVE_WALLET_KEY must be valid JSON (Arweave JWK).');
  process.exit(1);
}

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

const derived = await arweave.wallets.jwkToAddress(key);
const expected = process.env.EXPECTED_ARWEAVE_ADDRESS;
if (expected && derived !== expected) {
  console.error(
    `Wallet JWK maps to ${derived}, but EXPECTED_ARWEAVE_ADDRESS is ${expected}.`,
  );
  process.exit(1);
}

// Copy into a plain Uint8Array (Buffer subclasses Uint8Array but be explicit).
const data = new Uint8Array(readFileSync(filePath));
const tx = await arweave.createTransaction({ data }, key);
tx.addTag('Content-Type', 'text/markdown; charset=UTF-8');
tx.addTag('App-Name', 'swarm-orchestration-spec');

// Arweave expects RSA-PSS with a 32-byte salt; Node's default salt length can differ
// and gateways return "Transaction verification failed" (400).
await arweave.transactions.sign(tx, key, { saltLength: 32 });

const locallyOk = await arweave.transactions.verify(tx);
if (!locallyOk) {
  console.error('Local signature verify failed; check JWK and arweave-js version.');
  process.exit(1);
}

const response = await arweave.transactions.post(tx);

if (response.status !== 200 && response.status !== 208) {
  const body =
    typeof response.data === 'object'
      ? JSON.stringify(response.data)
      : String(response.data);
  console.error('Arweave POST failed:', response.status, response.statusText, body);
  process.exit(1);
}

console.log('Arweave txId:', tx.id);
const ghOut = process.env.GITHUB_OUTPUT;
if (ghOut) {
  appendFileSync(ghOut, `tx_id=${tx.id}\n`);
}
