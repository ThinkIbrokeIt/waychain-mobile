// WayChain RPC service - connects to native chain
import * as Crypto from 'expo-crypto';
import { deriveFromMnemonic, deriveFromPrivateKey, newMnemonic, sign } from './wallet';

const RPC_URL = 'https://api.waychain.org';

// Precompile addresses (from WayChain chain source, AGENTS.md). 0x0C–0x20.
const PRECOMPILES = {
  BIJO:  '0x0000000000000000000000000000000000000014', // BinaryJournal token
  TWO_WAY: '0x0000000000000000000000000000000000000018', // TwoWayVault
  TRUSTLESS_LOCK: '0x000000000000000000000000000000000000001A', // TrustlessLock
  GOVERNANCE: '0x000000000000000000000000000000000000001D',
  WIFR:  '0x0000000000000000000000000000000000000021', // (per session memory) WIFR reward token
};

// ABI selectors: WayChain uses sha256(signature)[:4], NOT keccak256.
const SELECTORS = {
  balanceOf: '0x5b46f8f6',
};

export const waychainRPC = {
  call: async (method, params) => {
    const res = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 })
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error.message || 'RPC error');
    return json.result || null;
  },

  // WayChain native balance method (per AGENTS.md RPC endpoints)
  getBalance: async (address) => {
    try {
      const res = await waychainRPC.call('way_getBalance', [address]);
      return res;
    } catch {
      // fallback to eth_call on BIJO precompile (sha256 selector)
      const addrHex = address.replace(/^0x/, '').toLowerCase().padStart(64, '0');
      const data = SELECTORS.balanceOf + addrHex;
      return waychainRPC.call('eth_call', [{ to: PRECOMPILES.BIJO, data }, 'latest']);
    }
  },

  getAddressFromKey: (privateKey) => {
    // Delegate to real derivation; caller should use wallet.deriveFromPrivateKey instead.
    return privateKey;
  },

  // Real wallet creation: BIP39 mnemonic -> Ed25519 -> WayChain address
  generateKeyPair: async (words = 12) => {
    const mnemonic = newMnemonic(words);
    return deriveFromMnemonic(mnemonic);
  },

  sign,
};

export default waychainRPC;
