import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Upload } from "lucide-react";
import { IFormProps } from "types/AppTypes";

const Form: React.FC<IFormProps> = ({
  query,
  errorMessage,
  selectedImagePreviewUrl,
  statusMessage,
  handleQueryChange,
  handleKeyDown,
  handleUploadButtonClick,
  handleFileChange,
  handleSearch,
  handleSettingsClick,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <header className="row mb-0 flex items-center justify-between">
        <h1 className="mb-0 pb-0 text-2xl font-extrabold">Snappy Recipes</h1>
        {statusMessage && (
          <div className="error-message mb-4 rounded bg-green-100 p-2 text-green-600">
            {statusMessage}
          </div>
        )}
        <div className="flex">
          <Button className="border border-black bg-white font-bold text-black">
            Show Favorites
          </Button>
          <Button
            onClick={handleSettingsClick}
            className="ml-2 border border-black bg-white font-bold text-black"
          >
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
            onChange={handleFileChange}
          />
          <Input
            id="input"
            ref={searchInputRef}
            placeholder="Search by entering your ingredient or upload an image"
            onChange={(event) => handleQueryChange(event)}
            onKeyDown={(event) => handleKeyDown(event)}
            className="rounded-br-none rounded-tr-none"
            name=""
          />
          <Button
            onClick={() => handleSearch(query)}
            className="rounded-bl-none rounded-tl-none"
          >
            Submit
          </Button>
        </div>
        {errorMessage && (
          <div className="error-message mb-4 rounded bg-red-100 p-2 text-red-600">
            {errorMessage}
          </div>
        )}
        {selectedImagePreviewUrl && (
          <div>
            <img
              src={selectedImagePreviewUrl}
              alt="recipe preview"
              width="200px"
              height="100%"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
