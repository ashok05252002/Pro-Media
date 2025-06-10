import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
// import { extCompanyProductData, extCompanyRegorAddPrdct } from "../API/api";
import { generateCodeChallenge, generateCodeVerifier } from "../../utils/pkce";
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { STATE_VERIFIER_STORE } from "../../utils/constant";
import { extCompanyProductData, extCompanyRegorAddPrdct } from "../../API/api";
import { useAuth } from 'react-oauth2-code-pkce';
import { openPopup } from "../../utils/OpenPopup";
import SelectFormInput from "../form-component/SelectInput";

const config = {
    clientId: import.meta.env.VITE_REACT_APP_LINKEDIN_CLIENT_ID,
    authorizationEndpoint: `https://www.linkedin.com/oauth/v2/authorization?`,
    tokenEndpoint: 'https://www.linkedin.com/oauth/v2/token',
    redirectUri: import.meta.env.VITE_REACT_APP_LINKEDIN_REDIRECT_URI,
};

const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${import.meta.env.VITE_REACT_APP_YOUTUBE_CLIENT_ID}&` +
    `redirect_uri=${import.meta.env.VITE_REACT_APP_YOUTUBE_REDIRECT_URI}&` +
    `response_type=code&` +
    `scope=https://www.googleapis.com/auth/youtube.force-ssl&` +
    `access_type=offline&` +
    `prompt=consent`;

const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
    `client_id=${import.meta.env.VITE_REACT_APP_FB_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(window.location.origin + '/auth/facebook/callback')}&` +
    `response_type=code&` +
    `scope=email,public_profile,pages_show_list,pages_read_engagement,pages_manage_metadata,instagram_basic,instagram_manage_insights`;

const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&client_id=${import.meta.env.REACT_APP_LINKEDIN_CLIENT_ID}&` +
    `redirect_uri=${import.meta.env.VITE_REACT_APP_LINKEDIN_REDIRECT_URI}&scope=r_liteprofile`;

const twitterAuthUrl = `https://api.twitter.com/oauth2/authorize?` +
    `client_id=${import.meta.env.REACT_APP_TWITTER_API_KEY}&` +
    `redirect_uri=${import.meta.env.REACT_APP_REDIRECT_URI}&` +
    `response_type=code&scope=read`;


