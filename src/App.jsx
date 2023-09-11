import * as mobilenet from "@tensorflow-models/mobilenet";
import { useEffect, useRef, useState } from "react";

function App() {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const imageRef = useRef();

  const loadModel = async () => {
    setIsModelLoading(true);
    try {
      const model = await mobilenet.load();
      setModel(model);
      setIsModelLoading(false);
    } catch (error) {
      console.log(error);
      setIsModelLoading(false);
    }
  };

  const uploadImage = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  };

  const identifyImage = async () => {
    const results = await model.classify(imageRef.current);
    console.log(results);
  };

  useEffect(() => {
    loadModel();
  }, []);

  if (isModelLoading) {
    return <h2>Model loading</h2>;
  }

  console.log(imageUrl);

  return (
    <>
      <h1>Hello</h1>
      <div>
        <input
          type="file"
          accept="image/*"
          capture="camera"
          onChange={uploadImage}
          className="uploadInput"
        />
      </div>
      <div className="mainWrapper">
        <div className="mainConten">
          <div className="imageHolder">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Upload preview"
                crossOrigin="anonymous"
                ref={imageRef}
              />
            )}
          </div>
        </div>
        {imageUrl && (
          <button className="button" onClick={identifyImage}>
            Identify image
          </button>
        )}
      </div>
    </>
  );
}

export default App;
