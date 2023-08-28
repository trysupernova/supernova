import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';

const _uuid = Uuid();

enum Integration {
  linear,
  notion,
}

class SupernovaTask {
  final String id;
  final String title;
  bool done;
  int? expectedDuration;
  DateTime? start;
  Integration? integration;

  SupernovaTask({
    required this.id,
    required this.title,
    this.done = false,
    this.expectedDuration,
    this.start,
    this.integration,
  });
}

class SupernovaTaskEdit {
  String? title;
  bool? done;
  int? expectedDuration;
  DateTime? start;
  Integration? integration;

  SupernovaTaskEdit({this.title, this.done, this.expectedDuration});
}

/// An object that controls a list of [Todo].
class SupernovaList extends StateNotifier<List<SupernovaTask>> {
  SupernovaList([List<SupernovaTask>? initialTodos])
      : super(initialTodos ?? []);

  void add(String title, int? expectedDuration) {
    state = [
      ...state,
      SupernovaTask(
        id: _uuid.v4(),
        title: title,
        expectedDuration: expectedDuration,
      ),
    ];
  }

  void toggle(String id) {
    state = [
      for (final todo in state)
        if (todo.id == id)
          SupernovaTask(
            id: todo.id,
            title: todo.title,
            expectedDuration: todo.expectedDuration,
            done: !todo.done,
          )
        else
          todo,
    ];
  }

  void edit(
    String id,
    SupernovaTaskEdit edit,
  ) {
    state = [
      for (final todo in state)
        if (todo.id == id)
          SupernovaTask(
            id: todo.id,
            title: edit.title ?? todo.title,
            expectedDuration: edit.expectedDuration ?? todo.expectedDuration,
            done: edit.done ?? todo.done,
          )
        else
          todo,
    ];
  }

  void remove(SupernovaTask target) {
    state = state.where((todo) => todo.id != target.id).toList();
  }
}
