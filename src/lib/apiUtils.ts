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

const dataForImageRecognition = {
  requests: [
    {
      image: {
        source: {
          imageUri: null, // initial value is null
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
const refreshAccessToken = async (): Promise<string | null> => {
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
      console.error("Error refreshing token:", data);
      return null;
    }
  } catch (error) {
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
const postImage = async (formData: FormData, accessToken: string) => {
  if (!formData || !accessToken) {
    throw new Error("Missing formData or accessToken");
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
    console.error(`Error with POSTing imgur file:`, error);
    throw error;
  }
};

//POST image URL to Google's Cloud Vision API
const postImageUrlToGoogle = async (imageURL: string) => {
  dataForImageRecognition.requests[0].image.source.imageUri = imageURL;
  try {
    const response = await fetch(GOOGLE_BASE_URL, {
      method: "POST",
      body: JSON.stringify(dataForImageRecognition),
    });
    if (!response.ok) {
      throw new Error("Error with Google POST response");
    }
    const json = await response.json();

    if (!json || typeof json !== "object" || !Array.isArray(json.responses)) {
      console.warn(
        "Recieved empty or malformed response from Google API:",
        json
      );
      return {};
    }
    return json;
  } catch (error) {
    console.error("Error with POSTing image label to Google:", error);
    throw error;
  }
};

interface LabelAnnotation {
  description: string;
  score?: number;
}

interface ImageRecognitionResponse {
  responses: {
    labelAnnotations?: LabelAnnotation[];
  }[];
}

// Will use the following function when I work on the UI of the app
// @ts-ignore
const onImageRecognitionSuccess = (data: ImageRecognitionResponse) => {
  const labelAnnotations = data.responses[0]?.labelAnnotations;
  // if (!labelAnnotations) {
  //   this.showRecognitionFailure();
  //   return;
  // }

  if (!labelAnnotations || labelAnnotations.length === 0) {
    console.error("No lable annotations found.");
    return;
  }

  const [firstAnnotation] = labelAnnotations;
  // Score will be a variable I will use in the future, ignoring for now
  // @ts-ignore
  const { description: imageTitle, score } = firstAnnotation;

  // Get recipes based on title
  getRecipes(imageTitle);
};

// const onImageRecognitionError = (error) => {
//   console.error("Image recognition error:", error);
//   // Add error UI handling here
// };

// Fetch recipes from Spoonacular
const getRecipes = async (query: string) => {
  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}&number=100&query=${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error with GET fetch request with query ${query}`);
    }
    const json = await response.json();
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
