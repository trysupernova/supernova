import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final accessTokenProvider = FutureProvider<String?>((ref) {
  // fetch access_token from secure storage or null
  const storage = FlutterSecureStorage();
  final hasAT = storage.read(key: "access_token");
  return hasAT;
});
