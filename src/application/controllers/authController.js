const AWS = require('aws-sdk');
require('dotenv').config();

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
});
const { COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } = process.env;

exports.register = async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  try {
    await cognito.adminCreateUser({
      UserPoolId:          COGNITO_USER_POOL_ID,
      Username:            email,
      TemporaryPassword:   senha,
      UserAttributes: [
        { Name: 'email',        Value: email },
        { Name: 'email_verified',Value: 'true' },
      ],
      MessageAction: 'SUPPRESS',
    }).promise();
    res.status(201).json({ message: 'Usuário criado com sucesso. Use /api/auth/confirmar-senha para ativar.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar usuário', detalhes: err.message });
  }
};

exports.confirmarSenha = async (req, res) => {
  const { email, senhaTemporaria, novaSenha } = req.body;
  if (!email||!senhaTemporaria||!novaSenha) return res.status(400).json({ error:'Todos os campos são obrigatórios' });
  try {
    const authResult = await cognito.initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: { USERNAME: email, PASSWORD: senhaTemporaria },
    }).promise();
    if (authResult.ChallengeName !== 'NEW_PASSWORD_REQUIRED') {
      return res.status(400).json({ error:'Desafio inesperado.' });
    }
    const final = await cognito.respondToAuthChallenge({
      ClientId:           COGNITO_CLIENT_ID,
      ChallengeName:      'NEW_PASSWORD_REQUIRED',
      Session:            authResult.Session,
      ChallengeResponses: { USERNAME: email, NEW_PASSWORD: novaSenha },
    }).promise();
    res.json({ message:'Senha atualizada!', tokens: final.AuthenticationResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:'Erro ao confirmar senha', detalhes: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  if (!email||!senha) return res.status(400).json({ error:'Email e senha são obrigatórios' });
  try {
    const r = await cognito.initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: { USERNAME: email, PASSWORD: senha },
    }).promise();
    const { AccessToken, IdToken, RefreshToken } = r.AuthenticationResult;
    res.json({ accessToken: AccessToken, idToken: IdToken, refreshToken: RefreshToken });
  } catch {
    res.status(401).json({ error:'Email ou senha inválidos' });
  }
};
