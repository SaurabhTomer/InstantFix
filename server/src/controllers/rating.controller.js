import Rating from "../models/rating.model.js";
import ServiceRequest from "../models/serviceRequest.model.js";
import User from '../models/user.model.js'

//create rating 
export const createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.params;
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const request = await ServiceRequest.findById(requestId);

    if (!request || request.status !== "completed") {
      return res.status(400).json({
        message: "Rating allowed only after job completion",
      });
    }

    if (request.customer.toString() !== userId) {
      return res.status(403).json({
        message: "Not authorized to rate this request",
      });
    }

    
    const alreadyRated = await Rating.findOne({ request: requestId });
    if (alreadyRated) {
      return res.status(400).json({
        message: "Rating already submitted",
      });
    }

    const newRating = await Rating.create({
      request: requestId,
      user: userId,
      electrician: request.electrician,
      rating,
      review,
    });

    // update electrician stats
    const electrician = await User.findById(request.electrician);

    const newTotal = electrician.totalRatings + 1;  // total count increase by 1

    const newAverage = (electrician.averageRating * electrician.totalRatings + rating) / newTotal;

    electrician.totalRatings = newTotal;
    electrician.averageRating = newAverage;
    await electrician.save();

    return res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
      rating: newRating,
    });

  } catch (error) {
    console.error("Create rating error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


// get electrician rating
export const getElectricianRatings = async (req, res) => {
  try {
    const { electricianId } = req.params;

    // electrician exists
    const electrician = await User.findById(electricianId);
    if (!electrician || electrician.role !== "electrician") {
      return res.status(404).json({
        message: "Electrician not found",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [ratings, total] = await Promise.all([
      Rating.find({ electrician: electricianId })
        .populate("user", "name") // reviewer name 
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Rating.countDocuments({ electrician: electricianId }),
    ]);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: ratings.length,
      ratings,
    });

  } catch (error) {
    console.error("Get electrician ratings error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// update existing rating
export const updateRating = async (req, res, next) => {
  try {
    const { ratingId } = req.params;
    const { rating, review } = req.body;

    // Rating exist check
    const existingRating = await Rating.findById(ratingId);

    if (!existingRating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }

    //  Ownership check 
    if (existingRating.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this rating",
      });
    }

    //  Rating validation 
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }
      existingRating.rating = rating;
    }

    //  Review update
    if (review !== undefined) {
      existingRating.review = review;
    }

    const updatedRating = await existingRating.save();

    res.status(200).json({
      success: true,
      message: "Rating updated successfully",
      data: updatedRating,
    });

  } catch (error) {
      console.error("Update  ratings error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
