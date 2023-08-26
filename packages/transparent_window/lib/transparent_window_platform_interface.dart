import 'package:plugin_platform_interface/plugin_platform_interface.dart';

import 'transparent_window_method_channel.dart';

abstract class TransparentWindowPlatform extends PlatformInterface {
  /// Constructs a TransparentWindowPlatform.
  TransparentWindowPlatform() : super(token: _token);

  static final Object _token = Object();

  static TransparentWindowPlatform _instance = MethodChannelTransparentWindow();

  /// The default instance of [TransparentWindowPlatform] to use.
  ///
  /// Defaults to [MethodChannelTransparentWindow].
  static TransparentWindowPlatform get instance => _instance;

  /// Platform-specific implementations should set this with their own
  /// platform-specific class that extends [TransparentWindowPlatform] when
  /// they register themselves.
  static set instance(TransparentWindowPlatform instance) {
    PlatformInterface.verifyToken(instance, _token);
    _instance = instance;
  }

  Future<void> activate() {
    throw UnimplementedError('activate() has not been implemented.');
  }
}
