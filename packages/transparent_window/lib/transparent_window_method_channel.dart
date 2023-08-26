import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

import 'transparent_window_platform_interface.dart';

/// An implementation of [TransparentWindowPlatform] that uses method channels.
class MethodChannelTransparentWindow extends TransparentWindowPlatform {
  /// The method channel used to interact with the native platform.
  @visibleForTesting
  final methodChannel = const MethodChannel('transparent_window');

  @override
  Future<void> activate() async {
    await methodChannel.invokeMethod('activate');
  }
}
