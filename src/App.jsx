import "./App.css";
import { useState, useEffect, useRef } from "react";
import DeroBridgeApi from "dero-rpc-bridge-api";
import to from "await-to-js";
import Images from "./components/Images";
import Spinner from "./components/Spinner";
import scid from "./scid.js";
import { hex2a } from "./helpers.js";

// TODO: Refactor into several files if possible.
function App() {
  const deroBridgeApiRef = useRef();
  const deroBridgeApi = deroBridgeApiRef.current;
  const [bridgeInitText, setBridgeInitText] = useState("");
  const [file, setFile] = useState("");
  const [fileCIDsToDisplay, setFileCIDsToDisplay] = useState([]);
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [CID, setCID] = useState("");

  const pinataBaseURL = "https://beige-colossal-snail-501.mypinata.cloud/ipfs/";
  const JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzODJmMmVjOC1hMzYwLTQ2ZjAtYTRhYS02MDBlNzU2YTIwNmQiLCJlbWFpbCI6ImNvbnNlcXVlbnRydWJiZXJzQHByb3Rvbi5tZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI0MzYxN2VjNzA0ZWZlYzkwZTBlNyIsInNjb3BlZEtleVNlY3JldCI6IjJhZDI1NjMzZjM5ZTMwZGM5YzY3MWJiMDU5MjZmYWQxY2ZhYjkyOTdiNDhmMTYzYzlkYzhiNjZjZTc2NDg1N2YiLCJpYXQiOjE2ODYzMTMzODJ9.gZXqcnKMYMoEWidq1Q141ndELkE3UIckxdaZoEXl_oU";

  useEffect(() => {
    const load = async () => {
      deroBridgeApiRef.current = new DeroBridgeApi();
      const deroBridgeApi = deroBridgeApiRef.current;
      const [err] = await to(deroBridgeApi.init());
      if (err) {
        setBridgeInitText("Failed to connect to extension");
      } else {
        setBridgeInitText("Connected to extension");
      }
    };
    window.addEventListener("load", load);
    return () => {
      window.removeEventListener("load", load);
    };
  }, []);

  useEffect(() => {
    const GetFileCIDs = async () => {
      const [err, res] = await to(
        deroBridgeApi.daemon("get-sc", {
          scid,
          variables: true,
        })
      );

      if (err) {
        console.log(err);
      } else {
        const stringKeys = res.data.result.stringkeys;
        const cidCount = stringKeys.cidCount;

        const cidArray = [];
        for (let i = 0; i < cidCount; i++) {
          cidArray.push(hex2a(stringKeys["cid_" + i]));
        }
        setFileCIDsToDisplay(cidArray.reverse());
      }
    };

    if (bridgeInitText === "Connected to extension") {
      GetFileCIDs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bridgeInitText]);

  const saveFileCID = async (IpfsHash) => {
    const [err, res] = await to(
      deroBridgeApi.wallet("start-transfer", {
        ringsize: 2,
        scid,
        sc_rpc: [
          {
            name: "entrypoint",
            datatype: "S",
            value: "AddIpfsCID",
          },
          {
            name: "cid",
            datatype: "S",
            value: IpfsHash,
          },
        ],
      })
    );

    if (err) {
      console.log(err);
    } else {
      console.log(res);
      let newFileCIDs = fileCIDsToDisplay.slice();
      newFileCIDs.unshift(IpfsHash);
      setFileCIDsToDisplay(newFileCIDs);
    }
  };

  async function handleUpload(e) {
    e.preventDefault();

    if (!file) {
      setInfo(["Select a file to upload.", "red"]);
      return;
    }

    setLoading(true);

    pinFileToIPFS(file, JWT);
  }

  const pinFileToIPFS = async (file, JWT) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${JWT}`);

    const formdata = new FormData();
    formdata.append("file", file, file.name);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        setLoading(false);

        if (Object.keys(result).includes("error")) {
          console.error(result.error);
          setInfo(["Upload failed. " + result.error.details, "red"]);
          return;
        }

        const IpfsHash = result.IpfsHash;

        if (fileCIDsToDisplay.includes(IpfsHash)) {
          setInfo(["That file has already been uploaded. ", "red"]);
          return;
        }

        setInfo(["File uploaded. ", "green"]);

        setCID(IpfsHash);
        saveFileCID(IpfsHash);
      })
      .catch((error) => {
        setLoading(false);
        setInfo(["Upload failed.", "red"]);
        console.error(error);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>DERO Image Gallery</h1>
      </header>
      <p className="bridegeInitText">{bridgeInitText}</p>
      <form action="" id="form">
        <input
          type="file"
          name="fileInput"
          id="fileInput"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <input
          type="submit"
          value="Upload"
          name="Upload"
          id="upload"
          onClick={handleUpload}
        />
        {(() => {
          return loading ? <Spinner className="formSpinner" /> : null;
        })()}
      </form>

      <p className={`${info[1]}`}>
        {info[0]}
        {(() => {
          return CID ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${pinataBaseURL}${CID}`}
            >
              Link to file
            </a>
          ) : (
            ""
          );
        })()}
      </p>
      <Images fileCIDs={fileCIDsToDisplay} baseURL={pinataBaseURL} />
    </div>
  );
}

export default App;
