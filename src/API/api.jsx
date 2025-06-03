
import axios from './axios';



// Example: Get all users
export const extCompanyLogin = (userData) => {
    console.log("debugging", userData)
    // return axios.post(`/company/login`, {
    //     'email':userData.email,
    //     'password':userData.password
    //     }
    // )

    // email and password is passing thro' headers use below code

    return axios.post('/company/login', {}, {
        headers: {
            "email": userData.email,
            "password": userData.password,
        },
    });

    // return axios(config);  
};


export const extCompanyUserRegister = (userInput) => {
    return axios.post(`/company/company-register`, {
        // "company": {
        // "name": userInput.companyName,
        // "type": userInput.companyType,
        // "website": userInput.website,
        // "status": "A",
        // "verification_flag": 1,
        // "verified_by_id": 1
        // },

        // "company_address": {
        // "phone1": userInput.phone_1,
        // "phone2": userInput.phone_2,
        // "email": userInput.email,
        // "address_line1": userInput.addressLine1,
        // "address_line2": userInput.addressLine2,
        // "state": userInput.state,
        // "zipcode": userInput.zipcode,
        // "country": userInput.country,
        // "status": "A"
        // },
        // "user": {
        // "first_name": userInput.firstname,
        // "last_name": userInput.lastname,
        // "phone": "",
        // "role": "admin",
        // "status": "A",
        // }
        "company": {
            "name": userInput.companyName,
            "type": userInput.companyType,
            "size": userInput.employeeSize,
            "companyEmail": userInput.companyEmail,

        },

        "user": {
            "fullName": userInput.fullName,
        }
    },
        {
            headers: {

                "User": JSON.stringify({
                    "email": userInput.userEmail,
                    "password": userInput.password,

                })
            },
        }

    )
};

export const extCompanyUserRegVerifyOTP = (userInput) => {
    console.log("userInput", userInput)
    return axios.post(`/company/verify-otp`, {
        "email": userInput.email,
        "otp": userInput.otp
    })
};

export const extCompanyUserRegResendOTP = (email) => { 
    return axios.post(`/company/resent-otp`, {},
        {
            headers: {
                "email": email,
            },

        })
}

export const extCompanyUserForgetpwd = (email) => {
    return axios.post(`/company/forgetpasswrd`, {}, {
        headers : {
            email
        }
    })
}; 
export const extCompanyUserResetpwd = (userData) => {
    return axios.post(`/company/reset-password`, {
        "email": userData.email, 
        "new_password": userData.new_password,
    })
};


export const extCompanyRegorAddPrdct = (pro_name) => {
    const token = localStorage.getItem('authToken');
    return axios.post(`/ext-product/add`, { "media_name": pro_name })
};

// export const extCompanyRegorAddPrdct = (pro_name) => {
//     return axios.post(`/ext-product/add`, {
//         "media_name": pro_name,
//         "company_id": 1  // remove this line only one parameter
//      })  
// };
export const extCompanyAuthFacebook = (inputData) => {
    return axios.post(`/ext-product/add_datasource`, {
        "auth_code": inputData.code,
        "product_id": inputData.product_id,
        "data_source_id": 7066,//inputData.data_source_id,
        "product_url": inputData.product_url,
        "page_name": inputData.page_name
    },
        // {
        //     headers:{

        //        "authCode":inputData.code,
        //     }
        // }
    )
};

export const extCompanyAuthYoutube = (inputData) => {
    return axios.post(`/ext-product/add_datasource`, {
        "auth_code": inputData.code,
        "product_id": inputData.product_id,
        "data_source_id": 8984, //inputData.data_source_id,
        "product_url": inputData.product_url,
        "page_name": inputData.page_name
    },
        // {
        //         headers:{

        //              "authCode":inputData.code,
        //         }
        // }
    )
};

export const extCompanyAuthTwitter = (inputData) => {

    return axios.post(`/ext-product/add_datasource`, {
        "auth_code": inputData.code,
        "product_id": inputData.product_id,
        "data_source_id": 8487, //inputData.data_source_id,
        "product_url": inputData.product_url,
        "page_name": inputData.page_name,
        "code_verifier": inputData.code_verifier

    },
        // {
        //         headers:{

        //             "authCode":inputData.code,
        //             "codeVerifier" : inputData.code_verifier
        //         }
        // }
    )
};

export const extCompanyAuthLinkedin = (inputData) => {
    return axios.post(`/ext-product/add_datasource`, {
        "auth_code": inputData.code,
        "product_id": inputData.product_id,
        "data_source_id": 7668,
        "product_url": inputData.product_url,
        "page_name": inputData.page_name,

    },
    )
};

export const extCompanyProductDataById = (productId) => {
    console.log("debugging productId", productId);
    return axios.get(`/ext-product/list_datasource/${productId}`);
};

export const extCompanyMstrDataSource = () => {
    return axios.get(`/master/get_all_data_sources`)
};

