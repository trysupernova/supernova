import 'package:desktop_flutter/src/utils/intents.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

final shortcutIntentMapTodayView = <ShortcutActivator, Intent>{
  const SingleActivator(LogicalKeyboardKey.keyC):
      const ShowCreateTaskModalIntent(),
  const SingleActivator(LogicalKeyboardKey.enter):
      const ShowEditTaskModalIntent(),
  const SingleActivator(LogicalKeyboardKey.keyK): const GoUpTaskListIntent(),
  const SingleActivator(LogicalKeyboardKey.keyJ): const GoDownTaskListIntent(),
  const SingleActivator(LogicalKeyboardKey.backspace): const DeleteTaskIntent(),
  const SingleActivator(LogicalKeyboardKey.keyD):
      const MarkCompleteTaskIntent(),
  LogicalKeySet(LogicalKeyboardKey.control, LogicalKeyboardKey.shift,
      LogicalKeyboardKey.keyC): const GetCalendarEventsIntent(),
  LogicalKeySet(LogicalKeyboardKey.meta, LogicalKeyboardKey.keyK):
      const ShowCommandCenterIntent(),
  LogicalKeySet(LogicalKeyboardKey.meta, LogicalKeyboardKey.comma): const GoToSettingsIntent(),
  LogicalKeySet(LogicalKeyboardKey.controlLeft, LogicalKeyboardKey.space):
      const ShowTransparentWindowIntent(),
};
