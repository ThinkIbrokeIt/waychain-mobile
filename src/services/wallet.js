// WayChain wallet core — REAL implementation
// EOA = Ed25519. Address = hex(publicKey) (64 hex chars), per WayChain chain source.
// Mnemonic = BIP39. Seed (first 32 bytes) feeds Ed25519 (SHA512-based derivation).
// NOTE: WayChain uses sha256 for hashing/selectors, NOT keccak256 (except cross-chain attestation storage).
// RNG/crypto under Hermes is polyfilled in src/services/polyfills.js (imported first in index.js).
import * as SecureStore from 'expo-secure-store';
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { getPublicKeyAsync, signAsync } from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512';

export const ACCOUNTS_KEY = 'waychain.accounts.v1';

export function newMnemonic(words = 12) {
  const strength = words === 24 ? 256 : 128;
  return generateMnemonic(wordlist, strength);
}

export function isValidMnemonic(m) {
  return validateMnemonic(m.trim(), wordlist);
}

// Derive Ed25519 keypair from a BIP39 mnemonic.
// Ed25519 seed = first 32 bytes of the BIP39 seed (standard ed25519 HD practice).
export async function deriveFromMnemonic(mnemonic) {
  const seed = mnemonicToSeedSync(mnemonic.trim());
  const priv = seed.slice(0, 32); // 32-byte Ed25519 seed
  const pub = await getPublicKeyAsync(priv);
  return {
    mnemonic: mnemonic.trim(),
    privateKey: '0x' + Buffer.from(priv).toString('hex'),
    publicKey: '0x' + Buffer.from(pub).toString('hex'),
    address: '0x' + Buffer.from(pub).toString('hex'),
  };
}

// Derive directly from a raw private key (hex, 32 bytes / 64 hex chars, optional 0x).
export async function deriveFromPrivateKey(privateKeyHex) {
  let hex = privateKeyHex.replace(/^0x/, '').trim();
  if (hex.length === 128) {
    // 64-byte form could be priv||pub or just priv; assume first 32 bytes are priv
    hex = hex.slice(0, 64);
  }
  if (hex.length !== 64) throw new Error('Private key must be 32 bytes (64 hex chars)');
  const priv = Buffer.from(hex, 'hex');
  const pub = await getPublicKeyAsync(priv);
  return {
    privateKey: '0x' + Buffer.from(priv).toString('hex'),
    publicKey: '0x' + Buffer.from(pub).toString('hex'),
    address: '0x' + Buffer.from(pub).toString('hex'),
  };
}

// Sign arbitrary message bytes with the private key. Returns 64-byte sig (hex).
export async function sign(privateKeyHex, messageBytes) {
  const priv = Buffer.from(privateKeyHex.replace(/^0x/, ''), 'hex');
  const sig = await signAsync(messageBytes, priv);
  return '0x' + Buffer.from(sig).toString('hex');
}

// ---- SecureStore-backed multi-account persistence ----

export async function loadAccounts() {
  try {
    const raw = await SecureStore.getItemAsync(ACCOUNTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveAccounts(accounts) {
  await SecureStore.setItemAsync(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export async function addAccount(account) {
  const accounts = await loadAccounts();
  // avoid duplicates by address
  if (accounts.find(a => a.address === account.address)) return accounts;
  const next = [...accounts, account];
  await saveAccounts(next);
  return next;
}

export async function createAccount(words = 12) {
  const mnemonic = newMnemonic(words);
  const derived = await deriveFromMnemonic(mnemonic);
  const account = { ...derived, label: 'Account ' + ((await loadAccounts()).length + 1), createdAt: Date.now() };
  await addAccount(account);
  return account;
}

export async function importMnemonic(mnemonic) {
  if (!isValidMnemonic(mnemonic)) throw new Error('Invalid recovery phrase');
  const derived = await deriveFromMnemonic(mnemonic);
  const account = { ...derived, label: 'Account ' + ((await loadAccounts()).length + 1), createdAt: Date.now() };
  await addAccount(account);
  return account;
}

export async function importPrivateKey(privateKeyHex) {
  const derived = await deriveFromPrivateKey(privateKeyHex);
  const account = { ...derived, label: 'Account ' + ((await loadAccounts()).length + 1), createdAt: Date.now() };
  await addAccount(account);
  return account;
}

// Namespace export for convenient import { wallet }
export const wallet = {
  newMnemonic,
  isValidMnemonic,
  deriveFromMnemonic,
  deriveFromPrivateKey,
  sign,
  loadAccounts,
  saveAccounts,
  addAccount,
  createAccount,
  importMnemonic,
  importPrivateKey,
};