export const extCompanyProductData = () => {
    // return axios.get(`/ext-product/list/${userId}`, )  
    return axios.get(`/ext-product/list`)
};

export const extCompanyProductDataSource = (productId) => {
    return axios.get(`/ext-product/list_datasource/${productId}`)
    // return axios.get(`/ext-product/list`)   
};

export const extCompanyPrdctFBlistVideos = (extPrdctDSId) => {
    return axios.get(`/facebook/listposts/${extPrdctDSId}`)
    // return axios.get(`/ext-product/list`)   
};

export const extCompanyProductAndDS = () => {
    // return axios.get(`/ext-product/list/${userId}`, )  
    return axios.get(`/ext-product/datasource/list`)
};

export const extCompanyPrdctTWTlistVideos = (extPrdctDSId) => {
    return axios.get(`/twitter/listposts/${extPrdctDSId}`)
    // return axios.get(`/ext-product/list`)   
};
export const extCompanyPrdctLIlistVideos = (extPrdctDSId) => {
    return axios.get(`/linkedin/listposts/${extPrdctDSId}`)
    // return axios.get(`/ext-product/list`)   
};
export const extCompanyPrdctYTlistVideos = (extPrdctDSId) => {
    return axios.get(`/youtube/listposts/${extPrdctDSId}`)
    // return axios.get(`/ext-product/list`)   
};
export const extCompanyPrdctIGlistVideos = (extPrdctDSId) => {
    return axios.get(`/instagram/listposts/${extPrdctDSId}`)
    // return axios.get(`/ext-product/list`)   
};
export const extCompanyPrdctlistVideosByPlatform = (postId, platform) => {
    return axios.get(`/${platform}/post/${postId}`)
    // return axios.get(`/ext-product/list`)   
};
export const extCompanyPrdctFBListComments = (extProductId) => {
    return axios.get(`/facebook/productfblistcomments/${extProductId}`)
    // return axios.get(`/ext-product/list`)   
};
export const extCompanyPrdctIGListComments = (extProductId) => {
    return axios.get(`/instagram/instagramproductcomments/${extProductId}`)
    // return axios.get(`/ext-product/list`)   
};
export const extCompanyPrdctYTListComments = (extProductId) => {
    return axios.get(`/youtube/listcomments/get-reviews`, {
        "product_id": extProductId,
    }
    )
    // return axios.get(`/ext-product/list`)   
};
export const extCompanyPrdctTWTListComments = (extProductId) => {
    return axios.get(`/twitter/allproductcmts/${extProductId}`)
    // return axios.get(`/ext-product/list`)   
};
export const extCompanyPrdctLIListComments = (extProductId) => {
    return axios.get(`/linkedin/productlistcomments`, {
        "product_id": extProductId,
    })
    // return axios.get(`/ext-product/list`)   
};

export const extCompanyPrdctListCommentsByPlatform = (postId, platform) => {
    switch (platform.toLowerCase()) {
        case 'facebook':
            {
                return axios.get(`/facebook/listcomments/${postId}`);
            }
        case 'twitter':
            return axios.post(`/twitter/listcomments/${postId}`);
        case 'youtube':
            return axios.post(`/youtube/listcomments/get-reviews/${postId}`);
        case 'instagram':
            return axios.get(`/instagram/listComments/${postId}`);
        default:
            return Promise.reject(new Error(`Unsupported platform: ${selectedPlatform}`));
    }
};
// return axios.get(`/ext-product/list`)   

export const extCompanyPrdctCreatePost = (selectedPlatform, payload) => {
    return axios.post(`/${selectedPlatform}_post/addposts`, payload);
    // return axios.get(`/ext-product/list`)   
};

export const extCompanyGetAllCreatePosts = (platform) => {
    if (platform.name==="instagram"){
         return axios.get(`/${platform.name}_post/instaposts`);
    }else if (platform.name==="linkedin"){
        return axios.get(`/${platform.name}_post/${platform.postCode}posts`);
    }else
        return axios.get(`/${platform.name}_post/${platform.postCode}posts`);
    // return axios.get(`/ext-product/list`)   
};

export const extCompanyDeleteCreatedPost = (platformName, postId) => {
    return axios.delete(`/${platformName}_post/deleteposts/${postId}`);
    // return axios.get(`/ext-product/list`)   
};

export const extCompanyEditedCreateddPost = (platformName, postId, payload) => {
    return axios.patch(`0/${platformName}_post/updateposts/${postId}`, payload);
    // return axios.get(`/ext-product/list`)   
};

export const replyComment = (cmtData) => {
    return axios.post(`${cmtData.platform}/reply_cmt/${cmtData.reviewId}`, {

        "reply_text": cmtData.replyText,
        "ext_product_data_source_id": cmtData.extDSId
    });

};

export const extCompanyGetPostCreationByBusiness = (platformType, businessId) => {
    return axios.post(`${platformType}_post/datasource/posts/${businessId}`);

};