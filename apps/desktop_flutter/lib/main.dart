import 'package:desktop_flutter/credentials.dart';
import 'package:desktop_flutter/src/github_oauth.dart';
import 'package:desktop_flutter/src/pages/today_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:window_to_front/window_to_front.dart';

void main() {
  runApp(const ProviderScope(
    child: MyApp(),
  ));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return OAuthLoginWidget(
        builder: (context, httpClient) {
          WindowToFront.activate();
          return const Scaffold(
            body: TodayViewPage(),
          );
        },
        clientId: githubClientId,
        clientSecret: githubClientSecret,
        authorizationUrl: githubAuthorizationEndpoint,
        tokenEndpoint: githubTokenEndpoint,
        scopes: githubScopes);
  }
}
