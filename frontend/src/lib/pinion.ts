export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4020";

export interface SkillMeta {
  name: string;
  description: string;
  endpoint: string;
  method: string;
  price: string;
  icon: string;
  gradient: string;
  paramName: string;
  paramLabel: string;
  placeholder: string;
}

export interface SkillResult {
  data: any;
  status: number;
  duration: number;
}

export const CHAINLENS_SKILLS: SkillMeta[] = [
  {
    name: "portfolio",
    description: "Wallet portfolio analysis — ETH balance, USDC balance, transaction count, and smart labels",
    endpoint: "/portfolio/:address",
    method: "GET",
    price: "$0.01",
    icon: "P",
    gradient: "from-indigo-500 to-blue-600",
    paramName: "address",
    paramLabel: "Wallet Address",
    placeholder: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  },
  {
    name: "risk",
    description: "Wallet risk scoring — activity analysis, contract detection, and a 0-100 risk score",
    endpoint: "/risk/:address",
    method: "GET",
    price: "$0.02",
    icon: "R",
    gradient: "from-rose-500 to-orange-500",
    paramName: "address",
    paramLabel: "Wallet Address",
    placeholder: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  },
  {
    name: "gas",
    description: "Real-time gas tracker — slow, standard, and fast gas prices with current base fee",
    endpoint: "/gas",
    method: "GET",
    price: "$0.01",
    icon: "G",
    gradient: "from-emerald-500 to-teal-600",
    paramName: "",
    paramLabel: "",
    placeholder: "",
  },
  {
    name: "token",
    description: "Token info and price — decimals, total supply, and USD price for top Base tokens",
    endpoint: "/token/:symbol",
    method: "GET",
    price: "$0.01",
    icon: "T",
    gradient: "from-amber-500 to-yellow-600",
    paramName: "symbol",
    paramLabel: "Token Symbol",
    placeholder: "USDC",
  },
  {
    name: "tx",
    description: "Transaction decoder — sender, recipient, value, gas used, and status for any tx hash",
    endpoint: "/tx/:hash",
    method: "GET",
    price: "$0.01",
    icon: "X",
    gradient: "from-violet-500 to-fuchsia-600",
    paramName: "hash",
    paramLabel: "Transaction Hash",
    placeholder: "0x...",
  },
];

export async function callSkill(endpoint: string): Promise<SkillResult> {
  const start = Date.now();
  const res = await fetch(`${API_URL}${endpoint}`);
  const duration = Date.now() - start;
  const data = await res.json();
  return { data, status: res.status, duration };
}

export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/catalog`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
