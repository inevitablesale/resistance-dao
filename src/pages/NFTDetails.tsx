
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNFTMetadata } from '@/hooks/useNFTMetadata';
import { ToxicCard, ToxicCardContent, ToxicCardHeader, ToxicCardTitle, ToxicCardFooter } from '@/components/ui/toxic-card';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { ArrowLeft, ExternalLink, Biohazard, Shield, ShieldAlert, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CONTRACT_ADDRESS } from '@/hooks/useNFTCollection';
import { CharacterRevealSlider } from '@/components/marketplace/CharacterRevealSlider';
import { ModelPreview } from '@/components/marketplace/ModelPreview';
import { useToast } from '@/components/ui/use-toast';

const NFTDetails: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const navigate = useNavigate();
  const { data: nft, isLoading, error, metadata } = useNFTMetadata(tokenId || '');
  const [revealValue, setRevealValue] = useState(20); // Start with character mostly obscured
  const { toast } = useToast();
  
  useEffect(() => {
    if (nft) {
      console.log(`NFT details for token ${tokenId}:`, {
        name: nft.name,
        animation_url: nft.animation_url,
        image_url: nft.image_url,
        traits: nft.traits.map(t => `${t.trait_type}: ${t.value}`).join(', ')
      });
    }
    
    if (metadata) {
      console.log('Metadata from Pinata:', metadata);
      toast({
        title: "Metadata loaded",
        description: `Successfully loaded metadata for ${nft?.name}`,
      });
    }
  }, [nft, tokenId, metadata, toast]);
  
  const handleBack = () => {
    navigate(-1);
  };

  const openOnOpenSea = () => {
    window.open(`https://opensea.io/assets/matic/${CONTRACT_ADDRESS}/${tokenId}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-32 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <ToxicButton variant="outline" size="sm" onClick={handleBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </ToxicButton>
            <Skeleton className="h-8 w-48" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            
            <div className="space-y-6">
              <div>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              
              <div>
                <Skeleton className="h-6 w-32 mb-3" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="min-h-screen bg-black text-white pt-32 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          <ToxicCard className="bg-black/80 border-apocalypse-red/30">
            <ToxicCardHeader>
              <ToxicCardTitle className="flex items-center gap-2 text-apocalypse-red">
                <ShieldAlert className="h-6 w-6" />
                Error Loading NFT
              </ToxicCardTitle>
            </ToxicCardHeader>
            <ToxicCardContent>
              <p className="text-white/70 mb-4">
                {error?.message || "Failed to load the requested NFT. It may not exist or there might be a network issue."}
              </p>
              <ToxicButton variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Go Back
              </ToxicButton>
            </ToxicCardContent>
          </ToxicCard>
        </div>
      </div>
    );
  }

  const getTraitValue = (traitType: string): string => {
    const trait = nft.traits.find(t => t.trait_type.toLowerCase() === traitType.toLowerCase());
    return trait ? trait.value : 'Unknown';
  };

  const role = getTraitValue('role') || getTraitValue('class') || 'Unknown';
  const radiationLevel = getTraitValue('radiation') || getTraitValue('radiation level') || '50';
  
  const groupedTraits: Record<string, Array<{trait_type: string, value: string}>> = {};
  nft.traits.forEach(trait => {
    const category = trait.trait_type.includes('_') 
      ? trait.trait_type.split('_')[0] 
      : 'General';
      
    if (!groupedTraits[category]) {
      groupedTraits[category] = [];
    }
    groupedTraits[category].push(trait);
  });

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-16">
      <div className="container px-4 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <ToxicButton variant="outline" size="sm" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </ToxicButton>
          <h1 className="text-2xl font-mono text-toxic-neon">
            {nft.name || `NFT #${nft.identifier}`}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-b from-toxic-neon/20 to-black/60 rounded-lg overflow-hidden border border-toxic-neon/30">
            {nft.animation_url ? (
              <div className="w-full h-full flex flex-col">
                <div className="h-[400px] relative">
                  {console.log('Passing animation URL to ModelPreview:', nft.animation_url)}
                  <ModelPreview 
                    modelUrl={nft.animation_url}
                    height="100%"
                    width="100%"
                    autoRotate={true}
                    radiationLevel={parseInt(radiationLevel, 10)}
                    useRadiationCloud={true}
                    radiationCloudUrl="bafybeiayvmbutisgus45sujbr65sqnpeqcd3vtu6tjxwbmwadf35frszp4"
                    revealValue={revealValue}
                    showControls={true}
                  />
                </div>
                
                <div className="p-4 bg-black/60">
                  <CharacterRevealSlider 
                    value={revealValue} 
                    onChange={setRevealValue} 
                  />
                </div>
              </div>
            ) : nft.image_url ? (
              <img 
                src={nft.image_url} 
                alt={nft.name || `NFT #${nft.identifier}`} 
                className="w-full h-full object-contain min-h-[400px]"
              />
            ) : (
              <div className="flex items-center justify-center h-[400px]">
                <Biohazard className="h-20 w-20 text-toxic-neon/30" />
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <ToxicCard className="bg-black/80 border-toxic-neon/30">
              <ToxicCardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <ToxicBadge variant="outline" className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-toxic-neon" />
                    <span>Token ID: {nft.identifier}</span>
                  </ToxicBadge>
                  <ToxicBadge 
                    variant={parseInt(radiationLevel, 10) > 70 ? "danger" : "outline"}
                    className={parseInt(radiationLevel, 10) > 70 ? "animate-toxic-pulse" : ""}
                  >
                    Radiation: {radiationLevel}%
                  </ToxicBadge>
                </div>
                
                <h2 className="text-xl font-mono text-toxic-neon mb-2">
                  {nft.name || `Wasteland NFT #${nft.identifier}`}
                </h2>
                
                {nft.description && (
                  <p className="text-white/70 text-sm mb-4">{nft.description}</p>
                )}
                
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div className="bg-black/40 p-2 rounded border border-toxic-neon/20">
                    <span className="text-white/60 block">Role</span>
                    <span className="text-toxic-neon">{role}</span>
                  </div>
                  <div className="bg-black/40 p-2 rounded border border-toxic-neon/20">
                    <span className="text-white/60 block">Owner</span>
                    <span className="text-toxic-neon truncate">
                      {nft.owners && nft.owners[0]?.address 
                        ? `${nft.owners[0].address.substring(0, 6)}...${nft.owners[0].address.substring(38)}` 
                        : 'Unknown'}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <ToxicButton 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={openOnOpenSea}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" /> View on OpenSea
                  </ToxicButton>
                  
                  <ToxicButton 
                    variant="default" 
                    size="sm"
                    className="flex-1"
                  >
                    <Shield className="h-4 w-4 mr-1" /> Claim Benefits
                  </ToxicButton>
                </div>
              </ToxicCardContent>
            </ToxicCard>
            
            {Object.keys(groupedTraits).length > 0 && (
              <ToxicCard className="bg-black/80 border-toxic-neon/30">
                <ToxicCardHeader className="pb-0">
                  <ToxicCardTitle className="text-lg">NFT Attributes</ToxicCardTitle>
                </ToxicCardHeader>
                <ToxicCardContent>
                  {Object.entries(groupedTraits).map(([category, traits]) => (
                    <div key={category} className="mb-4 last:mb-0">
                      <h3 className="text-toxic-neon font-mono text-sm mb-2 capitalize">{category}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {traits.map((trait, index) => (
                          <div key={index} className="bg-black/40 p-2 rounded border border-toxic-neon/20 text-sm">
                            <span className="text-white/60 block text-xs">{trait.trait_type.replace(`${category}_`, '')}</span>
                            <span className="text-toxic-neon">{trait.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </ToxicCardContent>
              </ToxicCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetails;
