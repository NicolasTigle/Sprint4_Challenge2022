import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Linking } from 'react-native';

export default function Home({ database, auth }) {
  const navigation = useNavigation();

  const route = useRoute();
  const { uid } = route.params;

  const [usuario, setUsuario] = useState();

  const restoreUsuarioFromFirebase = async () => {
    try {
      await database
        .ref(`usuario/${uid}`)
        .once('value')
        .then((snapshot) => {
          const key = snapshot.key;
          const dados = snapshot.val();
          var usuarioObj = {};

          if (dados.tipo == 'Comum') {
            usuarioObj = {
              id: key,
              usuario: dados.usuario,
              senha: dados.senha,
              email: dados.email,
              telefone: dados.telefone,
              data: dados.data,
              tipo: dados.tipo,
            };
          }
          if (dados.tipo == 'ONG') {
            usuarioObj = {
              id: key,
              nome: dados.nome,
              senha: dados.senha,
              email: dados.email,
              telefone: dados.telefone,
              cnpj: dados.cnpj,
              tipo: dados.tipo,
            };
          }

          setUsuario(usuarioObj);
        });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDeletarUsuario = async (uid, navigation) => {
    // console.log(uid);
    await auth.currentUser
      .delete()
      .then(() => {
        database
          .ref(`usuario/${uid}`)
          .remove()
          .then(() => {
            navigation.goBack('Login');
          })
          .catch((error) => {
            console.log('Error deleting user data:', error);
          });
      })
      .catch((error) => {
        console.log('Error deleting user:', error);
      });
  };

    restoreUsuarioFromFirebase();
  
  const signOut = async (_) => {
    console.log(auth.currentUser.email);
    await auth.signOut().then(() => {
      navigation.goBack('Login');
    });
  };

  return (
    <View>
      {usuario && (
        <View style={styles.container}>
          {usuario.tipo == 'Comum' && (
            <View>
              <Text style={styles.fonte1}>Olá {usuario?.usuario},</Text>
              <Text style={styles.fonte2}>seja bem-vindo(a)!</Text>

              <Text style={styles.fonte3}>Suas informações pessoais: </Text>

              <View>
                <Text style={styles.camposDados}>
                  Nome: {usuario?.usuario}{' '}
                </Text>
                <Text style={styles.camposDados}>Email: {usuario?.email} </Text>
                <Text style={styles.camposDados}>
                  Telefone: {usuario?.telefone}{' '}
                </Text>
                <Text style={styles.camposDados}>
                  Data de Nascimento: {usuario?.data}
                </Text>
              </View>
            </View>
          )}

          {usuario.tipo == 'ONG' && (
            <View>
              <Text style={styles.fonte1}>Olá {usuario?.nome},</Text>
              <Text style={styles.fonte2}>seja bem-vindo(a)!</Text>

              <Text style={styles.fonte3}>Informações da ONG: </Text>

              <View>
                <Text style={styles.camposDados}>Nome: {usuario?.nome} </Text>
                <Text style={styles.camposDados}>Email: {usuario?.email} </Text>
                <Text style={styles.camposDados}>
                  Telefone: {usuario?.telefone}{' '}
                </Text>
                <Text style={styles.camposDados}>CNPJ: {usuario?.cnpj} </Text>
              </View>
            </View>
          )}

          <View>
            {usuario.tipo == 'Comum' && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('CadastroDenuncia', { uid: uid });
                }}>
                <LinearGradient
                  colors={['#46EC91', '#18ACDF']}
                  style={styles.fonteBotao}
                  start={{ y: 0.0, x: 0.0 }}
                  end={{ y: 0.0, x: 1.0 }}>
                  <Text style={styles.fonte}>Cadastro Denúncia</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ConsultaDenuncia', {
                  uid: uid,
                  tipo: usuario?.tipo,
                });
              }}>
              <LinearGradient
                colors={['#46EC91', '#18ACDF']}
                style={styles.fonteBotao}
                start={{ y: 0.0, x: 0.0 }}
                end={{ y: 0.0, x: 1.0 }}>
                <Text style={styles.fonte}>Consultar Denúncias Abertas</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ConsultaDenunciaAtendida', {
                  uid: uid,
                  tipo: usuario?.tipo,
                });
              }}>
              <LinearGradient
                colors={['#46EC91', '#18ACDF']}
                style={styles.fonteBotao}
                start={{ y: 0.0, x: 0.0 }}
                end={{ y: 0.0, x: 1.0 }}>
                <Text style={styles.fonte}>Consultar Denúncias Atendidas</Text>
              </LinearGradient>
            </TouchableOpacity>

            {usuario.tipo == 'Comum' && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EditarUsuario', { usuario: usuario });
                }}>
                <LinearGradient
                  colors={['#46EC91', '#18ACDF']}
                  style={styles.fonteBotao}
                  start={{ y: 0.0, x: 0.0 }}
                  end={{ y: 0.0, x: 1.0 }}>
                  <Text style={styles.fonte}>Editar Usuário</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {usuario.tipo == 'ONG' && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EditarOng', { usuario: usuario });
                }}>
                <LinearGradient
                  colors={['#46EC91', '#18ACDF']}
                  style={styles.fonteBotao}
                  start={{ y: 0.0, x: 0.0 }}
                  end={{ y: 0.0, x: 1.0 }}>
                  <Text style={styles.fonte}>Editar ONG</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

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

            <TouchableOpacity
              onPress={() => {
                handleDeletarUsuario(uid, navigation);
                navigation.goBack('Login');
              }}>
              <LinearGradient
                colors={['#46EC91', '#18ACDF']}
                style={styles.fonteBotao}
                start={{ y: 0.0, x: 0.0 }}
                end={{ y: 0.0, x: 1.0 }}>
                <Text style={styles.fonte}>Deletar Usuário</Text>
              </LinearGradient>
            </TouchableOpacity>

            {usuario.tipo == 'Comum' && (
              <FontAwesome5
                style={{ alignSelf: 'center', marginTop: 20 }}
                onPress={() => {
                  Linking.openURL('http://t.me/SPraiaZenitiBot');
                }}
                name="robot"
                size={50}
                color="#18ACDF"
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  fonte1: {
    fontSize: 25,
    marginTop: 20,
  },
  fonte2: {
    fontSize: 25,
  },
  fonte3: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  camposDados: {
    fontSize: 15,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
