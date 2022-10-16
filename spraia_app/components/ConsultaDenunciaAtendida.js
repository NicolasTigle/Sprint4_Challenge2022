import React, { useState } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DenunciaItem from './DenunciaItem';

export default function ConsultaDenunciaAtendida({ auth, database }) {
  const navigation = useNavigation();
  const route = useRoute();
  const { uid, tipo } = route.params;

  const [listaDenuncia, setListaDenuncia] = useState([]);

  const getDenuncias = async () => {
    try {
      lista = [];
      await database
        .ref('denuncia/')
        .once('value')
        .then((snapshot) => {
          snapshot.forEach((item) => {
            const key = item.key;
            const dados = item.val();

            if (dados.status == 'Atendimento realizado') {
              itemDenuncia = {
                id: key,
                praia: dados.praia,
                descricao: dados.descricao,
                status: dados.status,
                uid: dados.uid,
              };

              if (tipo == 'Comum') {
                if (dados.uid == uid) {
                  lista.push(itemDenuncia);
                }
              } else {
                lista.push(itemDenuncia);
              }
            }
          });
        });
      setListaDenuncia(lista);
    } catch (e) {
      console.warn(e);
    }
  };

  getDenuncias();

  return (
    <View>
      {listaDenuncia.length == 0 && (
        <View style={styles.centro}>
          <Text>Não há denúncias atendidas.</Text>
        </View>
      )}
      {listaDenuncia.length > 0 && (
        <View>
          <FlatList
            data={listaDenuncia}
            renderItem={({ item }) => (
              <DenunciaItem
                item={item}
                tipo={tipo}
                atendida={true}
              />
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centro: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});
