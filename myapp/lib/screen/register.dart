import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:form_field_validator/form_field_validator.dart';
import 'package:myapp/model/profile.dart';
import 'package:myapp/services/api_service.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:myapp/screen/home.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final formkey = GlobalKey<FormState>();

  Profile profile = Profile();

  final Future<FirebaseApp> firebase = Firebase.initializeApp();

  bool _isLoading = false;

  Future<void> _handleRegister() async {
    if (formkey.currentState!.validate()) {
      formkey.currentState!.save();
      setState(() => _isLoading = true);

      try {
        final credential = await FirebaseAuth.instance.createUserWithEmailAndPassword(
          email: profile.email!,
          password: profile.password!,
        );

        final user = credential.user;
        if (user != null) {
          final syncResult = await ApiService.syncUser(
            email: profile.email!,
            firebaseUid: user.uid,
          );

          if (syncResult['success']) {
            if (mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Registration successful!')),
              );
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => HomeScreen()),
              );
            }
          } else {
            if (mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Sync failed: ${syncResult['message']}')),
              );
            }
          }
        }
        formkey.currentState!.reset();
      } on FirebaseAuthException catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(e.message ?? 'Registration failed')),
          );
        }
      } finally {
        if (mounted) {
          setState(() => _isLoading = false);
        }
      }
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
            appBar: AppBar(title: const Text("Create a user account")),
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
                      const SizedBox(height: 20),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : _handleRegister,
                          child: _isLoading
                              ? const CircularProgressIndicator()
                              : const Text("Register", style: TextStyle(fontSize: 20)),
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
