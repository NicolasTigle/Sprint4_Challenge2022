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

export default function CadastroDenuncia({ auth, database }) {
  const navigation = useNavigation();
  const route = useRoute();
  const { uid } = route.params;

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

  const handleCadastroDenuncia = async (navigation) => {
    console.log(praia);
    console.log(descricao);

    if (descricao || praia) {
      const key = Math.floor(Math.random() * 65536).toString();

      console.log(key);
      console.log(praia);
      console.log(descricao);

      await database.ref(`denuncia/${key}`).set({
        uid: uid,
        praia: praias[praia].value,
        descricao: descricoes[descricao].value,
        status: 'Esperando atendimento',
      });

      navigation.goBack();
    }
  };

  const FormSchemaCadastroDenuncia = Yup.object().shape({
    praia: Yup.number().required('Selecione uma das praias disponíveis'),
    descricao: Yup.number().required('Selecione uma das descrições disponíveis'),
  });

  return (
    <ScrollView>
      <Formik
        initialValues={{
          uid: uid,
          praia: praia,
          descricao: descricao,
        }}
        onSubmit={(values) => {
          console.log(values);
          handleCadastroDenuncia(navigation);
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
              onSelect={() => values.praia = praia}
            />
            {errors.praia && (
              <Text style={(styles.label, styles.erro)}>{errors.praia}</Text>
            )}
            <Text style={{ marginTop: 10 }}>Descrição</Text>
            <SelectList
              boxStyles={{ marginTop: 10 }}
              setSelected={setDescricao}
              data={descricoes}
              placeholder="Seleciona uma descrição"
              searchPlaceholder="Selecione uma descrição"
              onSelect={() => values.descricao = descricao}
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
