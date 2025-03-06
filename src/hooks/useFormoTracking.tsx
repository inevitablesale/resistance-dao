
import { useFormoAnalytics } from '@formo/analytics';
import { useEffect } from 'react';
import { useCustomWallet } from './useCustomWallet';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook for Formo Analytics tracking that includes auto page view tracking
 * and provides helper methods for common tracking events
 */
export const useFormoTracking = () => {
  const analytics = useFormoAnalytics();
  const location = useLocation();
  const { isConnected, address } = useCustomWallet();

  // Track page views automatically
  useEffect(() => {
    if (analytics) {
      analytics.page();
      console.log(`[Formo] Page view tracked: ${location.pathname}`);
    }
  }, [location.pathname, analytics]);

  // Track wallet connection status
  useEffect(() => {
    if (analytics && isConnected && address) {
      // In the Formo Analytics SDK, identify() might only accept a single argument
      // that contains both the ID and traits in one object
      analytics.identify({
        id: address,
        traits: {
          walletAddress: address,
          connectionTimestamp: new Date().toISOString(),
        }
      });
      console.log(`[Formo] Wallet identified: ${address}`);
    }
  }, [isConnected, address, analytics]);

  // Helper for NFT purchase tracking
  const trackNFTPurchase = (txHash: string, tokenId?: string) => {
    if (analytics) {
      analytics.track('nft_purchased', {
        transactionHash: txHash,
        tokenId: tokenId || 'unknown',
        timestamp: new Date().toISOString(),
        walletAddress: address
      });
      console.log(`[Formo] NFT purchase tracked: ${txHash}`);
    }
  };

  // Helper for referral link generation tracking
  const trackReferralLinkGenerated = () => {
    if (analytics && address) {
      analytics.track('referral_link_generated', {
        referrerAddress: address,
        timestamp: new Date().toISOString()
      });
      console.log('[Formo] Referral link generation tracked');
    }
  };

  // Helper for referral link share tracking
  const trackReferralLinkShared = (platform: string) => {
    if (analytics && address) {
      analytics.track('referral_link_shared', {
        referrerAddress: address,
        platform,
        timestamp: new Date().toISOString()
      });
      console.log(`[Formo] Referral link share tracked: ${platform}`);
    }
  };

  return {
    analytics,
    trackNFTPurchase,
    trackReferralLinkGenerated,
    trackReferralLinkShared
  };
};
