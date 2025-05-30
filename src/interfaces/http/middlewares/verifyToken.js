require('dotenv').config();
const ENV = process.env.NODE_ENV;

let verifier;
if (ENV !== 'local') {
  const { CognitoJwtVerifier } = require('aws-jwt-verify');
  verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    tokenUse:   'access',
    clientId:   process.env.COGNITO_CLIENT_ID,
  });
}

module.exports = async (req, res, next) => {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação ausente ou inválido' });
  }
  const token = h.split(' ')[1];
  if (ENV !== 'local') {
    try {
      await verifier.verify(token);
    } catch {
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
  }
  next();
};
