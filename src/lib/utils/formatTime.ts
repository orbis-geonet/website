export const formatTime = (inputDate: string) => {
  const date = new Date(inputDate);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear().toString().slice(-2);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedDate = `${day < 10 ? "0" : ""}${day}/${
    month < 10 ? "0" : ""
  }${month}/${year}`;
  const formattedTime = `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;

  return `${formattedDate} as ${formattedTime}`;
};

type DATETIMEOPTIONS = {
  day?: "numeric" | "2-digit";
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
  hour12?: boolean;
  month?: "numeric" | "long" | "2-digit" | "short" | "narrow";
};

export const parseDay = (timestamp: string) => {
  const date = new Date(timestamp);

  const optionsDate: DATETIMEOPTIONS = { day: "numeric", month: "long" };

  const formattedDate = date.toLocaleDateString("en-US", optionsDate);

  return formattedDate.split(" ").reverse().join(" ");
};

export const parseTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const optionsTime: DATETIMEOPTIONS = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const formattedTime = date.toLocaleTimeString("en-US", optionsTime);
  return formattedTime;
};

export function getTimeDifference(timestamp: string) {
  const currentDate = new Date();
  const givenDate = new Date(timestamp);
  const timeDifference = Number(currentDate) - Number(givenDate);

  const millisecondsPerSecond = 1000;
  const secondsPerMinute = 60;
  const minutesPerHour = 60;
  const hoursPerDay = 24;
  const daysPerMonth = 30; // Assuming an average month length
  const monthsPerYear = 12;

  const elapsedSeconds = timeDifference / millisecondsPerSecond;
  const elapsedMinutes = elapsedSeconds / secondsPerMinute;
  const elapsedHours = elapsedMinutes / minutesPerHour;
  const elapsedDays = elapsedHours / hoursPerDay;
  const elapsedMonths = elapsedDays / daysPerMonth;
  const elapsedYears = elapsedMonths / monthsPerYear;

  if (elapsedYears >= 1) {
    return `${Math.floor(elapsedYears)}y`;
  } else if (elapsedMonths >= 1) {
    return `${Math.floor(elapsedMonths)}mon`;
  } else if (elapsedDays >= 1) {
    return `${Math.floor(elapsedDays)}d`;
  } else if (elapsedHours >= 1) {
    return `${Math.floor(elapsedHours)}h`;
  } else if (elapsedMinutes >= 1) {
    return `${Math.floor(elapsedMinutes)}m`;
  } else {
    return "< min";
  }
}

export const formatDateForSchema = (time: string) => {
  const utcDate = new Date(time);
  const year = utcDate.getUTCFullYear();
  const month = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(utcDate.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatTimeForSchema = (time: string) => {
  const utcDate = new Date(time);
  const hours = String(utcDate.getUTCHours()).padStart(2, "0");
  const minutes = String(utcDate.getUTCMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};
