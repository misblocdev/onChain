import CryptoJS from "crypto-js";

export const crypt = (val, option) => {
    // 암호
    if (option === true) {
        var en = CryptoJS.AES.encrypt(JSON.stringify(val), process.env.REACT_APP_AES_SECRETKEY).toString()
        return en
    } else {
        // 복호
        var bytes = CryptoJS.AES.decrypt(val, process.env.REACT_APP_AES_SECRETKEY)
        var de = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        return de
    }
}
