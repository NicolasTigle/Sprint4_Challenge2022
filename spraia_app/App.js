import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/Login';
import Cadastro from './components/CadastroUsuario';
import Home from './components/Home';
import EditarUsuario from './components/EditarUsuario';
import CadastroDenuncia from './components/CadastroDenuncia';
import ConsultaDenuncia from './components/ConsultaDenuncia';
import ConsultaDenunciaAtendida from './components/ConsultaDenunciaAtendida';
import EditarDenuncia from './components/EditarDenuncia';
import CadastroOng from './components/CadastroOng';
import EditarOng from './components/EditarOng';

import * as firebase from 'firebase';

const Stack = createNativeStackNavigator();

const config = {
  apiKey: 'AIzaSyA_UJKxgeth6JXQWMk71Sq2kWvmoOXq1Ko',
  authDomain: 'banco-spraia.firebaseapp.com',
  databaseURL: 'https://banco-spraia-default-rtdb.firebaseio.com',
  projectId: 'banco-spraia',
  storageBucket: 'banco-spraia.appspot.com',
  messagingSenderId: '808990532164',
  appId: '1:808990532164:web:1b16b5f213239923329211',
};

export default function App() {
  if (!firebase.apps.length) firebase.initializeApp(config);
  const database = firebase.database();
  const auth = firebase.auth();

  const telaLogin = (_) => {
    return <Login database={database} auth={auth} />;
  };

  const telaCadastroUsuario = (_) => {
    return <Cadastro database={database} auth={auth} />;
  };

  const telaHome = (_) => {
    return <Home database={database} auth={auth} />;
  };

  const telaEditarUsuario = (_) => {
    return <EditarUsuario database={database} auth={auth} />;
  };

  const telaCadastroDenuncia = (_) => {
    return <CadastroDenuncia database={database} auth={auth} />;
  };

  const telaConsultaDenuncia = (_) => {
    return <ConsultaDenuncia database={database} auth={auth} />;
  };

  const telaEditarDenuncia = (_) => {
    return <EditarDenuncia database={database} auth={auth} />;
  };

  const telaCadastroOng = (_) => {
    return <CadastroOng database={database} auth={auth} />;
  };

  const telaEditarOng = (_) => {
    return <EditarOng database={database} auth={auth} />;
  };

  const telaConsultaDenunciaAtendida = (_) => {
    return <ConsultaDenunciaAtendida database={database} auth={auth} />;
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={telaLogin} />
        <Stack.Screen
          name="CadastroUsuario"
          component={telaCadastroUsuario}
          options={{ title: 'Cadastro Usuário' }}
        />
        <Stack.Screen
          name="Home"
          component={telaHome}
          options={{
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="EditarUsuario"
          component={telaEditarUsuario}
          options={{ title: 'Editar Usuário' }}
        />
        <Stack.Screen
          name="CadastroDenuncia"
          component={telaCadastroDenuncia}
          options={{ title: 'Cadastro Denúncia' }}
        />
        <Stack.Screen
          name="ConsultaDenuncia"
          component={telaConsultaDenuncia}
          options={{ title: 'Denúncias' }}
        />
        <Stack.Screen
          name="EditarDenuncia"
          component={telaEditarDenuncia}
          options={{ title: 'Editar Denúncia' }}
        />
        <Stack.Screen
          name="CadastroOng"
          component={telaCadastroOng}
          options={{ title: 'Cadastro ONG' }}
        />
        <Stack.Screen
          name="EditarOng"
          component={telaEditarOng}
          options={{ title: 'Editar ONG' }}
        />
        <Stack.Screen
          name="ConsultaDenunciaAtendida"
          component={telaConsultaDenunciaAtendida}
          options={{ title: 'Denúncias Atendidas' }}
        />
      </Stack.Navigator>
      <StatusBar barStyle="default" />
    </NavigationContainer>
  );
}
