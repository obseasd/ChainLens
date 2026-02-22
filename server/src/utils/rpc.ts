const BASE_RPC_URL = "https://mainnet.base.org";

interface JsonRpcResponse {
  jsonrpc: string;
  id: number;
  result?: any;
  error?: { code: number; message: string };
}

export async function rpcCall(method: string, params: any[] = []): Promise<any> {
  const response = await fetch(BASE_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
  });

  const data = (await response.json()) as JsonRpcResponse;

  if (data.error) {
    throw new Error(`RPC error: ${data.error.message}`);
  }

  return data.result;
}

export function hexToEth(hexWei: string): string {
  const wei = BigInt(hexWei);
  const eth = Number(wei) / 1e18;
  return eth.toFixed(6);
}

export function hexToUsdc(hexAmount: string): string {
  const amount = BigInt(hexAmount);
  const usdc = Number(amount) / 1e6;
  return usdc.toFixed(2);
}

export function hexToNumber(hex: string): number {
  return Number(BigInt(hex));
}
