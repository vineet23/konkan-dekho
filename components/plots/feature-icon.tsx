"use client";
import {
    ParkingCircle,
    ParkingSquare,
    Bed,
    BedDouble,
    BedSingle,
    Sofa,
    Mountain,
    Waves,
    View,
    Trees,
    Wifi,
    Utensils,
    Dog,
    Cat,
    Wind,
    Sun,
    Star,
    Sparkles,
  } from 'lucide-react';

  interface FeatureIconProps {
    feature: string;
    className?: string;
  }

  export function FeatureIcon({ feature, className }: FeatureIconProps) {
    const lowerCaseFeature = feature.toLowerCase();

    if (lowerCaseFeature.includes('parking')) {
      return <ParkingCircle className={className} />;
    }
    if (lowerCaseFeature.includes('furnished')) {
      return <BedDouble className={className} />;
    }
    if (lowerCaseFeature.includes('bunglow')) {
        return <Bed className={className} />;
      }
    if (lowerCaseFeature.includes('view')) {
      return <View className={className} />;
    }
    if (lowerCaseFeature.includes('ocean')) {
      return <Waves className={className} />;
    }
    if (lowerCaseFeature.includes('sea')) {
        return <Waves className={className} />;
      }
    if (lowerCaseFeature.includes('mountain')) {
      return <Mountain className={className} />;
    }
    if (lowerCaseFeature.includes('garden')) {
      return <Trees className={className} />;
    }
    if (lowerCaseFeature.includes('wifi')) {
      return <Wifi className={className} />;
    }
    if (lowerCaseFeature.includes('kitchen')) {
      return <Utensils className={className} />;
    }
    if (lowerCaseFeature.includes('pets')) {
      return <Dog className={className} />;
    }
    if (lowerCaseFeature.includes('pool')) {
      return <Waves className={className} />;
    }
    if (lowerCaseFeature.includes('spacious')) {
        return <Sparkles className={className} />;
      }
    return <Star className={className} />;
  }
