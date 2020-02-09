import React from 'react';
import { Card, Rating } from 'react-native-elements';
import { Text, View } from 'react-native';

interface Props {
  RecommendOrHouses: string;
  ele: {
    type: string;
    title: string;
    description: string;
    images: Images[];
    avgRating?: number;
  };
}

interface Images {
  filePath: string | undefined;
}

function CardComponent(props: Props): JSX.Element {
  const { RecommendOrHouses, ele } = props;
  // console.log(ele);
  const { type, title, images, avgRating } = ele;
  const { filePath } = images[0];
  return (
    <Card
      image={{
        uri: filePath,
      }}
      containerStyle={{
        height: RecommendOrHouses === 'R' ? 280 : 150,
        width: RecommendOrHouses === 'R' ? 300 : 200,
        marginBottom: 15,
      }}
      imageStyle={{ height: RecommendOrHouses === 'R' ? 200 : 100, width: 200 }}
      imageProps={{
        resizeMode: RecommendOrHouses === 'R' ? undefined : 'cover',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text>{title}</Text>
          <Text>{type}</Text>
        </View>
        {RecommendOrHouses === 'R' ? (
          <View>
            <Text style={{ alignSelf: 'center' }}>Rating</Text>
            <Rating
              readonly
              startingValue={avgRating}
              imageSize={20}
              fractions={2}
            />
            <Text style={{ alignSelf: 'center' }}>{avgRating}</Text>
          </View>
        ) : (
          <View />
        )}
      </View>
    </Card>
  );
}

export default CardComponent;