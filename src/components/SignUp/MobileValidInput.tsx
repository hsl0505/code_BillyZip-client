import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';

import {
  withNavigation,
  NavigationScreenProp,
  NavigationRoute,
  NavigationParams,
} from 'react-navigation';

import axiosInstance from '../../util/axiosInstance';

interface Props {
  navigation: NavigationScreenProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >;
}
const styles = StyleSheet.create({
  ButtonViewStyle: {
    backgroundColor: '#D1D1D1',
    borderColor: '#dfe4ea',
    borderWidth: 1,
    marginBottom: 30,
    marginLeft: 20,
    marginRight: 20,
    padding: 10,
    width: '90%',
  },
  TextViewStyle: {
    backgroundColor: '#F9F9F9',
    borderColor: '#dfe4ea',
    borderWidth: 1,

    marginBottom: 20,
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

function MobileValidInput(props: Props): JSX.Element {
  const [userPhoneNum, setuserPhoneNum] = useState();
  const [PhoneNumErr, setPhoneNumErr] = useState();
  const [userVerifyNum, setuserVerifyNum] = useState();
  const [userVerifyNumErr, setuserVerifyNumErr] = useState();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={styles.title}>휴대폰 번호 인증</Text>

      <Input
        placeholder="예) 0101234567"
        containerStyle={styles.TextViewStyle}
        underlineColorAndroid="transparent"
        onChangeText={(text): void => {
          setuserPhoneNum(text);
        }}
        errorMessage={PhoneNumErr}
        errorStyle={{ alignSelf: 'center' }}
      />
      <Button
        title="인증번호 발송"
        buttonStyle={styles.ButtonViewStyle}
        onPress={(): void => {
          axiosInstance
            .post('auth', {
              userPhoneNum,
            })
            .then((res) => {
              if (res.status === 200) {
                setPhoneNumErr(res.data); // 성공 -> 에러 처리 옳지 않음 (추후 수정 : 모바일도)
              }
            })
            .catch((err) => {
              if (err.response.status === 400) {
                setPhoneNumErr(err.response.data);
              }
            });
        }}
      />

      <Input
        placeholder="인증번호 입력 예) 1234"
        containerStyle={styles.TextViewStyle}
        underlineColorAndroid="transparent"
        onChangeText={(text): void => {
          setuserVerifyNum(text);
        }}
        errorMessage={userVerifyNumErr}
        errorStyle={{ alignSelf: 'center' }}
      />
      <Button
        title="확인"
        buttonStyle={styles.ButtonViewStyle}
        onPress={(): void => {
          axiosInstance
            .post('auth/verify', {
              userVerifyNum,
              userPhoneNum,
            })
            .then((res) => {
              if (res.status === 200) {
                props.navigation.navigate('SignUpInputScreen', {
                  mobiletest: userPhoneNum,
                });
              }
            })
            .catch((err) => {
              if (err.response.status === 400) {
                setuserVerifyNumErr(err.response.data);
              }
            });
        }}
      />
    </View>
  );
}
export default withNavigation(MobileValidInput);
