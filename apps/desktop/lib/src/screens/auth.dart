import 'package:desktop_flutter/src/providers/auth_providers.dart';
import 'package:desktop_flutter/src/screens/today_view.dart';
import 'package:desktop_flutter/src/services/sup_backend.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthScreen extends ConsumerWidget {
  const AuthScreen({super.key});

  // a screen that allows the user to login via email and password
  // through the Supernova backend
  @override
  Widget build(BuildContext context, ref) {
    final accessToken = ref.watch(accessTokenProvider);

    return accessToken.when(
        data: (config) {
          if (config != null) {
            // ignore: use_build_context_synchronously
            Navigator.pushNamed(context, TodayViewScreen.routeName);
            return const SizedBox();
          }
          return const AuthWidget();
        },
        error: (err, stack) => const AuthWidget(),
        loading: () {
          return const Scaffold(
              body: Center(
                  child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(),
            ],
          )));
        });
  }
}

class AuthWidget extends StatelessWidget {
  const AuthWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
        body: Center(
            child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text("Welcome to Supernova"),
        Text("Please login to continue"),
        LoginForm(),
      ],
    )));
  }
}

class LoginForm extends StatelessWidget {
  const LoginForm({super.key});

  @override
  Widget build(BuildContext context) {
    final formKey = GlobalKey<FormState>();
    final emailController = TextEditingController();
    final passwordController = TextEditingController();
    // a form with 2 fields: email and password; the password field is hidden
    // also has a submit button which will validate the form and submit it
    // calling the Supernova's backend login API
    return Form(
        key: formKey,
        child: Column(
          children: [
            TextFormField(
              controller: emailController,
              decoration: const InputDecoration(labelText: 'Email'),
              validator: (value) {
                // TODO: validate email address
                if (value == null || value.isEmpty) {
                  return 'Please enter a valid email';
                }
                return null;
              },
            ),
            TextFormField(
              controller: passwordController,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter a valid password';
                }
                return null;
              },
            ),
            OutlinedButton(
                onPressed: () async {
                  if (formKey.currentState!.validate()) {
                    // Handle form submission
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Logging in...'),
                      ),
                    );
                    final resp = await supernovaBackend.login(
                        emailController.text, passwordController.text);
                    if (resp.noError()) {
                      // set token in secure storage for later use
                      const secureStorage = FlutterSecureStorage();
                      await secureStorage.write(
                          key: "access_token", value: resp.data!);
                      // ignore: use_build_context_synchronously
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Logged in'),
                          // overlap the previous ones
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                      // ignore: use_build_context_synchronously
                      Navigator.pushNamed(context, TodayViewScreen.routeName);
                      return;
                    }
                    // ignore: use_build_context_synchronously
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                            'Error logging in - please try again: ${resp.message}'),
                        backgroundColor: Colors.red,
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  }
                },
                child: const Text("Login"))
          ],
        ));
  }
}
