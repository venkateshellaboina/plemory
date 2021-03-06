import React, { Component, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Button,
  TouchableHighlight,
  Image,
} from "react-native";
import data from "../assets/data/memories";
import MemoryContext from "./contexts/MemoryContext";
// const RNFS = require('react-native-fs');
import * as FileSystem from "expo-file-system";
import ViroImageScreen from "./ViroImageScreen";

class LandingScreen extends Component {
  constructor(props) {
    super(props);
    // console.log(this.context)
    this.state = {
      memories: data,
    };
    this.willFocusSubscription = this.props.navigation.addListener(
      "focus",
      () => {
        console.log("Will Focus");
        this.fetchData(this.state.memories);
      }
    );
  }

  updateMemory = async (id, action) => {
    let memories = this.state.memories;
    for (let i = 0; i < memories.length; i++) {
      if (memories[i].id == id) {
        if(action == "throw"){
          memories[i].popularity[0] += Math.floor(0.3 * (100 - memories[i].popularity[0]))
        }
        else{
            memories[i].popularity[0] += Math.floor(0.1 * (100 - memories[i].popularity[0]))
        }
      }
    }
    this.setState({
      memories,
    });
    let fileUri = FileSystem.documentDirectory + "memories.json";
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(memories), {
      encoding: FileSystem.EncodingType.UTF8,
    });
    console.log(fileUri);
    // console.log(memories)
    // fs.writeFile('../assets/data/memories".json', JSON.stringify(memories), (err) => {
    //     if (err) console.log('Error writing file:', err);
    // })
    // await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'memories.json', JSON.stringify(memories), { encoding: FileSystem.EncodingType.UTF8 });
    // , () =>{
    //     this.setState({
    //         memories: memories
    //     })
    // });
    // RNFS.writeFile('../assets/data/memories".json', JSON.stringify(memories), 'utf8')
    // .then((success) => {
    //     console.log('FILE WRITTEN!');
    //     this.setState({
    //         memories: memories
    //     })
    // })
    // .catch((err) => {
    //     console.log(err.message);
    // });
  };

  fetchData = async (cur_memories) => {
    let fileUri = FileSystem.documentDirectory + "memories.json";
    let content = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    // console.log(content)
    // data = data.map(d => d.image = require(d.imageUrl))
    this.setState({ memories: JSON.parse(content) });
    // console.log(this.state.memories)
  };

  componentDidMount() {
    this.fetchData(data);
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.arview}>
          <RenderScene />
        </View>
        <View style={styles.map}>
          <TouchableHighlight
            underlayColor="none"
            onPress={() =>
              this.props.navigation.navigate("Map View", {
                memories: this.state.memories,
                updateMemory: this.updateMemory,
              })
            }
          >
            <View>
              {/* <FontAwesome5 name="map-marked-alt" size={54} color="black" /> */}
              <Image
                source={require("../assets/map.png")}
                fadeDuration={5}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 10,
                  borderColor: "black",
                  borderWidth: 1,
                  marginLeft: 20
                }}
              />
              {/* <Ionicons name="md-checkmark-circle" size={32} color="green" /> */}
              {/* <Text>Map View</Text> */}
            </View>
          </TouchableHighlight>
          {/* <Button title="Map View" onPress={() => this.props.navigation.navigate("Map View", {memories: this.state.memories, updateMemory: this.updateMemory}) } /> */}
        </View>
      </SafeAreaView>
    );
  }
}

const viro_tests = [
  // "Viro360Image",
  // "ViroButton",
  // TODO: Need VR camera to test this
  "ViroImage",
  // "ViroSkyBox",
  // TODO: Didn't see anything, but didn't crash. Might need VR to test this.
  // "ViroSpotLight",
  // "ViroText",
  // TODO: Crash with Unrecognized selector sent to instance
  // "ViroVideo",
];

const RenderScene = () => {
  // case "ViroImage":
  return <ViroImageScreen />;

  // case "ViroSkyBox":
  //   return <ViroSkyBox />;
  // case "ViroSound":
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arview: {
    flex: 7,
  },
  map: {
    flex: 1,
    // backgroundColor: "transparent",
  },
});

LandingScreen.contextType = MemoryContext;

export default LandingScreen;
