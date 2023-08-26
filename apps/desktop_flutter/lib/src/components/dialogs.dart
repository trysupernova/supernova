import 'package:desktop_flutter/src/providers/appconfig_providers.dart';
import 'package:desktop_flutter/src/services/gapi.dart';
import 'package:desktop_flutter/src/models/task.dart';
import 'package:desktop_flutter/src/providers/tasks_providers.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';


class Dialogs {
  static Future<void> showCreateTaskDialog(
      BuildContext context, WidgetRef ref) async {
    closeModal() {
      Navigator.of(context).pop();
    }

    final titleFocusNode = FocusNode();

    return showDialog<void>(
      context: context,
      builder: (BuildContext context) {
        final formKey = GlobalKey<FormState>();
        final titleController = TextEditingController();

        return AlertDialog(
          title: const Text('Create task'),
          content: RawKeyboardListener(
            focusNode: FocusNode(),
            onKey: (RawKeyEvent event) {
              if (event is RawKeyDownEvent &&
                  event.logicalKey == LogicalKeyboardKey.enter) {
                // Trigger form submission when Enter key is presed
                if (formKey.currentState!.validate()) {
                  // Handle form submission
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Created task'),
                    ),
                  );
                  // create task
                  ref
                      .read(supernovaTasksProvider.notifier)
                      .add(titleController.text, null);
                  closeModal();
                }
              }
            },
            child: Form(
                key: formKey,
                child: Column(
                  children: [
                    TextFormField(
                      focusNode: titleFocusNode,
                      controller: titleController,
                      autofocus: true,
                      decoration: const InputDecoration(labelText: 'Title'),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter a title';
                        }
                        return null;
                      },
                    ),
                  ],
                )),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Close'),
              onPressed: () {
                closeModal();
              },
            ),
          ],
        );
      },
    );
  }

  static Future<void> showEditTaskDialog(
      BuildContext context, WidgetRef ref, SupernovaTask task) async {
    closeModal() {
      Navigator.of(context).pop();
    }

    final titleFocusNode = FocusNode();

    return showDialog<void>(
      context: context,
      builder: (BuildContext context) {
        final formKey = GlobalKey<FormState>();
        final titleController = TextEditingController(text: task.title);

        return AlertDialog(
          title: const Text('Edit task'),
          content: RawKeyboardListener(
            focusNode: FocusNode(),
            onKey: (RawKeyEvent event) {
              if (event is RawKeyDownEvent &&
                  event.logicalKey == LogicalKeyboardKey.enter) {
                // Trigger form submission when Enter key is presed
                if (formKey.currentState!.validate()) {
                  // send a snack
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Task updated'),
                    ),
                  );
                  // edit task
                  ref.read(supernovaTasksProvider.notifier).edit(
                      task.id, SupernovaTaskEdit(title: titleController.text));

                  ref
                      .read(userGoogleEventsSupernovaTaskProvider.notifier)
                      .state = [
                    for (final todo in ref
                        .read(userGoogleEventsSupernovaTaskProvider.notifier)
                        .state)
                      if (todo.id == task.id)
                        SupernovaTask(
                          id: todo.id,
                          title: titleController.text,
                          expectedDuration: task.expectedDuration,
                          done: task.done,
                        )
                      else
                        todo,
                  ];
                  closeModal();
                }
              }
            },
            child: Form(
                key: formKey,
                child: Column(
                  children: [
                    TextFormField(
                      focusNode: titleFocusNode,
                      controller: titleController,
                      autofocus: true,
                      decoration: const InputDecoration(labelText: 'Title'),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter a title';
                        }
                        return null;
                      },
                    ),
                  ],
                )),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Close'),
              onPressed: () {
                closeModal();
              },
            ),
          ],
        );
      },
    );
  }

  static Future<void> showCommandCenter(
      BuildContext context, WidgetRef ref) async {
    closeModal() {
      Navigator.of(context).pop();
    }

    return showDialog<void>(
      context: context,
      builder: (BuildContext context) {
        final formKey = GlobalKey<FormState>();

        return AlertDialog(
          title: const Text('Command center'),
          content: RawKeyboardListener(
            focusNode: FocusNode(),
            onKey: (RawKeyEvent event) {
              if (event is RawKeyDownEvent &&
                  event.logicalKey == LogicalKeyboardKey.enter) {
                // Trigger form submission when Enter key is presed
                if (formKey.currentState!.validate()) {
                  // send a snack
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Task updated'),
                    ),
                  );
                  // edit task
                  closeModal();
                }
              }
            },
            child: Center(
                child: Column(
              children: [
                TextButton(
                  child: const Text('Create task'),
                  onPressed: () {
                    showCreateTaskDialog(context, ref);
                    closeModal();
                  },
                ),
                TextButton(
                child: const Text("Get calendar events"),
                  onPressed: () async {
                    final config = ref.read(appConfigProvider);
                    final client = await authenticate(config);
                    final fetchedCalendars = await getCalendars(config, client);
                    ref.read(userGoogleCalendarsProvider.notifier).state =
                        fetchedCalendars;
                    ref.read(userGoogleEventsProvider.notifier).state.clear();
                    for (final calendar in fetchedCalendars) {
                      final fetchedEvents =
                          await getCalendarEventsToday(config, client, calendar.id!);
                      ref.read(userGoogleEventsProvider.notifier).state = [
                        ...ref.read(userGoogleEventsProvider),
                        ...fetchedEvents
                      ];
                    }

                    closeModal();
                  },
                )
              ],
            )),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Close'),
              onPressed: () {
                closeModal();
              },
            ),
          ],
        );
      },
    );
  }
}
