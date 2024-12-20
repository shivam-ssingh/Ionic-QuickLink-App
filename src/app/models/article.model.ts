import { UserPhoto } from './photo.model';

export interface Article {
  id?: string;
  url: string;
  title: string;
  description?: string;
  tags?: string[];
  thumbnail?: string;
  dateAdded: Date;
  metadata?: {
    extractedTitle?: string;
    extractedDescription?: string;
    extractedImage?: string;
  };
  userPhoto?: UserPhoto;
}
