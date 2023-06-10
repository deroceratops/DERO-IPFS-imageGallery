import PropTypes from "prop-types";
import to from "await-to-js";
import { useState, useEffect } from "react";
import scid from "../scid.js";
import { hex2a } from "../helpers.js";
import Spinner from "./Spinner";
import { useDataContext } from "../context/DataContext";

const Form = ({ JWT, bridgeInitText, deroBridgeApi, pinataBaseURL }) => {
  const {
    upLoading,
    setUpLoading,
    info,
    setInfo,
    CID,
    setCID,
    fileCIDsToDisplay,
    setFileCIDsToDisplay,
  } = useDataContext();
  const [file, setFile] = useState("");

  useEffect(() => {
    const FetchFileCIDs = async () => {
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
      FetchFileCIDs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bridgeInitText]);

  async function handleUpload(e) {
    e.preventDefault();

    if (!file) {
      setInfo(["Select a file to upload.", "red"]);
      return;
    }

    setUpLoading(true);

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
        setUpLoading(false);

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
        setUpLoading(false);
        setInfo(["Upload failed.", "red"]);
        console.error(error);
      });
  };

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

  return (
    <>
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
          return upLoading ? <Spinner className="formSpinner" /> : null;
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
    </>
  );
};

Form.propTypes = {
  loading: PropTypes.bool,
  JWT: PropTypes.string,
  bridgeInitText: PropTypes.string,
  deroBridgeApi: PropTypes.object,
  pinataBaseURL: PropTypes.string,
};

export default Form;
