// src/services/socialAuthService.js
// import { generateCodeChallenge, generateCodeVerifier } from "../../utils/pkce";

import { generateCodeVerifier, generateCodeChallenge } from "../utils/pkce";


const generateRandomState = () => Math.random().toString(36).substring(2, 15);

const openPopup = (url, title, width, height) => {
    return new Promise((resolve) => {
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        const popup = window.open(
            url,
            title,
            `width=${width},height=${height},top=${top},left=${left}`
        );

        const interval = setInterval(() => {
            // if (popup.closed) {
            //     clearInterval(interval);
            //     resolve(null); // user closed the popup
            // }
        }, 500);

        resolve(popup);
    });
};

export const loginWithSocial = async (type, { pagename, producturl, productid }) => {
    const state = generateRandomState();
    console.log(type);
    sessionStorage.setItem('product_url', producturl);
    sessionStorage.setItem('page_name', pagename);
    sessionStorage.setItem('product_id', productid);
    let authUrl = '';
    switch (type) {
        case 'linkedin': {

            sessionStorage.setItem('linkedin_oauth_state', state);
            const LINKEDIN_CLIENT_ID = import.meta.env.VITE_REACT_APP_LINKEDIN_CLIENT_ID;
            const LINKEDIN_REDIRECT_URI = import.meta.env.VITE_REACT_APP_LINKEDIN_REDIRECT_URI;
            const scopes = ['r_basicprofile', 'w_organization_social', 'rw_organization_admin', 'r_organization_social'].join(' ');

            authUrl = `https://www.linkedin.com/oauth/v2/authorization` +
                `?response_type=code` +
                `&client_id=${LINKEDIN_CLIENT_ID}` +
                `&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}` +
                `&state=${state}` +
                `&scope=${encodeURIComponent(scopes)}`;

            break;
        }

        case 'twitter': {
            const code_verifier = generateCodeVerifier();
            const code_challenge = await generateCodeChallenge(code_verifier);
            const state = crypto.randomUUID();

            sessionStorage.setItem("tw_state", state);
            sessionStorage.setItem(`twitter_verifier_${state}`, code_verifier);

            const TWITTER_CLIENT_ID = import.meta.env.VITE_REACT_APP_TWITTER_CLIENT_ID;
            const TWITTER_REDIRECT_URI = import.meta.env.VITE_REACT_APP_TWITTER_REDIRECT_URI;
            const scopes = "tweet.read tweet.write users.read offline.access";

            authUrl = `https://x.com/i/oauth2/authorize` +
                `?response_type=code` +
                `&client_id=${TWITTER_CLIENT_ID}` +
                `&redirect_uri=${encodeURIComponent(TWITTER_REDIRECT_URI)}` +
                `&scope=${encodeURIComponent(scopes)}` +
                `&state=${state}` +
                `&code_challenge=${code_challenge}` +
                `&code_challenge_method=S256`;
            break;
        }
        case 'facebook': {
            authUrl = `https://www.facebook.com/v18.0/dialog/oauth` +
                `?client_id=${import.meta.env.VITE_REACT_APP_FB_CLIENT_ID}` +
                `&redirect_uri=${encodeURIComponent(`${window.location.origin}/auth/facebook/callback`)}` +
                `&response_type=code` +
                `&scope=${encodeURIComponent('email,public_profile,pages_show_list,pages_read_engagement,pages_manage_metadata,instagram_basic,instagram_manage_insights')}`;
            break;
        }
     
        case 'instagram': {
            authUrl = `https://www.facebook.com/v18.0/dialog/oauth` +
                `?client_id=${import.meta.env.VITE_REACT_APP_FB_CLIENT_ID}` +
                `&redirect_uri=${encodeURIComponent(`${window.location.origin}/auth/instagram/callback`)}` +
                `&response_type=code` +
                `&scope=${encodeURIComponent('instagram_basic,instagram_manage_insights,instagram_manage_comments,pages_show_list,pages_read_engagement,pages_read_user_content')}`;
            break;
        }
        case 'youtube': {
            authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
                `client_id=${import.meta.env.VITE_REACT_APP_YOUTUBE_CLIENT_ID}&` +
                `redirect_uri=${import.meta.env.VITE_REACT_APP_YOUTUBE_REDIRECT_URI}&` +
                `response_type=code&` +
                `scope=https://www.googleapis.com/auth/youtube.force-ssl&` +
                `access_type=offline&` +
                `prompt=consent`;
            break;
        }
        default:
            throw new Error(`Unsupported social login type: ${type}`);
    }

    const popup = await openPopup(authUrl, `${type} Login`, 600, 600);
    console.log(popup);


    return new Promise((resolve, reject) => {
        const listener = (event) => {
            if (event.origin !== window.location.origin) return;
            if (event.data?.type === 'linkedin_auth' || event.data?.type === 'twitter_auth' || event.data?.type === 'facebook_auth' ||event.data?.type === 'instagram_auth' ||  event.data?.type === 'youtube_auth') {
                window.removeEventListener('message', listener);

                if (event.data.code) {
                    resolve({ code: event.data.code });
                } else {
                    reject(new Error(`No code returned from ${type}`));
                }
                sessionStorage.clear('product_url');
                sessionStorage.clear('page_name');
                sessionStorage.clear('product_id');

                popup?.close();
            }
        };

        window.addEventListener('message', listener);
    });
};
