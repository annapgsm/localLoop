import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, TouchableOpacity, Linking} from 'react-native';
import { GiftedChat, Bubble, SystemMessage, InputToolbar  } from "react-native-gifted-chat";
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActions from './CustomActions';
import MapView, {Marker} from 'react-native-maps';


// This variable is outside the component so it doesn't reset on every re-render (null = currently holding no value)
let unsubMessages = null;

const Chat = ({ route, navigation, db, isConnected, storage }) => {

    const [ messages, setMessages ]= useState([]);

    // Navigation params passed from Start screen 
    const { userID, name, backgroundColor } = route.params; 

    // Ensure readable system message color depending on background
    const textColorByBackground = {
        '#090C08': '#FFFFFF',
        '#474056': '#FFFFFF',
        '#8A95A5': '#000000',
        '#B9C6AE': '#000000',
    };

    const textColor = textColorByBackground[backgroundColor] || '#000000';


    // Saves messages to the phone (AsyncStorage) for offline reading
    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem("messages",JSON.stringify(messagesToCache));    
        } catch (error) {
            console.log(error.message);
        }
    };

    // Load cached messages from AsyncStorage when offline
    const loadCachedMessages= async () => {
        try {
            const cached = await AsyncStorage.getItem("messages");  
            setMessages(cached ? JSON.parse(cached) : []);          
        } catch (error) {
            console.log(error.message);
            setMessages([]);
        }
    };
 
    // Sync with Firestore when online, fallback to cache when offline
    useEffect(()=>{
        navigation.setOptions({title: "LocalLoop"});

        // ONLINE BRANCH: Only subscribe to Firestore if there is a connection
        if (isConnected === true) {

            // prevent multiple listeners        
            if (unsubMessages) unsubMessages();
            unsubMessages = null;

            // Build firestore query
            const q = query(
                collection(db,"messages"),
                orderBy("createdAt","desc"),
            );

            //Start real time subscription 
            unsubMessages = onSnapshot (q, async (snapshot) => {
                let newMessages = [];
                // snapshot.forEach loops over every document returned by the query
                snapshot.forEach(doc => {
                    const data = doc.data();   
                    newMessages.push({
                        _id: doc.id,
                        ...data,              
                        createdAt: data.createdAt?.toDate 
                            ? data.createdAt.toDate()       
                            : new Date(),                   
                    });
                });
                await cacheMessages(newMessages);
                setMessages(newMessages);
            });
        // OFFLINE BRANCH: load locally cached messages instead
        } else {
            loadCachedMessages();
        }

        return ()=> {
            if(unsubMessages) unsubMessages();
        }
    },[isConnected]);

    // Normalize message structure before saving to Firestore
    const onSend = async (newMessages = []) => {
        try {
            const msg = Array.isArray(newMessages) ? newMessages[0] : newMessages;
            const messageToSave = {
                _id: msg._id ?? Math.random().toString(36).slice(2),
                text: msg.text ?? "",
                createdAt: msg.createdAt ?? new Date(),
                user: msg.user ?? { _id: userID, name },
                image: msg.image ?? null,
                location: msg.location ?? null,
            };


            await addDoc(collection(db, "messages"), messageToSave);
        } catch (error) {
            console.log("❌ Firestore addDoc error:", error);
        }
    };

    // If offline hide InputToolbar
    const renderInputToolbar = (props) => {
        if (isConnected === true) {
            return (
                <InputToolbar
                    {...props}
                    containerStyle={{
                        backgroundColor: '#FFFFFF',
                        borderTopWidth: 0,
                    }}
                    primaryStyle={{
                        backgroundColor: '#FFFFFF',
                    }}
                />
            );
        }
        return null;
    };

    // Custom renderer for chat bubbles
    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: "#000"
                },
                left: {
                    backgroundColor: "#FFF"
                }
            }}
        />
    };

    // System message styling (e.g. "User joined")
    const renderSystemMessage = (props) => (
        <SystemMessage
            {...props}
            textStyle={{
            color: textColor,
            }}
        />
    );

    // Pass custom media/location actions into GiftedChat
    const renderCustomActions = (props) => {
        return (
            <CustomActions 
                storage={storage} 
                userID={userID} 
                onSend={onSend}
                {...props} 
            />
        );
    }; 

    // Open coordinates in external Google Maps
    const openInMaps = async (latitude, longitude) => {
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        await Linking.openURL(webUrl);
    };
    
    // Render map preview inside message if it contains location data
    const renderCustomView = (props) => {
        const { currentMessage} = props;
        if (currentMessage.location) {
            const { latitude, longitude } = currentMessage.location;
            return (
                <TouchableOpacity onPress={() => openInMaps(latitude, longitude)}>
                    <MapView
                        style={{
                            width: 150,
                            height: 100,
                            borderRadius: 13,
                            margin: 3
                        }}
                        region={{
                            latitude,
                            longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        pointerEvents="none"
                    >
                        <Marker coordinate={{latitude, longitude}} />
                    </MapView>
                </TouchableOpacity>
            );
        }
        return null;
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
            >
                <GiftedChat
                    messages={messages}
                    renderBubble={renderBubble}
                    renderSystemMessage={renderSystemMessage}
                    renderActions={renderCustomActions}
                    renderCustomView={renderCustomView}
                    onSend={(messages) => onSend(messages)}
                    user={{
                        _id: userID,
                        name : name,
                    }}
                    renderInputToolbar={renderInputToolbar}
                    messagesContainerStyle={{
                        backgroundColor: backgroundColor,
                    }}

                    listViewProps={{
                        style: { backgroundColor: backgroundColor }
                    }}
                    bottomOffset={Platform.OS === "ios" ? 20 : 0}
                />
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    text: {
        fontSize: 18,
    },
});

export default Chat;