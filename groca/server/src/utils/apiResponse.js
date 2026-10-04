export const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};

export const messageResponse = (res, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message
  });
};
