import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:5000/api';

  static Future<Map<String, String>> _getHeaders(String? idToken) async {
    final headers = {
      'Content-Type': 'application/json',
    };
    if (idToken != null) {
      headers['Authorization'] = 'Bearer $idToken';
    }
    return headers;
  }

  static Future<Map<String, dynamic>> syncUser({
    required String email,
    required String firebaseUid,
    String? idToken,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/users/sync'),
        headers: await _getHeaders(idToken),
        body: jsonEncode({
          'email': email,
          'firebase_uid': firebaseUid,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return {
          'success': true,
          'data': jsonDecode(response.body),
        };
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'message': error['message'] ?? 'Sync failed',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: $e',
      };
    }
  }

  static Future<Map<String, dynamic>> checkBanStatus({
    required String firebaseUid,
    String? idToken,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/users/check-banned?firebase_uid=$firebaseUid'),
        headers: await _getHeaders(idToken),
      );

      if (response.statusCode == 200) {
        return {
          'success': true,
          'data': jsonDecode(response.body),
        };
      } else if (response.statusCode == 404) {
        return {
          'success': true,
          'data': {
            'is_registered': false,
            'is_banned': false,
          },
        };
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'message': error['message'] ?? 'Check failed',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: $e',
      };
    }
  }
}
