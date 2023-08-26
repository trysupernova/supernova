import 'package:desktop_flutter/src/components/expected_duration_widget.dart';
import 'package:desktop_flutter/src/components/dialogs.dart';
import 'package:desktop_flutter/src/models/task.dart';
import 'package:desktop_flutter/src/styles/typography.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class SupernovaTaskWidget extends ConsumerWidget {
  final SupernovaTask task;
  final void Function(bool?)? onDoneChange;
  final bool? selected;
  const SupernovaTaskWidget(
      {super.key,
      required this.task,
      this.onDoneChange,
      this.selected = false});

  @override
  Widget build(BuildContext context, ref) {
    return (GestureDetector(
        onTap: () {
          Dialogs.showEditTaskDialog(context, ref, task);
        },
        child: Container(
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 10),
            decoration: ShapeDecoration(
                color:
                    selected == true ? const Color(0xFFF0FDFA) : Colors.white,
                shape: RoundedRectangleBorder(
                  side: selected == true
                      ? const BorderSide(
                          width: 1.5,
                          color: Color(0xFF2DD4BF),
                          strokeAlign: BorderSide.strokeAlignCenter,
                        )
                      : const BorderSide(
                          width: 0.50,
                          color: Color.fromARGB(255, 192, 195, 199)),
                  borderRadius: BorderRadius.circular(5),
                ),
                shadows: [
                  BoxShadow(
                    color: Colors.grey.shade300,
                    blurRadius: 6,
                    offset: const Offset(0, 4),
                    spreadRadius: 0,
                  )
                ]),
            foregroundDecoration: BoxDecoration(
              color: task.done
                  ? Colors.white.withOpacity(0.7)
                  : Colors.transparent,
            ),
            child: Row(
              children: [
                Checkbox(value: task.done, onChanged: onDoneChange),
                Expanded(
                  child: Text(
                    task.title,
                    style: CustomTypography.body()
                        .merge(const TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
                Text(task.start != null ? task.start!.hour.toString() : "",
                    style: CustomTypography.body()),
                const SizedBox(width: 10),
                ExpectedDurationWidget(
                  expectedDurationSeconds: task.expectedDuration,
                ),
              ],
            ))));
  }
}
