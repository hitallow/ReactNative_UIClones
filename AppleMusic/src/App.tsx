import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Animated,
  PanResponder,
  Image,
  ScrollView,
  Slider,
  PanResponderInstance,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

const DEFAUL_COLOR = '#fa95ed';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const BAR_MUSIC_HEIGHT = 90;

interface State {
  isScrollViewEnable: boolean;
}

export default class App extends Component<{}, State> {
  private animation!: Animated.ValueXY;
  private panResponder!: PanResponderInstance;
  private scrollOffset: number = 0;

  state: State = {
    isScrollViewEnable: false,
  };

  componentWillMount() {
    this.scrollOffset = 0;

    this.animation = new Animated.ValueXY({
      x: 0,
      y: SCREEN_HEIGHT - BAR_MUSIC_HEIGHT,
    });

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (event, gestureState) => {
        if (
          (this.state.isScrollViewEnable &&
            this.scrollOffset <= 0 &&
            gestureState.dy > 0) ||
          (!this.state.isScrollViewEnable && gestureState.dy < 0)
        ) {
          return true;
        }
        return false;
      },
      onPanResponderGrant: (event, gestureState) => {
        this.animation.extractOffset();
      },
      onPanResponderMove: (event, gestureState) => {
        this.animation.setValue({x: 0, y: gestureState.dy});
      },
      onPanResponderRelease: (event, gestureState) => {
        if (
          gestureState.moveY > SCREEN_HEIGHT - 120 ||
          gestureState.moveY < 120
        ) {
          Animated.spring(this.animation, {
            toValue: 0,
            tension: 1,
          }).start();
        } else if (gestureState.dy < 0) {
          this.setState({isScrollViewEnable: true});
          Animated.spring(this.animation.y, {
            toValue: -SCREEN_HEIGHT + 120,
            tension: 1,
          }).start();
        } else if (gestureState.dy > 0) {
          this.setState({isScrollViewEnable: false});
          Animated.spring(this.animation.y, {
            toValue: SCREEN_HEIGHT - 120,
            tension: 1,
          }).start();
        }
      },
    });
  }

  render(): JSX.Element {
    const animatedHeight = {
      transform: this.animation.getTranslateTransform(),
    };

    const animatedImageDimensions = this.animation.y.interpolate({
      inputRange: [0, SCREEN_HEIGHT],
      outputRange: [200, 32],
      extrapolate: 'clamp',
    });
    const animatedSongTitleOpacity = this.animation.y.interpolate({
      inputRange: [0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT - BAR_MUSIC_HEIGHT],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });
    const animatedSongDetailsOpacity = this.animation.y.interpolate({
      inputRange: [0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT - BAR_MUSIC_HEIGHT],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp',
    });
    const animatedImageMarginLeft = this.animation.y.interpolate({
      inputRange: [0, SCREEN_HEIGHT - BAR_MUSIC_HEIGHT],
      outputRange: [SCREEN_WIDTH / 2 - 100, 10],
      extrapolate: 'clamp',
    });
    const animatedHeaderHeight = this.animation.y.interpolate({
      inputRange: [0, SCREEN_HEIGHT - BAR_MUSIC_HEIGHT],
      outputRange: [SCREEN_HEIGHT / 2, BAR_MUSIC_HEIGHT],
      extrapolate: 'clamp',
    });

    const animatedBackgroundColor = this.animation.y.interpolate({
      inputRange: [0, SCREEN_HEIGHT - BAR_MUSIC_HEIGHT],
      outputRange: [DEFAUL_COLOR, 'white'],
    });

    return (
      <Animated.View
        style={{flex: 1, backgroundColor: animatedBackgroundColor}}>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[
            animatedHeight,
            {
              flex: 1,
              position: 'absolute',
              left: 0,
              right: 0,
              zIndez: 10,
              backgroundColor: 'white',
              height: SCREEN_HEIGHT,
            },
          ]}>
          <ScrollView
            scrollEnabled={this.state.isScrollViewEnable}
            scrollEventThrottle={16}
            onScroll={event => {
              this.scrollOffset = event.nativeEvent.contentOffset.y;
            }}>
            <Animated.View
              style={{
                height: animatedHeaderHeight,
                borderTopWidth: 1,
                borderTopColor: '#ebe5e5',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Animated.View
                  style={{
                    height: animatedImageDimensions,
                    width: animatedImageDimensions,
                    marginLeft: animatedImageMarginLeft,
                  }}>
                  <Image
                    style={{flex: 1, width: undefined, height: undefined}}
                    source={require('./assets/img/Hotelcalifornia.jpg')}
                  />
                </Animated.View>
                <Animated.Text
                  style={{
                    opacity: animatedSongTitleOpacity,
                    fontSize: 18,
                    paddingLeft: 10,
                  }}>
                  Hotel California
                </Animated.Text>
              </View>
              <Animated.View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  opacity: animatedSongTitleOpacity,
                  justifyContent: 'space-around',
                }}>
                <Icon name="md-pause" size={32} />
                <Icon name="md-play" size={32} />
              </Animated.View>
            </Animated.View>
            <Animated.View
              style={{
                height: animatedHeaderHeight,
                opacity: animatedSongDetailsOpacity,
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 22}}>
                  Hotel California (Live){' '}
                </Text>
                <Text style={{color: DEFAUL_COLOR, fontSize: 18}}>
                  Eagles - Hell Freezes Over{' '}
                </Text>
              </View>
              <View
                style={{height: 40, width: SCREEN_WIDTH, alignItems: 'center'}}>
                <Slider
                  maximumTrackTintColor={DEFAUL_COLOR}
                  minimumTrackTintColor={'yellow'}
                  thumbTintColor={DEFAUL_COLOR}
                  style={{width: 300}}
                  step={1}
                  minimumValue={18}
                  maximumValue={71}
                  value={18}
                />
              </View>
              <View
                style={{
                  flex: 2,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <Icon name="md-rewind" size={40} />
                <Icon name="md-pause" size={50} />
                <Icon name="md-fastforward" size={40} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingBottom: 20,
                  paddingHorizontal: 20,
                }}>
                <Icon name="md-add" size={32} color={DEFAUL_COLOR} />
                <Icon name="md-more" size={32} color={DEFAUL_COLOR} />
              </View>
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    );
  }
}
