const express = require("express");

const ctrl = require("../controllers/patients");

const { validateBody, authenticate, uploadCloud, isValidId } = require("../middlewares");
const { registerSchema } = require("../models/schemas");

const authRouter = express.Router();

// signup
authRouter.post("/register", validateBody(registerSchema), ctrl.register);

// signin
authRouter.post("/login", ctrl.login);

authRouter.get('/chats/:id', ctrl.chats)

authRouter.get("/current", authenticate, ctrl.getCurrent);

authRouter.post("/logout", authenticate, ctrl.logout);

authRouter.get('/profile/:id', ctrl.getData)

authRouter.post('/profile/:id', ctrl.updatePatient);


authRouter.post('/password', ctrl.updatePassword);

authRouter.patch(
  "/avatars",
  authenticate,
  uploadCloud.single("avatar"),
  ctrl.updateAvatar
);

authRouter.delete("/:id", authenticate, isValidId, ctrl.deleteAccount)

module.exports = authRouter;
