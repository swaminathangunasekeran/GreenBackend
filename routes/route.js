/**
 * Created by Swami on 05/06/17.
 */
const express = require('express');
const app = require("../app");
const router = express.Router();
const requesthandler =  require("../middleware/requestHandler");
const reshandler =  require("../middleware/responseHandler");
const pubApprovalHandler =  require("../middleware/pubApprovalHandler");
const publicationHandler =  require("../middleware/publicationHandler");
const adminOnlyHandler =  require("../middleware/adminOnlyHandler");



router.use(reshandler);
router.post('/signup',require('./signup'));
router.post('/fbSignin',require('./fbSignin'));
router.post('/signin',require('./signin'));
router.get('/signout',require('./signout'));
router.post('/compile', require('./compile'));
router.post('/searchUser', require('./searchUser'));
router.post('/forgotPassword', require("./forgotPassword"));
router.get('/user/:id' , require('./getUserProfile'))
router.post('/getComments', require("./getComments"));



router.use(requesthandler);
router.post('/follow', require('./followUser'));
router.post('/unfollow', require('./unfollowUser'));
router.post('/isFollow', require('./isFollowing'));
router.get('/getTrending/:language' , require("./getTrending"));
router.get('/topic/:topic/:language' , require("./getTopicInsight"));
router.get('/getHomePage/:language' , require("./getHomePage"));
router.get('/users',  require('./users'));
router.post('/createInsight',  require('./createInsight'));
//router.post('/saveInsight',  require('./saveInsight'));
router.post('/updateInsight',  require('./updateInsight'));
router.post('/reqpublishInsight',  require('./reqpublishInsight'));
router.post('/createPublications',  require('./createPublications'));
router.get('/getUsersPublications',  require('./getUsersPublications'));
router.post('/reqUserToPublication',  require('./reqUserToPublication'));
router.get('/getUserInsight',  require('./getUserInsight'));
router.post('/getInsightToEdit', require("./getInsightToEdit"));
router.get('/getInsightToRead/:insightURL', require("./getInsightToRead"));
router.post('/uploadImage', require("./uploadImage"));
router.get('/verifyUser', require("./verifyUser"));
router.post('/updatePassword', require("./updatePassword"));
router.post('/updateUser', require("./updateUser"));
router.post('/reqRepublishInsight', require("./reqRepublishInsight"));
router.post('/likeInsight', require("./likeInsight"));
router.post('/unlikeInsight', require("./unlikeInsight"));
router.post('/comments', require("./comments"));
router.post('/deletecomment', require("./deletecomment"));



router.use(adminOnlyHandler);
router.post('/addRss', require("./addPubFromRss"));
router.get('/getWebInsights/:language', require("./getWebInsights"));
router.post('/updateWebInsights', require("./updateWebInsights"));


router.use(publicationHandler);
router.use('/addUserToPublication',pubApprovalHandler);
router.post('/addUserToPublication',  require('./addUserToPublication'));
//router.use('/insightApproval',pubApprovalHandler);
router.post('/insightApproval',  require('./insightApproval'));





//router.get('/',  require('./index'));

//The 404 Route (ALWAYS Keep this as the last route)
router.get('*', function(req, res){
    var err = new Error('Not Found');

    res.status(404);
    res.json(404,`Requested API not found ${err}`);

});


module.exports = router;
