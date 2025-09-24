const CryptoJS = require("crypto-js");

const secret = process.env.REACT_APP_LOCAL_ENCRYPTION_KEY || "TEST";

const expiryDuration = 1680000;

const encrypt = (data) => {
    if (data != null) {
        return CryptoJS.AES.encrypt(
            JSON.stringify(data),
            secret
        ).toString();
    }
    return null;
};

const decrypt = ciphertext => {
    try {
        console.log(ciphertext);
        if (
            ciphertext != null &&
            ciphertext !== "null"
        ) {
            const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), secret);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decrypted);
        }
        return null;
    } catch (e) {
        return null;
    }
};

const store = (key, value) => {
    return localStorage.setItem(key, value);
};

const read = (key) => {
    const encryptedData = localStorage.getItem(key);
    return decrypt(encryptedData);
};

const getExpiry = () => {
    return (new Date().getTime() + expiryDuration);
};

const isExpired = (expiry) => {
    return (new Date().getTime() > parseInt(expiry, 10));
};

const storeExpiry = (key, value, expiry = false) => {
    const encryptedData = encrypt(value);
    if (expiry === true) {
        const encryptedExpiry = encrypt(getExpiry());
        store(`${key}.e`, encryptedExpiry);
    }
    return store(key, encryptedData);
};

const readExpiry = key => {
    const expiryData = decrypt(read(`${key}.e`));
    const data = decrypt(read(key));
    if (data != null) {
        if (data && isExpired(expiryData)) {
            return { response: data, expired: true };
        }
        if (data && !isExpired(expiryData)) {
            return { response: data, expired: false };
        }
    }
    return { response: null, expired: true };
};

const clear = () => {
    localStorage.clear();
    return null;
};

module.exports = { encrypt, decrypt, clear, storeExpiry, readExpiry, read, store };