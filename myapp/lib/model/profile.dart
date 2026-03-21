class Profile {
  String? username;
  String? email;
  String? password;
  String? firebaseUid;

  Profile({this.email, this.password, this.username, this.firebaseUid});

  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      username: json['username'],
      email: json['email'],
      firebaseUid: json['firebaseUid'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'username': username,
      'email': email,
      'firebaseUid': firebaseUid,
    };
  }
}
