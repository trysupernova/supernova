import 'package:collection/collection.dart';
import 'package:desktop_flutter/src/components/dialogs.dart';
import 'package:desktop_flutter/src/components/task_widget.dart';
import 'package:desktop_flutter/src/providers/tasks_providers.dart';
import 'package:desktop_flutter/src/styles/typography.dart';
import 'package:desktop_flutter/src/utils/actions.dart';
import 'package:desktop_flutter/src/utils/shortcuts.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

class TodayViewScreen extends ConsumerWidget {
  const TodayViewScreen({super.key});

  static const routeName = '/today';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: Shortcuts(
        shortcuts: shortcutIntentMapTodayView,
        child: Actions(
          actions: intentActionsMapTodayView(context, ref),
          child: Focus(
            autofocus: true,
            child: TodayTasksListWidget(),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Dialogs.showCreateTaskDialog(context, ref);
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

    return SingleChildScrollView(
        child: Center(
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
          const NavbarWidget(),
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
        ])));
  }
}

class NavbarWidget extends StatelessWidget {
  const NavbarWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: const EdgeInsets.symmetric(horizontal: 20.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            IconButton(
              icon: const Icon(Icons.menu),
              onPressed: () {},
            ),
            IconButton(
              icon: const Icon(Icons.settings),
              onPressed: () {
                Navigator.pushNamed(context, '/settings');
              },
            ),
          ],
        ));
  }
}
