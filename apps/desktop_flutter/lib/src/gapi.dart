import 'package:googleapis/calendar/v3.dart';
import 'package:googleapis_auth/auth_io.dart';
import 'package:url_launcher/url_launcher_string.dart';

Future<AutoRefreshingAuthClient> authenticate() async {
  const clientId =
      '183838979936-shjf5mgp6mcm8krlmg4lp5p6p8veapal.apps.googleusercontent.com';
  const clientSecret = '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';

  final scopes = [CalendarApi.calendarScope];

  final clientIdParam = ClientId(clientId, clientSecret);
  final client = await clientViaUserConsent(clientIdParam, scopes, prompt);

  return client;
}

Future<void> prompt(String url) async {
  // Implement a method to open the URL in a browser or webview and handle the authorization flow.
  // You can use packages like `url_launcher` or `webview_flutter` for this.
  launchUrlString(url);
}

Future<List<Event>> getCalendarEventsToday(
    [AutoRefreshingAuthClient? client, String calendarId = "primary"]) async {
  final theClient = client ?? await authenticate();
  final calendar = CalendarApi(theClient);

  final now = DateTime.now().toUtc();
  final minTime = DateTime(now.year, now.month, now.day - 1).toUtc();
  final maxTime = DateTime(now.year, now.month, now.day).toUtc();

  final events = await calendar.events.list(calendarId,
      timeMin: minTime,
      timeMax: maxTime,
      singleEvents: true,
      orderBy: 'startTime');

  return events.items ?? [];
}

Future<List<CalendarListEntry>> getCalendars(
    [AutoRefreshingAuthClient? client]) async {
  final theClient = client ?? await authenticate();
  final calendar = CalendarApi(theClient);

  final calendars = await calendar.calendarList.list(
    maxResults: 10,
  );

  return calendars.items ?? [];
}
