import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { useForm } from "react-hook-form";
import { Settings, Upload } from "lucide-react";
import dotenv from "dotenv";

// Evironment variables
const IMGUR_ALBUM_ID = import.meta.env.VITE_IMGUR_ALBUM_ID;
const IMGUR_CLIENT_ID = import.meta.env.VITE_IMGUR_CLIENT_ID;
const IMGUR_CLIENT_SECRET = import.meta.env.VITE_IMGUR_CLIENT_SECRET;
const IMGUR_REFRESH_TOKEN = import.meta.env.VITE_IMGUR_REFRESH_TOKEN;
const IMGUR_AUTHORIZATION_CODE = import.meta.env.VITE_IMGUR_AUTHORIZATION_CODE;
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const IMGUR_BASE_URL = "https://api.imgur.com/3/image";
const GOOGLE_BASE_URL = `https://vision.googleapis.com/v1/images:annotate?fields=responses&key=${GOOGLE_API_KEY}`;
const SPOONACULAR_BASE_URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&addRecipeNutrition=true&size=636x393`;

enum FileType {
  Jpeg = "image/jpeg",
  Png = "image/png",
  Gif = "image/gif",
}

const dataForImageRecognition = {
  requests: [
    {
      image: {
        source: {
          imageUri: null,
        },
      },
      features: [
        {
          type: "LABEL_DETECTION",
        },
      ],
    },
  ],
};

const spoonacularFetchConfig = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

function App() {
  const [query, setQuery] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { register } = useForm();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imgurAccessToken, setImgurAccessToken] = useState("");
  const [imgurUploadProgress, setImgurUploadProgress] = useState(0);

  useEffect(() => {
    refreshAccessToken();
  }, []);

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      getRecipes();
    }
  };

  const fileValidation = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file: File = files[0];

      if (!file) {
        showError("errorNoFile");
        return;
      }

      if (!Object.values(FileType).includes(file.type as FileType)) {
        showError("errorIncorrectFile");
        return;
      }

      if (file.size > 10485760) {
        // 10MB limit
        showError("errorFileExceedsSize");
        return;
      }

      // disableInputs(true);
      // resetUIBeforeUpload();

      setImageFile(file);
      appendImgurFormData(file);
    }
  };

  const showError = (errorType: string) => {
    console.log("error:", errorType);
    // this.resetErrorMessages();
    // form.errorContainer.classList.remove("d-none");
    // form.errorContainer.classList.add("col-12", "mt-2w");
    // form[errorType].classList.remove("d-none");
    // form[errorType].classList.add("text-danger", "text-center");
    // form.fileInputForm.value = "";
    // this.disableInputs(false);
  };

  // refresh imgurAccessToken
  const refreshAccessToken = async () => {
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
      setImgurAccessToken(data.access_token);
    } else {
      console.error("Error refreshing token:", data);
    }
  };

  const appendImgurFormData = (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("album", IMGUR_ALBUM_ID);
    formData.append("privacy", "public");
    postImage(formData);
  };

  //POST request to IMGUR with image id supplied
  const postImage = async (formData: FormData) => {
    try {
      const response = await fetch(IMGUR_BASE_URL, {
        // to see the uploaded image on the page, MAKE SURE to open html page using live server with the `use local ip` setting checked
        // Imgur will not load images on the page if the ip address starts with 127.0.0.1
        method: "POST",
        body: formData,
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${imgurAccessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error with imgur POST response`);
      }
      const json = await response.json();
      postImageUrlToGoogle(json);
    } catch (error) {
      console.error(`Error with POSTing imgur file`);
    }
  };

  //POST request to Google's Cloud Vision API with image from IMGUR to label the object in the image
  const postImageUrlToGoogle = async (json) => {
    const imageURL = json.data.link;
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
      onImageRecognitionSuccess(json);
    } catch (error) {
      console.error("Error with POSTing image label to Google");
    }
  };

  const onImageRecognitionSuccess = (data) => {
    const labelAnnotations = data.responses[0]?.labelAnnotations;
    // if (!labelAnnotations) {
    //   this.showRecognitionFailure();
    //   return;
    // }

    const [firstAnnotation] = labelAnnotations;
    const { description: imageTitle, score } = firstAnnotation;

    // this.imageTitleHandler.displayImageTitle(imageTitle, score);
    // this.domManager.app.imageRecognitionStatusText.classList = "d-none";

    // Get recipes based on title
    getRecipes(imageTitle);
  };

  const onImageRecognitionError = (error) => {
    console.error("Image recognition error:", error);
    // Add error UI handling here
  };

  const getRecipes = async (query: string) => {
    try {
      const response = await fetch(
        `${SPOONACULAR_BASE_URL}&number=100&query=${query}`,
        spoonacularFetchConfig
      );
      if (!response.ok) {
        throw new Error(`Error with get fetch request with query ${query}`);
      }
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(`Error with fetching recipes with query ${query}`);
    }
  };

  return (
    <div className="m-10">
      <header className="row mb-0 flex items-center justify-between">
        <h1 className="mb-0 pb-0 text-2xl font-extrabold">Snappy Recipes</h1>
        <div className="flex">
          <Button className="border border-black bg-white font-bold text-black">
            Show Favorites
          </Button>
          <Button className="ml-2 border border-black bg-white font-bold text-black">
            <Settings className="h-4 w-4"></Settings>
          </Button>
        </div>
      </header>
      <div className="mt-3">
        <label htmlFor="input" className="text-sm font-semibold">
          Search Recipes
        </label>
        <div className="row flex">
          <Button
            onClick={handleUploadButtonClick}
            className="rounded-br-none rounded-tr-none"
          >
            <Upload />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={fileValidation}
          />
          <Input
            id="input"
            placeholder="Search by entering your ingredient or upload an image"
            onChange={(event) => handleQueryChange(event)}
            onKeyDown={(event) => handleKeyDown(event)}
            className="rounded-br-none rounded-tr-none"
            name=""
          />
          <Button
            onClick={() => getRecipes()}
            className="rounded-bl-none rounded-tl-none"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
