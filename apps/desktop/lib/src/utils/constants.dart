const githubScopes = ['repo', 'read:org'];

final githubAuthorizationEndpoint =
    Uri.parse('https://github.com/login/oauth/authorize');
final githubTokenEndpoint =
    Uri.parse('https://github.com/login/oauth/access_token');

const environmentMode =
    String.fromEnvironment('ENVIRONMENT', defaultValue: "dev");
final wwwAppBaseUrl = environmentMode == "dev"
    ? Uri.parse('http://localhost:3000')
    : Uri.parse('https://trysupernova.one');
