const validateImageUrl = (url: string, fallback: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(url); // If the image loads, return the original url
    img.onerror = () => resolve(fallback); // If the image load fails, return the fallback URL
    img.src = url;
  });
};

const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const loadFromLocalStorage = (key: string) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
};

export { validateImageUrl, saveToLocalStorage, loadFromLocalStorage };
