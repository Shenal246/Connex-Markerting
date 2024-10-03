
// const BACKEND_URL ='https://systemapi.connexit.biz';
const BACKEND_URL ='http://192.168.13.249:3001';


const config = {
    loginapi: `${BACKEND_URL}/stafflogin`,
    changePasswordApi: `${BACKEND_URL}/change-password-staff`,
    verifytoken: `${BACKEND_URL}/verifytoken`,
    logoutapi: `${BACKEND_URL}/stafflogout`,
    getCategoriesapi: `${BACKEND_URL}/get-categories-srilanka`,
    addCategoryapi: `${BACKEND_URL}/add-category-srilanka`,
    updatecategoriesapi: `${BACKEND_URL}/update-category-srilanka`,
    addFeaturesapi: `${BACKEND_URL}/add-features-srilanka`,
    getFeaturesForCatapi: `${BACKEND_URL}/get-features-srilanka`,
    getVendorsapi: `${BACKEND_URL}/get-vendors-srilanka`,
    getPMapi: `${BACKEND_URL}/get-PM-srilanka`,
    getFeaturesForProductapi: `${BACKEND_URL}/get-featuresforcat-srilanka`,
    addproductsapi: `${BACKEND_URL}/add-product`,
    getstatusapi: `${BACKEND_URL}/get-status`,

    getproductsapi: `${BACKEND_URL}/get-products`,

    getproductsIdapi: `${BACKEND_URL}/get-products-id`,
    
    updateProducstapi: `${BACKEND_URL}/update-products`,
    getvideoinfo: `${BACKEND_URL}/get-video-info`,
    addvideoinfo: `${BACKEND_URL}/add-video-info`,
    updateVideoapi: `${BACKEND_URL}/update-video-info`,
    getPartnerApplicationsapi: `${BACKEND_URL}/get-becomePartner`,
    validatePartnerApi: `${BACKEND_URL}/becomePartnerRegister`,
    rejectPartnerApi: `${BACKEND_URL}/becomePartnerRejectApi`,
    getpromoapi: `${BACKEND_URL}/get-promotions`,
    addPromoapi: `${BACKEND_URL}/add-promotions`,
    updatePromoapi: `${BACKEND_URL}/update-promotions`,
    getstaffdetailsapi: `${BACKEND_URL}/getstaffdetailsapi`,
    getpromotiontypeapi: `${BACKEND_URL}/getpromotiontypeapi`,
    addVendorapi: `${BACKEND_URL}/add-vendorapi`,
    updateVendorapi: `${BACKEND_URL}/update-vendor`,
    marketingDashboatPrCountpi:`${BACKEND_URL}/get-marketingDashboardDetails`,
    partnerRq:`${BACKEND_URL}/get-partnerRq`,
getPrivileges:`${BACKEND_URL}/getStaffPrivileges`,

    backendUrl: BACKEND_URL,  // Optional if you still need the base URL separately
};

export default config;
