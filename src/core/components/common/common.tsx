export function convertToUTC(): number {
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  return Date.UTC(year, month, day, hour, minute, second);
}

export function getCurrentDateTime(
  withTime: boolean,
  onlyTime: boolean
): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const valueWOTime = `${year}-${month}-${day}`;
  const valueWTime = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  const time = `${hour}:${minute}:${second}`;
  let returnValue = "";

  if (withTime) returnValue = valueWTime;
  if (!withTime) returnValue = valueWOTime;
  if (onlyTime) returnValue = time;

  return returnValue;
}

export function getSubstring(
  str: string,
  start: string,
  end: string
): string[] {
  const words = [];
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === start) {
      const stopIndex = str.indexOf(end, i);
      if (stopIndex !== -1) words.push(str.substring(i + 1, stopIndex));
    }
  }
  return words;
}

export const httpStatusCodes = new Map([
  [
    100,
    "Continue - The server has received the request headers and the client should proceed to send the request body.",
  ],
  [
    101,
    "Switching Protocols - The requester has asked the server to switch protocols and the server has agreed to do so.",
  ],
  [
    200,
    "OK - The request has succeeded and the server has returned the requested data.",
  ],
  [
    201,
    "Created - The request has been fulfilled, resulting in the creation of a new resource.",
  ],
  [
    202,
    "Accepted - The request has been accepted but has not been processed yet.",
  ],
  [
    204,
    "No Content - The server successfully processed the request but there is no new information to send.",
  ],
  [
    300,
    "Multiple Choices - The requested resource has multiple choices, each with its own specific location and agent-driven negotiation.",
  ],
  [
    301,
    "Moved Permanently - The requested resource has been permanently moved to a different location.",
  ],
  [
    302,
    "Found - The requested resource has been temporarily moved to a different location.",
  ],
  [
    304,
    "Not Modified - The client's cached copy is still valid, so the server has not returned the requested data.",
  ],
  [
    400,
    "Bad Request - The server cannot understand the request due to a client error (e.g., malformed syntax).",
  ],
  [
    401,
    "Unauthorized - The client must authenticate itself to get the requested response.",
  ],
  [
    403,
    "Forbidden - The client does not have the necessary permissions to access the requested resource.",
  ],
  [404, "Not Found - The requested resource could not be found on the server."],
  [
    500,
    "Internal Server Error - The server has encountered a situation it doesn't know how to handle.",
  ],
  [
    501,
    "Not Implemented - The server does not support the functionality required to fulfill the request.",
  ],
  [503, "Service Unavailable - The server is not ready to handle the request."],
]);

export const removeDuplicatesKeepFirst = (arr: any[], key: string) => {
  const seen: any = {};
  const result = [];
  for (const obj of arr) {
    const value = obj[key];
    if (!seen[value]) {
      seen[value] = true;
      result.push(obj);
    }
  }
  return result;
};
export const findDuplicateObjects = (array: any[], property: string) => {
  const seen: any = {};
  const duplicates = [];
  for (const obj of array) {
    const value = obj[property];
    if (seen[value]) {
      duplicates.push(obj);
    } else {
      seen[value] = true;
    }
  }
  return duplicates;
};

export const removeSecondDuplicateSubstring = (
  inputString: string,
  substring: string
) => {
  const regex = new RegExp(substring, "g");
  const firstIndex = inputString.indexOf(substring);
  if (firstIndex === -1) {
    return inputString; // Substring not found, return original string
  }
  return inputString.replace(regex, (match, index) => {
    if (index !== firstIndex) {
      return ""; // Remove all duplicate occurrences except the first one
    } else {
      return match; // Keep the first occurrence as is
    }
  });
};

export function findDuplicatesAcrossArrays(
  arrays: any[],
  propertyName: string
) {
  const seen: any = {};
  const duplicates = [];
  for (const arr of arrays) {
    for (const obj of arr) {
      const propertyValue = obj[propertyName];
      if (!seen[propertyValue]) {
        seen[propertyValue] = true;
      } else {
        duplicates.push(obj);
      }
    }
  }

  return duplicates;
}

export function removeDuplicatesByComparison(
  originalArray: any[],
  comparisonArray: any[],
  key: string
) {
  return originalArray.filter(
    (item) =>
      !comparisonArray.some((compareItem) => compareItem[key] === item[key])
  );
}

export const isValidUrl = (urlString: string) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator'

  return urlPattern.test(urlString);
};