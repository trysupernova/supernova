import 'dart:io';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:oauth2/oauth2.dart' as oauth2;
import 'package:url_launcher/url_launcher.dart';

typedef AuthenticatedBuilder = Function(
    BuildContext context, oauth2.Client client);

class OAuthLoginWidget extends StatefulWidget {
  const OAuthLoginWidget({
    required this.builder,
    required this.clientId,
    required this.clientSecret,
    required this.scopes,
    required this.authorizationUrl,
    required this.tokenEndpoint,
    super.key,
  });
  final AuthenticatedBuilder builder;
  final String clientId;
  final String clientSecret;
  final Uri authorizationUrl;
  final Uri tokenEndpoint;
  final List<String> scopes;

  @override
  State<StatefulWidget> createState() => _OAuthLoginState();
}

class _OAuthLoginState extends State<OAuthLoginWidget> {
  HttpServer? _redirectServer;
  oauth2.Client? _client;

  @override
  Widget build(BuildContext context) {
    final client = _client;
    if (client != null) {
      return widget.builder(context, client);
    }

    return Center(
      child: ElevatedButton(
        onPressed: () async {
          await _redirectServer?.close();
          // Bind to an ephemeral port on localhost
          _redirectServer = await HttpServer.bind('localhost', 0);
          var authenticatedHttpClient = await _getOAuth2Client(
              Uri.parse('http://localhost:${_redirectServer!.port}/auth'));
          setState(() {
            _client = authenticatedHttpClient;
          });
        },
        child: const Text('Login to Github'),
      ),
    );
  }

  Future<oauth2.Client> _getOAuth2Client(Uri redirectUrl) async {
    if (widget.clientId.isEmpty || widget.clientSecret.isEmpty) {
      throw const OAuthLoginException(
          'clientId and clientSecret must be not empty.');
    }
    var grant = oauth2.AuthorizationCodeGrant(
      widget.clientId,
      widget.authorizationUrl,
      widget.tokenEndpoint,
      secret: widget.clientSecret,
      httpClient: _JsonAcceptingHttpClient(),
    );
    var authorizationUrl =
        grant.getAuthorizationUrl(redirectUrl, scopes: widget.scopes);

    await _redirect(authorizationUrl);
    var responseQueryParameters = await _listen();
    var client =
        await grant.handleAuthorizationResponse(responseQueryParameters);
    return client;
  }

  Future<void> _redirect(Uri authorizationUrl) async {
    if (await canLaunchUrl(authorizationUrl)) {
      await launchUrl(authorizationUrl);
    } else {
      throw OAuthLoginException('Could not launch $authorizationUrl');
    }
  }

  Future<Map<String, String>> _listen() async {
    var request = await _redirectServer!.first;
    var params = request.uri.queryParameters;
    request.response.statusCode = 200;
    request.response.headers.set('content-type', 'text/plain');
    request.response.writeln('Authenticated! You can close this tab.');
    await request.response.close();
    await _redirectServer!.close();
    _redirectServer = null;
    return params;
  }
}

class _JsonAcceptingHttpClient extends http.BaseClient {
  final _httpClient = http.Client();
  @override
  Future<http.StreamedResponse> send(http.BaseRequest request) {
    request.headers['Accept'] = 'application/json';
    return _httpClient.send(request);
  }
}

class OAuthLoginException implements Exception {
  const OAuthLoginException(this.message);
  final String message;
  @override
  String toString() => message;
}
