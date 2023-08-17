import React, { useEffect } from "react";

function App() {
  useEffect(() => {
    if (typeof window !== undefined) {
      window.RestImport({
        dom_id: "#reactImport",
        config: {
          url: 'https://jsonplaceholder.typicode.com/posts/{id}?test=true',
          httpMethod: 'POST',
          useProxy: true,
          httpAuth: "BASIC",
          bodyParams: "{userName:password}",
          userName: "userName",
          userPassword: "userPassword",
          headerParams: [
            {
              name: 'New',
              type: 'string',
              value: 'application'
            }
          ],
          multipartParams: [
            {
              name: "post",
              type: "file",
              value: "fe"
            }
          ],
          contentType: 'multipart/form-data'
        },

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
