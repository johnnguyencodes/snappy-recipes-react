// Environment variables
const IMGUR_ALBUM_ID = import.meta.env.VITE_IMGUR_ALBUM_ID;
const IMGUR_CLIENT_ID = import.meta.env.VITE_IMGUR_CLIENT_ID;
const IMGUR_CLIENT_SECRET = import.meta.env.VITE_IMGUR_CLIENT_SECRET;
const IMGUR_REFRESH_TOKEN = import.meta.env.VITE_IMGUR_REFRESH_TOKEN;
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const IMGUR_BASE_URL = "https://api.imgur.com/3/image";
const GOOGLE_BASE_URL = `https://vision.googleapis.com/v1/images:annotate?fields=responses&key=${GOOGLE_API_KEY}`;
const SPOONACULAR_BASE_URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&addRecipeNutrition=true&size=636x393`;

interface ImageSource {
  imageUri: string | null;
}

const googleData = {
  requests: [
    {
      image: {
        source: {
          imageUri: null,
        } as ImageSource,
      },
      features: [
        {
          type: "LABEL_DETECTION",
        },
      ],
    },
  ],
};

// refresh Imgur Access Token
const refreshAccessToken = async (
  showError: (
    errorType: string,
    setErrorMessage: (message: string) => void,
    query: string | null
  ) => void,
  setErrorMessage: (message: string) => void
): Promise<string | null> => {
  try {
    const response = await fetch("https://api.imgur.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: IMGUR_CLIENT_ID,
        client_secret: IMGUR_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: IMGUR_REFRESH_TOKEN,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.access_token;
    } else {
      showError("errorRefreshToken", setErrorMessage, null);
      console.error("Error refreshing token:", data);
      return null;
    }
  } catch (error) {
    showError("errorRefreshToken", setErrorMessage, null);
    console.error("Error refreshing token:", error);
    return null;
  }
};

// Append form data for Imgur
const appendImgurFormData = (file: File): FormData => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("album", IMGUR_ALBUM_ID);
  formData.append("privacy", "public");
  return formData;
};

//POST image to Imgur
const postImage = async (
  formData: FormData,
  accessToken: string,
  showError: (
    errorType: string,
    setErrorMessage: (message: string) => void,
    query: string | null
  ) => void,
  setErrorMessage: (message: string) => void
) => {
  if (!formData || !accessToken) {
    showError("errorPostImageData", setErrorMessage, null);
    throw new Error("Missing formData or accessToken for posting image");
  }

  try {
    const response = await fetch(IMGUR_BASE_URL, {
      // to see the uploaded image on the page, MAKE SURE to open html page using live server with the `use local ip` setting checked
      // Imgur will not load images on the page if the ip address starts with 127.0.0.1
      method: "POST",
      body: formData,
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error with imgur POST response`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    showError("errorPostImage", setErrorMessage, null);
    console.error(`Error with POSTing imgur file:`, error);
    throw error;
  }
};

//POST image URL to Google's Cloud Vision API
const postImageUrlToGoogle = async (
  imageURL: string,
  showError: (
    errorType: string,
    setErrorMessage: (message: string) => void,
    query: string | null
  ) => void,
  setErrorMessage: (message: string) => void
) => {
  try {
    // Validate image url
    new URL(imageURL);
  } catch {
    showError("errorPostUrlToGoogle", setErrorMessage, null);
    throw new Error("Error with POSTing image URL to Google");
  }

  googleData.requests[0].image.source.imageUri = imageURL;

  try {
    const response = await fetch(GOOGLE_BASE_URL, {
      method: "POST",
      body: JSON.stringify(googleData),
    });
    if (!response.ok) {
      showError("errorGooglePostResponse", setErrorMessage, null);
      throw new Error("Error with Google POST response");
    }
    const json = await response.json();
    if (!json || typeof json !== "object" || !Array.isArray(json.responses)) {
      showError("errorMalformedGoogleResponse", setErrorMessage, null);
      console.warn(
        "Recieved empty or malformed response from Google API:",
        json
      );
      return {};
    }
    return json;
  } catch (error) {
    showError("errorPostImageUrlToGoogle", setErrorMessage, null);
    console.error("Error with POSTing image URL to Google:", error);
    throw error;
  }
};

// interface LabelAnnotation {
//   description: string;
//   score?: number;
// }

// interface ImageRecognitionResponse {
//   responses: {
//     labelAnnotations?: LabelAnnotation[];
//   }[];
// }

// const onImageRecognitionSuccess = (
//   data: ImageRecognitionResponse,
//   showError: (
//     errorType: string,
//     setErrorMessage: (message: string) => void,
//     query: string | null
//   ) => void,
//   setErrorMessage: (message: string) => void
// ) => {
//   const labelAnnotations = data.responses[0]?.labelAnnotations;
//   // if (!labelAnnotations) {
//   //   this.showRecognitionFailure();
//   //   return;
//   // }

//   if (!labelAnnotations || labelAnnotations.length === 0) {
//     showError("errorNoLabelAnnotions", setErrorMessage, null);
//     console.error("No label annotations found.");
//     return;
//   }

//   const [firstAnnotation] = labelAnnotations;
//   // Score will be a variable I will use in the future, ignoring for now
//   // @ts-ignore
//   const { description: imageTitle, score } = firstAnnotation;

//   // // Get recipes based on title
//   // getRecipes(imageTitle, showError, setErrorMessage);
// };

// const onImageRecognitionError = (error) => {
//   console.error("Image recognition error:", error);
//   // Add error UI handling here
// };

// Fetch recipes from Spoonacular
const getRecipes = async (
  query: string,
  intolerances: string,
  restrictions: string,
  showError: (
    errorType: string,
    setErrorMessage: (message: string) => void,
    query: string | null
  ) => void,
  setErrorMessage: (message: string) => void
) => {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    try {
      const response = await fetch("/spoonacularCache.json");
      if (response?.ok) {
        return await response.json();
      } else {
        console.error("Local JSON fetch failed or returned non-OK response.");
      }
    } catch (error) {
      console.error("Error reading local dev JSON spoonacularCache:", error);
      // Return undefined explicitly for failed local fetch
      return undefined;
    }
  }

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}&number=100&query=${query}&intolerances=${intolerances}&diet=${restrictions}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 402) {
      showError("errorSpoonacularLimitReached", setErrorMessage, null);
      throw new Error(
        "Spoonacular API limit reached. Please try again an 24 hours."
      );
    } else if (!response.ok) {
      showError("errorSpoonacularGetRequest", setErrorMessage, query);
      throw new Error(`Error with GET fetch request with query ${query}`);
    }

    // Validate and catch JSON parsing errors
    let json;
    try {
      json = await response.json();
    } catch (error) {
      showError("errorMalformedSpoonacularResponse", setErrorMessage, query);
      console.error(`Error with malformeed JSON response`, error);
      throw new Error("Malformed JSON response");
    }

    return json;
  } catch (error) {
    console.error(`Error with fetching recipes with query ${query}`, error);
    throw error;
  }
};

export {
  refreshAccessToken,
  appendImgurFormData,
  postImage,
  postImageUrlToGoogle,
  getRecipes,
};
