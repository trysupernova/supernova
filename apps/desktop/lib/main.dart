import 'package:desktop_flutter/src/screens/auth.dart';
import 'package:desktop_flutter/src/screens/settings.dart';
import 'package:desktop_flutter/src/screens/today_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  runApp(const ProviderScope(
    child: RootApp(),
  ));
}

class RootApp extends StatelessWidget {
  const RootApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Supernova',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
        useMaterial3: true,
      ),
      home: const AuthScreen(),
      routes: {
        TodayViewScreen.routeName: (context) => const TodayViewScreen(),
        SettingsScreen.routeName: (context) => const SettingsScreen(),
      },
    );
  }
}
