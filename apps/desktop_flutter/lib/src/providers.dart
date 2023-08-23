import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:googleapis/calendar/v3.dart';
import 'models/task.dart';

final supernovaTasksProvider =
    StateNotifierProvider<SupernovaList, List<SupernovaTask>>((ref) {
  return SupernovaList([SupernovaTask(id: "todo-1", title: "Hello")]);
});

final uncompletedTasksProvider = Provider<List<SupernovaTask>>((ref) {
  final pureTasks = ref
      .watch(supernovaTasksProvider)
      .where((element) => !element.done)
      .toList();
  final googleEventTasks = ref.watch(incompleteUserGoogleEventsTaskProvider);
  final tasks = [
    ...pureTasks,
    ...googleEventTasks,
  ];
  tasks.sort((a, b) =>
      (a.start ?? DateTime.now()).compareTo(b.start ?? DateTime.now()));
  return tasks;
});

final doneTasksProvider = Provider<List<SupernovaTask>>((ref) {
  final pureTasks = ref
      .watch(supernovaTasksProvider)
      .where((element) => element.done)
      .toList();
  final googleEventTasks = ref.watch(doneUserGoogleEventsTaskProvider);
  final tasks = [
    ...pureTasks,
    ...googleEventTasks,
  ];
  tasks.sort((a, b) =>
      (a.start ?? DateTime.now()).compareTo(b.start ?? DateTime.now()));
  return tasks;
});

final selectedTaskProvider = StateProvider<SupernovaTask?>((ref) {
  return null;
});

final userGoogleEventsProvider = StateProvider<List<Event>>((ref) => []);

final userGoogleEventsSupernovaTaskProvider =
    StateProvider<List<SupernovaTask>>((ref) => ref
        .watch(userGoogleEventsProvider)
        .map((e) => SupernovaTask(
              id: e.id ?? "",
              title: e.summary ?? "No title",
              done: false,
              start: e.start?.dateTime,
            ))
        .toList());

final incompleteUserGoogleEventsTaskProvider = Provider<List<SupernovaTask>>(
    (ref) => ref
        .watch(userGoogleEventsSupernovaTaskProvider)
        .where((element) => !element.done)
        .toList());

final doneUserGoogleEventsTaskProvider = StateProvider<List<SupernovaTask>>(
    (ref) => ref
        .watch(userGoogleEventsSupernovaTaskProvider)
        .where((element) => element.done)
        .toList());

final userGoogleCalendarsProvider =
    StateProvider<List<CalendarListEntry>>((ref) => []);
