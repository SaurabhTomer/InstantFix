import  express from 'express'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware.js';
import { createRating, deleteRating, updateRating } from '../controllers/rating.controller.js';


const ratingRouter = express.Router();


// user rates a completed request
ratingRouter.post(
  "/:requestId",
  authMiddleware,
  createRating
);

// update a rating
ratingRouter.patch("/:ratingId", authMiddleware,authorizeRoles("USER") ,updateRating);

//delete a rating
ratingRouter.delete("/:ratingId", authMiddleware , authorizeRoles("USER"), deleteRating);


export default ratingRouter;