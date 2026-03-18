const BASE_URL = 'https://api.are.na/v3';

const makeHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const checkOk = async (res) => {
  if (res.ok) return res.json();
  const body = await res.json().catch(() => ({}));
  throw new Error(body.error || `HTTP ${res.status}`);
};

export const getUser = (slug) =>
  fetch(`${BASE_URL}/users/${slug}`).then(checkOk);

export const getMe = (token) =>
  fetch(`${BASE_URL}/me`, { headers: makeHeaders(token) }).then(checkOk);

export const getUserChannels = (userId, token, { page = 1, per = 100 } = {}) =>
  fetch(
    `${BASE_URL}/users/${userId}/contents?type=Channel&page=${page}&per=${per}`,
    { headers: makeHeaders(token) }
  ).then(checkOk);

export const getChannel = (slugOrId, token) =>
  fetch(`${BASE_URL}/channels/${slugOrId}`, {
    headers: makeHeaders(token),
  }).then(checkOk);

/**
 * Maps the user-provided JSON block shape to the v3 API payload.
 * Supported input formats:
 *   { content: "url or text", title?, description? }  (documented format)
 *   { value: "url or text", ... }                     (v3 native)
 *   { source: "url" | { url: "..." }, ... }           (are.na export format)
 */
export const createBlock = (channelSlug, block, token) => {
  let value = block.value ?? block.content ?? null;

  if (value === null && block.source) {
    value =
      typeof block.source === 'string' ? block.source : block.source?.url ?? null;
  }

  if (!value) throw new Error('Block is missing a value/content/source field');

  const body = {
    value,
    channel_ids: [channelSlug],
    ...(block.title ? { title: block.title } : {}),
    ...(block.description ? { description: block.description } : {}),
  };

  return fetch(`${BASE_URL}/blocks`, {
    method: 'POST',
    headers: makeHeaders(token),
    body: JSON.stringify(body),
  }).then(checkOk);
};
