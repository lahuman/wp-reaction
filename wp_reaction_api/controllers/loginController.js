const passport = require('passport');
const passportConfig = require('../config/passport').config;

const login = passport.authenticate(passportConfig.strategy, {
  successRedirect: process.env.SAML_SUCCESS_URL || '/',
  failureRedirect: '/api/login',
});

const logout = async (req, res) => {
  req.logout();
  res.status(200).send({ logoutUrl: process.env.SAML_LOGOUT_URL });
};

const loginCheck = async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).end();
    return;
  }

  res.send({
    result: {
      ...req.user,
    },
  });
};

module.exports = {
  login,
  logout,
  loginCheck,
}
