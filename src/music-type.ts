export type MusicType =
  | 'playlist'
  | 'artist'
  | 'album'
  | 'song'
  | 'non_music_track'
  | 'video'
  | 'podcast_show'
  | 'unknown';

const MUSIC_TYPES: MusicType[] = [
  'playlist',
  'artist',
  'album',
  'song',
  'non_music_track',
  'video',
  'podcast_show',
  'unknown',
];

const allowedTypes: MusicType[] = ['song'];

export function normalizeMusicType(value?: string | null): MusicType {
  return MUSIC_TYPES.includes(value as MusicType) ? (value as MusicType) : 'unknown';
}

export function isAllowedType(type: MusicType): boolean {
  return allowedTypes.includes(type);
}
