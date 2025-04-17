export interface AirBnbDetailItem {
  title: string;
}

export interface AirBnbPhotoTour {
  mediaItems: {
    accessibilityLabel: string;
    baseUrl: string;
    imageMetadata: {
      caption: string;
    };
  }[];
}
