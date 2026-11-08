import type { MusicType } from './music-type.ts';

export interface MusicSearchResultItem {
  id: string;
  title: string;
  type: MusicType;
  description?: string;
}
