// WayChain RPC service - connects to native chain
const RPC_URL = 'https://api.waychain.org';

// Precompile addresses (hex, 40-char padded)
const PRECOMPILES = {
  BIJO: '0x0000000000000000000000000000000000000014',
  WAY:  '0x0000000000000000000000000000000000000003',
};

// ABI selectors (first 4 bytes of sha256 — WayChain uses SHA256, not keccak256)
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
    return json.result || null;
  },

  getBalance: async (address, token = 'WAY') => {
    const precompile = token === 'WAY' ? PRECOMPILES.WAY : PRECOMPILES.BIJO;
    const addrHex = address.replace(/^0x/, '').toLowerCase().padStart(64, '0');
    const data = SELECTORS.balanceOf + addrHex;
    return waychainRPC.call('eth_call', [{ to: precompile, data }, 'latest']);
  },

  getAddressFromKey: (privateKey) => {
    return '0x' + privateKey.slice(-40);
  },

  generateKeyPair: async () => {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    const privateKey = '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const words = ['abandon', 'ability', 'able', 'about', 'above', 'absent', 
                   'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident'];
    return { mnemonic: words.join(' '), privateKey };
  }
};

export default waychainRPC;