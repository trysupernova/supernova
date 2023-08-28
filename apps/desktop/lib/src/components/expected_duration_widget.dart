import 'package:flutter/material.dart';

class ExpectedDurationWidget extends StatelessWidget {
  final int? expectedDurationSeconds;
  const ExpectedDurationWidget({super.key, this.expectedDurationSeconds});

  @override
  Widget build(BuildContext context) {
    String secondsPart = expectedDurationSeconds != null
        ? (expectedDurationSeconds! % 60).toString().padLeft(2)
        : "--";
    String minutesPart = expectedDurationSeconds != null
        ? (expectedDurationSeconds! / 60).floor().toString()
        : "--";
    return (Container(
        padding: const EdgeInsets.all(3.0),
        decoration: ShapeDecoration(
            color: Colors.grey.shade300,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(4.0))),
        child: Center(
          child: Text(
            "$minutesPart:$secondsPart",
            style: const TextStyle(color: Color(0xFF475569)),
          ),
        )));
  }
}
