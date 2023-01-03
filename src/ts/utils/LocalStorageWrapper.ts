abstract class LocalStorageWrapper {
  static set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static get<T>(key: string) {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : null;
  }
}

export default LocalStorageWrapper;
