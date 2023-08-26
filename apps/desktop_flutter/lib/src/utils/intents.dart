import 'package:flutter/material.dart';

class ShowCreateTaskModalIntent extends Intent {
  const ShowCreateTaskModalIntent();
}

class ShowEditTaskModalIntent extends Intent {
  const ShowEditTaskModalIntent();
}

class GoDownTaskListIntent extends Intent {
  const GoDownTaskListIntent();
}

class GoUpTaskListIntent extends Intent {
  const GoUpTaskListIntent();
}

class DeleteTaskIntent extends Intent {
  const DeleteTaskIntent();
}

class MarkCompleteTaskIntent extends Intent {
  const MarkCompleteTaskIntent();
}

class GetCalendarEventsIntent extends Intent {
  const GetCalendarEventsIntent();
}

class ShowCommandCenterIntent extends Intent {
  const ShowCommandCenterIntent();
}

class GoToSettingsIntent extends Intent {
  const GoToSettingsIntent();
}
