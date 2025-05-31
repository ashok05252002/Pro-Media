// src/services/socialAuthService.js


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
            if (popup.closed) {
                clearInterval(interval);
                resolve(null); // user closed the popup
            }
        }, 500);

        resolve(popup);
    });
};

export const loginWithSocial = async (type, { pagename, producturl}) => {
    const state = generateRandomState();
    sessionStorage.setItem('linkedin_oauth_state', state);
    sessionStorage.setItem('product_url', producturl);
    sessionStorage.setItem('page_name', pagename);
    sessionStorage.setItem('product_id', 2);
    let authUrl = ''; 
    switch (type) {
        case 'linkedin': {
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
        } default:
            throw new Error(`Unsupported social login type: ${type}`);
    }
    //   const authUrl = `https://www.linkedin.com/oauth/v2/authorization` +
    //     `?response_type=code` +
    //     `&client_id=${LINKEDIN_CLIENT_ID}` +
    //     `&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}` +
    //     `&state=${state}` +
    //     `&scope=${encodeURIComponent(scopes)}`;

    //   sessionStorage.setItem('linkedin_oauth_state', state);

    const popup = await openPopup(authUrl, 'LinkedIn Login', 600, 600);
    console.log(popup);
            

    return new Promise((resolve, reject) => {
        const listener = (event) => {
            if (event.origin !== window.location.origin) return;
            if (event.data?.type === 'linkedin_auth') {
                window.removeEventListener('message', listener);

                if (event.data.code) {
                    resolve({ code: event.data.code });
                } else {
                    reject(new Error('No code returned from LinkedIn'));
                }

                popup?.close();
            }
        };

        window.addEventListener('message', listener);
    });
};
