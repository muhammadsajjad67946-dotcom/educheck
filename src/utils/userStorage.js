export function getUserStorageKey(baseKey, user) {
  const identity = user?.id || user?.email || 'anonymous'
  return `${baseKey}_${encodeURIComponent(String(identity).trim().toLowerCase())}`
}