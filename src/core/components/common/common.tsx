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