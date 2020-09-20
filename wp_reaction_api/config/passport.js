const fs = require('fs');
const fetch = require('node-fetch');
const SamlStrategy = require('passport-saml').Strategy;


const workplaceUrl = {
  messages_url: "https://graph.facebook.com/v2.6/me/messages?access_token=",
  email_url:
    "https://graph.facebook.com/{email}?fields=picture&access_token=",
  access_token: process.env.HANGBOT_ACCESS_KEY || "<Access Token>",
};



const config = {
  strategy: 'saml',
  saml: {
    path: '/api/loginCallback',
    entryPoint:
      process.env.SAML_ENTRY_POINT ||
      'https://login.gshs.co.kr/auth/realms/gsshop/protocol/saml/clients/urn:gsshop:hangbot:test',
    privateCert: fs.readFileSync(
      process.env.SAML_PEM_PATH || './config/authentication/local.pem',
      'utf-8'
    ),
    signatureAlgorithm: 'sha256',
  },
};

const init = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(
    new SamlStrategy(
      {
        path: config.saml.path,
        entryPoint: config.saml.entryPoint,
        issuer: config.saml.issuer,
        privateCert: config.saml.privateCert,
        signatureAlgorithm: config.saml.signatureAlgorithm,
      },
      (profile, done) => {

        try {
          let replaced_email_url = workplaceUrl.email_url.replace(
            "{email}",
            profile.email
          );
          fetch(replaced_email_url + workplaceUrl.access_token, {
            method: "POST",
          }).then(res => res.json())
          .then(json => {
            return done(null, {
              id: profile.nameID,
              name: profile.given_name,
              email: profile.email,
              profile_image: json && json.picture && json.picture.data.url
            });  
            
          });
        } catch (err) {
          console.log(err)
          return done(null, {
            id: profile.nameID,
            name: profile.given_name,
            email: profile.email,
          });
        }

      }
    )
  );
};

module.exports = {
  init,
  config,
}
