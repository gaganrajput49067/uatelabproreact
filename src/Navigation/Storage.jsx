import CryptoJS from "crypto-js";

export const encryptData = (data, secretKey) => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      secretKey
    ).toString();
    return ciphertext;
  } catch (error) {
    console.error("Encryption Error:", error);
    return null;
  }
};
export const decryptData = (ciphertext, secretKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error("Decryption Error:", error);
    return null;
  }
};

export const getLocalStorageDecryptData = (key) => {
  const ciphertext = window.localStorage.getItem("user_Data");
  const secretKey = "yourSecretKey";
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log(decryptedData);
    return decryptedData?.[key];
  } catch (error) {
    console.error("Decryption Error:", error);
    return null;
  }
};

export const setLocalStorage = (value) => {
  const ciphertext = window.localStorage.getItem("user_Data");
  const secretKey = "yourSecretKey";
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const userData = {
      ModifyRegDate: decryptedData.ModifyRegDate,
      Username: decryptedData.Username,
      CompanyCode: decryptedData.CompanyCode,
      DefaultCentre: value,
      ShowDashboard: decryptedData.ShowDashboard,
      SkipMicLabEntry: decryptedData.SkipMicLabEntry,
      role: 1,
    };
    const encryptedUserData = encryptData(userData, "yourSecretKey");
    window.localStorage.setItem("user_Data", encryptedUserData);
  } catch (error) {
    console.error("Decryption Error:", error);
    return null;
  }
};
