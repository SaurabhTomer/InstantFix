import User from '../models/User.js'

// @route PUT /api/auth/update-profile
export const updateProfile = async (req, res, next) => {
  try {
    const { id, role } = req.user
    const { name, phone } = req.body

    let user

    //  find user based on role
    if (role === 'electrician') {
      user = await Electrician.findById(id)
    } else {
      user = await User.findById(id)
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    //  update basic fields
    if (name) user.name = name
    if (phone) user.phone = phone

    
    if (req.file) {
      user.avatar = req.file.path   //  direct URL
    }

    await user.save()

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || 'electrician',
        avatar: user.avatar
      }
    })

  } catch (error) {
    next(error)
  }
}