import 'package:collection/collection.dart';
import 'package:desktop_flutter/src/components/modals.dart';
import 'package:desktop_flutter/src/components/task_widget.dart';
import 'package:desktop_flutter/src/models/task.dart';
import 'package:desktop_flutter/src/providers.dart';
import 'package:desktop_flutter/src/styles/typography.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

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

class TodayViewPage extends ConsumerWidget {
  const TodayViewPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedTask = ref.watch(selectedTaskProvider);
    return Scaffold(
      body: Shortcuts(
        shortcuts: const <ShortcutActivator, Intent>{
          SingleActivator(LogicalKeyboardKey.keyC): ShowCreateTaskModalIntent(),
          SingleActivator(LogicalKeyboardKey.enter): ShowEditTaskModalIntent(),
          SingleActivator(LogicalKeyboardKey.arrowUp): GoUpTaskListIntent(),
          SingleActivator(LogicalKeyboardKey.arrowDown): GoDownTaskListIntent(),
          SingleActivator(LogicalKeyboardKey.backspace): DeleteTaskIntent(),
        },
        child: Actions(actions: <Type, Action<Intent>>{
          ShowCreateTaskModalIntent: CallbackAction(
            onInvoke: (intent) {
              Modals.showCreateTaskDialog(context, ref);
              return null;
            },
          ),
          ShowEditTaskModalIntent: CallbackAction(
            onInvoke: (intent) {
              if (selectedTask == null) return null;
              Modals.showEditTaskDialog(context, ref, selectedTask);
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
                    ref.read(uncompletedTasksProvider).indexOf(selectedTask!);
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
                } else if (index ==
                    ref.read(uncompletedTasksProvider).length - 1) {
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
              return null;
            },
          ),
        }, child: Focus(autofocus: true, child: TodayTasksListWidget())),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Modals.showCreateTaskDialog(context, ref);
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}

class TodayTasksListWidget extends ConsumerWidget {
  TodayTasksListWidget({super.key});

  final String formattedDate = DateFormat("EEE, d MMM").format(DateTime.now());

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final uncompletedTasks = ref.watch(uncompletedTasksProvider);
    final doneTasks = ref.watch(doneTasksProvider);
    final selectedTask = ref.watch(selectedTaskProvider);
    return Center(
        child: Column(crossAxisAlignment: CrossAxisAlignment.center, children: [
      Wrap(
        spacing: 8.0,
        alignment: WrapAlignment.center,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          Text("Today", style: CustomTypography.h1()),
          Text(
            formattedDate,
            style: CustomTypography.body()
                .merge(TextStyle(color: Colors.grey.shade400)),
          )
        ],
      ),
      const SizedBox(
        height: 8.0,
      ),
      Container(
          padding: const EdgeInsets.symmetric(horizontal: 20.0),
          child: Column(
              children: uncompletedTasks
                  .mapIndexed((index, task) => Column(children: [
                        SupernovaTaskWidget(
                          task: task,
                          selected: selectedTask?.id == task.id,
                          onDoneChange: (p0) {
                            ref
                                .read(supernovaTasksProvider.notifier)
                                .toggle(task.id);
                          },
                        ),
                        const SizedBox(
                          height: 8.0,
                        )
                      ]))
                  .toList())),
      Text(
        "Done",
        style: CustomTypography.body(),
      ),
      Container(
          padding: const EdgeInsets.symmetric(horizontal: 20.0),
          child: Column(
              children: doneTasks
                  .mapIndexed((index, task) => Column(children: [
                        SupernovaTaskWidget(
                          task: task,
                          onDoneChange: (p0) {
                            ref
                                .read(supernovaTasksProvider.notifier)
                                .toggle(task.id);
                          },
                        ),
                        const SizedBox(
                          height: 8.0,
                        )
                      ]))
                  .toList())),
    ]));
  }
}
