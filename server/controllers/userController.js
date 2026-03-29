import User from '../models/User.js'

// @route PUT /api/user/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    return res.status(200).json({ success: true, user })
  } catch (error) {
    next(error)
  }
}