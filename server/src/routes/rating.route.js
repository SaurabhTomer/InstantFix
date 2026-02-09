import  express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createRating, getElectricianRatings } from '../controllers/rating.controller.js';


const ratingRouter = express.Router();


// user rates a completed request
ratingRouter.post(
  "/:requestId",
  authMiddleware,
  createRating
);



export default ratingRouter;