const githubScopes = ['repo', 'read:org'];

final githubAuthorizationEndpoint =
    Uri.parse('https://github.com/login/oauth/authorize');
final githubTokenEndpoint =
    Uri.parse('https://github.com/login/oauth/access_token');
