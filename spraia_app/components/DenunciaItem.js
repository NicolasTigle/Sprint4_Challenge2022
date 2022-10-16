import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';

export default function DenunciaItem({ item, handleDeleteDenuncia, tipo, handleSelectDenuncia, atendida }) {
  const navigation = useNavigation();

  return (
    <View style={styles.denuncia}>
      <Text style={styles.marginCampo}>Praia: {item?.praia}</Text>
      <Text style={styles.marginCampo}>Status: {item?.status}</Text>
      <Text>Descrição:</Text>
      <Text style={styles.marginCampo}>{item?.descricao}</Text>
      {tipo == 'Comum' && !atendida && (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => handleDeleteDenuncia(item?.id)}>
            <MaterialIcons name="delete" size={30} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EditarDenuncia', { id: item?.id })
            }>
            <MaterialIcons name="edit" size={30} color="#333" />
          </TouchableOpacity>
        </View>
      )}
      {tipo == 'ONG' && !atendida && (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => handleSelectDenuncia(item?.id)}>
            <MaterialIcons name="check" size={30} color="#333" />
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  denuncia: {
    flexDirection: 'column',
    padding: 16,
    marginTop: 16,
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#99D4EE',
  },
  marginCampo: {
    marginBottom: 10,
  },
});
