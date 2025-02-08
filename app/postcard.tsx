"use client";
import { useState } from "react";

function Postcard() {
  const [file, setFile] = useState();
  function handleChange(e) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div className="App">
      <br />
      <h2 className="text-xl font-bold mb-4 text-center">
        Post Card Generator
      </h2>
      <div className="flex items-center justify-center">
        <h2>Add Image:</h2>
        <input type="file" onChange={handleChange} />
      </div>
      <br />
      <div className="flex items-center justify-center">
        <img src={file} />
      </div>
    </div>
  );
}

export default Postcard;
