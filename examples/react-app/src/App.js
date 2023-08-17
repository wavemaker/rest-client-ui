import React, { useEffect } from "react";

function App() {
  useEffect(() => {
    if (typeof window !== undefined) {
      window.RestImport({
        dom_id: "#reactImport",
        language:"en"
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
