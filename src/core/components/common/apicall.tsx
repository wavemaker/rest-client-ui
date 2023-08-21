import axios, { AxiosError, AxiosRequestConfig } from "axios";

export default async function Apicall(config: AxiosRequestConfig) {
  const response = await axios
    .request(config)
    .then((res) => {
      return res;
    })
    .catch((err: AxiosError) => {
      return err;
    });
  return response;
}

export async function getProviderList(url: string) {
  const configProvider = {
    url: url,
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  };
  const response: any = await Apicall(configProvider);
  if (response.status === 200) {
    return response
  } else {
    console.error("Received an unexpected response:", response);
  }
}
