import 'package:desktop_flutter/src/providers.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:googleapis/calendar/v3.dart' as gcal;

Color parseColor(String hexColor) {
  // Remove any leading '#' character from the hex string
  if (hexColor.startsWith('#')) {
    hexColor = hexColor.substring(1);
  }

  // Parse the hex color string to an integer
  int parsedColor = int.tryParse(hexColor, radix: 16) ?? 0;

  // Create and return a Color object
  return Color(parsedColor)
      .withOpacity(1.0); // You can set the opacity as needed
}

class MyCalendarsWidget extends ConsumerWidget {
  const MyCalendarsWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final calendars = ref.watch(userGoogleCalendarsProvider);

    return Container(
      padding: const EdgeInsets.all(10),
      child: Column(
        children: [
          const Text(
            "My calendars",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 10),
          ...calendars.map((e) => CalendarEntryWidget(calendar: e)),
        ],
      ),
    );
  }
}

class CalendarEntryWidget extends StatelessWidget {
  final gcal.CalendarListEntry calendar;
  const CalendarEntryWidget({super.key, required this.calendar});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(3.0),
      decoration: ShapeDecoration(
          color: Colors.grey.shade300,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(4.0))),
      child: Center(
        child: Text(
          calendar.summary ?? "No title",
          style: TextStyle(
              color: calendar.backgroundColor != null
                  ? parseColor(calendar.backgroundColor!)
                  : const Color(0xFF475569)),
        ),
      ),
    );
  }
}
