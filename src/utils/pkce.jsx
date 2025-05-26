// src/utils/pkce.js
// export function generatePKCE() {
//   const base64url = (str) =>
//     btoa(String.fromCharCode(...new Uint8Array(str)))
//       .replace(/\+/g, "-")
//       .replace(/\//g, "_")
//       .replace(/=+$/, "");

//   const code_verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));
//   const encoder = new TextEncoder();
//   const data = encoder.encode(code_verifier);
//   const code_challenge = crypto.subtle.digest("SHA-256", data).then((digest) => base64url(digest));

//   return { code_verifier, code_challenge };
// }

export function generateCodeVerifier(length = 128) {
            const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
            let result = '';
            const values = new Uint32Array(length);
            window.crypto.getRandomValues(values);
            for (let i = 0; i < length; i++) {
                result += charset[values[i] % charset.length];
            }
            return result;
        }

export async function generateCodeChallenge(codeVerifier) {
            const encoder = new TextEncoder();
            const data = encoder.encode(codeVerifier);
            const digest = await crypto.subtle.digest("SHA-256", data);
            return btoa(String.fromCharCode(...new Uint8Array(digest)))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
        }