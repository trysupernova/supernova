import 'package:desktop_flutter/src/models/appconfig.dart';
import 'package:desktop_flutter/src/utils/secrets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final appConfigProvider = Provider<AppConfig>((ref) {
  return AppConfig(
    githubClientId: githubClientId,
    githubClientSecret: githubClientSecret,
    googleClientId: googleClientId,
    googleClientSecret: googleClientSecret,
  );
});
