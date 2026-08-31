// DodgeTracker — single source of truth for every LCU endpoint the plugin
// touches. When Riot changes a path in a new patch (or Pengu changes URL
// routing), this is the only file that needs updating.
//
// Conventions:
//   - Constants for fixed paths, builder functions when a parameter is needed.
//   - All paths use the single-slash form ("/lol-...", "/riotclient/..."),
//     which is the correct routing for Pengu Loader v1.1+.

// ── Summoner ──
export const LCU_CURRENT_SUMMONER = "/lol-summoner/v1/current-summoner";
// ids is a vector<uint64_t> on the LCU side: it wants a JSON-ish collection,
// NOT a comma separated scalar. `?ids=123` returns
// 400 "Couldn't assign value to 'ids' of type vector because the input not a
// collection" — so always emit `[a,b,c]`.
export const lcuSummonersByIds = (ids) =>
    `/lol-summoner/v2/summoners?ids=[${ids.join(",")}]`;
export const lcuSummonerById = (id) =>
    `/lol-summoner/v1/summoners/${id}`;
// Resolve summoners by Riot ID game name (same region).
// POST body: ["GameName", ...] → [ { puuid, gameName, tagLine, ... }, ... ]
//
// NEVER use `/lol-summoner/v1/summoners?name=...` to do this. That query
// matches the LEGACY summonerName field, which since the Riot ID migration
// (2023-11-20) is a random uuidv4 string for accounts created afterwards —
// so it cannot match a Riot ID game name. Worse, on current client builds an
// ignored/unknown query param makes the endpoint fall back to returning the
// CURRENT summoner, which silently bound manually added entries to your own
// account (the v1.2.5 bug: "最終の謎#JP1" became "Thefinalanswer#JP1").
export const LCU_SUMMONERS_BY_NAMES = "/lol-summoner/v2/summoners/names";

// ── Champ select ──
export const LCU_CHAMP_SELECT_SESSION = "/lol-champ-select/v1/session";

// ── Gameflow ──
export const LCU_GAMEFLOW_PHASE = "/lol-gameflow/v1/gameflow-phase";

// ── Riot client ──
export const LCU_REGION_LOCALE = "/riotclient/region-locale";
export const RIOT_CLIENT_CHAT_PARTICIPANTS = "/riotclient/chat/v5/participants";
// Legacy double-slash variant — kept ONLY as a fallback because Pengu v1.2
// changed riotclient URL routing. Remove once v1.2 is confirmed stable.
export const RIOT_CLIENT_CHAT_PARTICIPANTS_LEGACY = "//riotclient/chat/v5/participants";

// ── Chat ──
export const LCU_CHAT_CONVERSATIONS = "/lol-chat/v1/conversations";
export const lcuChatMessages = (chatId) =>
    `/lol-chat/v1/conversations/${chatId}/messages`;

// ── Match history / ranked stats ──
export const lcuMatchHistory = (puuid, begIndex = 0, endIndex = 21) =>
    `/lol-match-history/v1/products/lol/${puuid}/matches?begIndex=${begIndex}&endIndex=${endIndex}`;
export const lcuRankedStats = (puuid) =>
    `/lol-ranked/v1/ranked-stats/${puuid}`;
