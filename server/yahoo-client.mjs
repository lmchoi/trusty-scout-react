import { Issuer } from 'openid-client';
import config from "../auth_config.json";

function createClient(issuer) {
    console.log('Discovered issuer %s %O', issuer.issuer, issuer.metadata);
    return new issuer.Client({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uris: config.redirectUris,
        response_types: ['code'],
        id_token_signed_response_alg: 'ES256'
    });
}

const createOAuthClient = async function () {
    const issuer = await Issuer.discover('https://api.login.yahoo.com');
    return createClient(issuer);
}

export default createOAuthClient;