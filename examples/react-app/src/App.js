import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import RestModel from './components/RestModelDialog'

function App() {
  const [open, setOpen] = useState(false);
  const [fullScreenView, setFullScreenView] = useState(false)
  const [defaultData, setDefaultData] = useState(true)

  useEffect(() => {
    if (fullScreenView) {
      window.RestImport({
        dom_id: "#full-screen",
      });
    }
  }, [fullScreenView])

  const handleClose = () => {
    setOpen(false);
  };

  const handleDefaultViewClick = () => {
    setOpen(true)
    setDefaultData(true)
  }

  const handlePreloadedViewClick = () => {
    setOpen(true)
    setDefaultData(false)
  }

  return (
    <>
      <Stack direction={'row'} gap={10} justifyContent={'center'} alignItems={'center'} sx={{ marginTop: 10 }}>
        <Button variant="contained" onClick={() => { setFullScreenView(!fullScreenView) }}>Full Screen</Button>
        <Button variant="contained" onClick={handleDefaultViewClick}>Dialog</Button>
        <Button variant="contained" onClick={handlePreloadedViewClick}>Dialog with Data</Button>
      </Stack>
      <RestModel handleOpen={open} handleClose={handleClose} defaultData={defaultData} />
      {fullScreenView && (<div id="full-screen">
      </div>)}
    </>
  );
}

export default App;
