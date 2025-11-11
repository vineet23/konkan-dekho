"use client";
import {
    ParkingCircle,
    Car,
    Building,
    Bed,
    BedDouble,
    Mountain,
    Waves,
    View,
    Trees,
    Wifi,
    Utensils,
    Dog,
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
    if (lowerCaseFeature.includes('city')) {
      return <Building className={className} />;
    }
    if (lowerCaseFeature.includes('beach')) {
      return <Sun className={className} />;
    }
    if (lowerCaseFeature.includes('furnished')) {
      return <BedDouble className={className} />;
    }
    if (lowerCaseFeature.includes('bunglow')) {
        return <Bed className={className} />;
      }
    if (lowerCaseFeature.includes('road')) {
      return <Car className={className} />;
    }
    if (lowerCaseFeature.includes('car')) {
      return <Car className={className} />;
    }
    if (lowerCaseFeature.includes('ocean')) {
      return <Waves className={className} />;
    }
    if (lowerCaseFeature.includes('sun')) {
      return <Sun className={className} />;
    }
    if (lowerCaseFeature.includes('sea')) {
        return <Waves className={className} />;
      }
    if (lowerCaseFeature.includes('mountain')) {
      return <Mountain className={className} />;
    }
    if (lowerCaseFeature.includes('hill')) {
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
    if (lowerCaseFeature.includes('dining')) {
      return <Utensils className={className} />;
    }
    if (lowerCaseFeature.includes('food')) {
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
      if (lowerCaseFeature.includes('view')) {
      return <View className={className} />;
    }
    if (lowerCaseFeature.includes('bed')) {
        return <Bed className={className} />;
      }
    return <Star className={className} />;
  }
