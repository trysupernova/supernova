import 'transparent_window_platform_interface.dart';

class TransparentWindow {
  static Future<void> activate() {
    return TransparentWindowPlatform.instance.activate();
  }
}
