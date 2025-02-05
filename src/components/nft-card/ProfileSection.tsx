
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react"; // Import UserRound icon for fallback

interface ProfileSectionProps {
  image: string;
  name: string;
  governancePower: string;
  Award: React.ElementType;
}

export const ProfileSection = ({ image, name, governancePower, Award }: ProfileSectionProps) => {
  // Function to handle image error and show fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none'; // Hide the failed image
    const fallbackIcon = e.currentTarget.parentElement?.querySelector('.fallback-icon');
    if (fallbackIcon) {
      fallbackIcon.classList.remove('hidden');
    }
  };

  return (
    <>
      {/* Profile Section */}
      <div className="w-full flex justify-center mb-4">
        <div className="relative w-32 aspect-square">
          <div className="absolute -inset-4 bg-polygon-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -inset-2 bg-polygon-secondary/15 rounded-full blur-2xl animate-pulse-slow delay-75" />
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-polygon-primary via-polygon-secondary to-polygon-primary rounded-full blur-xl animate-pulse-slow" />
            {/* Fallback Icon */}
            <div className="fallback-icon hidden relative w-full h-full flex items-center justify-center rounded-full bg-black/40 border-4 border-white/10">
              <UserRound className="w-12 h-12 text-polygon-primary" />
            </div>
            {/* Profile Image */}
            <img 
              src={image || '#'} // Use empty hash as src if image is empty
              alt={name}
              onError={handleImageError}
              className="relative rounded-full aspect-square object-cover w-full border-4 border-white/10 shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Title Section */}
      <div className="space-y-4 text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-polygon-primary to-polygon-secondary bg-clip-text text-transparent">
          {name}
        </h3>
        <p className="text-lg text-gray-300 flex items-center justify-center gap-2">
          <Award className="w-5 h-5 text-polygon-primary" />
          <span className="bg-gradient-to-r from-polygon-primary to-polygon-secondary bg-clip-text text-transparent">
            Governance Power: {governancePower}
          </span>
        </p>
      </div>
    </>
  );
};

