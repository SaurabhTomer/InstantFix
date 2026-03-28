import dotenv from 'dotenv'
dotenv.config()
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Electrician from '../models/Electrician.js'
import redis from '../config/redis.js'
import {
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
  blacklistAccessToken,
  deleteRefreshToken
} from '../utils/tokenUtils.js'


// function to store refresh toekn in cookies
const sendRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
}

// @route POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    //check if already exists or not and create the electriican
    if (role === 'electrician') {
      const existing = await Electrician.findOne({ email })
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already exists' })
      }

      //hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      await Electrician.create({
        name,
        email,
        password: hashedPassword,
        phone,
        approvalStatus: 'pending'
      })

      return res.status(201).json({
        success: true,
        message: 'Registration successful, wait for admin approval'
      })
    }

    // customer register
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone
    })

    const payload = { id: user._id, role: user.role }   //payload
    const accessToken = generateAccessToken(payload)    //generate access token
    const refreshToken = generateRefreshToken(payload)      //generate refresh token

    await storeRefreshToken(user._id, refreshToken)         // store refresh token in redis for 7 days
    sendRefreshTokenCookie(res, refreshToken)       // store refresh token in cookie

    return res.status(201).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone:user.phone
      }
    })
  } catch (error) {
    next(error)     // calls global error handler
  }
}

// // @route POST /api/auth/login
// export const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//       if (!email || !password) {
//       return res.status(400).json({ success: false, message: 'Email and password required' })
//     }

//     //check electrician first
//     const electrician = await Electrician.findOne({ email }).select('+password')

//     if (electrician.role === 'electrician') {
//       const electrician = await Electrician.findOne({ email }).select('+password')
//       if (!electrician) {
//         return res.status(400).json({ success: false, message: 'Invalid credentials' })
//       }

//       const isMatch = await bcrypt.compare(password, electrician.password)
//       if (!isMatch) {
//         return res.status(400).json({ success: false, message: 'Invalid credentials' })
//       }

//       if (electrician.approvalStatus === 'pending') {
//         return res.status(403).json({ success: false, message: 'Your account is pending approval' })
//       }

//       if (electrician.approvalStatus === 'rejected') {
//         return res.status(403).json({ success: false, message: 'Your account has been rejected' })
//       }

//       const payload = { id: electrician._id, role: 'electrician' }
//       const accessToken = generateAccessToken(payload)
//       const refreshToken = generateRefreshToken(payload)

//       await storeRefreshToken(electrician._id, refreshToken)
//       sendRefreshTokenCookie(res, refreshToken)

//       return res.status(200).json({
//         success: true,
//         accessToken,
//         user: {
//           id: electrician._id,
//           name: electrician.name,
//           email: electrician.email,
//           role: 'electrician',
//           approvalStatus: electrician.approvalStatus
//         }
//       })
//     }

//     // customer / admin login
//     const user = await User.findOne({ email }).select('+password')
//     if (!user) {
//       return res.status(400).json({ success: false, message: 'Invalid credentials' })
//     }

//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: 'Invalid credentials' })
//     }

//     const payload = { id: user._id, role: user.role }
//     const accessToken = generateAccessToken(payload)
//     const refreshToken = generateRefreshToken(payload)

//     await storeRefreshToken(user._id, refreshToken)
//     sendRefreshTokenCookie(res, refreshToken)

//     return res.status(200).json({
//       success: true,
//       accessToken,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    // check electrician
    const electrician = await Electrician.findOne({ email }).select('+password');


    //if electrician is present
    if (electrician) {
      const isMatch = await bcrypt.compare(password, electrician.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      if (electrician.approvalStatus === 'pending') {
        return res.status(403).json({ success: false, message: 'Your account is pending approval' });
      }

      if (electrician.approvalStatus === 'rejected') {
        return res.status(403).json({ success: false, message: 'Your account has been rejected' });
      }

      const payload = { id: electrician._id, role: 'electrician' };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      await storeRefreshToken(electrician._id, refreshToken);
      sendRefreshTokenCookie(res, refreshToken);

      return res.status(200).json({
        success: true,
        accessToken,
        user: {
          id: electrician._id,
          name: electrician.name,
          email: electrician.email,
          phone: electrician.phone,
          role: 'electrician',
          approvalStatus: electrician.approvalStatus
        }
      });
    }

    // check normal user 
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const payload = { id: user._id, role: user.role };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await storeRefreshToken(user._id, refreshToken);
    sendRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
};

// @route POST /api/auth/refresh
export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken
    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token' })
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)

    const storedToken = await redis.get(`refresh:${decoded.id}`)
    if (!storedToken || storedToken !== token) {                // if stored token is not present or not present
      return res.status(401).json({ success: false, message: 'Invalid refresh token' })
    }

    const payload = { id: decoded.id, role: decoded.role }
    const accessToken = generateAccessToken(payload)

    return res.status(200).json({ success: true, accessToken })
  } catch (error) {
    next(error)
  }
}

// @route POST /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies?.refreshToken;

    if (token) await blacklistAccessToken(token)

    if (refreshToken) {
         const decoded = jwt.decode(refreshToken, process.env.JWT_REFRESH_SECRET);
        if (decoded?.id) await deleteRefreshToken(decoded.id);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

// @route GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const { id, role } = req.user       //payload

    if (role === 'electrician') {
      const electrician = await Electrician.findById(id)
      return res.status(200).json({ success: true, user: electrician })
    }

    const user = await User.findById(id)
    return res.status(200).json({ success: true, user })
  } catch (error) {
    next(error)
  }
}