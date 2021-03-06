import dbg from 'debug';
import CONST from '../constants';
import AuthenticatorBase from './authenticator-base';

const debug = dbg('auth:clientsecret');

export default class ClientSecret extends AuthenticatorBase {
	constructor(opts = {}) {
		super(opts);
		this.clientSecret = opts.clientSecret;
		this.grantType = opts.serviceAccount ? CONST.OAUTH2.GRANT_TYPES.CLIENT_CREDENTIALS : this.grantType;
	}

	generateAuthorizeUrl(opts = {}) {
		const queryParams = {
			scope: this.scope,
			response_type: this.responseType,
			access_type: this.accessType,
			grant_type: this.grantType,
			client_id: this.clientId,
			redirect_uri: this.redirectUri
		};

		return super.generateAuthorizeUrl(queryParams);
	}

	getToken(authCode) {
		const queryParams = {
			client_id: this.clientId,
			client_secret: this.clientSecret,
			grant_type: this.grantType,
			scope: this.scope,
		};

		if (this.grantType === CONST.OAUTH2.GRANT_TYPES.AUTHORIZATION_CODE) {
			queryParams['redirect_uri'] = this.redirectUri;
			queryParams['code'] = authCode;
		}

		debug('getToken queryParams: ', queryParams);
		return super.getToken(queryParams);
	}

	refreshToken() {
		const queryParams = {
			client_id: this.clientId,
			client_secret: this.clientSecret,
			grant_type: CONST.OAUTH2.GRANT_TYPES.REFRESH_TOKEN,
			refresh_token: this.tokens.refresh_token
		};

		return super.getToken(queryParams);
	}

	getAccessToken() {
		const queryParams = {
			client_id: this.clientId,
			client_secret: this.clientSecret,
			grant_type: CONST.OAUTH2.GRANT_TYPES.REFRESH_TOKEN,
			refresh_token: this.tokens.refresh_token
		};

		debug('getAccessToken: ', queryParams);
		return super.getAccessToken(queryParams);
	}

	revokeToken() {
		const queryParams = {
			client_id: this.clientId,
			client_secret: this.clientSecret,
			refresh_token: this.tokens.refresh_token
		};

		debug('revoke: ', queryParams);
		return super.revokeToken(queryParams);
	}
}
