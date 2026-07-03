export interface RSVPSubmission {
  id: number;
  name: string;
  guests: number;
  phone: string;
  attendance: boolean;
  notes: string;
  date: string;
}

export interface WellWish {
  id: number;
  name: string;
  message: string;
  date: string;
}

export interface TimelineEvent {
  id: number;
  titleEn: string;
  titleAr: string;
  dateEn: string;
  dateAr: string;
  descEn: string;
  descAr: string;
  icon: string;
}

export interface GalleryItem {
  id: number;
  src: string;
  title: string;
  category: string;
}
