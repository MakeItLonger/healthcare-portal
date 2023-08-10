const { Error } = require('mongoose');

const ctrlWrapper = (ctrl) => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      console.log(error);
      if (error.name === 'MongoServerError' && error.code === 11000) {
        const duplicateKeyError = 'Email already exists.';
        return res.status(409).json({ error: duplicateKeyError });
      }

      if (error instanceof Error.ValidationError) {
        const messages = Object.values(error.errors).map((error) => error.message);
        return res.status(422).json(messages);
      }
      next(error);
    }
  };

  return func;
};

module.exports = ctrlWrapper;
