import * as mobilenet from "@tensorflow-models/mobilenet";
import { useEffect, useRef, useState } from "react";

function App() {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const [result, setResult] = useState([]);
  const [history, setHistory] = useState([]);

  const imageRef = useRef();
  const textImageRef = useRef();

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
    textImageRef.current.value = "";
    const results = await model.classify(imageRef.current);
    setResult(results);
  };

  const onChange = (e) => {
    setImageUrl(e.target.value);
    setResult([]);
  };

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    if (imageUrl) {
      setHistory([imageUrl, ...history]);
    }
  }, [imageUrl]);

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
        <span>OR</span>
        <input
          type="text"
          placeholder="Image url"
          ref={textImageRef}
          onChange={onChange}
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
      {result.length > 0 && (
        <div>
          {result.map((result, index) => {
            return (
              <div key={result.className}>
                <span>{result.className}</span>
                <span>
                  Confidence level: {(result.probability * 100).toFixed(2)}%
                  {index === 0 && <span>Best guess</span>}
                </span>
              </div>
            );
          })}
        </div>
      )}
      <div className="recentPredictions">
        <h2>Recent images</h2>
        <div className="Recent images">
          {history.length > 0 &&
            history.map((image, index) => {
              return (
                <div key={`${image}${index}`}>
                  <img
                    width="200px"
                    src={image}
                    alt="Recent prediction"
                    onClick={() => {
                      setImageUrl(image);
                    }}
                  ></img>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default App;
