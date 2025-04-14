import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from "react-native";
import { Link } from 'react-router-dom';
import pizzaimg from './login-img/login-pizza.png';
import GoogleLoginButton from './GoogleLoginButton';

const { width, height } = Dimensions.get("window");

const Login = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Link to="/" style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </Link>
        
        <View style={styles.leftContainer}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.description}>
            Join us to discover restaurants around your area! 
          </Text>
          <View style={styles.imagePlaceholder}>
            <Image source={pizzaimg} style={styles.image} />
          </View>
        </View>
        
        <View style={styles.rightContainer}>
          <Text style={styles.brandTitle}>MealSwipe!</Text>
          <Text style={styles.createAccount}>Create Account</Text>
          <GoogleLoginButton style={{padding: "0.25em"}} />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLink}>Login</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column', // Column layout with image on top and form at the bottom
    width: '100%',
    height: '100%',
    zIndex: 1000,
    paddingHorizontal: 10, // Added horizontal padding to avoid overflow
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
    alignItems: "center",
    padding: 20,
    height: height * 0.5, // Make the image area take half the screen
    width: '100%', // Ensure full width for the left container
  },
  welcomeText: {
    color: "#fff",
    fontSize: width > 768 ? 30 : 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    color: "#fff",
    fontSize: width > 768 ? 16 : 14,
    marginBottom: 20,
    textAlign: "center",
  },
  imagePlaceholder: {
    width: "100%",
    height: 250,
    backgroundColor: "#333",
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  rightContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    height: height * 0.5, // Make the login form area take the bottom half of the screen
    width: '100%', // Ensure full width for the right container
  },
  brandTitle: {
    fontSize: width > 768 ? 24 : 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  createAccount: {
    fontSize: 18,
    color: "red",
    marginBottom: 20,
  },
  input: {
    width: "90%", // Ensure input doesn't overflow horizontally
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
    margin: "1em",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    marginTop: 10,
    fontSize: 14,
  },
  loginLink: {
    color: "red",
    fontWeight: "bold",
  },
});

export default Login;
