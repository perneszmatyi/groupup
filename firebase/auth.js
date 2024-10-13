   // Auth.js
   import React, { useState } from 'react';
   import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
   import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
   import { auth } from './firebaseConfig';

   export default function Auth() {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [error, setError] = useState(null);

     const signUp = async () => {
       try {
         await createUserWithEmailAndPassword(auth, email, password);
         console.log('User signed up successfully');
       } catch (error) {
         setError(error.message);
       }
     };

     const signIn = async () => {
       try {
         await signInWithEmailAndPassword(auth, email, password);
         console.log('User signed in successfully');
       } catch (error) {
         setError(error.message);
       }
     };

     return (
       <View style={styles.container}>
         <TextInput
           placeholder="Email"
           value={email}
           onChangeText={setEmail}
           style={styles.input}
         />
         <TextInput
           placeholder="Password"
           value={password}
           onChangeText={setPassword}
           secureTextEntry
           style={styles.input}
         />
         <Button title="Sign Up" onPress={signUp} />
         <Button title="Sign In" onPress={signIn} />
         {error && <Text style={styles.error}>{error}</Text>}
       </View>
     );
   }

   const styles = StyleSheet.create({
     container: {
       flex: 1,
       justifyContent: 'center',
       padding: 20,
     },
     input: {
       borderWidth: 1,
       borderColor: 'gray',
       marginBottom: 10,
       padding: 10,
     },
     error: {
       color: 'red',
       marginTop: 10,
     },
   });