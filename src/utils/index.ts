export const JSONSessionStorage = {
  get(key: string) {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  set(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  clear() {
    sessionStorage.clear();
  },
};

// Helper function to remove trailing slashes from string
export function removeTrailingSlash(str: string) {
  return str.endsWith('/') ? str.slice(0, -1) : str;
}
