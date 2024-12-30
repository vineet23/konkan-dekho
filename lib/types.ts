// ... existing imports

export interface PlotMedia {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string; // Thumbnail for videos
}

export interface Plot {
  id: number;
  title: string;
  location: string;
  area: string;
  price: string;
  description: string;
  features: string[];
  images: string[];
  media: PlotMedia[];
  coordinates: {
    latitude: string;
    longitude: string;
  };
}