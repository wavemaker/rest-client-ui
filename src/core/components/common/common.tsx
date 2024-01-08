import { HeaderAndQueryI } from "../Table";

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

export function retrievePathParamNamesFromURL(url: string, start: string, end: string): string[] {
  const pathNames = []
  for (let i = 0; i < url.length; i++) {
    if (url.charAt(i) === start) {
      const endIndex = url.indexOf(end, i)
      endIndex !== -1 && pathNames.push(url.slice(i + 1, i = endIndex))
    }
  }
  return pathNames
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
export const findDuplicateObjectsWithinArray = (array: any[], property: string) => {
  const seen: any = {};
  const duplicates = [];
  for (const obj of array) {
    const value = obj[property];
    value && (seen[value] ? duplicates.push(obj) : seen[value] = true)
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
      propertyValue && (!seen[propertyValue] ? seen[propertyValue] = true : duplicates.push(obj))
    }
  }
  return duplicates;
}

export function removeDuplicatesByComparison(
  originalArray: any[],
  comparisonArray: any[],
  key: string
) {
  return originalArray.filter(item => !comparisonArray.some((compareItem) => compareItem[key] === item[key]));
}

export function findDuplicatesByComparison(concernedArray: any[], collection: any[], key: string) {
  return concernedArray.filter(obj => collection.some(objFromCollection => objFromCollection[key] === obj[key]))
}

export const isValidUrl = (urlString: string) => {
  const urlPattern = /^(https?|ftp):\/\/(-\.)?([^\s/?.#]+\.?)+(\/[^\s]*)?$/i
  return urlPattern.test(urlString);
};

export function retrieveQueryDetailsFromURL(url: string) {
  const query = url?.split('?')[1]
  const queries = query?.split('&')
  let queriesArrayFromUrl: HeaderAndQueryI[] = []
  if (queries) {
    queries.forEach(query => {
      const queryName = query.slice(0, query.indexOf('='))
      const queryValue = query.slice(query.indexOf('=') + 1)
      if (queriesArrayFromUrl.some((data: any) => data.name === queryName)) {
        queriesArrayFromUrl = queriesArrayFromUrl.map((data: HeaderAndQueryI) => {
          return data.name === queryName ? { name: data.name, value: `${data.value},${queryValue}`, type: 'string' } : data
        })
      } else {
        queriesArrayFromUrl.push({ name: queryName, value: queryValue, type: 'string' })
      }
    })
  }
  return queriesArrayFromUrl
}

export function constructUpdatedQueryString(updatedQueryObj: HeaderAndQueryI[]) {
  let newQueryString = ''
  updatedQueryObj.forEach((query, index) => {
    if (query.name && query.value) {
      newQueryString += index === 0 ? `?${query.name}=${query.value}` : `&${query.name}=${query.value}`
    }
  })
  return newQueryString
}

export function constructCommaSeparatedUniqueQueryValuesString(valueCollection: string[]) {
  const uniqueArray = valueCollection.filter((value, index) => value && valueCollection.indexOf(value) === index)
  const valueToSet = uniqueArray.join(',')
  return valueToSet
}

export function checkTypeForParameter(type: string): "SERVER" | "ENVIRONMENT" | "BASIC" {
  const UITypes = ['boolean', 'date', 'date-time', 'double', 'float', 'int32', 'int64', 'string']
  const ServerSideProperties = ['DATE', 'DATETIME', 'TIME', 'TIMESTAMP', 'USER_ID', 'USER_NAME']
  let value: "SERVER" | "ENVIRONMENT" | "BASIC" = "BASIC"
  if (UITypes.includes(type)) value = "BASIC"
  else if (ServerSideProperties.includes(type)) value = "SERVER"
  else value = "ENVIRONMENT"
  return value
}
