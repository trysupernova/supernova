import 'package:desktop_flutter/src/models/appconfig.dart';
import 'package:googleapis/calendar/v3.dart';
import 'package:googleapis_auth/auth_io.dart';
import 'package:url_launcher/url_launcher_string.dart';

Future<AutoRefreshingAuthClient> authenticate(AppConfig config) async {
  final scopes = [CalendarApi.calendarScope];

  final clientIdParam =
      ClientId(config.googleClientId, config.googleClientSecret);
  final client = await clientViaUserConsent(clientIdParam, scopes, prompt);

  return client;
}

Future<void> prompt(String url) async {
  // Implement a method to open the URL in a browser or webview and handle the authorization flow.
  launchUrlString(url);
}

Future<List<Event>> getCalendarEventsToday(AppConfig config,
    [AutoRefreshingAuthClient? client, String calendarId = "primary"]) async {
  final theClient = client ?? await authenticate(config);
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

Future<List<CalendarListEntry>> getCalendars(AppConfig config,
    [AutoRefreshingAuthClient? client]) async {
  final theClient = client ?? await authenticate(config);
  final calendar = CalendarApi(theClient);

  final calendars = await calendar.calendarList.list();

  return calendars.items ?? [];
}
