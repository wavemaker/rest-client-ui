const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
}));
app.use(cookieParser());
app.use(bodyParser.json());

app.post('/restimport', async (req, res) => {
  try {
    const requestBody = req.body
    const specificCookie = req.cookies.auth_cookie
    console.log(specificCookie)
    const configWOProxy = {
      url: "https://www.wavemakeronline.com/studio/services/projects/WMPRJ2c91808888f5252401896880222516b1/restservices/invoke?optimizeResponse=true",
      headers: { Cookie: "auth_cookie=" + specificCookie },
      method: "POST",
      data: requestBody
    }
    const response = await axios.request(configWOProxy)
    const data = response.data;
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});


app.get("/get-default-provider", async (req, res) => {
  try {
    const specificCookie = req.cookies.auth_cookie
    console.log(specificCookie)
    const configWOProxy = {
      url: "https://www.wavemakeronline.com/studio/services/oauth2/providers/default",
      headers: { Cookie: "auth_cookie=" + specificCookie },
      method: "GET"
    }
    const response = await axios.request(configWOProxy)
    const data = response.data;
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
})

app.get("/getprovider", async (req, res) => {
  try {
    const specificCookie = req.cookies.auth_cookie
    console.log(specificCookie)
    const configWOProxy = {
      url: "https://www.wavemakeronline.com/studio/services/projects/WMPRJ2c91808888f5252401896880222516b1/oauth2/providers",
      headers: { Cookie: "auth_cookie=" + specificCookie },
      method: "GET"
    }
    const response = await axios.request(configWOProxy)
    const data = response.data;
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
})

app.post("/addprovider", async (req, res) => {
  try {
    const requestBody = req.body
    const specificCookie = req.cookies.auth_cookie
    console.log(specificCookie)
    const configWOProxy = {
      url: "https://www.wavemakeronline.com/studio/services/projects/WMPRJ2c91808888f5252401896880222516b1/oauth2/providers",
      headers: { Cookie: "auth_cookie=" + specificCookie },
      method: "POST",
      data: requestBody
    }
    const response = await axios.request(configWOProxy)
    const data = response.data;
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
})

app.get("/authorizationUrl", async (req, res) => {
  try {
    const specificCookie = req.cookies.auth_cookie
    console.log(specificCookie)
    const configWOProxy = {
      url: "https://www.wavemakeronline.com/studio/services/projects/WMPRJ2c91808888f5252401896880222516b1/oauth2/google/authorizationUrl",
      headers: { Cookie: "auth_cookie=" + specificCookie },
      method: "GET"
    }
    const response = await axios.request(configWOProxy)
    const data = response.data;
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
