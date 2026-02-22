import { createSkillServer, skill } from "pinion-os/server";
import { portfolioHandler } from "./skills/portfolio.js";
import { riskHandler } from "./skills/risk.js";
import { gasHandler } from "./skills/gas.js";
import { tokenHandler } from "./skills/token.js";
import { txHandler } from "./skills/tx.js";

const server = createSkillServer({
  payTo: process.env.ADDRESS || "0x0000000000000000000000000000000000000000",
  network: "base-sepolia",
  port: Number(process.env.PORT) || 4020,
});

server.add(
  skill("portfolio", {
    description: "Wallet portfolio analysis — ETH balance, USDC balance, tx count, and labels",
    endpoint: "/portfolio/:address",
    method: "GET",
    price: "$0.01",
    handler: portfolioHandler,
  })
);

server.add(
  skill("risk", {
    description: "Wallet risk scoring — activity analysis, contract detection, risk 0-100",
    endpoint: "/risk/:address",
    method: "GET",
    price: "$0.02",
    handler: riskHandler,
  })
);

server.add(
  skill("gas", {
    description: "Real-time gas tracker — slow/standard/fast prices with base fee",
    endpoint: "/gas",
    method: "GET",
    price: "$0.01",
    handler: gasHandler,
  })
);

server.add(
  skill("token", {
    description: "Token info and price — decimals, supply, USD price for top Base tokens",
    endpoint: "/token/:symbol",
    method: "GET",
    price: "$0.01",
    handler: tokenHandler,
  })
);

server.add(
  skill("tx", {
    description: "Transaction decoder — from, to, value, gas, status for any tx hash",
    endpoint: "/tx/:hash",
    method: "GET",
    price: "$0.01",
    handler: txHandler,
  })
);

server.listen();
