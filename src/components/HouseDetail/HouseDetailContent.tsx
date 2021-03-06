import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, AsyncStorage } from 'react-native';
import {
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
  FontAwesome,
  Entypo,
} from '@expo/vector-icons';
import { Rating, Button, Overlay } from 'react-native-elements';
import {
  withNavigation,
  NavigationScreenProp,
  NavigationRoute,
  NavigationParams,
} from 'react-navigation';

import axiosInstance from '../../util/axiosInstance';

interface Props {
  isFav?: string;
  navigation: NavigationScreenProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >;
  house: {
    id: number;
    title: string;
    type: string;
    description: string;
    adminDistrict: string;
    plan: string;
    year: number;
    status: boolean;
    avgRating: number;
    access: number;
    startTime: number;
    endTime: number;
    houseRule: string;
    amenity: {};
    user: {
      name: string;
      id: number;
    };
    reviews: [];
  };
}

function HouseDetailContent(props: Props): JSX.Element {
  const { width } = Dimensions.get('window');
  const { isFav, house } = props;
  const [isVisible, setVisible] = useState(false);
  const [isVisibleTwo, setVisibleTwo] = useState(false);
  const [myId, setMyId] = useState();
  const [myName, setMyName] = useState();
  const houseId = house.id;

  const {
    title,
    type,
    description,
    adminDistrict,
    plan,
    year,
    status,
    avgRating,
    reviews,
    access,
    startTime,
    endTime,
    houseRule,
    amenity,
    user,
  } = house;

  const { name, id } = user;

  const isTrueAmenity: string[] = [];
  Object.entries(amenity).forEach((ele) => {
    if (ele[1] === true && ele[0] !== 'isActive') {
      isTrueAmenity.push(ele[0]);
    }
  });

  useEffect(() => {
    const getMyId = async (): Promise<void> => {
      const getmyId = await AsyncStorage.getItem('userId');
      const getmyName = await AsyncStorage.getItem('userName');
      setMyId(getmyId);
      setMyName(getmyName);
    };
    getMyId();
  }, []);

  return (
    <View style={{ flex: 1, marginHorizontal: 15, marginBottom: 25 }}>
      <View style={{ flex: 1, marginTop: 25 }}>
        <Text
          style={{
            fontSize: 35,
            fontWeight: 'bold',
          }}
        >
          {title}
        </Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          marginTop: 10,
          flex: 1,
          flexDirection: 'row',
        }}
      >
        <Rating
          readonly
          startingValue={avgRating}
          fractions={2}
          imageSize={25}
        />
        <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: 'bold' }}>
          {avgRating}
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: 'bold',
            color: '#6E6E6E',
            marginLeft: 5,
          }}
        >
          ({reviews.length})
        </Text>
      </View>
      <View style={{ flex: 1, marginTop: 20 }}>
        <Text
          style={{
            fontSize: 20,
            fontStyle: 'italic',
            color: '#6E6E6E',
            width: width * 0.8,
          }}
        >
          ????????? {`  ${name}`} ???
        </Text>
      </View>
      <View
        style={{
          marginTop: 20,
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontStyle: 'italic',
            color: '#6E6E6E',
            width: width * 0.8,
          }}
        >
          {adminDistrict}
        </Text>
        <MaterialCommunityIcons
          name="map-marker-radius"
          size={30}
          color="#6E6E6E"
          style={{ marginRight: 15 }}
        />
      </View>
      <View
        style={{
          flex: 1,
          marginTop: 45,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Feather name="home" size={40} />
          <Text style={{ marginTop: 5, fontSize: 15, fontWeight: 'bold' }}>
            {type.toUpperCase()}
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MaterialIcons name="card-travel" size={40} />
          <Text style={{ marginTop: 5, fontSize: 15, fontWeight: 'bold' }}>
            PLAN {plan}
          </Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <MaterialCommunityIcons name="shovel" size={40} />
          <Text style={{ marginTop: 5, fontSize: 15, fontWeight: 'bold' }}>
            YEAR {year}
          </Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <FontAwesome
            name={status ? 'calendar-times-o' : 'calendar-check-o'}
            size={40}
            color={status ? 'red' : 'green'}
          />
          <Text style={{ marginTop: 5, fontSize: 15, fontWeight: 'bold' }}>
            Available
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 80,
          flex: 1,
          borderStyle: 'solid',
          borderTopWidth: 1,
          borderTopColor: '#A4A4A4',
          paddingVertical: 30,
          marginHorizontal: 10,
          borderBottomColor: '#A4A4A4',
          borderBottomWidth: 1,
        }}
      >
        <MaterialCommunityIcons
          name="format-quote-open"
          size={20}
          color="#A4A4A4"
        />
        <Text
          style={{
            fontSize: 18,
            marginHorizontal: 15,
            color: '#A4A4A4',
            fontStyle: 'italic',
          }}
        >
          {description}
        </Text>
        <View style={{ alignSelf: 'flex-end' }}>
          <MaterialCommunityIcons
            name="format-quote-close"
            size={20}
            color="#A4A4A4"
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          marginTop: 80,
        }}
      >
        <Text style={{ fontSize: 25, fontWeight: 'bold', marginLeft: 10 }}>
          DETAIL
        </Text>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View
            style={{
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center',
              width: 80,
            }}
          >
            <MaterialIcons name="card-travel" size={34} />
            <Text style={{ fontWeight: 'bold' }}>PLAN {plan}</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', marginLeft: 20 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
              ?????? PLAN??? {plan} PLAN ?????????
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View
            style={{
              marginTop: 15,
              justifyContent: 'center',
              alignItems: 'center',
              width: 80,
            }}
          >
            <MaterialCommunityIcons name="shovel" size={34} />
            <Text style={{ fontWeight: 'bold' }}>YEAR {year}</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', marginLeft: 20 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
              ????????? ???????????? {year}??? ???????????????
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View
            style={{
              marginTop: 15,
              justifyContent: 'center',
              alignItems: 'center',
              width: 80,
            }}
          >
            <MaterialCommunityIcons name="subway-variant" size={34} />
            <Text style={{ fontWeight: 'bold' }}>ACCESS {access}</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              marginLeft: 20,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
              ????????? / ????????? ????????? {access}??? ??????
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View
            style={{
              marginTop: 15,
              justifyContent: 'center',
              alignItems: 'center',
              width: 80,
            }}
          >
            <MaterialCommunityIcons name="calendar-clock" size={34} />
            <Text style={{ fontWeight: 'bold' }}>DAY</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              marginLeft: 20,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
              ?????? ?????? ????????? ????????? {startTime}???{'\n'}?????? ?????? ????????? ?????????{' '}
              {endTime}???
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View
            style={{
              marginTop: 15,
              justifyContent: 'center',
              alignItems: 'center',
              width: 80,
            }}
          >
            <Entypo name="address" size={34} />
            <Text style={{ fontWeight: 'bold' }}>ADDRESS</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              marginLeft: 20,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
              ????????? {adminDistrict}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ flex: 1, marginTop: 80 }}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            marginLeft: 10,
            marginBottom: 15,
          }}
        >
          House Rule
        </Text>
        <View
          style={{
            flex: 1,
            borderStyle: 'solid',
            borderTopWidth: 1,
            borderTopColor: '#A4A4A4',
            borderBottomWidth: 1,
            borderBottomColor: '#A4A4A4',
          }}
        >
          <Text
            style={{ marginLeft: 10, marginVertical: 20, fontStyle: 'italic' }}
          >
            {houseRule}
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 80 }}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            marginLeft: 10,
            marginBottom: 15,
          }}
        >
          AMENITY
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ alignItems: 'center', width: width * 0.24 }}>
            <MaterialCommunityIcons
              name="stairs"
              size={40}
              color={
                isTrueAmenity.includes('secondFloor') ? 'green' : '#A4A4A4'
              }
            />
            <Text
              style={{
                fontWeight: 'bold',
                color: isTrueAmenity.includes('secondFloor')
                  ? 'green'
                  : '#A4A4A4',
                marginTop: 5,
              }}
            >
              Second Floor
            </Text>
          </View>
          <View style={{ alignItems: 'center', width: width * 0.22 }}>
            <MaterialCommunityIcons
              name="parking"
              size={40}
              color={isTrueAmenity.includes('parking') ? 'green' : '#A4A4A4'}
            />
            <Text
              style={{
                fontWeight: 'bold',
                color: isTrueAmenity.includes('parking') ? 'green' : '#A4A4A4',
                marginTop: 5,
              }}
            >
              Parking
            </Text>
          </View>
          <View style={{ alignItems: 'center', width: width * 0.22 }}>
            <MaterialCommunityIcons
              name="air-conditioner"
              size={40}
              color={isTrueAmenity.includes('aircon') ? 'green' : '#A4A4A4'}
            />
            <Text
              style={{
                fontWeight: 'bold',
                color: isTrueAmenity.includes('aircon') ? 'green' : '#A4A4A4',
                marginTop: 5,
              }}
            >
              Air-con
            </Text>
          </View>
          <View style={{ alignItems: 'center', width: width * 0.22 }}>
            <MaterialCommunityIcons
              name="lock-smart"
              size={40}
              color={isTrueAmenity.includes('autoLock') ? 'green' : '#A4A4A4'}
            />
            <Text
              style={{
                fontWeight: 'bold',
                color: isTrueAmenity.includes('autoLock') ? 'green' : '#A4A4A4',
                marginTop: 5,
              }}
            >
              AutoLock
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
          }}
        >
          <View style={{ alignItems: 'center', width: width * 0.24 }}>
            <MaterialCommunityIcons
              name="television-classic"
              size={40}
              color={isTrueAmenity.includes('tv') ? 'green' : '#A4A4A4'}
            />
            <Text
              style={{
                fontWeight: 'bold',
                color: isTrueAmenity.includes('tv') ? 'green' : '#A4A4A4',
                marginTop: 5,
              }}
            >
              TV
            </Text>
          </View>
          <View style={{ alignItems: 'center', width: width * 0.22 }}>
            <MaterialCommunityIcons
              name="bed-empty"
              size={40}
              color={isTrueAmenity.includes('bed') ? 'green' : '#A4A4A4'}
            />
            <Text
              style={{
                fontWeight: 'bold',
                color: isTrueAmenity.includes('bed') ? 'green' : '#A4A4A4',
                marginTop: 5,
              }}
            >
              Bed
            </Text>
          </View>
          <View style={{ alignItems: 'center', width: width * 0.22 }}>
            <MaterialCommunityIcons
              name="washing-machine"
              size={40}
              color={isTrueAmenity.includes('washing') ? 'green' : '#A4A4A4'}
            />
            <Text
              style={{
                fontWeight: 'bold',
                color: isTrueAmenity.includes('washing') ? 'green' : '#A4A4A4',
                marginTop: 5,
              }}
            >
              Washing
            </Text>
          </View>
          <View style={{ alignItems: 'center', width: width * 0.22 }}>
            <MaterialCommunityIcons
              name="paw"
              size={40}
              color={isTrueAmenity.includes('allowPet') ? 'green' : '#A4A4A4'}
            />
            <Text
              style={{
                fontWeight: 'bold',
                color: isTrueAmenity.includes('allowPet') ? 'green' : '#A4A4A4',
                marginTop: 5,
              }}
            >
              Allow Pet
            </Text>
          </View>
        </View>
      </View>
      <View style={{ flex: 1, marginTop: 70 }}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            marginLeft: 10,
            marginBottom: 15,
          }}
        >
          Reviews
        </Text>
        <Text style={{ marginLeft: 10 }}>
          {reviews.length}?????? ????????? ????????????. ?????? ????????? {avgRating}???
          ?????????.
        </Text>
        <Button
          title="?????? ?????? ??????"
          type="clear"
          containerStyle={{ marginTop: 10 }}
          onPress={(): void => {
            props.navigation.navigate(
              isFav === 'f' ? 'FavorReview' : 'ReviewScreen',
              { avgRating, reviews, houseId, isFav },
            );
          }}
        />
      </View>
      <View style={{ flex: 1, marginTop: 40 }}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            marginLeft: 10,
            marginBottom: 15,
          }}
        >
          Forum
        </Text>
        <Text style={{ marginLeft: 10 }}>
          {name} ??????????????? ????????? ???????????? ?????? ???????????????.
        </Text>
        <Button
          title="?????? ??????"
          type="clear"
          containerStyle={{ marginTop: 10 }}
          onPress={(): void => {
            props.navigation.navigate('Room', { hostId: id, myId, myName });
          }}
        />
      </View>
      <View style={{ flex: 1, marginTop: 40 }}>
        <Button
          title="????????????"
          type="clear"
          titleStyle={{ color: 'purple', fontWeight: 'bold', fontSize: 20 }}
          buttonStyle={{
            width: 200,
            alignSelf: 'center',
          }}
          onPress={(): void => {
            axiosInstance
              .post('application', {
                houseId,
              })
              .then((res) => {
                if (res.status === 200) {
                  setVisible(true);
                }
              })
              .catch((err) => {
                if (err.response.status === 403) {
                  setVisibleTwo(true);
                }
              });
          }}
        />
      </View>
      <Overlay
        isVisible={isVisible}
        height={100}
        width={280}
        onBackdropPress={(): void => setVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ alignSelf: 'center', fontSize: 15, marginTop: 10 }}>
            ????????? ?????????????????????.{'\n'}?????? ???, ?????? 1???~3??? ?????? ???????????????.
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
            }}
          >
            <Button
              title="??????"
              onPress={(): void => {
                setVisible(false);
                props.navigation.navigate('Application');
              }}
              type="clear"
            />
          </View>
        </View>
      </Overlay>
      <Overlay
        isVisible={isVisibleTwo}
        height={100}
        width={280}
        onBackdropPress={(): void => setVisibleTwo(false)}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ alignSelf: 'center', fontSize: 15, marginTop: 10 }}>
            ???????????? ????????? ????????? ?????? ?????? ???????????????.
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
            }}
          >
            <Button
              title="??????"
              onPress={(): void => {
                setVisibleTwo(false);
              }}
              type="clear"
            />
          </View>
        </View>
      </Overlay>
    </View>
  );
}

export default withNavigation(HouseDetailContent);
