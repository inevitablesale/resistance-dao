
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectorsWithConfig } from "@dynamic-labs/ethereum-aa";
import { Analytics } from '@vercel/analytics/react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GovernanceVoting from "./pages/GovernanceVoting";
import MintNFT from "./pages/MintNFT";
import ShareToEarn from "./pages/ShareToEarn";
import Litepaper from "./pages/Litepaper";
import { useToast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";

function App() {
  const { toast } = useToast();
  
  const zeroDevConfig = {
    projectId: "4b729792-4b38-4d73-8a69-4f7559f2c2cd",
    bundlerRpc: "https://rpc.zerodev.app/api/v2/bundler/4b729792-4b38-4d73-8a69-4f7559f2c2cd",
    paymasterRpc: "https://rpc.zerodev.app/api/v2/paymaster/4b729792-4b38-4d73-8a69-4f7559f2c2cd"
  };

  const dynamicSettings = {
    environmentId: "00a01fb3-76e6-438d-a77d-342bbf2084e2",
    walletConnectorOptions: {
      zeroDevOptions: zeroDevConfig
    },
    walletConnectors: [
      EthereumWalletConnectors,
      ZeroDevSmartWalletConnectorsWithConfig(zeroDevConfig)
    ],
    events: {
      authFlowOpen: () => {
        console.log("[Dynamic SDK] Auth flow opened");
      },
      authFlowClose: () => {
        console.log("[Dynamic SDK] Auth flow closed");
      },
      authFailure: (reason) => {
        console.log("[Dynamic SDK] Auth failure:", reason);
        toast({
          title: "Authentication Failed",
          description: "There was an error connecting your wallet.",
        });
      },
      authSuccess: (args) => {
        console.log("[Dynamic SDK] Auth Success:", args);
        toast({
          title: "Successfully Connected",
          description: `Connected ${args?.wallet?.connector?.name || 'wallet'} (${args?.wallet?.address?.slice(0, 6)}...${args?.wallet?.address?.slice(-4)})`,
        });
      },
      emailVerificationStarted: () => {
        // Immediately close the verification window
        setTimeout(() => {
          const verificationDialog = document.querySelector('[data-dynamic-email-verification]');
          if (verificationDialog) {
            (verificationDialog as HTMLElement).style.display = 'none';
          }
        }, 100);
      },
      emailVerificationCompleted: () => {
        console.log("[Dynamic SDK] Email verification completed automatically");
      },
      userCreated: (args) => {
        console.log("[Dynamic SDK] New user created:", args);
        toast({
          title: "Account Created",
          description: "Your account has been successfully created.",
        });
      },
      emailVerificationSuccess: () => {
        console.log("[Dynamic SDK] Email verification succeeded");
      },
      logout: () => {
        console.log("[Dynamic SDK] User logged out");
        toast({
          title: "Logged Out",
          description: "You've been successfully logged out.",
        });
      },
      userWalletsChanged: (params) => {
        console.log("[Dynamic SDK] User wallets changed:", params);
      },
      primaryWalletChanged: (newPrimaryWallet) => {
        console.log("[Dynamic SDK] Primary wallet changed:", newPrimaryWallet);
      }
    },
    settings: {
      network: {
        chainId: 137, // Polygon Mainnet
      },
      environmentId: "00a01fb3-76e6-438d-a77d-342bbf2084e2",
      appName: "LedgerFund",
      appLogoUrl: "/favicon.ico",
      // Wallet settings
      enableEmbeddedWallets: true,
      enableVisitTrackingOnConnectOnly: true,
      enableWalletConnectV1: false,
      enableWalletConnectV2: true,
      // Session settings
      persistWalletSession: true,
      enableSessionRestoration: true,
      // Authentication settings
      enableAuthProviders: true,
      enablePasskeys: false,
      // Email authentication settings
      evmWallets: {
        options: {
          emailAuth: {
            signInWithEmail: true,
            autoVerify: true,
            autoClose: true,
            onComplete: (args) => {
              console.log("[Dynamic SDK] Email Auth Complete:", args);
              toast({
                title: "Email Authentication Complete",
                description: "You can now proceed with the token purchase.",
              });
            }
          }
        }
      },
      style: {
        buttonClassName: "dynamic-button",
        theme: "dark",
        displaySiweStatement: false,
        buttonText: {
          connectWallet: "Connect Wallet",
          disconnect: "Disconnect",
          signIn: "Connect Wallet",
          signUp: "Connect Wallet",
          connected: "Connected",
          connecting: "Connecting...",
          viewAccount: "View Account",
          loggedOut: "Connect Wallet"
        }
      },
      shadowDOMEnabled: false,
      tokens: [
        {
          address: "0xf12145c01e4b252677a91bbf81fa8f36deb5ae00",
          symbol: "LGR",
          decimals: 18,
          name: "LedgerFund Token",
          icon: "/favicon.ico",
          chainId: 137
        }
      ]
    }
  };

  return (
    <DynamicContextProvider settings={dynamicSettings}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/governance-voting" element={<GovernanceVoting />} />
          <Route path="/mint-nft" element={<MintNFT />} />
          <Route path="/share-to-earn" element={<ShareToEarn />} />
          <Route path="/litepaper" element={<Litepaper />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
      <Analytics />
    </DynamicContextProvider>
  );
}

export default App;
