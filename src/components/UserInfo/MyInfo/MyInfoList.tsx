import React from 'react';
import { Entypo } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';

import {
  withNavigation,
  NavigationScreenProp,
  NavigationRoute,
  NavigationParams,
} from 'react-navigation';

import asyncStorageHelper from '../../../util/asyncStorageHelper';

interface Props {
  myInfo: {
    email?: string;
    name?: string;
    mobile?: string;
    birth?: string;
    password?: string;
    gender?: string;
  };

  navigation: NavigationScreenProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >;
}

const styles = StyleSheet.create({
  // ButtonViewStyle: {
  //   backgroundColor: '#D1D1D1',
  //   // borderColor: '#dfe4ea',
  //   // borderWidth: 1,
  //   // marginBottom: 30,
  //   // marginLeft: 20,
  //   // marginRight: 20,
  //   // padding: 10,
  //   width: '90%',
  // },
  TextViewStyle: {
    backgroundColor: '#F9F9F9',
    borderColor: '#dfe4ea',
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    padding: 10,
    width: '90%',
  },
  title: {
    fontSize: 15,
    marginBottom: 15,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
});

function MyInfoList(props: Props): JSX.Element {
  const { myInfo } = props;
  // console.log(myInfo);
  const { email, name, mobile, birth } = myInfo;

  return (
    <View>
      <Text style={styles.title}>이름</Text>
      <View style={styles.TextViewStyle}>
        <Text>{name}</Text>
      </View>

      <Text style={styles.title}>생년월일</Text>
      <View style={styles.TextViewStyle}>
        <Text>{birth}</Text>
      </View>

      <Text style={styles.title}>이메일</Text>
      <View style={styles.TextViewStyle}>
        <Text>{email}</Text>
      </View>

      <Text style={styles.title}>핸드폰</Text>
      <TouchableOpacity
        style={styles.TextViewStyle}
        onPress={(): void => {
          props.navigation.navigate('Mobile');
        }}
      >
        <Text>
          {mobile} <Entypo name="chevron-thin-right" size={15} />
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>패스워드 변경</Text>
      <TouchableOpacity
        style={styles.TextViewStyle}
        onPress={(): void => {
          props.navigation.navigate('Password', {
            key: myInfo,
          });
        }}
      >
        <Text>
          ******** <Entypo name="chevron-thin-right" size={15} />
        </Text>
      </TouchableOpacity>
      <View>
        <Button
          title="로그아웃"
          // buttonStyle={styles.ButtonViewStyle}
          onPress={(): void => {
            asyncStorageHelper.clear();
            props.navigation.navigate('LoginScreen');
          }}
        />
      </View>
    </View>
  );
}

export default withNavigation(MyInfoList);