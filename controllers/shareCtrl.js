const asyncHandler = require('express-async-handler');
const CustomError = require('../utils/customError');


const baseUrl = 'http://localhost:8000';

const shareToFacebook = asyncHandler(async (req, res, next) => {
    const websiteUrl = baseUrl;
    const message = 'Check out this awesome e-learning platform!'
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}&quote=${encodeURIComponent(message)}`;
    if (!facebookShareUrl) {
        return next(new CustomError('Invalid sharing url', 500))
    }
    try {

        res.redirect(facebookShareUrl)
    } catch (err) {
        return next(new CustomError('Error while redirecting you to facebook sharing page', 500))
    }
})


const shareToTwitter = asyncHandler(async (req, res, next) => {
    const websiteUrl = baseUrl;
    const text = encodeURIComponent('Check out this awesome e-learning platform!');
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(websiteUrl)}&text=${text}`;
    if (!twitterShareUrl) {
        return next(new CustomError('Invalid sharing url', 500));
    }
    try {

        res.redirect(twitterShareUrl);
    } catch (err) {
        return next(new CustomError('Error while redirecting you to Twitter sharing page', 500));
    }
});

const shareToLinkedIn = asyncHandler(async (req, res, next) => {
    const websiteUrl = baseUrl;
    const linkedinShareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(websiteUrl)}`;
    if (!linkedinShareUrl) {
        return next(new CustomError('Invalid sharing url', 500));
    }
    try {

        res.redirect(linkedinShareUrl);
    } catch (err) {
        return next(new CustomError('Error while redirecting you to LinkedIn sharing page', 500));
    }
});



module.exports = {
    shareToFacebook,
    shareToTwitter,
    shareToLinkedIn,
};


