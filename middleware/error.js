module.exports = (err, _req, res, _next) => {
  if (err.isJoi) {
    return res.status(400)
      .json({ err: { message: err.details[0].message, code: 'invalidData' } });
  }

  if (err.code && err.status) {
    return res.status(err.status).json({ err: { message: err.message, code: err.code } });
  }

  return res.status(500).json({ message: err.message });
};
