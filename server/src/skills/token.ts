import { Request, Response } from "express";
import { rpcCall, hexToNumber } from "../utils/rpc.js";

interface TokenInfo {
  address: string;
  decimals: number;
  name: string;
  priceUsd: number;
}

const TOKEN_MAP: Record<string, TokenInfo> = {
  ETH: {
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    name: "Ethereum",
    priceUsd: 2800,
  },
  WETH: {
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    name: "Wrapped Ether",
    priceUsd: 2800,
  },
  USDC: {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
    name: "USD Coin",
    priceUsd: 1.0,
  },
  USDT: {
    address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    decimals: 6,
    name: "Tether USD",
    priceUsd: 1.0,
  },
  DAI: {
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    decimals: 18,
    name: "Dai Stablecoin",
    priceUsd: 1.0,
  },
};

export async function tokenHandler(req: Request, res: Response) {
  const symbol = req.params.symbol?.toUpperCase();

  if (!symbol || !TOKEN_MAP[symbol]) {
    res.status(400).json({
      error: `Unknown token. Supported: ${Object.keys(TOKEN_MAP).join(", ")}`,
    });
    return;
  }

  const token = TOKEN_MAP[symbol];

  try {
    let totalSupply = "N/A";

    if (symbol !== "ETH") {
      // ERC-20 totalSupply() selector: 0x18160ddd
      const supplyHex = await rpcCall("eth_call", [
        { to: token.address, data: "0x18160ddd" },
        "latest",
      ]);

      if (supplyHex && supplyHex !== "0x") {
        const raw = BigInt(supplyHex);
        const supply = Number(raw) / Math.pow(10, token.decimals);
        totalSupply = supply.toLocaleString("en-US", { maximumFractionDigits: 0 });
      }
    }

    res.json({
      symbol,
      name: token.name,
      address: token.address,
      decimals: token.decimals,
      priceUsd: token.priceUsd,
      totalSupply,
      network: "base",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch token info" });
  }
}
