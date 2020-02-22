import React, { useState } from 'react';
import {
  View,
  Dimensions,
  Alert,
  Text,
  Picker,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {
  Button,
  Overlay,
  Input,
  CheckBox,
  Slider,
} from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  withNavigation,
  NavigationScreenProp,
  NavigationRoute,
  NavigationParams,
  StackActions,
} from 'react-navigation';

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import cameraHelper from '../../../util/cameraHelper';
import HostingImageComponent from './HostingImageComponent';
import HostingSkeleton from './HostingSkeleton';
import locationHelper from '../../../util/locationHelper';
import axiosInstance from '../../../util/axiosInstance';

interface Props {
  navigation: NavigationScreenProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >;
  editTarget?: Edit;
  hasCamera: string;
  hasCameraRoll: string;
  hasLocation: string;
}

interface Edit {
  id: number;
  plan: string;
  type: string;
  year: number;
  access: number;
  status: boolean;
  display: boolean;
  location: string[];
  adminDistrict: string;
  title: string;
  description: string;
  houseRule: string;
  images: Img[];
  amenity: Amenity;
  startTime: number;
  endTime: number;
}

interface Img {
  fileName: string;
  filePath: string;
  MainImage: boolean;
}

interface Amenity {
  secondFloor: boolean;
  parking: boolean;
  aircon: boolean;
  autoLock: boolean;
  tv: boolean;
  bed: boolean;
  washing: boolean;
  allowPet: boolean;
}

interface Items {
  uri?: string;
  fileName?: string;
  isMain?: boolean;
}

declare global {
  interface FormDataValue {
    uri: string | undefined;
    name: string | undefined;
    type: string;
  }

  interface FormData {
    append(name: string, value: FormDataValue, fileName?: string): void;
  }
}

