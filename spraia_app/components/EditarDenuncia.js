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
import { useNavigation, useRoute } from '@react-navigation/native';
import SelectList from 'react-native-dropdown-select-list';

export default function EditarDenuncia({ auth, database }) {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const [denuncia, setDenuncia] = useState();
  const [praia, setPraia] = useState('');
  const [descricao, setDescricao] = useState('');
  const praias = [
    { key: '0', value: 'Bertioga' },
    { key: '1', value: 'Cananéia' },
    { key: '2', value: 'Caraguatatuba' },
    { key: '3', value: 'Guarujá' },
    { key: '4', value: 'Iguape' },
    { key: '5', value: 'Ilhabela' },
    { key: '6', value: 'Ilha Comprida' },
    { key: '7', value: 'Itanhaém' },
    { key: '8', value: 'Mongaguá' },
    { key: '9', value: 'Peruíbe' },
    { key: '10', value: 'Praia Grande' },
    { key: '11', value: 'Santos' },
    { key: '12', value: 'São Sebastião' },
    { key: '13', value: 'São Vicente' },
    { key: '14', value: 'Ubatuba' },
  ];
  
  const descricoes = [
    { key: '0', value: 'Derramamento de esgoto' },
    { key: '1', value: 'Lixo no mar' },
    { key: '2', value: 'Resíduos na areia' },
  ];

  const getDenuncia = async () => {
    try {
      await database
        .ref(`denuncia/${id}`)
        .once('value')
        .then((snapshot) => {
          const key = snapshot.key;
          const dados = snapshot.val();

          praiaKey = '';
          descricaoKey = '';

          praias.forEach((item) => {
            if (item.value == dados.praia) {
              praiaKey = item.key;
            }
          });

          descricoes.forEach((item) => {
            if (item.value == dados.descricao) {
              descricaoKey = item.key;
            }
          });

          itemDenuncia = {
            id: key,
            praia: dados.praia,
            descricao: dados.descricao,
            uid: dados.uid,
            praiaKey: praiaKey,
            descricaoKey: descricaoKey,
          };

          setDenuncia(itemDenuncia);
          setPraia(dados.praia);
          setDescricao(dados.descricao);
        });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleEditarUsuario = async (navigation) => {
    await database
      .ref(`denuncia/${id}`)
      .update({
        praia: praias[praia].value,
        descricao: descricoes[descricao].value,
      })
      .then(() => {
        console.log('deu certo!');
        navigation.goBack();
      })

      .catch((error) => {
        console.log(error);
      });
  };

if (!denuncia) {
  getDenuncia();
}

  const FormSchemaCadastroDenuncia = Yup.object().shape({
    praia: Yup.number().required('Selecione uma das praias disponíveis'),
    descricao: Yup.number().required(
      'Selecione uma das descrições disponíveis'
    ),
  });

  return (
    <View>
      {denuncia &&
        praia &&
        descricao && (
          <ScrollView>
            <Formik
              initialValues={{
                praia: praia,
                descricao: descricao,
              }}
              onSubmit={(values) => {
                console.log(values);
                handleEditarUsuario(navigation);
              }}
              validationSchema={FormSchemaCadastroDenuncia}>
              {({
                values,
                handleChange,
                handleSubmit,
                errors,
                touched,
                setFieldTouched,
              }) => (
                <View>
                  <Text style={{ marginTop: 10 }}>Praia</Text>
                  <SelectList
                    boxStyles={{ marginTop: 10 }}
                    setSelected={setPraia}
                    data={praias}
                    placeholder="Seleciona uma praia"
                    searchPlaceholder="Selecione uma praia"
                    onSelect={() => (values.praia = praia)}
                    defaultOption={{
                      key: denuncia.praiaKey,
                      value: denuncia.praia,
                    }}
                  />
                  {errors.praia && (
                    <Text style={(styles.label, styles.erro)}>
                      {errors.praia}
                    </Text>
                  )}
                  <Text style={{ marginTop: 10 }}>Descrição</Text>
                  <SelectList
                    boxStyles={{ marginTop: 10 }}
                    setSelected={setDescricao}
                    data={descricoes}
                    placeholder="Seleciona uma descrição"
                    searchPlaceholder="Selecione uma descrição"
                    onSelect={() => (values.descricao = descricao)}
                    defaultOption={{
                      key: denuncia.descricaoKey,
                      value: denuncia.descricao,
                    }}
                  />
                  {errors.descricao && (
                    <Text style={(styles.label, styles.erro)}>
                      {errors.descricao}
                    </Text>
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
        )}
    </View>
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
