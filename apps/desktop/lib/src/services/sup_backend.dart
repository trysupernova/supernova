import 'dart:convert';

import 'package:http/http.dart' as http;

class ServerResponse<T> {
  bool? error;
  String message;
  int statusCode;
  T? data;

  // constructor
  ServerResponse(
      {this.error, required this.message, required this.statusCode, this.data});

  factory ServerResponse.fromJson(Map<String, dynamic> json) {
    return ServerResponse(
        message: json['message'],
        statusCode: json['statusCode'],
        data: json['data'],
        error: json['error']);
  }

  noError() {
    return error == false || error == null || statusCode == 200;
  }
}

// user with these fields: unsigned int ID, email, name, createdAt, updatedAt, and deletedAt (nullable)
class SupernovaUser {
  String id;
  String email;
  String name;
  DateTime createdAt;
  DateTime updatedAt;
  DateTime? deletedAt;

  SupernovaUser(
      {required this.id,
      required this.email,
      required this.name,
      required this.createdAt,
      required this.updatedAt,
      this.deletedAt});

  factory SupernovaUser.fromJson(Map<String, dynamic> json) {
    return SupernovaUser(
      id: json['id'],
      email: json['email'],
      name: json['name'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      deletedAt:
          json['deletedAt'] != null ? DateTime.parse(json['deletedAt']) : null,
    );
  }
}

class RegisterUserResponse extends ServerResponse<SupernovaUser> {
  RegisterUserResponse(
      {required super.message,
      required super.statusCode,
      required super.data,
      required super.error});

  factory RegisterUserResponse.fromJson(Map<String, dynamic> json) {
    return RegisterUserResponse(
      message: json['message'],
      statusCode: json['statusCode'],
      data: SupernovaUser.fromJson(jsonDecode(json['data'])),
      error: json['error'],
    );
  }
}

class LoginUserResponse extends ServerResponse<String> {
  LoginUserResponse(
      {required super.message,
      required super.statusCode,
      required super.data,
      required super.error});

  factory LoginUserResponse.fromJson(Map<String, dynamic> json) {
    // print json to console
    // ignore: avoid_print
    print(json);
    return LoginUserResponse(
      message: json['message'],
      statusCode: json['statusCode'],
      data: json['data'],
      error: json['error'],
    );
  }
}

class HttpAppException implements Exception {
  final String message;
  final int statusCode;

  HttpAppException(this.message, this.statusCode);

  @override
  String toString() {
    return "HttpAppException[statusCode: $statusCode]: $message";
  }
}

class SupernovaBackend {
  String baseUrl;

  // constructor
  SupernovaBackend({required this.baseUrl});

  // Register a user via email and password
  Future<RegisterUserResponse> register(String email, String password) async {
    var url = Uri.parse('$baseUrl/users');
    var response = await http.post(url,
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
        headers: {
          'Content-Type': 'application/json',
        });
    final parsed = RegisterUserResponse.fromJson(jsonDecode(response.body));
    return parsed;
  }

  // Login a user via email and password
  Future<LoginUserResponse> login(String email, String password) async {
    var url = Uri.parse('$baseUrl/users/login');
    var response = await http.post(url,
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
        headers: {
          'Content-Type': 'application/json',
        });
    final parsed = LoginUserResponse.fromJson(jsonDecode(response.body));
    return parsed;
  }
}

final supernovaBackend = SupernovaBackend(baseUrl: 'http://localhost:3001');
