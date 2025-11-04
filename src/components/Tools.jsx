import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Link as LinkIcon, Sigma, Type } from "lucide-react";

// Simple Base58 implementation (no external deps)
const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const ALPHABET_MAP = new Map(ALPHABET.split("").map((c, i) => [c, i]));

function toBytes(str) {
  return new TextEncoder().encode(str);
}

function fromBytes(bytes) {
  return new TextDecoder().decode(bytes);
}

function base58Encode(input) {
  const source = typeof input === "string" ? toBytes(input) : input;
  if (!source.length) return "";
  let digits = [0];
  for (let i = 0; i < source.length; i++) {
    let carry = source[i];
    for (let j = 0; j < digits.length; j++) {
      const x = digits[j] * 256 + carry;
      digits[j] = x % 58;
      carry = (x / 58) | 0;
    }
    while (carry) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  // handle leading zeros
  let zeros = 0;
  for (let k = 0; k < source.length && source[k] === 0; k++) zeros++;
  let out = "";
  for (let q = 0; q < zeros; q++) out += "1";
  for (let p = digits.length - 1; p >= 0; p--) out += ALPHABET[digits[p]];
  return out;
}

function base58Decode(str) {
  if (!str) return new Uint8Array();
  let bytes = [0];
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    const value = ALPHABET_MAP.get(c);
    if (value === undefined) throw new Error("Invalid Base58 character");
    let carry = value;
    for (let j = 0; j < bytes.length; j++) {
      const x = bytes[j] * 58 + carry;
      bytes[j] = x & 0xff;
      carry = x >> 8;
    }
    while (carry) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  // handle leading zeros
  let zeros = 0;
  for (let k = 0; k < str.length && str[k] === "1"; k++) zeros++;
  for (let q = 0; q < zeros; q++) bytes.push(0);
  return new Uint8Array(bytes.reverse());
}

function AddressValidator() {
  const [address, setAddress] = useState("");
  const result = useMemo(() => {
    if (!address) return null;
    // Basic Solana address validation: base58 charset + typical length 32-44 bytes
    const validChars = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;
    const isCharsetOk = validChars.test(address);
    const isLengthOk = address.length >= 32 && address.length <= 44;
    let checksumOk = false;
    if (isCharsetOk && isLengthOk) {
      try {
        // Attempt base58 decode as a lightweight sanity check
        const bytes = base58Decode(address);
        checksumOk = bytes.length >= 32 && bytes.length <= 64; // public keys are 32 bytes
      } catch {
        checksumOk = false;
      }
    }
    const ok = isCharsetOk && isLengthOk && checksumOk;
    return ok;
  }, [address]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Address Validator</h3>
        {result !== null && (
          <span className={`inline-flex items-center gap-1 text-sm ${result ? "text-emerald-600" : "text-rose-600"}`}>
            <CheckCircle2 className={`h-4 w-4 ${result ? "text-emerald-600" : "text-rose-600"}`} />
            {result ? "Valid" : "Invalid"}
          </span>
        )}
      </div>
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value.trim())}
        placeholder="Enter a Solana address (base58)"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <p className="mt-2 text-xs text-gray-500">Checks characters, length, and base58 decodability.</p>
    </div>
  );
}

function LamportsConverter() {
  const [sol, setSol] = useState("");
  const [lamports, setLamports] = useState("");
  const LAMPORTS_PER_SOL = 1_000_000_000;

  const onSolChange = (v) => {
    setSol(v);
    const num = Number(v);
    if (!isNaN(num)) setLamports(String(Math.floor(num * LAMPORTS_PER_SOL)));
    else setLamports("");
  };
  const onLamportsChange = (v) => {
    setLamports(v);
    const num = Number(v);
    if (!isNaN(num)) setSol(String(num / LAMPORTS_PER_SOL));
    else setSol("");
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-3">SOL ⇄ Lamports</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600">SOL</label>
          <input
            value={sol}
            onChange={(e) => onSolChange(e.target.value)}
            placeholder="e.g., 0.25"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">Lamports</label>
          <input
            value={lamports}
            onChange={(e) => onLamportsChange(e.target.value)}
            placeholder="e.g., 250000000"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500">1 SOL = 1,000,000,000 lamports</p>
    </div>
  );
}

function Base58Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("encode");
  const [copied, setCopied] = useState(false);

  const run = () => {
    try {
      if (mode === "encode") {
        setOutput(base58Encode(input));
      } else {
        const bytes = base58Decode(input);
        setOutput(fromBytes(bytes));
      }
    } catch (e) {
      setOutput(`Error: ${e.message}`);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Base58 {mode === "encode" ? "Encoder" : "Decoder"}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode("encode")}
            className={`px-3 py-1.5 text-xs rounded-md ring-1 ring-inset ${mode === "encode" ? "bg-emerald-600 text-white ring-emerald-600" : "bg-white text-gray-700 ring-gray-300"}`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-3 py-1.5 text-xs rounded-md ring-1 ring-inset ${mode === "decode" ? "bg-emerald-600 text-white ring-emerald-600" : "bg-white text-gray-700 ring-gray-300"}`}
          >
            Decode
          </button>
        </div>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "encode" ? "Type or paste text to encode to Base58" : "Paste Base58 to decode"}
        className="w-full h-28 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <div className="mt-3 flex items-center gap-2">
        <button onClick={run} className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white px-3 py-2 text-sm shadow-sm hover:bg-gray-800">
          <Sigma className="h-4 w-4" />
          Run
        </button>
        <button onClick={copy} className="inline-flex items-center gap-2 rounded-md bg-white text-gray-900 px-3 py-2 text-sm shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50">
          <Copy className="h-4 w-4" />
          Copy output
        </button>
      </div>
      <div className="mt-3">
        <label className="text-xs text-gray-600">Output</label>
        <textarea
          readOnly
          value={output}
          className="mt-1 w-full h-28 rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50"
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">Text is encoded/decoded using UTF-8 bytes before Base58 transformation.</p>
    </div>
  );
}

function QuickLinks() {
  const items = [
    { label: "Solana Explorer", href: "https://explorer.solana.com/", icon: LinkIcon },
    { label: "RPC Status", href: "https://status.solana.com/", icon: LinkIcon },
    { label: "JSON RPC Docs", href: "https://solana.com/docs/rpc", icon: LinkIcon },
    { label: "Token List", href: "https://token-list.solana.com/", icon: LinkIcon },
  ];
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((it) => (
          <li key={it.href}>
            <a
              href={it.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-md px-3 py-2 ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
            >
              <span className="flex items-center gap-2 text-sm text-gray-800">
                <it.icon className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                {it.label}
              </span>
              <Type className="h-4 w-4 text-gray-400" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Tools() {
  return (
    <section id="tools" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AddressValidator />
          <LamportsConverter />
          <Base58Tool />
        </div>
        <div className="lg:col-span-1">
          <QuickLinks />
        </div>
      </div>
    </section>
  );
}
