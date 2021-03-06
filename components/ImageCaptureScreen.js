import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import data from "../assets/data/memories";
import * as FileSystem from "expo-file-system";

// var cloudinary = require('cloudinary').v2;
// cloudinary.config({
//   cloud_name: 'dljgmfj95',
//   api_key: '467489591245219',
//   api_secret: '8h0hDjpDDt2wyhgTPr_gJJCusXY'
// });

class ImageCaptureScreen extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.route.params.uri);
    this.uri = this.props.route.params.uri;
    this.base64 = this.props.route.params.base64;
    this.location = this.props.route.params.location;

    this.state = {
      title: "",
      uploaded: false,
      isLoading: false,
    };
  }
  onChangeTitle = (text) => {
    this.setState({
      title: text,
    });
  };
  upload = async () => {
    let CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dljgmfj95/upload";
    let base64Img = `data:image/jpg;base64,${this.base64}`;
    let data = {
      file: base64Img,
      upload_preset: "wegfpc3e",
      quality: "eco"
    };
    this.setState({
      isLoading: true,
    });
    fetch(CLOUDINARY_URL, {
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    })
      .then(async (r) => {
        let data = await r.json();
        this.setState({
          uploaded: true,
          isLoading: false,
        });
        let fileUri = FileSystem.documentDirectory + "memories.json";
        let content = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        let memories = JSON.parse(content);

        let memory = {
          id: memories[memories.length - 1].id + 1,
          image: data.url,
          latitude: this.location.coords.latitude,
          longitude: this.location.coords.longitude,
          name: this.state.title,
          popularity: [
            50,
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
          ],
          location: "Virginia Tech",
          ARpopularity: [
            [-Math.floor(Math.random() * 4), Math.random(), -2],
            [-4, 0.25, -2],
            [-4, 0.8, -2],
            [-4, 0.3, -2],
            [-4, 0.6, -2],
            [-4, 1, -2],
          ],
          ARsize: 0.3,
          ARrotation: [0, 10, 0],
          related: [],
        };
        memories.push(memory);

        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(memories), {
          encoding: FileSystem.EncodingType.UTF8,
        });
        console.log(data.url);
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
        });
        console.log(err);
      });
    // cloudinary.uploader.upload(this.uri, { tags: this.state.title }, function (err, image) {
    //     console.log();
    //     console.log("** File Upload");
    //     if (err) { console.warn(err); }
    //     console.log("* public_id for the uploaded image is generated by Cloudinary's service.");
    //     console.log("* " + image.public_id);
    //     console.log("* " + image.url);
    //     // waitForAllUploads("pizza", err, image);
    //   });
  };
  render() {
    return (
      <View>
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator
            animating={this.state.isLoading}
            size="large"
            color="#00ff00"
          />
        </View>
        {this.state && this.state.uploaded ? (
          <View>
            <Text style={{ color: "green", fontSize: 12, textAlign: "center" }}>
              Memory has been uploaded Successfully
            </Text>
          </View>
        ) : (
          <View>
            <View>
              <Image style={styles.imageStyling} source={{ uri: this.uri }} />
            </View>
            <View style={styles.textStyling}>
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.onChangeTitle(text)}
                value={this.state.title}
                placeholder="Please enter a title of Maximum 32 letters"
                maxLength={32}
                name="title"
              />
              <View style={{backgroundColor: '#00aeef',
              //   borderColor: 'red',
                borderWidth: 2,
                borderRadius: 20,
                width: "50%",
                left: "25%" }}>
                    <Button name="Upload" title="Upload" onPress={this.upload} color="white" />
                </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageStyling: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "white",
    // width: 100
  },
  textStyling: {
    position: "absolute",
    top: 0.01 * Dimensions.get("window").height,
    width: "100%",
    // bottom: "50%"
  },
  container: {
    // position: "absolute",
    // top: 0.5 * Dimensions.get("window").height,
    flex: 1,
    justifyContent: "center",
    // position: "absolute",
    // top:
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default ImageCaptureScreen;
