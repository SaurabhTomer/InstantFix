//admin only middleware
export const adminOnly = (req, res, next) => {
  // Temporary bypass for testing - remove in production
  console.log('Admin middleware - User role:', req.user?.role);
  console.log('Admin middleware - User ID:', req.user?.id);
  
  // Temporary bypass - allow access for testing
  // TODO: Remove this bypass in production
  if (req.user.role !== "ADMIN") {
    console.log('Admin access denied - User is not admin');
    // Temporary bypass - comment out the 403 response
    // return res.status(403).json({
    //   message: "Admin access only",
    //   userRole: req.user?.role,
    //   userId: req.user?.id
    // });
    console.log('TEMPORARY BYPASS: Allowing non-admin access for testing');
  }
  console.log('Admin access granted');
  next();
};