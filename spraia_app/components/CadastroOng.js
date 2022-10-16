import React, { useState } from 'react';
import { Formik } from 'formik';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import * as Yup from 'yup';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import MaskInput, { Masks } from 'react-native-mask-input';

export default function CadastroOng({ auth, database }) {
  const navigation = useNavigation();
  const [jaCadastrado, setJaCadastrado] = useState(false);
  const [emailInvalido, setEmailInvalido] = useState('');

  const handleCadastroOng = async (values, navigation) => {
    await 
       auth
      .createUserWithEmailAndPassword(values.email, values.senha)
      .then((user) => {
        database.ref(`usuario/${user.user.uid}`).set({
          nome: values.nome,
          senha: values.senha,
          email: values.email,
          telefone: values.telefone,
          cnpj: values.cnpj,
          tipo: 'ONG'
        });

        navigation.navigate('Login');
      })
      .catch((error) => {
        setJaCadastrado(true)
        setEmailInvalido(values.email)
        console.log(error);
      });
  };

   const FormSchemaCadastro = Yup.object().shape({
    nome: Yup.string()
      .required('Campo obrigatório'),
    senha: Yup.string()
      .required('Confirme sua senha')
      .oneOf(
        [Yup.ref('confirmarSenha'), null],
        'As senhas precisam ser iguais.'
      ),
    confirmarSenha: Yup.string().required('Senha obrigatória'),
    email: Yup.string()
      .required('Campo obrigatório')
      .email('Digite um email válido'),
    telefone: Yup.string()
      .required('Campo obrigatório')
      .min(15, 'Digite um telefone válido'),
    cnpj: Yup.string()
      .required('Campo obrigatório')
      .min(18, 'Digite o cnpj completo'),
  });

  return (
    <ScrollView>
      <Formik
        initialValues={{
          nome: '',
          senha: '',
          confirmarSenha: '',
          email: '',
          telefone: '',
          cnpj: '',
        }}
        onSubmit={(values) => {
          handleCadastroOng(values, navigation);
        }}
        validationSchema={FormSchemaCadastro}>
        {({
          values,
          handleChange,
          handleSubmit,
          errors,
          touched,
          setFieldTouched,
        }) => (
          <View>
            <Text style={styles.label}>Usuário</Text>
            <TextInput
              placeholder="Usuário"
              style={styles.campo}
              value={values.nome}
              onChangeText={handleChange('nome')}
              onBlur={() => setFieldTouched('nome', true)}
            />
            {errors.nome && touched.nome && (
              <Text style={(styles.label, styles.erro)}>{errors.nome}</Text>
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

            <Text style={styles.label}>Confirmar Senha</Text>

            <TextInput
              secureTextEntry
              placeholder="Confirmar Senha"
              style={styles.campo}
              value={values.confirmarSenha}
              onChangeText={handleChange('confirmarSenha')}
              onBlur={() => setFieldTouched('confirmarSenha', true)}
            />
            {errors.confirmarSenha && touched.confirmarSenha && (
              <Text style={(styles.label, styles.erro)}>
                {errors.confirmarSenha}
              </Text>
            )}

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
            {jaCadastrado && values.email == emailInvalido && (
              <Text style={(styles.label, styles.erro)}>
                Esse email já foi cadastrado!
              </Text>
            )}
            <Text style={styles.label}>Telefone</Text>
            <MaskInput
              placeholder="(**) *****-****"
              style={styles.campo}
              value={values.telefone}
              onChangeText={handleChange('telefone')}
              onBlur={() => setFieldTouched('telefone', true)}
              mask={Masks.BRL_PHONE}
            />
            {errors.telefone && touched.telefone && (
              <Text style={(styles.label, styles.erro)}>{errors.telefone}</Text>
            )}

            <Text style={styles.label}>CNPJ</Text>

            <MaskInput
              placeholder="**.***.***/****-**"
              style={styles.campo}
              value={values.cnpj}
              onChangeText={handleChange('cnpj')}
              onBlur={() => setFieldTouched('cnpj', true)}
              mask={Masks.BRL_CNPJ}
            />

            {errors.cnpj && touched.cnpj && (
              <Text style={(styles.label, styles.erro)}>{errors.cnpj}</Text>
            )}

            <TouchableOpacity onPress={handleSubmit}>
              <LinearGradient
                colors={['#46EC91', '#18ACDF']}
                style={styles.fonteBotao}
                start={{ y: 0.0, x: 0.0 }}
                end={{ y: 0.0, x: 1.0 }}>
                <Text style={styles.fonte}>Confirmar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  fonte: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
  },
  erro: {
    marginLeft: Dimensions.get('window').width / 7.5,
    marginTop: 10,
    color: 'red',
  },
});
