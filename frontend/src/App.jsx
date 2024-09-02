import { useState } from "react";

function App() {
  const [imagesState, setImagesState] = useState([]);
  const [message, setMessage] = useState("");
  const selectFilesHandler = async (e) => {
    const imagesData = [];
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      imagesData.push(readFileHandler(files[i]));
    }
  };

  const readFileHandler = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagesState((curr) => [...curr, reader.result]);
      return reader.result;
    };
  };

  const uploadFilesHandler = async () => {
    setMessage("Uploading...");
    const formData = new FormData();
    for (let i = 0; i < imagesState.length; i++) {
      let file = imagesState[i];
      formData.append("file", file);
    }
    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data) {
        setMessage("Done!");
      }
      console.log(data);
    } catch (e) {
      console.log(e);
      setMessage("Error! Could not upload");
    }
  };
  return (
    <>
      <input
        type="file"
        onChange={selectFilesHandler}
        accept="image/*"
        multiple="multiple"
      />
      <button onClick={uploadFilesHandler}>upload</button>
      <p>{message}</p>
    </>
  );
}

export default App;
