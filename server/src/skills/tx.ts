import { Request, Response } from "express";
import { rpcCall, hexToEth, hexToNumber } from "../utils/rpc.js";

export async function txHandler(req: Request, res: Response) {
  const { hash } = req.params;

  if (!hash || !/^0x[a-fA-F0-9]{64}$/.test(hash)) {
    res.status(400).json({ error: "Invalid transaction hash" });
    return;
  }

  try {
    const [tx, receipt] = await Promise.all([
      rpcCall("eth_getTransactionByHash", [hash]),
      rpcCall("eth_getTransactionReceipt", [hash]),
    ]);

    if (!tx) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }

    const value = tx.value ? hexToEth(tx.value) : "0";
    const gasUsed = receipt?.gasUsed ? hexToNumber(receipt.gasUsed) : null;
    const gasPrice = tx.gasPrice ? hexToNumber(tx.gasPrice) : null;
    const gasCostWei = gasUsed && gasPrice ? gasUsed * gasPrice : null;
    const gasCostEth = gasCostWei ? (gasCostWei / 1e18).toFixed(8) : null;

    const status = receipt
      ? receipt.status === "0x1"
        ? "success"
        : "failed"
      : "pending";

    res.json({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: `${value} ETH`,
      gasUsed,
      gasCostEth,
      status,
      blockNumber: tx.blockNumber ? hexToNumber(tx.blockNumber) : null,
      nonce: hexToNumber(tx.nonce),
      network: "base",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch transaction" });
  }
}
