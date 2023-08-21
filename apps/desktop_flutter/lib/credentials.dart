const githubClientId = "6e6c8583708adec4770f";
const githubClientSecret = "06bcd55efc268ce59598bf2a0f3ad0b405b3cbc0";

const githubScopes = ['repo', 'read:org'];

final githubAuthorizationEndpoint =
    Uri.parse('https://github.com/login/oauth/authorize');
final githubTokenEndpoint = Uri.parse('https://github.com/login/oauth/access_token');
