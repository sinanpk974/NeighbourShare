import { Router } from "express";
import * as rh from './reqHandler/userController.js'
import * as ri from './reqHandler/itemController.js'
import * as rr from './reqHandler/requestController.js'
import * as rj from './reqHandler/reviewController.js'
import * as ad from './reqHandler/adminController.js'
import * as rk from './reqHandler/notificationController.js'
import { Auth } from "./middleware/authentication.js";
import AdminAuth from "./middleware/adminAuth.js"



const router = Router()

router.route('/register').post(rh.Register)
router.route('/login').post(rh.Login)
router.route('/myProfile').get(Auth,rh.getmyProfile)
router.route('/updateProfile').patch(Auth,rh.updateProfile)
router.route('/deleteAccount').delete(Auth,rh.deleteAccount)
router.route('/profilePublic/:id').get(Auth,rh.getPublicProfile)
router.route('/profileContact/:id').get(Auth,rh.getContactDetails)

router.route('/addItem').post(Auth,ri.addItem)
router.route('/getItems').get(ri.getItems)
router.route("/item/:id").get(Auth, ri.getSingleItem);
router.route('/myItems').get(Auth,ri.getMyItems)
router.route('/updateItem/:id').patch(Auth,ri.updateItem)
router.route('/deleteItem/:id').delete(Auth,ri.deleteItem)
router.route('/search').get(ri.searchItems)

router.route("/request/:itemId").post(Auth,rr.sendRequest);
router.route('/myRequests').get(Auth,rr.getMyRequests)
router.route('/receivedRequests').get(Auth,rr.getReceivedRequests)
router.route('/acceptRequest/:id').patch(Auth,rr.acceptRequest)
router.route('/rejectRequest/:id').patch(Auth,rr.rejectRequest)
router.route('/return/:id').patch(Auth,rr.confirmReturn)

router.route('/review/:requestId').post(Auth,rj.addReview)
router.route('/itemReview/:itemId').get(Auth,rj.getItemReviews)
router.route('/userReview/:userId').get(Auth,rj.getUserReviews)
router.route('/myReviews').get(Auth,rj.getMyReviews)
router.route("/review/:requestId/:type").get(Auth, rj.getReviewByRequest);
router.route("/reviewById/:reviewId").get(Auth, rj.getReviewById);
router.route("/reviewsByRequest/:requestId").get(Auth, rj.getReviewsByRequest);

router.get("/notifications",Auth,rk.getNotifications);
router.get("/notifications/unread-count",Auth,rk.getUnreadNotificationCount);
router.patch("/notifications/read-all",Auth,rk.markAllNotificationsAsRead);
router.patch("/notifications/:id/read",Auth,rk.markNotificationAsRead);


router.route('/admin/users').get(Auth,AdminAuth,ad.getProfile)
router.route('/admin/users/:id').get(Auth,AdminAuth,ad.getSingleUser)
router.route('/admin/delusers/:id').delete(Auth,AdminAuth,ad.deleteUser)
router.route('/admin/pending-users').get(Auth,AdminAuth,ad.getPendingUsers)
router.route('/admin/users/:id/verify').patch(Auth,AdminAuth,ad.verifyUser)
router.route('/admin/users/:id/reject').patch(Auth, AdminAuth, ad.rejectUser);
router.route('/admin/users/:id/block').patch(Auth,AdminAuth,ad.blockUser)
router.route('/admin/users/:id/unblock').patch(Auth,AdminAuth,ad.unblockUser)
router.route('/admin/dashboard').get(Auth,AdminAuth,ad.adminDashboard)
router.route('/admin/items/:id').delete(Auth,AdminAuth,ad.deleteAnyItem)
router.route('/admin/requests').get(Auth,AdminAuth,ad.getAllRequests)
router.route('/admin/reviews').get(Auth,AdminAuth,ad.getAllReviews)
router.route('/admin/reviews/:id').delete(Auth,AdminAuth,ad.deleteReview)
router.route('/admin/pending-deletions').get(Auth,AdminAuth,ad.getPendingDeletions)
router.route('/approveDeletion/:id').patch(Auth,AdminAuth, ad.approveDeletion);
router.route('/rejectDeletion/:id').patch(Auth, AdminAuth, ad.rejectDeletion);
router.route("/admin/profile").get(Auth, AdminAuth, ad.getAdminProfile);
router.route("/admin/profile").patch(Auth,AdminAuth,rh.updateProfile);

export default router