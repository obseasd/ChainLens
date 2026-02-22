import { Request, Response } from "express";
import { rpcCall, hexToNumber } from "../utils/rpc.js";

export async function riskHandler(req: Request, res: Response) {
  const { address } = req.params;

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    res.status(400).json({ error: "Invalid Ethereum address" });
    return;
  }

  try {
    const [txCountHex, code, latestBlockHex] = await Promise.all([
      rpcCall("eth_getTransactionCount", [address, "latest"]),
      rpcCall("eth_getCode", [address, "latest"]),
      rpcCall("eth_blockNumber"),
    ]);

    const txCount = hexToNumber(txCountHex);
    const isContract = code !== "0x" && code !== "0x0" && code.length > 2;
    const latestBlock = hexToNumber(latestBlockHex);

    // Activity level scoring
    let activityLevel: "none" | "low" | "medium" | "high" | "very-high";
    if (txCount === 0) activityLevel = "none";
    else if (txCount < 10) activityLevel = "low";
    else if (txCount < 100) activityLevel = "medium";
    else if (txCount < 1000) activityLevel = "high";
    else activityLevel = "very-high";

    // Risk scoring: 0 = safe, 100 = risky
    let riskScore = 50; // baseline
    const flags: string[] = [];

    // Contract addresses are riskier for receiving funds
    if (isContract) {
      riskScore += 15;
      flags.push("contract-address");
    }

    // Low activity is suspicious
    if (txCount === 0) {
      riskScore += 25;
      flags.push("no-transactions");
    } else if (txCount < 5) {
      riskScore += 15;
      flags.push("very-low-activity");
    } else if (txCount > 100) {
      riskScore -= 20;
    } else if (txCount > 10) {
      riskScore -= 10;
    }

    // Clamp score
    riskScore = Math.max(0, Math.min(100, riskScore));

    res.json({
      address,
      riskScore,
      isContract,
      txCount,
      activityLevel,
      flags,
      latestBlock,
      network: "base",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to assess risk" });
  }
}
