import { Buffer } from 'buffer';
import { notification } from 'antd';
const { read } = require('./LocalStorageEncryption');

export const isAuthenticated = () => {
  const token = read("accessToken");
  const user = read("user");
  if (token && user) {
    try {
      const { role } = user;
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
      return role && payload.exp > Date.now() / 1000;
    } catch (e) {
      console.log("Auth error:", e);
      return false;
    }
  }
  return false;
};

// Util to get user, license info from local storage
export const getUserInfo = () => {
  const user = read('user') || {};
  // Destructure necessary fields
  const { license } = user;
  // Destructure license fields
  const { expiresOn, plan } = license || {};
  const { name: planName } = plan || {};
  const isLicenseExpired = !expiresOn || new Date(expiresOn) < new Date();
  const isFreeTrial = planName === "Nebula"; // Check if the plan name indicates a free trial
  return { ...user, isLicenseExpired, isFreeTrial };
};

export const isValidURL = (url) => (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/g).test(url);

export const isValidEmail = (email) => (/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]/g).test(email);

export const isValidBusinessEmail = (email) => /^[a-zA-Z0-9._%+-]+@(?!gmail\.|yahoo\.|hotmail\.|aol\.|live\.|outlook\.|yopmail\.|zohomail\.|icloud\.|mac\.|me\.)[a-zA-Z0-9_-]+\.[a-zA-Z0-9-.]{2,61}$/gi.test(email);

export const successNotification = (message, description) => {
  return notification.success({
    message,
    description,
    placement: "topRight",
    duration: 6,
  });
};

export const errorNotification = (message, description) => {
  return notification.error({
    message,
    description,
    placement: "topRight",
    duration: 6,
  });
};

export const infoNotification = (message, description) => {
  return notification.info({
    message,
    description,
    placement: "topRight",
    duration: 6,
  });
};

export const getUser = () => {
  const user = localStorage.getItem("USER") || "{}";
  if (user) {
    try {
      return JSON.parse(user);
    } catch (e) {
      return null;
    }
  }
  return null;
};