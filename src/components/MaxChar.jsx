import { useEffect } from "react";

const PLATFORM_CHAR_LIMITS = {
  facebook: 63000,
  linkedin: 3000,
  instagram: 2200,
  twitter: 280,
  youtube: 5000, // Add more as you like
};

export default function MaxChar({ selectedPlatforms, onLimitChange }) {
  useEffect(() => {
    // Check if callback exists
    if (typeof onLimitChange !== "function") {
      console.warn("onLimitChange is not a function");
      return;
    }

    // Find enabled platforms
    const enabled = Object.keys(selectedPlatforms).filter(
      (platform) => selectedPlatforms[platform]
    );

    // Get char limits for enabled platforms
    const limits = enabled
      .map((platform) => PLATFORM_CHAR_LIMITS[platform])
      .filter(Boolean); // Ignore undefined

    // Get the minimum of these
    const minLimit = limits.length > 0 ? Math.min(...limits) : 0;
    
    // Send up the min limit
    onLimitChange(minLimit);
  }, [selectedPlatforms, onLimitChange]);
  return null; // Renders nothing
}
