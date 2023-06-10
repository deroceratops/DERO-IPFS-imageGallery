import "./App.css";
import { useState, useEffect, useRef } from "react";
import DeroBridgeApi from "dero-rpc-bridge-api";
import to from "await-to-js";
import Images from "./components/Images";
import Fullscreen from "./components/Fullscreen";
import Form from "./components/Form";
import { DataProvider } from "./context/DataContext";

function App() {
  const deroBridgeApiRef = useRef();
  const deroBridgeApi = deroBridgeApiRef.current;
  const [bridgeInitText, setBridgeInitText] = useState("");
  const [fullscreenOn, setFullscreenOn] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState("");
  const [pageYOffset, setPageYOffset] = useState(0);
  const [innerHeight, setInnerHeight] = useState(0);

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

  window.addEventListener("scroll", () => {
    setPageYOffset(window.pageYOffset);
    setInnerHeight(window.innerHeight);
  });

  return (
    <div className="App">
      <DataProvider>
        <Fullscreen
          fullscreenOn={fullscreenOn}
          fullscreenImage={fullscreenImage}
          setFullscreenImage={setFullscreenImage}
          pinataBaseURL={pinataBaseURL}
          setFullscreenOn={setFullscreenOn}
          pageYOffset={pageYOffset}
          innerHeight={innerHeight}
        />
        <header className="App-header">
          <h1>DERO Image Gallery</h1>
          <p className="bridegeInitText">{bridgeInitText}</p>
        </header>
        <Form
          JWT={JWT}
          bridgeInitText={bridgeInitText}
          deroBridgeApi={deroBridgeApi}
          pinataBaseURL={pinataBaseURL}
        />
        <Images
          baseURL={pinataBaseURL}
          setFullscreenOn={setFullscreenOn}
          setFullscreenImage={setFullscreenImage}
        />
      </DataProvider>
    </div>
  );
}

export default App;
