import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
    const actionSheet = useActionSheet();

    // const newUploadRef = ref(storage, 'image123');

    const onActionPress = () => {

        const options = ['Choose from Library','Take Picture','Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0: 
                        pickImage();
                        return;
                    case 1: 
                        takePhoto();
                        return;
                    case 2:
                        getLocation();
                        return;
                    default:
                        return;
                }
            },
        );
    };

    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        return `${userID}-${timeStamp}-${imageName}`;
    }

    const uploadAndSendImage = async (imageURI) => {
        const uniqueRefString = generateReference(imageURI);
        const newUploadRef = ref(storage, uniqueRefString);
        const response = await fetch(imageURI);
        const blob = await response.blob();
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
            const imageURL = await getDownloadURL(snapshot.ref)
            onSend({ image: imageURL })
        });
    }

    const pickImage = async () => {
        try {
            const permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissions?.granted) {
            Alert.alert("No access to Photos");
            return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:  ['images'], 
            quality: 0.7,
            });

            if (result.canceled) return;

            const uri = result.assets?.[0]?.uri;
            if (!uri) return;

            await uploadAndSendImage(uri);

        } catch (err) {
            console.log(err);
        }
    };


    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();
            if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions haven't been granted.");
        } 
    }
    /* 
    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();
        if (permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
            if (location) {
                onSend({
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                });
            } else Alert.alert("Error occurred while fetching location");
        } else Alert.alert("Permissions haven't been granted.");
    }
    */
    const getLocation = async () => {
        try {
            const permissions = await Location.requestForegroundPermissionsAsync();
            if (!permissions?.granted) return Alert.alert("Location permission not granted");

            const location = await Location.getCurrentPositionAsync({});
            if (!location) return Alert.alert("No location returned");

            onSend({
            location: {
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
            },
            });
        } catch (e) {
            Alert.alert("Location error", String(e));
        }
    };



    return (
        <TouchableOpacity style={styles.container} onPress={onActionPress}>
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        marginLeft: 6,
        marginRight:6,
        marginBottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },

    wrapper: {
        width: 30,
        height: 30,
        borderRadius: 16,
        borderColor: '#757083',
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    iconText: {
        color: '#757083',
        fontWeight: '300',
        fontSize: 30,
        lineHeight: 30,
        marginTop: -2,
    },
});

export default CustomActions; 

