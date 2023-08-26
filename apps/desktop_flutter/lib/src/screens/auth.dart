import 'package:desktop_flutter/src/providers/appconfig_providers.dart';
import 'package:desktop_flutter/src/screens/today_view.dart';
import 'package:desktop_flutter/src/utils/constants.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:window_to_front/window_to_front.dart';

import '../github_oauth.dart';


class AuthScreen extends ConsumerWidget {
  const AuthScreen({super.key});

  @override
  Widget build(BuildContext context, ref) {
    final appConfig = ref.read(appConfigProvider);

    return OAuthLoginWidget(
        builder: (context, httpClient) {
          WindowToFront.activate();
          return const Scaffold(
            body: TodayViewScreen(),
          );
        },
        clientId: appConfig.githubClientId,
        clientSecret: appConfig.githubClientSecret,
        authorizationUrl: githubAuthorizationEndpoint,
        tokenEndpoint: githubTokenEndpoint,
        scopes: githubScopes);
  }
}
