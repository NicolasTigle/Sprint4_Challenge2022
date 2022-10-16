import React, { useState } from 'react';
import { Formik } from 'formik';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import * as Yup from 'yup';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Octicons, FontAwesome5 } from '@expo/vector-icons';

export default function Login({ auth, database }) {
  const navigation = useNavigation();
  const [loginInvalido, setLoginInvalido] = useState(false);
  const [emailInseridoLogin, setEmailInseridoLogin] = useState();
  const [senhaInseridaLogin, setSenhaInseridaLogin] = useState();

  const FormSchemaLogin = Yup.object().shape({
    email: Yup.string().required('Campo obrigatório'),
    senha: Yup.string().required('Campo obrigatório'),
  });

  const handleLogin = async (email, senha, navigation) => {
    await auth
      .signInWithEmailAndPassword(email, senha)
      .then((user) => {
        console.log(user);
        if (user) {
          const uid = user.user.uid;
          // console.log(uid);
          database
            .ref(`usuario/${uid}`)
            .once('value')
            .then((snapshot) => {
              const dados = snapshot.val();
              console.log(dados.tipo);

              setLoginInvalido(false);

              navigation.navigate('Home', { uid: uid });
            });
        }
      })
      .catch((error) => {
        setLoginInvalido(true);
        setEmailInseridoLogin(email);
        setSenhaInseridaLogin(senha);
        console.log(error);
      });
  };

  return (
    <View>
      <Formik
        initialValues={{
          email: '',
          senha: '',
        }}
        onSubmit={(values) => {
          handleLogin(values.email, values.senha, navigation);
        }}
        validationSchema={FormSchemaLogin}>
        {({
          values,
          handleChange,
          handleSubmit,
          errors,
          touched,
          setFieldTouched,
        }) => (
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Email"
              style={styles.campo}
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={() => setFieldTouched('email', true)}
            />
            {errors.email && touched.email && (
              <Text style={(styles.label, styles.erro)}>{errors.email}</Text>
            )}
            <Text style={styles.label}>Senha</Text>
            <TextInput
              secureTextEntry
              placeholder="Senha"
              style={styles.campo}
              value={values.senha}
              onChangeText={handleChange('senha')}
              onBlur={() => setFieldTouched('senha', true)}
            />
            {errors.senha && touched.senha && (
              <Text style={(styles.label, styles.erro)}>{errors.senha}</Text>
            )}
            {loginInvalido &&
              values.email == emailInseridoLogin &&
              values.senha == senhaInseridaLogin && (
                <Text style={(styles.label, styles.erro)}>Login inválido</Text>
              )}

            <TouchableOpacity onPress={handleSubmit}>
              <LinearGradient
                colors={['#46EC91', '#18ACDF']}
                style={styles.fonteBotao}
                start={{ y: 0.0, x: 0.0 }}
                end={{ y: 0.0, x: 1.0 }}>
                <Text style={styles.fonte}>Acessar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <FontAwesome5
        style={{ alignSelf: 'center', marginTop: 30 }}
        name="user"
        size={50}
        color="#333"
      />

      <Text style={styles.textoFinal}>
        É um usuário comum e não possui uma conta?
      </Text>

      <TouchableOpacity
        style={{ marginBottom: 30 }}
        onPress={() => navigation.navigate('CadastroUsuario')}>
        <Text style={styles.textoLink}>
          Clique aqui para criar uma conta agora!
        </Text>
      </TouchableOpacity>

      <Octicons
        style={{ alignSelf: 'center' }}
        name="organization"
        size={50}
        color="#333"
      />

      <Text style={styles.textoFinal}>
        Faz parte de uma ONG e não possui uma conta?
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate('CadastroOng')}>
        <Text style={styles.textoLink}>
          Clique aqui para criar uma conta agora!
        </Text>
      </TouchableOpacity>

      <View style={styles.espaco}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  espaco: {
    marginTop: 60,
  },
  label: {
    marginLeft: Dimensions.get('window').width / 7.5,
    marginTop: 10,
  },
  campo: {
    backgroundColor: '#f1f5f4',
    marginTop: 10,
    alignSelf: 'center',
    height: 35,
    width: 270,
    placeholderTextColor: 'silver',
    paddingLeft: 5,
    borderBottomWidth: 0.1,
  },
  fonteBotao: {
    backgroundColor: 'red',
    marginTop: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: 270,
    alignSelf: 'center',
    textShadowColor: '#46EC91',
    textShadowRadius: 10,
  },
  textoLink: {
    alignSelf: 'center',
    color: '#18ACDF',
    borderBottomWidth: 1,
    borderColor: '#18ACDF',
    fontSize: 15,
    fontFamily: 'Arial, sans-serif',
  },
  fonte: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
  },
  textoFinal: {
    marginTop: 20,
    fontSize: 15,
    fontFamily: 'Arial, sans-serif',
    alignSelf: 'center',
  },
  erro: {
    marginLeft: Dimensions.get('window').width / 7.5,
    marginTop: 10,
    color: 'red',
  },
});
