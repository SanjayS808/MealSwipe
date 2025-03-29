import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Link } from 'react-router-dom';
import pizzaimg from './login-img/login-pizza.png';
// import { GoogleSignin, authAPI, handlePostLoginData } from '@react-oauth/google';
import GoogleLoginButton from './GoogleLoginButton';

const { width, height } = Dimensions.get("window");

const Login = () => {

  return (
    <View style={styles.container}>
      <Link to="/" style={styles.closeButton}>
        <Text style={styles.closeButtonText}>×</Text>
      </Link>
      
      {/* Left Side with Image Placeholder */}
      <View style={styles.leftContainer}>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.description}>
          Join us to discover restaurants around your area! 
        </Text>
        <View style={styles.imagePlaceholder}>
          <img src={pizzaimg} alt="img" />
        </View>
      </View>
      
      {/* Right Side with Login Form */}
      <View style={styles.rightContainer}>
        <Text style={styles.brandTitle}>MealSwipe!</Text>
        <Text style={styles.createAccount}>Create Account</Text>
        <GoogleLoginButton></GoogleLoginButton>
        <br/>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Login</Text></Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    width: width,
    height: height,
    zIndex: "100",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    boxShadowColor: "#000",
    boxShadowOffset: { width: 0, height: 2 },
    boxShadowOpacity: 0.2,
    boxShadowRadius: 2,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  leftContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    padding: 20,
    height: height,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: "100%",
    height: 250,
    backgroundColor: "#333",
    borderRadius: 10,
  },
  rightContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    height: height,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  createAccount: {
    fontSize: 18,
    color: "red",
    marginBottom: 20,
  },
  input: {
    width: "32em",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    width: "90%",
    padding: 15,
    backgroundColor: "red",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    marginTop: 10,
  },
  loginLink: {
    color: "red",
    fontWeight: "bold",
  },
});

export default Login;
