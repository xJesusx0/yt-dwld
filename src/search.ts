import { Innertube, YTNodes, Helpers, Log } from 'youtubei.js';
import { isAllowedType, normalizeMusicType } from './music-type.ts';
import type { MusicSearchResultItem } from './types.ts';

// Silencia los avisos del parser (p. ej. "TextBadge not found!")
Log.setLevel(Log.Level.NONE);

const innertube = await Innertube.create({
  cookie: process.env.YT_COOKIE,
});
const count = {
  cardShelf: 0,
  itemSection: 0,
  musicShelf: 0,
};

// const artist = await innertube.music.getArtist('UCoHRmfxqEHTHoNTddLS3ErQ');
// console.log(await artist.getAllSongs());

function mapMusicResponsiveListItem(item: YTNodes.MusicResponsiveListItem): MusicSearchResultItem {
  const mapped: MusicSearchResultItem = {
    id: item.id ?? item.endpoint?.payload.browseId,
    title: item.title ?? '',
    type: normalizeMusicType(item.item_type),
  };

  if (mapped.type === 'song') {
    mapped.description = item.artists?.map((artist) => artist.name).join(' & ');
  }

  return mapped;
}

type SearchResult =
  | Helpers.ObservedArray<YTNodes.MusicShelf | YTNodes.MusicCardShelf | YTNodes.ItemSection>
  | undefined;
function handleSearchResult(contents: SearchResult) {
  if (!contents) {
    return [];
  }

  const items: MusicSearchResultItem[] = [];

  contents.forEach((result) => {
    if (result.is(YTNodes.MusicCardShelf)) {
      items.push(...handleMusicCardShelf(result));
      count.cardShelf += 1;
    } else if (result.is(YTNodes.ItemSection)) {
      items.push(...handleItemSection(result));
      count.itemSection += 1;
    } else if (result.is(YTNodes.MusicShelf)) {
      // Pass
      count.musicShelf += 1;
    }
  });

  return items.filter((r) => isAllowedType(r.type));
}

function handleItemSection(result: YTNodes.ItemSection) {
  const content: MusicSearchResultItem[] = [];
  result.contents.forEach((item) => {
    if (item.is(YTNodes.MusicResponsiveListItem)) {
      content.push(mapMusicResponsiveListItem(item));
    }
  });

  return content;
}

function handleMusicCardShelf(result: YTNodes.MusicCardShelf) {
  const artist: MusicSearchResultItem = {
    id: result.title.endpoint?.payload.browseId,
    title: result.title.text ?? '',
    type: 'artist',
  };

  const content: MusicSearchResultItem[] = [];

  result.contents
    ?.filter((item) => item.is(YTNodes.MusicResponsiveListItem))
    .forEach((item) => {
      content.push(mapMusicResponsiveListItem(item));
    });

  content?.push(artist);
  return content;
}

export async function search(query: string) {
  const results = await innertube.music.search(query);

  return handleSearchResult(results.contents);
}
