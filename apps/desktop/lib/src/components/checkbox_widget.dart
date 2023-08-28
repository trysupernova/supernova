import 'package:flutter/material.dart';

class SupernovaCheckboxWidget extends StatefulWidget {
  const SupernovaCheckboxWidget({super.key});

  @override
  State<StatefulWidget> createState() => _SupernovaCheckboxWidgetState();
}

class _SupernovaCheckboxWidgetState extends State<SupernovaCheckboxWidget> {
  bool _isChecked = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Checkbox(
          value: _isChecked,
          onChanged: (newValue) {
            setState(() {
              _isChecked = newValue!;
            });
          },
        ),
      ],
    );
  }
}
