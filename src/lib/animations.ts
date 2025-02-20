
export const ANIMATION_TIMING = {
  QUICK: 200,    // Quick feedback
  NORMAL: 300,   // Standard transitions
  COMPLEX: 400,  // Complex animations
  STAGGER: 50    // Delay between items
};

export const formAnimationVariants = {
  section: {
    initial: { 
      opacity: 0, 
      x: 20 
    },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  },
  field: {
    initial: { 
      opacity: 0, 
      y: 10 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  },
  success: {
    initial: { 
      scale: 0.95, 
      opacity: 0 
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  },
  error: {
    initial: { 
      x: 0 
    },
    animate: { 
      x: [0, -10, 10, -5, 5, 0],
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }
};
