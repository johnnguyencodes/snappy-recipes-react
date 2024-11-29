const validateImageUrl = (url: string, fallback: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(url); // If the image loads, return the original url
    img.onerror = () => resolve(fallback); // If the image load fails, return the fallback URL
    img.src = url;
  });
};

export { validateImageUrl };
