import { Request, Response } from "express";
import { rpcCall, hexToNumber } from "../utils/rpc.js";

export async function gasHandler(_req: Request, res: Response) {
  try {
    const [gasPriceHex, feeHistory] = await Promise.all([
      rpcCall("eth_gasPrice"),
      rpcCall("eth_feeHistory", ["0x5", "latest", [25, 50, 75]]),
    ]);

    const gasPrice = hexToNumber(gasPriceHex);
    const baseFee = feeHistory.baseFeePerGas
      ? hexToNumber(feeHistory.baseFeePerGas[feeHistory.baseFeePerGas.length - 1])
      : gasPrice;

    // Calculate priority fees from reward percentiles
    const rewards = feeHistory.reward || [];
    let slow = 0, standard = 0, fast = 0;

    if (rewards.length > 0) {
      const slowFees: number[] = [];
      const standardFees: number[] = [];
      const fastFees: number[] = [];

      for (const block of rewards) {
        if (block[0]) slowFees.push(hexToNumber(block[0]));
        if (block[1]) standardFees.push(hexToNumber(block[1]));
        if (block[2]) fastFees.push(hexToNumber(block[2]));
      }

      const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      slow = baseFee + avg(slowFees);
      standard = baseFee + avg(standardFees);
      fast = baseFee + avg(fastFees);
    } else {
      slow = gasPrice * 0.9;
      standard = gasPrice;
      fast = gasPrice * 1.2;
    }

    const toGwei = (wei: number) => (wei / 1e9).toFixed(4);

    res.json({
      slow: { gwei: toGwei(slow), wei: Math.round(slow) },
      standard: { gwei: toGwei(standard), wei: Math.round(standard) },
      fast: { gwei: toGwei(fast), wei: Math.round(fast) },
      baseFee: { gwei: toGwei(baseFee), wei: baseFee },
      currentGasPrice: { gwei: toGwei(gasPrice), wei: gasPrice },
      network: "base",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch gas data" });
  }
}
