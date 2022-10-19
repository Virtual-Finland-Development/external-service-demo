export const JSONSessionStorage = {
  get(key: string) {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  set(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
};
