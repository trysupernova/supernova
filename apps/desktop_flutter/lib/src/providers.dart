import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'models/task.dart';

final supernovaTasksProvider =
    StateNotifierProvider<SupernovaList, List<SupernovaTask>>((ref) {
  return SupernovaList([SupernovaTask(id: "todo-1", title: "Hello")]);
});

final uncompletedTasksProvider = Provider<List<SupernovaTask>>((ref) {
  return ref
      .watch(supernovaTasksProvider)
      .where((element) => !element.done)
      .toList();
});

final doneTasksProvider = Provider<List<SupernovaTask>>((ref) {
  return ref
      .watch(supernovaTasksProvider)
      .where((element) => element.done)
      .toList();
});

final selectedTaskProvider = StateProvider<SupernovaTask?>((ref) {
  return null;
});
