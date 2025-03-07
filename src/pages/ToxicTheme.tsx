
import React from 'react';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { 
  ToxicCard, 
  ToxicCardHeader, 
  ToxicCardTitle, 
  ToxicCardDescription,
  ToxicCardContent,
  ToxicCardFooter
} from '@/components/ui/toxic-card';
import { ToxicProgress } from '@/components/ui/toxic-progress';
import { Shield, Skull, Radiation, Zap, BarChart3 } from 'lucide-react';

const ToxicTheme = () => {
  return (
    <div className="container py-8 mx-auto dark">
      <div className="radiation-bg min-h-screen">
        <div className="scanline"></div>
        
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl mb-6 text-toxic-neon font-bold toxic-glow">Toxic Theme Showcase</h1>
          
          <p className="text-white/70 mb-8">
            This page showcases the new toxic theme components inspired by the NFT collection with radioactive aesthetics.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <ToxicCard>
              <ToxicCardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-toxic-neon/20 flex items-center justify-center">
                    <Skull className="w-5 h-5 text-toxic-neon" />
                  </div>
                  <ToxicCardTitle>Toxic Card</ToxicCardTitle>
                </div>
                <ToxicCardDescription>
                  A card with toxic design aesthetics featuring scanlines and glowing effects.
                </ToxicCardDescription>
              </ToxicCardHeader>
              <ToxicCardContent>
                <div className="space-y-4">
                  <p className="text-white/80">
                    The toxic card features radioactive green accents, scanlines, and a subtle pulsing glow animation.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <ToxicBadge>Default</ToxicBadge>
                    <ToxicBadge variant="secondary">Secondary</ToxicBadge>
                    <ToxicBadge variant="outline">Outline</ToxicBadge>
                    <ToxicBadge variant="danger">Danger</ToxicBadge>
                  </div>
                </div>
              </ToxicCardContent>
              <ToxicCardFooter>
                <ToxicButton>
                  <Radiation className="mr-2 h-4 w-4" />
                  Default Button
                </ToxicButton>
              </ToxicCardFooter>
            </ToxicCard>
            
            <ToxicCard>
              <ToxicCardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-toxic-neon/20 flex items-center justify-center">
                    <Radiation className="w-5 h-5 text-toxic-neon" />
                  </div>
                  <ToxicCardTitle>Progress Elements</ToxicCardTitle>
                </div>
                <ToxicCardDescription>
                  Showcasing progress bars and buttons with the toxic theme.
                </ToxicCardDescription>
              </ToxicCardHeader>
              <ToxicCardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-toxic-neon text-sm">25% Progress</label>
                    <ToxicProgress value={25} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-toxic-neon text-sm">50% Progress</label>
                    <ToxicProgress value={50} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-toxic-neon text-sm">75% Progress</label>
                    <ToxicProgress value={75} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-toxic-neon text-sm">90% Progress</label>
                    <ToxicProgress value={90} />
                  </div>
                </div>
              </ToxicCardContent>
              <ToxicCardFooter className="flex justify-between">
                <ToxicButton variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  Outline
                </ToxicButton>
                <ToxicButton variant="glowing">
                  <Zap className="mr-2 h-4 w-4" />
                  Glowing
                </ToxicButton>
              </ToxicCardFooter>
            </ToxicCard>
          </div>
          
          <ToxicCard className="mb-12">
            <ToxicCardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-toxic-neon/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-toxic-neon" />
                </div>
                <ToxicCardTitle>Toxic Button Variants</ToxicCardTitle>
              </div>
              <ToxicCardDescription>
                Different button variants available in the toxic theme.
              </ToxicCardDescription>
            </ToxicCardHeader>
            <ToxicCardContent>
              <div className="flex flex-wrap gap-4">
                <ToxicButton variant="default">
                  Default
                </ToxicButton>
                <ToxicButton variant="outline">
                  Outline
                </ToxicButton>
                <ToxicButton variant="ghost">
                  Ghost
                </ToxicButton>
                <ToxicButton variant="glowing">
                  Glowing
                </ToxicButton>
                <ToxicButton variant="default" size="sm">
                  Small
                </ToxicButton>
                <ToxicButton variant="default" size="lg">
                  Large
                </ToxicButton>
                <ToxicButton variant="default" size="icon">
                  <Radiation />
                </ToxicButton>
              </div>
            </ToxicCardContent>
          </ToxicCard>
        </div>
      </div>
    </div>
  );
};

export default ToxicTheme;
