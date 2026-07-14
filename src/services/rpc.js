// WayChain RPC service - connects to native chain
import * as Crypto from 'expo-crypto';
import { deriveFromMnemonic, deriveFromPrivateKey, newMnemonic, sign } from './wallet';

const RPC_URL = 'https://api.waychain.org';

// Decode a 0x-hex bigint string ("0x1a2b") → JS number (safe for UI display
// of counts/totals that fit in a double. Returns 0 on empty/invalid.
export const hexToNum = (hex) => {
  if (!hex || hex === '0x' || hex === '0x0') return 0;
  try {
    const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
    // Use BigInt then Number for display; values here are small counts/wei-totals.
    return Number(BigInt('0x' + clean));
  } catch {
    return 0;
  }
};

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
      body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error.message || 'RPC error');
    return json.result ?? null;
  },

  // Wallet P3 panel reads. These call the read-only way_* methods added to
  // waychain-consensus (rpc.go). They throw if the live RPC lacks the method,
  // so callers can fall back to the honest FeaturePending panel.
  getGovernanceProposals: async () => {
    const r = await waychainRPC.call('way_govProposals', []);
    return Array.isArray(r) ? r : [];
  },
  getTwoWayStats: async () => {
    const r = await waychainRPC.call('way_twoWayStats', []);
    if (!r || typeof r !== 'object') throw new Error('no twoWayStats');
    return {
      vaults: hexToNum(r.vaults),
      totalDebt: hexToNum(r.totalDebt),
    };
  },
  getBridgeStats: async () => {
    const r = await waychainRPC.call('way_bridgeStats', []);
    if (!r || typeof r !== 'object') throw new Error('no bridgeStats');
    return {
      committed: hexToNum(r.committed),
      withdrawn: hexToNum(r.withdrawn),
    };
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
