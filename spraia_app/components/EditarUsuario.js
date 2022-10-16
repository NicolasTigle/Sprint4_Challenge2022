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
import MaskInput, { Masks } from 'react-native-mask-input';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function EditarUsuario({ database, auth }) {
  const navigation = useNavigation();
  const route = useRoute();
  const { usuario } = route.params;

  console.log(usuario?.id);

  const signOut = async (_) => {
    console.log(auth.currentUser.email);
    await auth.signOut().then(() => {
      navigation.navigate('Login');
    });
  };

  const handleEditarUsuario = async (values, navigation) => {
    console.log(values.id);
    await database
      .ref(`usuario/${values.id}`)
      .update({
        usuario: values.usuario,
        telefone: values.telefone,
        data: values.data,
      })
      .then(() => {
        console.log('deu certo!');
        navigation.goBack('Home');
      })

      .catch((error) => {
        console.log(error);
      });
  };
  const FormSchemaEditar = Yup.object().shape({
    usuario: Yup.string()
      .required('Campo obrigatório')
      .min(5, 'Digite pelo menos 5 caracteres'),
    telefone: Yup.string()
      .required('Campo obrigatório')
      .min(15, 'Digite um telefone válido'),
    data: Yup.string()
      .required('Campo obrigatório')
      .min(10, 'Digite a data completa'),
  });

  return (
    <ScrollView>
      <Formik
        initialValues={{
          id: usuario.id,
          usuario: usuario.usuario,
          telefone: usuario.telefone,
          data: usuario.data,
        }}
        onSubmit={(values) => {
          handleEditarUsuario(values, navigation);
        }}
        validationSchema={FormSchemaEditar}>
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
              value={values.usuario}
              onChangeText={handleChange('usuario')}
              onBlur={() => setFieldTouched('usuario', true)}
            />
            {errors.usuario && touched.usuario && (
              <Text style={(styles.label, styles.erro)}>{errors.usuario}</Text>
            )}

            <Text style={styles.label}>Data de Nascimento</Text>
            <MaskInput
              placeholder="DD/MM/AAAA"
              style={styles.campo}
              value={values.data}
              onChangeText={handleChange('data')}
              onBlur={() => setFieldTouched('data', true)}
              mask={Masks.DATE_DDMMYYYY}
            />

            {errors.data && touched.data && (
              <Text style={(styles.label, styles.erro)}>{errors.data}</Text>
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

      <TouchableOpacity
        onPress={() => {
          signOut();
        }}>
        <LinearGradient
          colors={['#46EC91', '#18ACDF']}
          style={styles.fonteBotao}
          start={{ y: 0.0, x: 0.0 }}
          end={{ y: 0.0, x: 1.0 }}>
          <Text style={styles.fonte}>Deslogar</Text>
        </LinearGradient>
      </TouchableOpacity>
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
