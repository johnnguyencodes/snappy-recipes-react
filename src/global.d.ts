declare global {
  var importMeta: {
    env: {
      VITE_SPOONACULAR_API_KEY: string;
      VITE_IMGUR_CLIENT_ID: string;
      VITE_IMGUR_CLIENT_SECRET: string;
      VITE_IMGUR_ALBUM_ID: string;
      VITE_IMGUR_AUTHORIZATION_CODE: string;
      VITE_IMGUR_REFRESH_TOKEN: string;
      VITE_SPOONACULAR_API_KEY: string;
      VITE_GOOGLE_API_KEY: string;
    };
  };

  // If global.fetch is not recognized
  var fetch: typeof fetch;
}

export {};