const RegisterProduct = (props) => {
    const [data, setData] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('existing');
    const [inputValue, setInputValue] = useState('');
    const [inputPrdctUrl, setInputPrdctUrl] = useState('');
    const [inputPageName, setInputPageName] = useState('');
    const [message, setMessage] = useState("");
    const [selectedOptionId, setSelectedOptionId] = useState('');
    const [productId, setProductId] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedPlatform, setSelectedPlatform] = useState({});
    const [platformOptions, setPlatformOptions] = useState([
        { id: 1, website: "Facebook", ProductName: "", ProductURL: "", scope: [] },
        { id: 2, website: "Instagram", ProductName: "", ProductURL: "" },
        { id: 3, website: "Youtube", ProductName: "", ProductURL: "" },
        {
            id: 4, website: "LinkedIn", ProductName: "", ProductURL: "",
        },
        { id: 5, website: "Twitter", ProductName: "", ProductURL: "" },
        { id: 6, website: "Amazon", ProductName: "", ProductURL: "" },
        { id: 7, website: "Flipkart", ProductName: "", ProductURL: "" },
        { id: 8, website: "Myntra", ProductName: "", ProductURL: "" },
    ]);

    const [rows, setRows] = useState([
        { id: 1, website: "Facebook", ProductName: "", ProductURL: "" },
        { id: 2, website: "Instagram", ProductName: "", ProductURL: "" },
        { id: 3, website: "Youtube", ProductName: "", ProductURL: "" },
        { id: 4, website: "LinkedIn", ProductName: "", ProductURL: "" },
        { id: 5, website: "Twitter", ProductName: "", ProductURL: "" },
        { id: 6, website: "Amazon", ProductName: "", ProductURL: "" },
        { id: 7, website: "Flipkart", ProductName: "", ProductURL: "" },
        { id: 8, website: "Myntra", ProductName: "", ProductURL: "" },
    ]);

    const handleChange = (id, field, value) => {
        const updatedRows = rows.map((row) =>
            row.id === id ? { ...row, [field]: value } : row
        );
        props.handleChange(id, field, value)
        setRows(updatedRows);
    };

    const handleProductChange = (event) => {
        setSelectedProduct(event.target.value);
    };

    const handleChangePlatform = async (event) => {
        const platform = platformOptions.find((item) => item.id === event.target.value);

        console.log('====================================');
        console.log(platform);
        console.log('====================================');
        if (platform) {
            setSelectedPlatform(platform);
        } else {
            console.warn("Selected platform not found!");
        }
    }

    const LinkedInAuthButton = () => {
        const scopes = [
            'profile',
            'w_member_social',
            'r_organization_admin'
        ].join(' ');

        // Generate random state for CSRF protection
        const state = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('linkedin_oauth_state', state);

        // Redirect to LinkedIn OAuth
        // window.location.href =
        //     `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${import.meta.env.VITE_REACT_APP_LINKEDIN_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_REACT_APP_LINKEDIN_REDIRECT_URI}&state=${state}&scope=${scopes}`;
    };

    const loginWithLinkedIn1 = ({ type }) => {
        console.log(import.meta.env.VITE_REACT_APP_LINKEDIN_REDIRECT_URI);

        const scopes = [
            'profile',
            'w_member_social',
            'r_organization_admin'
        ].join(' ');
        const state = Math.random().toString(36).substring(2, 15);
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${import.meta.env.VITE_REACT_APP_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_REACT_APP_LINKEDIN_REDIRECT_URI)}&state=${state}&scope=${scopes}`;

        sessionStorage.setItem('linkedin_oauth_state', state);
        const popup = openPopup(authUrl, 'LinkedIn Login', 600, 600);

    };
    const loginWithLinkedIn = async ({ type }) => {
        console.log(type);

        var authUrl = "";

        const state = Math.random().toString(36).substring(2, 15);
        switch (type) {
            case "LinkedIn":
                const clientId = import.meta.env.VITE_REACT_APP_LINKEDIN_CLIENT_ID;
                const redirectUri = import.meta.env.VITE_REACT_APP_LINKEDIN_REDIRECT_URI;
                const scopes = [
                    'profile',
                    'r_basicprofile',
                    'w_member_social',    // Posting permissions
                    'r_organization_admin', // Organization admin access
                    'r_organization_social',
                    'rw_organization_admin',
                    'w_organization_social'
                ].join(' ');
                authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${import.meta.env.VITE_REACT_APP_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_REACT_APP_LINKEDIN_REDIRECT_URI)}&state=${state}&scope=${scopes}`;
                break;

            default:
                break;
        }


        sessionStorage.setItem('linkedin_oauth_state', state);
        const popup = await openPopup(authUrl, 'LinkedIn Login', 600, 600);
        console.log('==linkedin_oauth_state==');
        console.log(popup);
        console.log('====');
        const listener = (event) => {
            if (event.origin !== window.location.origin) return;
            if (event.data.type === 'linkedin_auth') { 
                console.log('✅ Auth Code:', event.data.code);
                // popup.close();
                window.removeEventListener('message', listener);
            } console.log('✅ Auth Code:', event.data.code);
        };

        window.addEventListener('message', listener);
    };



    const twitterconsent = async () => {
        try {
            // 1. Generate PKCE (same as your YouTube flow)
            // const { code_verifier, code_challenge } = generatePKCE();
            const code_verifier = generateCodeVerifier();
            const code_challenge = await generateCodeChallenge(code_verifier);
            const state = crypto.randomUUID();

            console.log("debugging24", code_verifier, code_challenge)
            // 2. Store security parameters (same pattern)
            // sessionStorage.setItem("tw_code_verifier", code_verifier);
            sessionStorage.setItem("tw_state", state);

            // STATE_VERIFIER_STORE[state] = code_verifier
            sessionStorage.setItem(`twitter_verifier_${state}`, code_verifier);
            // 3. Build URL with URLSearchParams (cleaner alternative)
            const authUrl = new URL("https://x.com/i/oauth2/authorize");
            const params = new URLSearchParams({
                response_type: "code",
                client_id: import.meta.env.VITE_REACT_APP_TWITTER_CLIENT_ID,
                redirect_uri: import.meta.env.VITE_REACT_APP_TWITTER_REDIRECT_URI,
                scope: "tweet.read tweet.write users.read offline.access",
                state: state,
                code_challenge: code_challenge,
                code_challenge_method: "S256"
            });

            authUrl.search = params.toString();
            console.log("debugging2:", authUrl.toString())
            // 4. Redirect (same as before)
            window.location.href = authUrl.toString();

        } catch (error) {
            console.error("Twitter auth failed:", error);
            // Your existing error handling
        }
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    }

    const handlePageNameChange = (event) => {
        setInputPageName(event.target.value);
        localStorage.setItem("page_name", event.target.value)

        console.log(localStorage.getItem("page_name"))
    }

    const handleInputPrdctUrlChange = (event) => {
        setInputPrdctUrl(event.target.value);
        localStorage.setItem("product_url", event.target.value)
    }

    const handleSelectChange = (e) => {
        setSelectedOptionId(e.target.value);
        console.log("Debugging Product_id", e.target.value)
        localStorage.setItem("product_id", e.target.value) //localStorage.setItem("product_id", response.data.product_id)
        setProductId(e.target.value)
        // You can do more with the selected ID here if needed
    };


    const handleRegister = () => {
        // handle Register Button click  extCompanyRegorAddPrdct(inputValue)
        const token = localStorage.getItem("authToken")
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' // Often needed
            }
        };
        // axios.post("https://6ff2-2001-4490-4e24-bd45-89d5-959c-7054-5a11.ngrok-free.app/ext-product/add", {"media_name": inputValue}, config)
        extCompanyRegorAddPrdct(inputValue)
            .then(function (response) {
                // response
                console.log("debugging 98", response)
                if (response.status === 201) {
                    setMessage(response.data.message)

                    localStorage.setItem("product_id", response.data.product_id) //localStorage.setItem("product_id", response.data.product_id)
                    setProductId(response.data.product_id)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleAuth = (platform) => {
        if (platform === 'youtube') {
            window.location.href = googleAuthUrl;
        } else if (platform === 'facebook') {
            window.location.href = facebookAuthUrl;
        } else if (platform === 'linkedin') {
            linkedinAuthUrl();
        } else if (platform === 'twitter') {
            twitterconsent();
        } else if (platform === 'instagram') {
            window.location.href = facebookAuthUrl;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const fetchOptions = async () => {
            try {
                const response = await extCompanyProductData();

                console.log("debugging productData", response.data)
                setData(response.data || []);
            } catch (err) {
                setMessage(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, []);

    const hasData = Array.isArray(data) && data.length > 0;


    return (
        <div className="max-w-3xl mx-auto p-6 font-sans">

            {!hasData ? (
                <>
                    <div className="mb-6">
                        <label htmlFor="productName" className="block mb-2 font-semibold text-gray-700">
                            Product Name:
                        </label>
                        <input
                            type="text"
                            id="productName"
                            name="productName"
                            value={inputValue}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                    </div>


                    <div className="mb-8 text-right">
                        <button
                            onClick={handleRegister}
                            className="bg-theme-primary text-white px-5 py-2 rounded-md hover:bg-sky-500 transition"
                        >
                            Register
                        </button>
                    </div>
                    {/* <button onClick={loginWithLinkedIn}>Check linkedin</button> */}
                </>
            ) : (
                <>
                    <h2>Product Selection</h2>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '10px' }}>
                            <input
                                type="radio"
                                value="existing"
                                checked={selectedProduct === 'existing'}
                                onChange={handleProductChange}
                                style={{ marginRight: '10px' }}
                            />
                            Existing Business
                        </label>
                        <label style={{ display: 'block' }}>
                            <input
                                type="radio"
                                value="new"
                                checked={selectedProduct === 'new'}
                                onChange={handleProductChange}
                                style={{ marginRight: '10px' }}
                            />
                            New Business
                        </label>
                    </div>
                    <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                        {selectedProduct === 'existing' ? (
                            <div>
                                <h3><b>Existing Business</b></h3>
                                <div className="options-dropdown">
                                    <h2><b>Select a Business</b></h2>
                                    <select
                                        value={selectedOptionId}
                                        onChange={handleSelectChange}
                                        style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}
                                    >
                                        <option value="">-- Select an option --</option>
                                        {data.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.product_name}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Optional: Show selected option details */}
                                    {/* {selectedOptionId && (
                          <div className="selected-option">
                            Selected ID: {selectedOptionId}
                          </div>
                        )} */}
                                </div>

                            </div>
                        ) : (
                            <div>
                                <div className="mb-6">
                                    <label htmlFor="productName" className="block mb-2 font-semibold text-gray-700">
                                        Business Name:
                                    </label>
                                    <input
                                        type="text"
                                        id="productName"
                                        name="productName"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                                    />
                                </div>


                                <div className="mb-8 text-right">
                                    <button
                                        onClick={handleRegister}
                                        className="bg-theme-primary text-white px-5 py-2 rounded-md hover:bg-sky-500 transition"
                                    >
                                        Add Business
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </>
            )}

            {/* Message Section */}
            {(productId !== 0) && (
                <div>
                    {/* Product URL & Page Name */}
                    <div className="mb-8">
                        <label htmlFor="productUrl" className="block mb-2 font-semibold text-gray-700">
                            Business Page URL:
                        </label>
                        <input
                            type="text"
                            id="productUrl"
                            name="productUrl"
                            value={inputPrdctUrl}
                            onChange={handleInputPrdctUrlChange}
                            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />

                        <label htmlFor="pageName" className="block mb-2 font-semibold text-gray-700">
                            Media Business Name:
                        </label>
                        <input
                            type="text"
                            id="pageName"
                            name="pageName"
                            value={inputPageName}
                            onChange={handlePageNameChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                    </div>
                    <SelectFormInput
                        label="Social Media"
                        value={selectedPlatform?.id || ""}
                        onChange={handleChangePlatform}
                        options={platformOptions}
                    />

                    {/* Auth Buttons */}
                    {/* <button
                        key={selectedPlatform.website}
                        onClick={() => loginWithLinkedIn({ 
                            type : selectedPlatform?.website
                        })}
                        className="flex-1 min-w-[120px] bg-theme-primary text-white px-4 py-2 rounded-md hover:bg-sky-500 transition"
                    >
                        Submit
                    </button> */}
                    <div className="mt-4 ">
                        <button
                            key={selectedPlatform.website}
                            onClick={() => loginWithLinkedIn({
                                type: selectedPlatform?.website
                            })}
                            className="flex-1 min-w-[120px] bg-theme-primary text-white px-4 py-2 rounded-md hover:bg-sky-500 transition"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}
            <div className="mb-6 text-green-600 font-semibold">
                {message}
            </div>
        </div>


    );
};
export default RegisterProduct;
