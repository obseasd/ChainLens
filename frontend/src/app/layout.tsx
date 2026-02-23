import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChainLens | On-Chain Intelligence as a Service",
  description:
    "Real-time blockchain analytics as x402-paywalled microservices on Base. Pay $0.01 USDC per query, settled instantly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-[var(--border)] mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-5 h-5 rounded bg-gradient-to-br from-[#6fa00d] to-[#88CC10] flex items-center justify-center text-[8px] font-bold text-black">
                  CL
                </div>
                <span>ChainLens</span>
                <span className="text-gray-700">|</span>
                <span>Built on PinionOS</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>x402 Protocol</span>
                <span className="text-gray-700">|</span>
                <span>USDC on Base</span>
                <span className="text-gray-700">|</span>
                <a
                  href="https://github.com/chu2bard/pinion-os"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[#88CC10] transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
