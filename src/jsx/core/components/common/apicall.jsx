import axios from "axios";
export default async function Apicall(config) {
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
