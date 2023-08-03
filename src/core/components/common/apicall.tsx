import axios, { AxiosRequestConfig } from "axios";

export default async function Apicall(config: AxiosRequestConfig) {
  const response = await axios
    .request(config)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  return response;
}