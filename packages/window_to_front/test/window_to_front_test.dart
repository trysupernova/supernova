import 'package:flutter_test/flutter_test.dart';
import 'package:window_to_front/window_to_front.dart';
import 'package:window_to_front/window_to_front_platform_interface.dart';
import 'package:window_to_front/window_to_front_method_channel.dart';
import 'package:plugin_platform_interface/plugin_platform_interface.dart';

class MockWindowToFrontPlatform
    with MockPlatformInterfaceMixin
    implements WindowToFrontPlatform {
  @override
  Future<String?> getPlatformVersion() => Future.value('42');
  
  @override
  Future<void> activate() {
    // TODO: implement activate
    throw UnimplementedError();
  }
}

void main() {
  final WindowToFrontPlatform initialPlatform = WindowToFrontPlatform.instance;

  test('$MethodChannelWindowToFront is the default instance', () {
    expect(initialPlatform, isInstanceOf<MethodChannelWindowToFront>());
  });
}
