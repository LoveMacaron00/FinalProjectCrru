import 'package:flutter/material.dart';
import 'package:form_field_validator/form_field_validator.dart';
import 'package:myapp/model/profile.dart';
import 'package:myapp/services/api_service.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:myapp/screen/home.dart';
import 'package:myapp/screen/register.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final formkey = GlobalKey<FormState>();
  final Profile profile = Profile();
  bool _isLoading = false;
  String? _errorMessage;

  final Future<FirebaseApp> firebase = Firebase.initializeApp();

  Future<void> _handleLogin() async {
    if (formkey.currentState!.validate()) {
      formkey.currentState!.save();
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      try {
        final credential = await FirebaseAuth.instance.signInWithEmailAndPassword(
          email: profile.email!,
          password: profile.password!,
        );

        final user = credential.user;
        if (user != null) {
          final banResult = await ApiService.checkBanStatus(
            firebaseUid: user.uid,
          );

          if (banResult['success']) {
            final data = banResult['data'];
            if (data['is_banned'] == true) {
              await FirebaseAuth.instance.signOut();
              if (mounted) {
                setState(() {
                  _errorMessage = 'Your account has been banned.';
                });
              }
            } else {
              if (mounted) {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => HomeScreen()),
                );
              }
            }
          } else {
            if (mounted) {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => HomeScreen()),
              );
            }
          }
        }
      } on FirebaseAuthException catch (e) {
        if (mounted) {
          setState(() {
            _errorMessage = _getFirebaseErrorMessage(e.code);
          });
        }
      } finally {
        if (mounted) {
          setState(() => _isLoading = false);
        }
      }
    }
  }

  String _getFirebaseErrorMessage(String code) {
    switch (code) {
      case 'user-not-found':
        return 'No user found with this email.';
      case 'wrong-password':
        return 'Wrong password.';
      case 'user-disabled':
        return 'This account has been disabled.';
      case 'invalid-email':
        return 'Invalid email address.';
      case 'invalid-credential':
        return 'Invalid credentials.';
      default:
        return 'Login failed. Please try again.';
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: firebase,
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          return Scaffold(
            appBar: AppBar(title: const Text("Error")),
            body: Center(child: Text("${snapshot.error}")),
          );
        }
        if (snapshot.connectionState == ConnectionState.done) {
          return Scaffold(
            appBar: AppBar(title: const Text("Login")),
            body: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Form(
                key: formkey,
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text("Email", style: TextStyle(fontSize: 20)),
                      TextFormField(
                        validator: MultiValidator([
                          RequiredValidator(errorText: "Email is required"),
                          EmailValidator(errorText: "Email is invalid"),
                        ]).call,
                        keyboardType: TextInputType.emailAddress,
                        onSaved: (value) {
                          profile.email = value;
                        },
                      ),
                      const SizedBox(height: 15),
                      const Text("Password", style: TextStyle(fontSize: 20)),
                      TextFormField(
                        validator: RequiredValidator(
                          errorText: "Password is required",
                        ).call,
                        obscureText: true,
                        onSaved: (value) {
                          profile.password = value;
                        },
                      ),
                      if (_errorMessage != null) ...[
                        const SizedBox(height: 15),
                        Text(
                          _errorMessage!,
                          style: const TextStyle(color: Colors.red),
                        ),
                      ],
                      const SizedBox(height: 20),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : _handleLogin,
                          child: _isLoading
                              ? const CircularProgressIndicator()
                              : const Text("Login", style: TextStyle(fontSize: 20)),
                        ),
                      ),
                      const SizedBox(height: 15),
                      Center(
                        child: TextButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const RegisterScreen(),
                              ),
                            );
                          },
                          child: const Text("Don't have an account? Register"),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        }
        return const Scaffold(body: Center(child: CircularProgressIndicator()));
      },
    );
  }
}
