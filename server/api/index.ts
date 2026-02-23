import express, { Request, Response } from "express";
import cors from "cors";

// Inline the RPC helper to avoid import resolution issues in Vercel
const BASE_RPC_URL = "https://mainnet.base.org";

async function rpcCall(method: string, params: any[] = []): Promise<any> {
  const response = await fetch(BASE_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const data = (await response.json()) as any;
  if (data.error) throw new Error(`RPC error: ${data.error.message}`);
  return data.result;
}

function hexToEth(hexWei: string): string {
  return (Number(BigInt(hexWei)) / 1e18).toFixed(6);
}
function hexToUsdc(hexAmount: string): string {
  return (Number(BigInt(hexAmount)) / 1e6).toFixed(2);
}
function hexToNumber(hex: string): number {
  return Number(BigInt(hex));
}

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

const TOKEN_MAP: Record<string, { address: string; decimals: number; name: string; priceUsd: number }> = {
  ETH:  { address: "0x0000000000000000000000000000000000000000", decimals: 18, name: "Ethereum", priceUsd: 2800 },
  WETH: { address: "0x4200000000000000000000000000000000000006", decimals: 18, name: "Wrapped Ether", priceUsd: 2800 },
  USDC: { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6, name: "USD Coin", priceUsd: 1.0 },
  USDT: { address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2", decimals: 6, name: "Tether USD", priceUsd: 1.0 },
  DAI:  { address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", decimals: 18, name: "Dai Stablecoin", priceUsd: 1.0 },
};

// ─── Handlers ──────────────────────────────────────────

async function portfolioHandler(req: Request, res: Response) {
  const { address } = req.params;
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address))
    return res.status(400).json({ error: "Invalid Ethereum address" });
  try {
    const [ethHex, usdcHex, txHex] = await Promise.all([
      rpcCall("eth_getBalance", [address, "latest"]),
      rpcCall("eth_call", [{ to: USDC_ADDRESS, data: "0x70a08231000000000000000000000000" + address.slice(2).toLowerCase() }, "latest"]),
      rpcCall("eth_getTransactionCount", [address, "latest"]),
    ]);
    const ethBalance = hexToEth(ethHex);
    const usdcBalance = hexToUsdc(usdcHex || "0x0");
    const txCount = hexToNumber(txHex);
    const labels: string[] = [];
    if (txCount > 1000) labels.push("power-user");
    if (txCount > 100) labels.push("active");
    if (parseFloat(ethBalance) > 10) labels.push("whale");
    if (parseFloat(usdcBalance) > 10000) labels.push("stablecoin-holder");
    if (txCount === 0) labels.push("empty");
    res.json({ address, ethBalance, usdcBalance, txCount, labels, network: "base", timestamp: new Date().toISOString() });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
}

async function riskHandler(req: Request, res: Response) {
  const { address } = req.params;
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address))
    return res.status(400).json({ error: "Invalid Ethereum address" });
  try {
    const [txHex, code, blockHex] = await Promise.all([
      rpcCall("eth_getTransactionCount", [address, "latest"]),
      rpcCall("eth_getCode", [address, "latest"]),
      rpcCall("eth_blockNumber"),
    ]);
    const txCount = hexToNumber(txHex);
    const isContract = code !== "0x" && code !== "0x0" && code.length > 2;
    let activityLevel: string = txCount === 0 ? "none" : txCount < 10 ? "low" : txCount < 100 ? "medium" : txCount < 1000 ? "high" : "very-high";
    let riskScore = 50;
    const flags: string[] = [];
    if (isContract) { riskScore += 15; flags.push("contract-address"); }
    if (txCount === 0) { riskScore += 25; flags.push("no-transactions"); }
    else if (txCount < 5) { riskScore += 15; flags.push("very-low-activity"); }
    else if (txCount > 100) riskScore -= 20;
    else if (txCount > 10) riskScore -= 10;
    riskScore = Math.max(0, Math.min(100, riskScore));
    res.json({ address, riskScore, isContract, txCount, activityLevel, flags, latestBlock: hexToNumber(blockHex), network: "base", timestamp: new Date().toISOString() });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
}

async function gasHandler(_req: Request, res: Response) {
  try {
    const [gasPriceHex, feeHistory] = await Promise.all([
      rpcCall("eth_gasPrice"),
      rpcCall("eth_feeHistory", ["0x5", "latest", [25, 50, 75]]),
    ]);
    const gasPrice = hexToNumber(gasPriceHex);
    const baseFee = feeHistory.baseFeePerGas ? hexToNumber(feeHistory.baseFeePerGas[feeHistory.baseFeePerGas.length - 1]) : gasPrice;
    const rewards = feeHistory.reward || [];
    let slow = 0, standard = 0, fast = 0;
    if (rewards.length > 0) {
      const avg = (arr: number[]) => arr.length ? arr.reduce((a: number, b: number) => a + b, 0) / arr.length : 0;
      const s: number[] = [], m: number[] = [], f: number[] = [];
      for (const block of rewards) { if (block[0]) s.push(hexToNumber(block[0])); if (block[1]) m.push(hexToNumber(block[1])); if (block[2]) f.push(hexToNumber(block[2])); }
      slow = baseFee + avg(s); standard = baseFee + avg(m); fast = baseFee + avg(f);
    } else { slow = gasPrice * 0.9; standard = gasPrice; fast = gasPrice * 1.2; }
    const toGwei = (wei: number) => (wei / 1e9).toFixed(4);
    res.json({ slow: { gwei: toGwei(slow), wei: Math.round(slow) }, standard: { gwei: toGwei(standard), wei: Math.round(standard) }, fast: { gwei: toGwei(fast), wei: Math.round(fast) }, baseFee: { gwei: toGwei(baseFee), wei: baseFee }, currentGasPrice: { gwei: toGwei(gasPrice), wei: gasPrice }, network: "base", timestamp: new Date().toISOString() });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
}

async function tokenHandler(req: Request, res: Response) {
  const symbol = req.params.symbol?.toUpperCase();
  if (!symbol || !TOKEN_MAP[symbol])
    return res.status(400).json({ error: `Unknown token. Supported: ${Object.keys(TOKEN_MAP).join(", ")}` });
  const token = TOKEN_MAP[symbol];
  try {
    let totalSupply = "N/A";
    if (symbol !== "ETH") {
      const supplyHex = await rpcCall("eth_call", [{ to: token.address, data: "0x18160ddd" }, "latest"]);
      if (supplyHex && supplyHex !== "0x") totalSupply = (Number(BigInt(supplyHex)) / Math.pow(10, token.decimals)).toLocaleString("en-US", { maximumFractionDigits: 0 });
    }
    res.json({ symbol, name: token.name, address: token.address, decimals: token.decimals, priceUsd: token.priceUsd, totalSupply, network: "base", timestamp: new Date().toISOString() });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
}

async function txHandler(req: Request, res: Response) {
  const { hash } = req.params;
  if (!hash || !/^0x[a-fA-F0-9]{64}$/.test(hash))
    return res.status(400).json({ error: "Invalid transaction hash" });
  try {
    const [tx, receipt] = await Promise.all([
      rpcCall("eth_getTransactionByHash", [hash]),
      rpcCall("eth_getTransactionReceipt", [hash]),
    ]);
    if (!tx) return res.status(404).json({ error: "Transaction not found" });
    const value = tx.value ? hexToEth(tx.value) : "0";
    const gasUsed = receipt?.gasUsed ? hexToNumber(receipt.gasUsed) : null;
    const gasPrice = tx.gasPrice ? hexToNumber(tx.gasPrice) : null;
    const gasCostEth = gasUsed && gasPrice ? ((gasUsed * gasPrice) / 1e18).toFixed(8) : null;
    const status = receipt ? (receipt.status === "0x1" ? "success" : "failed") : "pending";
    res.json({ hash: tx.hash, from: tx.from, to: tx.to, value: `${value} ETH`, gasUsed, gasCostEth, status, blockNumber: tx.blockNumber ? hexToNumber(tx.blockNumber) : null, nonce: hexToNumber(tx.nonce), network: "base", timestamp: new Date().toISOString() });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
}

// ─── App ───────────────────────────────────────────────

const app = express();
app.use(cors());
app.use(express.json());

const SKILLS = [
  { name: "portfolio", endpoint: "/portfolio/:address", method: "GET", price: "$0.01", currency: "USDC", network: "base", description: "Wallet portfolio analysis — ETH balance, USDC balance, tx count, and labels" },
  { name: "risk", endpoint: "/risk/:address", method: "GET", price: "$0.02", currency: "USDC", network: "base", description: "Wallet risk scoring — activity analysis, contract detection, risk 0-100" },
  { name: "gas", endpoint: "/gas", method: "GET", price: "$0.01", currency: "USDC", network: "base", description: "Real-time gas tracker — slow/standard/fast prices with base fee" },
  { name: "token", endpoint: "/token/:symbol", method: "GET", price: "$0.01", currency: "USDC", network: "base", description: "Token info and price — decimals, supply, USD price for top Base tokens" },
  { name: "tx", endpoint: "/tx/:hash", method: "GET", price: "$0.01", currency: "USDC", network: "base", description: "Transaction decoder — from, to, value, gas, status for any tx hash" },
];

app.get("/catalog", (_req, res) => res.json({ skills: SKILLS, network: "base" }));
app.get("/portfolio/:address", portfolioHandler);
app.get("/risk/:address", riskHandler);
app.get("/gas", gasHandler);
app.get("/token/:symbol", tokenHandler);
app.get("/tx/:hash", txHandler);

export default app;
