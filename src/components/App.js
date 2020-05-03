import React, { useState, useEffect, useRef } from "react";

const { app, dialog } = window.require("electron").remote;
const fs = require("fs");
const { resolve } = require("path");

const getContentsInADirectory = (directoryPath, callback) => {
  fs.readdir(directoryPath, (error, files) => {
    callback(files);
  });
};

const App = () => {
  const [directoryTree, setDirectoryTree] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newContentName, setNewContentName] = useState("");

  const rootDirRef = useRef(null);

  useEffect(() => {
    const configDir = app.getPath("home");
    console.log("configDir", configDir);

    // const appDir = app.getPath("home/documents");
    // console.log("appDir", appDir);

    rootDirRef.current = configDir;

    setSelectedFolder(configDir);

    getContentsInADirectory(configDir, (files) => {
      setDirectoryTree(files.filter((file) => !/[.]/.test(file)));
    });
  }, []);

  const onClickAddFolder = () => onClickSave(true);
  const onClickAddFile = () => onClickSave(false);

  const onClickSave = (isNewContentDirectory) => {
    dialog.showSaveDialog(
      { title: "Create magic", options: { defaultPath: selectedFolder } },
      (fileName) => {
        console.log(fileName);
        if (fileName) {
          if (isNewContentDirectory) {
            fs.mkdir(fileName, (error) => {
              if (error) {
                console.log("error in creating", error);
              }
            });
          } else {
            const writeStream = fs.createWriteStream(fileName);
            writeStream.end();
          }
        }
      }
    );
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>EMOCLEW</h1>
      <p style={{ textAlign: "center" }}>
        We all are running in a circle. We never know.
      </p>
      <div
        className="main-div"
        style={{ backgroundColor: "#fff", height: "100vh" }}
      >
        <div style={{ display: "inline-block" }}>
          <ul>
            {directoryTree.map((item) => (
              <li>
                <button
                  onClick={() => {
                    const path = `${rootDirRef.current}/${item}`;
                    console.log("final path of selcted folder", path);
                    setSelectedFolder(path);
                  }}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
          <div>
            Present directory {selectedFolder}
            <button onClick={onClickAddFolder} type="button">
              Add folder
            </button>
            <button onClick={onClickAddFile} type="button">
              Add file
            </button>
            {/* <input
              value={newContentName}
              onChange={(e) => setNewContentName(e.target.value)}
              type="text"
            /> */}
            {/* {newContentName.length ? (
              <button onClick={onClickSave} type="button">
                Save
              </button>
            ) : null} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
