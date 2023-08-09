import React, { useEffect } from "react";

function App() {
  useEffect(() => {
    if (typeof window !== undefined) {
      window.RestImport({
        dom_id: "#reactImport",
      });
    }
  }, []);

  return (
    <>
      <div id="reactImport"></div>
    </>
  );
}

export default App;
