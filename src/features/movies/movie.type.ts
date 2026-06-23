export interface HeroMovie {
  id: number;
  title: string;
  banner: string;
  poster?: string;
  description?: string;
}

export interface CarouselItem {
  id: number;
  image: string;

  title?: string;
  description?: string;

  primaryButton?: {
    label: string;
    onClick: () => void;
  };

  secondaryButton?: {
    label: string;
    onClick: () => void;
  };
}
