import { sign, verify } from 'jsonwebtoken';

const cookieController = (() => {
  const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY;

  function encryptJwt(jwt) {
    let encryptedToken = '';
    for (let i = 0; i < jwt.length; i++) {
      encryptedToken += String.fromCharCode(
        jwt.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length)
      );
    }
    // //console.table({ encryptedToken, jwt });
    return encryptedToken;
  }

  function decryptJwt(encryptedToken) {
    try {
      let decryptedToken = '';
      for (let i = 0; i < encryptedToken.length; i++) {
        decryptedToken += String.fromCharCode(
          encryptedToken.charCodeAt(i) ^
            SECRET_KEY.charCodeAt(i % SECRET_KEY.length)
        );
      }

      // ////console.log('decryptedToken', decryptedToken);
      return decryptedToken;
    } catch (error) {
      return null;
    }
  }

  // Export the public functions
  return {
    encryptJwt,
    decryptJwt,
  };
})();

module.exports = cookieController;
