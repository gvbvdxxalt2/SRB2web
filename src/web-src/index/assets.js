//External script now for easy access.
const ASSET_LIST_NORMAL = [
    { url: "assets/characters.pk3", filename: "characters.pk3" },
    { url: "assets/music.pk3", filename: "music.pk3" },
    { url: "assets/srb2.pk3", filename: "srb2.pk3" },
    { url: "assets/zones.pk3", filename: "zones.pk3" },
  ];

//Asset lists:
const ASSET_TYPES = {
  original: ASSET_LIST_NORMAL,
};

//Note to self: change this once you update/merge any updates and change the resources.
const CACHE_NAME = "srb2-assets-v1";

module.exports = {
    ASSET_TYPES,
    CACHE_NAME
};