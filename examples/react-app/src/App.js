import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import RestModel from "./components/RestModelDialog";

function App() {
  const [open, setOpen] = useState(false);
  const [fullScreenView, setFullScreenView] = useState(false);
  const [defaultData, setDefaultData] = useState(true);

  useEffect(() => {
    if (fullScreenView) {
      window.RestImport({
        dom_id: "#full-screen",
      });
    }
  }, [fullScreenView]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDefaultViewClick = () => {
    setOpen(true);
    setDefaultData(true);
  };

  const handlePreloadedViewClick = () => {
    setOpen(true);
    setDefaultData(false);
  };
  const handleConfigDialog = () => {
    window.configImport({
      dom_id: '#configModalUI',
      language: 'en',
    
      config: {
        proxy_conf: {
          base_path: 'http://localhost:5000',
          proxy_path: '/restimport',
          list_provider: '/get-default-provider',
          getprovider: '/getprovider',
          addprovider: '/addprovider',
        },
        default_proxy_state: 'ON',
        oAuthConfig: {
          base_path: 'https://www.wavemakeronline.com/studio/services',
          project_id: 'WMPRJ2c91808888f5252401896880222516b1',
          list_provider: '/oauth2/providers/default',
          getprovider:
            '/projects/WMPRJ2c91808888f5252401896880222516b1/oauth2/providers',
          addprovider:
            '/projects/WMPRJ2c91808888f5252401896880222516b1/oauth2/providers',
        },
      },
    });
  };

  return (
    <>
      <Stack
        direction={"row"}
        gap={10}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{ marginTop: 10 }}
      >
        <Button
          variant="contained"
          onClick={() => {
            setFullScreenView(!fullScreenView);
          }}
        >
          Full Screen
        </Button>
        <Button variant="contained" onClick={handleDefaultViewClick}>
          Dialog
        </Button>
        <Button variant="contained" onClick={handlePreloadedViewClick}>
          Dialog with Data
        </Button>
        <Button variant="contained" onClick={handleConfigDialog}>
          Config Dialog
        </Button>
      </Stack>
      <RestModel
        handleOpen={open}
        handleClose={handleClose}
        defaultData={defaultData}
      />
      <div id="configModalUI"></div>
      {fullScreenView && <div id="full-screen"></div>}
    </>
  );
}

export default App;