function HostingImagePicker(props: Props): JSX.Element {
  const { editTarget, hasCamera, hasCameraRoll, hasLocation } = props;

  const editImages: Items[] | (() => Items[]) = [];
  if (editTarget) {
    editTarget.images.forEach((img) => {
      const temp = {
        uri: img.filePath,
        isMain: img.MainImage,
        fileName: img.fileName,
      };
      editImages.push(temp);
    });
  }

  let editMainImg;

  for (let i = 0; i < editImages.length; i += 1) {
    if (editImages[i].isMain) {
      editMainImg = i;
    }
  }

  const { width } = Dimensions.get('window');
  const [isVisible, setVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const [images, setImage] = useState<Items[]>(editTarget ? editImages : [{}]);
  const [mainImg, setMainImg] = useState(editTarget ? editMainImg : undefined);

  const [type, setType] = useState(editTarget ? editTarget.type : undefined);
  const [plan, setPlan] = useState(editTarget ? editTarget.plan : undefined);
  const [year, setYear] = useState(editTarget ? editTarget.year : undefined);
  const [access, setAccess] = useState(
    editTarget ? editTarget.access : undefined,
  );
  const [status] = useState(editTarget ? editTarget.status : false);
  const [display, setDisplay] = useState(
    editTarget ? editTarget.display : true,
  );
  const [location, setLocation] = useState(
    editTarget ? editTarget.location : undefined,
  );
  const [admin, setAdmin] = useState(
    editTarget ? editTarget.adminDistrict : undefined,
  );
  const [title, setTitle] = useState(editTarget ? editTarget.title : undefined);
  const [description, setDesc] = useState(
    editTarget ? editTarget.description : undefined,
  );
  const [houseRule, setHouseRule] = useState(
    editTarget ? editTarget.houseRule : undefined,
  );

  const [secondFloor, setSF] = useState(
    editTarget ? editTarget.amenity.secondFloor : false,
  );
  const [parking, setParking] = useState(
    editTarget ? editTarget.amenity.parking : false,
  );
  const [aircon, setAC] = useState(
    editTarget ? editTarget.amenity.aircon : false,
  );
  const [autoLock, setAL] = useState(
    editTarget ? editTarget.amenity.autoLock : false,
  );
  const [tv, setTv] = useState(editTarget ? editTarget.amenity.tv : false);
  const [bed, setBed] = useState(editTarget ? editTarget.amenity.bed : false);
  const [washing, setWM] = useState(
    editTarget ? editTarget.amenity.washing : false,
  );
  const [allowPet, setAP] = useState(
    editTarget ? editTarget.amenity.allowPet : false,
  );
  const [startTime, setStart] = useState(editTarget ? editTarget.startTime : 7);
  const [endTime, setEnd] = useState(editTarget ? editTarget.endTime : 30);

  const [onPosting, setOnPosting] = useState(false);

  let forAme = false;
  if (
    secondFloor ||
    parking ||
    aircon ||
    autoLock ||
    tv ||
    bed ||
    washing ||
    allowPet
  ) {
    forAme = true;
  } else {
    forAme = false;
  }

  let forSETime;
  if (startTime || endTime) {
    forSETime = true;
  } else {
    forSETime = false;
  }

  return (
    <View
      style={{
        flex: 1,
        marginBottom: 15,
      }}
    >
      <View style={{ flex: 1, marginVertical: 10, marginLeft: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name={
              images[0].uri
                ? 'checkbox-marked-outline'
                : 'checkbox-blank-outline'
            }
            size={20}
            style={{ color: images[0].uri ? 'green' : undefined }}
          />
          <Text
            style={{
              marginLeft: 5,
              fontSize: 20,
              fontWeight: 'bold',
              color: images[0].uri ? 'green' : undefined,
            }}
          >
            이미지 올리기
          </Text>
          <TouchableOpacity
            onPress={(): void => {
              if (!images[0].uri) {
                Alert.alert('업로드 된 이미지가 없습니다');
              } else {
                setMainImg(activeSlide);
                Alert.alert('현재 이미지가 대표 이미지로 설정 되었습니다');
              }
            }}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <MaterialCommunityIcons
              name="lightbulb-on"
              size={34}
              style={{ marginLeft: mainImg !== undefined ? 85 : 50 }}
              color={mainImg !== undefined ? 'purple' : 'black'}
            />
            {mainImg !== undefined ? (
              <Text style={{ marginLeft: 10, color: 'purple' }}>
                {mainImg + 1}번 이미지
              </Text>
            ) : (
              <Text style={{ marginLeft: 10 }}>대표 이미지 설정</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {images[0].uri ? (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={(): void => setVisible(true)}>
            <Carousel
              data={images}
              renderItem={({ item }): JSX.Element => (
                <TouchableOpacity onPress={(): void => setVisible(true)}>
                  <HostingImageComponent
                    img={item.uri}
                    mainimg={activeSlide === mainImg ? 'y' : 'n'}
                  />
                </TouchableOpacity>
              )}
              itemWidth={width}
              sliderWidth={width}
              onSnapToItem={(index): void => setActiveSlide(index)}
              removeClippedSubviews
              inactiveSlideScale={1}
              inactiveSlideOpacity={1}
              activeSlideOffset={10}
            />
            <Pagination
              activeDotIndex={activeSlide}
              dotsLength={images.length}
              dotStyle={{
                width: 30,
                height: 6,
                backgroundColor: '#fff',
              }}
              inactiveDotScale={0.8}
              inactiveDotStyle={{ backgroundColor: '#848484' }}
              containerStyle={{
                flex: 1,
                height: 70,
                marginTop: -65,
                marginBottom: -5,
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={(): void => setVisible(true)}>
          <HostingSkeleton />
        </TouchableOpacity>
      )}

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginTop: 15,
          justifyContent: 'flex-end',
        }}
      >
        <Button
          title="현재 이미지 삭제"
          onPress={(): void => {
            if (!images[0].uri) {
              Alert.alert('삭제할 이미지가 없습니다.');
            } else if (images.length === 1) {
              setImage([{}]);
              setMainImg(undefined);
            } else {
              const deleteImages = images
                .slice(0, activeSlide)
                .concat(images.slice(activeSlide + 1));
              setImage(deleteImages);

              if (activeSlide === mainImg) {
                setMainImg(undefined);
              } else if (mainImg) {
                if (mainImg > activeSlide) setMainImg(mainImg - 1);
              }
            }
          }}
          type="outline"
          buttonStyle={{
            marginRight: 15,
            borderWidth: 1,
            borderColor: 'purple',
          }}
          titleStyle={{ color: 'purple' }}
        />
        <Button
          title="이미지 전체 삭제"
          onPress={(): void => {
            if (!images[0].uri) {
              Alert.alert('삭제할 이미지가 없습니다.');
            } else {
              setImage([{}]);
              setMainImg(undefined);
            }
          }}
          type="outline"
          buttonStyle={{
            marginRight: 15,
            borderWidth: 1,
            borderColor: 'purple',
          }}
          titleStyle={{ color: 'purple' }}
        />
      </View>

      <Overlay
        isVisible={isVisible}
        onBackdropPress={(): void => setVisible(false)}
        height={80}
        width={250}
      >
        {images.length === 7 ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text>사진은 7장까지만 올릴 수 있습니다</Text>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <MaterialIcons
              name="add-a-photo"
              onPress={(): void => {
                if (hasCamera !== 'granted') {
                  Alert.alert('카메라 접근 권한을 설정해주세요');
                } else {
                  cameraHelper.getPhotoByCamera(setImage, images, setVisible);
                }
              }}
              size={30}
            />
            <MaterialIcons
              name="photo-library"
              onPress={(): void => {
                if (hasCameraRoll !== 'granted') {
                  Alert.alert('사진/미디어 접근 권한을 설정해주세요');
                } else {
                  cameraHelper.getPhoto(setImage, images, setVisible);
                }
              }}
              size={30}
            />
          </View>
        )}
      </Overlay>

      <View style={{ flex: 1, marginTop: 30, marginLeft: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name={type ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
            size={20}
            style={{ color: type ? 'green' : undefined }}
          />
          <Text
            style={{
              marginLeft: 5,
              fontSize: 20,
              fontWeight: 'bold',
              color: type ? 'green' : undefined,
            }}
          >
            매물 종류
          </Text>
        </View>
        <Picker
          selectedValue={type}
          onValueChange={(item): void => setType(item)}
          style={{ width: 220 }}
        >
          <Picker.Item label="선택" />
          <Picker.Item label="아파트" value="apart" />
          <Picker.Item label="원룸" value="oneroom" />
          <Picker.Item label="단독주택" value="dandok" />
          <Picker.Item label="빌라" value="villa" />
          <Picker.Item label="오피스텔" value="officetel" />
        </Picker>
      </View>

      <View style={{ flex: 1, marginTop: 30, marginLeft: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name={plan ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
            size={20}
            style={{ color: plan ? 'green' : undefined }}
          />
          <Text
            style={{
              marginLeft: 5,
              fontSize: 20,
              fontWeight: 'bold',
              color: plan ? 'green' : undefined,
            }}
          >
            PLAN
          </Text>
        </View>
        <Picker
          selectedValue={plan}
          onValueChange={(item): void => setPlan(item)}
          style={{ width: 220 }}
        >
          <Picker.Item label="선택" />
          <Picker.Item label="30" value="30" />
          <Picker.Item label="50" value="50" />
          <Picker.Item label="70" value="70" />
          <Picker.Item label="100" value="100" />
          <Picker.Item label="150" value="150" />
        </Picker>
      </View>

      <View style={{ flex: 1, marginTop: 30, marginLeft: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name={year ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
            size={20}
            style={{ color: year ? 'green' : undefined }}
          />
          <Text
            style={{
              marginLeft: 5,
              fontSize: 20,
              fontWeight: 'bold',
              color: year ? 'green' : undefined,
            }}
          >
            건물 연식
          </Text>
        </View>
        <Picker
          selectedValue={year}
          onValueChange={(item): void => setYear(item)}
          style={{ width: 220 }}
        >
          <Picker.Item label="선택" />
          <Picker.Item label="1년 이하" value={1} />
          <Picker.Item label="5년 이하" value={5} />
          <Picker.Item label="10년 이하" value={10} />
          <Picker.Item label="20년 이하" value={20} />
          <Picker.Item label="30년 이하" value={30} />
        </Picker>
      </View>

      <View style={{ flex: 1, marginTop: 30, marginLeft: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name={access ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
            size={20}
            style={{ color: access ? 'green' : undefined }}
          />
          <Text
            style={{
              marginLeft: 5,
              fontSize: 20,
              fontWeight: 'bold',
              color: access ? 'green' : undefined,
            }}
          >
            주변 지하철/역까지 걸리는 시간
          </Text>
        </View>
        <Picker
          selectedValue={access}
          onValueChange={(item): void => setAccess(item)}
          style={{ width: 220 }}
        >
          <Picker.Item label="선택" />
          <Picker.Item label="5분 이내" value={5} />
          <Picker.Item label="10분 이내" value={10} />
          <Picker.Item label="20분 이내" value={20} />
          <Picker.Item label="30분 이내" value={30} />
          <Picker.Item label="60분 이내" value={60} />
        </Picker>
      </View>

      <View style={{ flex: 1, marginTop: 30, marginLeft: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name={
              location ? 'checkbox-marked-outline' : 'checkbox-blank-outline'
            }
            size={20}
            style={{ color: location ? 'green' : undefined }}
          />
          <Text
            style={{
              marginLeft: 5,
              fontSize: 20,
              fontWeight: 'bold',
              color: location ? 'green' : undefined,
            }}
          >
            주소
          </Text>
        </View>
        <View
          style={{
            marginTop: 10,
            marginRight: 15,
          }}
        >
          <Input
            placeholder={`주소 입력 후 주소를 추가해주세요${'\n'}${'\n'}예시 : 서울특별시 용산구 용산2가동 남산공원길 105`}
            multiline
            textAlignVertical="top"
            value={admin}
            onChangeText={(text): void => setAdmin(text)}
          />
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 15,
            }}
          >
            <MaterialCommunityIcons
              name="map-marker-plus"
              size={36}
              style={{ marginRight: 15 }}
              onPress={(): void => {
                if (hasLocation !== 'granted') {
                  Alert.alert('위치 접근 권한을 설정해주세요');
                } else if (admin === undefined) {
                  Alert.alert('주소를 입력해야합니다');
                } else {
                  locationHelper.getLocationFromAddress(setLocation, admin);
                }
              }}
            />
            <MaterialCommunityIcons
              name="map-marker-minus"
              size={36}
              onPress={(): void => {
                if (admin === undefined) {
                  Alert.alert('입력된 주소가 없습니다');
                } else {
                  setLocation(undefined);
                  setAdmin(undefined);
                }
              }}
            />
          </View>
        </View>
      </View>

      <View style={{ flex: 1, marginTop: 30, marginLeft: 15, marginRight: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name={title ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
            size={20}
            style={{ color: title ? 'green' : undefined }}
          />
          <Text
            style={{
              marginLeft: 5,
              fontSize: 20,
              fontWeight: 'bold',
              color: title ? 'green' : undefined,
            }}
          >
            제목
          </Text>
        </View>
        <Input
          placeholder="제목을 입력하세요"
          value={title}
          multiline
          textAlignVertical="top"
          onChangeText={(text): void => setTitle(text)}
          inputContainerStyle={{ marginTop: 5 }}
        />
      </View>

      <View style={{ flex: 1, marginTop: 30, marginLeft: 15, marginRight: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name={
              description ? 'checkbox-marked-outline' : 'checkbox-blank-outline'
            }
            size={20}
            style={{ color: description ? 'green' : undefined }}
          />
          <Text
            style={{
              marginLeft: 5,
              fontSize: 20,
              fontWeight: 'bold',
              color: description ? 'green' : undefined,
            }}
          >
            Description
          </Text>
        </View>
        <Input
          placeholder="어떤 집인가요?"
          multiline
          value={description}
          textAlignVertical="top"
          onChangeText={(text): void => setDesc(text)}
          inputContainerStyle={{ marginTop: 5 }}
        />
      </View>

      <View style={{ flex: 1, marginTop: 30, marginLeft: 15, marginRight: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name={
              houseRule ? 'checkbox-marked-outline' : 'checkbox-blank-outline'
            }
            size={20}
            style={{ color: houseRule ? 'green' : undefined }}
          />
          <Text
            style={{
              marginLeft: 5,
              fontSize: 20,
              fontWeight: 'bold',
              color: houseRule ? 'green' : undefined,
            }}
          >
            HouseRule
          </Text>
        </View>
        <Input
          placeholder="지켜야할 규칙을 적어주세요"
          multiline
          value={houseRule}
          textAlignVertical="top"
          onChangeText={(text): void => setHouseRule(text)}
          inputContainerStyle={{ marginTop: 5 }}
        />
      </View>

      <View style={{ flex: 1, marginTop: 30, marginLeft: 15, marginRight: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name={forAme ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
            size={20}
            style={{ color: forAme ? 'green' : undefined }}
          />
          <Text
            style={{
              marginLeft: 5,
              fontSize: 20,
              fontWeight: 'bold',
              color: forAme ? 'green' : undefined,
            }}
          >
            Amenity
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: 10,
          }}
        >
          <CheckBox
            checked={secondFloor}
            title="Second floor"
            onPress={(): void => (secondFloor ? setSF(false) : setSF(true))}
            containerStyle={{ backgroundColor: '#fff', width: 140 }}
            checkedColor="green"
          />
          <CheckBox
            checked={parking}
            title="Parking"
            onPress={(): void =>
              parking ? setParking(false) : setParking(true)
            }
            containerStyle={{ backgroundColor: '#fff', width: 140 }}
            checkedColor="green"
          />
        </View>
        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
          <CheckBox
            checked={aircon}
            title="Air-Con"
            onPress={(): void => (aircon ? setAC(false) : setAC(true))}
            containerStyle={{ backgroundColor: '#fff', width: 140 }}
            checkedColor="green"
          />
          <CheckBox
            checked={autoLock}
            title="Auto-Lock"
            onPress={(): void => (autoLock ? setAL(false) : setAL(true))}
            containerStyle={{ backgroundColor: '#fff', width: 140 }}
            checkedColor="green"
          />
        </View>
        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
          <CheckBox
            checked={tv}
            title="TV"
            onPress={(): void => (tv ? setTv(false) : setTv(true))}
            containerStyle={{ backgroundColor: '#fff', width: 140 }}
            checkedColor="green"
          />
          <CheckBox
            checked={bed}
            title="Bed"
            onPress={(): void => (bed ? setBed(false) : setBed(true))}
            containerStyle={{ backgroundColor: '#fff', width: 140 }}
            checkedColor="green"
          />
        </View>
        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
          <CheckBox
            checked={washing}
            title="washer"
            onPress={(): void => (washing ? setWM(false) : setWM(true))}
            containerStyle={{ backgroundColor: '#fff', width: 140 }}
            checkedColor="green"
          />
          <CheckBox
            checked={allowPet}
            title="Allow-Pet"
            onPress={(): void => (allowPet ? setAP(false) : setAP(true))}
            containerStyle={{ backgroundColor: '#fff', width: 140 }}
            checkedColor="green"
          />
        </View>
      </View>

      <View style={{ flex: 1, marginTop: 30, marginLeft: 15, marginRight: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name={
              forSETime ? 'checkbox-marked-outline' : 'checkbox-blank-outline'
            }
            size={20}
            style={{ color: forSETime ? 'green' : undefined }}
          />
          <Text
            style={{
              marginLeft: 5,
              fontSize: 20,
              fontWeight: 'bold',
              color: forSETime ? 'green' : undefined,
            }}
          >
            최소 / 최대 거주기간
          </Text>
        </View>
        <View>
          <View>
            <Text
              style={{ marginVertical: 10, marginLeft: 15, fontWeight: 'bold' }}
            >
              최소 거주기간 : {startTime}일
            </Text>
            <Slider
              minimumValue={7}
              maximumValue={30}
              step={1}
              value={startTime}
              onValueChange={(value): void => setStart(value)}
              thumbTintColor="black"
              style={{ marginHorizontal: 15 }}
              thumbTouchSize={{ width: 60, height: 60 }}
            />
          </View>
          <View>
            <Text
              style={{ marginVertical: 10, marginLeft: 15, fontWeight: 'bold' }}
            >
              최대 거주기간 : {endTime}일 (약 {Math.round(endTime / 7)} 주)
            </Text>
            <Slider
              minimumValue={30}
              maximumValue={365}
              step={7}
              value={endTime}
              onValueChange={(value): void => setEnd(value)}
              thumbTintColor="black"
              style={{ marginHorizontal: 15 }}
              thumbTouchSize={{ width: 60, height: 60 }}
            />
          </View>
        </View>
      </View>

      <View style={{ flex: 1, marginTop: 30, marginLeft: 15, marginRight: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons
            name="checkbox-marked-outline"
            size={20}
            style={{ color: 'green' }}
          />
          <Text
            style={{
              marginLeft: 5,
              fontSize: 20,
              fontWeight: 'bold',
              color: 'green',
            }}
          >
            공개 여부
          </Text>
        </View>
        <View>
          <CheckBox
            title="공개 / 비공개"
            checked={display}
            onPress={(): void => {
              if (display) {
                setDisplay(false);
              } else {
                setDisplay(true);
              }
            }}
            containerStyle={{ backgroundColor: '#fff' }}
            checkedColor="green"
          />
        </View>
      </View>

      <View style={{ flex: 1, alignItems: 'center', marginTop: 15 }}>
        <Button
          title={editTarget ? '호스팅 수정' : '호스팅 하기'}
          type="outline"
          buttonStyle={{ borderColor: 'purple', borderWidth: 1 }}
          titleStyle={{ color: 'purple' }}
          onPress={(): void => {
            if (
              !images[0].uri ||
              !type ||
              !plan ||
              !year ||
              !access ||
              !location ||
              !admin ||
              !title ||
              !description ||
              !houseRule ||
              !forAme
            ) {
              Alert.alert('빠진 항목이 있는 지 확인해 주세요');
            } else {
              setOnPosting(true);
              const formData = new FormData();
              formData.append('plan', plan); // 스트링
              formData.append('type', type); // 스트링
              formData.append('year', JSON.stringify(year)); // 넘버
              formData.append('access', JSON.stringify(access)); // 넘버
              formData.append('status', JSON.stringify(status)); // 불린
              formData.append('display', JSON.stringify(display)); // 불린
              formData.append('location', JSON.stringify(location)); // 배열
              formData.append('adminDistrict', admin); // 스트링
              formData.append('title', title); // 스트링
              formData.append('description', description); // 스트링
              formData.append('houseRule', houseRule); // 스트링
              formData.append('secondFloor', JSON.stringify(secondFloor)); // 불린
              formData.append('parking', JSON.stringify(parking)); // 불린
              formData.append('aircon', JSON.stringify(aircon)); // 불린
              formData.append('autoLock', JSON.stringify(autoLock)); // 불린
              formData.append('tv', JSON.stringify(tv)); // 불린
              formData.append('bed', JSON.stringify(bed)); // 불린
              formData.append('washing', JSON.stringify(washing)); // 불린
              formData.append('allowPet', JSON.stringify(allowPet)); // 불린
              formData.append('startTime', JSON.stringify(startTime)); // 넘버
              formData.append('endTime', JSON.stringify(endTime)); // 넘버

              images.forEach((img, index) => {
                const imgUri = img.uri ? img.uri : '';
                const modUri =
                  Platform.OS === 'android'
                    ? imgUri
                    : imgUri.replace('file://', '');
                const temp: FormDataValue = {
                  name:
                    index === mainImg ? 'mainImg.jpg' : imgUri.split('/').pop(),
                  type: `image/${imgUri.slice(imgUri.lastIndexOf('.') + 1)}`,
                  uri: modUri,
                };
                formData.append('images', temp);
              });

              if (!editTarget) {
                axiosInstance
                  .post('houses', formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  })
                  .then((res) => {
                    setOnPosting(false);
                    Alert.alert('포스팅이 완료되었습니다!');
                    const popAction = StackActions.pop({
                      n: 1,
                    });
                    props.navigation.dispatch(popAction);
                    props.navigation.navigate('HouseDetail', {
                      houseId: res.data.houseId,
                    });
                  })
                  .catch((err) => console.log(err));
              } else {
                axiosInstance
                  .put(`houses/${editTarget.id}`, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  })
                  .then((res) => {
                    setOnPosting(false);
                    Alert.alert('포스팅이 수정되었습니다!');
                    const popAction = StackActions.pop({
                      n: 1,
                    });
                    props.navigation.dispatch(popAction);
                    props.navigation.navigate('HouseDetail', {
                      houseId: res.data.houseId,
                    });
                  })
                  .catch((err) => console.log(err));
              }
            }
          }}
        />
      </View>
      <Overlay isVisible={onPosting} height={100}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ marginBottom: 20 }}>
            호스팅 중입니다 잠시만 기다려 주세요
          </Text>
          <ActivityIndicator />
        </View>
      </Overlay>
    </View>
  );
}

export default React.memo(withNavigation(HostingImagePicker));
