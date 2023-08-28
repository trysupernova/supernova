import 'package:desktop_flutter/src/components/my_calendars_widget.dart';
import 'package:desktop_flutter/src/utils/actions.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:window_to_front/window_to_front.dart';

final googleCalendarIntegratedProvider = StateProvider<bool>((ref) {
  return false;
});

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  static const routeName = '/settings';

  @override
  State<StatefulWidget> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController =
        TabController(length: 2, vsync: this); // Specify the number of tabs
  }

  @override
  void dispose() {
    _tabController.dispose(); // Dispose of the TabController when done
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Settings'),
          bottom: TabBar(
            controller: _tabController, // Link the TabBar to the TabController
            tabs: const [
              Tab(text: 'Profile'),
              Tab(text: 'Integrations'),
            ],
          ),
        ),
        body: _ShortcutsAndActions(
          child: TabBarView(
            controller:
                _tabController, // Link the TabBarView to the TabController
            children: const [
              // Content for Tab 1
              Center(child: Text('Tab 1 Content')),
              // content for settings
              _ContentIntegrationsTab(),
            ],
          ),
        ));
  }
}

class ExitSettingsIntent extends Intent {
  const ExitSettingsIntent();
}

class _ShortcutsAndActions extends ConsumerWidget {
  final Widget child;

  const _ShortcutsAndActions({Key? key, required this.child}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Shortcuts(
        shortcuts: const {
          SingleActivator(LogicalKeyboardKey.escape): ExitSettingsIntent(),
        },
        child: Actions(
            actions: {
              ExitSettingsIntent:
                  CallbackAction<ExitSettingsIntent>(onInvoke: (intent) {
                Navigator.of(context).pop();
                return null;
              })
            },
            child: Focus(
              autofocus: true,
              child: child,
            )));
  }
}

class _ContentIntegrationsTab extends ConsumerWidget {
  const _ContentIntegrationsTab({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, ref) {
    final gcalIntegrated = ref.watch(googleCalendarIntegratedProvider);
    return Column(
      children: [
        Row(
          children: [
            const Expanded(
                child: ListTile(
              leading: Icon(Icons.calendar_today),
              title: Text('Google Calendar'),
              subtitle: Text('Connect your Google Calendar'),
            )),
            !gcalIntegrated
                ? FilledButton(
                    onPressed: () async {
                      await ActionCallbacks.authAndFetchCalendarEvents(
                          context, ref);
                      ref
                          .watch(googleCalendarIntegratedProvider.notifier)
                          .state = true;
                      await WindowToFront.activate();
                    },
                    child: const Text("Connect"))
                : FilledButton(
                    onPressed: () async {
                      await ActionCallbacks.disconnectGcal(context, ref);
                      ref
                          .watch(googleCalendarIntegratedProvider.notifier)
                          .state = false;
                    },
                    child: const Text("Disconnect")),
          ],
        ),
        const MyCalendarsWidget(),
      ],
    );
  }
}
