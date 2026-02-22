import { Request, Response } from "express";
import { rpcCall, hexToEth, hexToUsdc, hexToNumber } from "../utils/rpc.js";

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export async function portfolioHandler(req: Request, res: Response) {
  const { address } = req.params;

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    res.status(400).json({ error: "Invalid Ethereum address" });
    return;
  }

  try {
    const [ethBalanceHex, usdcBalanceHex, txCountHex] = await Promise.all([
      rpcCall("eth_getBalance", [address, "latest"]),
      rpcCall("eth_call", [
        {
          to: USDC_ADDRESS,
          data: "0x70a08231000000000000000000000000" + address.slice(2).toLowerCase(),
        },
        "latest",
      ]),
      rpcCall("eth_getTransactionCount", [address, "latest"]),
    ]);

    const ethBalance = hexToEth(ethBalanceHex);
    const usdcBalance = hexToUsdc(usdcBalanceHex || "0x0");
    const txCount = hexToNumber(txCountHex);

    const labels: string[] = [];
    if (txCount > 1000) labels.push("power-user");
    if (txCount > 100) labels.push("active");
    if (parseFloat(ethBalance) > 10) labels.push("whale");
    if (parseFloat(usdcBalance) > 10000) labels.push("stablecoin-holder");
    if (txCount === 0) labels.push("empty");

    res.json({
      address,
      ethBalance,
      usdcBalance,
      txCount,
      labels,
      network: "base",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch portfolio" });
  }
}
