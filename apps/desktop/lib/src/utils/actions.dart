import 'package:desktop_flutter/src/components/dialogs.dart';
import 'package:desktop_flutter/src/models/task.dart';
import 'package:desktop_flutter/src/providers/appconfig_providers.dart';
import 'package:desktop_flutter/src/providers/tasks_providers.dart';
import 'package:desktop_flutter/src/screens/settings.dart';
import 'package:desktop_flutter/src/services/gapi.dart';
import 'package:desktop_flutter/src/utils/intents.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:transparent_window/transparent_window.dart';

// ignore: prefer_function_declarations_over_variables
final intentActionsMapTodayView = (BuildContext context, WidgetRef ref) {
  final selectedTask = ref.watch(selectedTaskProvider);
  return <Type, Action<Intent>>{
    ShowCreateTaskModalIntent: CallbackAction(
      onInvoke: (intent) {
        Dialogs.showCreateTaskDialog(context, ref);
        return null;
      },
    ),
    ShowEditTaskModalIntent: CallbackAction(
      onInvoke: (intent) {
        if (selectedTask == null) return null;
        Dialogs.showEditTaskDialog(context, ref, selectedTask);
        return null;
      },
    ),
    GoUpTaskListIntent: CallbackAction(
      onInvoke: (intent) {
        if (selectedTask == null) {
          ref.read(selectedTaskProvider.notifier).state =
              ref.read(uncompletedTasksProvider).lastOrNull;
        } else {
          final index =
              ref.read(uncompletedTasksProvider).indexOf(selectedTask);
          if (index > 0) {
            ref.read(selectedTaskProvider.notifier).state =
                ref.read(uncompletedTasksProvider)[index - 1];
          } else if (index == 0) {
            ref.read(selectedTaskProvider.notifier).state =
                ref.read(uncompletedTasksProvider).lastOrNull;
          }
        }
        return null;
      },
    ),
    GoDownTaskListIntent: CallbackAction(
      onInvoke: (intent) {
        if (selectedTask == null) {
          ref.read(selectedTaskProvider.notifier).state =
              ref.read(uncompletedTasksProvider).firstOrNull;
        } else {
          final index =
              ref.read(uncompletedTasksProvider).indexOf(selectedTask);
          if (index < ref.read(uncompletedTasksProvider).length - 1) {
            ref.read(selectedTaskProvider.notifier).state =
                ref.read(uncompletedTasksProvider)[index + 1];
          } else if (index == ref.read(uncompletedTasksProvider).length - 1) {
            ref.read(selectedTaskProvider.notifier).state =
                ref.read(uncompletedTasksProvider).firstOrNull;
          }
        }
        return null;
      },
    ),
    DeleteTaskIntent: CallbackAction(
      onInvoke: (intent) {
        if (selectedTask == null) return null;
        ref.read(supernovaTasksProvider.notifier).remove(selectedTask);
        ref.read(userGoogleEventsSupernovaTaskProvider.notifier).state = ref
            .read(userGoogleEventsSupernovaTaskProvider.notifier)
            .state
            .where((todo) => todo.id != selectedTask.id)
            .toList();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Deleted task ${selectedTask.title}'),
          ),
        );
        return null;
      },
    ),
    MarkCompleteTaskIntent: CallbackAction(
      onInvoke: (intent) {
        if (selectedTask == null) return null;
        ref.read(supernovaTasksProvider.notifier).toggle(selectedTask.id);
        ref.read(userGoogleEventsSupernovaTaskProvider.notifier).state = [
          for (final todo
              in ref.read(userGoogleEventsSupernovaTaskProvider.notifier).state)
            if (todo.id == selectedTask.id)
              SupernovaTask(
                id: todo.id,
                title: todo.title,
                expectedDuration: todo.expectedDuration,
                done: !todo.done,
              )
            else
              todo,
        ];
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Marked task as done'),
          ),
        );
        return null;
      },
    ),
    GetCalendarEventsIntent: CallbackAction(
      onInvoke: (intent) async {
        return ActionCallbacks.authAndFetchCalendarEvents(context, ref);
      },
    ),
    ShowCommandCenterIntent: CallbackAction(
      onInvoke: (intent) async {
        Dialogs.showCommandCenter(context, ref);
        return null;
      },
    ),
    GoToSettingsIntent: CallbackAction(
      onInvoke: (intent) async {
        await Navigator.of(context).pushNamed(SettingsScreen.routeName);
        return null;
      },
    ),
    ShowTransparentWindowIntent: CallbackAction(
      onInvoke: (intent) async {
        return ActionCallbacks.showTransparentWindow(context, ref);
      },
    ),
  };
};

class ActionCallbacks {
  static authAndFetchCalendarEvents(BuildContext context, WidgetRef ref) async {
    final config = ref.read(appConfigProvider);
    final client = await authenticate(config);
    final fetchedCalendars = await getCalendars(config, client);
    ref.read(userGoogleCalendarsProvider.notifier).state = fetchedCalendars;
    ref.read(userGoogleEventsProvider.notifier).state.clear();
    for (final calendar in fetchedCalendars) {
      final fetchedEvents =
          await getCalendarEventsToday(config, client, calendar.id!);
      ref.read(userGoogleEventsProvider.notifier).state = [
        ...ref.read(userGoogleEventsProvider),
        ...fetchedEvents
      ];
    }
    return null;
  }

  static disconnectGcal(BuildContext context, WidgetRef ref) async {
    // remove all gcal events task that was Supernova tasks
    ref.watch(userGoogleEventsSupernovaTaskProvider.notifier).state = [];
    // remove all Google calendars
    ref.watch(userGoogleCalendarsProvider.notifier).state = [];
    return null;
  }

  static showTransparentWindow(BuildContext context, WidgetRef ref) async {
    await TransparentWindow.activate();
    return null;
  }
}
